---
title: "AI SDK UI"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-ui
section: reference
crawled: 2026-09-20
---

# AI SDK UI

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-ui

[Reference](/docs/reference)AI SDK UI


[AI SDK UI](#ai-sdk-ui)
=======================

[AI SDK UI](/docs/ai-sdk-ui) is designed to help you build interactive chat, completion, and assistant applications with ease.
It is a framework-agnostic toolkit, streamlining the integration of advanced AI functionalities into your applications.

AI SDK UI contains the following hooks:

[useChat

Use a hook to interact with language models in a chat interface.](/docs/reference/ai-sdk-ui/use-chat)[useCompletion

Use a hook to interact with language models in a completion interface.](/docs/reference/ai-sdk-ui/use-completion)[useObject

Use a hook for consuming a streamed JSON objects.](/docs/reference/ai-sdk-ui/use-object)[experimental\_useRealtime

Use a hook to build realtime voice conversations.](/docs/reference/ai-sdk-ui/use-realtime)[convertToModelMessages

Convert useChat messages to ModelMessages for AI functions.](/docs/reference/ai-sdk-ui/convert-to-model-messages)[pruneMessages

Prunes model messages from a list of model messages.](/docs/reference/ai-sdk-ui/prune-messages)[createUIMessageStream

Create a UI message stream to stream additional data to the client.](/docs/reference/ai-sdk-ui/create-ui-message-stream)[createUIMessageStreamResponse

Create a response object to stream UI messages to the client.](/docs/reference/ai-sdk-ui/create-ui-message-stream-response)[pipeUIMessageStreamToResponse

Pipe a UI message stream to a Node.js ServerResponse object.](/docs/reference/ai-sdk-ui/pipe-ui-message-stream-to-response)[readUIMessageStream

Transform a stream of UIMessageChunk objects into an AsyncIterableStream of UIMessage objects.](/docs/reference/ai-sdk-ui/read-ui-message-stream)[experimental\_MCPAppRenderer

Render interactive MCP App tool UIs in React.](/docs/reference/ai-sdk-ui/mcp-app-renderer)

[UI Framework Support](#ui-framework-support)
---------------------------------------------

AI SDK UI supports the following frameworks: [React](https://react.dev/), [Svelte](https://svelte.dev/), [Vue.js](https://vuejs.org/),
[Angular](https://angular.dev/), and [SolidJS](https://www.solidjs.com/).

Here is a comparison of the supported functions across these frameworks:

|  | [useChat](/docs/reference/ai-sdk-ui/use-chat) | [useCompletion](/docs/reference/ai-sdk-ui/use-completion) | [useObject](/docs/reference/ai-sdk-ui/use-object) | [MCP Apps](/docs/ai-sdk-core/mcp-apps) |
| --- | --- | --- | --- | --- |
| React `@ai-sdk/react` |  |  |  |  |
| Vue.js `@ai-sdk/vue` | Chat |  |  |  |
| Svelte `@ai-sdk/svelte` | Chat | Completion | StructuredObject |  |
| Angular `@ai-sdk/angular` | Chat | Completion | StructuredObject |  |
| [SolidJS](https://github.com/kodehort/ai-sdk-solid) (community) |  |  |  |  |

[Contributions](https://github.com/vercel/ai/blob/main/CONTRIBUTING.md) are
welcome to implement missing features for non-React frameworks.

[Previous

DefaultGeneratedFile](/docs/reference/ai-sdk-core/default-generated-file)[Next

useChat](/docs/reference/ai-sdk-ui/use-chat)
