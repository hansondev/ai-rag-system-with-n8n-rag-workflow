---
title: "Markdown"
source_url: https://chat-sdk.dev/docs/api/markdown
section: api
crawled: 2026-09-20
---

# Markdown

> Source: https://chat-sdk.dev/docs/api/markdown

The SDK uses [mdast](https://github.com/syntax-tree/mdast) (Markdown AST) as the canonical format for message formatting. Each adapter converts the AST to the platform's native format.

```
import {
  root, paragraph, text, strong, emphasis, strikethrough,
  inlineCode, codeBlock, link, blockquote,
  parseMarkdown, stringifyMarkdown, toPlainText, walkAst,
  tableToAscii, tableElementToAscii,
} from "chat";
```

[Type re-exports](#type-re-exports)
-----------------------------------

The chat package re-exports mdast's union and content types so adapters and downstream code can build exhaustively-typed AST walkers without depending on `mdast` directly:

```
import type { Nodes, Root, Content } from "chat";

function render(node: Nodes): string {
  switch (node.type) {
    case "text": return node.value;
    case "strong": return node.children.map(render).join("");
    // ...
    default: throw new Error(`Unhandled: ${node satisfies never}`);
  }
}
```

Adapters use this pattern to make the type checker reject the build when a new mdast node type is introduced upstream.

[Node builders](#node-builders)
-------------------------------

### [root](#root)

Root node — the required top-level wrapper for an AST.

```
root([
  paragraph([text("Hello, world!")]),
])
```

Prop

Type

`children?`Content[]

### [paragraph](#paragraph)

A paragraph block.

```
paragraph([text("Hello "), strong([text("world")])])
```

### [text](#text)

Plain text node.

```
text("Hello, world!")
```

### [strong](#strong)

**Bold** text.

```
strong([text("important")])
```

### [emphasis](#emphasis)

*Italic* text.

```
emphasis([text("emphasized")])
```

### [strikethrough](#strikethrough)

~~Strikethrough~~ text.

```
strikethrough([text("removed")])
```

### [inlineCode](#inlinecode)

`Inline code` span.

```
inlineCode("const x = 1")
```

### [codeBlock](#codeblock)

Fenced code block with optional language.

```
codeBlock("const x = 1;", "typescript")
```

Prop

Type

`value?`string

`lang?`string | undefined

### [link](#link)

Hyperlink.

```
link("https://example.com", [text("click here")])
link("https://example.com", [text("click here")], "tooltip title")
```

Prop

Type

`url?`string

`children?`Content[]

`title?`string | undefined

### [blockquote](#blockquote)

Block quotation.

```
blockquote([paragraph([text("Quoted text")])])
```

[Parsing and stringifying](#parsing-and-stringifying)
-----------------------------------------------------

### [parseMarkdown](#parsemarkdown)

Parse a markdown string into an mdast AST.

```
const ast = parseMarkdown("**Hello** world");
```

### [stringifyMarkdown](#stringifymarkdown)

Convert an mdast AST back to a markdown string.

```
const md = stringifyMarkdown(ast); // "**Hello** world"
```

### [toPlainText](#toplaintext)

Strip all formatting and return plain text.

```
const plain = toPlainText(ast); // "Hello world"
```

### [markdownToPlainText](#markdowntoplaintext)

Shorthand for parsing markdown and extracting plain text.

```
const plain = markdownToPlainText("**Hello** world"); // "Hello world"
```

[AST utilities](#ast-utilities)
-------------------------------

### [walkAst](#walkast)

Transform an AST by visiting each node. Return a new value to replace the node, or `undefined` to keep it unchanged.

```
const transformed = walkAst(ast, (node) => {
  if (isStrongNode(node)) {
    return emphasis(getNodeChildren(node));
  }
  return undefined;
});
```

### [Type guards](#type-guards)

Functions for checking node types:

| Guard | Matches |
| --- | --- |
| `isTextNode(node)` | Plain text |
| `isParagraphNode(node)` | Paragraph |
| `isStrongNode(node)` | Bold |
| `isEmphasisNode(node)` | Italic |
| `isDeleteNode(node)` | Strikethrough |
| `isInlineCodeNode(node)` | Inline code |
| `isCodeNode(node)` | Code block |
| `isLinkNode(node)` | Link |
| `isBlockquoteNode(node)` | Blockquote |
| `isListNode(node)` | List |
| `isListItemNode(node)` | List item |
| `isTableNode(node)` | Table |
| `isTableRowNode(node)` | Table row |
| `isTableCellNode(node)` | Table cell |

### [getNodeChildren / getNodeValue](#getnodechildren--getnodevalue)

Safely access node properties without type narrowing.

```
const children = getNodeChildren(node); // Content[] | undefined
const value = getNodeValue(node);       // string | undefined
```

[Table utilities](#table-utilities)
-----------------------------------

### [tableToAscii](#tabletoascii)

Render an mdast `Table` node as a padded ASCII table string. Used by adapters that lack native table support (Google Chat, Discord, Telegram).

```
import { parseMarkdown, tableToAscii, isTableNode } from "chat";

const ast = parseMarkdown("| Name | Role |\n|------|------|\n| Alice | Engineer |");
// Find the table node and convert it
```

Output:

```
Name  | Role
------|--------
Alice | Engineer
```

### [tableElementToAscii](#tableelementtoascii)

Render a table from headers and string row arrays as a padded ASCII table. Used for card `TableElement` fallback rendering.

```
import { tableElementToAscii } from "chat";

const ascii = tableElementToAscii(
  ["Name", "Age", "Role"],
  [
    ["Alice", "30", "Engineer"],
    ["Bob", "25", "Designer"],
  ]
);
```

[Platform formatting](#platform-formatting)
-------------------------------------------

The SDK uses mdast as the canonical format and each adapter converts it to the platform's native syntax. You write standard markdown and the SDK handles the translation — but it helps to know how each platform renders common formatting.

| Feature | Slack | Teams | Google Chat |
| --- | --- | --- | --- |
| Bold | `**text**` | `**text**` | `*text*` |
| Italic | `_text_` | `_text_` | `_text_` |
| Strikethrough | `~~text~~` | `~~text~~` | `~text~` |
| Code | `` `code` `` | `` `code` `` | `` `code` `` |
| Code blocks | ```` ``` ```` | ```` ``` ```` | ```` ``` ```` |
| Links | `[text](url)` | `[text](url)` | `[text](url)` |
| Lists | Supported | Supported | Supported |
| Blockquotes | `>` | `>` | Simulated with `>` prefix |
| Tables | Native (markdown\_text) | Native GFM | ASCII fallback |
| Mentions | `<@USER>` | `<at>name</at>` | `<users/{id}>` |

Slack accepts standard markdown via the `markdown_text` field on `chat.postMessage` and friends, so the SDK passes markdown through directly. Incoming Slack messages still arrive as legacy mrkdwn (`*bold*`, `<url|text>`) and are parsed transparently. If you need to send mrkdwn yourself, use `{ raw: "..." }`.

You don't need to worry about these differences when using the SDK — the AST builders and `parseMarkdown` handle conversion automatically. This table is useful if you're working with `raw` platform payloads or debugging formatting issues.

[Read more](#read-more)
-----------------------

[### Posting Messages

Different ways to render and send messages with thread.post().](/docs/posting-messages)[### Emoji

Type-safe, cross-platform emoji that automatically convert to each platform's format.](/docs/emoji)[### Modals

Modal form components for collecting user input.](/docs/api/modals)[### Overview

API reference for the Chat SDK core package.](/docs/api)
