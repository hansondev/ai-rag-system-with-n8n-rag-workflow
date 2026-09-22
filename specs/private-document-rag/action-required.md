# Action Required: Private Document RAG

Manual steps that require a human with access to the deployment services.
Implementation of the app code and the five n8n workflows is complete; the steps
below remain for activation and production verification.

## Credential setup (blocking — workflows are drafts until this is done)

- [x] **Create two n8n header-auth credentials** (`httpHeaderAuth`):
  - `Private RAG Ingest Secret` — header name `X-N8N-RAG-SECRET`, value = `N8N_RAG_INGEST_SECRET`. Assign to the "Receive document upload", "Receive status request", and "Receive delete request" webhook nodes.
  - `Private RAG Chat Secret` — header name `X-N8N-RAG-SECRET`, value = `N8N_RAG_CHAT_SECRET`. Assign to the "Receive question" webhook node.
  - **Known issue:** because these credentials did not exist at creation time, n8n auto-assigned the placeholder `HeaderAuth(lightrag-basic.hansondev.me)` credential to the webhooks. It MUST be replaced on each webhook node before publishing — otherwise the webhook will require the wrong `Authorization` header. *(Done: replaced via `setNodeCredential` on all four webhook nodes.)*
- [x] **Create a Qdrant header-auth credential** `Qdrant API Key` (`httpHeaderAuth`, header name `api-key`, value = the Qdrant API key) and assign it to the "Delete Qdrant vectors" HTTP Request node in the Delete workflow.
- [x] **Add server-only deployment variables** — provide `N8N_RAG_INGEST_URL`, `N8N_RAG_STATUS_URL`, `N8N_RAG_DELETE_URL`, `N8N_RAG_CHAT_URL`, `N8N_RAG_INGEST_SECRET`, `N8N_RAG_CHAT_SECRET` to the Next.js deployment, never as `NEXT_PUBLIC_*`. *(Added to the local `.env`; the same values must be set on the production host.)*

## During implementation (remaining manual checks)

- [x] **Validate spreadsheet parsing in n8n** — run representative `.xls` and `.xlsx` files through the Worker's document loader; retain only formats that produce reliable text. `.txt`, `.md`, `.pdf`, `.docx` are expected to work.
  - The n8n `documentDefaultDataLoader` rejects spreadsheet MIME types ("Unsupported mime type"). The Worker was rebuilt with a spreadsheet branch: `.xls`/`.xlsx` are routed through `Extract from File` → `Spreadsheet to text` (Code node serializes rows to text) → the shared Qdrant insert. Verified end-to-end: uploading `sales-data.xlsx` reached `Ready`, produced vectors in Qdrant with correct `userId`/`documentId` metadata, and answered a chat query about its cells with a citation.

## After implementation

- [x] **Publish/activate the five workflows** — `Private RAG Ingestion`, `Private RAG Ingestion Worker`, `Private RAG Status`, `Private RAG Delete`, `Private RAG Chat` — only after the header-auth credentials above are attached and verified. Use the production webhook URLs:
  - `https://n8n.hansondev.me/webhook/private-rag-ingest`
  - `https://n8n.hansondev.me/webhook/private-rag-status`
  - `https://n8n.hansondev.me/webhook/private-rag-delete`
  - `https://n8n.hansondev.me/webhook/private-rag-chat`
  - All five are published/active. The Ingestion workflow points at the spreadsheet-capable Worker (`Private RAG Ingestion Worker`, id `GHdKyW19XfdTQlqT`).
- [x] **Run an ownership test with two accounts** — confirm one account cannot list, query, retry, or delete the other account's content, and that querying a common term returns only the caller's citations.
  - Verified: account B saw no documents from account A; a query about account A's Lighthouse content returned only account B's citations; a cross-user DELETE of account A's document from account B returned `404` and left the data intact.
- [x] **Run an end-to-end ingestion test** — upload a supported file, watch it reach `Ready` via status polling, ask a question about it, then delete it and confirm both the app record and the matching Qdrant vectors are gone.
  - Verified for `.md` and `.xlsx`: upload → `processing` → `Ready`, chat answer with citation, delete removed the app row and the matching Qdrant points.

## Bugs found and fixed during activation

- **Worker payload field names:** the ingestion worker reads camelCase `documentId`/`userId`/`filename`/`mimeType`, but the claim query returned snake_case. The Ingestion "Attach binary" node now passes the camelCase fields through to the worker.
- **Failed inserts marked `ready`:** a loader/insert failure previously routed to `Mark ready`. The worker now gates on "Has content?" (`$json.pageContent` present) and only marks `ready` when content was actually stored; failures mark `failed`.
- **Status never synced in the app:** `GET /api/sources` returned the stale app DB row because nothing ever called the n8n status webhook. The GET now syncs `processing` rows against `getIngestionStatus` before responding.
- **`n8nTrackId` not persisted:** the upload route now stores the track ID returned by the ingest webhook.
- **Chat result-shape mismatch:** the Qdrant `load` mode returns `{ document: { pageContent, metadata }, score }`; "Has sources?" and the citation builder now read the nested shape.
- **Citation numbering off-by-one:** the chat route passed 1-based indexes but the UI added 1 again. It now passes 0-based indexes.

> Full architecture, contracts, and verification status: `docs/features/private-document-rag.md`.