---
title: "Ephemeral Messages"
source_url: https://chat-sdk.dev/docs/ephemeral-messages
section: ephemeral-messages
crawled: 2026-09-20
---

# Ephemeral Messages

> Source: https://chat-sdk.dev/docs/ephemeral-messages

Ephemeral messages are visible only to a specific user within a thread. They're useful for confirmations, hints, and private notifications.

[Send an ephemeral message](#send-an-ephemeral-message)
-------------------------------------------------------

lib/bot.ts

```
await thread.postEphemeral(user, "Only you can see this!", {
  fallbackToDM: true,
});
```

The `fallbackToDM` option is required and controls behavior on platforms without native ephemeral support:

* `fallbackToDM: true` — send as a DM if native ephemeral is not supported
* `fallbackToDM: false` — return `null` if native ephemeral is not supported

[Platform behavior](#platform-behavior)
---------------------------------------

| Platform | Native support | Behavior | Persistence |
| --- | --- | --- | --- |
| Slack | Yes | Ephemeral in channel | Session-only (disappears on reload) |
| Google Chat | Yes | Private message in space | Persists until deleted |
| Teams | Yes | Targeted message in conversation | Teams-managed |
| Discord | No | DM fallback | Persists in DM |

Discord slash command responses can be made ephemeral with the Discord adapter's [`interactionFlags` option](/adapters/official/discord#interaction-flags). Outside that interaction flow, `postEphemeral` still follows the fallback behavior.

[Check for fallback](#check-for-fallback)
-----------------------------------------

lib/bot.ts

```
const result = await thread.postEphemeral(user, "Private notification", {
  fallbackToDM: true,
});

if (result?.usedFallback) {
  console.log("Sent as DM instead of ephemeral");
}
```

[Graceful degradation](#graceful-degradation)
---------------------------------------------

Only send if the platform supports native ephemeral:

lib/bot.ts

```
const result = await thread.postEphemeral(user, "Contextual hint", {
  fallbackToDM: false,
});

if (!result) {
  // Platform doesn't support native ephemeral
  // Message was not sent
}
```

[Ephemeral cards](#ephemeral-cards)
-----------------------------------

Cards work with ephemeral messages too:

lib/bot.tsx

```
await thread.postEphemeral(
  event.user,
  <Card title="Ephemeral Card">
    <CardText>Only you can see this card.</CardText>
    <Actions>
      <Button id="open_modal" style="primary">Open Modal</Button>
    </Actions>
  </Card>,
  { fallbackToDM: true }
);
```

[Read more](#read-more)
-----------------------

[### Direct Messages

Initiate DM conversations with users programmatically.](/docs/direct-messages)[### Creating a Chat Instance

Initialize the Chat class with adapters, state, and configuration options.](/docs/usage)[### File Uploads

Send and receive files across chat platforms.](/docs/files)[### History

Store and retrieve message history across user, thread, and channel scopes.](/docs/history)
