---
title: "CLI"
source_url: https://chat-sdk.dev/docs/create-chat-sdk
section: create-chat-sdk
crawled: 2026-09-20
---

# CLI

> Source: https://chat-sdk.dev/docs/create-chat-sdk

`create-chat-sdk` creates a minimal Next.js app for Chat SDK bots.

The CLI will generate your `Chat` configuration, webhook route, `.env.example` file, dependencies, and optional Web adapter route from the adapter catalog.

[Quick start](#quick-start)
---------------------------

npmpnpmyarnbun

```
npm create chat-sdk@latest my-bot
```

`create-chat-sdk` automatically detects when it is being run by Cursor, Claude Code, or another coding agent. In agent environments, pass at least one platform adapter with `--adapter`; the state adapter defaults to `memory`. The CLI runs non-interactively and uses `my-bot` when no project name is provided. Pass `--interactive` to force prompts.

[Non-interactive usage](#non-interactive-usage)
-----------------------------------------------

Pass platform and state adapters with `--adapter`:

```
npm create chat-sdk@latest -- my-bot --adapter slack redis -y
```

With npm, the `--` separator is required because npm consumes flags before it (`-y` is npm's own `--yes`) instead of forwarding them to the CLI. `pnpm create` and `yarn create` forward flags without it.

The interactive prompt lists official adapters by default. Pass `--vendor` to list only vendor-official adapters instead. Automation and coding agents can install any CLI-supported official or vendor adapter directly with `--adapter`.

Adapters that require a long-running process, including Matrix and Lark, cannot run on the webhook-only serverless runtime and are not available through the CLI. Add them to an existing project manually instead.

View available adapter slugs

### Official platform adapters

* [discord](/en/adapters/official/discord) - Discord
* [github](/en/adapters/official/github) - GitHub
* [gmail](/en/adapters/official/gmail) - Gmail
* [gchat](/en/adapters/official/gchat) - Google Chat
* [instagram](/en/adapters/official/instagram) - Instagram
* [linear](/en/adapters/official/linear) - Linear
* [messenger](/en/adapters/official/messenger) - Messenger
* [teams](/en/adapters/official/teams) - Microsoft Teams
* [notion](/en/adapters/official/notion) - Notion
* [slack](/en/adapters/official/slack) - Slack
* [telegram](/en/adapters/official/telegram) - Telegram
* [twilio](/en/adapters/official/twilio) - Twilio
* [web](/en/adapters/official/web) - Web
* [whatsapp](/en/adapters/official/whatsapp) - WhatsApp Business Cloud
* [x](/en/adapters/official/x) - X
* [xchat](/en/adapters/official/xchat) - XChat

### Vendor-official platform adapters

* [agentphone](/en/adapters/vendor-official/agentphone) - AgentPhone
* [matrix](/en/adapters/vendor-official/matrix) - Beeper Matrix
* [dial](/en/adapters/vendor-official/dial) - Dial
* [kapso](/en/adapters/vendor-official/kapso) - Kapso
* [lark](/en/adapters/vendor-official/lark) - Lark / Feishu
* [linq](/en/adapters/vendor-official/linq) - Linq
* [liveblocks](/en/adapters/vendor-official/liveblocks) - Liveblocks
* [novu](/en/adapters/vendor-official/novu) - Novu
* [photon](/en/adapters/vendor-official/photon) - Photon
* [resend](/en/adapters/vendor-official/resend) - Resend
* [sendblue](/en/adapters/vendor-official/sendblue) - Sendblue
* [velt](/en/adapters/vendor-official/velt) - Velt
* [zernio](/en/adapters/vendor-official/zernio) - Zernio

### State adapters

* [cloudflare-agents](/en/adapters/vendor-official/cloudflare-agents) - Cloudflare Agents
* [ioredis](/en/adapters/official/ioredis) - ioredis
* [memory](/en/adapters/official/memory) - Memory
* [postgres](/en/adapters/official/postgres) - PostgreSQL
* [redis](/en/adapters/official/redis) - Redis

Examples:

```
npm create chat-sdk@latest -- slack-bot --adapter slack memory -y --skip-install
npm create chat-sdk@latest -- gchat-bot --adapter gchat redis -y --pm pnpm
npm create chat-sdk@latest -- email-bot --adapter resend postgres -y --no-git
npm create chat-sdk@latest -- my-bot --adapter slack memory -y --force
```

[What gets generated](#what-gets-generated)
-------------------------------------------

The scaffolded app is webhook-only. It does not include pages, layouts, or a client UI.

```
src/
  lib/bot.ts                              Bot configuration and handlers
  app/api/webhooks/[platform]/route.ts    Dynamic platform webhook route
  app/api/chat/route.ts                   Web adapter route, only when selected
  app/api/discord/gateway/route.ts        Discord Gateway listener, only when selected
.env.example                              Required environment variables
next.config.ts                            Next.js server config
vercel.json                               Cron schedules, only when needed
.chat-sdk.json                            Generated file ownership for safe reruns
package.json                              Adapter dependencies
```

Webhook endpoints use the selected adapter slug:

```
/api/webhooks/slack
/api/webhooks/gchat
/api/webhooks/discord
```

When the [Web adapter](/adapters/official/web) is selected, the CLI also creates `/api/chat` for browser chat requests and a small `getUser` auth stub. Replace the stub with your app's real authentication logic so each web conversation can be associated with the correct user.

When the [Discord adapter](/adapters/official/discord) is selected, the CLI also creates a Gateway listener at `/api/discord/gateway` and a `vercel.json` cron that calls it. Discord delivers slash commands and button clicks to the webhook route, but regular messages and reactions only arrive over the Gateway WebSocket, so the cron keeps that connection alive and forwards events to `/api/webhooks/discord`. Set a `CRON_SECRET` environment variable to authenticate the cron requests. The generated serverless Gateway cron requires [Vercel Pro or Enterprise](https://vercel.com/docs/cron-jobs/usage-and-pricing) because it runs every nine minutes.

[Vercel Connect](#vercel-connect)
---------------------------------

[Vercel Connect](/docs/vercel-connect) supplies outbound credentials for the Slack, Discord, GitHub, Linear, Notion, Teams, and Telegram adapters. Pass `--connect` — or choose **Vercel Connect** at the interactive auth-mode prompt — to scaffold Connect wiring for any selected adapter in that list. Notion and Telegram webhooks remain direct and retain their native verification secrets.

```
npm create chat-sdk@latest -- my-bot --adapter slack --connect -y
```

The generated `src/lib/bot.ts` spreads the matching helper from `@vercel/connect/chat` into the adapter factory, `@vercel/connect` is added to dependencies, and `.env.example` lists each connector UID (for example `SLACK_CONNECTOR`). Native webhook verification secrets are retained for adapters such as Notion and Telegram.

For Linear, `--adapter linear --connect` explicitly sets `mode: "agent-sessions"`, the recommended setup for Connect bots. Enable **Agent session events** on the Linear app and use an app-actor installation. The adapter itself still defaults to `"comments"` when `mode` is omitted.

For Microsoft Teams, use `--adapter teams --connect`. The generated bot uses
`connectTeamsAdapter(requireEnv("TEAMS_CONNECTOR"))`, and `.env.example` expects
a connector UID such as `microsoft-teams/my-bot` instead of Azure credentials.
Forward Connect triggers to `/api/webhooks/teams`. Microsoft Graph reads require
the bot's resource-specific permissions to be granted when it is installed in a
team. This setup requires releases of both `@vercel/connect` and
`@chat-adapter/teams` that support the Teams Connect helper.

Vercel Connect provides `VERCEL_OIDC_TOKEN` at runtime. For local development, run `vercel link` then `vercel env pull` to populate it. Connect forwards inbound webhooks only to deployed URLs, so test webhook delivery against a Vercel deployment (such as a preview) rather than localhost.

[Reference](#reference)
-----------------------

| Option | Description |
| --- | --- |
| `[name]` | Name of the project. |
| `-d, --description <text>` | Project description. |
| `--adapter <values...>` | Platform or state adapters to include. |
| `--vendor` | List only vendor-official adapters in the interactive prompt. |
| `--connect` | Authenticate Slack, Discord, GitHub, Linear, Notion, Teams, and Telegram adapters with Vercel Connect. |
| `--pm <manager>` | Package manager to use: `npm`, `yarn`, `pnpm`, or `bun`. |
| `-y, --yes` | Skip prompts and accept defaults. |
| `--interactive` | Always prompt, even when a coding agent environment is detected. |
| `-f, --force` | Overwrite generated files in an existing directory. |
| `-s, --skip-install` | Skip dependency installation. |
| `--no-git` | Skip git repository initialization. |
| `-q, --quiet` | Suppress non-essential output. |

Color output follows the [NO\_COLOR standard](https://no-color.org/) — set `NO_COLOR=1` to disable colors.

[Customize your bot](#customize-your-bot)
-----------------------------------------

Most bot behavior lives in `src/lib/bot.ts`. Start there when you want to:

* Add or change handlers like `onNewMention`, `onSubscribedMessage`, `onNewMessage`, reactions, actions, or slash commands.
* Adjust adapter configuration, for example passing explicit credentials or platform-specific options instead of relying only on environment variables.
* If you selected the memory state adapter, switch to Redis, ioredis, or PostgreSQL before deploying to production.

The generated file includes starter handlers for mentions and subscribed thread replies.

[Next steps](#next-steps)
-------------------------

After scaffolding:

```
cd my-bot
cp .env.example .env.local
npm run dev
```

Fill in the generated environment variables, expose your local server, and configure each selected platform to call its `/api/webhooks/{adapter}` endpoint.

[Resources](#resources)
-----------------------

See guides, templates, and examples on the [resources](/resources) page.

[Read more](#read-more)
-----------------------

[### Introduction

A unified SDK for building chat bots across Slack, Microsoft Teams, Google Chat, Discord, Telegram, and more.](/docs)[### Getting Started

Pick a guide to start building with Chat SDK.](/docs/getting-started)[### Creating a Chat Instance

Initialize the Chat class with adapters, state, and configuration options.](/docs/usage)[### Threads, Messages, and Channels

Work with threads, messages, and channels across platforms.](/docs/threads-messages-channels)
