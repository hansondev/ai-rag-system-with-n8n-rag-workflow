---
title: "Slash Commands"
source_url: https://chat-sdk.dev/docs/slash-commands
section: slash-commands
crawled: 2026-09-20
---

# Slash Commands

> Source: https://chat-sdk.dev/docs/slash-commands

Slash commands let users invoke your bot with `/command` syntax. Register handlers with `onSlashCommand` to respond.

Slash commands are supported on [Slack](/adapters/official/slack), [Discord](/adapters/official/discord), and [Telegram](/adapters/official/telegram).

[Handle a specific command](#handle-a-specific-command)
-------------------------------------------------------

lib/bot.ts

```
bot.onSlashCommand("/status", async (event) => {
  await event.channel.post("All systems operational!");
});
```

[Handle multiple commands](#handle-multiple-commands)
-----------------------------------------------------

lib/bot.ts

```
bot.onSlashCommand(["/help", "/info"], async (event) => {
  await event.channel.post(`You invoked ${event.command}`);
});
```

[Catch-all handler](#catch-all-handler)
---------------------------------------

Register a handler without a command to catch all slash commands:

lib/bot.ts

```
bot.onSlashCommand(async (event) => {
  console.log(`Command: ${event.command}, Args: ${event.text}`);
});
```

[SlashCommandEvent](#slashcommandevent)
---------------------------------------

The `event` object passed to slash command handlers:

| Property | Type | Description |
| --- | --- | --- |
| `command` | `string` | The command name (e.g., `/status`) |
| `text` | `string` | Arguments after the command |
| `user` | `Author` | The user who invoked the command |
| `channel` | `Channel` | The channel where the command was invoked |
| `adapter` | `Adapter` | The platform adapter |
| `triggerId` | `string` (optional) | Platform trigger ID for opening modals |
| `openModal` | `(modal) => Promise<{ viewId: string } | undefined>` | Open a modal dialog |
| `raw` | `unknown` | Platform-specific payload |

[Respond to a command](#respond-to-a-command)
---------------------------------------------

Use `event.channel` to post messages:

lib/bot.ts

```
bot.onSlashCommand("/greet", async (event) => {
  // Public message to the channel
  await event.channel.post(`Hello, ${event.user.fullName}!`);

  // Ephemeral message (only visible to the user)
  await event.channel.postEphemeral(
    event.user,
    "This message is just for you!",
    { fallbackToDM: false }
  );
});
```

See [Ephemeral Messages](/docs/ephemeral-messages) for platform support and the `fallbackToDM` option.

[Open a modal](#open-a-modal)
-----------------------------

Use `event.openModal()` to open a [modal](/docs/modals) in response to a slash command:

lib/bot.tsx

```
import { Modal, TextInput, Select, SelectOption } from "chat";

bot.onSlashCommand("/feedback", async (event) => {
  const result = await event.openModal(
    <Modal callbackId="feedback_form" title="Send Feedback" submitLabel="Send">
      <TextInput id="message" label="Your Feedback" multiline />
      <Select id="category" label="Category">
        <SelectOption label="Bug" value="bug" />
        <SelectOption label="Feature" value="feature" />
      </Select>
    </Modal>
  );

  if (!result) {
    await event.channel.post("Couldn't open the feedback form. Please try again.");
  }
});
```

When a modal is opened from a slash command, the submit handler receives `relatedChannel` instead of `relatedThread`. Use this to post back to the channel where the command was invoked.

lib/bot.ts

```
bot.onModalSubmit("feedback_form", async (event) => {
  const { message, category } = event.values;

  // Post to the channel where the slash command was invoked
  if (event.relatedChannel) {
    await event.relatedChannel.post(`Feedback received! Category: ${category}`);
  }
});
```

[Telegram](#telegram)
---------------------

Telegram supports bot commands such as `/status` and `/status@mybot`. Register handlers with `onSlashCommand`; commands addressed to another bot are ignored as slash commands and continue through the normal message path.

[Discord](#discord)
-------------------

Discord slash commands are received via [HTTP Interactions](/adapters/official/discord#http-interactions-vs-gateway) — no Gateway connection is needed. The adapter automatically sends a deferred response to Discord, then resolves it when your handler calls `event.channel.post()`.

To make selected Discord slash command responses ephemeral, return `DiscordInteractionResponseFlag.Ephemeral` from the Discord adapter's [`interactionFlags` option](/adapters/official/discord#interaction-flags).

### [Subcommands](#subcommands)

Discord supports subcommand groups and subcommands. The adapter flattens these into the `event.command` path:

| Discord command | `event.command` | `event.text` |
| --- | --- | --- |
| `/status` | `/status` | `""` |
| `/project create --name="Acme"` | `/project create` | `Acme` |
| `/project issue list --status="open"` | `/project issue list` | `open` |

For full option details (names, types), use `event.raw` to access the original Discord interaction payload.

### [Registering commands with Discord](#registering-commands-with-discord)

You need to register slash commands with the [Discord API](https://discord.com/developers/docs/interactions/application-commands) before they appear in the client. The Chat SDK handles incoming commands but does not register them for you.

[Read more](#read-more)
-----------------------

[### Modals

Collect structured user input through modal dialogs with text fields, dropdowns, and validation.](/docs/modals)[### Ephemeral Messages

Send messages visible only to a specific user.](/docs/ephemeral-messages)[### Getting Started

Pick a guide to start building with Chat SDK.](/docs/getting-started)[### Emoji

Type-safe, cross-platform emoji that automatically convert to each platform's format.](/docs/emoji)
