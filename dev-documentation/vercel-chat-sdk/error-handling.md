---
title: "Error Handling"
source_url: https://chat-sdk.dev/docs/error-handling
section: error-handling
crawled: 2026-09-20
---

# Error Handling

> Source: https://chat-sdk.dev/docs/error-handling

The SDK provides typed error classes for common failure scenarios. All errors are importable from the `chat` package.

```
import { ChatError, RateLimitError, NotImplementedError, LockError } from "chat";
```

[Error types](#error-types)
---------------------------

### [ChatError](#chaterror)

Base error class for all SDK errors. Every error below extends `ChatError`. The `code` property carries a machine-readable identifier you can branch on:

| Code | Thrown by | Meaning |
| --- | --- | --- |
| `NOT_SUPPORTED` | `bot.openDM`, `bot.getUser` | The resolved adapter doesn't implement this method |
| `INVALID_THREAD_ID` | `bot.thread`, internal routing | Thread ID does not match the `adapter:channel:thread` shape |
| `INVALID_CHANNEL_ID` | `bot.channel` | Channel ID does not match the `adapter:channel` shape |
| `ADAPTER_NOT_FOUND` | `bot.thread`, `bot.channel` | Thread/channel ID references an adapter that wasn't registered on this `Chat` instance |
| `AMBIGUOUS_USER_ID` | `bot.getUser`, `bot.openDM` | Numeric user ID could match more than one registered adapter (Discord/Telegram/GitHub) |
| `UNKNOWN_USER_ID_FORMAT` | `bot.getUser`, `bot.openDM` | The `userId` doesn't match any platform's known ID format |
| `RATE_LIMITED` | Any platform call | Platform returned 429; see `RateLimitError` below |
| `NOT_IMPLEMENTED` | Any platform call | The adapter doesn't implement this feature; see `NotImplementedError` below |
| `LOCK_FAILED` | Inbound message routing | Distributed lock was busy; see `LockError` below |

Prop

Type

`message?`string

`code?`string

`cause?`unknown | undefined

### [RateLimitError](#ratelimiterror)

Thrown when a platform API returns a 429 response. The `retryAfterMs` property tells you how long to wait before retrying.

lib/bot.ts

```
import { RateLimitError } from "chat";

try {
  await thread.post("Hello!");
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(`Rate limited, retry after ${error.retryAfterMs}ms`);
  }
}
```

Prop

Type

`code?`string

`retryAfterMs?`number | undefined

### [NotImplementedError](#notimplementederror)

Thrown when you call a feature that a platform doesn't support. For example, calling `addReaction()` on Teams or `schedule()` on adapters without native scheduling support.

lib/bot.ts

```
import { NotImplementedError } from "chat";

try {
  await thread.addReaction(emoji.thumbs_up);
} catch (error) {
  if (error instanceof NotImplementedError) {
    console.log(`Feature not supported: ${error.feature}`);
  }
}
```

Prop

Type

`code?`string

`feature?`string | undefined

See the [feature matrix](/docs/platform-adapters) for which features are supported on each platform.

### [LockError](#lockerror)

Thrown when the SDK fails to acquire a distributed lock on a thread (used to prevent concurrent processing of messages in the same thread). You can control this behavior with the [`onLockConflict`](/docs/usage#configuration-options) option — set it to `'force'` to release the existing lock instead of throwing.

Prop

Type

`code?`string

[Adapter errors](#adapter-errors)
---------------------------------

Adapters also throw specialized errors from the `@chat-adapter/shared` package:

| Error | Code | Description |
| --- | --- | --- |
| `AdapterRateLimitError` | `RATE_LIMITED` | Platform rate limit hit, includes `retryAfter` in seconds |
| `AuthenticationError` | `AUTH_FAILED` | Invalid or expired credentials |
| `ResourceNotFoundError` | `NOT_FOUND` | Requested resource (channel, message) doesn't exist |
| `PermissionError` | `PERMISSION_DENIED` | Bot lacks required permissions/scopes |
| `ValidationError` | `VALIDATION_ERROR` | Invalid input data (e.g. message too long) |
| `NetworkError` | `NETWORK_ERROR` | Connectivity issue with platform API |

[Catching errors](#catching-errors)
-----------------------------------

Use `instanceof` to handle specific error types:

lib/bot.ts

```
import { RateLimitError, NotImplementedError } from "chat";

bot.onNewMention(async (thread, message) => {
  try {
    await thread.post("Processing...");
    await thread.addReaction(emoji.eyes);
  } catch (error) {
    if (error instanceof RateLimitError) {
      // Wait and retry
      await new Promise((r) => setTimeout(r, error.retryAfterMs ?? 5000));
      await thread.post("Processing...");
    } else if (error instanceof NotImplementedError) {
      // Skip unsupported features gracefully
    } else {
      throw error;
    }
  }
});
```

[Propagating webhook handler errors](#propagating-webhook-handler-errors)
-------------------------------------------------------------------------

Message, action, and slash command handler errors are logged but, by default, tasks passed to `waitUntil` fulfill. Hosts that collect and await those tasks can opt in to observing failures and choose an error response:

```
const tasks: Promise<unknown>[] = [];
const response = await chat.webhooks.slack(request, {
  waitUntil: (task) => tasks.push(task),
  propagateHandlerErrors: true,
});
const results = await Promise.allSettled(tasks);

return results.some((result) => result.status === "rejected")
  ? new Response("Handler failed", { status: 500 })
  : response;
```

This option only exposes handler failures through the supplied promise. It does not automatically change a webhook response, including when using Vercel's native `waitUntil`.

Keep handlers short when awaiting them before responding. [Slack requires acknowledgement within three seconds](https://docs.slack.dev/apis/events-api/#responding-to-events), so move long-running work outside the webhook response path.

Error propagation does not guarantee retries or durable delivery. SDK deduplication can skip redelivered events after a handler fails, so returning `500` alone does not ensure the handler runs again.

[Read more](#read-more)
-----------------------

[### Creating a Chat Instance

Initialize the Chat class with adapters, state, and configuration options.](/docs/usage)[### Testing

Test your bot handlers and custom adapters with @chat-adapter/tests — Vitest factories, custom matchers, and a setup file.](/docs/testing)[### Threads, Messages, and Channels

Work with threads, messages, and channels across platforms.](/docs/threads-messages-channels)[### Handling Events

Register handlers for mentions, messages, reactions, member joins, and platform-specific events.](/docs/handling-events)
