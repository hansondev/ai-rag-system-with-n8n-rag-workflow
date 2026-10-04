---
title: "toolSearch()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/tool-search
section: reference
crawled: 2026-09-20
---

# toolSearch()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/tool-search

[AI SDK Core](/docs/ai-sdk-core)Tool Search


[`toolSearch()`](#toolsearch)
=============================

Creates a tool that searches the surrounding generation's deferred tools by name
and description. The factory takes no arguments. Use it with `generateText`,
`streamText`, `ToolLoopAgent`, or `WorkflowAgent` from `@ai-sdk/workflow`.
`WorkflowAgent` supports direct tool calling. The other APIs also support code
mode configured with `toolDiscovery: 'conversation'`.

```
1

import { toolSearch } from 'ai';



2



3

const search = toolSearch();
```

See the [Tool Search guide](/docs/ai-sdk-core/tool-search) for direct-calling and
code mode examples, including how code mode preserves the tool-definition cache.

[Model Input](#model-input)
---------------------------

The model supplies the following input to the search tool:

```
1

{ "query": "weather forecast" }
```

`query` is a required, nonempty string of search keywords. Search is local and
case-insensitive, matching words in tool names and descriptions. Camel-case names
are split into words. Name matches rank above description matches; equal scores
preserve registration order. Function descriptions are resolved with the current
tool context and sandbox. No embedding service or additional model call is used.

[Output](#output)
-----------------

```
1

{



2

tools: [



3

{ name: 'getForecast', description: 'Get the weather forecast for a city.' },



4

],



5

}
```

Results contain at most five matching tools, with their names and optional
descriptions. They do not include schemas. No matches returns `{ tools: [] }`.
Every returned match is queued for discovery. Newly discovered tools can only be
called on the next model step, after their definitions have been provided. A
parallel call in the same response as the search cannot use a newly discovered
tool. For code mode, finish the current execution and wait for the capability
update.

[Discovery Lifecycle](#discovery-lifecycle)
-------------------------------------------

Before the next model step, the SDK makes discovered tools available through
their configured callers:

* **Direct calling:** the provider receives the updated tool definitions.
* **Code mode:** the SDK appends a user message containing the updated capability
  catalog. The provider-visible code mode definition stays unchanged. Existing
  catalogs remain in the conversation; the latest catalog describes the complete
  currently available tool set.

Actual prompt-cache reuse depends on the provider. Code mode search still requires
`toolDiscovery: 'conversation'`; description discovery and provider callers are
not supported.

Discovered tools remain loaded for the rest of the generation, subject to
`activeTools`. Search cannot discover tools excluded by `activeTools`. Discovery
state is isolated between generation calls, including calls that reuse the same
agent or tool instances.

Set a multi-step `stopWhen` condition with `generateText` and `streamText` so the
model can search, use the discovered tools, and answer.

[Previous

experimental\_getRealtimeToolDefinitions](/docs/reference/ai-sdk-core/get-realtime-tool-definitions)[Next

experimental\_listBatches](/docs/reference/ai-sdk-core/list-batches)
