---
title: "Direct Messages"
source_url: https://chat-sdk.dev/docs/direct-messages
section: direct-messages
crawled: 2026-09-20
---

# Direct Messages

> Source: https://chat-sdk.dev/docs/direct-messages

Open direct message conversations with users using `bot.openDM()`. For globally recognizable user IDs, the adapter is automatically inferred from the ID format.

[DM behavior](#dm-behavior)
---------------------------

DMs behave slightly differently from channel messages:

* **Direct message handlers** — if you register `onDirectMessage`, every incoming DM routes there before `onSubscribedMessage`, `onNewMention`, and pattern handlers. This keeps DM-centric flows like WhatsApp conversations, Telegram DMs, and web chat on one consistent handler.
* **Mention fallback** — if no `onDirectMessage` handlers are registered, DMs continue through normal routing. Unsubscribed DMs are treated as mentions, so existing `onNewMention` bots keep working without requiring the user to @-mention the bot.
* **Per-conversation threading** — Each top-level DM starts a new conversation. Thread replies within a DM continue the same conversation, giving you the same per-thread isolation as channels.

[Handle incoming DMs](#handle-incoming-dms)
-------------------------------------------

lib/bot.ts

```
bot.onDirectMessage(async (thread, message) => {
  await thread.post(`You said: ${message.text}`);
});
```

[Open a DM](#open-a-dm)
-----------------------

### [From an Author object](#from-an-author-object)

The most common pattern — use the `author` from an incoming message:

lib/bot.ts

```
bot.onSubscribedMessage(async (thread, message) => {
  if (message.text === "DM me") {
    const dmThread = await bot.openDM(message.author);
    await dmThread.post("Hello! This is a private message.");
  }
});
```

### [From a user ID](#from-a-user-id)

Pass a user ID string directly. The adapter is inferred from the ID format:

lib/bot.ts

```
const dmThread = await bot.openDM("U1234567890"); // Slack
```

| Format | Platform |
| --- | --- |
| `U...` / `W...` | Slack |
| `29:...` | Teams |
| `users/...` | Google Chat |
| Numeric ID | Discord or Telegram |

Numeric IDs can be ambiguous when multiple numeric-ID adapters are registered. For platforms whose user IDs are not globally distinguishable, call the adapter directly and wrap the returned thread ID with `bot.thread()`.

lib/bot.ts

```
const threadId = await bot.getAdapter("whatsapp").openDM("15551234567");
const dmThread = bot.thread(threadId);
```

[Check if a thread is a DM](#check-if-a-thread-is-a-dm)
-------------------------------------------------------

lib/bot.ts

```
bot.onSubscribedMessage(async (thread, message) => {
  if (thread.isDM) {
    await thread.post("This is a private conversation.");
  }
});
```

[Read more](#read-more)
-----------------------

[### Creating a Chat Instance

Initialize the Chat class with adapters, state, and configuration options.](/docs/usage)[### Ephemeral Messages

Send messages visible only to a specific user.](/docs/ephemeral-messages)[### File Uploads

Send and receive files across chat platforms.](/docs/files)[### History

Store and retrieve message history across user, thread, and channel scopes.](/docs/history)
