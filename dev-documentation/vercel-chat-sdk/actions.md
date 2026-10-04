---
title: "Actions"
source_url: https://chat-sdk.dev/docs/actions
section: actions
crawled: 2026-09-20
---

# Actions

> Source: https://chat-sdk.dev/docs/actions

Actions let you handle button clicks, dropdown selections, and other interactive events from [cards](/docs/cards). Register handlers with `onAction` to respond when users interact with your cards.

[Handle a specific action](#handle-a-specific-action)
-----------------------------------------------------

lib/bot.ts

```
bot.onAction("approve", async (event) => {
  await event.thread.post(`Order approved by ${event.user.fullName}!`);
});
```

[Handle multiple actions](#handle-multiple-actions)
---------------------------------------------------

lib/bot.ts

```
bot.onAction(["approve", "reject"], async (event) => {
  const action = event.actionId === "approve" ? "approved" : "rejected";
  await event.thread.post(`Order ${action} by ${event.user.fullName}`);
});
```

[Catch-all handler](#catch-all-handler)
---------------------------------------

Register a handler without an action ID to catch all actions:

lib/bot.ts

```
bot.onAction(async (event) => {
  console.log(`Action: ${event.actionId}, Value: ${event.value}`);
});
```

[ActionEvent](#actionevent)
---------------------------

The `event` object passed to action handlers:

| Property | Type | Description |
| --- | --- | --- |
| `actionId` | `string` | The `id` from the Button or Select component |
| `value` | `string` (optional) | The `value` from the Button or selected option |
| `user` | `Author` | The user who clicked |
| `thread` | `Thread | null` | The thread containing the card (null for view-based actions like home tab buttons) |
| `messageId` | `string` | The message containing the card |
| `threadId` | `string` | Thread ID |
| `adapter` | `Adapter` | The platform adapter |
| `triggerId` | `string` (optional) | Platform trigger ID (used for opening modals) |
| `openModal` | `(modal) => Promise<void>` | Open a modal dialog |
| `raw` | `unknown` | Platform-specific event payload |

[Pass data with buttons](#pass-data-with-buttons)
-------------------------------------------------

Use the `value` prop on buttons to pass extra context to your handler:

lib/bot.tsx

```
<Button id="report" value="bug">Report Bug</Button>
<Button id="report" value="feature">Request Feature</Button>
```

lib/bot.ts

```
bot.onAction("report", async (event) => {
  if (event.value === "bug") {
    // Open bug report flow
  } else if (event.value === "feature") {
    // Open feature request flow
  }
});
```

[Open a modal from an action](#open-a-modal-from-an-action)
-----------------------------------------------------------

Use `event.openModal()` to open a [modal](/docs/modals) in response to a button click:

lib/bot.tsx

```
import { Modal, TextInput, Select, SelectOption } from "chat";

bot.onAction("feedback", async (event) => {
  await event.openModal(
    <Modal callbackId="feedback_form" title="Send Feedback" submitLabel="Send">
      <TextInput id="message" label="Your Feedback" multiline />
      <Select id="category" label="Category">
        <SelectOption label="Bug" value="bug" />
        <SelectOption label="Feature" value="feature" />
      </Select>
    </Modal>
  );
});
```

Modals are currently supported on Slack and Teams. Other platforms will receive a no-op
or fallback behavior.

[Callback URLs](#callback-urls)
-------------------------------

Buttons accept a `callbackUrl` prop. When clicked, the action data is POSTed to that URL in addition to firing any `onAction` handler. This pairs naturally with webhook-based workflow engines to build approval flows without any `onAction` handler at all:

Callback tokens are bound to the button action and conversation, expire after seven days, and are consumed on first use. A repeated click or an attempt to move the token to another conversation does not trigger the callback URL again.

lib/bot.tsx

```
bot.onNewMention(async (thread) => {
  const approveUrl = "https://example.com/webhook/approve";
  const denyUrl = "https://example.com/webhook/deny";

  await thread.post(
    <Card title="Deploy v2.4.1?">
      <Actions>
        <Button callbackUrl={approveUrl} id="approve" style="primary">
          Approve
        </Button>
        <Button callbackUrl={denyUrl} id="deny" style="danger">
          Deny
        </Button>
      </Actions>
    </Card>
  );
});
```

### [Callback payload](#callback-payload)

The POST body sent to the `callbackUrl`:

```
{
  "type": "action",
  "actionId": "approve",
  "user": { "id": "U123", "name": "alice" },
  "threadId": "slack:C123:1234567890.123",
  "messageId": "1234567890.456"
}
```

If the button also has a `value` prop, it is included in the payload as `"value"`.

Platform limits apply to encoded button data. Discord's `custom_id` has a 100
character limit - if the action ID plus callback token exceed this, posting
the card throws a `ValidationError`. Telegram's `callback_data` has a 64 byte
limit - buttons that exceed this will throw a `ValidationError`. Keep action
IDs short when using `callbackUrl` on these platforms.

For modals, see [callbackUrl on modals](/docs/modals#callback-urls).

[Read more](#read-more)
-----------------------

[### Modals

Collect structured user input through modal dialogs with text fields, dropdowns, and validation.](/docs/modals)[### Approvals

Pause a durable workflow until a human approves it in chat.](/docs/approvals)[### Cards

Send rich interactive cards with buttons, fields, and images across all platforms.](/docs/cards)[### Slash Commands

Handle slash command invocations and respond with messages or modals.](/docs/slash-commands)
