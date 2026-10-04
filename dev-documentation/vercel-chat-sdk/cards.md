---
title: "Cards"
source_url: https://chat-sdk.dev/docs/cards
section: cards
crawled: 2026-09-20
---

# Cards

> Source: https://chat-sdk.dev/docs/cards

Cards let you send structured, interactive messages that render natively on each platform — Block Kit on Slack, Adaptive Cards on Teams, Discord embeds or Components, and Google Chat Cards.

[Setup](#setup)
---------------

Configure your `tsconfig.json` to use the Chat SDK JSX runtime:

tsconfig.json

```
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "chat"
  }
}
```

Or use a per-file pragma:

lib/bot.tsx

```
/** @jsxImportSource chat */
```

[Basic card](#basic-card)
-------------------------

lib/bot.tsx

```
import { Card, CardText, Button, Actions } from "chat";

await thread.post(
  <Card title="Order #1234">
    <CardText>Your order has been received!</CardText>
    <Actions>
      <Button id="approve" style="primary">Approve</Button>
      <Button id="reject" style="danger">Reject</Button>
    </Actions>
  </Card>
);
```

[Components](#components)
-------------------------

### [Card](#card)

The top-level container. Accepts `title` and optional `subtitle`.

lib/bot.tsx

```
<Card title="My Card" subtitle="Optional subtitle">
  {/* children */}
</Card>
```

Set `width="full"` to ask for a wider card on platforms that can render one. Teams renders it as a full-width Adaptive Card; other adapters ignore the hint.

lib/bot.tsx

```
<Card title="Weekly digest" width="full">
  {/* children */}
</Card>
```

### [CardText](#cardtext)

Renders formatted text. Supports a subset of markdown.

lib/bot.tsx

```
<CardText>**Bold** and _italic_ text</CardText>
<CardText style="bold">Bold section header</CardText>
```

Use `CardText` instead of `Text` when using JSX to avoid conflicts with React's built-in types.

### [Section](#section)

Groups related content together.

lib/bot.tsx

```
<Section>
  <CardText>Section content here</CardText>
</Section>
```

### [Fields](#fields)

Renders key-value pairs in a compact layout.

lib/bot.tsx

```
<Fields>
  <Field label="Name" value="John Doe" />
  <Field label="Role" value="Developer" />
  <Field label="Team" value="Platform" />
</Fields>
```

### [Button](#button)

An action button that triggers an `onAction` handler.

lib/bot.tsx

```
<Button id="approve" style="primary">Approve</Button>
<Button id="reject" style="danger">Reject</Button>
<Button id="details">View Details</Button>
```

The `id` maps to your `onAction` handler. Optional `value` passes extra data:

lib/bot.tsx

```
<Button id="report" value="bug">Report Bug</Button>
```

Set `actionType="modal"` to indicate the button opens a [modal](/docs/modals). The button still triggers your `onAction` handler, where you call `event.openModal()` — this prop tells adapters like Teams to wire up the button for dialog opening:

lib/bot.tsx

```
<Button id="open-feedback" actionType="modal">Give Feedback</Button>
```

Optional `callbackUrl` causes the action data to be POSTed to a URL when clicked. See [Callback URLs](/docs/actions#callback-urls) for details.

lib/bot.tsx

```
<Button callbackUrl={webhook.url} id="approve" style="primary">Approve</Button>
```

Optional `tooltip` is hover text for the button. Teams renders it; other adapters ignore it:

lib/bot.tsx

```
<Button id="approve" tooltip="Approve the request">Approve</Button>
```

### [CardLink](#cardlink)

Inline hyperlink rendered as text. Unlike `LinkButton` (which must be inside `Actions`), `CardLink` can be placed directly in a card alongside other content.

lib/bot.tsx

```
<CardLink url="https://example.com/order/1234" label="View order details" />
```

Or with children as the label:

lib/bot.tsx

```
<CardLink url="https://example.com/docs">Read the docs</CardLink>
```

`CardLink` renders as a platform-native link: `<url|label>` on Slack, `[label](url)` on Teams/Discord/GitHub/Linear, and `<a href>` on Google Chat.

### [LinkButton](#linkbutton)

Opens an external URL. No `onAction` handler needed for navigation. On platforms
that emit link-button click events, such as Slack, pass `id` when you need a
stable action identifier for routing or analytics.

lib/bot.tsx

```
<LinkButton url="https://example.com/order/1234">View Order</LinkButton>
```

lib/bot.tsx

```
<LinkButton id="view_order" url="https://example.com/order/1234">
  View Order
</LinkButton>
```

Optional `tooltip` is hover text for the button. Teams renders it; other adapters ignore it:

lib/bot.tsx

```
<LinkButton tooltip="Opens the order in your browser" url="https://example.com/order/1234">
  View Order
</LinkButton>
```

### [Actions](#actions)

Container for buttons and interactive elements.

lib/bot.tsx

```
<Actions>
  <Button id="approve" style="primary">Approve</Button>
  <Button id="reject" style="danger">Reject</Button>
  <LinkButton url="https://example.com">View</LinkButton>
</Actions>
```

### [Select](#select)

Inline dropdown menu.

lib/bot.tsx

```
<Actions>
  <Select id="priority" label="Priority" placeholder="Select priority">
    <SelectOption label="High" value="high" description="Urgent tasks" />
    <SelectOption label="Medium" value="medium" />
    <SelectOption label="Low" value="low" />
  </Select>
</Actions>
```

Selection triggers an `onAction` handler with the `id` as the `actionId` and the selected value.

### [RadioSelect](#radioselect)

Radio button group for mutually exclusive choices.

lib/bot.tsx

```
<Actions>
  <RadioSelect id="status" label="Status">
    <SelectOption label="Open" value="open" />
    <SelectOption label="In Progress" value="in_progress" />
    <SelectOption label="Done" value="done" />
  </RadioSelect>
</Actions>
```

### [Table](#table)

Structured data display with column headers and rows. Renders as a native table on platforms that support it (Slack, Teams, GitHub, Linear), as GFM markdown in Discord card payloads, and as padded ASCII text elsewhere.

lib/bot.tsx

```
<Table
  headers={["Name", "Age", "Role"]}
  rows={[
    ["Alice", "30", "Engineer"],
    ["Bob", "25", "Designer"],
  ]}
/>
```

Optional column alignment:

lib/bot.tsx

```
<Table
  headers={["Name", "Amount"]}
  rows={[["Alice", "$100"], ["Bob", "$200"]]}
  align={["left", "right"]}
/>
```

On Teams, tables render as the native Adaptive Card `Table` element: grid lines between cells, columns sized by relative weight and a header row marked for accessibility. The optional `widths`, `verticalAlign`, `gridLines` and `gridStyle` props tune that rendering and are ignored on other platforms:

lib/bot.tsx

```
<Table
  headers={["Service", "Status", "Latency"]}
  rows={[
    ["api", "ok", "120 ms"],
    ["worker", "degraded", "840 ms"],
  ]}
  widths={[2, 1, 1]}
  align={["left", "center", "right"]}
  gridStyle="emphasis"
/>
```

Pass `gridLines={false}` for a borderless table. A table with empty `headers` renders without a header row.

On Slack, tables render as paginated, sortable [data tables](https://docs.slack.dev/reference/block-kit/blocks/data-table-block). The optional `caption` (accessible table description) and `pageSize` (rows per page, 1–100) props tune that rendering and are ignored on other platforms:

lib/bot.tsx

```
<Table
  headers={["Name", "Score"]}
  rows={[["Alice", "98"], ["Bob", "87"]]}
  caption="Quarterly review scores"
  pageSize={10}
/>
```

### [Chart](#chart)

Data visualization with pie, bar, area, and line charts. Renders as a native [data visualization](https://docs.slack.dev/reference/block-kit/blocks/data-visualization-block) on Slack; other platforms fall back to the chart's data rendered as a text table.

lib/bot.tsx

```
<Chart
  title="My Favorite Candy Bars"
  chart={{
    type: "pie",
    segments: [
      { label: "Kit Kat", value: 45 },
      { label: "Twix", value: 28 },
      { label: "Crunch", value: 18 },
    ],
  }}
/>
```

Bar, area, and line charts take named series plotted against shared categories:

lib/bot.tsx

```
<Chart
  title="Daily Active Users"
  chart={{
    type: "line",
    categories: ["Mon", "Tue", "Wed"],
    xLabel: "Day",
    yLabel: "Users",
    series: [
      {
        name: "Web",
        data: [
          { label: "Mon", value: 120 },
          { label: "Tue", value: 135 },
          { label: "Wed", value: 128 },
        ],
      },
      {
        name: "Mobile",
        data: [
          { label: "Mon", value: 80 },
          { label: "Tue", value: 95 },
          { label: "Wed", value: 90 },
        ],
      },
    ],
  }}
/>
```

Slack enforces a 50-character title, up to 12 segments or series, up to 20 categories, 20-character labels, and at most 2 charts per message. Charts that exceed these limits fall back to a text rendering of the data instead of being rejected by the API.

### [Image](#image)

Embeds an image in the card.

lib/bot.tsx

```
<Image url="https://example.com/screenshot.png" alt="Screenshot" />
```

### [Divider](#divider)

A visual separator between sections.

lib/bot.tsx

```
<CardText>Above the line</CardText>
<Divider />
<CardText>Below the line</CardText>
```

[Full example](#full-example)
-----------------------------

lib/bot.tsx

```
import {
  Card, CardText, CardLink, Button, LinkButton, Actions,
  Section, Fields, Field, Divider, Image,
  Select, SelectOption, RadioSelect,
} from "chat";

await thread.post(
  <Card title="User Profile" subtitle="Account details">
    <Image url="https://example.com/avatar.png" alt="User avatar" />
    <Fields>
      <Field label="Name" value="Jane Smith" />
      <Field label="Role" value="Engineer" />
      <Field label="Team" value="Platform" />
    </Fields>
    <CardLink url="https://example.com/profile/123">View full profile</CardLink>
    <Divider />
    <Section>
      <CardText>Select an action below to manage this profile.</CardText>
    </Section>
    <Actions>
      <Select id="role" label="Change Role" placeholder="Select role">
        <SelectOption label="Engineer" value="engineer" />
        <SelectOption label="Manager" value="manager" />
        <SelectOption label="Admin" value="admin" />
      </Select>
      <Button id="edit" style="primary">Edit Profile</Button>
      <Button id="deactivate" style="danger">Deactivate</Button>
      <LinkButton url="https://example.com/profile/123">View Full Profile</LinkButton>
    </Actions>
  </Card>
);
```

[Read more](#read-more)
-----------------------

[### Actions

Handle button clicks and interactive card events across platforms.](/docs/actions)[### Modals

Collect structured user input through modal dialogs with text fields, dropdowns, and validation.](/docs/modals)[### Cards

Rich card components for cross-platform interactive messages.](/docs/api/cards)[### Emoji

Type-safe, cross-platform emoji that automatically convert to each platform's format.](/docs/emoji)
