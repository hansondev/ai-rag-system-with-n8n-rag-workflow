---
title: "Documentation"
source_url: https://chat-sdk.dev/docs/api
section: api
crawled: 2026-09-20
---

# Documentation

> Source: https://chat-sdk.dev/docs/api

Complete API reference for the `chat` package. All exports are available from the top-level import:

```
import { Chat, root, paragraph, text, Card, Button, emoji } from "chat";
```

[Core](#core)
-------------

| Export | Description |
| --- | --- |
| [`Chat`](/docs/api/chat) | Main class — registers adapters, event handlers, and webhook routing |
| [`Thread`](/docs/api/thread) | Conversation thread with methods for posting, subscribing, and state |
| [`Channel`](/docs/api/channel) | Channel/conversation container that holds threads |
| [`Message`](/docs/api/message) | Normalized message with text, AST, author, and metadata |
| [`ScheduledMessage`](/docs/api/thread#scheduledmessage) | Returned by `thread.schedule()` / `channel.schedule()` with `cancel()` |

[Message formats](#message-formats)
-----------------------------------

| Export | Description |
| --- | --- |
| [`PostableMessage`](/docs/api/postable-message) | Union type accepted by `thread.post()` |
| [`Plan`](/docs/api/postable-message#plan) | Step-by-step task list that mutates after posting |
| [`StreamingPlan`](/docs/api/postable-message#streamingplan) | Wraps an async iterable with platform-specific streaming options |
| [`Cards`](/docs/api/cards) | Rich card components — `Card`, `Text`, `Button`, `Actions`, etc. |
| [`Markdown`](/docs/api/markdown) | AST builder functions — `root`, `paragraph`, `text`, `strong`, etc. |
| [`Modals`](/docs/api/modals) | Modal form components — `Modal`, `TextInput`, `Select`, etc. |

[History](#history)
-------------------

| Export | Description |
| --- | --- |
| [`bot.history.user`](/docs/api/history#bothistoryuser) | Cross-platform per-user message store — append, list, count, delete |
| [`bot.history.thread`](/docs/api/history#bothistorythread) | Per-thread message reads — platform API with SDK cache fallback |
| [`bot.history.channel`](/docs/api/history#bothistorychannel) | Per-channel reads — `listMessages`, `listThreads`, and related adapter APIs |
| [`Transcripts`](/docs/api/transcripts) | Deprecated alias — use `bot.history.user` instead |

[AI utilities](#ai-utilities)
-----------------------------

`toAiMessages`, `createChatTools`, and the supporting types live in the [`chat/ai`](/docs/ai) subpath — see the [AI section](/docs/ai) for the full reference.

[Read more](#read-more)
-----------------------

[### Chat

The main entry point for creating a multi-platform chat bot.](/docs/api/chat)[### Thread

Represents a conversation thread with methods for posting, subscribing, and state management.](/docs/api/thread)[### Channel

Channel container that holds threads, with methods for listing, posting, and iteration.](/docs/api/channel)[### Message

Normalized message format with text, AST, author, and metadata.](/docs/api/message)
