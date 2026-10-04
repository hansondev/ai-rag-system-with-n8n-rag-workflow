---
title: "Creating a Chat Instance"
source_url: https://chat-sdk.dev/docs/usage
section: usage
crawled: 2026-09-20
---

# Creating a Chat Instance

> Source: https://chat-sdk.dev/docs/usage

The `Chat` class is the main entry point for your bot. It coordinates adapters, routes events to your handlers, and manages thread state.

[Basic setup](#basic-setup)
---------------------------

lib/bot.ts

```
import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createRedisState } from "@chat-adapter/state-redis";

const bot = new Chat({
  userName: "mybot",
  adapters: {
    slack: createSlackAdapter(),
  },
  state: createRedisState(),
});

bot.onNewMention(async (thread) => {
  await thread.subscribe();
  await thread.post("Hello! I'm listening to this thread.");
});
```

This example uses Redis. Chat SDK also supports [PostgreSQL](/adapters/official/postgres) and [ioredis](/adapters/official/ioredis) as production state adapters. See [State Adapters](/docs/state-adapters) for all options.

Each adapter factory auto-detects credentials from environment variables (`SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, `REDIS_URL`, etc.), so you can get started with zero config. Pass explicit values to override. For setup UIs and build scripts, the [`chat/adapters` catalog](/docs/adapters#adapter-catalog-chatadapters) lists official and vendor-official adapter env specs without importing adapter packages.

[Multiple adapters](#multiple-adapters)
---------------------------------------

Register multiple [adapters](/adapters) to deploy your bot across platforms simultaneously:

lib/bot.ts

```
import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createTeamsAdapter } from "@chat-adapter/teams";
import { createDiscordAdapter } from "@chat-adapter/discord";
import { createRedisState } from "@chat-adapter/state-redis";

const bot = new Chat({
  userName: "mybot",
  adapters: {
    slack: createSlackAdapter(),
    teams: createTeamsAdapter(),
    discord: createDiscordAdapter(),
  },
  state: createRedisState(),
});
```

Your event handlers work identically across all registered adapters — the SDK normalizes messages, threads, and reactions into a consistent format. Where platforms differ (rate limits or unsupported features), the SDK throws typed errors. See [Error Handling](/docs/error-handling).

[Configuration options](#configuration-options)
-----------------------------------------------

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `userName` | `string` | *required* | Default bot username across all adapters |
| `adapters` | `Record<string, Adapter>` | *required* | Map of adapter name to adapter instance |
| `state` | `StateAdapter` | *required* | State adapter for subscriptions and locking |
| `logger` | `Logger | LogLevel` | `"info"` | Logger instance or log level (`"debug"`, `"info"`, `"warn"`, `"error"`, `"silent"`) |
| `dedupeTtlMs` | `number` | `600000` | TTL in ms for message deduplication (10 minutes) |
| `concurrency` | `"drop" | "queue" | "debounce" | "burst" | "concurrent" | ConcurrencyConfig` | `"drop"` | Strategy for overlapping messages on the same thread |
| `streamingUpdateIntervalMs` | `number` | `500` | Update interval in ms for post+edit streaming |
| `fallbackStreamingPlaceholderText` | `string | null` | `"..."` | Placeholder text while streaming starts. Set to `null` to skip |
| `onLockConflict` | `'drop' | 'force' | (threadId, message) => 'drop' | 'force'` | `"drop"` | Behavior when a thread lock is already held. `'force'` releases the existing lock and re-acquires it, enabling interrupt/steerability for long-running handlers |

[Accessing adapters](#accessing-adapters)
-----------------------------------------

Use `getAdapter` to access platform-specific APIs when you need functionality beyond the unified interface:

lib/bot.ts

```
import type { SlackAdapter } from "@chat-adapter/slack";

const slack = bot.getAdapter("slack") as SlackAdapter;
await slack.setSuggestedPrompts(channelId, threadTs, [
  { title: "Get started", message: "What can you help me with?" },
]);
```

For typed access to the platform's native API client, use the SDK-named getter on each adapter:

lib/bot.ts

```
const slack = bot.getAdapter("slack").webClient; // WebClient
const linear = bot.getAdapter("linear").linearClient; // LinearClient
const github = bot.getAdapter("github").octokit; // Octokit
```

The previous `.client` getter still works as a deprecated alias on all three adapters.

See [`getAdapter`](/docs/api/chat#getadapter) for multi-tenant constraints.

[Webhook routing](#webhook-routing)
-----------------------------------

The `webhooks` property provides type-safe handlers for each registered adapter. Wire these up to your HTTP framework's routes:

app/api/webhooks/slack/route.ts

```
import { bot } from "@/lib/bot";

export const POST = bot.webhooks.slack;
```

app/api/webhooks/teams/route.ts

```
import { bot } from "@/lib/bot";

export const POST = bot.webhooks.teams;
```

[Lifecycle](#lifecycle)
-----------------------

The Chat instance initializes lazily on the first webhook. You can also initialize manually:

lib/bot.ts

```
await bot.initialize();
```

For graceful shutdown (e.g. in serverless teardown), call `shutdown`:

lib/bot.ts

```
await bot.shutdown();
```

[Singleton pattern](#singleton-pattern)
---------------------------------------

Register a singleton when you need to access the Chat instance from multiple files:

lib/bot.ts

```
const bot = new Chat({ /* ...config */ }).registerSingleton();
export default bot;
```

lib/utils.ts

```
import { Chat } from "chat";

const bot = Chat.getSingleton();
```

[Direct messaging](#direct-messaging)
-------------------------------------

Open a DM thread with a user by passing their platform user ID or an `Author` object:

lib/bot.ts

```
const dm = await bot.openDM("U123ABC");
await dm.post("Hey! Just wanted to follow up on your request.");
```

[Channel access](#channel-access)
---------------------------------

Get a channel directly by its ID:

lib/bot.ts

```
const channel = bot.channel("slack:C123ABC");
await channel.post("Announcement: deploy complete!");
```

[Read more](#read-more)
-----------------------

[### Handling Events

Register handlers for mentions, messages, reactions, member joins, and platform-specific events.](/docs/handling-events)[### Overview

Overview of Chat SDK adapters and the static adapter catalog.](/docs/adapters)[### State Adapters

Pluggable state adapters for thread subscriptions, distributed locking, and caching.](/docs/state-adapters)[### Chat

The main entry point for creating a multi-platform chat bot.](/docs/api/chat)
