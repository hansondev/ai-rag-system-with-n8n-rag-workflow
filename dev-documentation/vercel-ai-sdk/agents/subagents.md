---
title: "Subagents"
source_url: https://ai-sdk.dev/docs/agents/subagents
section: agents
crawled: 2026-09-20
---

# Subagents

> Source: https://ai-sdk.dev/docs/agents/subagents

[Agents](/docs/agents)Subagents


[Subagents](#subagents)
=======================

A subagent is an agent that a parent agent can invoke. The parent delegates work via a tool, and the subagent executes autonomously before returning a result.

[How It Works](#how-it-works)
-----------------------------

1. **Define a subagent** with its own model, instructions, and tools
2. **Create a tool that calls it** for the main agent to use
3. **Subagent runs independently with its own context window**
4. **Return a result** (optionally streaming progress to the UI)
5. **Control what the model sees** using `toModelOutput` to summarize

[When to Use Subagents](#when-to-use-subagents)
-----------------------------------------------

Subagents add latency and complexity. Use them when the benefits outweigh the costs:

| Use Subagents When | Avoid Subagents When |
| --- | --- |
| Tasks require exploring large amounts of tokens | Tasks are simple and focused |
| You need to parallelize independent research | Sequential processing suffices |
| Context would grow beyond model limits | Context stays manageable |
| You want to isolate tool access by capability | All tools can safely coexist |

[Why Use Subagents?](#why-use-subagents)
----------------------------------------

### [Offloading Context-Heavy Tasks](#offloading-context-heavy-tasks)

Some tasks require exploring large amounts of information—reading files, searching codebases, or researching topics. Running these in the main agent consumes context quickly, making the agent less coherent over time.

With subagents, you can:

* Spin up a dedicated agent that uses hundreds of thousands of tokens
* Have it return only a focused summary (perhaps 1,000 tokens)
* Keep your main agent's context clean and coherent

The subagent does the heavy lifting while the main agent stays focused on orchestration.

### [Parallelizing Independent Work](#parallelizing-independent-work)

For tasks like exploring a codebase, you can spawn multiple subagents to research different areas simultaneously. Each returns a summary, and the main agent synthesizes the findings—without paying the context cost of all that exploration.

### [Specialized Orchestration](#specialized-orchestration)

A less common but valid pattern is using a main agent purely for orchestration, delegating to specialized subagents for different types of work. For example:

* An exploration subagent with read-only tools for researching codebases
* A coding subagent with file editing tools
* An integration subagent with tools for a specific platform or API

This creates a clear separation of concerns, though context offloading and parallelization are the more common motivations for subagents.

[Basic Subagent Without Streaming](#basic-subagent-without-streaming)
---------------------------------------------------------------------

The simplest subagent pattern requires no special machinery. Your main agent has a tool that calls another agent in its `execute` function:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, tool } from 'ai';



2

import { z } from 'zod';



3



4

// Define a subagent for research tasks



5

const researchSubagent = new ToolLoopAgent({



6

model: "xai/grok-4.6",



7

instructions: `You are a research agent.



8

Summarize your findings in your final response.`,



9

tools: {



10

read: readFileTool, // defined elsewhere



11

search: searchTool, // defined elsewhere



12

},



13

});



14



15

// Create a tool that delegates to the subagent



16

const researchTool = tool({



17

description: 'Research a topic or question in depth.',



18

inputSchema: z.object({



19

task: z.string().describe('The research task to complete'),



20

}),



21

execute: async ({ task }, { abortSignal }) => {



22

const result = await researchSubagent.generate({



23

prompt: task,



24

abortSignal,



25

});



26

return result.text;



27

},



28

});



29



30

// Main agent uses the research tool



31

const mainAgent = new ToolLoopAgent({



32

model: "xai/grok-4.6",



33

instructions: 'You are a helpful assistant that can delegate research tasks.',



34

tools: {



35

research: researchTool,



36

},



37

});
```

This works well when you don't need to show the subagent's progress in the UI. The tool call blocks until the subagent completes, then returns the final text response.

### [Handling Cancellation](#handling-cancellation)

When the user cancels a request, the `abortSignal` propagates to the subagent. Always pass it through to ensure cleanup:

```
1

execute: async ({ task }, { abortSignal }) => {



2

const result = await researchSubagent.generate({



3

prompt: task,



4

abortSignal, // Cancels subagent if main request is aborted



5

});



6

return result.text;



7

},
```

If you abort the signal, the subagent stops executing and throws an `AbortError`. The main agent's tool execution fails, which stops the main loop.

To avoid errors about incomplete tool calls in subsequent messages, use `convertToModelMessages` with `ignoreIncompleteToolCalls`:

```
1

import { convertToModelMessages } from 'ai';



2



3

const modelMessages = await convertToModelMessages(messages, {



4

ignoreIncompleteToolCalls: true,



5

});
```

This filters out tool calls that don't have corresponding results. Learn more in the [convertToModelMessages](/docs/reference/ai-sdk-ui/convert-to-model-messages) reference.

[Streaming Subagent Progress](#streaming-subagent-progress)
-----------------------------------------------------------

When you want to show incremental progress as the subagent works, use [**preliminary tool results**](/docs/ai-sdk-core/tools-and-tool-calling#preliminary-tool-results). This pattern uses a generator function that yields partial updates to the UI.

### [How Preliminary Tool Results Work](#how-preliminary-tool-results-work)

Change your `execute` function from a regular function to an async generator (`async function*`). Each `yield` sends a preliminary result to the frontend:

```
1

execute: async function* ({ /* input */ }) {



2

// ... do work ...



3

yield partialResult;



4

// ... do more work ...



5

yield updatedResult;



6

}
```

### [Building the Complete Message](#building-the-complete-message)

Each `yield` **replaces** the previous output entirely (it does not append). This means you need a way to accumulate the subagent's response into a complete message that grows over time.

The `readUIMessageStream` utility handles this. It reads each chunk from the stream and builds an ever-growing `UIMessage` containing all parts received so far:

```
1

import { readUIMessageStream, toUIMessageStream, tool } from 'ai';



2

import { z } from 'zod';



3



4

const researchTool = tool({



5

description: 'Research a topic or question in depth.',



6

inputSchema: z.object({



7

task: z.string().describe('The research task to complete'),



8

}),



9

execute: async function* ({ task }, { abortSignal }) {



10

// Start the subagent with streaming



11

const result = await researchSubagent.stream({



12

prompt: task,



13

abortSignal,



14

});



15



16

// Each iteration yields a complete, accumulated UIMessage



17

for await (const message of readUIMessageStream({



18

stream: toUIMessageStream({ stream: result.stream }),



19

})) {



20

yield message;



21

}



22

},



23

});
```

Each yielded `message` is a complete `UIMessage` containing all the subagent's parts up to that point (text, tool calls, and tool results). The frontend simply replaces its display with each new message.

[Controlling What the Model Sees](#controlling-what-the-model-sees)
-------------------------------------------------------------------

Here's where subagents become powerful for context management. The full `UIMessage` with all the subagent's work is stored in the message history and displayed in the UI. But you can control what the main agent's model actually sees using `toModelOutput`.

### [How It Works](#how-it-works-1)

The `toModelOutput` function maps the tool's output to the tokens sent to the model:

```
1

const researchTool = tool({



2

description: 'Research a topic or question in depth.',



3

inputSchema: z.object({



4

task: z.string().describe('The research task to complete'),



5

}),



6

execute: async function* ({ task }, { abortSignal }) {



7

const result = await researchSubagent.stream({



8

prompt: task,



9

abortSignal,



10

});



11



12

for await (const message of readUIMessageStream({



13

stream: toUIMessageStream({ stream: result.stream }),



14

})) {



15

yield message;



16

}



17

},



18

toModelOutput: ({ output: message }) => {



19

// Extract just the final text as a summary



20

const lastTextPart = message?.parts.findLast(p => p.type === 'text');



21

return {



22

type: 'text',



23

value: lastTextPart?.text ?? 'Task completed.',



24

};



25

},



26

});
```

With this setup:

* **Users see**: The full subagent execution—every tool call, every intermediate step
* **The model sees**: Just the final summary text

The subagent might use 100,000 tokens exploring and reasoning, but the main agent only consumes the summary. This keeps the main agent coherent and focused.

### [Write Subagent Instructions for Summarization](#write-subagent-instructions-for-summarization)

For `toModelOutput` to extract a useful summary, your subagent must produce one. Add explicit instructions like this:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const researchSubagent = new ToolLoopAgent({



2

model: "xai/grok-4.6",



3

instructions: `You are a research agent. Complete the task autonomously.



4



5

IMPORTANT: When you have finished, write a clear summary of your findings as your final response.



6

This summary will be returned to the main agent, so include all relevant information.`,



7

tools: {



8

read: readFileTool,



9

search: searchTool,



10

},



11

});
```

Without this instruction, the subagent might not produce a comprehensive summary. It could simply say "Done", leaving `toModelOutput` with nothing useful to extract.

[Rendering Subagents in the UI (with useChat)](#rendering-subagents-in-the-ui-with-usechat)
-------------------------------------------------------------------------------------------

To display streaming progress, check the tool part's `state` and `preliminary` flag.

### [Tool Part States](#tool-part-states)

| State | Description |
| --- | --- |
| `input-streaming` | Tool input being generated |
| `input-available` | Tool ready to execute |
| `output-available` | Tool produced output (check `preliminary`) |
| `output-error` | Tool execution failed |

### [Detecting Streaming vs Complete](#detecting-streaming-vs-complete)

```
1

const hasOutput = part.state === 'output-available';



2

const isStreaming = hasOutput && part.preliminary === true;



3

const isComplete = hasOutput && !part.preliminary;
```

### [Type Safety for Subagent Output](#type-safety-for-subagent-output)

Export types alongside your agents for use in UI components:

lib/agents.ts

```
1

import { ToolLoopAgent, InferAgentUIMessage } from 'ai';



2



3

export const mainAgent = new ToolLoopAgent({



4

// ... configuration with researchTool



5

});



6



7

// Export the main agent message type for the chat UI



8

export type MainAgentMessage = InferAgentUIMessage<typeof mainAgent>;
```

### [Render Messages and Subagent Output](#render-messages-and-subagent-output)

This example uses the types defined above to render both the main agent's messages and the subagent's streamed output:

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import type { MainAgentMessage } from '@/lib/agents';



5



6

export function Chat() {



7

const { messages } = useChat<MainAgentMessage>();



8



9

return (



10

<div>



11

{messages.map(message =>



12

message.parts.map((part, i) => {



13

switch (part.type) {



14

case 'text':



15

return <p key={i}>{part.text}</p>;



16

case 'tool-research':



17

return (



18

<div>



19

{part.state !== 'input-streaming' && (



20

<div>Research: {part.input.task}</div>



21

)}



22

{part.state === 'output-available' && (



23

<div>



24

{part.output.parts.map((nestedPart, i) => {



25

switch (nestedPart.type) {



26

case 'text':



27

return <p key={i}>{nestedPart.text}</p>;



28

default:



29

return null;



30

}



31

})}



32

</div>



33

)}



34

</div>



35

);



36

default:



37

return null;



38

}



39

}),



40

)}



41

</div>



42

);



43

}
```

[Caveats](#caveats)
-------------------

### [No Tool Approvals in Subagents](#no-tool-approvals-in-subagents)

Subagent tools cannot use approval flows such as `toolApproval` (or the
deprecated `needsApproval`). All tools must execute automatically without user
confirmation.

### [Subagent Context is Isolated](#subagent-context-is-isolated)

Each subagent invocation starts with a fresh context window. This is one of the key benefits of subagents: they don't inherit the accumulated context from the main agent, which is exactly what allows them to do heavy exploration without bloating the main conversation.

If you need to give a subagent access to the conversation history, the `messages` are available in the tool's execute function alongside `abortSignal`:

```
1

execute: async ({ task }, { abortSignal, messages }) => {



2

const result = await researchSubagent.generate({



3

messages: [



4

...messages, // The main agent's conversation history



5

{ role: 'user', content: task }, // The specific task for this invocation



6

],



7

abortSignal,



8

});



9

return result.text;



10

},
```

Use this sparingly since passing full history defeats some of the context isolation benefits.

### [Streaming Adds Complexity](#streaming-adds-complexity)

The basic pattern (no streaming) is simpler to implement and debug. Only add streaming when you need to show real-time progress in the UI.

[Previous

Policy-Based Tool Approvals](/docs/agents/policy-tool-approvals)[Next

Tool Approvals](/docs/agents/tool-approvals)
