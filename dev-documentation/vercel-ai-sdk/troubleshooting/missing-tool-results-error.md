---
title: "Missing Tool Results Error"
source_url: https://ai-sdk.dev/docs/troubleshooting/missing-tool-results-error
section: troubleshooting
crawled: 2026-09-20
---

# Missing Tool Results Error

> Source: https://ai-sdk.dev/docs/troubleshooting/missing-tool-results-error

[Troubleshooting](/docs/troubleshooting)Missing Tool Results Error


[Missing Tool Results Error](#missing-tool-results-error)
=========================================================

[Issue](#issue)
---------------

You encounter the error `AI_MissingToolResultsError` with a message like:

> Tool results are missing for tool calls: ...

[Cause](#cause)
---------------

This error occurs when you attempt to send a new message to the Large Language Model (LLM) while there are pending tool calls from a previous turn that have not yet been resolved.

The AI SDK core logic validates that all `tool-call` parts in the conversation history are resolved before proceeding. "Resolved" typically means:

1. The tool has been executed and a `tool-result` has been added to the history.
2. Or, the tool call has triggered a `tool-approval-response` (if using tool approvals).

If a tool call is found without a corresponding result or approval response, this error is thrown to prevent sending an invalid conversation history to the model.

[Solution](#solution)
---------------------

Ensure that every tool call in your conversation history is properly handled.

### [1. Provide Tool Results](#1-provide-tool-results)

For standard tool calls, ensure that you provide the output of the tool execution.

```
1

const messages = [



2

{ role: 'user', content: 'What is the weather in NY?' },



3

{



4

role: 'assistant',



5

content: [



6

{



7

type: 'tool-call',



8

toolCallId: 'call_123',



9

toolName: 'getWeather',



10

args: { location: 'New York' },



11

},



12

],



13

},



14

// You MUST include this tool message with the result:



15

{



16

role: 'tool',



17

content: [



18

{



19

type: 'tool-result',



20

toolCallId: 'call_123',



21

toolName: 'getWeather',



22

result: 'Sunny, 25°C',



23

},



24

],



25

},



26

// Now you can add a new user message



27

{ role: 'user', content: 'And in London?' },



28

];
```

### [2. Handle Tool Approvals](#2-handle-tool-approvals)

If you are using the tool approval workflow, ensure that you include the `tool-approval-response`.

```
1

const messages = [



2

// ... assistant requests tool execution (needs approval)



3

{



4

role: 'tool',



5

content: [



6

{



7

type: 'tool-approval-response',



8

approvalId: 'approval_123',



9

approved: true, // or false



10

},



11

],



12

},



13

];
```

[Previous

Object generation failed with OpenAI](/docs/troubleshooting/no-object-generated-content-filter)[Next

Model is not assignable to type "LanguageModelV1"](/docs/troubleshooting/model-is-not-assignable-to-type)
