---
title: "Type Error with onToolCall"
source_url: https://ai-sdk.dev/docs/troubleshooting/ontoolcall-type-narrowing
section: troubleshooting
crawled: 2026-09-20
---

# Type Error with onToolCall

> Source: https://ai-sdk.dev/docs/troubleshooting/ontoolcall-type-narrowing

[Troubleshooting](/docs/troubleshooting)Type Error with onToolCall


[Type Error with onToolCall](#type-error-with-ontoolcall)
=========================================================

When using the `onToolCall` callback with TypeScript, you may encounter type errors when trying to pass tool properties directly to `addToolOutput`.

[Problem](#problem)
-------------------

TypeScript cannot automatically narrow the type of `toolCall.toolName` when you have both static and dynamic tools, leading to type errors:

```
1

// ❌ This causes a TypeScript error



2

const { messages, sendMessage, addToolOutput } = useChat({



3

async onToolCall({ toolCall }) {



4

addToolOutput({



5

tool: toolCall.toolName, // Type 'string' is not assignable to type '"yourTool" | "yourOtherTool"'



6

toolCallId: toolCall.toolCallId,



7

output: someOutput,



8

});



9

},



10

});
```

The error occurs because:

* Static tools have specific literal types for their names (e.g., `"getWeatherInformation"`)
* Dynamic tools have `toolName` as a generic `string`
* TypeScript can't guarantee that `toolCall.toolName` matches your specific tool names

[Solution](#solution)
---------------------

Check if the tool is dynamic first to enable proper type narrowing:

```
1

// ✅ Correct approach with type narrowing



2

const { messages, sendMessage, addToolOutput } = useChat({



3

async onToolCall({ toolCall }) {



4

// Check if it's a dynamic tool first



5

if (toolCall.dynamic) {



6

return;



7

}



8



9

// Now TypeScript knows this is a static tool with the correct type



10

addToolOutput({



11

tool: toolCall.toolName, // No type error!



12

toolCallId: toolCall.toolCallId,



13

output: someOutput,



14

});



15

},



16

});
```

If you're still using the deprecated `addToolResult` method, this solution
applies the same way. Consider migrating to `addToolOutput` for consistency
with the latest API.

[Related](#related)
-------------------

* [Chatbot Tool Usage](/docs/ai-sdk-ui/chatbot-tool-usage)
* [Dynamic Tools](/docs/reference/ai-sdk-core/dynamic-tool)
* [useChat Reference](/docs/reference/ai-sdk-ui/use-chat)

[Previous

Stale body values with useChat](/docs/troubleshooting/use-chat-stale-body-data)[Next

Unsupported model version error](/docs/troubleshooting/unsupported-model-version)
