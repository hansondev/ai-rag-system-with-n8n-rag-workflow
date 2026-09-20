# Agent Instructions

## Response

- Keep responses concise unless the user asks for detail.

## Project

- This is a Next.js 16 App Router application using React 19, TypeScript, and Tailwind CSS v4.
- Use `DESIGN.md` as the source of truth when creating or reviewing UI.
- RAG data is user-owned: enforce server-side authentication and ownership checks for sources, chunks, and their derived operations.
- Use Better Auth and Drizzle/Postgres patterns already present in the codebase.
- For substantial features, add or update focused documentation under `docs/features/`.

## Sources of truth

- Prefer current source code, configuration, package scripts, and migrations over starter documentation or generated caches.
- Inspect the affected code path before changing it; reuse established local patterns.
- Never include credentials, tokens, connection strings, or other secrets in code, documentation, logs, or responses.

## Changes and validation

- Use sub-agents only for independent parallel work or high-risk work; otherwise work directly.
- For schema changes, use randomly generated UUIDs for IDs outside Better Auth, then run `pnpm db:generate` and `pnpm db:migrate`. Do not use `db:push`, `db:dev`, or `db:reset`.
- Validate changes with `pnpm check`, relevant tests, and `pnpm build:ci`. Do not use `pnpm build` for validation because it runs migrations.

## Tool routing

- Use Playwright MCP for UI testing, n8n MCP for n8n workflows, Coolify MCP for deployments, Qdrant MCP for vector-store work, and web search for current external facts.

## Skills

- Load skills when their task trigger applies; do not duplicate their detailed guidance here.
- Use `writing-for-agents` before editing agent-facing instructions such as `AGENTS.md` or `CLAUDE.md`.
- Use `nextjs` for Next.js/App Router work, `ai-sdk` for AI SDK work, `better-auth-best-practices` for authentication, `shadcn` for shadcn/ui, `playwright-cli` for browser testing, and `security-scanner` for security reviews.
- Use `create-spec` for feature specification and `implement-feature` for executing an approved feature specification.
