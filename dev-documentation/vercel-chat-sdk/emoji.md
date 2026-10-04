---
title: "Emoji"
source_url: https://chat-sdk.dev/docs/emoji
section: emoji
crawled: 2026-09-20
---

# Emoji

> Source: https://chat-sdk.dev/docs/emoji

The `emoji` helper provides cross-platform emoji that automatically convert to the correct format for each platform. On Slack, emoji render as `:shortcode:` format. On other platforms, they render as Unicode characters.

[Usage](#usage)
---------------

lib/bot.ts

```
import { emoji } from "chat";

await thread.post(`${emoji.thumbs_up} Great job!`);
// Slack: ":+1: Great job!"
// Teams/GChat/Discord: "👍 Great job!"
```

Emoji also work in reactions:

lib/bot.ts

```
await sent.addReaction(emoji.check);

bot.onReaction(["thumbs_up", "heart", "fire"], async (event) => {
  if (!event.added) return;
  await event.adapter.addReaction(event.threadId, event.messageId, emoji.raised_hands);
});
```

[Available emoji](#available-emoji)
-----------------------------------

| Name | Emoji | Name | Emoji |
| --- | --- | --- | --- |
| `emoji.thumbs_up` | 👍 | `emoji.thumbs_down` | 👎 |
| `emoji.heart` | ❤️ | `emoji.smile` | 😊 |
| `emoji.laugh` | 😂 | `emoji.thinking` | 🤔 |
| `emoji.eyes` | 👀 | `emoji.fire` | 🔥 |
| `emoji.check` | ✅ | `emoji.x` | ❌ |
| `emoji.question` | ❓ | `emoji.party` | 🎉 |
| `emoji.rocket` | 🚀 | `emoji.star` | ⭐ |
| `emoji.wave` | 👋 | `emoji.clap` | 👏 |
| `emoji["100"]` | 💯 | `emoji.warning` | ⚠️ |
| `emoji.raised_hands` | 🙌 | `emoji.muscle` | 💪 |
| `emoji.ok_hand` | 👌 | `emoji.sad` | 😢 |
| `emoji.memo` | 📝 | `emoji.gear` | ⚙️ |
| `emoji.wrench` | 🔧 | `emoji.bug` | 🐛 |
| `emoji.calendar` | 📅 | `emoji.clock` | 🕐 |
| `emoji.sun` | ☀️ | `emoji.rainbow` | 🌈 |

For a one-off custom emoji, use `emoji.custom("name")`.

[Custom emoji](#custom-emoji)
-----------------------------

For workspace-specific emoji with full type safety, use `createEmoji()`:

lib/bot.ts

```
import { createEmoji } from "chat";

const myEmoji = createEmoji({
  unicorn: { slack: "unicorn_face", gchat: "🦄" },
  company_logo: { slack: "company", gchat: "🏢" },
});

await thread.post(`${myEmoji.unicorn} Magic! ${myEmoji.company_logo}`);
// Slack: ":unicorn_face: Magic! :company:"
// GChat: "🦄 Magic! 🏢"
```

You can also extend the built-in emoji map with TypeScript module augmentation:

lib/emoji.d.ts

```
declare module "chat" {
  interface CustomEmojiMap {
    my_custom: EmojiFormats;
  }
}
```

[Read more](#read-more)
-----------------------

[### Posting Messages

Different ways to render and send messages with thread.post().](/docs/posting-messages)[### Cards

Send rich interactive cards with buttons, fields, and images across all platforms.](/docs/cards)[### Handling Events

Register handlers for mentions, messages, reactions, member joins, and platform-specific events.](/docs/handling-events)[### Modals

Collect structured user input through modal dialogs with text fields, dropdowns, and validation.](/docs/modals)
