import { headers } from "next/headers";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chunkText } from "@/lib/rag";
import { chunks, documents } from "@/lib/schema";

const textSourceSchema = z.object({
  type: z.literal("text"),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(200_000),
});

const urlSourceSchema = z.object({
  type: z.literal("url"),
  url: z.url().refine((u) => u.startsWith("https://"), {
    message: "URL must be https",
  }),
});

const createSourceSchema = z.discriminatedUnion("type", [
  textSourceSchema,
  urlSourceSchema,
]);

const MAX_DOCUMENTS = 200;

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchUrlText(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; RAGApp/1.0)" },
      redirect: "follow",
    });
    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      throw new Error(`Unsupported content type: ${contentType}`);
    }
    const raw = await res.text();
    return contentType.includes("text/plain") ? raw.replace(/\s+/g, " ").trim() : stripHtml(raw);
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: documents.id,
      title: documents.title,
      type: documents.type,
      url: documents.url,
      status: documents.status,
      error: documents.error,
      createdAt: documents.createdAt,
      updatedAt: documents.updatedAt,
      chunkCount: count(chunks.id),
    })
    .from(documents)
    .leftJoin(chunks, eq(chunks.documentId, documents.id))
    .where(eq(documents.userId, session.user.id))
    .groupBy(documents.id)
    .orderBy(documents.createdAt);

  return Response.json(rows);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSourceSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const docCount = await db
    .select({ value: count() })
    .from(documents)
    .where(eq(documents.userId, session.user.id));

  if ((docCount[0]?.value ?? 0) >= MAX_DOCUMENTS) {
    return Response.json({ error: "Source limit reached" }, { status: 400 });
  }

  const input = parsed.data;
  let content: string | null = null;
  let status: "ready" | "failed" = "ready";
  let errorMessage: string | null = null;

  if (input.type === "text") {
    content = input.content.trim();
  } else {
    try {
      const extracted = await fetchUrlText(input.url);
      if (extracted.length < 200) {
        throw new Error("Extracted less than 200 characters of text");
      }
      content = extracted;
    } catch (err) {
      status = "failed";
      errorMessage = err instanceof Error ? err.message : "Failed to fetch URL";
    }
  }

  const id = crypto.randomUUID();
  const title = input.type === "text" ? input.title : new URL(input.url).hostname;
  const url = input.type === "url" ? input.url : null;

  const pieces = status === "ready" && content ? chunkText(content) : [];

  await db.transaction(async (tx) => {
    await tx.insert(documents).values({
      id,
      userId: session.user.id,
      title,
      type: input.type,
      url,
      status: pieces.length ? status : status === "ready" ? "failed" : status,
      content: content ?? "",
      error: errorMessage ?? (status === "ready" && !pieces.length ? "No content extracted" : null),
    });
    if (pieces.length) {
      await tx.insert(chunks).values(
        pieces.map((c, i) => ({
          id: crypto.randomUUID(),
          userId: session.user.id,
          documentId: id,
          content: c,
          position: i,
        }))
      );
    }
  });

  return Response.json(
    { id, title, type: input.type, url, status, error: errorMessage },
    { status: 201 }
  );
}
