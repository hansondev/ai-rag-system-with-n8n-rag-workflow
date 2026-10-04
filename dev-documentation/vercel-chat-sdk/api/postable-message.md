---
title: "PostableMessage"
source_url: https://chat-sdk.dev/docs/api/postable-message
section: api
crawled: 2026-09-20
---

# PostableMessage

> Source: https://chat-sdk.dev/docs/api/postable-message

`PostableMessage` is the union of all message formats accepted by `thread.post()` and `sent.edit()`.

```
type PostableMessage =
  | AdapterPostableMessage
  | AsyncIterable<string | StreamChunk | StreamEvent>
  | PostableObject;
```

`PostableObject` covers `Plan` (mutable task lists) and `StreamingPlan` (streams with platform-specific options) — both documented below.

[String](#string)
-----------------

Raw text passed through as-is to the platform.

```
await thread.post("Hello world");
```

[PostableRaw](#postableraw)
---------------------------

Explicit raw text — behaves the same as a plain string.

```
await thread.post({ raw: "Hello world" });
```

Prop

Type

`raw?`string

`attachments?`Attachment[]

`files?`FileUpload[]

[PostableMarkdown](#postablemarkdown)
-------------------------------------

Markdown converted to each platform's native format.

```
await thread.post({ markdown: "**Bold** and _italic_" });
```

Prop

Type

`markdown?`string

`attachments?`Attachment[]

`files?`FileUpload[]

[PostableAst](#postableast)
---------------------------

mdast AST converted to each platform's native format. See [Markdown](/docs/api/markdown) for builder functions.

```
import { root, paragraph, text, strong } from "chat";

await thread.post({
  ast: root([paragraph([strong([text("Hello")])])]),
});
```

Prop

Type

`ast?`Root

`attachments?`Attachment[]

`files?`FileUpload[]

[PostableCard](#postablecard)
-----------------------------

Rich card with interactive elements. See [Cards](/docs/api/cards) for components.

```
import { Card, Text } from "chat";

await thread.post(Card({ title: "Hello", children: [Text("World")] }));
```

You can also pass a card with explicit fallback text:

```
await thread.post({
  card: Card({ title: "Hello", children: [Text("World")] }),
  fallbackText: "Hello — World",
});
```

Prop

Type

`card?`CardElement

`fallbackText?`string | undefined

`files?`FileUpload[]

[Plan](#plan)
-------------

A `Plan` is a step-by-step task list that mutates after posting. Each `addTask` / `updateTask` / `complete` call re-renders the same message in place. See [Plan API](/docs/streaming#plan-api) for full usage.

```
import { Plan } from "chat";

const plan = new Plan({ initialMessage: "Researching options..." });
await thread.post(plan);
await plan.addTask({ title: "Look up records" });
await plan.complete({ completeMessage: "Done!" });
```

Adapters that don't support `PostableObject` editing render the plan as fallback text and ignore subsequent mutations.

[StreamingPlan](#streamingplan)
-------------------------------

Wraps an async iterable with platform-specific streaming options. Use this when you need to pass options like task grouping or stop blocks through `thread.post()`. See [Streaming with options](/docs/streaming#streaming-with-options).

```
import { StreamingPlan } from "chat";

const planned = new StreamingPlan(stream, {
  groupTasks: "plan",
  endWith: [feedbackBlock],
  updateIntervalMs: 750,
});

await thread.post(planned);
```

Prop

Type

`groupTasks?`"plan" | "timeline" | undefined

`endWith?`unknown[] | undefined

`updateIntervalMs?`number | undefined

[AsyncIterable (streaming)](#asynciterable-streaming)
-----------------------------------------------------

An async iterable of strings, `StreamChunk` objects, or stream events. The SDK streams the message in real time using platform-native APIs where available.

You can yield structured `StreamChunk` objects for rich content like task progress cards on platforms that support it (Slack). See [Streaming](/docs/streaming#structured-streaming-chunks-slack-only) for details.

Both AI SDK stream types and TanStack AI streams are supported:

```
// fullStream (recommended) — preserves step boundaries in multi-step agents
const result = await agent.stream({ prompt: message.text });
await thread.post(result.fullStream);

// textStream — plain string chunks
await thread.post(result.textStream);

// TanStack AI: the stream returned by chat()
await thread.post(chat({ adapter, messages }));
```

When using `fullStream`, the SDK auto-detects `text-delta` and `finish-step` events, extracting text and inserting paragraph breaks between agent steps. AG-UI `TEXT_MESSAGE_CONTENT` and `TEXT_MESSAGE_END` events from TanStack AI are handled the same way: deltas become text and each message end becomes a paragraph break between tool-loop turns.

[FileUpload](#fileupload)
-------------------------

Used in the `files` field of any structured message format.

Prop

Type

`data?`Buffer | Blob | ArrayBuffer

`filename?`string

`mimeType?`string | undefined

[Read more](#read-more)
-----------------------

[### Posting Messages

Different ways to render and send messages with thread.post().](/docs/posting-messages)[### Streaming

Stream real-time text responses from AI models and other async sources to chat platforms.](/docs/streaming)[### Cards

Send rich interactive cards with buttons, fields, and images across all platforms.](/docs/cards)[### Transcripts (deprecated)

Cross-platform per-user transcript persistence — configuration, methods, and entry shape.](/docs/api/transcripts)
