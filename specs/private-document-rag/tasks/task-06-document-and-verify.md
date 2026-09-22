# Task 06: Document and Verify Private RAG

## Status

completed

## Wave

4

## Description

Document the completed private RAG architecture and verify the full user journey. This task is intentionally last because it must describe the real endpoint contracts and test the completed workflows, upload flow, and chat integration together.

## Dependencies

**Depends on:** task-04-document-upload-flow.md, task-05-n8n-chat-integration.md
**Blocks:** None

**Context from dependencies:** Task 04 provides user-scoped document upload, polling, deletion, and file states. Task 05 provides complete n8n-backed chat answers and citations. Both depend on n8n workflows that apply mandatory Qdrant user metadata filtering.

## Files to Create

- `docs/features/private-document-rag.md` - architecture, state transitions, contracts, operations, and deliberate LightRAG exclusion.

## Files to Modify

- `README.md` - add a concise link to the feature documentation if the project documents implemented features there.

## Technical Details

### Implementation Steps

1. Document the browser-to-Next.js-to-n8n boundary and state explicitly that user IDs are taken from Better Auth sessions, never from browser-provided metadata.
2. Record the six supported extensions, 10 MB limit, document lifecycle, retry/deletion behavior, and required server-only variables by name only.
3. Explain that v1 uses Qdrant payload filters on `userId`; LightRAG remains excluded until tenant filtering is verified.
4. Run `pnpm check` and `pnpm build:ci`.
5. Manually test with two accounts: upload unique documents to each, query common terms, confirm citations stay isolated, try cross-user URL deletion, and test unsupported/oversize files.
6. Test ingestion failure and retry, then verify deleting a ready document removes both its app record and matching vectors.

## Acceptance Criteria

- [ ] Documentation accurately describes the implemented webhook contracts without including secrets or service credentials.
- [ ] Two-account verification proves document and citation isolation.
- [ ] File validation, terminal ingestion states, retry, and deletion are verified.
- [ ] `pnpm check` and `pnpm build:ci` pass, or any pre-existing failures are recorded with exact scope.
