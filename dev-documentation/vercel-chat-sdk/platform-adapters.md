---
title: "Platform Adapters"
source_url: https://chat-sdk.dev/docs/platform-adapters
section: platform-adapters
crawled: 2026-09-20
---

# Platform Adapters

> Source: https://chat-sdk.dev/docs/platform-adapters

Platform adapters handle webhook verification, message parsing, and API calls for each messaging platform. Install only the adapters you need. Browse all available adapters, including community-built ones, on the [Adapters](/adapters) page.

Need a browser chat UI? See the [Web adapter](/adapters/official/web). It speaks the AI SDK UI stream protocol and works with React (`@ai-sdk/react`), Vue (`@ai-sdk/vue`), and Svelte (`@ai-sdk/svelte`), so the same bot serves Slack, Teams, and any browser framework out of the box.

[Feature matrix](#feature-matrix)
---------------------------------

This matrix covers Vercel-maintained [official adapters](/adapters) only. For vendor-official and community adapters, see each adapter's page.

### Messaging

| Feature | [Discord](/adapters/official/discord) | [Google Chat](/adapters/official/gchat) | [GitHub](/adapters/official/github) | [Gmail](/adapters/official/gmail) | [Instagram](/adapters/official/instagram) | [Linear](/adapters/official/linear) | [Messenger](/adapters/official/messenger) | [Notion](/adapters/official/notion) | [Slack](/adapters/official/slack) | [Microsoft Teams](/adapters/official/teams) | [Telegram](/adapters/official/telegram) | [Twilio](/adapters/official/twilio) | [Web](/adapters/official/web) | [WhatsApp Business Cloud](/adapters/official/whatsapp) | [X](/adapters/official/x) | [XChat](/adapters/official/xchat) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Post message |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Message replies |  |  |  |  |  |  |  |  |  |  |  |  |  | Outbound only |  |  |
| Edit message |  |  |  |  |  | Partial |  |  |  |  |  |  |  |  | Posts only | Own text messages, age-gated |
| Delete message |  |  |  |  |  | Partial |  |  |  |  |  |  |  |  |  | Own messages |
| File uploads |  |  |  |  | Uploads and HTTPS URLs |  |  | Up to 3 native attachments |  |  |  | Public media URLs |  | Images, audio, docs |  |  |
| Streaming | Post+Edit | Post+Edit | Buffered | Buffered email | Buffered | Agent sessions / Post+Edit | Buffered | Post+Edit | Native | Native (DMs) / Buffered | Post+Edit / Opt-in rich drafts | Buffered | Native (SSE) | Buffered | Buffered | Age-gated edits |
| Scheduled messages |  |  |  |  |  |  |  |  | Native |  |  |  |  |  |  |  |

### Rich content

| Feature | [Discord](/adapters/official/discord) | [Google Chat](/adapters/official/gchat) | [GitHub](/adapters/official/github) | [Gmail](/adapters/official/gmail) | [Instagram](/adapters/official/instagram) | [Linear](/adapters/official/linear) | [Messenger](/adapters/official/messenger) | [Notion](/adapters/official/notion) | [Slack](/adapters/official/slack) | [Microsoft Teams](/adapters/official/teams) | [Telegram](/adapters/official/telegram) | [Twilio](/adapters/official/twilio) | [Web](/adapters/official/web) | [WhatsApp Business Cloud](/adapters/official/whatsapp) | [X](/adapters/official/x) | [XChat](/adapters/official/xchat) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Card format | Embeds / Components | Google Chat Cards | GFM Markdown | Plain text | Generic / Button Templates | Markdown | Generic / Button Templates | Markdown fallback | Block Kit | Adaptive Cards | MarkdownV2 + inline keyboard | RCS rich cards + SMS text fallback | Markdown only (v1) | Interactive messages | Plain text | Plain text + URL preview |
| Buttons |  |  |  |  | Quick replies / postbacks |  | Max 3, postback |  |  |  | Inline keyboard | RCS quick-replies |  | Interactive replies |  |  |
| Link buttons |  |  |  | Text links | web\_url |  | web\_url |  |  |  | Inline keyboard URLs | RCS call-to-action |  | Single CTA URL | Rendered as text | Tappable URLs |
| Select menus | Components |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Tables | GFM | ASCII | GFM | Plain text |  | GFM | ASCII | Flattened markdown | Block Kit | Adaptive Card Table | Native messages / ASCII cards | ASCII | GFM |  | ASCII | ASCII |
| Charts |  |  |  |  |  |  |  |  | Block Kit |  |  |  |  |  |  |  |
| Fields |  |  |  | Plain text |  |  | ASCII |  |  |  |  |  |  | Formatted text | Plain text | Plain text |
| Images in cards |  |  |  |  |  |  |  |  |  |  |  | RCS only |  |  |  |  |
| Modals |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### Conversations

| Feature | [Discord](/adapters/official/discord) | [Google Chat](/adapters/official/gchat) | [GitHub](/adapters/official/github) | [Gmail](/adapters/official/gmail) | [Instagram](/adapters/official/instagram) | [Linear](/adapters/official/linear) | [Messenger](/adapters/official/messenger) | [Notion](/adapters/official/notion) | [Slack](/adapters/official/slack) | [Microsoft Teams](/adapters/official/teams) | [Telegram](/adapters/official/telegram) | [Twilio](/adapters/official/twilio) | [Web](/adapters/official/web) | [WhatsApp Business Cloud](/adapters/official/whatsapp) | [X](/adapters/official/x) | [XChat](/adapters/official/xchat) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Slash commands |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Mentions |  |  |  | Label-based intake |  |  |  |  |  |  |  |  |  |  |  |  |
| Add reactions |  | Workspace Events |  |  |  |  |  |  |  |  |  |  |  |  | Likes only |  |
| Remove reactions |  | Workspace Events | Partial |  |  | Partial |  |  |  |  |  |  |  |  | Likes only |  |
| Typing indicator |  |  |  |  |  | Agent sessions |  |  |  |  |  |  |  |  |  |  |
| Mark as read |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Message edit events |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Message delete events |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| DMs |  | Requires delegation |  | Email to recipient |  |  |  |  |  |  |  |  |  |  |  |  |
| Ephemeral messages |  | Native |  | Permanent private email |  |  |  |  | Native | Targeted messages |  |  |  |  |  |  |
| User lookup |  | Cached |  |  |  |  |  |  |  | Cached | Seen users |  |  |  |  |  |
| Parent subject |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Native client |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Custom API endpoint |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | Media REST calls |

### Message history

| Feature | [Discord](/adapters/official/discord) | [Google Chat](/adapters/official/gchat) | [GitHub](/adapters/official/github) | [Gmail](/adapters/official/gmail) | [Instagram](/adapters/official/instagram) | [Linear](/adapters/official/linear) | [Messenger](/adapters/official/messenger) | [Notion](/adapters/official/notion) | [Slack](/adapters/official/slack) | [Microsoft Teams](/adapters/official/teams) | [Telegram](/adapters/official/telegram) | [Twilio](/adapters/official/twilio) | [Web](/adapters/official/web) | [WhatsApp Business Cloud](/adapters/official/whatsapp) | [X](/adapters/official/x) | [XChat](/adapters/official/xchat) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Fetch messages |  | Requires delegation |  |  | Cached sent only |  | Cached sent only |  |  | Requires Graph permissions | Cached | Messages API | State cache | Cached sent only | DMs via API, posts cached |  |
| Fetch single message |  |  |  |  | Cached |  | Cached |  |  |  | Cached |  |  |  | Posts via API, DMs cached |  |
| Fetch thread info |  |  |  |  |  |  |  |  |  |  |  |  | Synthesized |  |  |  |
| Fetch channel messages |  |  |  |  | Cached |  | Cached |  |  | Requires Graph permissions | Cached |  | State cache |  |  |  |
| List threads |  |  |  |  |  |  |  |  |  | Requires Graph permissions |  |  |  |  |  |  |
| Fetch channel info |  |  |  |  |  |  |  |  |  | Requires Graph permissions |  |  |  |  |  |  |
| Post channel message |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

Partial support means the feature works with limitations. See individual adapter pages for details.

[How adapters work](#how-adapters-work)
---------------------------------------

Each adapter implements a standard interface that the `Chat` class uses to route events and send messages. When a webhook arrives:

1. The adapter verifies the request signature
2. Parses the platform-specific payload into a normalized `Message`
3. Routes to your handlers via the `Chat` class
4. Converts outgoing messages from markdown/AST/cards to the platform's native format

[Using multiple adapters](#using-multiple-adapters)
---------------------------------------------------

Register multiple [adapters](/adapters) and your event handlers work across all of them:

lib/bot.ts

```
import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createTeamsAdapter } from "@chat-adapter/teams";
import { createGoogleChatAdapter } from "@chat-adapter/gchat";
import { createRedisState } from "@chat-adapter/state-redis";

const bot = new Chat({
  userName: "mybot",
  adapters: {
    slack: createSlackAdapter(),
    teams: createTeamsAdapter(),
    gchat: createGoogleChatAdapter(),
  },
  state: createRedisState(),
});

// This handler fires for mentions on any platform
bot.onNewMention(async (thread) => {
  await thread.subscribe();
  await thread.post("Hello!");
});
```

Each adapter auto-detects credentials from environment variables, so you only need to pass config when overriding defaults.

The examples above use Redis for state. See [State Adapters](/docs/state-adapters) for all available options.

Each adapter creates a webhook handler accessible via `bot.webhooks.<name>`.

[Customizing an adapter via subclassing](#customizing-an-adapter-via-subclassing)
---------------------------------------------------------------------------------

Each official adapter exposes its extension surface as `protected` members so you can subclass it to override or extend platform-specific behavior without forking the package. Use this when you need to handle a payload type the built-in adapter doesn't cover, intercept verification, or wrap an existing handler.

lib/custom-telegram.ts

```
import { TelegramAdapter, type TelegramUpdate } from "@chat-adapter/telegram";
import type { WebhookOptions } from "chat";

export class CustomTelegramAdapter extends TelegramAdapter {
  protected override processUpdate(
    update: TelegramUpdate,
    options?: WebhookOptions
  ): void {
    // Handle a payload type the base adapter doesn't, e.g. chat_join_request.
    if ("chat_join_request" in update) {
      this.logger.info("Received chat_join_request", { update });
      return;
    }
    super.processUpdate(update, options);
  }
}
```

Construct your subclass anywhere you'd construct the base adapter, for example, `adapters: { telegram: new CustomTelegramAdapter({ ... }) }`. Members marked `private` intentionally remain inaccessible. If you find a hook you need that isn't `protected`, please open an issue.

The `protected` extension surface is intentionally broader than the public API but is not yet considered fully stable. Method signatures may evolve in minor releases as we learn from real-world subclasses. Pin the adapter version you build against, watch the changelog for the affected adapter, and prefer overriding the smallest hook that solves your problem so upgrades stay easy. If you rely on a particular hook, please open an issue so we can promote it to a stable, documented extension point.

[### Build an adapter

Implement the Adapter interface for any messaging platform.](/docs/contributing/building)[### List a vendor-official adapter

How platform vendors qualify and list a maintained adapter in the Vendor Official tier.](/docs/contributing/vendor-official)

[Read more](#read-more)
-----------------------

[### Getting Started

Pick a guide to start building with Chat SDK.](/docs/getting-started)[### Overview

Overview of Chat SDK adapters and the static adapter catalog.](/docs/adapters)[### State Adapters

Pluggable state adapters for thread subscriptions, distributed locking, and caching.](/docs/state-adapters)[### Streaming

Stream real-time text responses from AI models and other async sources to chat platforms.](/docs/streaming)
