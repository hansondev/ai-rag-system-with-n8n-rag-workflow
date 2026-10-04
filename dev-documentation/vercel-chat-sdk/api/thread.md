---
title: "Thread"
source_url: https://chat-sdk.dev/docs/api/thread
section: api
crawled: 2026-09-20
---

# Thread

> Source: https://chat-sdk.dev/docs/api/thread

A `Thread` is provided to your event handlers and represents a conversation thread on any platform. You can also create thread handles directly using `chat.thread()` or `chat.openDM()`.

[Properties](#properties)
-------------------------

Prop

Type

`id?`string

`channelId?`string

`adapter?`Adapter

`isDM?`boolean

`channel?`Channel

`recentMessages?`Message[]

[post](#post)
-------------

Post a message to the thread. Accepts strings, structured messages, cards, streams, and `PostableObject` instances (`Plan`, `StreamingPlan`).

```
// Plain text
await thread.post("Hello!");

// Markdown
await thread.post({ markdown: "**Bold** text" });

// AST
await thread.post({ ast: root([paragraph([text("Hello")])]) });

// Card
await thread.post(Card({ title: "Hi", children: [Text("Hello")] }));

// Stream (AI SDK fullStream recommended for multi-step agents)
// TanStack AI chat() streams are also accepted
await thread.post(result.fullStream);

// Plan (mutable task list)
const plan = new Plan({ initialMessage: "Working..." });
await thread.post(plan);
await plan.addTask({ title: "Step 1" });

// Streaming with platform options
await thread.post(new StreamingPlan(stream, { groupTasks: "plan" }));
```

**Parameters:** `message: string | PostableMessage | CardJSXElement`

**Returns:** `Promise<SentMessage | PostableObject>` — for plain messages and streams, a `SentMessage` with `edit()`, `delete()`, `addReaction()`, and `removeReaction()` methods; for `Plan` / `StreamingPlan` inputs, the same object is returned so you can keep mutating it.

See [Posting Messages](/docs/posting-messages) for details on each format.

[reply](#reply)
---------------

Post a message with a native reference to another message.

```
await thread.reply(message, {
  markdown: "Thanks, I can help with that.",
});
```

**Parameters:** `target: string | Message`, `message: string | AdapterPostableMessage | AsyncIterable<string | StreamChunk | StreamEvent> | CardJSXElement`

**Returns:** `Promise<SentMessage>`

The target `Message` must belong to the same thread. Streams are buffered before sending. Unlike `post()`, `reply()` does not accept `Plan` or `StreamingPlan`. Adapters without native message reply support throw `NotImplementedError`.

Prefer passing the `Message` over its ID. The `Message` is checked against this thread and carried through to `SentMessage.replyTo` and cached thread history. A bare ID is only resolved to a `Message` when the thread already holds it in `recentMessages`; otherwise the reply is still sent, but `replyTo` is left undefined.

[postEphemeral](#postephemeral)
-------------------------------

Post a message visible only to a specific user.

```
await thread.postEphemeral(userId, "Only you can see this", {
  fallbackToDM: true,
});
```

Prop

Type

`user?`string | Author

`message?`AdapterPostableMessage | CardJSXElement

`options.fallbackToDM?`boolean

**Returns:** `Promise<EphemeralMessage | null>`

[schedule](#schedule)
---------------------

Schedule a message for future delivery. Currently only supported by the Slack adapter — other adapters throw `NotImplementedError`.

```
const scheduled = await thread.schedule("Reminder: standup in 5 minutes!", {
  postAt: new Date("2026-03-09T09:00:00Z"),
});

// Cancel before it's sent
await scheduled.cancel();
```

**Parameters:** `message: string | PostableMessage | CardJSXElement`, `options: { postAt: Date }`

**Returns:** `Promise<ScheduledMessage>`

Streaming and file uploads are not supported in scheduled messages.

[getParticipants](#getparticipants)
-----------------------------------

Get the unique human participants in a thread. Returns deduplicated authors, excluding all bots. Useful for subscribing only to 1:1 conversations and unsubscribing when others join.

```
const participants = await thread.getParticipants();

// Subscribe only when one person is talking to the bot
if (participants.length === 1) {
  await thread.subscribe();
}

// Unsubscribe when the thread becomes a group conversation
if (participants.length > 1) {
  await thread.unsubscribe();
}
```

Each call fetches the full message history to find all participants. On threads with long history this makes multiple API calls to the platform. Consider checking `message.author` against a known set before calling `getParticipants()` on every incoming message.

[subscribe / unsubscribe](#subscribe--unsubscribe)
--------------------------------------------------

Manage thread subscriptions. Subscribed non-DM threads route all messages to `onSubscribedMessage` handlers. DM threads route to `onDirectMessage` first when a direct message handler is registered.

```
await thread.subscribe();
await thread.unsubscribe();
const subscribed = await thread.isSubscribed();
```

Subscriptions persist across restarts via your state adapter.

[state](#state)
---------------

Store typed, per-thread state that persists across requests. State has a 30-day TTL.

```
// Read state
const state = await thread.state; // TState | null

// Merge into existing state
await thread.setState({ aiMode: true });

// Replace state entirely
await thread.setState({ aiMode: false }, { replace: true });
```

[startTyping](#starttyping)
---------------------------

Show a typing indicator in the thread. No-op on platforms that don't support
it. With Slack Agent messaging, calling this without a custom status sets the
session to `processing` and identifies the initiating user. Slack's native stop
button also requires the `agent_session_stopped` event subscription.

A custom status uses the legacy `assistant.threads.setStatus` compatibility
bridge for loading labels instead. That endpoint cannot receive the initiating
user, and an existing native processing indicator can take precedence over the
label. Use the default indicator when you need native session behavior.

```
await thread.startTyping();

// With custom status (Slack only)
await thread.startTyping("Searching documents...");
```

[signal](#signal)
-----------------

An `AbortSignal` for the active turn. Slack aborts it when the user clicks the
native agent-session stop button, including when the stop webhook reaches a
different serverless instance sharing the same state adapter.

Pass it to model and tool APIs so cancellation stops upstream work:

```
const result = await agent.stream({
  prompt: message.text,
  abortSignal: thread.signal,
});
await thread.post(result.fullStream);
```

Threads created outside an incoming handler expose a signal that remains
unaborted.

[markAsRead](#markasread)
-------------------------

Mark an inbound message as read. WhatsApp, Messenger, and XChat support this capability. Other adapters throw `NotImplementedError`.

Inside a message handler, omit the argument to mark the current message:

```
bot.onDirectMessage(async (thread) => {
  await thread.markAsRead();
});
```

Pass a `Message` or message ID when targeting a message explicitly:

```
await thread.markAsRead(message);
await thread.markAsRead(message.id);
```

A `Message` must belong to the thread, and passing one from another thread throws. A bare message ID is sent to the adapter as given, since there is nothing to check it against. Calling `markAsRead()` without an argument outside a message handler throws because there is no current message.

Platforms may advance the conversation's read state through the target message, which also marks earlier messages as read.

[messages / allMessages](#messages--allmessages)
------------------------------------------------

Iterate through message history.

```
// Newest first (auto-paginates)
for await (const msg of thread.messages) {
  console.log(msg.text);
}

// Oldest first (auto-paginates)
for await (const msg of thread.allMessages) {
  console.log(msg.text);
}
```

[refresh](#refresh)
-------------------

Re-fetch messages from the API and update `recentMessages`.

```
await thread.refresh();
```

[mentionUser](#mentionuser)
---------------------------

Get a platform-specific @-mention string for a user.

```
await thread.post(`Hey ${thread.mentionUser(userId)}, check this out!`);
```

[Serialization](#serialization)
-------------------------------

Threads can be serialized for workflow engines and external systems. The serialized thread includes the current message if one is available.

```
// Serialize
const json = thread.toJSON();

// Pass to a workflow
await workflow.start("my-workflow", {
  thread: thread.toJSON(),
});
```

The serialized format includes the thread ID, channel ID, adapter name, DM status, and the current message (if present).

### [Deserialization](#deserialization)

Use `bot.reviver()` as a `JSON.parse` reviver to automatically restore `Thread` and `Message` objects from serialized payloads:

```
const data = JSON.parse(payload, bot.reviver());
await data.thread.post("Hello from workflow!");
```

Under the hood, the reviver calls `ThreadImpl.fromJSON()` and `Message.fromJSON()` for any serialized objects it encounters.

[ScheduledMessage](#scheduledmessage)
-------------------------------------

Returned by `thread.schedule()` and `channel.schedule()`.

Prop

Type

`scheduledMessageId?`string

`channelId?`string

`postAt?`Date

`raw?`unknown

`cancel()?`() => Promise<void>

[SentMessage](#sentmessage)
---------------------------

Returned by `thread.post()`. Extends `Message` with mutation methods.

Prop

Type

`edit(newContent)?`(content: string | PostableMessage | CardJSXElement) => Promise<SentMessage>

`delete()?`() => Promise<void>

`addReaction(emoji)?`(emoji: EmojiValue | string) => Promise<void>

`removeReaction(emoji)?`(emoji: EmojiValue | string) => Promise<void>

[Read more](#read-more)
-----------------------

[### Threads, Messages, and Channels

Work with threads, messages, and channels across platforms.](/docs/threads-messages-channels)[### Posting Messages

Different ways to render and send messages with thread.post().](/docs/posting-messages)[### Channel

Channel container that holds threads, with methods for listing, posting, and iteration.](/docs/api/channel)[### Message

Normalized message format with text, AST, author, and metadata.](/docs/api/message)
