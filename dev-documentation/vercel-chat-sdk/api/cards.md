---
title: "Cards"
source_url: https://chat-sdk.dev/docs/api/cards
section: api
crawled: 2026-09-20
---

# Cards

> Source: https://chat-sdk.dev/docs/api/cards

Card components render natively on each platform — Block Kit on Slack, Adaptive Cards on Teams, embeds or components on Discord, and Google Chat Cards.

```
import { Card, Text, CardLink, Button, Actions, Section, Fields, Field, Divider, Image, LinkButton, Table, Chart } from "chat";
```

All components support both function-call and JSX syntax. Function-call syntax is recommended for better type inference.

[Card](#card)
-------------

Top-level container for a rich message.

```
Card({
  title: "Order #1234",
  subtitle: "Pending approval",
  children: [Text("Total: $50.00")],
})
```

Prop

Type

`title?`string

`subtitle?`string

`imageUrl?`string

`children?`CardChild[]

`width?`"default" | "full"

[Text](#text)
-------------

Text content element. Use `CardText` instead of `Text` in JSX to avoid conflicts with React's built-in types.

```
Text("Hello, world!")
Text("Important", { style: "bold" })
Text("Subtle note", { style: "muted" })
```

Prop

Type

`content?`string

`options.style?`"plain" | "bold" | "muted"

[Button](#button)
-----------------

Interactive button that triggers an `onAction` handler.

```
Button({ id: "approve", label: "Approve", style: "primary" })
Button({ id: "delete", label: "Delete", style: "danger", value: "item-123" })
```

Prop

Type

`id?`string

`label?`string

`style?`"primary" | "danger" | "default"

`value?`string

`actionType?`"action" | "modal"

`callbackUrl?`string

`tooltip?`string

[CardLink](#cardlink)
---------------------

Inline hyperlink rendered as text. Can be placed directly in a card alongside other content, unlike `LinkButton` which must live inside `Actions`.

```
CardLink({ url: "https://example.com", label: "Visit Site" })
```

Prop

Type

`url?`string

`label?`string

[LinkButton](#linkbutton)
-------------------------

Button that opens a URL. No `onAction` handler needed for navigation. On
platforms that emit link-button click events, such as Slack, pass `id` when you
need a stable action identifier for routing or analytics.

```
LinkButton({ url: "https://example.com", label: "View Docs" })
LinkButton({ id: "view_docs", url: "https://example.com", label: "View Docs" })
```

Prop

Type

`id?`string

`url?`string

`label?`string

`style?`"primary" | "danger" | "default"

`tooltip?`string

[Actions](#actions)
-------------------

Container for buttons and interactive elements. Required wrapper around `Button`, `LinkButton`, `Select`, and `RadioSelect`.

```
Actions([
  Button({ id: "approve", label: "Approve", style: "primary" }),
  Button({ id: "reject", label: "Reject", style: "danger" }),
  LinkButton({ url: "https://example.com", label: "View" }),
])
```

[Section](#section)
-------------------

Groups related content together.

```
Section([
  Text("Grouped content"),
  Image({ url: "https://example.com/photo.png" }),
])
```

[Fields](#fields)
-----------------

Renders key-value pairs in a compact, multi-column layout.

```
Fields([
  Field({ label: "Name", value: "Jane Smith" }),
  Field({ label: "Role", value: "Engineer" }),
])
```

[Field](#field)
---------------

A single key-value pair. Must be used inside `Fields`.

Prop

Type

`label?`string

`value?`string

[Image](#image)
---------------

Embeds an image in the card.

```
Image({ url: "https://example.com/screenshot.png", alt: "Screenshot" })
```

Prop

Type

`url?`string

`alt?`string

[Table](#table)
---------------

Structured data display with column headers and rows.

```
Table({
  headers: ["Name", "Age", "Role"],
  rows: [
    ["Alice", "30", "Engineer"],
    ["Bob", "25", "Designer"],
  ],
})
```

Prop

Type

`headers?`string[]

`rows?`string[][]

`align?`"left" | "center" | "right"[]

`caption?`string

`pageSize?`number

`widths?`number[]

`verticalAlign?`"top" | "center" | "bottom"

`gridLines?`boolean

`gridStyle?`"default" | "emphasis" | "accent" | "good" | "attention" | "warning"

On platforms with native table support (Slack, Teams, GitHub, Linear), tables render as formatted tables. On Slack, tables render as paginated, sortable data table blocks. On Teams, tables render as the Adaptive Card `Table` element with grid lines and weighted column widths. Discord card payloads preserve GFM markdown tables. On other platforms (Google Chat, Telegram), tables render as padded ASCII text.

[Chart](#chart)
---------------

Data visualization with pie, bar, area, and line charts.

```
Chart({
  title: "My Favorite Candy Bars",
  chart: {
    type: "pie",
    segments: [
      { label: "Kit Kat", value: 45 },
      { label: "Twix", value: 28 },
    ],
  },
})
```

Prop

Type

`title?`string

`chart?`ChartDefinition

Pie charts take `segments` (label + value, rendered as percentages of the total). Bar, area, and line charts take `series` (named lists of data points) plotted against shared `categories`, with optional `xLabel`/`yLabel` axis titles.

On Slack, charts render as native data visualization blocks. On other platforms, charts fall back to the underlying data rendered as a text table.

[Divider](#divider)
-------------------

A visual separator between sections.

```
Divider()
```

[CardChild types](#cardchild-types)
-----------------------------------

The `children` array in `Card` and `Section` accepts these element types:

| Type | Created by |
| --- | --- |
| `TextElement` | `Text()` |
| `LinkElement` | `CardLink()` |
| `ImageElement` | `Image()` |
| `DividerElement` | `Divider()` |
| `ActionsElement` | `Actions()` |
| `SectionElement` | `Section()` |
| `FieldsElement` | `Fields()` |
| `TableElement` | `Table()` |
| `ChartElement` | `Chart()` |

[Read more](#read-more)
-----------------------

[### Cards

Send rich interactive cards with buttons, fields, and images across all platforms.](/docs/cards)[### Actions

Handle button clicks and interactive card events across platforms.](/docs/actions)[### Markdown

AST builder functions and utilities for programmatic message formatting.](/docs/api/markdown)[### Modals

Modal form components for collecting user input.](/docs/api/modals)
