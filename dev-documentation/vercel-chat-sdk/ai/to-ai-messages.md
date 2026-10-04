---
title: "toAiMessages"
source_url: https://chat-sdk.dev/docs/ai/to-ai-messages
section: ai
crawled: 2026-09-20
---

# toAiMessages

> Source: https://chat-sdk.dev/docs/ai/to-ai-messages

Using TanStack AI? `toTanStackMessages` in `chat/ai/tanstack` converts the
same history into the `ModelMessage[]` shape that `chat()` expects. See
[TanStack AI](/docs/ai/tanstack-ai).

Convert an array of [`Message`](/docs/api/message) objects into the `{ role, content }[]` format expected by the AI SDK. The output is structurally compatible with AI SDK's `ModelMessage[]`.

```
import { toAiMessages } from "chat/ai";
```

`toAiMessages` is also re-exported from the main `chat` entrypoint
for backwards compatibility (with a `@deprecated` JSDoc hint), but
new code should import it from [`chat/ai`](/docs/ai) alongside
[`createChatTools`](/docs/ai/ai-sdk-tools) and the rest of the AI
utilities.

[Usage](#usage)
---------------

lib/bot.ts

```
import { toAiMessages } from "chat/ai";

bot.onSubscribedMessage(async (thread, message) => {
  const result = await thread.adapter.fetchMessages(thread.id, { limit: 20 });
  const history = await toAiMessages(result.messages);
  const response = await agent.stream({ prompt: history });
  await thread.post(response.fullStream);
});
```

[Signature](#signature)
-----------------------

```
function toAiMessages(
  messages: Message[],
  options?: ToAiMessagesOptions
): Promise<AiMessage[]>
```

### [Parameters](#parameters)

Prop

Type

`messages?`Message[]

`options?`ToAiMessagesOptions

### [Options](#options)

Prop

Type

`includeNames?`boolean

`transformMessage?`(aiMessage: AiMessage, source: Message) => AiMessage | null | Promise<AiMessage | null>

`onUnsupportedAttachment?`(attachment: Attachment, message: Message) => void

### [Returns](#returns)

`Promise<AiMessage[]>` — an array of messages with `role` and `content` fields, directly assignable to AI SDK's `ModelMessage[]`.

[Behavior](#behavior)
---------------------

* **Role mapping** — `author.isMe === true` maps to `"assistant"`, all others to `"user"`
* **Filtering** — A message with no text is kept when it has links or attachments the converter can include: images and text files with a working `fetchData()`. Messages with no text whose only attachments are unsupported (video, audio, other file types, or missing `fetchData()`) are removed. Attachment-only messages produce multipart `content` with no leading text part
* **Sorting** — Messages are sorted chronologically (oldest first) by `metadata.dateSent`
* **Links** — Link metadata (URL, title, description, site name) is appended to message content. Third-party title, description, and site-name fields are normalized, length-limited, escaped, and enclosed in an explicit untrusted-content fence. Embedded message links are labeled as `[Embedded message: ...]`
* **Attachments** — Images and text files (JSON, XML, YAML, etc.) are included as multipart content using `fetchData()`. When the message has no text, the `content` array contains only attachment parts, with no leading text part. Video and audio attachments trigger `onUnsupportedAttachment`

[Return types](#return-types)
-----------------------------

```
type AiMessage = AiUserMessage | AiAssistantMessage;

interface AiUserMessage {
  role: "user";
  content: string | AiMessagePart[];
}

interface AiAssistantMessage {
  role: "assistant";
  content: string;
}
```

User messages have multipart `content` when attachments are present:

```
type AiMessagePart = AiTextPart | AiImagePart | AiFilePart;

interface AiTextPart {
  type: "text";
  text: string;
}

interface AiImagePart {
  type: "image";
  image: DataContent | URL;
  mediaType?: string;
}

interface AiFilePart {
  type: "file";
  data: DataContent | URL;
  filename?: string;
  mediaType: string;
}
```

[Examples](#examples)
---------------------

### [Multi-user context](#multi-user-context)

Prefix each user message with their username so the AI model can distinguish speakers:

```
const history = await toAiMessages(result.messages, { includeNames: true });
// [{ role: "user", content: "[alice]: Hello" },
//  { role: "assistant", content: "Hi there!" },
//  { role: "user", content: "[bob]: Thanks" }]
```

### [Transforming messages](#transforming-messages)

Replace raw user IDs with readable names:

```
const history = await toAiMessages(result.messages, {
  transformMessage: (aiMessage) => {
    if (typeof aiMessage.content === "string") {
      return {
        ...aiMessage,
        content: aiMessage.content.replace(/<@U123>/g, "@VercelBot"),
      };
    }
    return aiMessage;
  },
});
```

### [Filtering messages](#filtering-messages)

Skip messages from a specific user:

```
const history = await toAiMessages(result.messages, {
  transformMessage: (aiMessage, source) => {
    if (source.author.userId === "U_NOISY_BOT") return null;
    return aiMessage;
  },
});
```

### [Handling unsupported attachments](#handling-unsupported-attachments)

```
const history = await toAiMessages(result.messages, {
  onUnsupportedAttachment: (attachment, message) => {
    logger.warn(`Skipped ${attachment.type} attachment in message ${message.id}`);
  },
});
```

[Supported attachment types](#supported-attachment-types)
---------------------------------------------------------

| Type | MIME types | Included as |
| --- | --- | --- |
| `image` | Any image MIME type | `FilePart` with base64 data |
| `file` | `text/*`, `application/json`, `application/xml`, `application/javascript`, `application/typescript`, `application/yaml`, `application/toml` | `FilePart` with base64 data |
| `video` | Any | Skipped (triggers `onUnsupportedAttachment`) |
| `audio` | Any | Skipped (triggers `onUnsupportedAttachment`) |
| `file` | Other (e.g. `application/pdf`) | Silently skipped |

Attachments require `fetchData()` to be available on the attachment object. Attachments without `fetchData()` are silently skipped.

[Read more](#read-more)
-----------------------

[### Overview

AI utilities that ship with Chat SDK — agent tools, message conversion, and supporting types.](/docs/ai)[### AI SDK Tools

Give an AI agent the ability to operate inside your workspace. Post messages, send DMs, react, edit, delete; all with built-in approval gates.](/docs/ai/ai-sdk-tools)[### Types

TypeScript types exported from the chat/ai subpath.](/docs/ai/types)[### Streaming

Stream real-time text responses from AI models and other async sources to chat platforms.](/docs/streaming)
