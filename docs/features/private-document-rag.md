# Private Document RAG

## Overview

Private Document RAG replaces the starter text/URL and local full-text retrieval paths with user-scoped, n8n-backed document ingestion and vector search. A signed-in user uploads supported files from the Sources page; the Next.js server authenticates the request, creates a server-owned `documentId`, and hands the binary to a production n8n ingestion webhook. The workflow chunks, embeds, and stores the document in Qdrant with mandatory `userId`/`documentId` payload metadata. The user can then ask questions in the chat UI; the server calls a second n8n webhook that searches only that user's vectors and returns a Markdown answer with structured citations.

Every ingestion, status check, query, and deletion is scoped to the authenticated user. The browser never receives n8n URLs, secrets, or user-scope values — all of them are server-derived.

## Architecture & Trust Boundary

```
Browser (Sources / Chat UI)
  │  authenticated via Better Auth session cookie
  ▼
Next.js server (App Router route handlers, server-only)
  │  session.user.id is the ONLY source of userId
  │  X-N8N-RAG-SECRET header auth, 60s timeout, Zod-validated responses
  ▼
n8n production webhooks (https://n8n.hansondev.me/webhook/...)
  │  ── Ingestion:  POST /webhook/private-rag-ingest   (multipart)
  │  ── Status:     POST /webhook/private-rag-status   (JSON)
  │  ── Delete:     POST /webhook/private-rag-delete   (JSON)
  │  ── Chat:       POST /webhook/private-rag-chat     (JSON)
  ▼
Postgres (ingestion ledger) · Qdrant (vectors) · OpenAI (embeddings + answer model)
```

Trust rules:

- **User IDs always come from Better Auth sessions.** `userId` is read from `session.user.id` inside the server route handler; the browser never supplies it. The n8n webhooks treat the `userId` in the payload as authoritative scope for ledger writes, Qdrant filters, and deletions.
- **n8n URLs and secrets are server-only.** They are validated in `src/lib/env.ts`, listed (by name only) in `env.example`, and never exposed with a `NEXT_PUBLIC_` prefix. The client library `src/lib/n8n-rag.ts` is never imported from a client component.
- **The ingestion ledger is keyed by a server-generated `documentId`** (`crypto.randomUUID()`), so identical filenames from different users never collide.

## Document Lifecycle & State Transitions

A document row is created in the app `documents` table with status `processing` when the upload is accepted. From there it moves to a terminal state:

```
processing ──► ready
      └──────► failed
failed ──────► processing   (on retry: n8n re-claims the ledger row)
```

- **Upload accepted** → `processing` immediately; the browser request is not held open.
- **Ingestion success** → `ready` (worker updates the ledger; the app's polling picks it up).
- **Ingestion failure** → `failed` with the error message from the worker. A failed row may be re-claimed to `processing` on retry (the ledger update is idempotent).
- **Delete** → removes the Qdrant vectors for `(userId, documentId)` first, then deletes the ledger row and the app row. Deleting a document that is still `processing` is disabled in the UI.

The Sources page polls `GET /api/sources` every 4 seconds only while at least one document is `processing`; delete buttons are disabled while a document is processing.

## Webhook Contracts

All webhooks are production webhooks on `https://n8n.hansondev.me/webhook/...` and require HTTP header auth (`X-N8N-RAG-SECRET`). They are currently **draft/inactive** and must be published before production use (see [Operational Manual Steps](#operational-manual-steps)).

The five workflows live in the "Hanson Dev" personal n8n project.

### 1. Ingestion — `POST /webhook/private-rag-ingest`

Multipart form data:

| Field | Type | Notes |
| --- | --- | --- |
| `file` | binary | The uploaded document |
| `documentId` | string | Server-generated UUID |
| `userId` | string | From the Better Auth session |
| `filename` | string | Sanitized filename |
| `mimeType` | string | File MIME type |

Behavior: validates metadata, claims the document in the Postgres ingestion ledger (idempotent; a retry resets a `failed` row to `processing`), then dispatches the binary to the worker asynchronously.

Responses:

| Status | Body | Meaning |
| --- | --- | --- |
| `202` | `{ "status": "processing", "trackId": "<id>" }` | Accepted, async job dispatched |
| `200` | `{ "status": "<existing status>", ... }` | Document already claimed by this ledger |
| `400` | error body | Metadata invalid |

### 2. Ingestion Worker — (no public webhook)

Executes the async job: routes `.xls`/`.xlsx` through `Extract from File` → a Code node that serializes rows to text; all other formats go through the default binary loader. Content is chunked recursively (800 chars, 150 overlap), embedded with `text-embedding-3` (OpenAI, 1536 dims), inserted into Qdrant collection `hanson-n8n-rag-dev-direct` with payload `{ content, metadata: { documentId, userId, filename, mimeType } }`, then the ledger is updated to `ready` — but only if content was actually produced. A loader/insert failure marks the ledger `failed` with the error message.

### 3. Status — `POST /webhook/private-rag-status`

JSON request: `{ "documentId": "<uuid>", "userId": "<id>" }`

Response (scoped to `userId`): `{ "status": "processing" | "ready" | "failed", "trackId?": "<id>", "error?": "<message>" }`. Unknown documents return `status: "failed"` with a "Not found" error.

### 4. Delete — `POST /webhook/private-rag-delete`

JSON request: `{ "documentId": "<uuid>", "userId": "<id>" }`

Behavior: deletes all Qdrant points matching `metadata.userId` AND `metadata.documentId` via the Qdrant REST API, then deletes the ledger row.

Response: `{ "status": "deleted" }`

### 5. Chat — `POST /webhook/private-rag-chat`

JSON request: `{ "userId": "<id>", "question": "<text>" }`

Behavior: Qdrant search scoped by a **mandatory** `metadata.userId` payload filter (`searchFilterJson`), topK 5; OpenAI `gpt-5.4-mini` generates a Markdown answer instructed to treat retrieved chunks as untrusted content, answer only from evidence, cite as `[1][2]`, and say when the documents lack enough information.

Response: `{ "answer": "<markdown>", "citations": Array<{ "documentId": "<uuid>", "title": "<filename>", "chunkId?": "<id>" }> }`. No-result responses return a truthful message with `citations: []`.

## Ingestion Ledger

Postgres database `hansondev_private_rag_ingestion_ledger` (managed by n8n):

| Column | Notes |
| --- | --- |
| `document_id` | Primary key; server-generated UUID |
| `user_id` | Owning user |
| `status` | `processing` / `ready` / `failed` |
| `track_id` | Worker tracking identifier |
| `error` | Error message when failed |
| `created_at` / `updated_at` | Timestamps |

State transitions: `processing` → `ready` | `failed`; a `failed` row may be re-claimed to `processing` on retry. The app's `documents` table mirrors this status (see App API below).

## App API Endpoints

| Endpoint | Method | Auth | Behavior |
| --- | --- | --- | --- |
| `/api/sources` | `GET` | Required | Owner-scoped list of documents, newest first; syncs any `processing` rows against the n8n status webhook before responding |
| `/api/sources` | `POST` | Required | Validate upload, enforce limits, insert `processing` row, call ingestion webhook, persist the returned `n8nTrackId`; `201` with the document DTO on success; marks the row `failed` if n8n rejects the upload |
| `/api/sources/:id` | `DELETE` | Required | Owner-scoped lookup; calls the delete webhook first, then deletes the app row; `204` on success, `404` if not found for this user |
| `/api/chat` | `POST` | Required | Extracts the last user message, calls `askQuestion` with the session `userId`, streams the answer plus a `data-sources` part via a UI message stream |

Owner scoping is enforced in the query itself (`userId = session.user.id`), not in post-processing.

## Supported Files & Limits

- Extensions: `.txt`, `.md`, `.pdf`, `.docx`, `.xls`, `.xlsx`
- Maximum size: 10 MB (byte-checked server-side)
- Empty files are rejected
- Filenames are sanitized (path separators removed, illegal characters stripped, length capped)
- Per-user source limit: 200 documents

## Server-Only Configuration Variables

Required by `src/lib/env.ts` (never `NEXT_PUBLIC_`):

- `N8N_RAG_INGEST_URL`
- `N8N_RAG_STATUS_URL`
- `N8N_RAG_DELETE_URL`
- `N8N_RAG_CHAT_URL`
- `N8N_RAG_INGEST_SECRET` (min 16 chars)
- `N8N_RAG_CHAT_SECRET` (min 16 chars)

## Security Properties

- **Mandatory Qdrant `userId` filter**: every query applies a `metadata.userId` payload filter; every point carries `userId` + `documentId` metadata. LightRAG is not used because it cannot yet enforce this filter.
- **Owner-scoped queries and deletes**: status checks, vector searches, and deletions are all scoped to `userId`; the app route handlers also scope SQL by session user.
- **No client-visible secrets**: the browser only talks to `/api/*`; n8n URLs and header secrets stay on the server.
- **Header auth on every webhook** via `X-N8N-RAG-SECRET`.
- **Zod-validated responses** in `src/lib/n8n-rag.ts` with generic, client-safe errors (`N8nRagError`).
- **Per-user chat history**: localStorage keys are namespaced `chat-messages:<userId>`, so switching accounts never leaks history.

## Operational Manual Steps

1. **Create the n8n credentials** (two `httpHeaderAuth` credentials):
   - `Private RAG Ingest Secret` — header name `X-N8N-RAG-SECRET`, value = `N8N_RAG_INGEST_SECRET`. Assign to the Ingestion, Status, and Delete webhooks.
   - `Private RAG Chat Secret` — header name `X-N8N-RAG-SECRET`, value = `N8N_RAG_CHAT_SECRET`. Assign to the Chat webhook.
   - **Known issue:** because these credentials did not exist when the workflows were first saved, n8n auto-assigned the placeholder `HeaderAuth(lightrag-basic.hansondev.me)` credential to the webhooks. It MUST be replaced with the correct credential before activation, otherwise requests will require the wrong `Authorization` header.
2. **Create the Qdrant credential**: the Delete webhook's Qdrant REST call needs an `httpHeaderAuth` credential named `Qdrant API Key` (header name `api-key`, value = the Qdrant API key) assigned to its "Delete Qdrant vectors" HTTP Request node.
3. **Publish the five workflows** (they are drafts/inactive). Activate them after the credentials are attached. *(Done — all five published. The Ingestion workflow references the spreadsheet-capable Worker.)*
4. **Two-account verification** (remaining manual step):
   - Upload unique documents to each account; query common terms and confirm citations stay isolated.
   - Attempt cross-user URL deletion and confirm it fails.
   - Test unsupported and oversize files (rejected with clear errors).
   - Test ingestion failure and retry (a `failed` row can be re-claimed).
   - Delete a `ready` document and confirm both the app record and matching Qdrant vectors are removed.

Verification status: `pnpm check` and `pnpm build:ci` pass. The n8n workflows are published and header-auth protected; live smoke tests confirmed the 400/403 auth paths, status found/not-found, chat no-results, and full ingestion → ready → chat-with-citation → delete (app row + Qdrant vectors removed) flows. `.md`, `.txt`, and `.xlsx` were ingested and queried successfully; `.xlsx` is parsed via the worker's spreadsheet branch. A two-account ownership test confirmed citation isolation and a rejected cross-user delete.

## Deliberate Exclusions

- **LightRAG** — excluded in v1 because it cannot yet enforce per-user tenant filtering. Only Qdrant (with mandatory `metadata.userId` filters) is used.
- **Token streaming from n8n** — chat answers are returned as one complete response and streamed to the client by the app's UI message stream.
- **Server-persisted chat history** — chat history is client-side only (per-user localStorage).
- **File types beyond the six extensions** and team/shared workspaces.