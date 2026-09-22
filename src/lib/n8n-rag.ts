import { z } from "zod";
import { getServerEnv } from "@/lib/env";

// Server-only n8n RAG client. Never import this from a client component.

const N8N_HEADER = "X-N8N-RAG-SECRET";
const N8N_TIMEOUT_MS = 60_000;

const ingestionStatusSchema = z.enum(["processing", "ready", "failed"]);
export type IngestionStatus = z.infer<typeof ingestionStatusSchema>;

const ingestResponseSchema = z.object({
  status: z.literal("processing"),
  trackId: z.string().optional(),
});

const statusResponseSchema = z.object({
  status: ingestionStatusSchema,
  trackId: z.string().optional(),
  error: z.string().nullish(),
});

const deleteResponseSchema = z.object({
  status: z.literal("deleted"),
});

const citationSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  chunkId: z.string().optional(),
});

const queryResponseSchema = z.object({
  answer: z.string(),
  citations: z.array(citationSchema).default([]),
});

export interface IngestRequest {
  documentId: string;
  userId: string;
  filename: string;
  mimeType: string;
}

export interface IngestFile {
  buffer: Buffer;
  filename: string;
  mimeType: string;
}

export interface QueryRequest {
  userId: string;
  question: string;
}

export type IngestionResult = z.infer<typeof ingestResponseSchema>;
export type IngestionStatusResult = z.infer<typeof statusResponseSchema>;
export type DeleteResult = z.infer<typeof deleteResponseSchema>;
export type QueryResult = z.infer<typeof queryResponseSchema>;

export class N8nRagError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "N8nRagError";
    this.status = status;
  }
}

function safeErrorMessage(body: unknown): string {
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (typeof obj.message === "string") return obj.message;
    if (typeof obj.error === "string") return obj.error;
  }
  if (typeof body === "string" && body.length > 0) return body.slice(0, 300);
  return "RAG service request failed";
}

async function n8nFetch(
  url: string,
  init: RequestInit
): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);
  try {
    let res: Response;
    try {
      res = await fetch(url, { ...init, signal: controller.signal });
    } catch {
      throw new N8nRagError("Unable to reach the RAG service", 502);
    }

    const raw = await res.text();
    let body: unknown = null;
    if (raw) {
      try {
        body = JSON.parse(raw);
      } catch {
        body = raw;
      }
    }

    if (!res.ok) {
      throw new N8nRagError(safeErrorMessage(body), res.status);
    }
    return body;
  } finally {
    clearTimeout(timer);
  }
}

async function n8nPostJson<T>(
  url: string,
  secret: string,
  payload: unknown,
  schema: z.ZodType<T>
): Promise<T> {
  const body = await n8nFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [N8N_HEADER]: secret,
    },
    body: JSON.stringify(payload),
  });
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new N8nRagError("RAG service returned an unexpected response", 502);
  }
  return parsed.data;
}

export async function ingestDocument(
  input: IngestRequest,
  file: IngestFile
): Promise<IngestionResult> {
  const env = getServerEnv();
  const form = new FormData();
  form.append("documentId", input.documentId);
  form.append("userId", input.userId);
  form.append("filename", file.filename);
  form.append("mimeType", file.mimeType);
  form.append(
    "file",
    new Blob([new Uint8Array(file.buffer)], { type: file.mimeType }),
    file.filename
  );

  const body = await n8nFetch(env.N8N_RAG_INGEST_URL, {
    method: "POST",
    headers: { [N8N_HEADER]: env.N8N_RAG_INGEST_SECRET },
    body: form,
  });

  const parsed = ingestResponseSchema.safeParse(body);
  if (!parsed.success) {
    throw new N8nRagError("RAG service returned an unexpected response", 502);
  }
  return parsed.data;
}

export async function getIngestionStatus(input: {
  documentId: string;
  userId: string;
}): Promise<IngestionStatusResult> {
  const env = getServerEnv();
  return n8nPostJson(
    env.N8N_RAG_STATUS_URL,
    env.N8N_RAG_INGEST_SECRET,
    input,
    statusResponseSchema
  );
}

export async function deleteDocument(input: {
  documentId: string;
  userId: string;
}): Promise<DeleteResult> {
  const env = getServerEnv();
  return n8nPostJson(
    env.N8N_RAG_DELETE_URL,
    env.N8N_RAG_INGEST_SECRET,
    input,
    deleteResponseSchema
  );
}

export async function askQuestion(input: QueryRequest): Promise<QueryResult> {
  const env = getServerEnv();
  return n8nPostJson(
    env.N8N_RAG_CHAT_URL,
    env.N8N_RAG_CHAT_SECRET,
    input,
    queryResponseSchema
  );
}