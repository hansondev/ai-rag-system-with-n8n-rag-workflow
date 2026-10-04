---
title: "Introduction"
source_url: https://chat-sdk.dev/docs
section: docs
crawled: 2026-09-20
---

# Introduction

> Source: https://chat-sdk.dev/docs

Chat SDK is a TypeScript library for building chat bots that work across multiple platforms with a single codebase. Write your bot logic once and deploy it wherever you have an [adapter](/adapters).

[Why Chat SDK?](#why-chat-sdk)
------------------------------

Building a chat bot that works across multiple platforms typically means maintaining separate codebases, learning different APIs, and handling platform-specific quirks individually. Chat SDK abstracts these differences behind a unified interface.

* **Single codebase** for all platforms
* **Type-safe** [adapters](/adapters) and event handlers with full TypeScript support
* **Event-driven** architecture with handlers for mentions, messages, reactions, button clicks, slash commands, and modals
* **Thread subscriptions** for multi-turn conversations
* **Rich UI** with JSX cards, buttons, and modals that render natively on each platform
* **AI streaming** with first-class support for streaming LLM responses
* **Serverless-ready** with distributed state via Redis and message deduplication

[How it works](#how-it-works)
-----------------------------

Chat SDK has three core concepts:

1. **Chat** — the main entry point that coordinates [adapters](/adapters) and routes events to your handlers
2. **[Adapters](/adapters)** — platform-specific implementations that handle webhook parsing, message formatting, and API calls
3. **State** — a pluggable persistence layer for thread subscriptions and distributed locking

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

Each adapter factory auto-detects credentials from environment variables (`SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, `REDIS_URL`, etc.), so you can get started with zero config. Pass explicit values to override.

[Adapters](#adapters)
---------------------

Install only the adapters you need. Browse the full catalog on the [Adapters](/adapters) page, and compare official platform features on [Platform Adapters](/docs/platform-adapters#feature-matrix).

[### Platform Adapters

Connect your bot to messaging platforms with webhook verification, parsing, and native formatting.](/docs/platform-adapters)[### State Adapters

Persist thread subscriptions, distributed locks, and caches across restarts.](/docs/state-adapters)

[AI coding agents](#ai-coding-agents)
-------------------------------------

If you use an AI coding agent such as OpenAI Codex, Claude Code, or Cursor, install the Chat SDK skill so it knows the SDK APIs, adapter patterns, and project conventions before writing code.

```
npx skills add vercel/chat
```

The skill references bundled documentation in `node_modules/chat/docs`, plus adapter guides and starter templates in the published package.

You can also install the [Vercel Plugin](https://vercel.com/plugin) for a broader agent toolkit. It includes the Chat SDK skill alongside specialist agents, slash commands, and more:

```
npx plugins add vercel/vercel-plugin
```

For agent-readable documentation, see [llms.txt](/llms.txt) (page index) or [llms-full.txt](/llms-full.txt) (full text).

[Contributing](#contributing)
-----------------------------

Ship an adapter for a new platform, or list a vendor-maintained one in the catalog.

[### Build an adapter

Implement the Adapter interface for any messaging platform or state backend.](/docs/contributing/building)[### List a vendor-official adapter

How platform vendors qualify and list a maintained adapter in the Vendor Official tier.](/docs/contributing/vendor-official)

[Read more](#read-more)
-----------------------

[### Getting Started

Pick a guide to start building with Chat SDK.](/docs/getting-started)[### Creating a Chat Instance

Initialize the Chat class with adapters, state, and configuration options.](/docs/usage)[### Overview

API reference for the Chat SDK core package.](/docs/api)[### Overview

AI utilities that ship with Chat SDK — agent tools, message conversion, and supporting types.](/docs/ai)
