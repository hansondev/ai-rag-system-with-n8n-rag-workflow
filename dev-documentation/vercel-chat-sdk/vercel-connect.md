---
title: "Vercel Connect"
source_url: https://chat-sdk.dev/docs/vercel-connect
section: vercel-connect
crawled: 2026-09-20
---

# Vercel Connect

> Source: https://chat-sdk.dev/docs/vercel-connect

[Vercel Connect](https://vercel.com/docs/connect) lets your bot use a registered connector for adapter authentication instead of storing long-lived provider secrets. You register a connector once, link it to your project and environments, and your code requests scoped, short-lived tokens at runtime.

The `@vercel/connect/chat` subpath ships a helper per platform that you spread into the matching `create*Adapter` factory:

[Adapter support](#adapter-support)
-----------------------------------

| Adapter | Helper | Outbound field |
| --- | --- | --- |
| [Slack](/adapters/official/slack) | `connectSlackAdapter` | `botToken` |
| [Microsoft Teams](/adapters/official/teams) | `connectTeamsAdapter` | `appId`, `token` |
| [GitHub](/adapters/official/github) | `connectGitHubAdapter` | `installationToken` |
| [Linear](/adapters/official/linear) | `connectLinearAdapter` | `accessToken` |
| [Discord](/adapters/official/discord) | `connectDiscordAdapter` | `botToken`, `applicationId` |
| [Notion](/adapters/official/notion) | `connectNotionAdapter` | `token` |
| [Telegram](/adapters/official/telegram) | `connectTelegramAdapter` | `botToken` |

Each helper wires outbound credentials; trigger-capable providers also wire
inbound traffic:

* **Outbound** (your bot calls the provider API) — a function-form token field that resolves a fresh, short-lived token per call via `getToken`.
* **Inbound** (the provider calls your bot) — trigger-capable helpers include a `webhookVerifier` that validates the Vercel OIDC token Connect attaches to [trigger-forwarded](https://vercel.com/docs/connect/concepts/triggers) webhooks, replacing the provider's native signature check.

Each helper accepts `(connector, params?, options?)`, where `params` is the [`getToken`](https://vercel.com/docs/connect/ts-sdk-reference) parameters minus `subject` (pinned to `{ type: "app" }`), letting you pass through supported token parameters such as `installationId` or `validityBufferMs`.

[Install](#install)
-------------------

```
pnpm add @vercel/connect
```

`@vercel/connect` reads the deployment's OIDC token automatically. For local development, run `vercel link` followed by `vercel env pull` to download a short-lived token into `.env.local`.

[Set up a connector](#set-up-a-connector)
-----------------------------------------

The trigger-forwarding steps below apply to Slack, Microsoft Teams, GitHub, Linear, and Discord.
For Notion and Telegram, create and attach the connector without triggers, then
use native webhook verification or polling.

1. Create a connector for the provider in the [Vercel dashboard](https://vercel.com/d?to=%2F%5Bteam%5D%2F~%2Fconnect) or with the CLI, enabling trigger forwarding so inbound webhooks reach your project:

```
vercel connect create slack --name acme-slack --triggers
```

2. Attach your project and register your Chat SDK webhook route (`/api/webhooks/{platform}`) as the trigger destination:

```
vercel connect attach slack/acme-slack \
  --project my-bot --environment production \
  --triggers --trigger-path /api/webhooks/slack
```

3. Pull a development token locally (deployments get `VERCEL_OIDC_TOKEN` automatically):

```
vercel link
vercel env pull
```

[Wire up the adapter](#wire-up-the-adapter)
-------------------------------------------

Spread the helper into the adapter factory. The webhook route is unchanged — Connect forwards verified events to the same handler.

### [Slack](#slack)

lib/bot.ts

```
import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createRedisState } from "@chat-adapter/state-redis";
import { connectSlackAdapter } from "@vercel/connect/chat";

export const bot = new Chat({
  userName: "mybot",
  adapters: {
    slack: createSlackAdapter({
      ...connectSlackAdapter("slack/acme-slack"),
    }),
  },
  state: createRedisState(),
});
```

Replace `slack/acme-slack` with your connector UID from the Connect dashboard or `vercel connect list`. Omit `signingSecret` / `SLACK_SIGNING_SECRET` when using the helper — the OIDC `webhookVerifier` is the freshness boundary.

### [Microsoft Teams](#microsoft-teams)

lib/bot.ts

```
import { createTeamsAdapter } from "@chat-adapter/teams";
import { connectTeamsAdapter } from "@vercel/connect/chat";

createTeamsAdapter({
  ...connectTeamsAdapter("microsoft-teams/acme-teams"),
});
```

The helper resolves the bot's `appId` during initialization, requests separate Bot Framework and Microsoft Graph tokens through `token`, and supplies OIDC verification for forwarded webhooks. Enable trigger forwarding to `/api/webhooks/teams`. Omit `TEAMS_APP_ID` and `TEAMS_APP_PASSWORD` when using the helper.

Teams excludes `scopes` from helper parameters: its token callback requests the scope required by each API call.

Graph reads require the appropriate installation and consent permissions. Managed tokens use the bot's home tenant; the adapter's token callback tenant argument does not change that selection. Call `await bot.initialize()` before using adapter methods directly. Chat initializes automatically before processing webhooks.

### [GitHub](#github)

lib/bot.ts

```
import { createGitHubAdapter } from "@chat-adapter/github";
import { connectGitHubAdapter } from "@vercel/connect/chat";

createGitHubAdapter({
  ...connectGitHubAdapter("github/acme-github"),
  userName: "my-bot[bot]",
  botUserId: 12345678, // Numeric ID of your GitHub App bot user
});
```

`installationToken` is the installation access token a GitHub App would normally mint via its private-key JWT exchange — the adapter uses it directly and skips that exchange.

Set `botUserId` to your GitHub App bot user's numeric ID, or set `GITHUB_BOT_USER_ID`. An installation token cannot identify the bot through `/app`, and learning the ID from a posted comment only lasts for that process. Configuring it up front lets every serverless instance recognize its own comments and avoid self-reply loops. See the [GitHub adapter setup](/adapters/official/github#option-a--vercel-connect) for how to find the ID.

### [Linear](#linear)

lib/bot.ts

```
import { createLinearAdapter } from "@chat-adapter/linear";
import { connectLinearAdapter } from "@vercel/connect/chat";

createLinearAdapter({
  ...connectLinearAdapter("linear/acme-linear"),
  mode: "agent-sessions",
});
```

We recommend `mode: "agent-sessions"` for Linear Connect bots. Enable **Agent session events** on the Linear app and use an app-actor installation. Projects generated with `create-chat-sdk --adapter linear --connect` include this mode explicitly. The adapter still defaults to `"comments"` when `mode` is omitted, so existing bots keep their behavior. For outbound calls outside webhook handling (cron jobs, workflows), wrap them in `withInstallation()` so a request-scoped client is bound:

lib/jobs.ts

```
await linear.withInstallation("org-id", async () => {
  await linear.postMessage("linear:issue-id", "Hello from a background job");
});
```

### [Discord](#discord)

lib/bot.ts

```
import { createDiscordAdapter } from "@chat-adapter/discord";
import { connectDiscordAdapter } from "@vercel/connect/chat";

createDiscordAdapter({
  ...connectDiscordAdapter("discord/acme-discord"),
});
```

The helper resolves `botToken` and `applicationId` from one Connect token
response. Omit `DISCORD_BOT_TOKEN`, `DISCORD_PUBLIC_KEY`, and
`DISCORD_APPLICATION_ID` — Connect OIDC verification replaces Discord's
Ed25519 public-key check for trigger-forwarded interactions.

### [Notion](#notion)

lib/bot.ts

```
import { createNotionAdapter } from "@chat-adapter/notion";
import { connectNotionAdapter } from "@vercel/connect/chat";

createNotionAdapter({
  ...connectNotionAdapter("notion/acme-notion"),
  verificationToken: process.env.NOTION_VERIFICATION_TOKEN,
});
```

`connectNotionAdapter` supplies only the outbound `token`; it does not include a
`webhookVerifier`. Connect does not forward Notion triggers, so configure the
webhook subscription directly in Notion and retain
`NOTION_VERIFICATION_TOKEN` for native HMAC verification. Omit
`NOTION_TOKEN` when using the helper.

### [Telegram](#telegram)

lib/bot.ts

```
import { createTelegramAdapter } from "@chat-adapter/telegram";
import { connectTelegramAdapter } from "@vercel/connect/chat";

createTelegramAdapter({
  ...connectTelegramAdapter("telegram/acme-telegram"),
  secretToken: process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN,
});
```

`connectTelegramAdapter` supplies only the outbound `botToken`; it does not
include a `webhookVerifier`. The adapter derives webhook deduplication scope
from Telegram's stable bot identity, not the rotating credential. Retain
`TELEGRAM_WEBHOOK_SECRET_TOKEN` for native webhook verification or use polling
mode. Omit `TELEGRAM_BOT_TOKEN` when using the helper.

[Custom webhook verification](#custom-webhook-verification)
-----------------------------------------------------------

Each trigger-capable helper attaches a default verifier that matches the deployment's project and environment automatically (`projectId` defaults to `VERCEL_PROJECT_ID`, `environment` to `VERCEL_TARGET_ENV` then `VERCEL_ENV`), so production, preview, and development each accept only their own tokens. Verification fails closed — if those values are absent, every request is rejected, and the issuer must be `https://oidc.vercel.com` or a Vercel team issuer beneath `https://oidc.vercel.com/`.

To add constraints (for example to accept multiple environments), build a verifier with `createConnectWebhookVerifier` and override the field:

lib/bot.ts

```
import {
  connectSlackAdapter,
  createConnectWebhookVerifier,
} from "@vercel/connect/chat";

createSlackAdapter({
  ...connectSlackAdapter("slack/acme-slack"),
  webhookVerifier: createConnectWebhookVerifier({
    environment: ["production", "preview"],
  }),
});
```

Avoid hardcoding `environment: "production"` unless you only forward to production — it would reject preview and development deployments.

[Notes and limitations](#notes-and-limitations)
-----------------------------------------------

* **App-scoped tokens.** The helpers act as the application itself (`subject: { type: "app" }`). End-user OAuth is a separate concern.
* **Freshness and replay.** OIDC verification replaces each provider's native signature (and timestamp) check, so request freshness relies on the short-lived OIDC token's expiry rather than a signed timestamp, and there is no built-in delivery de-duplication. Keep your webhook handlers idempotent.
* **Socket Mode is incompatible.** Connect trigger forwarding is HTTP-only; it doesn't apply to the Slack adapter's Socket Mode.
* **Testing.** Connect forwards to deployed URLs, not `localhost` — test against a preview or development deployment.

[Related resources](#related-resources)
---------------------------------------

* [Vercel Connect Chat SDK documentation](https://vercel.com/docs/connect/frameworks/chat-sdk)
* [The Complete Guide to Vercel Connect](https://vercel.com/kb/guide/vercel-connect)
* [Vercel Connect overview](https://vercel.com/docs/connect)
* [Vercel Connect triggers](https://vercel.com/docs/connect/concepts/triggers)
* [`@vercel/connect` SDK reference](https://vercel.com/docs/connect/ts-sdk-reference)

[Read more](#read-more)
-----------------------

[### Creating a Chat Instance

Initialize the Chat class with adapters, state, and configuration options.](/docs/usage)[### Error Handling

Handle rate limits, unsupported features, and other errors from adapters.](/docs/error-handling)[### Testing

Test your bot handlers and custom adapters with @chat-adapter/tests — Vitest factories, custom matchers, and a setup file.](/docs/testing)[### Threads, Messages, and Channels

Work with threads, messages, and channels across platforms.](/docs/threads-messages-channels)
