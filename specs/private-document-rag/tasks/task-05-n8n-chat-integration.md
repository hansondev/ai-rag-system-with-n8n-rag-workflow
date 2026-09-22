# Task 05: Connect Chat to n8n

## Status

completed

## Wave

3

## Description

Replace the current OpenRouter and local PostgreSQL retrieval in `/api/chat` with the authenticated n8n query workflow. Preserve the existing chat presentation where practical, but render the workflow's complete answer and source citations rather than using client-visible provider credentials or local retrieval.

## Dependencies

**Depends on:** task-01-private-rag-contract.md, task-03-secure-query-workflow.md
**Blocks:** task-06-document-and-verify.md

**Context from dependencies:** Task 01 provides the server-only n8n client and `{ userId, question }` contract. Task 03 exposes an authenticated JSON query webhook that returns `{ answer, citations }` and enforces Qdrant metadata filtering.

## Files to Create

- No new files required unless a small chat response mapper is needed in `src/lib/`.

## Files to Modify

- `src/app/api/chat/route.ts` - authenticate, extract the final user text, call n8n, and return a valid UI-message response without OpenRouter.
- `src/app/chat/page.tsx` - display complete pending/result states and citations returned by the new route.
- `src/lib/rag.ts` - delete local retrieval helpers once no caller remains.
- `src/lib/env.ts` - remove OpenRouter requirements only if no other app feature uses them.

## Technical Details

### Implementation Steps

1. Keep Better Auth session validation as the first operation in the route.
2. Preserve bounded message validation, but extract only the final user text and send it with the session user ID through the server-only helper.
3. Return the complete n8n answer as an assistant message plus a structured `data-sources` payload compatible with the existing client citation renderer. Do not pretend to stream tokens.
4. Render a clear pending label such as `Searching your documents...`; retain visible errors and a recovery action.
5. Keep localStorage as the v1 conversation store. Namespace its key by user ID or clear it when the signed-in user changes so messages cannot appear under another account in the same browser.
6. Remove `OPENROUTER_API_KEY`, `createOpenRouter`, `streamText`, and local `retrieveChunks` use from this path.

### API Endpoints

- `POST /api/chat` - accepts the AI SDK message envelope, authenticates the caller, and returns one complete assistant answer and citations from n8n.

## Acceptance Criteria

- [ ] The chat route makes no browser-visible request to n8n and holds no client-visible secret.
- [ ] The route does not call OpenRouter, LightRAG, or PostgreSQL full-text retrieval.
- [ ] Chat answers show only citations returned from the caller's Qdrant-filtered query.
- [ ] A signed-out user receives a 401 and a user change cannot expose prior local chat history.
