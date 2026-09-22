# Task 01: Define Private RAG Contract

## Status

completed

## Wave

1

## Description

Define the durable document state and the server-to-n8n contract before any workflow or UI integration is changed. The current `documents` and `chunks` tables support local text retrieval; this task changes the app's record of a source into a file-ingestion job owned by exactly one Better Auth user.

## Dependencies

**Depends on:** None (Wave 1)
**Blocks:** task-02-secure-ingestion-workflow.md, task-03-secure-query-workflow.md, task-04-document-upload-flow.md, task-05-n8n-chat-integration.md

**Context from dependencies:** None. The existing schema uses text primary keys holding UUIDs and `documents.userId` is a Better Auth text foreign key.

## Files to Create

- `src/lib/n8n-rag.ts` - server-only request helpers, Zod contracts, and n8n error normalization.
- `drizzle/XXXX_*.sql` - generated migration; filename is determined by Drizzle.

## Files to Modify

- `src/lib/schema.ts` - replace local-content fields with file metadata and ingestion lifecycle fields.
- `src/lib/env.ts` - validate required server-only n8n endpoint and secret variables.
- `env.example` - document variable names with empty values only.

## Technical Details

### Implementation Steps

1. Retain `documents.id` and `documents.userId`; both identify authoritative app ownership.
2. Add filename, MIME type, byte size, storage key if retained, `status`, `n8nTrackId`, `error`, and terminal-status timestamps. Remove `chunks` and local full-text schema only after the n8n flow replaces every caller.
3. Model statuses as a narrow TypeScript/Zod union: `processing`, `ready`, `failed`. Never accept a client-provided user ID or status transition.
4. Add server-only `N8N_RAG_INGEST_URL`, `N8N_RAG_STATUS_URL`, `N8N_RAG_DELETE_URL`, `N8N_RAG_CHAT_URL`, `N8N_RAG_INGEST_SECRET`, and `N8N_RAG_CHAT_SECRET` variables. The browser must never receive any of them.
5. Create typed helpers that make authenticated `fetch` calls from route handlers. Set a request timeout, parse non-2xx responses safely, and return a generic client-safe failure message while retaining suitable server diagnostics.
6. Run `pnpm db:generate`, inspect the generated SQL, then run `pnpm db:migrate`.

### Code Snippets

```ts
type IngestionStatus = "processing" | "ready" | "failed";

type IngestRequest = {
  documentId: string;
  userId: string;
  filename: string;
  mimeType: string;
};

type QueryRequest = {
  userId: string;
  question: string;
};
```

### Environment Variables

- `N8N_RAG_INGEST_URL` - private production ingestion webhook URL.
- `N8N_RAG_STATUS_URL` - private production ingestion-status webhook URL.
- `N8N_RAG_DELETE_URL` - private production deletion webhook URL.
- `N8N_RAG_CHAT_URL` - private production chat webhook URL.
- `N8N_RAG_INGEST_SECRET` - header-auth secret for ingestion, status, and deletion.
- `N8N_RAG_CHAT_SECRET` - header-auth secret for query requests.

## Acceptance Criteria

- [ ] The generated migration represents file metadata and asynchronous ingestion state without unscoped user data.
- [ ] n8n helper contracts reject malformed responses and do not export secrets to client modules.
- [ ] No caller can choose a document owner, ingestion status, or n8n endpoint from browser input.
- [ ] `pnpm db:generate` and `pnpm db:migrate` succeed.
