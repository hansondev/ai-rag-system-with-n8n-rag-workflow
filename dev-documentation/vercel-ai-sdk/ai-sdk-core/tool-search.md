---
title: "Tool Search"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/tool-search
section: ai-sdk-core
crawled: 2026-09-20
---

# Tool Search

> Source: https://ai-sdk.dev/docs/ai-sdk-core/tool-search

[AI SDK Core](/docs/ai-sdk-core)Tool Search


[Tool Search](#tool-search)
===========================

`toolSearch()` lets a model find the tools it needs without loading every tool's
definition into its initial context. Register tools with `deferLoading: true`;
search matches their names and descriptions and makes them available on the
**next model step**.

Use it with `generateText`, `streamText`, `ToolLoopAgent`, or `WorkflowAgent` from
`@ai-sdk/workflow`. The factory takes no arguments; the model supplies a search
query. `WorkflowAgent` supports direct tool calling; the other APIs also support
cache-preserving code mode.

[Direct Tool Calling](#direct-tool-calling)
-------------------------------------------

The model initially sees only `search`. After searching, matching definitions are
added to the provider's tool list and the model calls those tools directly. This
changes the tool definitions and can invalidate the cached prompt prefix.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, isStepCount, tool, toolSearch } from 'ai';



2

import { z } from 'zod/v4';



3



4

const weather = tool({



5

deferLoading: true,



6

description: 'Get the weather forecast for a city.',



7

inputSchema: z.object({ city: z.string() }),



8

execute: async ({ city }) => ({ city, forecast: 'Rain tomorrow.' }),



9

});



10



11

const result = await generateText({



12

model: "xai/grok-4.6",



13

tools: { search: toolSearch(), weather },



14

stopWhen: isStepCount(5),



15

prompt: 'Will it rain in Bangalore tomorrow?',



16

});
```

[Code Mode](#code-mode)
-----------------------

With [code mode](/docs/ai-sdk-core/code-mode), the model searches and calls tools
through generated code. Set `toolDiscovery: 'conversation'` to announce discovered
definitions in user messages while keeping the provider-visible code tool
unchanged. **This preserves the tool-definition cache as tools are discovered.**
Actual prompt-cache reuse depends on the provider.

Using the `weather` tool defined above:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { experimental_codeModeTool as codeModeTool } from '@ai-sdk/code-mode';



2



3

const result = await generateText({



4

model: "xai/grok-4.6",



5

tools: {



6

code: codeModeTool({ toolDiscovery: 'conversation' }),



7

search: toolSearch(),



8

weather,



9

},



10

experimental_toolCallers: {



11

search: ['code'],



12

weather: ['code'],



13

},



14

stopWhen: isStepCount(5),



15

prompt: 'Will it rain in Bangalore tomorrow?',



16

});
```

The model first runs `tools.search({ query: 'weather forecast' })`. On the next
step, it receives the updated capability catalog and can call
`tools.weather({ city: 'Bangalore' })`.

In both modes, search loads up to five matches, respects `activeTools` and caller
routing, and keeps discovered tools available for the rest of the generation.
MCP client tools work too: add `deferLoading: true` to the tools returned by
`client.tools()`.

See the [`toolSearch()` reference](/docs/reference/ai-sdk-core/tool-search) for
input, output, and matching details.

[Previous

Code Mode](/docs/ai-sdk-core/code-mode)[Next

Prompt Engineering](/docs/ai-sdk-core/prompt-engineering)
