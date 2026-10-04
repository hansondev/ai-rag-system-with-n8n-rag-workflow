---
title: "Approvals"
source_url: https://chat-sdk.dev/docs/approvals
section: approvals
crawled: 2026-09-20
---

# Approvals

> Source: https://chat-sdk.dev/docs/approvals

`requestApproval` from `chat/workflow` posts a card with Approve/Deny buttons and suspends a [Workflow SDK](https://workflow-sdk.dev) workflow until a user clicks. The wait can last seconds or days and survives deploys and restarts. You don't need an approvals table, an `onAction` handler, or a polling loop.

workflows/deploy.ts

```
import { requestApproval } from "chat/workflow";
import type { Thread } from "chat";

export async function deployApproval(opts: { thread: Thread; version: string }) {
  "use workflow";

  const { approved, user, timedOut } = await requestApproval(opts.thread, {
    title: `Deploy ${opts.version}?`,
    fields: { Version: opts.version },
    timeout: "24h",
  });

  if (approved) {
    await deploy(opts.version);
  }
}

async function deploy(version: string) {
  "use step";
  // Trigger your deploy here.
}
```

Start the workflow from any handler. `Thread` instances serialize across the workflow boundary automatically:

lib/bot.ts

```
import { start } from "workflow/api";
import { deployApproval } from "@/workflows/deploy";

bot.onNewMention(async (thread, message) => {
  await start(deployApproval, [{ thread, version: "v1.2.3" }]);
});
```

[Setup](#setup)
---------------

Install the optional `workflow` peer dependency and configure your framework for [Workflow SDK](https://workflow-sdk.dev/docs/getting-started). Then register your `Chat` instance as a singleton at startup so threads can be revived on the other side of the workflow boundary:

lib/bot.ts

```
chat.registerSingleton();
```

[Options](#options)
-------------------

| Option | Type | Description |
| --- | --- | --- |
| `title` | `string` | Card title (required) |
| `subtitle` | `string` | Rendered under the title |
| `description` | `string` | Body text (markdown) above the fields |
| `fields` | `Record<string, string>` | Key/value pairs rendered as a bold-label list |
| `approveLabel` / `denyLabel` | `string` | Button labels. Default: "Approve" / "Deny" |
| `timeout` | `` number | `${number}${"ms"|"s"|"m"|"h"|"d"}` `` | Give up after this long. Omit to wait indefinitely |
| `approvers` | `string[]` | User IDs allowed to decide. Clicks from others post a notice and keep waiting |

[Result](#result)
-----------------

| Property | Type | Description |
| --- | --- | --- |
| `approved` | `boolean` | True when the approve button was clicked |
| `timedOut` | `boolean` | True when `timeout` elapsed with no decision |
| `user` | `{ id: string; name?: string }` | Who decided. Absent on timeout |

Once a decision lands (or the timeout elapses), the card is edited in place: the buttons are removed and replaced with an outcome line, leaving an audit trail in the thread and preventing stale clicks.

[Who can approve](#who-can-approve)
-----------------------------------

Anyone who can see the card can decide the approval. The click itself is trustworthy: Chat SDK verifies the platform's signature on the incoming event, and the button's callback URL never reaches the client. So the `user.id` on the result really is the person who clicked.

If only certain people should decide, pass `approvers` with their user IDs. When anyone else clicks, the bot posts a notice in the thread and the workflow keeps waiting:

```
await requestApproval(thread, {
  title: `Deploy ${version}?`,
  approvers: ["U_ALICE", "U_BOB"],
});
```

Set `approvers` for anything consequential.

[Custom cards](#custom-cards)
-----------------------------

The card builders are exported for cases the wrapper doesn't cover, such as posting an approval card whose buttons target a webhook you manage yourself:

```
import { buildApprovalCard, buildResolvedCard } from "chat/workflow";

const card = buildApprovalCard(
  { title: "Deploy?", fields: { Version: "v1.2.3" } },
  webhookUrl
);
```

The [Human-in-the-Loop guide](https://vercel.com/kb/guide/human-in-the-loop-with-chat-sdk-and-workflow-sdk)
walks through the underlying pattern, including multi-stage approvals and
validating approvers with `createHook()`.

[Read more](#read-more)
-----------------------

[### AI SDK Tools

Give an AI agent the ability to operate inside your workspace. Post messages, send DMs, react, edit, delete; all with built-in approval gates.](/docs/ai/ai-sdk-tools)[### Cards

Send rich interactive cards with buttons, fields, and images across all platforms.](/docs/cards)[### Actions

Handle button clicks and interactive card events across platforms.](/docs/actions)[### Slash Commands

Handle slash command invocations and respond with messages or modals.](/docs/slash-commands)
