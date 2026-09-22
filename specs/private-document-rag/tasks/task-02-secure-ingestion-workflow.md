# Task 02: Secure Ingestion Workflow

## Status

completed

## Wave

2

## Description

Convert the inactive n8n upload wrapper into a production ingestion workflow that only accepts requests from the Next.js server. It must store document chunks in Qdrant with user and document metadata, make its status observable, and remove vectors when the owner deletes a document.

## Dependencies

**Depends on:** task-01-private-rag-contract.md
**Blocks:** task-04-document-upload-flow.md, task-06-document-and-verify.md

**Context from dependencies:** Task 01 establishes `documentId` and `userId` as server-owned values, the exact status union, and server-only webhook authentication. n8n must treat both identifiers as required metadata, not trust values supplied by a browser.

## Files to Create

- No application files. Create or update n8n production workflows through the n8n MCP server.

## Files to Modify

- n8n workflow `[DEV]Webhook_Triggered(Document_Uploader) -> Document_Ingestion_Workflow(Qdrant_VectorDB)` - replace the unauthenticated inactive wrapper with an authenticated production ingress.
- n8n workflow `[DEV]Document_Uploader(Triggered From N8NForm + Webhook) -> LightRAG + VectorDB (Document_Ingestion)` - use metadata-scoped Qdrant ingestion and authoritative status records.

## Technical Details

### Implementation Steps

1. Configure the ingress webhook for header authentication using the manual credential from `action-required.md`; do not use an unauthenticated production webhook.
2. Require multipart file data plus `documentId`, `userId`, filename, and MIME type. Validate that IDs are non-empty strings before invoking the sub-workflow.
3. Use an ingestion ledger keyed by `documentId`, with `userId`, status, tracking ID, timestamps, and error detail. A repeated submission for the same document ID must be idempotent; same filenames from different users must not collide.
4. Preserve metadata through the document loader and vector-store node. Every Qdrant point must include `userId`, `documentId`, filename, and chunk/source metadata.
5. Do not send private user documents to the shared LightRAG corpus in v1. Remove or bypass the LightRAG upload branch for this app workflow.
6. Return `202` and a tracking ID after acceptance. Add authenticated status and deletion webhooks: status returns only the requested document's ledger state; deletion removes all Qdrant points matching both `userId` and `documentId`, then records completion.
7. Test duplicate IDs, same filename across two users, malformed metadata, a failed parse, status polling, and vector deletion before activation.

### API Endpoints

- `POST ingestion webhook` - multipart `file` with server metadata; returns `{ status: "processing", trackId: string }`.
- `POST status webhook` - `{ documentId, userId }`; returns `{ status, trackId?, error? }`.
- `POST deletion webhook` - `{ documentId, userId }`; returns a terminal deletion acknowledgement.

## Acceptance Criteria

- [ ] Production ingress rejects missing or invalid header authentication.
- [ ] Qdrant points include both ownership identifiers.
- [ ] Same filename uploads do not collide across users.
- [ ] A document's status can move only from processing to ready or failed.
- [ ] Deleting a document removes only that user's matching vectors.
