import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteDocument, N8nRagError } from "@/lib/n8n-rag";
import { documents } from "@/lib/schema";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await db
    .select({ id: documents.id })
    .from(documents)
    .where(and(eq(documents.id, id), eq(documents.userId, session.user.id)));

  if (!existing.length) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await deleteDocument({ documentId: id, userId: session.user.id });
  } catch (err) {
    const status = err instanceof N8nRagError ? err.status : 502;
    return Response.json(
      { error: "RAG service could not delete the document" },
      { status }
    );
  }

  await db
    .delete(documents)
    .where(and(eq(documents.id, id), eq(documents.userId, session.user.id)));

  return new Response(null, { status: 204 });
}