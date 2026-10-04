---
title: "Modals"
source_url: https://chat-sdk.dev/docs/api/modals
section: api
crawled: 2026-09-20
---

# Modals

> Source: https://chat-sdk.dev/docs/api/modals

Modals display form dialogs that collect structured user input. Currently supported on Slack and Teams.

```
import {
  Modal,
  TextInput,
  DateInput,
  NumberInput,
  Select,
  RadioSelect,
  SelectOption,
} from "chat";
```

[Modal](#modal)
---------------

Top-level container for a form dialog. Open a modal from an `onAction` or `onSlashCommand` handler using `event.openModal()`.

```
bot.onAction("open-form", async (event) => {
  await event.openModal(
    Modal({
      callbackId: "feedback",
      title: "Submit Feedback",
      submitLabel: "Send",
      children: [
        TextInput({ id: "comment", label: "Comment", multiline: true }),
      ],
    })
  );
});
```

Prop

Type

`callbackId?`string

`title?`string

`submitLabel?`string

`closeLabel?`string

`notifyOnClose?`boolean

`callbackUrl?`string

`privateMetadata?`string

`children?`ModalChild[]

[TextInput](#textinput)
-----------------------

A text input field.

```
TextInput({
  id: "name",
  label: "Your name",
  placeholder: "Enter your name",
})

TextInput({
  id: "description",
  label: "Description",
  multiline: true,
  maxLength: 500,
  optional: true,
})
```

Prop

Type

`id?`string

`label?`string

`placeholder?`string

`initialValue?`string

`multiline?`boolean

`optional?`boolean

`maxLength?`number

[DateInput](#dateinput)
-----------------------

A date picker — a Slack `datepicker`, an Adaptive Card `Input.Date` on Teams.

```
DateInput({
  id: "due_date",
  label: "Due date",
  placeholder: "Pick a date",
  initialValue: "2026-08-01",
})
```

Prop

Type

`id?`string

`label?`string

`placeholder?`string

`initialValue?`string

`optional?`boolean

The submitted value arrives in `event.values` as an ISO `YYYY-MM-DD` string. An `initialValue` that is not a valid `YYYY-MM-DD` date is ignored with a warning — Slack rejects a malformed `initial_date` by failing the whole modal, so it is dropped rather than forwarded.

[NumberInput](#numberinput)
---------------------------

A numeric input — a Slack `number_input`, an Adaptive Card `Input.Number` on Teams.

```
NumberInput({
  id: "quantity",
  label: "Quantity",
  min: 1,
  max: 10,
})
```

Prop

Type

`id?`string

`label?`string

`placeholder?`string

`initialValue?`number

`min?`number

`max?`number

`decimal?`boolean

`optional?`boolean

Values in `event.values` are always strings — parse with `Number(...)` when you need a number.

[Select](#select)
-----------------

Dropdown menu.

```
Select({
  id: "priority",
  label: "Priority",
  placeholder: "Select priority",
  options: [
    SelectOption({ label: "High", value: "high", description: "Urgent tasks" }),
    SelectOption({ label: "Medium", value: "medium" }),
    SelectOption({ label: "Low", value: "low" }),
  ],
})
```

Prop

Type

`id?`string

`label?`string

`placeholder?`string

`initialOption?`string

`optional?`boolean

`options?`SelectOptionElement[]

`dispatchAction?`boolean

[ExternalSelect](#externalselect)
---------------------------------

Dropdown that loads options dynamically from a handler as the user types. Slack-only. Pair with [`bot.onOptionsLoad`](/docs/api/chat#onoptionsload) to supply options. See [Modals → ExternalSelect](/docs/modals#externalselect) for a full example, grouped-options support, and Slack setup notes.

```
ExternalSelect({
  id: "assignee",
  label: "Assignee",
  placeholder: "Search people",
  minQueryLength: 1,
  initialOption: { label: "Alice", value: "U123" },
})
```

Prop

Type

`id?`string

`label?`string

`placeholder?`string

`minQueryLength?`number

`initialOption?`{ label: string, value: string }

`optional?`boolean

The loader registered via `bot.onOptionsLoad("assignee", handler)` returns either a flat `SelectOptionElement[]` or `OptionsLoadGroup[]` (`{ label, options }[]`) for grouped options.

[RadioSelect](#radioselect)
---------------------------

Radio button group for mutually exclusive choices.

```
RadioSelect({
  id: "status",
  label: "Status",
  options: [
    SelectOption({ label: "Open", value: "open" }),
    SelectOption({ label: "Closed", value: "closed" }),
  ],
})
```

Same props as `Select` (except `placeholder`).

[SelectOption](#selectoption)
-----------------------------

An option used inside `Select` and `RadioSelect`.

```
SelectOption({ label: "High", value: "high", description: "Urgent tasks" })
```

Prop

Type

`label?`string

`value?`string

`description?`string

[ModalChild types](#modalchild-types)
-------------------------------------

The `children` array in `Modal` accepts these element types:

| Type | Created by |
| --- | --- |
| `TextInputElement` | `TextInput()` |
| `DateInputElement` | `DateInput()` |
| `NumberInputElement` | `NumberInput()` |
| `SelectElement` | `Select()` |
| `RadioSelectElement` | `RadioSelect()` |
| `TextElement` | `Text()` — static text content |
| `FieldsElement` | `Fields()` — key-value display |

[Read more](#read-more)
-----------------------

[### Modals

Collect structured user input through modal dialogs with text fields, dropdowns, and validation.](/docs/modals)[### Overview

API reference for the Chat SDK core package.](/docs/api)[### Chat

The main entry point for creating a multi-platform chat bot.](/docs/api/chat)[### Thread

Represents a conversation thread with methods for posting, subscribing, and state management.](/docs/api/thread)
