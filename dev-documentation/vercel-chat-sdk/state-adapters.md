---
title: "State Adapters"
source_url: https://chat-sdk.dev/docs/state-adapters
section: state-adapters
crawled: 2026-09-20
---

# State Adapters

> Source: https://chat-sdk.dev/docs/state-adapters

State adapters handle persistent storage for thread subscriptions, distributed locks (to prevent duplicate processing), and caching. You must provide a state adapter when creating a `Chat` instance. Browse all available state adapters on the [Adapters](/adapters) page.

[What state adapters manage](#what-state-adapters-manage)
---------------------------------------------------------

### [Thread subscriptions](#thread-subscriptions)

When your bot calls `thread.subscribe()`, the state adapter persists that subscription. On subsequent webhooks, the SDK checks subscriptions to route messages to `onSubscribedMessage` handlers. With a production adapter, subscriptions survive restarts and work across multiple instances.

### [Distributed locking](#distributed-locking)

When a webhook arrives, the SDK acquires a lock on the thread to prevent duplicate processing. This is critical for serverless deployments where multiple instances may receive the same event.

By default, if a lock is already held, the incoming message is dropped with a `LockError`. For long-running handlers (e.g. AI agent streaming), you can configure `onLockConflict: 'force'` to force-release the existing lock and allow the new message through:

```
const chat = new Chat({
  userName: 'my-bot',
  adapters: { slack },
  state: createRedisState(),
  onLockConflict: 'force',
});
```

You can also pass a callback for custom logic:

```
onLockConflict: (threadId, message) => {
  return message.text.includes('stop') ? 'force' : 'drop';
}
```

Note that force-releasing a lock does not cancel the previous handler — it continues running. Only the lock is released, so two handlers may briefly run concurrently on the same thread.

### [Caching](#caching)

State adapters provide key-value storage with TTL for thread state (`thread.setState()`), message deduplication, and other internal caching.

[### Build an adapter

Implement a state adapter for subscriptions, locks, and caching.](/docs/contributing/building)[### List a vendor-official adapter

How platform vendors qualify and list a maintained adapter in the Vendor Official tier.](/docs/contributing/vendor-official)

[Read more](#read-more)
-----------------------

[### Overlapping Messages

Control how overlapping messages on the same thread are handled - burst, queue, debounce, drop, or process concurrently.](/docs/concurrency)[### History

Store and retrieve message history across user, thread, and channel scopes.](/docs/history)[### Testing

Test your bot handlers and custom adapters with @chat-adapter/tests — Vitest factories, custom matchers, and a setup file.](/docs/testing)[### Getting Started

Pick a guide to start building with Chat SDK.](/docs/getting-started)
