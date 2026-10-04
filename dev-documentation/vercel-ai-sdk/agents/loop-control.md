---
title: "Loop Control"
source_url: https://ai-sdk.dev/docs/agents/loop-control
section: agents
crawled: 2026-09-20
---

# Loop Control

> Source: https://ai-sdk.dev/docs/agents/loop-control

[Agents](/docs/agents)Loop Control


[Loop Control](#loop-control)
=============================

You can control both the execution flow and the settings at each step of the agent loop. The loop continues until:

* A finish reasoning other than tool-calls is returned, or
* A tool that is invoked does not have an execute function, or
* A tool call needs approval, or
* A stop condition is met

The AI SDK provides built-in loop control through two parameters: `stopWhen` for defining stopping conditions and `prepareStep` for modifying settings (model, tools, messages, and more) between steps.

[Stop Conditions](#stop-conditions)
-----------------------------------

The `stopWhen` parameter controls when to stop execution when there are tool results in the last step. By default, `ToolLoopAgent` stops after 20 steps using `isStepCount(20)`. This default is a safety measure to prevent runaway loops that could result in excessive API calls and costs.

`WorkflowAgent` does not apply a default step limit. It continues until the model stops calling tools or another natural termination condition is met. Configure an explicit condition such as `isStepCount(20)` when you need to bound its model calls. See [WorkflowAgent Loop Control](/docs/agents/workflow-agent#loop-control) for details.

When you provide `stopWhen`, the agent continues executing after tool calls until a stopping condition is met. When the condition is an array, execution stops when any of the conditions are met.

### [Use Built-in Conditions](#use-built-in-conditions)

The AI SDK provides several built-in stopping conditions:

* `isStepCount(count)` — stops after a specified number of steps
* `hasToolCall(...toolNames)` — stops when any of the specified tools is called
* `isLoopFinished()` — never triggers, letting the loop run until the agent is naturally finished

### [Run Up to a Maximum Number of Steps](#run-up-to-a-maximum-number-of-steps)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, isStepCount } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

tools: {



6

// your tools



7

},



8

stopWhen: isStepCount(50), // Increase ToolLoopAgent's default from 20 to 50.



9

});



10



11

const result = await agent.generate({



12

prompt: 'Analyze this dataset and create a summary report',



13

});
```

### [Run Until Finished](#run-until-finished)

If you want a `ToolLoopAgent` to run until the model naturally stops making tool calls, use `isLoopFinished()`. This removes its default step limit:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, isLoopFinished } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

tools: {



6

// your tools



7

},



8

stopWhen: isLoopFinished(), // No maximum step limit.



9

});



10



11

const result = await agent.generate({



12

prompt: 'Analyze this dataset and create a summary report',



13

});
```

Use `isLoopFinished()` with caution. Without a step limit, the agent could
potentially run indefinitely or incur significant costs if the model keeps
making tool calls.

### [Combine Multiple Conditions](#combine-multiple-conditions)

Combine multiple stopping conditions. The loop stops when it meets any condition:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, isStepCount, hasToolCall } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

tools: {



6

// your tools



7

},



8

stopWhen: [



9

isStepCount(20), // Maximum 20 steps



10

hasToolCall('someTool', 'done'), // Stop after calling either tool



11

],



12

});



13



14

const result = await agent.generate({



15

prompt: 'Research and analyze the topic',



16

});
```

### [Create Custom Conditions](#create-custom-conditions)

Build custom stopping conditions for specific requirements:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, StopCondition, ToolSet } from 'ai';



2



3

const tools = {



4

// your tools



5

} satisfies ToolSet;



6



7

const hasAnswer: StopCondition<typeof tools> = ({ steps }) => {



8

// Stop when the model generates text containing "ANSWER:"



9

return steps.some(step => step.text?.includes('ANSWER:')) ?? false;



10

};



11



12

const agent = new ToolLoopAgent({



13

model: "xai/grok-4.6",



14

tools,



15

stopWhen: hasAnswer,



16

});



17



18

const result = await agent.generate({



19

prompt: 'Find the answer and respond with "ANSWER: [your answer]"',



20

});
```

Custom conditions receive step information across all steps:

```
1

const budgetExceeded: StopCondition<typeof tools> = ({ steps }) => {



2

const totalUsage = steps.reduce(



3

(acc, step) => ({



4

inputTokens: acc.inputTokens + (step.usage?.inputTokens ?? 0),



5

outputTokens: acc.outputTokens + (step.usage?.outputTokens ?? 0),



6

}),



7

{ inputTokens: 0, outputTokens: 0 },



8

);



9



10

const costEstimate =



11

(totalUsage.inputTokens * 0.01 + totalUsage.outputTokens * 0.03) / 1000;



12

return costEstimate > 0.5; // Stop if cost exceeds $0.50



13

};
```

[Prepare Step](#prepare-step)
-----------------------------

The `prepareStep` callback runs before each step in the loop and defaults to the initial settings if you don't return any changes. Use it to modify settings, manage context, or implement dynamic behavior based on execution history.

It receives `messages` for the current step, plus `initialMessages` and `responseMessages` when you need to distinguish the original input from assistant/tool messages accumulated in earlier steps. Treat `messages` as the loop's current message state: if you return a `messages` override, that override persists as the base for later steps, together with the response messages from each completed step.

### [Dynamic Model Selection](#dynamic-model-selection)

Switch models based on step requirements:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: 'openai/gpt-4o-mini', // Default model



5

tools: {



6

// your tools



7

},



8

prepareStep: async ({ stepNumber, messages }) => {



9

// Use a stronger model for complex reasoning after initial steps



10

if (stepNumber > 2 && messages.length > 10) {



11

return {



12

model: "xai/grok-4.6",



13

};



14

}



15

// Continue with default settings



16

return {};



17

},



18

});



19



20

const result = await agent.generate({



21

prompt: '...',



22

});
```

### [Model Call Settings](#model-call-settings)

Override provider-agnostic model call settings for an individual step. This can
be useful when tool-calling steps need more deterministic sampling than the
final response:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

temperature: 0.7,



6

tools: {



7

// your tools



8

},



9

prepareStep: async ({ stepNumber }) => {



10

if (stepNumber === 0) {



11

return {



12

temperature: 0,



13

maxOutputTokens: 300,



14

};



15

}



16



17

return {};



18

},



19

});



20



21

const result = await agent.generate({



22

prompt: '...',



23

});
```

`prepareStep` can override `maxOutputTokens`, `temperature`, `topP`, `topK`,
`presencePenalty`, `frequencyPenalty`, `stopSequences`, `seed`, and
`reasoning`. These overrides apply only to the current step. When a setting is
omitted or `undefined`, the top-level value is used for that step. Defined
falsy values such as `temperature: 0`, `seed: 0`, and an empty
`stopSequences` array are preserved.

### [Context Management](#context-management)

Long-running agents can accumulate large tool results, reasoning parts, and assistant messages. Use `prepareStep` to mutate the message state that will be used by later steps. This is useful for compaction, and you decide when compaction should happen.

The `messages` value contains the messages that will be sent for the current step. When you return a `messages` override from `prepareStep`, that changed list becomes the base for later steps. New assistant and tool response messages are appended to it as the loop continues. If you need to rebuild a step from the discrete pieces instead of the persisted message state, use `initialMessages` for the original input and `responseMessages` for the model/tool response messages accumulated so far.

The `pruneMessages` helper provides a built-in way to remove selected messages. You can use it inside `prepareStep` when you want a simple compaction strategy.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, pruneMessages, type ModelMessage } from 'ai';



2



3

const COMPACTION_THRESHOLD = 100_000;



4



5

const estimateTokens = (messages: ModelMessage[]) => {



6

return JSON.stringify(messages).length / 4;



7

};



8



9

const agent = new ToolLoopAgent({



10

model: "xai/grok-4.6",



11

tools: {



12

// your tools



13

},



14

prepareStep: async ({ messages }) => {



15

if (estimateTokens(messages) > COMPACTION_THRESHOLD) {



16

return {



17

messages: pruneMessages({



18

messages,



19

reasoning: 'all',



20

toolCalls: 'before-last-3-messages',



21

emptyMessages: 'remove',



22

}),



23

};



24

}



25

},



26

});



27



28

const result = await agent.generate({



29

prompt: '...',



30

});
```

The token estimator above is intentionally simple and only demonstrates one way to decide when to compact. The main point is that `prepareStep` can return a new `messages` array, and that array becomes the message state for following steps. The same pattern also works with `generateText` and `streamText`.

### [Tool Selection](#tool-selection)

Control which tools are available at each step:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

tools: {



6

search: searchTool,



7

analyze: analyzeTool,



8

summarize: summarizeTool,



9

},



10

prepareStep: async ({ stepNumber, steps }) => {



11

// Search phase (steps 0-2)



12

if (stepNumber <= 2) {



13

return {



14

activeTools: ['search'],



15

toolChoice: 'required',



16

};



17

}



18



19

// Analysis phase (steps 3-5)



20

if (stepNumber <= 5) {



21

return {



22

activeTools: ['analyze'],



23

};



24

}



25



26

// Summary phase (step 6+)



27

return {



28

activeTools: ['summarize'],



29

toolChoice: 'required',



30

};



31

},



32

});



33



34

const result = await agent.generate({



35

prompt: '...',



36

});
```

You can also force a specific tool to be used:

```
1

prepareStep: async ({ stepNumber }) => {



2

if (stepNumber === 0) {



3

// Force the search tool to be used first



4

return {



5

toolChoice: { type: 'tool', toolName: 'search' },



6

};



7

}



8



9

if (stepNumber === 5) {



10

// Force the summarize tool after analysis



11

return {



12

toolChoice: { type: 'tool', toolName: 'summarize' },



13

};



14

}



15



16

return {};



17

};
```

### [Message Modification](#message-modification)

Transform messages before sending them to the model. Returned messages carry forward to later steps, so later `messages` values include your transformed messages plus the assistant/tool response messages from completed steps:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

tools: {



6

// your tools



7

},



8

prepareStep: async ({ messages, stepNumber }) => {



9

// Summarize tool results to reduce token usage



10

const processedMessages = messages.map(msg => {



11

if (msg.role === 'tool' && msg.content.length > 1000) {



12

return {



13

...msg,



14

content: summarizeToolResult(msg.content),



15

};



16

}



17

return msg;



18

});



19



20

return { messages: processedMessages };



21

},



22

});



23



24

const result = await agent.generate({



25

prompt: '...',



26

});
```

### [Experimental Sandbox Selection](#experimental-sandbox-selection)

Switch the experimental sandbox used for tool execution in a single step:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent } from 'ai';



2



3

const agent = new ToolLoopAgent({



4

model: "xai/grok-4.6",



5

tools: {



6

runCommand,



7

},



8

experimental_sandbox: defaultSandbox,



9

prepareStep: async ({ stepNumber }) => {



10

if (stepNumber === 0) {



11

return {



12

experimental_sandbox: setupSandbox,



13

};



14

}



15



16

return {};



17

},



18

});



19



20

const result = await agent.generate({



21

prompt: '...',



22

});
```

Unlike `runtimeContext` and `toolsContext`, an experimental sandbox returned from `prepareStep`
only applies to tool execution in that step. Later steps use the top-level
`experimental_sandbox` unless they return their own experimental sandbox override.

[Access Step Information](#access-step-information)
---------------------------------------------------

Both `stopWhen` and `prepareStep` receive detailed information about the current execution:

```
1

prepareStep: async ({



2

model, // Current model configuration



3

stepNumber, // Current step number (0-indexed)



4

steps, // All previous steps with their results



5

messages, // Messages to be sent to the model



6

}) => {



7

// Access previous tool calls and results



8

const previousToolCalls = steps.flatMap(step => step.toolCalls);



9

const previousResults = steps.flatMap(step => step.toolResults);



10



11

// Make decisions based on execution history



12

if (previousToolCalls.some(call => call.toolName === 'dataAnalysis')) {



13

return {



14

toolChoice: { type: 'tool', toolName: 'reportGenerator' },



15

};



16

}



17



18

return {};



19

},
```

[Forced Tool Calling](#forced-tool-calling)
-------------------------------------------

You can force the agent to always use tools by combining `toolChoice: 'required'` with a `done` tool that has no `execute` function. This pattern ensures the agent uses tools for every step and stops only when it explicitly signals completion.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, tool } from 'ai';



2

import { z } from 'zod';



3



4

const agent = new ToolLoopAgent({



5

model: "xai/grok-4.6",



6

tools: {



7

search: searchTool,



8

analyze: analyzeTool,



9

done: tool({



10

description: 'Signal that you have finished your work',



11

inputSchema: z.object({



12

answer: z.string().describe('The final answer'),



13

}),



14

// No execute function - stops the agent when called



15

}),



16

},



17

toolChoice: 'required', // Force tool calls at every step



18

});



19



20

const result = await agent.generate({



21

prompt: 'Research and analyze this topic, then provide your answer.',



22

});



23



24

// extract answer from done tool call



25

const toolCall = result.staticToolCalls[0]; // tool call from final step



26

if (toolCall?.toolName === 'done') {



27

console.log(toolCall.input.answer);



28

}
```

Key aspects of this pattern:

* **`toolChoice: 'required'`**: Forces the model to call a tool at every step instead of generating text directly. This ensures the agent follows a structured workflow.
* **`done` tool without `execute`**: A tool that has no `execute` function acts as a termination signal. When the agent calls this tool, the loop stops because there's no function to execute.
* **Accessing results**: The final answer is available in `result.staticToolCalls`, which contains tool calls that weren't executed.

This pattern is useful when you want the agent to always use specific tools for operations (like code execution or data retrieval) rather than attempting to answer directly.

[Manual Loop Control](#manual-loop-control)
-------------------------------------------

For scenarios requiring complete control over the agent loop, you can use AI SDK Core functions (`generateText` and `streamText`) to implement your own loop management instead of using `stopWhen` and `prepareStep`. This approach provides maximum flexibility for complex workflows.

### [Implementing a Manual Loop](#implementing-a-manual-loop)

Build your own agent loop when you need full control over execution:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, ModelMessage } from 'ai';



2



3

const messages: ModelMessage[] = [{ role: 'user', content: '...' }];



4



5

let step = 0;



6

const maxSteps = 10;



7



8

while (step < maxSteps) {



9

const result = await generateText({



10

model: "xai/grok-4.6",



11

messages,



12

tools: {



13

// your tools here



14

},



15

});



16



17

messages.push(...result.responseMessages);



18



19

if (result.text) {



20

break; // Stop when model generates text



21

}



22



23

step++;



24

}
```

This manual approach gives you complete control over:

* Message history management
* Step-by-step decision making
* Custom stopping conditions
* Dynamic tool and model selection
* Error handling and recovery

[Learn more about manual agent loops in the cookbook](/cookbook/node/manual-agent-loop).

[Previous

Workflow Patterns](/docs/agents/workflows)[Next

Configuring Call Options](/docs/agents/configuring-call-options)
