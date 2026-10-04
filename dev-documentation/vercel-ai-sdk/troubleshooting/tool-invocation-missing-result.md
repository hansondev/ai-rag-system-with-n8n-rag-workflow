---
title: "Tool Invocation Missing Result Error"
source_url: https://ai-sdk.dev/docs/troubleshooting/tool-invocation-missing-result
section: troubleshooting
crawled: 2026-09-20
---

# Tool Invocation Missing Result Error

> Source: https://ai-sdk.dev/docs/troubleshooting/tool-invocation-missing-result

[Troubleshooting](/docs/troubleshooting)Tool Invocation Missing Result Error


[Tool Invocation Missing Result Error](#tool-invocation-missing-result-error)
=============================================================================

[Issue](#issue)
---------------

When using `generateText()` or `streamText()`, you may encounter the error "ToolInvocation must have a result" when a tool without an `execute` function is called.

[Cause](#cause)
---------------

The error occurs when you define a tool without an `execute` function and don't provide the result through other means (like `useChat`'s `onToolCall` or `addToolOutput` functions).

Each time a tool is invoked, the model expects to receive a result before continuing the conversation. Without a result, the model cannot determine if the tool call succeeded or failed and the conversation state becomes invalid.

[Solution](#solution)
---------------------

You have two options for handling tool results:

1. Server-side execution using tools with an `execute` function:

```
1

const tools = {



2

weather: tool({



3

description: 'Get the weather in a location',



4

inputSchema: z.object({



5

location: z



6

.string()



7

.describe('The city and state, e.g. "San Francisco, CA"'),



8

}),



9

execute: async ({ location }) => {



10

// Fetch and return weather data



11

return { temperature: 72, conditions: 'sunny', location };



12

},



13

}),



14

};
```

2. Client-side execution with `useChat` (omitting the `execute` function), you must provide results using `addToolOutput`:

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

// Automatically submit when all tool results are available



9

sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,



10



11

// Handle tool calls in onToolCall



12

onToolCall: async ({ toolCall }) => {



13

if (toolCall.toolName === 'getLocation') {



14

try {



15

const result = await getLocationData();



16



17

// Important: Don't await inside onToolCall to avoid deadlocks



18

addToolOutput({



19

tool: 'getLocation',



20

toolCallId: toolCall.toolCallId,



21

output: result,



22

});



23

} catch (err) {



24

// Important: Don't await inside onToolCall to avoid deadlocks



25

addToolOutput({



26

tool: 'getLocation',



27

toolCallId: toolCall.toolCallId,



28

state: 'output-error',



29

errorText: 'Failed to get location',



30

});



31

}



32

}



33

},



34

});
```

```
1

// For interactive UI elements:



2

const { messages, sendMessage, addToolOutput } = useChat({



3

transport: new DefaultChatTransport({ api: '/api/chat' }),



4

sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,



5

});



6



7

// Inside your JSX, when rendering tool calls:



8

<button



9

onClick={() =>



10

addToolOutput({



11

tool: 'myTool',



12

toolCallId, // must provide tool call ID



13

output: {



14

/* your tool result */



15

},



16

})



17

}



18

>



19

Confirm



20

</button>;
```

Whether handling tools on the server or client, each tool call must have a
corresponding result before the conversation can continue.

[Previous

Streamable UI Errors](/docs/troubleshooting/streamable-ui-errors)[Next

Streaming Not Working When Deployed](/docs/troubleshooting/streaming-not-working-when-deployed)
