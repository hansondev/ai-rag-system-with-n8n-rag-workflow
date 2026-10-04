---
title: "Transcripts (deprecated)"
source_url: https://chat-sdk.dev/docs/api/transcripts
section: api
crawled: 2026-09-20
---

# Transcripts (deprecated)

> Source: https://chat-sdk.dev/docs/api/transcripts

`bot.transcripts` and the `transcripts` config key are deprecated. Use [`bot.history.user`](/docs/api/history#bothistoryuser) and the `history.user` config key instead — the API surface is identical. `bot.transcripts` will continue to work in the current major version.

`bot.transcripts` provides per-user message persistence keyed by a stable cross-platform identifier. See the [History guide](/docs/history) for setup, usage patterns, and migration steps.

```
import { Chat } from "chat";
```

[Configuration](#configuration)
-------------------------------

`history.user` (or the deprecated `transcripts`) requires an identity resolver — set `history.user.identity` or the deprecated top-level `identity` field. Passing `history.user` without either throws at construction.

### [ChatConfig.transcripts (deprecated → history.user)](#chatconfigtranscripts-deprecated--historyuser)

Prop

Type

`retention?`number | DurationString | undefined

`maxPerUser?`number | false

`storeFormatted?`boolean

### [ChatConfig.identity](#chatconfigidentity)

```
identity: (context: IdentityContext) => string | null | Promise<string | null>;
```

Called once per inbound message during dispatch. The result is attached to the `Message` instance as `message.userKey`. Return `null` to skip persistence for an event.

#### [IdentityContext](#identitycontext)

Prop

Type

`adapter?`string

`author?`Author

`message?`Message

[Methods](#methods)
-------------------

Access via `bot.history.user` (preferred) or `bot.transcripts` (deprecated alias). Throws if neither `history.user` nor `transcripts` was configured on the `Chat` instance.

### [append](#append)

Persist a `Message` (typically the inbound user message) or an `AppendInput` (typically a bot reply you just posted).

```
append(
  thread: Postable,
  message: Message | AppendInput,
  options?: AppendOptions,
): Promise<TranscriptEntry | null>;
```

When `message` is a `Message`, `userKey` is read from the instance. If it's `undefined` (the resolver returned `null`), the call is a no-op and returns `null`. When `message` is an `AppendInput`, `options.userKey` is required.

#### [AppendInput](#appendinput)

Prop

Type

`role?`"user" | "assistant" | "system"

`text?`string

`formatted?`FormattedContent | undefined

`platformMessageId?`string | undefined

#### [AppendOptions](#appendoptions)

Prop

Type

`userKey?`string | undefined

### [list](#list)

Returns entries in chronological order (oldest first). When `limit` is set, returns the newest `N` entries — still chronologically.

```
list(query: ListQuery): Promise<TranscriptEntry[]>;
```

#### [ListQuery](#listquery)

Prop

Type

`userKey?`string

`limit?`number

`platforms?`string[] | undefined

`threadId?`string | undefined

`roles?`("user" | "assistant" | "system")[] | undefined

### [count](#count)

```
count(query: CountQuery): Promise<number>;
```

Returns the total number of entries stored under the user key. `CountQuery` has a single field, `userKey: string`.

### [delete](#delete)

```
delete(target: { userKey: string }): Promise<{ deleted: number }>;
```

Wipes every entry stored under the user key. Returns the count that was removed. Single-entry and time-range deletes are not supported — the underlying `appendToList` primitive can't support them safely under concurrent writes.

[TranscriptEntry](#transcriptentry)
-----------------------------------

Returned by `append` and `list`.

Prop

Type

`id?`string

`userKey?`string

`role?`"user" | "assistant" | "system"

`text?`string

`formatted?`FormattedContent | undefined

`platform?`string

`threadId?`string

`platformMessageId?`string | undefined

`timestamp?`number

[Storage](#storage)
-------------------

Backed by `StateAdapter.appendToList` / `getList` / `delete`. Every built-in state adapter (`memory`, `redis`, `ioredis`, `pg`) supports these primitives.

Entries are stored under `transcripts:user:{userKey}` as a capped list. `appendToList` is atomic, so concurrent inbound messages don't race.

The `retention` value is applied as the list TTL and refreshed on every append. With `retention: "30d"`, a user who hasn't talked to the bot in 30 days has their transcript expire automatically.

[See also](#see-also)
---------------------

* [History API reference](/docs/api/history) — the current API (`bot.history.user`, `bot.history.thread`, `bot.history.channel`)
* [History guide](/docs/history) — setup, patterns, and migration

[Read more](#read-more)
-----------------------

[### History

Store and retrieve message history across user, thread, and channel scopes.](/docs/history)[### History

API reference for bot.history — user, thread, and channel scopes.](/docs/api/history)[### Cards

Rich card components for cross-platform interactive messages.](/docs/api/cards)[### Markdown

AST builder functions and utilities for programmatic message formatting.](/docs/api/markdown)
