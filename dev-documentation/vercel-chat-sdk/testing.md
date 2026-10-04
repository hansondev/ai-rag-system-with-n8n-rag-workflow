---
title: "Testing"
source_url: https://chat-sdk.dev/docs/testing
section: testing
crawled: 2026-09-20
---

# Testing

> Source: https://chat-sdk.dev/docs/testing

The [`@chat-adapter/tests`](https://www.npmjs.com/package/@chat-adapter/tests) package gives you Vitest factories, custom matchers, and a setup file for testing bots and custom adapters built on Chat SDK.

[Install](#install)
-------------------

```
pnpm add -D @chat-adapter/tests
```

`chat` and `vitest` are peer dependencies — they should already be in your project.

[Setup file (recommended)](#setup-file-recommended)
---------------------------------------------------

Auto-register all matchers by adding the package's setup file to your Vitest config:

vitest.config.ts

```
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["@chat-adapter/tests/setup"],
  },
});
```

Without the setup file, register matchers manually:

```
import { matchers } from "@chat-adapter/tests/matchers";
expect.extend(matchers);
```

[Mock factories](#mock-factories)
---------------------------------

```
import {
  createMockAdapter,
  createMockChatInstance,
  createMockState,
  createTestMessage,
  mockLogger,
} from "@chat-adapter/tests";
```

| Factory | Returns | Notes |
| --- | --- | --- |
| `createMockAdapter(name?, overrides?)` | `Adapter` | Every method is `vi.fn()` with sensible defaults |
| `createMockChatInstance(options?)` | `ChatInstance` | Every `process*` handler is `vi.fn()`; `getState`/`getUserName`/`getLogger` wired up |
| `createMockState()` | `MockStateAdapter` | In-memory `Map`s for subscriptions, locks, KV, lists, queues; `cache` exposes the underlying map |
| `createTestMessage(id, text, overrides?)` | `Message` | Markdown text is parsed into the formatted AST |
| `mockLogger` / `createMockLogger()` | `Logger` | Shared default vs fresh-per-call |

[Matchers](#matchers)
---------------------

| Matcher | Asserts |
| --- | --- |
| `expect(adapter).toHavePosted(threadId, textPattern?)` | `adapter.postMessage` was called for this thread |
| `expect(adapter).toHaveEdited(threadId, messageId, textPattern?)` | `adapter.editMessage` was called for this message |
| `expect(adapter).toHaveDeleted(threadId, messageId)` | `adapter.deleteMessage` was called for this message |
| `expect(adapter).toHaveReactedWith(threadId, messageId, emoji)` | `adapter.addReaction` was called with the emoji (string or `EmojiValue.name`) |
| `expect(adapter).toHaveStartedTyping(threadId)` | `adapter.startTyping` was called for this thread |
| `expect(adapter).toHavePostedToChannel(channelId, textPattern?)` | `adapter.postChannelMessage` was called for this channel |
| `expect(chat).toHaveDispatched(handler)` | The named `process*` handler on the mock `ChatInstance` was called |
| `expect(state).toBeSubscribedTo(threadId)` | `state.isSubscribed(threadId)` resolves to `true` (async — `await expect(...)`) |

Text-pattern matchers extract a comparable string from `AdapterPostableMessage` — strings directly, `PostableMarkdown.markdown`, `PostableRaw.raw`, and `PostableCard.fallbackText`. AST-shaped messages and cards without `fallbackText` aren't text-matchable; assert without `textPattern` and inspect `mock.calls` directly.

[Bot authors: test your handlers](#bot-authors-test-your-handlers)
------------------------------------------------------------------

When you're building a bot on top of Chat SDK, the kit lets you exercise your handlers without a real Slack/Teams/etc. webhook on the wire:

bot.test.ts

```
import { describe, expect, it } from "vitest";
import { Chat } from "chat";
import { createMockAdapter, createMockState } from "@chat-adapter/tests";

describe("bot handlers", () => {
  it("replies with a greeting on mention", async () => {
    const slack = createMockAdapter("slack");
    const state = createMockState();
    const bot = new Chat({
      userName: "mybot",
      adapters: { slack },
      state,
    });

    bot.onNewMention(async (thread) => {
      await thread.post("hello there");
    });

    // Drive a synthesized mention through the bot…
    // (use your adapter's webhook path or a thread-level call)

    expect(slack).toHavePosted("slack:C1:t1", /hello there/);
  });
});
```

[Adapter authors: test webhook → dispatch](#adapter-authors-test-webhook--dispatch)
-----------------------------------------------------------------------------------

When you're building a custom `Adapter`, the kit gives you a `ChatInstance` mock you can hand to your adapter and assert that webhooks route through the right `process*` hook with the right normalized payload:

adapter.test.ts

```
import { describe, expect, it } from "vitest";
import { createMockChatInstance } from "@chat-adapter/tests";
import { MyAdapter } from "./adapter";

describe("MyAdapter.handleWebhook", () => {
  it("dispatches incoming messages through processMessage", async () => {
    const chat = createMockChatInstance();
    const adapter = new MyAdapter({ /* config */ });
    await adapter.initialize(chat);

    const request = new Request("https://example.com/webhook", {
      method: "POST",
      body: JSON.stringify({ /* platform-specific payload */ }),
      headers: { "content-type": "application/json" },
    });
    const response = await adapter.handleWebhook(request);

    expect(response.status).toBe(200);
    expect(chat).toHaveDispatched("processMessage");
  });
});
```

[Adapter-specific helpers](#adapter-specific-helpers)
-----------------------------------------------------

Helpers that depend on a specific platform's wire format (signed Slack webhooks, Teams claim builders, etc.) live in each adapter's own `/testing` subpath rather than in this kit, so adopting `@chat-adapter/tests` doesn't pull in adapter dependencies you don't use.

If you're contributing adapters or core to this repo, see the [Testing adapters contributing guide](/docs/contributing/testing) for hand-rolled patterns used inside `packages/`.

[Read more](#read-more)
-----------------------

[### State Adapters

Pluggable state adapters for thread subscriptions, distributed locking, and caching.](/docs/state-adapters)[### Handling Events

Register handlers for mentions, messages, reactions, member joins, and platform-specific events.](/docs/handling-events)[### Testing adapters

Write unit tests, integration tests, and replay tests for community Chat SDK adapters.](/docs/contributing/testing)[### Getting Started

Pick a guide to start building with Chat SDK.](/docs/getting-started)
