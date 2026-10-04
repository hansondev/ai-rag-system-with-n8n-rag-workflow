---
title: "Chatbot Tool Usage"
source_url: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage
section: ai-sdk-ui
crawled: 2026-09-20
---

# Chatbot Tool Usage

> Source: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage

[AI SDK UI](/docs/ai-sdk-ui)Chatbot Tool Usage


[Chatbot Tool Usage](#chatbot-tool-usage)
=========================================

With [`useChat`](/docs/reference/ai-sdk-ui/use-chat) and [`streamText`](/docs/reference/ai-sdk-core/stream-text), you can use tools in your chatbot application.
The AI SDK supports three tool execution patterns in this context:

1. Automatically executed server-side tools
2. Automatically executed client-side tools
3. Tools that require user interaction, such as confirmation dialogs

The flow is as follows:

1. The user enters a message in the chat UI.
2. The message is sent to the API route.
3. In your server side route, the language model generates tool calls during the `streamText` call.
4. All tool calls are forwarded to the client.
5. Server-side tools are executed using their `execute` method and their results are forwarded to the client.
6. Client-side tools that should be automatically executed are handled with the `onToolCall` callback.
   You must call `addToolOutput` to provide the tool result.
7. Client-side tool that require user interactions can be displayed in the UI.
   The tool calls and results are available as tool invocation parts in the `parts` property of the last assistant message.
8. When the user interaction is done, `addToolOutput` can be used to add the tool result to the chat.
9. The chat can be configured to automatically submit when all tool results are available using `sendAutomaticallyWhen`.
   This triggers another iteration of this flow.

The tool calls and tool executions are integrated into the assistant message as typed tool parts.
A tool part is at first a tool call, and then it becomes a tool result when the tool is executed.
The tool result contains all information about the tool call as well as the result of the tool execution.

Tool result submission can be configured using the `sendAutomaticallyWhen`
option. You can use the `lastAssistantMessageIsCompleteWithToolCalls` helper
to automatically submit when all tool results are available. This simplifies
the client-side code while still allowing full control when needed.

[Example](#example)
-------------------

In this example, we'll use three tools:

* `getWeatherInformation`: An automatically executed server-side tool that returns the weather in a given city.
* `askForConfirmation`: A user-interaction client-side tool that asks the user for confirmation.
* `getLocation`: An automatically executed client-side tool that returns a random city.

### [API route](#api-route)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat/route.ts

```
1

import {



2

convertToModelMessages,



3

createUIMessageStreamResponse,



4

streamText,



5

toUIMessageStream,



6

UIMessage,



7

} from 'ai';



8

import { z } from 'zod';



9



10

// Allow streaming responses up to 30 seconds



11

export const maxDuration = 30;



12



13

export async function POST(req: Request) {



14

const { messages }: { messages: UIMessage[] } = await req.json();



15



16

const result = streamText({



17

model: "xai/grok-4.6",



18

messages: await convertToModelMessages(messages),



19

tools: {



20

// server-side tool with execute function:



21

getWeatherInformation: {



22

description: 'show the weather in a given city to the user',



23

inputSchema: z.object({ city: z.string() }),



24

execute: async ({}: { city: string }) => {



25

const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];



26

return weatherOptions[



27

Math.floor(Math.random() * weatherOptions.length)



28

];



29

},



30

},



31

// client-side tool that starts user interaction:



32

askForConfirmation: {



33

description: 'Ask the user for confirmation.',



34

inputSchema: z.object({



35

message: z.string().describe('The message to ask for confirmation.'),



36

}),



37

},



38

// client-side tool that is automatically executed on the client:



39

getLocation: {



40

description:



41

'Get the user location. Always ask for confirmation before using this tool.',



42

inputSchema: z.object({}),



43

},



44

},



45

});



46



47

return createUIMessageStreamResponse({



48

stream: toUIMessageStream({ stream: result.stream }),



49

});



50

}
```

### [Client-side page](#client-side-page)

The client-side page uses the `useChat` hook to create a chatbot application with real-time message streaming.
Tool calls are displayed in the chat UI as typed tool parts.
Please make sure to render the messages using the `parts` property of the message.

There are three things worth mentioning:

1. The [`onToolCall`](/docs/reference/ai-sdk-ui/use-chat#on-tool-call) callback is used to handle client-side tools that should be automatically executed.
   In this example, the `getLocation` tool is a client-side tool that returns a random city.
   You call `addToolOutput` to provide the result (without `await` to avoid potential deadlocks).

   Always check `if (toolCall.dynamic)` first in your `onToolCall` handler.
   Without this check, TypeScript will throw an error like: `Type 'string' is not assignable to type '"toolName1" | "toolName2"'` when you try to use
   `toolCall.toolName` in `addToolOutput`.
2. The [`sendAutomaticallyWhen`](/docs/reference/ai-sdk-ui/use-chat#send-automatically-when) option with `lastAssistantMessageIsCompleteWithToolCalls` helper automatically submits when all tool results are available.
3. The `parts` array of assistant messages contains tool parts with typed names like `tool-askForConfirmation`.
   The client-side tool `askForConfirmation` is displayed in the UI.
   It asks the user for confirmation and displays the result once the user confirms or denies the execution.
   The result is added to the chat using `addToolOutput` with the `tool` parameter for type safety.

Typed tool parts also include the `approval-requested`, `approval-responded`,
and `output-denied` states. Include these states when handling `part.state`
exhaustively, even when a tool does not require approval. See
[Tool execution approval](#tool-execution-approval) for a complete approval UI.

app/page.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import {



5

DefaultChatTransport,



6

lastAssistantMessageIsCompleteWithToolCalls,



7

} from 'ai';



8

import { useState } from 'react';



9



10

export default function Chat() {



11

const { messages, sendMessage, addToolOutput } = useChat({



12

transport: new DefaultChatTransport({



13

api: '/api/chat',



14

}),



15



16

sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,



17



18

// run client-side tools that are automatically executed:



19

async onToolCall({ toolCall }) {



20

// Check if it's a dynamic tool first for proper type narrowing



21

if (toolCall.dynamic) {



22

return;



23

}



24



25

if (toolCall.toolName === 'getLocation') {



26

const cities = ['New York', 'Los Angeles', 'Chicago', 'San Francisco'];



27



28

// No await - avoids potential deadlocks



29

addToolOutput({



30

tool: 'getLocation',



31

toolCallId: toolCall.toolCallId,



32

output: cities[Math.floor(Math.random() * cities.length)],



33

});



34

}



35

},



36

});



37

const [input, setInput] = useState('');



38



39

return (



40

<>



41

{messages?.map(message => (



42

<div key={message.id}>



43

<strong>{`${message.role}: `}</strong>



44

{message.parts.map(part => {



45

switch (part.type) {



46

// render text parts as simple text:



47

case 'text':



48

return part.text;



49



50

// for tool parts, use the typed tool part names:



51

case 'tool-askForConfirmation': {



52

const callId = part.toolCallId;



53



54

switch (part.state) {



55

case 'input-streaming':



56

return (



57

<div key={callId}>Loading confirmation request...</div>



58

);



59

case 'input-available':



60

return (



61

<div key={callId}>



62

{part.input.message}



63

<div>



64

<button



65

onClick={() =>



66

addToolOutput({



67

tool: 'askForConfirmation',



68

toolCallId: callId,



69

output: 'Yes, confirmed.',



70

})



71

}



72

>



73

Yes



74

</button>



75

<button



76

onClick={() =>



77

addToolOutput({



78

tool: 'askForConfirmation',



79

toolCallId: callId,



80

output: 'No, denied',



81

})



82

}



83

>



84

No



85

</button>



86

</div>



87

</div>



88

);



89

case 'approval-requested':



90

return <div key={callId}>Approval requested.</div>;



91

case 'approval-responded':



92

return <div key={callId}>Approval response received.</div>;



93

case 'output-available':



94

return (



95

<div key={callId}>



96

Location access allowed: {part.output}



97

</div>



98

);



99

case 'output-error':



100

return <div key={callId}>Error: {part.errorText}</div>;



101

case 'output-denied':



102

return <div key={callId}>Tool call denied.</div>;



103

}



104

break;



105

}



106



107

case 'tool-getLocation': {



108

const callId = part.toolCallId;



109



110

switch (part.state) {



111

case 'input-streaming':



112

return (



113

<div key={callId}>Preparing location request...</div>



114

);



115

case 'input-available':



116

return <div key={callId}>Getting location...</div>;



117

case 'approval-requested':



118

return <div key={callId}>Approval requested.</div>;



119

case 'approval-responded':



120

return <div key={callId}>Approval response received.</div>;



121

case 'output-available':



122

return <div key={callId}>Location: {part.output}</div>;



123

case 'output-error':



124

return (



125

<div key={callId}>



126

Error getting location: {part.errorText}



127

</div>



128

);



129

case 'output-denied':



130

return <div key={callId}>Location request denied.</div>;



131

}



132

break;



133

}



134



135

case 'tool-getWeatherInformation': {



136

const callId = part.toolCallId;



137



138

switch (part.state) {



139

// example of pre-rendering streaming tool inputs:



140

case 'input-streaming':



141

return (



142

<pre key={callId}>{JSON.stringify(part, null, 2)}</pre>



143

);



144

case 'input-available':



145

return (



146

<div key={callId}>



147

Getting weather information for {part.input.city}...



148

</div>



149

);



150

case 'approval-requested':



151

return <div key={callId}>Approval requested.</div>;



152

case 'approval-responded':



153

return <div key={callId}>Approval response received.</div>;



154

case 'output-available':



155

return (



156

<div key={callId}>



157

Weather in {part.input.city}: {part.output}



158

</div>



159

);



160

case 'output-error':



161

return (



162

<div key={callId}>



163

Error getting weather for {part.input.city}:{' '}



164

{part.errorText}



165

</div>



166

);



167

case 'output-denied':



168

return <div key={callId}>Weather request denied.</div>;



169

}



170

break;



171

}



172

}



173

})}



174

<br />



175

</div>



176

))}



177



178

<form



179

onSubmit={e => {



180

e.preventDefault();



181

if (input.trim()) {



182

sendMessage({ text: input });



183

setInput('');



184

}



185

}}



186

>



187

<input value={input} onChange={e => setInput(e.target.value)} />



188

</form>



189

</>



190

);



191

}
```

### [Error handling](#error-handling)

Sometimes an error may occur during client-side tool execution. Use the `addToolOutput` method with a `state` of `output-error` and `errorText` value instead of `output` to record the error.

app/page.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import {



5

DefaultChatTransport,



6

lastAssistantMessageIsCompleteWithToolCalls,



7

} from 'ai';



8

import { useState } from 'react';



9



10

export default function Chat() {



11

const { messages, sendMessage, addToolOutput } = useChat({



12

transport: new DefaultChatTransport({



13

api: '/api/chat',



14

}),



15



16

sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,



17



18

// run client-side tools that are automatically executed:



19

async onToolCall({ toolCall }) {



20

// Check if it's a dynamic tool first for proper type narrowing



21

if (toolCall.dynamic) {



22

return;



23

}



24



25

if (toolCall.toolName === 'getWeatherInformation') {



26

try {



27

const weather = await getWeatherInformation(toolCall.input);



28



29

// No await - avoids potential deadlocks



30

addToolOutput({



31

tool: 'getWeatherInformation',



32

toolCallId: toolCall.toolCallId,



33

output: weather,



34

});



35

} catch (err) {



36

addToolOutput({



37

tool: 'getWeatherInformation',



38

toolCallId: toolCall.toolCallId,



39

state: 'output-error',



40

errorText: 'Unable to get the weather information',



41

});



42

}



43

}



44

},



45

});



46

}
```

When rendering messages, use `isToolOutputErrorUIPart` to identify failed
static and dynamic tool parts without checking the tool state directly:

```
1

import { isToolOutputErrorUIPart, type UIMessage } from 'ai';



2



3

function ToolError({ part }: { part: UIMessage['parts'][number] }) {



4

if (!isToolOutputErrorUIPart(part)) {



5

return null;



6

}



7



8

return <div role="alert">{part.errorText}</div>;



9

}
```

[Tool Execution Approval](#tool-execution-approval)
---------------------------------------------------

Tool execution approval lets you require user confirmation before a server-side tool runs. Unlike [client-side tools](#example) that execute in the browser, tools with approval still execute on the server—but only after the user approves.

Use tool execution approval when you want to:

* Confirm sensitive operations (payments, deletions, external API calls)
* Let users review tool inputs before execution
* Add human oversight to automated workflows

For tools that need to run in the browser (updating UI state, accessing browser APIs), use client-side tools instead.

### [Server Setup](#server-setup)

Enable approval with `toolApproval` on `streamText`. The older
`needsApproval` property on tools is deprecated. See [Tool Execution Approval](/docs/ai-sdk-core/tools-and-tool-calling#tool-execution-approval) for configuration options including dynamic approval based on input.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat/route.ts

```
1

import {



2

createUIMessageStreamResponse,



3

streamText,



4

tool,



5

toUIMessageStream,



6

} from 'ai';



7

import { z } from 'zod';



8



9

export async function POST(req: Request) {



10

const { messages } = await req.json();



11



12

const result = streamText({



13

model: "xai/grok-4.6",



14

messages,



15

tools: {



16

getWeather: tool({



17

description: 'Get the weather in a location',



18

inputSchema: z.object({



19

city: z.string(),



20

}),



21

execute: async ({ city }) => {



22

const weather = await fetchWeather(city);



23

return weather;



24

},



25

}),



26

},



27

toolApproval: {



28

getWeather: 'user-approval',



29

},



30

});



31



32

return createUIMessageStreamResponse({



33

stream: toUIMessageStream({ stream: result.stream }),



34

});



35

}
```

### [Client-Side Approval UI](#client-side-approval-ui)

When a tool requires manual approval, the tool part state is
`approval-requested`. Automatic approvals and denials also flow through the
same approval states, but they set `part.approval.isAutomatic === true`, so you
can render the status without calling `addToolApprovalResponse`. Automatic
approval decisions can also include `part.approval.reason`.

app/page.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4



5

export default function Chat() {



6

const { messages, addToolApprovalResponse } = useChat();



7



8

return (



9

<>



10

{messages.map(message => (



11

<div key={message.id}>



12

{message.parts.map(part => {



13

if (part.type === 'tool-getWeather') {



14

switch (part.state) {



15

case 'approval-requested': {



16

if (part.approval.isAutomatic) {



17

return (



18

<div key={part.toolCallId}>



19

Checking approval for {part.input.city}...



20

</div>



21

);



22

}



23



24

return (



25

<div key={part.toolCallId}>



26

<p>Get weather for {part.input.city}?</p>



27

{part.approval.requestReason && (



28

<p>{part.approval.requestReason}</p>



29

)}



30

<button



31

onClick={() =>



32

addToolApprovalResponse({



33

id: part.approval.id,



34

approved: true,



35

})



36

}



37

>



38

Approve



39

</button>



40

<button



41

onClick={() =>



42

addToolApprovalResponse({



43

id: part.approval.id,



44

approved: false,



45

})



46

}



47

>



48

Deny



49

</button>



50

</div>



51

);



52

}



53

case 'approval-responded':



54

return (



55

<div key={part.toolCallId}>



56

Weather request for {part.input.city} was



57

{part.approval.isAutomatic ? ' automatically' : ''}{' '}



58

{part.approval.approved ? 'approved' : 'denied'}.



59

{part.approval.reason



60

? ` Reason: ${part.approval.reason}`



61

: ''}



62

</div>



63

);



64

case 'output-available':



65

return (



66

<div key={part.toolCallId}>



67

Weather in {part.input.city}: {part.output}



68

</div>



69

);



70

case 'output-denied':



71

return (



72

<div key={part.toolCallId}>



73

Weather request for {part.input.city} was denied.



74

{part.approval.reason



75

? ` Reason: ${part.approval.reason}`



76

: ''}



77

</div>



78

);



79

}



80

}



81

// Handle other part types...



82

})}



83

</div>



84

))}



85

</>



86

);



87

}
```

Call `addToolApprovalResponse` only for manual approvals. Automatic approval
decisions already arrive in the UI stream as `approval-requested` and
`approval-responded` states, and denied executions continue to `output-denied`.
If you return a `reason` from an automatic approval or denial, it is available
as `part.approval.reason`.
For manual approval requests, the reason for requiring approval is available as
`part.approval.requestReason`. It remains separate from an optional response
reason supplied to `addToolApprovalResponse`.

Approval request chunks can also include an `approvalDescriptor` with opaque
application-specific metadata. UI message processing exposes it as
`part.approval.descriptor` in the `approval-requested` state and preserves it in
subsequent approval-bearing states, including `approval-responded`. This lets
clients render or persist server-computed approval metadata without using it to
determine whether the tool was approved.

### [Securing Approvals for Sensitive Tools](#securing-approvals-for-sensitive-tools)

In the `useChat` pattern, the client sends the full message history to the server each turn. Without additional protection, a modified client could fabricate an approval response. For tools that perform sensitive operations, add `experimental_toolApprovalSecret` to your `streamText` call so the server cryptographically verifies that it issued the approval:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat/route.ts

```
1

const result = streamText({



2

model: "xai/grok-4.6",



3

messages,



4

tools: { deleteFile },



5

toolApproval: { deleteFile: 'user-approval' },



6

experimental_toolApprovalSecret: process.env.TOOL_APPROVAL_SECRET,



7

});
```

See [Security Considerations](/docs/agents/tool-approvals#security-considerations) for setup details.

### [Auto-Submit After Approval](#auto-submit-after-approval)

If nothing happens after you approve a tool execution, make sure you either
call `sendMessage` manually or configure `sendAutomaticallyWhen` on the
`useChat` hook.

Use `lastAssistantMessageIsCompleteWithApprovalResponses` to automatically continue the conversation after approvals:

```
1

import { useChat } from '@ai-sdk/react';



2

import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai';



3



4

const { messages, addToolApprovalResponse } = useChat({



5

sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,



6

});
```

[Dynamic Tools](#dynamic-tools)
-------------------------------

When using dynamic tools (tools with unknown types at compile time), the UI parts use a generic `dynamic-tool` type instead of specific tool types:

app/page.tsx

```
1

{



2

message.parts.map((part, index) => {



3

switch (part.type) {



4

// Static tools with specific (`tool-${toolName}`) types



5

case 'tool-getWeatherInformation':



6

return <WeatherDisplay part={part} />;



7



8

// Dynamic tools use generic `dynamic-tool` type



9

case 'dynamic-tool':



10

return (



11

<div key={index}>



12

<h4>Tool: {part.toolName}</h4>



13

{part.state === 'input-streaming' && (



14

<pre>{JSON.stringify(part.input, null, 2)}</pre>



15

)}



16

{part.state === 'output-available' && (



17

<pre>{JSON.stringify(part.output, null, 2)}</pre>



18

)}



19

{part.state === 'output-error' && (



20

<div>Error: {part.errorText}</div>



21

)}



22

</div>



23

);



24

}



25

});



26

}
```

Dynamic tools are useful when integrating with:

* MCP (Model Context Protocol) tools without schemas
* User-defined functions loaded at runtime
* External tool providers

[Tool call streaming](#tool-call-streaming)
-------------------------------------------

Tool call streaming is **enabled by default** in AI SDK 5.0, allowing you to stream tool calls while they are being generated. This provides a better user experience by showing tool inputs as they are generated in real-time.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat/route.ts

```
1

export async function POST(req: Request) {



2

const { messages }: { messages: UIMessage[] } = await req.json();



3



4

const result = streamText({



5

model: "xai/grok-4.6",



6

messages: await convertToModelMessages(messages),



7

// toolCallStreaming is enabled by default in v5



8

// ...



9

});



10



11

return createUIMessageStreamResponse({



12

stream: toUIMessageStream({ stream: result.stream }),



13

});



14

}
```

With tool call streaming enabled, partial tool calls are streamed as part of the data stream.
They are available through the `useChat` hook.
The typed tool parts of assistant messages will also contain partial tool calls.
You can use the `state` property of the tool part to render the correct UI.

app/page.tsx

```
1

export default function Chat() {



2

// ...



3

return (



4

<>



5

{messages?.map(message => (



6

<div key={message.id}>



7

{message.parts.map(part => {



8

switch (part.type) {



9

case 'tool-askForConfirmation':



10

case 'tool-getLocation':



11

case 'tool-getWeatherInformation':



12

switch (part.state) {



13

case 'input-streaming':



14

return <pre>{JSON.stringify(part.input, null, 2)}</pre>;



15

case 'input-available':



16

return <pre>{JSON.stringify(part.input, null, 2)}</pre>;



17

case 'approval-requested':



18

return <div>Approval requested.</div>;



19

case 'approval-responded':



20

return <div>Approval response received.</div>;



21

case 'output-available':



22

return <pre>{JSON.stringify(part.output, null, 2)}</pre>;



23

case 'output-error':



24

return <div>Error: {part.errorText}</div>;



25

case 'output-denied':



26

return <div>Tool call denied.</div>;



27

}



28

}



29

})}



30

</div>



31

))}



32

</>



33

);



34

}
```

[Step start parts](#step-start-parts)
-------------------------------------

When you are using multi-step tool calls, the AI SDK will add step start parts to the assistant messages.
If you want to display boundaries between tool calls, you can use the `step-start` parts as follows:

app/page.tsx

```
1

// ...



2

// where you render the message parts:



3

message.parts.map((part, index) => {



4

switch (part.type) {



5

case 'step-start':



6

// show step boundaries as horizontal lines:



7

return index > 0 ? (



8

<div key={index} className="text-gray-500">



9

<hr className="my-2 border-gray-300" />



10

</div>



11

) : null;



12

case 'text':



13

// ...



14

case 'tool-askForConfirmation':



15

case 'tool-getLocation':



16

case 'tool-getWeatherInformation':



17

// ...



18

}



19

});



20

// ...
```

[Server-side Multi-Step Calls](#server-side-multi-step-calls)
-------------------------------------------------------------

You can also use multi-step calls on the server-side with `streamText`.
This works when all invoked tools have an `execute` function on the server side.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat/route.ts

```
1

import {



2

convertToModelMessages,



3

createUIMessageStreamResponse,



4

isStepCount,



5

streamText,



6

toUIMessageStream,



7

UIMessage,



8

} from 'ai';



9

import { z } from 'zod';



10



11

export async function POST(req: Request) {



12

const { messages }: { messages: UIMessage[] } = await req.json();



13



14

const result = streamText({



15

model: "xai/grok-4.6",



16

messages: await convertToModelMessages(messages),



17

tools: {



18

getWeatherInformation: {



19

description: 'show the weather in a given city to the user',



20

inputSchema: z.object({ city: z.string() }),



21

// tool has execute function:



22

execute: async ({}: { city: string }) => {



23

const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];



24

return weatherOptions[



25

Math.floor(Math.random() * weatherOptions.length)



26

];



27

},



28

},



29

},



30

stopWhen: isStepCount(5),



31

});



32



33

return createUIMessageStreamResponse({



34

stream: toUIMessageStream({ stream: result.stream }),



35

});



36

}
```

[Errors](#errors)
-----------------

Language models can make errors when calling tools.
By default, these errors are masked for security reasons, and show up as "An error occurred" in the UI.

To surface the errors, you can use the `onError` function when calling `toUIMessageResponse`.

```
1

export function errorHandler(error: unknown) {



2

if (error == null) {



3

return 'unknown error';



4

}



5



6

if (typeof error === 'string') {



7

return error;



8

}



9



10

if (error instanceof Error) {



11

return error.message;



12

}



13



14

return JSON.stringify(error);



15

}
```

```
1

const result = streamText({



2

// ...



3

});



4



5

return createUIMessageStreamResponse({



6

stream: toUIMessageStream({



7

stream: result.stream,



8

onError: errorHandler,



9

}),



10

});
```

In case you are using `createUIMessageResponse`, you can use the `onError` function when calling `toUIMessageResponse`:

```
1

const response = createUIMessageResponse({



2

// ...



3

async execute(dataStream) {



4

// ...



5

},



6

onError: error => `Custom error: ${error.message}`,



7

});
```

[Previous

Chatbot Resume Streams](/docs/ai-sdk-ui/chatbot-resume-streams)[Next

Generative User Interfaces](/docs/ai-sdk-ui/generative-user-interfaces)
