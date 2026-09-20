// ponytail: keyword (tsvector) retrieval, swap to pgvector embeddings when semantic recall matters
import { sql } from "drizzle-orm";
import { db } from "./db";

const CHUNK_SIZE = 800;

export function chunkText(content: string): string[] {
  const text = content.trim();
  if (!text) return [];

  // Split on paragraph boundaries first, then sentence-fallback for oversize blocks.
  const paragraphs = text.split(/\n{2,}/);
  const chunks: string[] = [];
  let current = "";

  const push = () => {
    const trimmed = current.trim();
    if (trimmed) chunks.push(trimmed);
    current = "";
  };

  const appendPiece = (piece: string) => {
    if (!current) {
      current = piece;
    } else if (current.length + piece.length + 1 <= CHUNK_SIZE) {
      current += " " + piece;
    } else {
      push();
      current = piece;
    }
  };

  for (const paragraph of paragraphs) {
    const p = paragraph.trim();
    if (!p) continue;
    if (p.length > CHUNK_SIZE) {
      const sentences = p.match(/[^.!?]+[.!?]*\s*/g) ?? [p];
      for (const s of sentences) appendPiece(s.trim());
    } else {
      appendPiece(p);
    }
    if (current.length >= CHUNK_SIZE) push();
  }
  push();

  // Hard-cap any pathological single sentence.
  return chunks.map((c) => (c.length > CHUNK_SIZE * 2 ? c.slice(0, CHUNK_SIZE * 2) : c));
}

export interface RetrievedChunk {
  documentId: string;
  documentTitle: string;
  documentType: string;
  documentUrl: string | null;
  content: string;
}

export async function retrieveChunks(
  userId: string,
  query: string,
  { limit = 5 }: { limit?: number } = {}
): Promise<RetrievedChunk[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const rows = (await db.execute(sql`
      SELECT c.document_id, d.title AS document_title, d.type AS document_type,
             d.url AS document_url, c.content
      FROM chunks c
      JOIN documents d ON d.id = c.document_id
      WHERE c.user_id = ${userId}
        AND c.search_vector @@ websearch_to_tsquery('english', ${trimmed})
      ORDER BY ts_rank(c.search_vector, websearch_to_tsquery('english', ${trimmed})) DESC
      LIMIT ${limit}
    `)) as unknown as {
      rows: {
        document_id: string;
        document_title: string;
        document_type: string;
        document_url: string | null;
        content: string;
      }[];
    };

    return rows.rows.map((r) => ({
      documentId: r.document_id,
      documentTitle: r.document_title,
      documentType: r.document_type,
      documentUrl: r.document_url,
      content: r.content,
    }));
  } catch {
    // Missing index/table or query-token issues should never break chat.
    return [];
  }
}
