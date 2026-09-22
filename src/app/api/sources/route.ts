import { headers } from "next/headers";
import { count, desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { validateUpload } from "@/lib/document-upload";
import {
  getIngestionStatus,
  ingestDocument,
  N8nRagError,
} from "@/lib/n8n-rag";
import { documents } from "@/lib/schema";

const MAX_DOCUMENTS = 200;

type DocumentDto = {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  status: "processing" | "ready" | "failed";
  n8nTrackId: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
  processedAt: string | null;
};

function toDocumentDto(row: typeof documents.$inferSelect): DocumentDto {
  return {
    id: row.id,
    filename: row.filename,
    mimeType: row.mimeType,
    size: row.size,
    status: row.status as DocumentDto["status"],
    n8nTrackId: row.n8nTrackId,
    error: row.error,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    processedAt: row.processedAt ? row.processedAt.toISOString() : null,
  };
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(documents)
    .where(eq(documents.userId, session.user.id))
    .orderBy(desc(documents.createdAt));

  const processing = rows.filter((r) => r.status === "processing");
  if (processing.length > 0) {
    const updates: Promise<void>[] = [];
    for (const doc of processing) {
      updates.push(
        (async () => {
          try {
            const status = await getIngestionStatus({
              documentId: doc.id,
              userId: session.user.id,
            });
            await db
              .update(documents)
              .set({
                status: status.status,
                n8nTrackId: status.trackId ?? doc.n8nTrackId,
                error:
                  status.status === "failed"
                    ? (status.error ?? "RAG ingestion failed")
                    : null,
                processedAt:
                  status.status === "ready" || status.status === "failed"
                    ? new Date()
                    : null,
              })
              .where(eq(documents.id, doc.id));
          } catch {
            // Leave the row as-is if the status check fails; the next poll retries.
          }
        })()
      );
    }
    await Promise.all(updates);
  }

  const refreshed = await db
    .select()
    .from(documents)
    .where(eq(documents.userId, session.user.id))
    .orderBy(desc(documents.createdAt));

  return Response.json(refreshed.map(toDocumentDto));
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Missing file" }, { status: 400 });
  }

  const validation = await validateUpload(file);
  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const docCount = await db
    .select({ value: count() })
    .from(documents)
    .where(eq(documents.userId, session.user.id));

  if ((docCount[0]?.value ?? 0) >= MAX_DOCUMENTS) {
    return Response.json({ error: "Source limit reached" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const createdAt = new Date();

  await db.insert(documents).values({
    id,
    userId: session.user.id,
    filename: validation.file.filename,
    mimeType: validation.file.mimeType,
    size: validation.file.size,
    status: "processing",
    createdAt,
  });

  try {
    const result = await ingestDocument(
      {
        documentId: id,
        userId: session.user.id,
        filename: validation.file.filename,
        mimeType: validation.file.mimeType,
      },
      {
        buffer: validation.file.buffer,
        filename: validation.file.filename,
        mimeType: validation.file.mimeType,
      }
    );
    if (result.trackId) {
      await db
        .update(documents)
        .set({ n8nTrackId: result.trackId })
        .where(eq(documents.id, id));
    }
  } catch (err) {
    const status = err instanceof N8nRagError ? err.status : 502;
    await db
      .update(documents)
      .set({ status: "failed", error: "RAG service rejected the upload", processedAt: new Date() })
      .where(eq(documents.id, id));
    return Response.json({ error: "RAG service rejected the upload" }, { status });
  }

  const row = (await db.select().from(documents).where(eq(documents.id, id)))[0];
  return Response.json(toDocumentDto(row!), { status: 201 });
}