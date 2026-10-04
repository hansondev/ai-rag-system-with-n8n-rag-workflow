---
title: "Message"
source_url: https://chat-sdk.dev/docs/api/message
section: api
crawled: 2026-09-20
---

# Message

> Source: https://chat-sdk.dev/docs/api/message

Incoming messages are normalized across all platforms into a consistent `Message` object.

```
import { Message } from "chat";
```

[Properties](#properties)
-------------------------

Prop

Type

`id?`string

`threadId?`string

`text?`string

`formatted?`Root

`raw?`unknown

`author?`Author

`metadata?`MessageMetadata

`attachments?`Attachment[]

`replyTo?`Message | undefined

`links?`LinkPreview[]

`isMention?`boolean | undefined

`subject?`Promise<MessageSubject | null>

[Author](#author)
-----------------

Prop

Type

`userId?`string

`userName?`string

`fullName?`string

`email?`string | undefined

`isBot?`boolean | "unknown"

`isMe?`boolean

`isSystem?`boolean | undefined

### [How `isMe` works](#how-isme-works)

Each adapter detects whether a message came from the bot itself. Chat SDK filters `isMe: true` messages before handlers run so bot replies do not loop back into `onNewMessage`, `onNewMention`, or subscribed-thread handlers.

`isMe` means "sent by this bot/runtime", not "sent by the authenticated user or account". For adapters backed by a user-owned account, do not blindly map platform fields like `fromMe` to `isMe`. Only set `isMe: true` for messages the adapter sent itself. If the platform echoes sent messages back through the webhook, track sent message IDs and mark only those echoes as `isMe: true`.

The detection logic varies by platform:

| Platform | Detection method |
| --- | --- |
| Slack | Checks `event.user === botUserId` (primary), then `event.bot_id === botId` (for `bot_message` subtypes). Both IDs are fetched during initialization via `auth.test`. |
| Teams | Checks `activity.from.id === appId` (exact match), then checks if `activity.from.id` ends with `:{appId}` (handles `28:{appId}` format). |
| Google Chat | Checks `message.sender.name === botUserId`. The bot user ID is learned dynamically from message annotations when the bot is first @-mentioned. |

All adapters return `false` if the bot ID isn't known yet. This is a safe default that prevents the bot from ignoring messages it should process.

[MessageMetadata](#messagemetadata)
-----------------------------------

Prop

Type

`dateSent?`Date

`edited?`boolean

`editedAt?`Date | undefined

[Attachment](#attachment)
-------------------------

Prop

Type

`type?`"image" | "file" | "video" | "audio"

`url?`string | undefined

`data?`Buffer | Blob | undefined

`name?`string | undefined

`mimeType?`string | undefined

`size?`number | undefined

`fetchData()?`() => Promise<Buffer | ArrayBuffer> | undefined

`fetchMetadata?`Record<string, string> | undefined

[LinkPreview](#linkpreview)
---------------------------

Links found in incoming messages are extracted and exposed as `LinkPreview` objects. On platforms that support it (currently Slack), links pointing to other chat messages include a `fetchMessage()` callback to retrieve the full linked message.

Prop

Type

`url?`string

`title?`string | undefined

`description?`string | undefined

`imageUrl?`string | undefined

`siteName?`string | undefined

`fetchMessage()?`() => Promise<Message> | undefined

When using [`toAiMessages()`](/docs/ai/to-ai-messages), link metadata is automatically appended to the message content. Embedded message links are labeled as `[Embedded message: ...]` so the AI model understands the context.

### [Platform support](#platform-support)

| Platform | Link extraction | `fetchMessage()` |
| --- | --- | --- |
| Slack | URLs from `rich_text` blocks or `<url>` text patterns | Slack message links (`*.slack.com/archives/...`) |
| Others | Not yet — `links` is always `[]` | — |

[MessageSubject](#messagesubject)
---------------------------------

Returned by `message.subject` on platforms with parent resources. See [Message Subject](/docs/subject) for usage.

Prop

Type

`type?`string

`id?`string

`title?`string | undefined

`description?`string | undefined

`status?`string | undefined

`url?`string | undefined

`author?`{ id: string; name: string } | undefined

`assignee?`{ id: string; name: string } | undefined

`labels?`string[] | undefined

`raw?`unknown

[Serialization](#serialization)
-------------------------------

Messages can be serialized for workflow engines and external systems.

```
// Serialize
const json = message.toJSON();

// Deserialize
const restored = Message.fromJSON(json);
```

The serialized format converts `Date` fields to ISO strings and omits non-serializable fields like `data` buffers and `fetchData` functions. The `fetchMetadata` field is preserved so that adapters can reconstruct `fetchData` when the message is rehydrated from a queue.

[Read more](#read-more)
-----------------------

[### Handling Events

Register handlers for mentions, messages, reactions, member joins, and platform-specific events.](/docs/handling-events)[### Message Subject

Fetch the parent resource that a message is about.](/docs/subject)[### toAiMessages

Convert Chat SDK messages to AI SDK conversation format.](/docs/ai/to-ai-messages)[### PostableMessage

The union type accepted by thread.post() for sending messages.](/docs/api/postable-message)
