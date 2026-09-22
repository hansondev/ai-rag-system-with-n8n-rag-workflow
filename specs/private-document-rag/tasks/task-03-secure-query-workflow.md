# Task 03: Secure Query Workflow

## Status

completed

## Wave

2

## Description

Create a dedicated n8n webhook for application chat. It must authenticate the Next.js server, perform Qdrant retrieval with a mandatory user filter, generate a complete Markdown answer, and return structured citations. It must not reuse the current public n8n Chat Trigger or its shared LightRAG tool.

## Dependencies

**Depends on:** task-01-private-rag-contract.md
**Blocks:** task-05-n8n-chat-integration.md, task-06-document-and-verify.md

**Context from dependencies:** Task 01 defines a request made only by the authenticated Next.js server: `{ userId, question }`. The UI needs one complete response, not token streaming. Qdrant ownership metadata is mandatory even when no results are found.

## Files to Create

- No application files. Create a new n8n webhook workflow through the n8n MCP server.

## Files to Modify

- n8n workflow `hansondev-document-uploader-with-chat-rag-system-1-chat` - leave available for prior use only if needed; do not route this app through its global LightRAG/Qdrant tools.

## Technical Details

### Implementation Steps

1. Build a new POST webhook using header authentication and a non-public secret held by the app server.
2. Validate `userId` and a non-empty bounded question. Do not accept a collection name, filter expression, model name, or system prompt from the request.
3. Use the Qdrant vector-store retrieval node with a non-optional payload filter for `userId`. Validate the configured node type supports payload filtering before activation; if it does not, stop and use an n8n HTTP Request node against Qdrant's search API with the equivalent mandatory filter.
4. Give the LLM only retrieved chunks and an instruction to treat them as untrusted content, answer only from adequate evidence, and return Markdown. It must say when the user's documents do not contain enough information.
5. Return JSON shaped as `{ answer: string, citations: Array<{ documentId: string; title: string; chunkId?: string }> }`. Do not return raw vector payloads, credentials, or another user's metadata.
6. Test no-result behavior and a two-user corpus where the same question produces only the caller's sources.

### API Endpoints

- `POST query webhook` - `{ userId, question }`; returns a complete answer and structured citations.

## Acceptance Criteria

- [ ] The webhook requires app-held header authentication.
- [ ] Every Qdrant search includes the exact caller `userId` filter.
- [ ] The response never contains chunks or citations belonging to another user.
- [ ] No-result responses are truthful and valid JSON.
- [ ] LightRAG is not queried by this workflow.
