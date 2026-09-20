import { headers } from "next/headers";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { retrieveChunks } from "@/lib/rag";

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

export async function POST(req: Request) {
  // Verify user is authenticated
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Parse and validate request body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid request",
        details: parsed.error.flatten().fieldErrors,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const { messages }: { messages: UIMessage[] } = parsed.data as { messages: UIMessage[] };

  // Initialize OpenRouter with API key from environment
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "OpenRouter API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const openrouter = createOpenRouter({ apiKey });

  // RAG: extract last user message text for retrieval.
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const lastUserText = lastUser
    ? String(
        (lastUser.parts ?? [])
          .filter((p) => p.type === "text" && "text" in p && p.text)
          .map((p) => ("text" in p ? p.text : ""))
          .join("\n") ||
          (typeof (lastUser as { content?: unknown }).content === "string"
            ? (lastUser as { content?: string }).content ?? ""
            : "")
      )
    : "";

  const retrieved =
    lastUserText.trim() && process.env.OPENROUTER_API_KEY
      ? await retrieveChunks(session.user.id, lastUserText)
      : [];

  const modelMessages = convertToModelMessages(messages);
  if (retrieved.length) {
    const sourcesBlock = retrieved
      .map(
        (c, i) =>
          `[${i + 1}] Title: ${c.documentTitle}${c.documentUrl ? `\n    URL: ${c.documentUrl}` : ""}\n    Content: ${c.content}`
      )
      .join("\n\n");

    modelMessages.unshift({
      role: "system" as const,
      content:
        "You are a helpful assistant. Use the following sources when relevant and cite them as [1][2]... If the sources are irrelevant or empty, answer normally without citations.\n\n" +
        sourcesBlock,
    });
  }

  const result = streamText({
    model: openrouter(process.env.OPENROUTER_MODEL || "openai/gpt-5-mini"),
    messages: modelMessages,
  });

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      if (retrieved.length) {
        writer.write({
          type: "data-sources",
          data: retrieved.map((c, i) => ({
            index: i + 1,
            title: c.documentTitle,
            ...(c.documentUrl ? { url: c.documentUrl } : {}),
          })),
        });
      }
      (result as unknown as { mergeIntoUIMessageStream: (o: unknown) => void }).mergeIntoUIMessageStream({
        writer,
      });
    },
    onError: (err) => (err instanceof Error ? err.message : "An error occurred."),
  });

  return createUIMessageStreamResponse({ stream });
}
