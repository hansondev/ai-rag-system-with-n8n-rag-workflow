# Requirements: Private Document RAG

## Summary

The application already has Better Auth, a Sources page, and a chat UI, but it currently stores pasted text and URL content in PostgreSQL and retrieves it through local full-text search. The active n8n workflows already ingest document binaries into Qdrant, but their current collection and LightRAG path are shared and cannot enforce private user ownership.

This feature makes document RAG a secure, production-oriented flow. The Next.js server authenticates the caller, creates server-owned document identifiers, authenticates to n8n, and supplies the user scope. n8n persists and filters Qdrant metadata by that scope. The app then shows asynchronous ingestion status and gets complete answers plus citations from a dedicated n8n query webhook.

## Goals

- Let signed-in users upload `.txt`, `.md`, `.pdf`, `.docx`, `.xls`, and `.xlsx` files up to 10 MB.
- Ensure all document lifecycle operations and vector retrieval are private to the signed-in user.
- Use n8n for document extraction, chunking, embeddings, Qdrant storage, and answer generation.
- Show `Processing`, `Ready`, and `Failed` status in the Sources UI.
- Return complete Markdown answers with structured source citations in chat.

## Non-Goals

- Team or shared workspaces.
- Public document URLs or client-to-n8n calls.
- Token streaming from n8n.
- Server-persisted chat history.
- LightRAG retrieval until it can enforce an equivalent user metadata filter.
- Supporting file types beyond the six named extensions.

## Acceptance Criteria

- [ ] An unauthenticated request cannot upload, query, inspect, retry, or delete documents.
- [ ] Two users cannot retrieve, inspect, or delete each other's document or chunk data.
- [ ] A valid supported file becomes `Processing` promptly and reaches `Ready` or `Failed` without holding the browser request open.
- [ ] Every Qdrant point has `userId` and `documentId` metadata, and every query has a mandatory `userId` filter.
- [ ] Chat sends the authenticated user's question to n8n and displays the returned Markdown and citations.
- [ ] `pnpm check` and `pnpm build:ci` pass after the feature is complete.

## Assumptions

- The deployed n8n instance can use header authentication credentials and access the existing Qdrant and OpenAI credentials.
- The n8n document loader supports the requested formats, or unsupported spreadsheet formats can be detected and rejected explicitly.
- Postgres used by the app is available for Drizzle migrations and document-status persistence.

## Technical Constraints

- Keep Next.js 16 App Router, React 19, TypeScript, Tailwind v4, Better Auth, Drizzle, and Postgres.
- Preserve `DESIGN.md` as the UI source of truth.
- Generate non-Better-Auth IDs with `crypto.randomUUID()`.
- Apply schema changes with `pnpm db:generate` and `pnpm db:migrate`; never use `db:push`, `db:dev`, or `db:reset`.
- Keep n8n URLs and credentials server-only; never expose them to the browser or commit them.
- Use Qdrant for v1 retrieval. Do not call the shared LightRAG corpus.
