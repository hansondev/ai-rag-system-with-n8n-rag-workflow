---
title: "Channel"
source_url: https://chat-sdk.dev/docs/api/channel
section: api
crawled: 2026-09-20
---

# Channel

> Source: https://chat-sdk.dev/docs/api/channel

A `Channel` represents a channel or conversation container that holds threads. Both `Thread` and `Channel` extend the shared `Postable` interface, so they share common methods like `post()`, `state`, and `messages`.

Get a channel via `thread.channel` or `chat.channel()`:

```
// Navigate from a thread
const channel = thread.channel;

// Get directly by ID
const channel = chat.channel("slack:C123ABC");
```

[Properties](#properties)
-------------------------

Prop

Type

`id?`string

`name?`string | null

`adapter?`Adapter

`isDM?`boolean

[Channel ID format](#channel-id-format)
---------------------------------------

Channel IDs are derived from thread IDs by dropping the thread-specific part. By default, this is the first two colon-separated segments:

| Platform | Thread ID | Channel ID |
| --- | --- | --- |
| Slack | `slack:C123ABC:1234567890.123456` | `slack:C123ABC` |
| Teams | `teams:{base64(conversationId)}:{base64(serviceUrl)}[:{conversationType}]` | `teams:{base64(conversationId)}:{base64(serviceUrl)}[:{conversationType}]` |
| Google Chat | `gchat:spaces/ABC123:{base64}` | `gchat:spaces/ABC123` |
| Discord | `discord:{guildId}:{channelId}/{messageId}` | `discord:{guildId}` |

[messages](#messages)
---------------------

Iterate channel-level messages (top-level, not thread replies) newest first. Auto-paginates lazily.

```
for await (const msg of channel.messages) {
  console.log(msg.text);
}
```

[threads](#threads)
-------------------

Iterate threads in the channel, most recently active first. Returns lightweight `ThreadSummary` objects.

```
for await (const thread of channel.threads()) {
  console.log(thread.rootMessage.text, thread.replyCount);
}
```

### [ThreadSummary](#threadsummary)

Prop

Type

`id?`string

`rootMessage?`Message

`replyCount?`number | undefined

`lastReplyAt?`Date | undefined

[post](#post)
-------------

Post a message to the channel top-level (not in a thread).

```
await channel.post("Hello channel!");
await channel.post({ markdown: "**Announcement**: New release!" });
```

Accepts the same message formats as `thread.post()` — see [PostableMessage](/docs/api/postable-message).

[schedule](#schedule)
---------------------

Schedule a message for future delivery to the channel top-level. Currently only supported by the Slack adapter — other adapters throw `NotImplementedError`.

```
const scheduled = await channel.schedule("Weekly reminder: update your status!", {
  postAt: new Date("2026-03-10T09:00:00Z"),
});

// Cancel before it's sent
await scheduled.cancel();
```

Accepts the same message formats as `channel.post()` (except streaming). See [ScheduledMessage](/docs/api/thread#scheduledmessage) for the return type.

[fetchMetadata](#fetchmetadata)
-------------------------------

Fetch channel metadata from the platform.

```
const info = await channel.fetchMetadata();
console.log(info.name, info.memberCount);
```

### [ChannelInfo](#channelinfo)

Prop

Type

`id?`string

`name?`string | undefined

`isDM?`boolean | undefined

`memberCount?`number | undefined

`metadata?`Record<string, unknown>

[state](#state)
---------------

Store typed, per-channel state. Works the same as thread state with a 30-day TTL.

```
const state = await channel.state;
await channel.setState({ lastAnnouncement: new Date().toISOString() });
```

[postEphemeral](#postephemeral)
-------------------------------

Post a message visible only to a specific user.

```
await channel.postEphemeral(userId, "Only you can see this", {
  fallbackToDM: true,
});
```

[startTyping](#starttyping)
---------------------------

Show a typing indicator. No-op on platforms that don't support it. On Slack, you can pass an optional `status` string to show a custom loading message (requires `assistant:write` scope).

```
await channel.startTyping();

// With custom status (Slack only)
await channel.startTyping("Searching documents...");
```

[mentionUser](#mentionuser)
---------------------------

Get a platform-specific @-mention string.

```
await channel.post(`Hey ${channel.mentionUser(userId)}, check this out!`);
```

[Read more](#read-more)
-----------------------

[### Threads, Messages, and Channels

Work with threads, messages, and channels across platforms.](/docs/threads-messages-channels)[### Message

Normalized message format with text, AST, author, and metadata.](/docs/api/message)[### PostableMessage

The union type accepted by thread.post() for sending messages.](/docs/api/postable-message)[### Transcripts (deprecated)

Cross-platform per-user transcript persistence — configuration, methods, and entry shape.](/docs/api/transcripts)
