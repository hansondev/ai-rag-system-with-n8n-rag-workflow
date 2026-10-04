---
title: "Migrate AI SDK 4.x to 5.0"
source_url: https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0
section: migration-guides
crawled: 2026-09-20
---

# Migrate AI SDK 4.x to 5.0

> Source: https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0

[Migration Guides](/docs/migration-guides)Migrate AI SDK 4.x to 5.0


[Migrate AI SDK 4.x to 5.0](#migrate-ai-sdk-4x-to-50)
=====================================================

[Recommended Migration Process](#recommended-migration-process)
---------------------------------------------------------------

1. Backup your project. If you use a versioning control system, make sure all previous versions are committed.
2. Upgrade to AI SDK 5.0.
3. Automatically migrate your code using one of these approaches:
   * Use the [AI SDK 5 Migration MCP Server](#ai-sdk-5-migration-mcp-server) for AI-assisted migration in Cursor or other MCP-compatible coding agents
   * Use [codemods](#codemods) to automatically transform your code
4. Follow the breaking changes guide below.
5. Verify your project is working as expected.
6. Commit your changes.

[AI SDK 5 Migration MCP Server](#ai-sdk-5-migration-mcp-server)
---------------------------------------------------------------

The [AI SDK 5 Migration Model Context Protocol (MCP) Server](https://github.com/vercel-labs/ai-sdk-5-migration-mcp-server) provides an automated way to migrate your project using a coding agent. This server has been designed for Cursor, but should work with any coding agent that supports MCP.

To get started, create or edit `.cursor/mcp.json` in your project:

```
1

{



2

"mcpServers": {



3

"ai-sdk-5-migration": {



4

"url": "https://ai-sdk-5-migration-mcp-server.vercel.app/api/mcp"



5

}



6

}



7

}
```

After saving, open the command palette (Cmd+Shift+P on macOS, Ctrl+Shift+P on Windows/Linux) and search for "View: Open MCP Settings". Verify the new server appears and is toggled on.

Then use this prompt:

```
1

Please migrate this project to AI SDK 5 using the ai-sdk-5-migration mcp server. Start by creating a checklist.
```

For more information, see the [AI SDK 5 Migration MCP Server repository](https://github.com/vercel-labs/ai-sdk-5-migration-mcp-server).

[AI SDK 5.0 Package Versions](#ai-sdk-50-package-versions)
----------------------------------------------------------

You need to update the following packages to the following versions in your `package.json` file(s):

* `ai` package: `5.0.0`
* `@ai-sdk/provider` package: `2.0.0`
* `@ai-sdk/provider-utils` package: `3.0.0`
* `@ai-sdk/*` packages: `2.0.0` (other `@ai-sdk` packages)

Additionally, you need to update the following peer dependencies:

* `zod` package: `4.1.8` or later (recommended to avoid TypeScript performance issues)

An example upgrade command would be:

```
1

npm install ai @ai-sdk/react @ai-sdk/openai zod@^4.1.8
```

If you encounter TypeScript performance issues after upgrading, ensure you're
using Zod 4.1.8 or later. If the issue persists, update your `tsconfig.json`
to use `moduleResolution: "nodenext"`. See the [TypeScript performance
troubleshooting guide](/docs/troubleshooting/typescript-performance-zod) for
more details.

[Codemods](#codemods)
---------------------

The AI SDK provides Codemod transformations to help upgrade your codebase when a
feature is deprecated, removed, or otherwise changed.

Codemods are transformations that run on your codebase automatically. They
allow you to easily apply many changes without having to manually go through
every file.

Codemods are intended as a tool to help you with the upgrade process. They may
not cover all of the changes you need to make. You may need to make additional
changes manually.

You can run all codemods provided as part of the 5.0 upgrade process by running
the following command from the root of your project:

```
1

npx @ai-sdk/codemod upgrade
```

To run only the v5 codemods (v4 → v5 migration):

```
1

npx @ai-sdk/codemod v5
```

Individual codemods can be run by specifying the name of the codemod:

```
1

npx @ai-sdk/codemod <codemod-name> <path>
```

For example, to run a specific v5 codemod:

```
1

npx @ai-sdk/codemod v5/rename-format-stream-part src/
```

See also the [table of codemods](#codemod-table). In addition, the latest set of
codemods can be found in the
[`@ai-sdk/codemod`](https://github.com/vercel/ai/tree/main/packages/codemod/src/codemods)
repository.

[AI SDK Core Changes](#ai-sdk-core-changes)
-------------------------------------------

### [generateText and streamText Changes](#generatetext-and-streamtext-changes)

#### [Maximum Output Tokens](#maximum-output-tokens)

The `maxTokens` parameter has been renamed to `maxOutputTokens` for clarity.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 4.0

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

maxTokens: 1024,



4

prompt: 'Hello, world!',



5

});
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5.0

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

maxOutputTokens: 1024,



4

prompt: 'Hello, world!',



5

});
```

### [Message and Type System Changes](#message-and-type-system-changes)

#### [Core Type Renames](#core-type-renames)

##### [`CoreMessage` → `ModelMessage`](#coremessage--modelmessage)

AI SDK 4.0

```
1

import { CoreMessage } from 'ai';
```

AI SDK 5.0

```
1

import { ModelMessage } from 'ai';
```

##### [`Message` → `UIMessage`](#message--uimessage)

AI SDK 4.0

```
1

import { Message, CreateMessage } from 'ai';
```

AI SDK 5.0

```
1

import { UIMessage, CreateUIMessage } from 'ai';
```

##### [`convertToCoreMessages` → `convertToModelMessages`](#converttocoremessages--converttomodelmessages)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 4.0

```
1

import { convertToCoreMessages, streamText } from 'ai';



2



3

const result = await streamText({



4

model: "xai/grok-4.6",



5

messages: convertToCoreMessages(messages),



6

});
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5.0

```
1

import { convertToModelMessages, streamText } from 'ai';



2



3

const result = await streamText({



4

model: "xai/grok-4.6",



5

messages: convertToModelMessages(messages),



6

});
```

For more information about model messages, see the [Model Message
reference](/docs/reference/ai-sdk-core/model-message).

### [UIMessage Changes](#uimessage-changes)

#### [Content → Parts Array](#content--parts-array)

For `UIMessage`s (previously called `Message`), the `.content` property has been replaced with a `parts` array structure.

AI SDK 4.0

```
1

import { type Message } from 'ai'; // v4 Message type



2



3

// Messages (useChat) - had content property



4

const message: Message = {



5

id: '1',



6

role: 'user',



7

content: 'Bonjour!',



8

};
```

AI SDK 5.0

```
1

import { type UIMessage, type ModelMessage } from 'ai';



2



3

// UIMessages (useChat) - now use parts array



4

const uiMessage: UIMessage = {



5

id: '1',



6

role: 'user',



7

parts: [{ type: 'text', text: 'Bonjour!' }],



8

};
```

#### [Data Role Removed](#data-role-removed)

The `data` role has been removed from UI messages.

AI SDK 4.0

```
1

const message = {



2

role: 'data',



3

content: 'Some content',



4

data: { customField: 'value' },



5

};
```

AI SDK 5.0

```
1

// V5: Use UI message streams with custom data parts



2

const stream = createUIMessageStream({



3

execute({ writer }) {



4

// Write custom data instead of message annotations



5

writer.write({



6

type: 'data-custom',



7

id: 'custom-1',



8

data: { customField: 'value' },



9

});



10

},



11

});
```

#### [UIMessage Reasoning Structure](#uimessage-reasoning-structure)

The reasoning property on UI messages has been moved to parts.

AI SDK 4.0

```
1

const message: Message = {



2

role: 'assistant',



3

content: 'Hello',



4

reasoning: 'I will greet the user',



5

};
```

AI SDK 5.0

```
1

const message: UIMessage = {



2

role: 'assistant',



3

parts: [



4

{



5

type: 'reasoning',



6

text: 'I will greet the user',



7

},



8

{



9

type: 'text',



10

text: 'Hello',



11

},



12

],



13

};
```

#### [Reasoning Part Property Rename](#reasoning-part-property-rename)

The `reasoning` property on reasoning UI parts has been renamed to `text`.

AI SDK 4.0

```
1

{



2

message.parts.map((part, index) => {



3

if (part.type === 'reasoning') {



4

return (



5

<div key={index} className="reasoning-display">



6

{part.reasoning}



7

</div>



8

);



9

}



10

});



11

}
```

AI SDK 5.0

```
1

{



2

message.parts.map((part, index) => {



3

if (part.type === 'reasoning') {



4

return (



5

<div key={index} className="reasoning-display">



6

{part.text}



7

</div>



8

);



9

}



10

});



11

}
```

### [File Part Changes](#file-part-changes)

File parts now use `.url` instead of `.data` and `.mimeType`.

AI SDK 4.0

```
1

{



2

messages.map(message => (



3

<div key={message.id}>



4

{message.parts.map((part, index) => {



5

if (part.type === 'text') {



6

return <div key={index}>{part.text}</div>;



7

} else if (part.type === 'file' && part.mimeType.startsWith('image/')) {



8

return (



9

<img



10

key={index}



11

src={`data:${part.mimeType};base64,${part.data}`}



12

/>



13

);



14

}



15

})}



16

</div>



17

));



18

}
```

AI SDK 5.0

```
1

{



2

messages.map(message => (



3

<div key={message.id}>



4

{message.parts.map((part, index) => {



5

if (part.type === 'text') {



6

return <div key={index}>{part.text}</div>;



7

} else if (



8

part.type === 'file' &&



9

part.mediaType.startsWith('image/')



10

) {



11

return <img key={index} src={part.url} />;



12

}



13

})}



14

</div>



15

));



16

}
```

### [Stream Data Removal](#stream-data-removal)

The `StreamData` class has been completely removed and replaced with UI message streams for custom data.

AI SDK 4.0

```
1

import { StreamData } from 'ai';



2



3

const streamData = new StreamData();



4

streamData.append('custom-data');



5

streamData.close();
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5.0

```
1

import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';



2



3

const stream = createUIMessageStream({



4

execute({ writer }) {



5

// Write custom data parts



6

writer.write({



7

type: 'data-custom',



8

id: 'custom-1',



9

data: 'custom-data',



10

});



11



12

// Can merge with LLM streams



13

const result = streamText({



14

model: "xai/grok-4.6",



15

messages,



16

});



17



18

writer.merge(result.toUIMessageStream());



19

},



20

});



21



22

return createUIMessageStreamResponse({ stream });
```

### [Custom Data Streaming: writeMessageAnnotation/writeData Removed](#custom-data-streaming-writemessageannotationwritedata-removed)

The `writeMessageAnnotation` and `writeData` methods from `DataStreamWriter` have been removed. Instead, use custom data parts with the new `UIMessage` stream architecture.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 4.0

```
1

import { createDataStreamResponse, streamText } from 'ai';



2



3

export async function POST(req: Request) {



4

const { messages } = await req.json();



5



6

return createDataStreamResponse({



7

execute: dataStream => {



8

// Write general data



9

dataStream.writeData('call started');



10



11

const result = streamText({



12

model: "xai/grok-4.6",



13

messages,



14

onChunk() {



15

// Write message annotations



16

dataStream.writeMessageAnnotation({



17

status: 'streaming',



18

timestamp: Date.now(),



19

});



20

},



21

onFinish() {



22

// Write final annotations



23

dataStream.writeMessageAnnotation({



24

id: generateId(),



25

completed: true,



26

});



27



28

dataStream.writeData('call completed');



29

},



30

});



31



32

result.mergeIntoDataStream(dataStream);



33

},



34

});



35

}
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5.0

```
1

import {



2

createUIMessageStream,



3

createUIMessageStreamResponse,



4

streamText,



5

generateId,



6

} from 'ai';



7



8

export async function POST(req: Request) {



9

const { messages } = await req.json();



10



11

const stream = createUIMessageStream({



12

execute: ({ writer }) => {



13

const statusId = generateId();



14



15

// Write general data (transient - not added to message history)



16

writer.write({



17

type: 'data-status',



18

id: statusId,



19

data: { status: 'call started' },



20

});



21



22

const result = streamText({



23

model: "xai/grok-4.6",



24

messages,



25

onChunk() {



26

// Write data parts that update during streaming



27

writer.write({



28

type: 'data-status',



29

id: statusId,



30

data: {



31

status: 'streaming',



32

timestamp: Date.now(),



33

},



34

});



35

},



36

onFinish() {



37

// Write final data parts



38

writer.write({



39

type: 'data-status',



40

id: statusId,



41

data: {



42

status: 'completed',



43

},



44

});



45

},



46

});



47



48

writer.merge(result.toUIMessageStream());



49

},



50

});



51



52

return createUIMessageStreamResponse({ stream });



53

}
```

For more detailed information about streaming custom data in v5, see the
[Streaming Data guide](/docs/ai-sdk-ui/streaming-data).

##### [Provider Metadata → Provider Options](#provider-metadata--provider-options)

The `providerMetadata` input parameter has been renamed to `providerOptions`. Note that the returned metadata in results is still called `providerMetadata`.

AI SDK 4.0

```
1

const result = await generateText({



2

model: 'openai/gpt-5',



3

prompt: 'Hello',



4

providerMetadata: {



5

openai: { store: false },



6

},



7

});
```

AI SDK 5.0

```
1

const result = await generateText({



2

model: 'openai/gpt-5',



3

prompt: 'Hello',



4

providerOptions: {



5

// Input parameter renamed



6

openai: { store: false },



7

},



8

});



9



10

// Returned metadata still uses providerMetadata:



11

console.log(result.providerMetadata?.openai);
```

#### [Tool Definition Changes (parameters → inputSchema)](#tool-definition-changes-parameters--inputschema)

Tool definitions have been updated to use `inputSchema` instead of `parameters` and error classes have been renamed.

AI SDK 4.0

```
1

import { tool } from 'ai';



2



3

const weatherTool = tool({



4

description: 'Get the weather for a city',



5

parameters: z.object({



6

city: z.string(),



7

}),



8

execute: async ({ city }) => {



9

return `Weather in ${city}`;



10

},



11

});
```

AI SDK 5.0

```
1

import { tool } from 'ai';



2



3

const weatherTool = tool({



4

description: 'Get the weather for a city',



5

inputSchema: z.object({



6

city: z.string(),



7

}),



8

execute: async ({ city }) => {



9

return `Weather in ${city}`;



10

},



11

});
```

#### [Tool Result Content: experimental\_toToolResultContent → toModelOutput](#tool-result-content-experimental_totoolresultcontent--tomodeloutput)

The `experimental_toToolResultContent` option has been renamed to `toModelOutput` and is no longer experimental.

AI SDK 4.0

```
1

const screenshotTool = tool({



2

description: 'Take a screenshot',



3

parameters: z.object({}),



4

execute: async () => {



5

const imageData = await takeScreenshot();



6

return imageData; // base64 string



7

},



8

experimental_toToolResultContent: result => [{ type: 'image', data: result }],



9

});
```

AI SDK 5.0

```
1

const screenshotTool = tool({



2

description: 'Take a screenshot',



3

inputSchema: z.object({}),



4

execute: async () => {



5

const imageData = await takeScreenshot();



6

return imageData;



7

},



8

toModelOutput: result => ({



9

type: 'content',



10

value: [{ type: 'media', mediaType: 'image/png', data: result }],



11

}),



12

});
```

### [Tool Property Changes (args/result → input/output)](#tool-property-changes-argsresult--inputoutput)

Tool call and result properties have been renamed for better consistency with schemas.

AI SDK 4.0

```
1

// Tool calls used "args" and "result"



2

for await (const part of result.fullStream) {



3

switch (part.type) {



4

case 'tool-call':



5

console.log('Tool args:', part.args);



6

break;



7

case 'tool-result':



8

console.log('Tool result:', part.result);



9

break;



10

}



11

}
```

AI SDK 5.0

```
1

// Tool calls now use "input" and "output"



2

for await (const part of result.fullStream) {



3

switch (part.type) {



4

case 'tool-call':



5

console.log('Tool input:', part.input);



6

break;



7

case 'tool-result':



8

console.log('Tool output:', part.output);



9

break;



10

}



11

}
```

### [Tool Execution Error Handling](#tool-execution-error-handling)

The `ToolExecutionError` class has been removed. Tool execution errors now appear as `tool-error` content parts in the result steps, enabling automated LLM roundtrips in multi-step scenarios.

AI SDK 4.0

```
1

import { ToolExecutionError } from 'ai';



2



3

try {



4

const result = await generateText({



5

// ...



6

});



7

} catch (error) {



8

if (error instanceof ToolExecutionError) {



9

console.log('Tool execution failed:', error.message);



10

console.log('Tool name:', error.toolName);



11

console.log('Tool input:', error.toolInput);



12

}



13

}
```

AI SDK 5.0

```
1

// Tool execution errors now appear in result steps



2

const { steps } = await generateText({



3

// ...



4

});



5



6

// check for tool errors in the steps



7

const toolErrors = steps.flatMap(step =>



8

step.content.filter(part => part.type === 'tool-error'),



9

);



10



11

toolErrors.forEach(toolError => {



12

console.log('Tool error:', toolError.error);



13

console.log('Tool name:', toolError.toolName);



14

console.log('Tool input:', toolError.input);



15

});
```

For streaming scenarios, tool execution errors appear as `tool-error` parts in the stream, while other errors appear as `error` parts.

### [Tool Call Streaming Now Default (toolCallStreaming Removed)](#tool-call-streaming-now-default-toolcallstreaming-removed)

The `toolCallStreaming` option has been removed in AI SDK 5.0. Tool call streaming is now always enabled by default.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 4.0

```
1

const result = streamText({



2

model: "xai/grok-4.6",



3

messages,



4

toolCallStreaming: true, // Optional parameter to enable streaming



5

tools: {



6

weatherTool,



7

searchTool,



8

},



9

});
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5.0

```
1

const result = streamText({



2

model: "xai/grok-4.6",



3

messages: convertToModelMessages(messages),



4

// toolCallStreaming removed - streaming is always enabled



5

tools: {



6

weatherTool,



7

searchTool,



8

},



9

});
```

### [Tool Part Type Changes (UIMessage)](#tool-part-type-changes-uimessage)

In v5, UI tool parts use typed naming: `tool-${toolName}` instead of generic types.

AI SDK 4.0

```
1

// Generic tool-invocation type



2

{



3

message.parts.map(part => {



4

if (part.type === 'tool-invocation') {



5

return <div>{part.toolInvocation.toolName}</div>;



6

}



7

});



8

}
```

AI SDK 5.0

```
1

// Type-safe tool parts with specific names



2

{



3

message.parts.map(part => {



4

switch (part.type) {



5

case 'tool-getWeatherInformation':



6

return <div>Getting weather...</div>;



7

case 'tool-askForConfirmation':



8

return <div>Asking for confirmation...</div>;



9

}



10

});



11

}
```

### [Dynamic Tools Support](#dynamic-tools-support)

AI SDK 5.0 introduces dynamic tools for handling tools with unknown types at development time, such as MCP tools without schemas or user-defined functions at runtime.

#### [New dynamicTool Helper](#new-dynamictool-helper)

The new `dynamicTool` helper function allows you to define tools where the input and output types are not known at compile time.

AI SDK 5.0

```
1

import { dynamicTool } from 'ai';



2

import { z } from 'zod';



3



4

// Define a dynamic tool



5

const runtimeTool = dynamicTool({



6

description: 'A tool defined at runtime',



7

inputSchema: z.object({}),



8

execute: async input => {



9

// Input and output are typed as 'unknown'



10

return { result: `Processed: ${input.query}` };



11

},



12

});
```

#### [MCP Tools Without Schemas](#mcp-tools-without-schemas)

MCP tools that don't provide schemas are now automatically treated as dynamic tools:

AI SDK 5.0

```
1

import { MCPClient } from 'ai';



2



3

const client = new MCPClient({



4

/* ... */



5

});



6

const tools = await client.getTools();



7



8

// Tools without schemas are now 'dynamic' type



9

// and won't break type inference when mixed with static tools
```

#### [Type-Safe Handling with Mixed Tools](#type-safe-handling-with-mixed-tools)

When using both static and dynamic tools together, use the `dynamic` flag for type narrowing:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5.0

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

tools: {



4

// Static tool with known types



5

weather: weatherTool,



6

// Dynamic tool with unknown types



7

customDynamicTool: dynamicTool({



8

/* ... */



9

}),



10

},



11

onStepFinish: step => {



12

// Handle tool calls with type safety



13

for (const toolCall of step.toolCalls) {



14

if (toolCall.dynamic) {



15

// Dynamic tool: input/output are 'unknown'



16

console.log('Dynamic tool called:', toolCall.toolName);



17

continue;



18

}



19



20

// Static tools have full type inference



21

switch (toolCall.toolName) {



22

case 'weather':



23

// TypeScript knows the exact types



24

console.log(toolCall.input.location); // string



25

break;



26

}



27

}



28

},



29

});
```

#### [New dynamic-tool UI Part](#new-dynamic-tool-ui-part)

UI messages now include a `dynamic-tool` part type for rendering dynamic tool invocations:

AI SDK 5.0

```
1

{



2

message.parts.map((part, index) => {



3

switch (part.type) {



4

// Static tools use specific types



5

case 'tool-weather':



6

return <div>Weather: {part.input.city}</div>;



7



8

// Dynamic tools use the generic dynamic-tool type



9

case 'dynamic-tool':



10

return (



11

<div>



12

Dynamic tool: {part.toolName}



13

<pre>{JSON.stringify(part.input, null, 2)}</pre>



14

</div>



15

);



16

}



17

});



18

}
```

#### [Breaking Change: Type Narrowing Required for Tool Calls and Results](#breaking-change-type-narrowing-required-for-tool-calls-and-results)

When iterating over `toolCalls` and `toolResults`, you now need to check the `dynamic` flag first for proper type narrowing:

AI SDK 4.0

```
1

// Direct type checking worked without dynamic flag



2

onStepFinish: step => {



3

for (const toolCall of step.toolCalls) {



4

switch (toolCall.toolName) {



5

case 'weather':



6

console.log(toolCall.input.location); // typed as string



7

break;



8

case 'search':



9

console.log(toolCall.input.query); // typed as string



10

break;



11

}



12

}



13

};
```

AI SDK 5.0

```
1

// Must check dynamic flag first for type narrowing



2

onStepFinish: step => {



3

for (const toolCall of step.toolCalls) {



4

// Check if it's a dynamic tool first



5

if (toolCall.dynamic) {



6

console.log('Dynamic tool:', toolCall.toolName);



7

console.log('Input:', toolCall.input); // typed as unknown



8

continue;



9

}



10



11

// Now TypeScript knows it's a static tool



12

switch (toolCall.toolName) {



13

case 'weather':



14

console.log(toolCall.input.location); // typed as string



15

break;



16

case 'search':



17

console.log(toolCall.input.query); // typed as string



18

break;



19

}



20

}



21

};
```

### [Tool UI Part State Changes](#tool-ui-part-state-changes)

Tool UI parts now use more granular states that better represent the streaming lifecycle and error handling.

AI SDK 4.0

```
1

// Old states



2

{



3

message.parts.map(part => {



4

if (part.type === 'tool-invocation') {



5

switch (part.toolInvocation.state) {



6

case 'partial-call':



7

return <div>Loading...</div>;



8

case 'call':



9

return (



10

<div>



11

Tool called with {JSON.stringify(part.toolInvocation.args)}



12

</div>



13

);



14

case 'result':



15

return <div>Result: {part.toolInvocation.result}</div>;



16

}



17

}



18

});



19

}
```

AI SDK 5.0

```
1

// New granular states



2

{



3

message.parts.map(part => {



4

switch (part.type) {



5

case 'tool-getWeatherInformation':



6

switch (part.state) {



7

case 'input-streaming':



8

return <pre>{JSON.stringify(part.input, null, 2)}</pre>;



9

case 'input-available':



10

return <div>Getting weather for {part.input.city}...</div>;



11

case 'output-available':



12

return <div>Weather: {part.output}</div>;



13

case 'output-error':



14

return <div>Error: {part.errorText}</div>;



15

}



16

}



17

});



18

}
```

**State Changes:**

* `partial-call` → `input-streaming` (tool input being streamed)
* `call` → `input-available` (tool input complete, ready to execute)
* `result` → `output-available` (tool execution successful)
* New: `output-error` (tool execution failed)

#### [Rendering Tool Invocations (Catch-All Pattern)](#rendering-tool-invocations-catch-all-pattern)

In v4, you typically rendered tool invocations using a catch-all `tool-invocation` type. In v5, the **recommended approach is to handle each tool specifically using its typed part name (e.g., `tool-getWeather`)**. However, if you need a catch-all pattern for rendering all tool invocations the same way, you can use the `isToolUIPart` and `getToolName` helper functions as a fallback.

AI SDK 4.0

```
1

{



2

message.parts.map((part, index) => {



3

switch (part.type) {



4

case 'text':



5

return <div key={index}>{part.text}</div>;



6

case 'tool-invocation':



7

const { toolInvocation } = part;



8

return (



9

<details key={`tool-${toolInvocation.toolCallId}`}>



10

<summary>



11

<span>{toolInvocation.toolName}</span>



12

{toolInvocation.state === 'result' ? (



13

<span>Click to expand</span>



14

) : (



15

<span>calling...</span>



16

)}



17

</summary>



18

{toolInvocation.state === 'result' ? (



19

<div>



20

<pre>{JSON.stringify(toolInvocation.result, null, 2)}</pre>



21

</div>



22

) : null}



23

</details>



24

);



25

}



26

});



27

}
```

AI SDK 5.0

```
1

import { isToolUIPart, getToolName } from 'ai';



2



3

{



4

message.parts.map((part, index) => {



5

switch (part.type) {



6

case 'text':



7

return <div key={index}>{part.text}</div>;



8

default:



9

if (isToolUIPart(part)) {



10

const toolInvocation = part;



11

return (



12

<details key={`tool-${toolInvocation.toolCallId}`}>



13

<summary>



14

<span>{getToolName(toolInvocation)}</span>



15

{toolInvocation.state === 'output-available' ? (



16

<span>Click to expand</span>



17

) : (



18

<span>calling...</span>



19

)}



20

</summary>



21

{toolInvocation.state === 'output-available' ? (



22

<div>



23

<pre>{JSON.stringify(toolInvocation.output, null, 2)}</pre>



24

</div>



25

) : null}



26

</details>



27

);



28

}



29

}



30

});



31

}
```

#### [Media Type Standardization](#media-type-standardization)

`mimeType` has been renamed to `mediaType` for consistency. Both image and file types are supported in model messages.

AI SDK 4.0

```
1

const result = await generateText({



2

model: someModel,



3

messages: [



4

{



5

role: 'user',



6

content: [



7

{ type: 'text', text: 'What do you see?' },



8

{



9

type: 'image',



10

image: new Uint8Array([0, 1, 2, 3]),



11

mimeType: 'image/png',



12

},



13

{



14

type: 'file',



15

data: contents,



16

mimeType: 'application/pdf',



17

},



18

],



19

},



20

],



21

});
```

AI SDK 5.0

```
1

const result = await generateText({



2

model: someModel,



3

messages: [



4

{



5

role: 'user',



6

content: [



7

{ type: 'text', text: 'What do you see?' },



8

{



9

type: 'image',



10

image: new Uint8Array([0, 1, 2, 3]),



11

mediaType: 'image/png',



12

},



13

{



14

type: 'file',



15

data: contents,



16

mediaType: 'application/pdf',



17

},



18

],



19

},



20

],



21

});
```

### [Reasoning Support](#reasoning-support)

#### [Reasoning Text Property Rename](#reasoning-text-property-rename)

The `.reasoning` property has been renamed to `.reasoningText` for multi-step generations.

AI SDK 4.0

```
1

for (const step of steps) {



2

console.log(step.reasoning);



3

}
```

AI SDK 5.0

```
1

for (const step of steps) {



2

console.log(step.reasoningText);



3

}
```

#### [Generate Text Reasoning Property Changes](#generate-text-reasoning-property-changes)

In `generateText()` and `streamText()` results, reasoning properties have been renamed.

AI SDK 4.0

```
1

const result = await generateText({



2

model: anthropic('claude-sonnet-4-20250514'),



3

prompt: 'Explain your reasoning',



4

});



5



6

console.log(result.reasoning); // String reasoning text



7

console.log(result.reasoningDetails); // Array of reasoning details
```

AI SDK 5.0

```
1

const result = await generateText({



2

model: anthropic('claude-sonnet-4-20250514'),



3

prompt: 'Explain your reasoning',



4

});



5



6

console.log(result.reasoningText); // String reasoning text



7

console.log(result.reasoning); // Array of reasoning details
```

### [Continuation Steps Removal](#continuation-steps-removal)

The `experimental_continueSteps` option has been removed from `generateText()`.

AI SDK 4.0

```
1

const result = await generateText({



2

experimental_continueSteps: true,



3

// ...



4

});
```

AI SDK 5.0

```
1

const result = await generateText({



2

// experimental_continueSteps has been removed



3

// Use newer models with higher output token limits instead



4

// ...



5

});
```

### [Image Generation Changes](#image-generation-changes)

Image model settings have been moved to `providerOptions`.

AI SDK 4.0

```
1

await generateImage({



2

model: luma.image('photon-flash-1', {



3

maxImagesPerCall: 5,



4

pollIntervalMillis: 500,



5

}),



6

prompt,



7

n: 10,



8

});
```

AI SDK 5.0

```
1

await generateImage({



2

model: luma.image('photon-flash-1'),



3

prompt,



4

n: 10,



5

maxImagesPerCall: 5,



6

providerOptions: {



7

luma: { pollIntervalMillis: 500 },



8

},



9

});
```

### [Step Result Changes](#step-result-changes)

#### [Step Type Removal](#step-type-removal)

The `stepType` property has been removed from step results.

AI SDK 4.0

```
1

steps.forEach(step => {



2

switch (step.stepType) {



3

case 'initial':



4

console.log('Initial step');



5

break;



6

case 'tool-result':



7

console.log('Tool result step');



8

break;



9

case 'done':



10

console.log('Final step');



11

break;



12

}



13

});
```

AI SDK 5.0

```
1

steps.forEach((step, index) => {



2

if (index === 0) {



3

console.log('Initial step');



4

} else if (step.toolResults.length > 0) {



5

console.log('Tool result step');



6

} else {



7

console.log('Final step');



8

}



9

});
```

### [Step Control: maxSteps → stopWhen](#step-control-maxsteps--stopwhen)

For core functions like `generateText` and `streamText`, the `maxSteps` parameter has been replaced with `stopWhen`, which provides more flexible control over multi-step execution. The `stopWhen` parameter defines conditions for stopping the generation **when the last step contains tool results**. When multiple conditions are provided as an array, the generation stops if any condition is met.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 4.0

```
1

// V4: Simple numeric limit



2

const result = await generateText({



3

model: "xai/grok-4.6",



4

messages,



5

maxSteps: 5, // Stop after a maximum of 5 steps



6

});



7



8

// useChat with maxSteps



9

const { messages } = useChat({



10

maxSteps: 3, // Stop after a maximum of 3 steps



11

});
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5.0

```
1

import { isStepCount, hasToolCall } from 'ai';



2



3

// V5: Server-side - flexible stopping conditions with stopWhen



4

const result = await generateText({



5

model: "xai/grok-4.6",



6

messages,



7

// Only triggers when last step has tool results



8

stopWhen: isStepCount(5), // Stop at step 5 if tools were called



9

});



10



11

// Server-side - stop when a specific tool is called



12

const result = await generateText({



13

model: "xai/grok-4.6",



14

messages,



15

stopWhen: hasToolCall('finalizeTask'), // Stop when finalizeTask tool is called



16

});
```

**Common stopping patterns:**

AI SDK 5.0

```
1

// Stop after N steps (equivalent to old maxSteps)



2

// Note: Only applies when the last step has tool results



3

stopWhen: isStepCount(5);



4



5

// Stop when a specific tool is called



6

stopWhen: hasToolCall('finalizeTask');



7



8

// Stop when either tool is called



9

stopWhen: hasToolCall('submitOrder', 'finalizeTask');



10



11

// Multiple conditions (stops if ANY condition is met)



12

stopWhen: [



13

isStepCount(10), // Maximum 10 steps



14

hasToolCall('submitOrder'), // Or when order is submitted



15

];



16



17

// Custom condition based on step content



18

stopWhen: ({ steps }) => {



19

const lastStep = steps[steps.length - 1];



20

// Custom logic - only triggers if last step has tool results



21

return lastStep?.text?.includes('COMPLETE');



22

};
```

**Important:** The `stopWhen` conditions are only evaluated when the last step contains tool results.

#### [Usage vs Total Usage](#usage-vs-total-usage)

Usage properties now distinguish between single step and total usage.

AI SDK 4.0

```
1

// usage contained total token usage across all steps



2

console.log(result.usage);
```

AI SDK 5.0

```
1

// usage contains token usage from the final step only



2

console.log(result.usage);



3

// totalUsage contains total token usage across all steps



4

console.log(result.totalUsage);
```

[AI SDK UI Changes](#ai-sdk-ui-changes)
---------------------------------------

### [Package Structure Changes](#package-structure-changes)

### [`@ai-sdk/rsc` Package Extraction](#ai-sdkrsc-package-extraction)

The `ai/rsc` export has been extracted to a separate package `@ai-sdk/rsc`.

AI SDK 4.0

```
1

import { createStreamableValue } from 'ai/rsc';
```

AI SDK 5.0

```
1

import { createStreamableValue } from '@ai-sdk/rsc';
```

Don't forget to install the new package: `npm install @ai-sdk/rsc`

### [React UI Hooks Moved to `@ai-sdk/react`](#react-ui-hooks-moved-to-ai-sdkreact)

The deprecated `ai/react` export has been removed in favor of `@ai-sdk/react`.

AI SDK 4.0

```
1

import { useChat } from 'ai/react';
```

AI SDK 5.0

```
1

import { useChat } from '@ai-sdk/react';
```

Don't forget to install the new package: `npm install @ai-sdk/react`

### [useChat Changes](#usechat-changes)

The `useChat` hook has undergone significant changes in v5, with new transport architecture, removal of managed input state, and more.

#### [maxSteps Removal](#maxsteps-removal)

The `maxSteps` parameter has been removed from `useChat`. You should now use server-side `stopWhen` conditions for multi-step tool execution control, and manually submit tool results and trigger new messages for client-side tool calls.

AI SDK 4.0

```
1

const { messages, sendMessage } = useChat({



2

maxSteps: 5, // Automatic tool result submission



3

});
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5.0

```
1

// Server-side: Use stopWhen for multi-step control



2

import { streamText, convertToModelMessages, isStepCount } from 'ai';



3



4

const result = await streamText({



5

model: "xai/grok-4.6",



6

messages: convertToModelMessages(messages),



7

stopWhen: isStepCount(5), // Stop after 5 steps with tool calls



8

});



9



10

// Client-side: Configure automatic submission



11

import { useChat } from '@ai-sdk/react';



12

import {



13

DefaultChatTransport,



14

lastAssistantMessageIsCompleteWithToolCalls,



15

} from 'ai';



16



17

const { messages, sendMessage, addToolOutput } = useChat({



18

// Automatically submit when all tool results are available



19

sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,



20



21

async onToolCall({ toolCall }) {



22

const result = await executeToolCall(toolCall);



23



24

// Important: Don't await addToolOutput inside onToolCall to avoid deadlocks



25

addToolOutput({



26

tool: toolCall.toolName,



27

toolCallId: toolCall.toolCallId,



28

output: result,



29

});



30

},



31

});
```

Important: When using `sendAutomaticallyWhen`, don't use `await` with
`addToolOutput` inside `onToolCall` as it can cause deadlocks. The `await` is
useful when you're not using automatic submission and need to ensure the
messages are updated before manually calling `sendMessage()`.

This change provides more flexibility for handling tool calls and aligns client behavior with server-side multi-step execution patterns.

For more details on the new tool submission approach, see the [Tool Result Submission Changes](#tool-result-submission-changes) section below.

#### [Initial Messages Renamed](#initial-messages-renamed)

The `initialMessages` option has been renamed to `messages`.

AI SDK 4.0

```
1

import { useChat, type Message } from '@ai-sdk/react';



2



3

function ChatComponent({ initialMessages }: { initialMessages: Message[] }) {



4

const { messages } = useChat({



5

initialMessages: initialMessages,



6

// ...



7

});



8



9

// your component



10

}
```

AI SDK 5.0

```
1

import { useChat, type UIMessage } from '@ai-sdk/react';



2



3

function ChatComponent({ initialMessages }: { initialMessages: UIMessage[] }) {



4

const { messages } = useChat({



5

messages: initialMessages,



6

// ...



7

});



8



9

// your component



10

}
```

#### [Sharing Chat Instances](#sharing-chat-instances)

In v4, you could share chat state between components by using the same `id` parameter in multiple `useChat` hooks.

AI SDK 4.0

```
1

// Component A



2

const { messages } = useChat({



3

id: 'shared-chat',



4

api: '/api/chat',



5

});



6



7

// Component B - would share the same chat state



8

const { messages } = useChat({



9

id: 'shared-chat',



10

api: '/api/chat',



11

});
```

In v5, you need to explicitly share chat instances by passing a shared `Chat` instance.

AI SDK 5.0

```
1

// e.g. Store Chat instance in React Context and create a custom hook



2



3

// Component A



4

const { chat } = useSharedChat(); // Custom hook that accesses shared Chat from context



5



6

const { messages, sendMessage } = useChat({



7

chat, // Pass the shared chat instance



8

});



9



10

// Component B - shares the same chat instance



11

const { chat } = useSharedChat(); // Same hook to access shared Chat from context



12



13

const { messages } = useChat({



14

chat, // Same shared chat instance



15

});
```

For a complete example of sharing chat state across components, see the [Share Chat State Across Components](/cookbook/next/use-shared-chat-context) recipe.

#### [Chat Transport Architecture](#chat-transport-architecture)

Configuration is now handled through transport objects instead of direct API options.

AI SDK 4.0

```
1

import { useChat } from '@ai-sdk/react';



2



3

const { messages } = useChat({



4

api: '/api/chat',



5

credentials: 'include',



6

headers: { 'Custom-Header': 'value' },



7

});
```

AI SDK 5.0

```
1

import { useChat } from '@ai-sdk/react';



2

import { DefaultChatTransport } from 'ai';



3



4

const { messages } = useChat({



5

transport: new DefaultChatTransport({



6

api: '/api/chat',



7

credentials: 'include',



8

headers: { 'Custom-Header': 'value' },



9

}),



10

});
```

#### [Removed Managed Input State](#removed-managed-input-state)

The `useChat` hook no longer manages input state internally. You must now manage input state manually.

AI SDK 4.0

```
1

import { useChat } from '@ai-sdk/react';



2



3

export default function Page() {



4

const { messages, input, handleInputChange, handleSubmit } = useChat({



5

api: '/api/chat',



6

});



7



8

return (



9

<form onSubmit={handleSubmit}>



10

<input value={input} onChange={handleInputChange} />



11

<button type="submit">Send</button>



12

</form>



13

);



14

}
```

AI SDK 5.0

```
1

import { useChat } from '@ai-sdk/react';



2

import { DefaultChatTransport } from 'ai';



3

import { useState } from 'react';



4



5

export default function Page() {



6

const [input, setInput] = useState('');



7

const { messages, sendMessage } = useChat({



8

transport: new DefaultChatTransport({ api: '/api/chat' }),



9

});



10



11

const handleSubmit = e => {



12

e.preventDefault();



13

sendMessage({ text: input });



14

setInput('');



15

};



16



17

return (



18

<form onSubmit={handleSubmit}>



19

<input value={input} onChange={e => setInput(e.target.value)} />



20

<button type="submit">Send</button>



21

</form>



22

);



23

}
```

#### [Message Sending: `append` → `sendMessage`](#message-sending-append--sendmessage)

The `append` function has been replaced with `sendMessage` and requires structured message format.

AI SDK 4.0

```
1

const { append } = useChat();



2



3

// Simple text message



4

append({ role: 'user', content: 'Hello' });



5



6

// With custom body



7

append(



8

{



9

role: 'user',



10

content: 'Hello',



11

},



12

{ body: { imageUrl: 'https://...' } },



13

);
```

AI SDK 5.0

```
1

const { sendMessage } = useChat();



2



3

// Simple text message (most common usage)



4

sendMessage({ text: 'Hello' });



5



6

// Or with explicit parts array



7

sendMessage({



8

parts: [{ type: 'text', text: 'Hello' }],



9

});



10



11

// With custom body (via request options)



12

sendMessage(



13

{ role: 'user', parts: [{ type: 'text', text: 'Hello' }] },



14

{ body: { imageUrl: 'https://...' } },



15

);
```

#### [Message Regeneration: `reload` → `regenerate`](#message-regeneration-reload--regenerate)

The `reload` function has been renamed to `regenerate` with enhanced functionality.

AI SDK 4.0

```
1

const { reload } = useChat();



2



3

// Regenerate last message



4

reload();
```

AI SDK 5.0

```
1

const { regenerate } = useChat();



2



3

// Regenerate last message



4

regenerate();



5



6

// Regenerate specific message



7

regenerate({ messageId: 'message-123' });
```

#### [onResponse Removal](#onresponse-removal)

The `onResponse` callback has been removed from `useChat` and `useCompletion`.

AI SDK 4.0

```
1

const { messages } = useChat({



2

onResponse(response) {



3

// handle response



4

},



5

});
```

AI SDK 5.0

```
1

const { messages } = useChat({



2

// onResponse is no longer available



3

});
```

#### [Send Extra Message Fields Default](#send-extra-message-fields-default)

The `sendExtraMessageFields` option has been removed and is now the default behavior.

AI SDK 4.0

```
1

const { messages } = useChat({



2

sendExtraMessageFields: true,



3

});
```

AI SDK 5.0

```
1

const { messages } = useChat({



2

// sendExtraMessageFields is now the default



3

});
```

#### [Keep Last Message on Error Removal](#keep-last-message-on-error-removal)

The `keepLastMessageOnError` option has been removed as it's no longer needed.

AI SDK 4.0

```
1

const { messages } = useChat({



2

keepLastMessageOnError: true,



3

});
```

AI SDK 5.0

```
1

const { messages } = useChat({



2

// keepLastMessageOnError is no longer needed



3

});
```

#### [Chat Request Options Changes](#chat-request-options-changes)

The `data` and `allowEmptySubmit` options have been removed from `ChatRequestOptions`.

AI SDK 4.0

```
1

handleSubmit(e, {



2

data: { imageUrl: 'https://...' },



3

body: { custom: 'value' },



4

allowEmptySubmit: true,



5

});
```

AI SDK 5.0

```
1

sendMessage(



2

{



3

/* yourMessage */



4

},



5

{



6

body: {



7

custom: 'value',



8

imageUrl: 'https://...', // Move data to body



9

},



10

},



11

);
```

#### [Request Options Type Rename](#request-options-type-rename)

`RequestOptions` has been renamed to `CompletionRequestOptions`.

AI SDK 4.0

```
1

import type { RequestOptions } from 'ai';
```

AI SDK 5.0

```
1

import type { CompletionRequestOptions } from 'ai';
```

#### [addToolResult Renamed to addToolOutput](#addtoolresult-renamed-to-addtooloutput)

The `addToolResult` method has been renamed to `addToolOutput`. Additionally, the `result` parameter has been renamed to `output` for consistency with other tool-related APIs.

AI SDK 4.0

```
1

const { addToolResult } = useChat();



2



3

// Add tool result with 'result' parameter



4

addToolResult({



5

toolCallId: 'tool-call-123',



6

result: 'Weather: 72°F, sunny',



7

});
```

AI SDK 5.0

```
1

const { addToolOutput } = useChat();



2



3

// Add tool output with 'output' parameter and 'tool' name for type safety



4

addToolOutput({



5

tool: 'getWeather',



6

toolCallId: 'tool-call-123',



7

output: 'Weather: 72°F, sunny',



8

});
```

`addToolResult` is still available but deprecated. It will be removed in
version 6.

#### [Tool Result Submission Changes](#tool-result-submission-changes)

The automatic tool result submission behavior has been updated in `useChat` and the `Chat` component. You now have more control and flexibility over when tool results are submitted.

* `onToolCall` no longer supports returning values to automatically submit tool results
* You must explicitly call `addToolOutput` to provide tool results
* Use `sendAutomaticallyWhen` with `lastAssistantMessageIsCompleteWithToolCalls` helper for automatic submission
* Important: Don't use `await` with `addToolOutput` inside `onToolCall` to avoid deadlocks
* The `maxSteps` parameter has been removed from the `Chat` component and `useChat` hook
* For multi-step tool execution, use server-side `stopWhen` conditions instead (see [maxSteps Removal](#maxsteps-removal))

AI SDK 4.0

```
1

const { messages, sendMessage, addToolResult } = useChat({



2

maxSteps: 5, // Removed in v5



3



4

// Automatic submission by returning a value



5

async onToolCall({ toolCall }) {



6

if (toolCall.toolName === 'getLocation') {



7

const cities = ['New York', 'Los Angeles', 'Chicago', 'San Francisco'];



8

return cities[Math.floor(Math.random() * cities.length)];



9

}



10

},



11

});
```

AI SDK 5.0

```
1

import { useChat } from '@ai-sdk/react';



2

import {



3

DefaultChatTransport,



4

lastAssistantMessageIsCompleteWithToolCalls,



5

} from 'ai';



6



7

const { messages, sendMessage, addToolOutput } = useChat({



8

// Automatic submission with helper



9

sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,



10



11

async onToolCall({ toolCall }) {



12

if (toolCall.toolName === 'getLocation') {



13

const cities = ['New York', 'Los Angeles', 'Chicago', 'San Francisco'];



14



15

// Important: Don't await inside onToolCall to avoid deadlocks



16

addToolOutput({



17

tool: 'getLocation',



18

toolCallId: toolCall.toolCallId,



19

output: cities[Math.floor(Math.random() * cities.length)],



20

});



21

}



22

},



23

});
```

#### [Loading State Changes](#loading-state-changes)

The deprecated `isLoading` helper has been removed in favor of `status`.

AI SDK 4.0

```
1

const { isLoading } = useChat();
```

AI SDK 5.0

```
1

const { status } = useChat();



2

// Use state instead of isLoading for more granular control
```

#### [Resume Stream Support](#resume-stream-support)

The resume functionality has been moved from `experimental_resume` to `resumeStream`.

AI SDK 4.0

```
1

// Resume was experimental



2

const { messages } = useChat({



3

experimental_resume: true,



4

});
```

AI SDK 5.0

```
1

const { messages } = useChat({



2

resumeStream: true, // Resume interrupted streams



3

});
```

#### [Dynamic Body Values](#dynamic-body-values)

In v4, the `body` option in useChat configuration would dynamically update with component state changes. In v5, the `body` value is only captured at the first render and remains static throughout the component lifecycle.

AI SDK 4.0

```
1

const [temperature, setTemperature] = useState(0.7);



2



3

const { messages } = useChat({



4

api: '/api/chat',



5

body: {



6

temperature, // This would update dynamically in v4



7

},



8

});
```

AI SDK 5.0

```
1

const [temperature, setTemperature] = useState(0.7);



2



3

// Option 1: Use request-level configuration (Recommended)



4

const { messages, sendMessage } = useChat({



5

transport: new DefaultChatTransport({ api: '/api/chat' }),



6

});



7



8

// Pass dynamic values at request time



9

sendMessage(



10

{ text: input },



11

{



12

body: {



13

temperature, // Current temperature value at request time



14

},



15

},



16

);



17



18

// Option 2: Use function configuration with useRef



19

const temperatureRef = useRef(temperature);



20

temperatureRef.current = temperature;



21



22

const { messages } = useChat({



23

transport: new DefaultChatTransport({



24

api: '/api/chat',



25

body: () => ({



26

temperature: temperatureRef.current,



27

}),



28

}),



29

});
```

For more details on request configuration, see the [Chatbot guide](/docs/ai-sdk-ui/chatbot#request-configuration).

#### [Usage Information](#usage-information)

In v4, usage information was directly accessible through the `onFinish` callback's options parameter. In v5, usage data is attached as metadata to individual messages using the `messageMetadata` function in `toUIMessageStreamResponse`.

AI SDK 4.0

```
1

const { messages } = useChat({



2

onFinish(message, options) {



3

const usage = options.usage;



4

console.log('Usage:', usage);



5

},



6

});
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5.0

```
1

import {



2

convertToModelMessages,



3

streamText,



4

UIMessage,



5

type LanguageModelUsage,



6

} from 'ai';



7



8

// Create a new metadata type (optional for type-safety)



9

type MyMetadata = {



10

totalUsage: LanguageModelUsage;



11

};



12



13

// Create a new custom message type with your own metadata



14

export type MyUIMessage = UIMessage<MyMetadata>;



15



16

export async function POST(req: Request) {



17

const { messages }: { messages: MyUIMessage[] } = await req.json();



18



19

const result = streamText({



20

model: "xai/grok-4.6",



21

messages: convertToModelMessages(messages),



22

});



23



24

return result.toUIMessageStreamResponse({



25

originalMessages: messages,



26

messageMetadata: ({ part }) => {



27

// Send total usage when generation is finished



28

if (part.type === 'finish') {



29

return { totalUsage: part.totalUsage };



30

}



31

},



32

});



33

}
```

Then, on the client, you can access the message-level metadata.

AI SDK 5.0 - Client

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import type { MyUIMessage } from './api/chat/route';



5

import { DefaultChatTransport } from 'ai';



6



7

export default function Chat() {



8

// Use custom message type defined on the server (optional for type-safety)



9

const { messages } = useChat<MyUIMessage>({



10

transport: new DefaultChatTransport({



11

api: '/api/chat',



12

}),



13

});



14



15

return (



16

<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">



17

{messages.map(m => (



18

<div key={m.id} className="whitespace-pre-wrap">



19

{m.role === 'user' ? 'User: ' : 'AI: '}



20

{m.parts.map(part => {



21

if (part.type === 'text') {



22

return part.text;



23

}



24

})}



25

{/* Render usage via metadata */}



26

{m.metadata?.totalUsage && (



27

<div>Total usage: {m.metadata?.totalUsage.totalTokens} tokens</div>



28

)}



29

</div>



30

))}



31

</div>



32

);



33

}
```

You can also access your metadata from the `onFinish` callback of `useChat`:

AI SDK 5.0 - onFinish

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import type { MyUIMessage } from './api/chat/route';



5

import { DefaultChatTransport } from 'ai';



6



7

export default function Chat() {



8

// Use custom message type defined on the server (optional for type-safety)



9

const { messages } = useChat<MyUIMessage>({



10

transport: new DefaultChatTransport({



11

api: '/api/chat',



12

}),



13

onFinish: ({ message }) => {



14

// Access message metadata via onFinish callback



15

console.log(message.metadata?.totalUsage);



16

},



17

});



18

}
```

#### [Request Body Preparation: experimental\_prepareRequestBody → prepareSendMessagesRequest](#request-body-preparation-experimental_preparerequestbody--preparesendmessagesrequest)

The `experimental_prepareRequestBody` option has been replaced with `prepareSendMessagesRequest` in the transport configuration.

AI SDK 4.0

```
1

import { useChat } from '@ai-sdk/react';



2



3

const { messages } = useChat({



4

api: '/api/chat',



5

// Only send the last message to the server:



6

experimental_prepareRequestBody({ messages, id }) {



7

return { message: messages[messages.length - 1], id };



8

},



9

});
```

AI SDK 5.0

```
1

import { useChat } from '@ai-sdk/react';



2

import { DefaultChatTransport } from 'ai';



3



4

const { messages } = useChat({



5

transport: new DefaultChatTransport({



6

api: '/api/chat',



7

// Only send the last message to the server:



8

prepareSendMessagesRequest({ messages, id }) {



9

return { body: { message: messages[messages.length - 1], id } };



10

},



11

}),



12

});
```

### [`@ai-sdk/vue` Changes](#ai-sdkvue-changes)

The Vue.js integration has been completely restructured, replacing the `useChat` composable with a `Chat` class.

#### [useChat Replaced with Chat Class](#usechat-replaced-with-chat-class)

@ai-sdk/vue v1

```
1

<script setup>



2

import { useChat } from '@ai-sdk/vue';



3



4

const { messages, input, handleSubmit } = useChat({



5

api: '/api/chat',



6

});



7

</script>
```

@ai-sdk/vue v2

```
1

<script setup>



2

import { Chat } from '@ai-sdk/vue';



3

import { DefaultChatTransport } from 'ai';



4

import { ref } from 'vue';



5



6

const input = ref('');



7

const chat = new Chat({



8

transport: new DefaultChatTransport({ api: '/api/chat' }),



9

});



10



11

const handleSubmit = (e: Event) => {



12

e.preventDefault();



13

chat.sendMessage({ text: input.value });



14

input.value = '';



15

};



16

</script>
```

#### [Message Structure Changes](#message-structure-changes)

Messages now use a `parts` array instead of a `content` string.

@ai-sdk/vue v1

```
1

<template>



2

<div v-for="message in messages" :key="message.id">



3

<div>{{ message.role }}: {{ message.content }}</div>



4

</div>



5

</template>
```

@ai-sdk/vue v2

```
1

<template>



2

<div v-for="message in chat.messages" :key="message.id">



3

<div>{{ message.role }}:</div>



4

<div v-for="part in message.parts" :key="part.type">



5

<span v-if="part.type === 'text'">{{ part.text }}</span>



6

</div>



7

</div>



8

</template>
```

### [`@ai-sdk/svelte` Changes](#ai-sdksvelte-changes)

The Svelte integration has also been updated with new constructor patterns and readonly properties.

#### [Constructor API Changes](#constructor-api-changes)

@ai-sdk/svelte v1

```
1

import { Chat } from '@ai-sdk/svelte';



2



3

const chatInstance = Chat({



4

api: '/api/chat',



5

});
```

@ai-sdk/svelte v2

```
1

import { Chat } from '@ai-sdk/svelte';



2

import { DefaultChatTransport } from 'ai';



3



4

const chatInstance = Chat(() => ({



5

transport: new DefaultChatTransport({ api: '/api/chat' }),



6

}));
```

##### [Properties Made Readonly](#properties-made-readonly)

Properties are now readonly and must be updated using setter methods.

@ai-sdk/svelte v1

```
1

// Direct property mutation was allowed



2

chatInstance.messages = [...chatInstance.messages, newMessage];
```

@ai-sdk/svelte v2

```
1

// Must use setter methods



2

chatInstance.setMessages([...chatInstance.messages, newMessage]);
```

##### [Removed Managed Input](#removed-managed-input)

Like React and Vue, input management has been removed from the Svelte integration.

@ai-sdk/svelte v1

```
1

// Input was managed internally



2

const { messages, input, handleSubmit } = chatInstance;
```

@ai-sdk/svelte v2

```
1

// Must manage input state manually



2

let input = '';



3

const { messages, sendMessage } = chatInstance;



4



5

const handleSubmit = () => {



6

sendMessage({ text: input });



7

input = '';



8

};
```

#### [`@ai-sdk/ui-utils` Package Removal](#ai-sdkui-utils-package-removal)

The `@ai-sdk/ui-utils` package has been removed and its exports moved to the main `ai` package.

AI SDK 4.0

```
1

import { getTextFromDataUrl } from '@ai-sdk/ui-utils';
```

AI SDK 5.0

```
1

import { getTextFromDataUrl } from 'ai';
```

**Note**: `processDataStream` was removed entirely in v5.0. Use `readUIMessageStream` instead for processing UI message streams, or use the more configurable Chat/useChat APIs for most use cases.

### [useCompletion Changes](#usecompletion-changes)

The `data` property has been removed from the `useCompletion` hook.

AI SDK 4.0

```
1

const {



2

completion,



3

handleSubmit,



4

data, // No longer available



5

} = useCompletion();
```

AI SDK 5.0

```
1

const {



2

completion,



3

handleSubmit,



4

// data property removed entirely



5

} = useCompletion();
```

### [useAssistant Removal](#useassistant-removal)

The `useAssistant` hook has been removed.

AI SDK 4.0

```
1

import { useAssistant } from '@ai-sdk/react';
```

AI SDK 5.0

```
1

import { useChat } from '@ai-sdk/react';



2

import { DefaultChatTransport } from 'ai';



3



4

function Chat() {



5

const { messages, sendMessage } = useChat({



6

transport: new DefaultChatTransport({



7

api: '/api/chat',



8

}),



9

});



10



11

// ...



12

}
```

The `useAssistant` hook was specific to the OpenAI Assistants API. OpenAI has
deprecated that API in favor of the Responses API. Configure `useChat` for your
route as shown above, then return a UI message stream from the route:

app/api/chat/route.ts

```
1

import { openai } from '@ai-sdk/openai';



2

import { convertToModelMessages, streamText, type UIMessage } from 'ai';



3



4

export async function POST(req: Request) {



5

const { messages }: { messages: UIMessage[] } = await req.json();



6



7

const result = streamText({



8

model: openai.responses('gpt-4o-mini'),



9

prompt: convertToModelMessages(messages),



10

});



11



12

return result.toUIMessageStreamResponse();



13

}
```

For persistent conversation state and built-in tools, see the
[OpenAI Responses API guide](/cookbook/guides/openai-responses).

If you need to connect `useChat` to another backend, see the
[transport documentation](/docs/ai-sdk-ui/transport) and
[stream protocol](/docs/ai-sdk-ui/stream-protocol). For migrating existing
OpenAI Assistants data and API calls, see OpenAI's
[Assistants migration guide](https://platform.openai.com/docs/assistants/migration).

#### [Attachments → File Parts](#attachments--file-parts)

The `experimental_attachments` property has been replaced with the parts array.

AI SDK 4.0

```
1

{



2

messages.map(message => (



3

<div className="flex flex-col gap-2">



4

{message.content}



5



6

<div className="flex flex-row gap-2">



7

{message.experimental_attachments?.map((attachment, index) =>



8

attachment.contentType?.includes('image/') ? (



9

<img src={attachment.url} alt={attachment.name} />



10

) : attachment.contentType?.includes('text/') ? (



11

<div className="w-32 h-24 p-2 overflow-hidden text-xs border rounded-md ellipsis text-zinc-500">



12

{getTextFromDataUrl(attachment.url)}



13

</div>



14

) : null,



15

)}



16

</div>



17

</div>



18

));



19

}
```

AI SDK 5.0

```
1

{



2

messages.map(message => (



3

<div>



4

{message.parts.map((part, index) => {



5

if (part.type === 'text') {



6

return <div key={index}>{part.text}</div>;



7

}



8



9

if (part.type === 'file' && part.mediaType?.startsWith('image/')) {



10

return (



11

<div key={index}>



12

<img src={part.url} />



13

</div>



14

);



15

}



16

})}



17

</div>



18

));



19

}
```

Some models do not support text files (text/plain, text/markdown, text/csv,
etc.) as file parts. For text files, you can read and send the context as a text part
instead:

```
1

// Instead of this:



2

{ type: 'file', data: buffer, mediaType: 'text/plain' }



3



4

// Do this:



5

{ type: 'text', text: buffer.toString('utf-8') }
```

### [Embedding Changes](#embedding-changes)

#### [Provider Options for Embeddings](#provider-options-for-embeddings)

Embedding model settings now use provider options instead of model parameters.

AI SDK 4.0

```
1

const { embedding } = await embed({



2

model: openai('text-embedding-3-small', {



3

dimensions: 10,



4

}),



5

});
```

AI SDK 5.0

```
1

const { embedding } = await embed({



2

model: openai('text-embedding-3-small'),



3

providerOptions: {



4

openai: {



5

dimensions: 10,



6

},



7

},



8

});
```

#### [Raw Response → Response](#raw-response--response)

The `rawResponse` property has been renamed to `response`.

AI SDK 4.0

```
1

const { rawResponse } = await embed(/* */);
```

AI SDK 5.0

```
1

const { response } = await embed(/* */);
```

#### [Parallel Requests in embedMany](#parallel-requests-in-embedmany)

`embedMany` now makes parallel requests with a configurable `maxParallelCalls` option.

AI SDK 5.0

```
1

const { embeddings, usage } = await embedMany({



2

maxParallelCalls: 2, // Limit parallel requests



3

model: 'openai/text-embedding-3-small',



4

values: [



5

'sunny day at the beach',



6

'rainy afternoon in the city',



7

'snowy night in the mountains',



8

],



9

});
```

#### [LangChain Adapter Moved to `@ai-sdk/langchain`](#langchain-adapter-moved-to-ai-sdklangchain)

The `LangChainAdapter` has been moved to `@ai-sdk/langchain` and the API has been updated to use UI message streams.

AI SDK 4.0

```
1

import { LangChainAdapter } from 'ai';



2



3

const response = LangChainAdapter.toDataStreamResponse(stream);
```

AI SDK 5.0

```
1

import { toUIMessageStream } from '@ai-sdk/langchain';



2

import { createUIMessageStreamResponse } from 'ai';



3



4

const response = createUIMessageStreamResponse({



5

stream: toUIMessageStream(stream),



6

});
```

Don't forget to install the new package: `npm install @ai-sdk/langchain`

#### [LlamaIndex Adapter Moved to `@ai-sdk/llamaindex`](#llamaindex-adapter-moved-to-ai-sdkllamaindex)

The `LlamaIndexAdapter` has been extracted to a separate package `@ai-sdk/llamaindex` and follows the same UI message stream pattern.

AI SDK 4.0

```
1

import { LlamaIndexAdapter } from 'ai';



2



3

const response = LlamaIndexAdapter.toDataStreamResponse(stream);
```

AI SDK 5.0

```
1

import { toUIMessageStream } from '@ai-sdk/llamaindex';



2

import { createUIMessageStreamResponse } from 'ai';



3



4

const response = createUIMessageStreamResponse({



5

stream: toUIMessageStream(stream),



6

});
```

Don't forget to install the new package: `npm install @ai-sdk/llamaindex`

[Streaming Architecture](#streaming-architecture)
-------------------------------------------------

The streaming architecture has been completely redesigned in v5 to support better content differentiation, concurrent streaming of multiple parts, and improved real-time UX.

### [Stream Protocol Changes](#stream-protocol-changes)

#### [Stream Protocol: Single Chunks → Start/Delta/End Pattern](#stream-protocol-single-chunks--startdeltaend-pattern)

The fundamental streaming pattern has changed from single chunks to a three-phase pattern with unique IDs for each content block.

AI SDK 4.0

```
1

for await (const chunk of result.fullStream) {



2

switch (chunk.type) {



3

case 'text-delta': {



4

process.stdout.write(chunk.textDelta);



5

break;



6

}



7

}



8

}
```

AI SDK 5.0

```
1

for await (const chunk of result.fullStream) {



2

switch (chunk.type) {



3

case 'text-start': {



4

// New: Initialize a text block with unique ID



5

console.log(`Starting text block: ${chunk.id}`);



6

break;



7

}



8

case 'text-delta': {



9

// Changed: Now includes ID and uses 'delta' property



10

process.stdout.write(chunk.delta); // Changed from 'textDelta'



11

break;



12

}



13

case 'text-end': {



14

// New: Finalize the text block



15

console.log(`Completed text block: ${chunk.id}`);



16

break;



17

}



18

}



19

}
```

#### [Reasoning Streaming Pattern](#reasoning-streaming-pattern)

Reasoning content now follows the same start/delta/end pattern:

AI SDK 4.0

```
1

for await (const chunk of result.fullStream) {



2

switch (chunk.type) {



3

case 'reasoning': {



4

// Single chunk with full reasoning text



5

console.log('Reasoning:', chunk.text);



6

break;



7

}



8

}



9

}
```

AI SDK 5.0

```
1

for await (const chunk of result.fullStream) {



2

switch (chunk.type) {



3

case 'reasoning-start': {



4

console.log(`Starting reasoning block: ${chunk.id}`);



5

break;



6

}



7

case 'reasoning-delta': {



8

process.stdout.write(chunk.delta);



9

break;



10

}



11

case 'reasoning-end': {



12

console.log(`Completed reasoning block: ${chunk.id}`);



13

break;



14

}



15

}



16

}
```

#### [Tool Input Streaming](#tool-input-streaming)

Tool inputs can now be streamed as they're being generated:

AI SDK 5.0

```
1

for await (const chunk of result.fullStream) {



2

switch (chunk.type) {



3

case 'tool-input-start': {



4

console.log(`Starting tool input for ${chunk.toolName}: ${chunk.id}`);



5

break;



6

}



7

case 'tool-input-delta': {



8

// Stream the JSON input as it's being generated



9

process.stdout.write(chunk.delta);



10

break;



11

}



12

case 'tool-input-end': {



13

console.log(`Completed tool input: ${chunk.id}`);



14

break;



15

}



16

case 'tool-call': {



17

// Final tool call with complete input



18

console.log('Tool call:', chunk.toolName, chunk.input);



19

break;



20

}



21

}



22

}
```

#### [onChunk Callback Changes](#onchunk-callback-changes)

The `onChunk` callback now receives the new streaming chunk types with IDs and the start/delta/end pattern.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 4.0

```
1

const result = streamText({



2

model: "xai/grok-4.6",



3

prompt: 'Write a story',



4

onChunk({ chunk }) {



5

switch (chunk.type) {



6

case 'text-delta': {



7

// Single property with text content



8

console.log('Text delta:', chunk.textDelta);



9

break;



10

}



11

}



12

},



13

});
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5.0

```
1

const result = streamText({



2

model: "xai/grok-4.6",



3

prompt: 'Write a story',



4

onChunk({ chunk }) {



5

switch (chunk.type) {



6

case 'text-delta': {



7

// Text chunks now use single 'text' type



8

console.log('Text chunk:', chunk.text);



9

break;



10

}



11

case 'reasoning': {



12

// Reasoning chunks use single 'reasoning' type



13

console.log('Reasoning chunk:', chunk.text);



14

break;



15

}



16

case 'source': {



17

console.log('Source chunk:', chunk);



18

break;



19

}



20

case 'tool-call': {



21

console.log('Tool call:', chunk.toolName, chunk.input);



22

break;



23

}



24

case 'tool-input-start': {



25

console.log(



26

`Tool input started for ${chunk.toolName}:`,



27

chunk.toolCallId,



28

);



29

break;



30

}



31

case 'tool-input-delta': {



32

console.log(`Tool input delta for ${chunk.toolCallId}:`, chunk.delta);



33

break;



34

}



35

case 'tool-result': {



36

console.log('Tool result:', chunk.output);



37

break;



38

}



39

case 'raw': {



40

console.log('Raw chunk:', chunk);



41

break;



42

}



43

}



44

},



45

});
```

#### [File Stream Parts Restructure](#file-stream-parts-restructure)

File parts in streams have been flattened.

AI SDK 4.0

```
1

for await (const chunk of result.fullStream) {



2

switch (chunk.type) {



3

case 'file': {



4

console.log('Media type:', chunk.file.mediaType);



5

console.log('File data:', chunk.file.data);



6

break;



7

}



8

}



9

}
```

AI SDK 5.0

```
1

for await (const chunk of result.fullStream) {



2

switch (chunk.type) {



3

case 'file': {



4

console.log('Media type:', chunk.mediaType);



5

console.log('File data:', chunk.data);



6

break;



7

}



8

}



9

}
```

#### [Source Stream Parts Restructure](#source-stream-parts-restructure)

Source stream parts have been flattened.

AI SDK 4.0

```
1

for await (const part of result.fullStream) {



2

if (part.type === 'source' && part.source.sourceType === 'url') {



3

console.log('ID:', part.source.id);



4

console.log('Title:', part.source.title);



5

console.log('URL:', part.source.url);



6

}



7

}
```

AI SDK 5.0

```
1

for await (const part of result.fullStream) {



2

if (part.type === 'source' && part.sourceType === 'url') {



3

console.log('ID:', part.id);



4

console.log('Title:', part.title);



5

console.log('URL:', part.url);



6

}



7

}
```

#### [Finish Event Changes](#finish-event-changes)

Stream finish events have been renamed for consistency.

AI SDK 4.0

```
1

for await (const part of result.fullStream) {



2

switch (part.type) {



3

case 'step-finish': {



4

console.log('Step finished:', part.finishReason);



5

break;



6

}



7

case 'finish': {



8

console.log('Usage:', part.usage);



9

break;



10

}



11

}



12

}
```

AI SDK 5.0

```
1

for await (const part of result.fullStream) {



2

switch (part.type) {



3

case 'finish-step': {



4

// Renamed from 'step-finish'



5

console.log('Step finished:', part.finishReason);



6

break;



7

}



8

case 'finish': {



9

console.log('Total Usage:', part.totalUsage); // Changed from 'usage'



10

break;



11

}



12

}



13

}
```

### [Stream Protocol Changes](#stream-protocol-changes-1)

#### [Proprietary Protocol -> Server-Sent Events](#proprietary-protocol---server-sent-events)

The data stream protocol has been updated to use Server-Sent Events.

AI SDK 4.0

```
1

import { createDataStream, formatDataStreamPart } from 'ai';



2



3

const dataStream = createDataStream({



4

execute: writer => {



5

writer.writeData('initialized call');



6

writer.write(formatDataStreamPart('text', 'Hello'));



7

writer.writeSource({



8

type: 'source',



9

sourceType: 'url',



10

id: 'source-1',



11

url: 'https://example.com',



12

title: 'Example Source',



13

});



14

},



15

});
```

AI SDK 5.0

```
1

import { createUIMessageStream } from 'ai';



2



3

const stream = createUIMessageStream({



4

execute: ({ writer }) => {



5

writer.write({ type: 'data', value: ['initialized call'] });



6

writer.write({ type: 'text', value: 'Hello' });



7

writer.write({



8

type: 'source-url',



9

value: {



10

type: 'source',



11

id: 'source-1',



12

url: 'https://example.com',



13

title: 'Example Source',



14

},



15

});



16

},



17

});
```

#### [Data Stream Response Helper Functions Renamed](#data-stream-response-helper-functions-renamed)

The streaming API has been completely restructured from data streams to UI message streams.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 4.0

```
1

// Express/Node.js servers



2

app.post('/stream', async (req, res) => {



3

const result = streamText({



4

model: "xai/grok-4.6",



5

prompt: 'Generate content',



6

});



7



8

result.pipeDataStreamToResponse(res);



9

});



10



11

// Next.js API routes



12

const result = streamText({



13

model: "xai/grok-4.6",



14

prompt: 'Generate content',



15

});



16



17

return result.toDataStreamResponse();
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5.0

```
1

// Express/Node.js servers



2

app.post('/stream', async (req, res) => {



3

const result = streamText({



4

model: "xai/grok-4.6",



5

prompt: 'Generate content',



6

});



7



8

result.pipeUIMessageStreamToResponse(res);



9

});



10



11

// Next.js API routes



12

const result = streamText({



13

model: "xai/grok-4.6",



14

prompt: 'Generate content',



15

});



16



17

return result.toUIMessageStreamResponse();
```

#### [Stream Transform Function Renaming](#stream-transform-function-renaming)

Various stream-related functions have been renamed for consistency.

AI SDK 4.0

```
1

import { DataStreamToSSETransformStream } from 'ai';
```

AI SDK 5.0

```
1

import { JsonToSseTransformStream } from 'ai';
```

#### [Error Handling: getErrorMessage → onError](#error-handling-geterrormessage--onerror)

The `getErrorMessage` option in `toDataStreamResponse` has been replaced with `onError` in `toUIMessageStreamResponse`, providing more control over error forwarding to the client.

By default, error messages are NOT sent to the client to prevent leaking sensitive information. The `onError` callback allows you to explicitly control what error information is forwarded to the client.

AI SDK 4.0

```
1

return result.toDataStreamResponse({



2

getErrorMessage: error => {



3

// Return sanitized error data to send to client



4

// Only return what you want the client to see!



5

return {



6

errorCode: 'STREAM_ERROR',



7

message: 'An error occurred while processing your request',



8

// In production, avoid sending error.message directly to prevent information leakage



9

};



10

},



11

});
```

AI SDK 5.0

```
1

return result.toUIMessageStreamResponse({



2

onError: error => {



3

// Return sanitized error data to send to client



4

// Only return what you want the client to see!



5

return {



6

errorCode: 'STREAM_ERROR',



7

message: 'An error occurred while processing your request',



8

// In production, avoid sending error.message directly to prevent information leakage



9

};



10

},



11

});
```

### [Utility Changes](#utility-changes)

#### [ID Generation Changes](#id-generation-changes)

The `createIdGenerator()` function now requires a `size` argument.

AI SDK 4.0

```
1

const generator = createIdGenerator({ prefix: 'msg' });



2

const id = generator(16); // Custom size at call time
```

AI SDK 5.0

```
1

const generator = createIdGenerator({ prefix: 'msg', size: 16 });



2

const id = generator(); // Fixed size from creation
```

#### [IDGenerator → IdGenerator](#idgenerator--idgenerator)

The type name has been updated.

AI SDK 4.0

```
1

import { IDGenerator } from 'ai';
```

AI SDK 5.0

```
1

import { IdGenerator } from 'ai';
```

### [Provider Interface Changes](#provider-interface-changes)

#### [Language Model V2 Import](#language-model-v2-import)

`LanguageModelV3` must now be imported from `@ai-sdk/provider`.

AI SDK 4.0

```
1

import { LanguageModelV3 } from 'ai';
```

AI SDK 5.0

```
1

import { LanguageModelV3 } from '@ai-sdk/provider';
```

#### [Middleware Rename](#middleware-rename)

`LanguageModelV1Middleware` has been renamed and moved.

AI SDK 4.0

```
1

import { LanguageModelV1Middleware } from 'ai';
```

AI SDK 5.0

```
1

import { LanguageModelV3Middleware } from '@ai-sdk/provider';
```

#### [Usage Token Properties](#usage-token-properties)

Token usage properties have been renamed for consistency.

AI SDK 4.0

```
1

// In language model implementations



2

{



3

usage: {



4

promptTokens: 10,



5

completionTokens: 20



6

}



7

}
```

AI SDK 5.0

```
1

// In language model implementations



2

{



3

usage: {



4

inputTokens: 10,



5

outputTokens: 20,



6

totalTokens: 30 // Now required



7

}



8

}
```

#### [Stream Part Type Changes](#stream-part-type-changes)

The `LanguageModelV3StreamPart` type has been expanded to support the new streaming architecture with start/delta/end patterns and IDs.

AI SDK 4.0

```
1

// V4: Simple stream parts



2

type LanguageModelV3StreamPart =



3

| { type: 'text-delta'; textDelta: string }



4

| { type: 'reasoning'; text: string }



5

| { type: 'tool-call'; toolCallId: string; toolName: string; input: string };
```

AI SDK 5.0

```
1

// V5: Enhanced stream parts with IDs and lifecycle events



2

type LanguageModelV3StreamPart =



3

// Text blocks with start/delta/end pattern



4

| {



5

type: 'text-start';



6

id: string;



7

providerMetadata?: SharedV2ProviderMetadata;



8

}



9

| {



10

type: 'text-delta';



11

id: string;



12

delta: string;



13

providerMetadata?: SharedV2ProviderMetadata;



14

}



15

| {



16

type: 'text-end';



17

id: string;



18

providerMetadata?: SharedV2ProviderMetadata;



19

}



20



21

// Reasoning blocks with start/delta/end pattern



22

| {



23

type: 'reasoning-start';



24

id: string;



25

providerMetadata?: SharedV2ProviderMetadata;



26

}



27

| {



28

type: 'reasoning-delta';



29

id: string;



30

delta: string;



31

providerMetadata?: SharedV2ProviderMetadata;



32

}



33

| {



34

type: 'reasoning-end';



35

id: string;



36

providerMetadata?: SharedV2ProviderMetadata;



37

}



38



39

// Tool input streaming



40

| {



41

type: 'tool-input-start';



42

id: string;



43

toolName: string;



44

providerMetadata?: SharedV2ProviderMetadata;



45

}



46

| {



47

type: 'tool-input-delta';



48

id: string;



49

delta: string;



50

providerMetadata?: SharedV2ProviderMetadata;



51

}



52

| {



53

type: 'tool-input-end';



54

id: string;



55

providerMetadata?: SharedV2ProviderMetadata;



56

}



57



58

// Enhanced tool calls



59

| {



60

type: 'tool-call';



61

toolCallId: string;



62

toolName: string;



63

input: string;



64

providerMetadata?: SharedV2ProviderMetadata;



65

}



66



67

// Stream lifecycle events



68

| { type: 'stream-start'; warnings: Array<SharedV3Warning> }



69

| {



70

type: 'finish';



71

usage: LanguageModelV3Usage;



72

finishReason: LanguageModelV3FinishReason;



73

providerMetadata?: SharedV2ProviderMetadata;



74

};
```

#### [Raw Response → Response](#raw-response--response-1)

Provider response objects have been updated.

AI SDK 4.0

```
1

// In language model implementations



2

{



3

rawResponse: {



4

/* ... */



5

}



6

}
```

AI SDK 5.0

```
1

// In language model implementations



2

{



3

response: {



4

/* ... */



5

}



6

}
```

#### [`wrapLanguageModel` now stable](#wraplanguagemodel-now-stable)

AI SDK 4.0

```
1

import { experimental_wrapLanguageModel } from 'ai';
```

AI SDK 5.0

```
1

import { wrapLanguageModel } from 'ai';
```

#### [`activeTools` No Longer Experimental](#activetools-no-longer-experimental)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 4.0

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

messages,



4

tools: { weatherTool, locationTool },



5

experimental_activeTools: ['weatherTool'],



6

});
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5.0

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

messages,



4

tools: { weatherTool, locationTool },



5

activeTools: ['weatherTool'], // No longer experimental



6

});
```

#### [`prepareStep` No Longer Experimental](#preparestep-no-longer-experimental)

The `experimental_prepareStep` option has been promoted and no longer requires the experimental prefix.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 4.0

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

messages,



4

tools: { weatherTool, locationTool },



5

experimental_prepareStep: ({ steps, stepNumber, model }) => {



6

console.log('Preparing step:', stepNumber);



7

return {



8

activeTools: ['weatherTool'],



9

system: 'Be helpful and concise.',



10

};



11

},



12

});
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5.0

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

messages,



4

tools: { weatherTool, locationTool },



5

prepareStep: ({ steps, stepNumber, model }) => {



6

console.log('Preparing step:', stepNumber);



7

return {



8

activeTools: ['weatherTool'],



9

system: 'Be helpful and concise.',



10

// Can also configure toolChoice, model, etc.



11

};



12

},



13

});
```

The `prepareStep` function receives `{ steps, stepNumber, model }` and can return:

* `model`: Different model for this step
* `activeTools`: Which tools to make available
* `toolChoice`: Tool selection strategy
* `system`: System message for this step
* `undefined`: Use default settings

### [Temperature Default Removal](#temperature-default-removal)

Temperature is no longer set to `0` by default.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 4.0

```
1

await generateText({



2

model: "xai/grok-4.6",



3

prompt: 'Write a creative story',



4

// Implicitly temperature: 0



5

});
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5.0

```
1

await generateText({



2

model: "xai/grok-4.6",



3

prompt: 'Write a creative story',



4

temperature: 0, // Must explicitly set



5

});
```

[Message Persistence Changes](#message-persistence-changes)
-----------------------------------------------------------

If you have persisted messages in a database, see the [Data Migration
Guide](/docs/migration-guides/migration-guide-5-0-data) for comprehensive
guidance on migrating your stored message data to the v5 format.

In v4, you would typically use helper functions like `appendResponseMessages` or `appendClientMessage` to format messages in the `onFinish` callback of `streamText`:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 4.0

```
1

import {



2

streamText,



3

convertToModelMessages,



4

appendClientMessage,



5

appendResponseMessages,



6

} from 'ai';



7



8

const updatedMessages = appendClientMessage({



9

messages,



10

message: lastUserMessage,



11

});



12



13

const result = streamText({



14

model: "xai/grok-4.6",



15

messages: updatedMessages,



16

experimental_generateMessageId: () => generateId(), // ID generation on streamText



17

onFinish: async ({ responseMessages, usage }) => {



18

// Use helper functions to format messages



19

const finalMessages = appendResponseMessages({



20

messages: updatedMessages,



21

responseMessages,



22

});



23



24

// Save formatted messages to database



25

await saveMessages(finalMessages);



26

},



27

});
```

In v5, message persistence is now handled through the `toUIMessageStreamResponse` method, which automatically formats response messages in the `UIMessage` format:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5.0

```
1

import { streamText, convertToModelMessages, UIMessage } from 'ai';



2



3

const messages: UIMessage[] = [



4

// Your existing messages in UIMessage format



5

];



6



7

const result = streamText({



8

model: "xai/grok-4.6",



9

messages: convertToModelMessages(messages),



10

// experimental_generateMessageId removed from here



11

});



12



13

return result.toUIMessageStreamResponse({



14

originalMessages: messages, // IMPORTANT: Required to prevent duplicate messages



15

generateMessageId: () => generateId(), // IMPORTANT: Required for proper message ID generation



16

onFinish: ({ messages, responseMessage }) => {



17

// messages contains all messages (original + response) in UIMessage format



18

saveChat({ chatId, messages });



19



20

// responseMessage contains just the generated message in UIMessage format



21

saveMessage({ chatId, message: responseMessage });



22

},



23

});
```

**Important:** When using `toUIMessageStreamResponse`, you should always
provide both `originalMessages` and `generateMessageId` parameters. Without
these, you may experience duplicate or repeated assistant messages in your UI.
For more details, see [Troubleshooting: Repeated Assistant
Messages](/docs/troubleshooting/repeated-assistant-messages).

### [Message ID Generation](#message-id-generation)

The `experimental_generateMessageId` option has been moved from `streamText` configuration to `toUIMessageStreamResponse`, as it's designed for use with `UIMessage`s rather than `ModelMessage`s.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 4.0

```
1

const result = streamText({



2

model: "xai/grok-4.6",



3

messages,



4

experimental_generateMessageId: () => generateId(),



5

});
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5.0

```
1

const result = streamText({



2

model: "xai/grok-4.6",



3

messages: convertToModelMessages(messages),



4

});



5



6

return result.toUIMessageStreamResponse({



7

generateMessageId: () => generateId(), // No longer experimental



8

// ...



9

});
```

For more details on message IDs and persistence, see the [Chatbot Message Persistence guide](/docs/ai-sdk-ui/chatbot-message-persistence#message-ids).

### [Using createUIMessageStream](#using-createuimessagestream)

For more complex scenarios, especially when working with data parts, you can use `createUIMessageStream`:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

AI SDK 5.0 - Advanced

```
1

import {



2

createUIMessageStream,



3

createUIMessageStreamResponse,



4

streamText,



5

convertToModelMessages,



6

UIMessage,



7

} from 'ai';



8



9

const stream = createUIMessageStream({



10

originalMessages: messages,



11

generateId: generateId, // Required for proper message ID generation



12

execute: ({ writer }) => {



13

// Write custom data parts



14

writer.write({



15

type: 'data',



16

data: { status: 'processing', timestamp: Date.now() },



17

});



18



19

// Stream the AI response



20

const result = streamText({



21

model: "xai/grok-4.6",



22

messages: convertToModelMessages(messages),



23

});



24



25

writer.merge(result.toUIMessageStream());



26

},



27

onFinish: ({ messages }) => {



28

// messages contains all messages (original + response + data parts) in UIMessage format



29

saveChat({ chatId, messages });



30

},



31

});



32



33

return createUIMessageStreamResponse({ stream });
```

[Provider & Model Changes](#provider--model-changes)
----------------------------------------------------

### [OpenAI](#openai)

#### [Default Provider Instance Uses Responses API](#default-provider-instance-uses-responses-api)

In AI SDK 5, the default OpenAI provider instance uses the Responses API, while AI SDK 4 used the Chat Completions API. The Chat Completions API remains fully supported and you can use it with `openai.chat(...)`.

AI SDK 4.0

```
1

import { openai } from '@ai-sdk/openai';



2



3

const defaultModel = openai('gpt-4.1-mini'); // Chat Completions API
```

AI SDK 5.0

```
1

import { openai } from '@ai-sdk/openai';



2



3

const defaultModel = openai('gpt-4.1-mini'); // Responses API



4



5

// Specify a specific API when needed:



6

const chatCompletionsModel = openai.chat('gpt-4.1-mini');



7

const responsesModel = openai.responses('gpt-4.1-mini');
```

The Responses and Chat Completions APIs have different behavior and defaults.
If you depend on the Chat Completions API, switch your model instance to
`openai.chat(...)` and audit your configuration.

#### [Strict Schemas (`strictSchemas`) with Responses API](#strict-schemas-strictschemas-with-responses-api)

In AI SDK 4.0, you could set the `strictSchemas` option on Responses models (which defaulted to `true`). This option has been renamed to `strictJsonSchema` in AI SDK 5.0 and now defaults to `false`.

AI SDK 4.0

```
1

import { z } from 'zod';



2

import { generateObject } from 'ai';



3

import { openai, type OpenAIResponsesProviderOptions } from '@ai-sdk/openai';



4



5

const result = await generateObject({



6

model: openai.responses('gpt-4.1'),



7

schema: z.object({



8

// ...



9

}),



10

providerOptions: {



11

openai: {



12

strictSchemas: true, // default behavior in AI SDK 4



13

} satisfies OpenAIResponsesProviderOptions,



14

},



15

});
```

AI SDK 5.0

```
1

import { z } from 'zod';



2

import { generateObject } from 'ai';



3

import { openai, type OpenAIResponsesProviderOptions } from '@ai-sdk/openai';



4



5

const result = await generateObject({



6

model: openai('gpt-4.1-2024'), // uses Responses API



7

schema: z.object({



8

// ...



9

}),



10

providerOptions: {



11

openai: {



12

strictJsonSchema: true, // defaults to false, opt back in to the AI SDK 4 strict behavior



13

} satisfies OpenAIResponsesProviderOptions,



14

},



15

});
```

If you call `openai.chat(...)` to use the Chat Completions API directly, you can type it with `OpenAIChatLanguageModelOptions`. AI SDK 5 adds the same `strictJsonSchema` option there as well.

#### [Structured Outputs](#structured-outputs)

The `structuredOutputs` option is now configured using provider options rather than as a setting on the model instance.

AI SDK 4.0

```
1

import { z } from 'zod';



2

import { generateObject } from 'ai';



3

import { openai } from '@ai-sdk/openai';



4



5

const result = await generateObject({



6

model: openai('gpt-4.1', { structuredOutputs: true }), // use Chat Completions API



7

schema: z.object({ name: z.string() }),



8

});
```

AI SDK 5.0 (Chat Completions API)

```
1

import { z } from 'zod';



2

import { generateObject } from 'ai';



3

import { openai, type OpenAIChatLanguageModelOptions } from '@ai-sdk/openai';



4



5

const result = await generateObject({



6

model: openai.chat('gpt-4.1'), // use Chat Completions API



7

schema: z.object({ name: z.string() }),



8

providerOptions: {



9

openai: {



10

structuredOutputs: true,



11

} satisfies OpenAIChatLanguageModelOptions,



12

},



13

});
```

#### [Compatibility Option Removal](#compatibility-option-removal)

The `compatibility` option has been removed; strict compatibility mode is now the default.

AI SDK 4.0

```
1

const openai = createOpenAI({



2

compatibility: 'strict',



3

});
```

AI SDK 5.0

```
1

const openai = createOpenAI({



2

// strict compatibility is now the default



3

});
```

#### [Legacy Function Calls Removal](#legacy-function-calls-removal)

The `useLegacyFunctionCalls` option has been removed.

AI SDK 4.0

```
1

const result = streamText({



2

model: openai('gpt-4.1', { useLegacyFunctionCalls: true }),



3

});
```

AI SDK 5.0

```
1

const result = streamText({



2

model: openai('gpt-4.1'),



3

});
```

#### [Simulate Streaming](#simulate-streaming)

The `simulateStreaming` model option has been replaced with middleware.

AI SDK 4.0

```
1

const result = generateText({



2

model: openai('gpt-4.1', { simulateStreaming: true }),



3

prompt: 'Hello, world!',



4

});
```

AI SDK 5.0

```
1

import { simulateStreamingMiddleware, wrapLanguageModel } from 'ai';



2



3

const model = wrapLanguageModel({



4

model: openai('gpt-4.1'),



5

middleware: simulateStreamingMiddleware(),



6

});



7



8

const result = generateText({



9

model,



10

prompt: 'Hello, world!',



11

});
```

### [Google](#google)

#### [Search Grounding is now a provider defined tool](#search-grounding-is-now-a-provider-defined-tool)

Search Grounding is now called "Google Search" and is now a provider defined tool.

AI SDK 4.0

```
1

const { text, providerMetadata } = await generateText({



2

model: google('gemini-1.5-pro', {



3

useSearchGrounding: true,



4

}),



5

prompt: 'List the top 5 San Francisco news from the past week.',



6

});
```

AI SDK 5.0

```
1

import { google } from '@ai-sdk/google';



2

const { text, sources, providerMetadata } = await generateText({



3

model: google('gemini-1.5-pro'),



4

prompt:



5

'List the top 5 San Francisco news from the past week.'



6

tools: {



7

google_search: google.tools.googleSearch({}),



8

},



9

});
```

### [Amazon Bedrock](#amazon-bedrock)

#### [Snake Case → Camel Case](#snake-case--camel-case)

Provider options have been updated to use camelCase.

AI SDK 4.0

```
1

const result = await generateText({



2

model: bedrock('amazon.titan-tg1-large'),



3

prompt: 'Hello, world!',



4

providerOptions: {



5

bedrock: {



6

reasoning_config: {



7

/* ... */



8

},



9

},



10

},



11

});
```

AI SDK 5.0

```
1

const result = await generateText({



2

model: bedrock('amazon.titan-tg1-large'),



3

prompt: 'Hello, world!',



4

providerOptions: {



5

bedrock: {



6

reasoningConfig: {



7

/* ... */



8

},



9

},



10

},



11

});
```

### [Provider-Utils Changes](#provider-utils-changes)

Deprecated `CoreTool*` types have been removed.

AI SDK 4.0

```
1

import {



2

CoreToolCall,



3

CoreToolResult,



4

CoreToolResultUnion,



5

CoreToolCallUnion,



6

CoreToolChoice,



7

} from '@ai-sdk/provider-utils';
```

AI SDK 5.0

```
1

import {



2

ToolCall,



3

ToolResult,



4

TypedToolResult,



5

TypedToolCall,



6

ToolChoice,



7

} from '@ai-sdk/provider-utils';
```

[Troubleshooting](#troubleshooting)
-----------------------------------

### [TypeScript Performance Issues with Zod](#typescript-performance-issues-with-zod)

If you experience TypeScript server crashes, slow type checking, or errors like "Type instantiation is excessively deep and possibly infinite" when using Zod with AI SDK 5.0:

1. **First, ensure you're using Zod 4.1.8 or later** - this version includes a fix for module resolution issues that cause TypeScript performance problems.
2. If the issue persists, update your `tsconfig.json` to use `moduleResolution: "nodenext"`:

```
1

{



2

"compilerOptions": {



3

"moduleResolution": "nodenext"



4

// ... other options



5

}



6

}
```

This resolves the TypeScript performance issues while allowing you to continue using the standard Zod import. If this doesn't resolve the issue, you can try using a version-specific import path as an alternative solution. For detailed troubleshooting steps, see [TypeScript performance issues with Zod](/docs/troubleshooting/typescript-performance-zod).

[Codemod Table](#codemod-table)
-------------------------------

The following table lists available codemods for the AI SDK 5.0 upgrade
process.
For more information, see the [Codemods](#codemods) section.

| Change | Codemod |
| --- | --- |
| **AI SDK Core Changes** |  |
| Flatten streamText file properties | `v5/flatten-streamtext-file-properties` |
| ID Generation Changes | `v5/require-createIdGenerator-size-argument` |
| IDGenerator → IdGenerator | `v5/rename-IDGenerator-to-IdGenerator` |
| Import LanguageModelV3 from provider package | `v5/import-LanguageModelV3-from-provider-package` |
| Migrate to data stream protocol v2 | `v5/migrate-to-data-stream-protocol-v2` |
| Move image model maxImagesPerCall | `v5/move-image-model-maxImagesPerCall` |
| Move LangChain adapter | `v5/move-langchain-adapter` |
| Move maxSteps to stopWhen | `v5/move-maxsteps-to-stopwhen` |
| Move provider options | `v5/move-provider-options` |
| Move React to AI SDK | `v5/move-react-to-ai-sdk` |
| Move UI utils to AI | `v5/move-ui-utils-to-ai` |
| Remove experimental wrap language model | `v5/remove-experimental-wrap-language-model` |
| Remove experimental activeTools | `v5/remove-experimental-activetools` |
| Remove experimental prepareStep | `v5/remove-experimental-preparestep` |
| Remove experimental continueSteps | `v5/remove-experimental-continuesteps` |
| Remove experimental temperature | `v5/remove-experimental-temperature` |
| Remove experimental truncate | `v5/remove-experimental-truncate` |
| Remove experimental OpenAI compatibility | `v5/remove-experimental-openai-compatibility` |
| Remove experimental OpenAI legacy function calls | `v5/remove-experimental-openai-legacy-function-calls` |
| Remove experimental OpenAI structured outputs | `v5/remove-experimental-openai-structured-outputs` |
| Remove experimental OpenAI store | `v5/remove-experimental-openai-store` |
| Remove experimental OpenAI user | `v5/remove-experimental-openai-user` |
| Remove experimental OpenAI parallel tool calls | `v5/remove-experimental-openai-parallel-tool-calls` |
| Remove experimental OpenAI response format | `v5/remove-experimental-openai-response-format` |
| Remove experimental OpenAI logit bias | `v5/remove-experimental-openai-logit-bias` |
| Remove experimental OpenAI logprobs | `v5/remove-experimental-openai-logprobs` |
| Remove experimental OpenAI seed | `v5/remove-experimental-openai-seed` |
| Remove experimental OpenAI service tier | `v5/remove-experimental-openai-service-tier` |
| Remove experimental OpenAI top logprobs | `v5/remove-experimental-openai-top-logprobs` |
| Remove experimental OpenAI transform | `v5/remove-experimental-openai-transform` |
| Remove experimental OpenAI stream options | `v5/remove-experimental-openai-stream-options` |
| Remove experimental OpenAI prediction | `v5/remove-experimental-openai-prediction` |
| Remove experimental Anthropic caching | `v5/remove-experimental-anthropic-caching` |
| Remove experimental Anthropic computer use | `v5/remove-experimental-anthropic-computer-use` |
| Remove experimental Anthropic PDF support | `v5/remove-experimental-anthropic-pdf-support` |
| Remove experimental Anthropic prompt caching | `v5/remove-experimental-anthropic-prompt-caching` |
| Remove experimental Google search grounding | `v5/remove-experimental-google-search-grounding` |
| Remove experimental Google code execution | `v5/remove-experimental-google-code-execution` |
| Remove experimental Google cached content | `v5/remove-experimental-google-cached-content` |
| Remove experimental Google custom headers | `v5/remove-experimental-google-custom-headers` |
| Rename format stream part | `v5/rename-format-stream-part` |
| Rename parse stream part | `v5/rename-parse-stream-part` |
| Replace image type with file type | `v5/replace-image-type-with-file-type` |
| Replace LlamaIndex adapter | `v5/replace-llamaindex-adapter` |
| Replace onCompletion with onFinal | `v5/replace-oncompletion-with-onfinal` |
| Replace provider metadata with provider options | `v5/replace-provider-metadata-with-provider-options` |
| Replace rawResponse with response | `v5/replace-rawresponse-with-response` |
| Replace redacted reasoning type | `v5/replace-redacted-reasoning-type` |
| Replace simulate streaming | `v5/replace-simulate-streaming` |
| Replace textDelta with text | `v5/replace-textdelta-with-text` |
| Replace usage token properties | `v5/replace-usage-token-properties` |
| Restructure file stream parts | `v5/restructure-file-stream-parts` |
| Restructure source stream parts | `v5/restructure-source-stream-parts` |
| RSC package | `v5/rsc-package` |

[Changes Between v5 Beta Versions](#changes-between-v5-beta-versions)
---------------------------------------------------------------------

This section documents breaking changes between different beta versions of AI SDK 5.0. If you're upgrading from an earlier v5 beta version to a later one, check this section for any changes that might affect your code.

### [fullStream Type Rename: text/reasoning → text-delta/reasoning-delta](#fullstream-type-rename-textreasoning--text-deltareasoning-delta)

The chunk types in `fullStream` have been renamed for consistency with UI streams and language model streams.

AI SDK 5.0 (before beta.26)

```
1

for await (const chunk of result.fullStream) {



2

switch (chunk.type) {



3

case 'text-delta': {



4

process.stdout.write(chunk.text);



5

break;



6

}



7

case 'reasoning': {



8

console.log('Reasoning:', chunk.text);



9

break;



10

}



11

}



12

}
```

AI SDK 5.0 (beta.26 and later)

```
1

for await (const chunk of result.fullStream) {



2

switch (chunk.type) {



3

case 'text-delta': {



4

process.stdout.write(chunk.text);



5

break;



6

}



7

case 'reasoning-delta': {



8

console.log('Reasoning:', chunk.text);



9

break;



10

}



11

}



12

}
```

[Previous

Migrate Your Data to AI SDK 5.0](/docs/migration-guides/migration-guide-5-0-data)[Next

Migrate AI SDK 4.1 to 4.2](/docs/migration-guides/migration-guide-4-2)
