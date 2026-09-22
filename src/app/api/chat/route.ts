import { headers } from "next/headers";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { askQuestion, N8nRagError, type QueryResult } from "@/lib/n8n-rag";

// Zod schema for message validation
const messagePartSchema = z.object({
  type: z.string(),
  text: z.string().max(10000, "Message text too long").optional(),
});

const messageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(messagePartSchema).optional(),
  content: z.union([z.string(), z.array(messagePartSchema)]).optional(),
});

const chatRequestSchema = z.object({
  messages: z.array(messageSchema).max(100, "Too many messages"),
});

function extractLastUserText(
  messages: z.infer<typeof chatRequestSchema>["messages"]
): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return "";
  return String(
    (lastUser.parts ?? [])
      .filter((p) => p.type === "text" && "text" in p && p.text)
      .map((p) => ("text" in p ? p.text ?? "" : ""))
      .join("\n") ||
      (typeof (lastUser as { content?: unknown }).content === "string"
        ? (lastUser as { content?: string }).content ?? ""
        : "")
  );
}

export async function POST(req: Request) {
  // Verify user is authenticated
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse and validate request body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const question = extractLastUserText(parsed.data.messages).trim();
  if (!question) {
    return Response.json({ error: "Empty message" }, { status: 400 });
  }

  let answer: string;
  let citations: QueryResult["citations"];
  try {
    const result = await askQuestion({ userId: session.user.id, question });
    answer = result.answer;
    citations = result.citations;
  } catch (err) {
    const status = err instanceof N8nRagError ? err.status : 502;
    return Response.json({ error: "RAG service request failed" }, { status });
  }

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.write({ type: "text-start", id: "text-1" });
      writer.write({ type: "text-delta", id: "text-1", delta: answer });
      writer.write({ type: "text-end", id: "text-1" });
      if (citations.length > 0) {
        writer.write({
          type: "data-sources",
          data: citations.map((c, i) => ({
            index: i,
            title: c.title,
            documentId: c.documentId,
            ...(c.chunkId ? { chunkId: c.chunkId } : {}),
          })),
        });
      }
      writer.write({ type: "finish-step" });
      writer.write({ type: "finish", finishReason: "stop" });
    },
  });

  return createUIMessageStreamResponse({ stream });
}