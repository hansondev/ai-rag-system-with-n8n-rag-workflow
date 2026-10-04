---
title: "Types"
source_url: https://chat-sdk.dev/docs/ai/types
section: ai
crawled: 2026-09-20
---

# Types

> Source: https://chat-sdk.dev/docs/ai/types

Every type exported from `chat/ai`. Pulling these from the subpath keeps the optional `ai` and `zod` peer deps out of bundles that don't import them.

```
import type {
  AiMessage,
  AiUserMessage,
  AiAssistantMessage,
  AiMessagePart,
  AiTextPart,
  AiImagePart,
  AiFilePart,
  ToAiMessagesOptions,
  ChatBinding,
  ChatTools,
  ChatToolName,
  ChatToolPreset,
  ChatWriteToolName,
  ChatApprovalToolName,
  ApprovalConfig,
  ToolOptions,
  ToolOverrides,
} from "chat/ai";
```

[Conversation messages](#conversation-messages)
-----------------------------------------------

Used by [`toAiMessages`](/docs/ai/to-ai-messages) and any agent prompt you build by hand. The shapes are structurally compatible with AI SDK's `ModelMessage` so the result is directly assignable to `prompt` / `messages`.

### [AiMessage](#aimessage)

```
type AiMessage = AiUserMessage | AiAssistantMessage;
```

A single normalized turn in a conversation — the array form is what AI SDK calls expect.

### [AiUserMessage](#aiusermessage)

```
interface AiUserMessage {
  role: "user";
  content: string | AiMessagePart[];
}
```

User content can be plain text, or a multipart array when attachments are present.

### [AiAssistantMessage](#aiassistantmessage)

```
interface AiAssistantMessage {
  role: "assistant";
  content: string;
}
```

Assistant turns are always plain strings — `toAiMessages` produces this for any message authored by the bot itself (`author.isMe === true`).

### [AiMessagePart](#aimessagepart)

```
type AiMessagePart = AiTextPart | AiImagePart | AiFilePart;
```

The discriminated union used inside multipart user messages.

### [AiTextPart](#aitextpart)

```
interface AiTextPart {
  type: "text";
  text: string;
}
```

### [AiImagePart](#aiimagepart)

```
interface AiImagePart {
  type: "image";
  image: DataContent | URL;
  mediaType?: string;
}
```

`DataContent` matches AI SDK's type — `string | Uint8Array | ArrayBuffer | Buffer`.

### [AiFilePart](#aifilepart)

```
interface AiFilePart {
  type: "file";
  data: DataContent | URL;
  filename?: string;
  mediaType: string;
}
```

`toAiMessages` emits text-like attachments (JSON, XML, YAML, source files, etc.) as file parts.

### [ToAiMessagesOptions](#toaimessagesoptions)

```
interface ToAiMessagesOptions {
  includeNames?: boolean;
  transformMessage?: (
    aiMessage: AiMessage,
    source: Message
  ) => AiMessage | null | Promise<AiMessage | null>;
  onUnsupportedAttachment?: (
    attachment: Attachment,
    message: Message
  ) => void;
}
```

See [`toAiMessages`](/docs/ai/to-ai-messages) for behavior and examples.

[Tools](#tools)
---------------

Returned by [`createChatTools`](/docs/ai/ai-sdk-tools) and used to configure it.

### [ChatBinding](#chatbinding)

```
type ChatBinding = Chat<any, any>;
```

Whatever [`Chat`](/docs/api/chat) instance the tools should dispatch operations against. The generics are intentionally loose so any strongly-typed `Chat<TAdapters, TState>` is assignable.

### [ChatTools](#chattools)

```
type ChatTools = ReturnType<typeof createChatTools>;
```

Convenience alias for the object returned by `createChatTools` — handy when you want to type a wrapper or pass the toolset around.

### [ChatToolPreset](#chattoolpreset)

```
type ChatToolPreset = "reader" | "messenger" | "moderator";
```

Predefined toolset scopes. See [Presets](/docs/ai/ai-sdk-tools#presets) for the exact tool list per preset.

### [ChatToolName](#chattoolname)

```
type ChatToolName =
  | "fetchMessages"
  | "fetchChannelMessages"
  | "fetchThread"
  | "listThreads"
  | "getThreadParticipants"
  | "getChannelInfo"
  | "getUser"
  | "startTyping"
  | "postMessage"
  | "postChannelMessage"
  | "sendDirectMessage"
  | "editMessage"
  | "deleteMessage"
  | "addReaction"
  | "removeReaction"
  | "subscribeThread"
  | "unsubscribeThread";
```

The names of every generated tool. Useful when typing per-tool overrides.

### [ChatWriteToolName](#chatwritetoolname)

```
type ChatWriteToolName =
  | "postMessage"
  | "postChannelMessage"
  | "sendDirectMessage"
  | "editMessage"
  | "deleteMessage"
  | "addReaction"
  | "removeReaction"
  | "subscribeThread"
  | "unsubscribeThread";
```

The names of every mutating tool. Useful when wiring per-tool approval overrides.

### [ChatApprovalToolName](#chatapprovaltoolname)

```
type ChatApprovalToolName = ChatWriteToolName | "getUser";
```

The names of tools that require approval by default: every mutating tool plus the arbitrary user-profile lookup.

### [ApprovalConfig](#approvalconfig)

```
type ApprovalConfig =
  | boolean
  | Partial<Record<ChatApprovalToolName, boolean>>;
```

Controls the `requireApproval` option:

* `true` (default) — every write tool and `getUser` need approval.
* `false` — no tool needs approval.
* object — per-tool override; unspecified approval-gated tools fall back to `true`.

### [ToolOptions](#tooloptions)

```
interface ToolOptions {
  needsApproval?: boolean;
}
```

Common options accepted by every standalone write-tool factory (e.g. `postMessage(chat, { needsApproval: false })`).

### [ToolOverrides](#tooloverrides)

```
type ToolOverrides = Partial<
  Pick<
    Tool,
    | "description"
    | "inputExamples"
    | "metadata"
    | "needsApproval"
    | "onInputAvailable"
    | "onInputDelta"
    | "onInputStart"
    | "providerOptions"
    | "strict"
    | "title"
    | "toModelOutput"
  >
>;
```

Per-tool overrides accepted by `createChatTools({ overrides })`. Core fields like `execute`, `inputSchema`, `outputSchema`, `type`, `id`, and `args` are intentionally excluded so tool semantics stay stable across upgrades.

[TanStack AI](#tanstack-ai)
---------------------------

The `chat/ai/tanstack` subpath exports its own message and tool shapes, declared locally so nothing from `@tanstack/ai` is imported at runtime:

```
import type {
  TanStackMessage,
  TanStackUserMessage,
  TanStackAssistantMessage,
  TanStackContentPart,
  TanStackTextPart,
  TanStackImagePart,
  ToTanStackMessagesOptions,
  TanStackTool,
  TanStackToolOverrides,
  TanStackChatToolsOptions,
} from "chat/ai/tanstack";
```

| Type | Purpose |
| --- | --- |
| `TanStackMessage` | `TanStackUserMessage | TanStackAssistantMessage`, structurally assignable to TanStack AI's `ModelMessage`. Returned by `toTanStackMessages`. |
| `TanStackContentPart` | `TanStackTextPart | TanStackImagePart`, the parts inside a multipart user message. Text parts use `content`, image parts carry base64 data under `source`. |
| `ToTanStackMessagesOptions` | `includeNames`, `transformMessage`, and `onUnsupportedAttachment`, mirroring `ToAiMessagesOptions`. |
| `TanStackTool` | A plain tool object (`name`, `description`, `inputSchema`, `execute`, optional `needsApproval`, `metadata`, `lazy`) accepted by `chat({ tools })`. |
| `TanStackToolOverrides` | The subset of `TanStackTool` that `createTanStackTools({ overrides })` lets you change: `description`, `needsApproval`, `metadata`, `lazy`. |
| `TanStackChatToolsOptions` | Options for `createTanStackTools`: `chat`, `preset`, `requireApproval`, `scope`, `strictScope`, `overrides`. |

`ChatToolName`, `ChatToolPreset`, `ChatWriteToolName`, `ChatApprovalToolName`, `ApprovalConfig`, `ReadScope`, and `ChatBinding` are re-exported from `chat/ai/tanstack` unchanged. Full definitions are on the [TanStack AI](/docs/ai/tanstack-ai#types) page.

[Read more](#read-more)
-----------------------

[### Overview

AI utilities that ship with Chat SDK — agent tools, message conversion, and supporting types.](/docs/ai)[### AI SDK Tools

Give an AI agent the ability to operate inside your workspace. Post messages, send DMs, react, edit, delete; all with built-in approval gates.](/docs/ai/ai-sdk-tools)[### toAiMessages

Convert Chat SDK messages to AI SDK conversation format.](/docs/ai/to-ai-messages)[### TanStack AI

Feed thread history into TanStack AI's chat() and give it Chat SDK tools, with no runtime dependency on @tanstack/ai.](/docs/ai/tanstack-ai)
