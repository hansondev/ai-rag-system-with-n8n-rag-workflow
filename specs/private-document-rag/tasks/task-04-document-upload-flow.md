# Task 04: Build Document Upload Flow

## Status

completed

## Wave

3

## Description

Replace the current text and URL source flow with authenticated file uploads and asynchronous status polling. The browser sends only the file to Next.js; the server establishes document ownership and calls the authenticated n8n ingestion workflow from Task 02.

## Dependencies

**Depends on:** task-01-private-rag-contract.md, task-02-secure-ingestion-workflow.md
**Blocks:** task-06-document-and-verify.md

**Context from dependencies:** Task 01 supplies the `documents` lifecycle schema and n8n helper. Task 02 exposes authenticated ingestion, status, and deletion webhooks with server-owned `userId` and `documentId` metadata.

## Files to Create

- `src/lib/document-upload.ts` - supported extension, MIME, byte-limit, and filename validation shared by route handlers.

## Files to Modify

- `src/app/api/sources/route.ts` - accept multipart uploads, create processing records, invoke n8n, and list file metadata/status.
- `src/app/api/sources/[id]/route.ts` - own-scoped deletion through n8n before database removal; add retry only if the status contract supports it.
- `src/app/sources/page.tsx` - file picker, upload progress/pending state, status polling, retry/delete controls, and accessible feedback.
- `src/lib/storage.ts` - remove unused generic/public document behavior if it conflicts with private RAG storage.

## Technical Details

### Implementation Steps

1. Support only `.txt`, `.md`, `.pdf`, `.docx`, `.xls`, and `.xlsx`; enforce a 10 MB maximum using the uploaded bytes, not the declared MIME type alone.
2. Authenticate before parsing files. Generate a document UUID in the route handler, insert a `processing` record scoped to the session user, then call the n8n helper with the binary and server-derived identifiers.
3. If n8n rejects the submission, set the record to `failed` and return a safe error. Do not erase a record needed to show the failure and retry path.
4. Poll only processing documents on a short bounded interval; update their authoritative app record from the status webhook and stop polling when all are terminal or the page unmounts.
5. Keep all source list, status, retry, and deletion queries scoped with `documents.userId = session.user.id`.
6. The UI follows `DESIGN.md`: native labelled file input, disabled submit while pending, visible status text rather than toast-only feedback, and responsive table/card behavior.

### API Endpoints

- `POST /api/sources` - multipart form data with a single `file`; returns a private document record in `processing`, `ready`, or `failed` state.
- `GET /api/sources` - returns only the signed-in user's documents and file metadata.
- `DELETE /api/sources/:id` - removes the caller's vectors and document record only.

## Acceptance Criteria

- [ ] Unsupported extensions and files over 10 MB are rejected before n8n is called.
- [ ] The browser cannot set `userId`, `documentId`, or terminal ingestion status.
- [ ] A processing document visibly becomes ready or failed without a full page reload.
- [ ] Deletion is owner-scoped and does not leave matching vectors behind.
- [ ] No text/URL source creation UI or local chunk insertion remains.
