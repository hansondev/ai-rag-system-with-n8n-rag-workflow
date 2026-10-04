---
title: "Generating and Streaming Text"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/generating-text
section: ai-sdk-core
crawled: 2026-09-20
---

# Generating and Streaming Text

> Source: https://ai-sdk.dev/docs/ai-sdk-core/generating-text

[AI SDK Core](/docs/ai-sdk-core)Generating Text


[Generating and Streaming Text](#generating-and-streaming-text)
===============================================================

Large language models (LLMs) can generate text in response to a prompt, which can contain instructions and information to process.
For example, you can ask a model to come up with a recipe, draft an email, or summarize a document.

The AI SDK Core provides two functions to generate text and stream it from LLMs:

* [`generateText`](#generatetext): Generates text for a given prompt and model.
* [`streamText`](#streamtext): Streams text from a given prompt and model.

Advanced LLM features such as [tool calling](./tools-and-tool-calling) and [structured data generation](./generating-structured-data) are built on top of text generation.

[`generateText`](#generatetext)
-------------------------------

You can generate text using the [`generateText`](/docs/reference/ai-sdk-core/generate-text) function. This function is ideal for non-interactive use cases where you need to write text (e.g. drafting email or summarizing web pages) and for agents that use tools.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText } from 'ai';



2



3

const { text } = await generateText({



4

model: "xai/grok-4.6",



5

prompt: 'Write a vegetarian lasagna recipe for 4 people.',



6

});
```

You can use more [advanced prompts](/docs/foundations/prompts) to generate text with more complex instructions and content:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText } from 'ai';



2



3

const { text } = await generateText({



4

model: "xai/grok-4.6",



5

instructions:



6

'You are a professional writer. ' +



7

'You write simple, clear, and concise content.',



8

prompt: `Summarize the following article in 3-5 sentences: ${article}`,



9

});
```

The result object of `generateText` contains the generated output and metadata:

* `result.content`: The content that was generated in all steps.
* `result.text`: The generated text from the final step.
* `result.files`: The files that were generated in all steps.
* `result.sources`: Sources that have been used as references in all steps (only available for some models).
* `result.toolCalls`: The tool calls that were made in all steps.
* `result.toolResults`: The results of the tool calls from all steps.
* `result.finishReason`: The reason the model finished generating text.
* `result.rawFinishReason`: The raw reason why the generation finished (from the provider).
* `result.usage`: The total usage across all steps (for multi-step generations).
* `result.warnings`: Warnings from the model provider in all steps (e.g. unsupported settings).
* `result.steps`: Details for all steps, useful for getting information about intermediate steps, including per-step `performance`.
* `result.finalStep`: Details for the final step, including `performance`.
* `result.output`: The generated structured output using the `output` specification.

Each step includes `performance` with timing and throughput information:

* `effectiveOutputTokensPerSecond`: Effective output tokens per second, calculated as `outputTokens / requestSeconds`.
* `outputTokensPerSecond`: For streaming steps, output tokens per second after the first generated output chunk, calculated as `outputTokens / outputStreamSeconds`. For `generateText`, this is `undefined`.
* `inputTokensPerSecond`: For streaming steps, input tokens per second before the first generated output chunk, calculated as `inputTokens / ttftSeconds`. For `generateText`, this is `undefined`.
* `effectiveTotalTokensPerSecond`: Effective total tokens per second, calculated as `(inputTokens + outputTokens) / requestSeconds`.
* `stepTimeMs`: Total time spent on the step, including language model response time and tool execution time, in milliseconds.
* `responseTimeMs`: Time spent waiting for the language model response in milliseconds.
* `toolExecutionMs`: Time spent executing each client-side tool call in the step in milliseconds, keyed by tool call ID.
* `timeToFirstOutputMs`: For streaming steps, the time until the first generated output chunk was received in milliseconds. For `generateText`, this is `undefined`.
* `timeBetweenOutputChunksMs`: For streaming steps with at least two output chunks, timing statistics for the gaps between generated output chunks in milliseconds.

### [Accessing response headers & body](#accessing-response-headers--body)

Sometimes you need access to the full response from the model provider,
e.g. to access some provider-specific headers or body content.

You can access the raw response headers and body using the `finalStep.response` property:

```
1

import { generateText } from 'ai';



2



3

const result = await generateText({



4

// ...



5

});



6



7

console.log(JSON.stringify(result.finalStep.response.headers, null, 2));



8

console.log(JSON.stringify(result.finalStep.response.body, null, 2));
```

### [`onEnd` callback](#onend-callback)

When using `generateText`, you can provide an `onEnd` callback that is triggered after the last step is finished (
[API Reference](/docs/reference/ai-sdk-core/generate-text#on-end)
).
It contains the text, usage information, finish reason, messages, steps, total usage, and more:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText } from 'ai';



2



3

const result = await generateText({



4

model: "xai/grok-4.6",



5

prompt: 'Invent a new holiday and describe its traditions.',



6

onEnd({ text, finishReason, usage, responseMessages, steps, totalUsage }) {



7

// your own logic, e.g. for saving the chat history or recording usage



8



9

const messages = responseMessages; // messages that were generated



10

},



11

});
```

### [Lifecycle callbacks (experimental)](#lifecycle-callbacks-experimental)

Experimental callbacks are subject to breaking changes in incremental package
releases.

`generateText` provides several experimental lifecycle callbacks that let you hook into different phases of the generation process.
These are useful for logging, observability, debugging, and custom telemetry.
Errors thrown inside these callbacks are silently caught and do not break the generation flow.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText } from 'ai';



2



3

const result = await generateText({



4

model: "xai/grok-4.6",



5

prompt: 'What is the weather in San Francisco?',



6

tools: {



7

// ... your tools



8

},



9



10

onStart({ modelId }) {



11

console.log('Generation started', { modelId });



12

},



13



14

onStepStart({ stepNumber, modelId, messages }) {



15

console.log(`Step ${stepNumber} starting`, { modelId });



16

},



17



18

onLanguageModelCallStart({ modelId, messages }) {



19

console.log('Model call starting', {



20

modelId,



21

messageCount: messages.length,



22

});



23

},



24



25

onLanguageModelCallEnd({ modelId, finishReason, content }) {



26

console.log('Model call finished', {



27

modelId,



28

finishReason,



29

contentParts: content.length,



30

});



31

},



32



33

onToolExecutionStart({ toolCall }) {



34

console.log(`Tool call starting: ${toolCall.toolName}`, {



35

toolCallId: toolCall.toolCallId,



36

});



37

},



38



39

onToolExecutionEnd({ toolCall, toolExecutionMs, toolOutput }) {



40

console.log(



41

`Tool call finished: ${toolCall.toolName} (${toolExecutionMs}ms)`,



42

{



43

success: toolOutput.type === 'tool-result',



44

},



45

);



46

},



47



48

onStepEnd({ stepNumber, finishReason, usage, performance }) {



49

console.log(`Step ${stepNumber} finished`, {



50

finishReason,



51

usage,



52

performance,



53

});



54

},



55

});
```

The available lifecycle callbacks are:

* **`onStart`**: Called once when the `generateText` operation begins, before any LLM calls. Receives model info, messages, settings, and `runtimeContext`.
* **`onStepStart`**: Called before each step (LLM call). Receives the step number, model, messages being sent, tools, and prior steps.
* **`onLanguageModelCallStart`**: Called immediately before the provider model call begins. Useful when you want to observe the model invocation separately from later tool execution.
* **`onLanguageModelCallEnd`**: Called after the model response has been normalized and parsed, but before any client-side tool execution begins. Receives the model-call content parts, usage, finish reason, and provider metadata.
* **`onToolExecutionStart`**: Called right before a tool's `execute` function runs. Receives the tool call object, messages, and `toolContext`.
* **`onToolExecutionEnd`**: Called right after a tool's `execute` function completes or errors. Receives the tool call object, `toolExecutionMs`, and a `toolOutput` discriminated union (`type: 'tool-result'` with `output`, or `type: 'tool-error'` with `error`).
* **`onStepEnd`**: Called after each step finishes. Includes `stepNumber` (zero-based index of the completed step).

[`streamText`](#streamtext)
---------------------------

Depending on your model and prompt, it can take a large language model (LLM) up to a minute to finish generating its response. This delay can be unacceptable for interactive use cases such as chatbots or real-time applications, where users expect immediate responses.

AI SDK Core provides the [`streamText`](/docs/reference/ai-sdk-core/stream-text) function which simplifies streaming text from LLMs:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { streamText } from 'ai';



2



3

const result = streamText({



4

model: "xai/grok-4.6",



5

prompt: 'Invent a new holiday and describe its traditions.',



6

});



7



8

// example: use textStream as an async iterable



9

for await (const textPart of result.textStream) {



10

console.log(textPart);



11

}
```

`result.textStream` is both a `ReadableStream` and an `AsyncIterable`.

`streamText` immediately starts streaming and suppresses errors to prevent
server crashes. Use the `onError` callback to log errors.

You can use `streamText` on its own or in combination with [AI SDK
UI](/examples/next-pages/basics/streaming-text-generation) and [AI SDK
RSC](/examples/next-app/basics/streaming-text-generation).
The `result.stream` can be passed to several standalone helpers to make the integration into [AI SDK UI](/docs/ai-sdk-ui) easier:

* `createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) })`: Creates a UI Message stream HTTP response (with tool calls etc.) that can be used in a Next.js App Router API route.
* `pipeUIMessageStreamToResponse({ stream: toUIMessageStream({ stream: result.stream }), response })`: Writes UI Message stream delta output to a Node.js response-like object.
* `createTextStreamResponse({ stream: toTextStream({ stream: result.stream }) })`: Creates a simple text stream HTTP response.
* `pipeTextStreamToResponse({ stream: toTextStream({ stream: result.stream }), response })`: Writes text delta output to a Node.js response-like object.

`streamText` is using backpressure and only generates tokens as they are
requested. You need to consume the stream in order for it to finish.

It also provides several promises that resolve when the stream is finished:

* `result.content`: The content that was generated in all steps.
* `result.text`: The generated text from the final step.
* `result.finalStep`: Details for the final step, including per-step `performance`.
* `result.files`: Files that have been generated by the model in all steps.
* `result.sources`: Sources that have been used as references in all steps (only available for some models).
* `result.toolCalls`: The tool calls that have been executed in all steps.
* `result.toolResults`: The tool results that have been generated in all steps.
* `result.finishReason`: The reason the model finished generating text.
* `result.rawFinishReason`: The raw reason why the generation finished (from the provider).
* `result.usage`: The total usage across all steps (for multi-step generations).
* `result.totalUsage`: Deprecated. Use `result.usage` instead.
* `result.warnings`: Warnings from the model provider in all steps (e.g. unsupported settings).
* `result.steps`: Details for all steps, useful for getting information about intermediate steps, including per-step `performance`.

For `streamText`, `timeToFirstOutputMs` is set when the first generated output chunk is received for a step. `timeBetweenOutputChunksMs` includes `min`, `p10`, `median`, `avg`, `p90`, and `max` when at least two output chunks are received.

### [`onError` callback](#onerror-callback)

`streamText` immediately starts streaming to enable sending data without waiting for the model.
Errors become part of the stream and are not thrown to prevent e.g. servers from crashing.

To log errors, you can provide an `onError` callback that is triggered when an error occurs.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { streamText } from 'ai';



2



3

const result = streamText({



4

model: "xai/grok-4.6",



5

prompt: 'Invent a new holiday and describe its traditions.',



6

onError({ error }) {



7

console.error(error); // your error logging logic here



8

},



9

});
```

### [`onChunk` callback](#onchunk-callback)

When using `streamText`, you can provide an `onChunk` callback that is triggered for each chunk of the stream.

It receives all stream part types from `stream`, including:

* `start`
* `start-step`
* `text-start`
* `text-delta`
* `text-end`
* `reasoning-start`
* `reasoning-delta`
* `reasoning-end`
* `custom`
* `source`
* `file`
* `reasoning-file`
* `tool-call`
* `tool-input-start`
* `tool-input-delta`
* `tool-input-end`
* `tool-result`
* `tool-error`
* `tool-output-denied`
* `tool-approval-request`
* `tool-approval-response`
* `finish-step`
* `finish`
* `abort`
* `error`
* `raw`

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { streamText } from 'ai';



2



3

const result = streamText({



4

model: "xai/grok-4.6",



5

prompt: 'Invent a new holiday and describe its traditions.',



6

onChunk({ chunk }) {



7

// implement your own logic here, e.g.:



8

if (chunk.type === 'text-delta') {



9

console.log(chunk.text);



10

}



11

},



12

});
```

### [`onEnd` callback](#onend-callback-1)

When using `streamText`, you can provide an `onEnd` callback that is triggered when the stream is finished (
[API Reference](/docs/reference/ai-sdk-core/stream-text#on-end)
).
It contains the text, usage information, finish reason, messages, steps, total usage, and more:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { streamText } from 'ai';



2



3

const result = streamText({



4

model: "xai/grok-4.6",



5

prompt: 'Invent a new holiday and describe its traditions.',



6

onEnd({ text, finishReason, usage, responseMessages, steps, totalUsage }) {



7

// your own logic, e.g. for saving the chat history or recording usage



8



9

const messages = responseMessages; // messages that were generated



10

},



11

});
```

### [Lifecycle callbacks (experimental)](#lifecycle-callbacks-experimental-1)

Experimental callbacks are subject to breaking changes in incremental package
releases.

`streamText` provides several experimental lifecycle callbacks that let you hook into different phases of the streaming process.
These are useful for logging, observability, debugging, and custom telemetry.
Errors thrown inside these callbacks are silently caught and do not break the streaming flow.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { streamText } from 'ai';



2



3

const result = streamText({



4

model: "xai/grok-4.6",



5

prompt: 'What is the weather in San Francisco?',



6

tools: {



7

// ... your tools



8

},



9



10

onStart({ modelId, instructions, messages }) {



11

console.log('Streaming started', { modelId });



12

},



13



14

onStepStart({ stepNumber, modelId, messages }) {



15

console.log(`Step ${stepNumber} starting`, { modelId });



16

},



17



18

onLanguageModelCallStart({ modelId, messages }) {



19

console.log('Model call starting', {



20

modelId,



21

messageCount: messages.length,



22

});



23

},



24



25

onLanguageModelCallEnd({ modelId, finishReason, content }) {



26

console.log('Model call finished', {



27

modelId,



28

finishReason,



29

contentParts: content.length,



30

});



31

},



32



33

onToolExecutionStart({ toolCall }) {



34

console.log(`Tool call starting: ${toolCall.toolName}`, {



35

toolCallId: toolCall.toolCallId,



36

});



37

},



38



39

onToolExecutionEnd({ toolCall, toolExecutionMs, toolOutput }) {



40

console.log(



41

`Tool call finished: ${toolCall.toolName} (${toolExecutionMs}ms)`,



42

{



43

success: toolOutput.type === 'tool-result',



44

},



45

);



46

},



47



48

onStepEnd({ finishReason, usage }) {



49

console.log('Step finished', { finishReason, usage });



50

},



51

});
```

The available lifecycle callbacks are:

* **`onStart`**: Called once when the `streamText` operation begins, before any LLM calls. Receives model info, messages, settings, and `runtimeContext`.
* **`onStepStart`**: Called before each step (LLM call). Receives the step number, model, messages being sent, tools, and prior steps.
* **`onLanguageModelCallStart`**: Called immediately before the provider model call begins. Useful when you want to observe the model invocation separately from later tool execution.
* **`onLanguageModelCallEnd`**: Called after the model response has been normalized and parsed, but before any client-side tool execution begins. Receives the model-call content parts, usage, finish reason, and provider metadata.
* **`onToolExecutionStart`**: Called right before a tool's `execute` function runs. Receives the tool call object, messages, and `toolContext`.
* **`onToolExecutionEnd`**: Called right after a tool's `execute` function completes or errors. Receives the tool call object, `toolExecutionMs`, and a `toolOutput` discriminated union (`type: 'tool-result'` with `output`, or `type: 'tool-error'` with `error`).
* **`onStepEnd`**: Called after each step finishes. Receives the finish reason, usage, and other step details.

### [`stream` property](#stream-property)

You can read a stream with all events using the `stream` property.
This can be useful if you want to implement your own UI or handle the stream in a different way.
Here is an example of how to use the `stream` property:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { streamText } from 'ai';



2

import { z } from 'zod';



3



4

const result = streamText({



5

model: "xai/grok-4.6",



6

tools: {



7

cityAttractions: {



8

inputSchema: z.object({ city: z.string() }),



9

execute: async ({ city }) => ({



10

attractions: ['attraction1', 'attraction2', 'attraction3'],



11

}),



12

},



13

},



14

prompt: 'What are some San Francisco tourist attractions?',



15

});



16



17

for await (const part of result.stream) {



18

switch (part.type) {



19

case 'start': {



20

// handle start of stream



21

break;



22

}



23

case 'start-step': {



24

// handle start of step



25

break;



26

}



27

case 'text-start': {



28

// handle text start



29

break;



30

}



31

case 'text-delta': {



32

// handle text delta here



33

break;



34

}



35

case 'text-end': {



36

// handle text end



37

break;



38

}



39

case 'reasoning-start': {



40

// handle reasoning start



41

break;



42

}



43

case 'reasoning-delta': {



44

// handle reasoning delta here



45

break;



46

}



47

case 'reasoning-end': {



48

// handle reasoning end



49

break;



50

}



51

case 'source': {



52

// handle source here



53

break;



54

}



55

case 'file': {



56

// handle file here



57

break;



58

}



59

case 'tool-call': {



60

switch (part.toolName) {



61

case 'cityAttractions': {



62

// handle tool call here



63

break;



64

}



65

}



66

break;



67

}



68

case 'tool-input-start': {



69

// handle tool input start



70

break;



71

}



72

case 'tool-input-delta': {



73

// handle tool input delta



74

break;



75

}



76

case 'tool-input-end': {



77

// handle tool input end



78

break;



79

}



80

case 'tool-result': {



81

switch (part.toolName) {



82

case 'cityAttractions': {



83

// handle tool result here



84

break;



85

}



86

}



87

break;



88

}



89

case 'tool-error': {



90

// handle tool error



91

break;



92

}



93

case 'finish-step': {



94

// handle finish step



95

break;



96

}



97

case 'finish': {



98

// handle finish here



99

break;



100

}



101

case 'error': {



102

// handle error here



103

break;



104

}



105

case 'raw': {



106

// handle raw value



107

break;



108

}



109

}



110

}
```

### [Stream transformation](#stream-transformation)

You can use the `experimental_transform` option to transform the stream.
This is useful for e.g. filtering, changing, or smoothing the text stream.

The transformations are applied before the callbacks are invoked and the promises are resolved.
If you e.g. have a transformation that changes all text to uppercase, the `onEnd` callback will receive the transformed text.

#### [Smoothing streams](#smoothing-streams)

The AI SDK Core provides a [`smoothStream` function](/docs/reference/ai-sdk-core/smooth-stream) that
can be used to smooth out text and reasoning streaming.

```
1

import { smoothStream, streamText } from 'ai';



2



3

const result = streamText({



4

model,



5

prompt,



6

experimental_transform: smoothStream(),



7

});
```

#### [Custom transformations](#custom-transformations)

You can also implement your own custom transformations.
The transformation function receives the tools that are available to the model,
and returns a function that is used to transform the stream.
Tools can either be generic or limited to the tools that you are using.

Here is an example of how to implement a custom transformation that converts
all text to uppercase:

```
1

import { streamText, type TextStreamPart, type ToolSet } from 'ai';



2



3

const upperCaseTransform =



4

<TOOLS extends ToolSet>() =>



5

(options: { tools: TOOLS; stopStream: () => void }) =>



6

new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({



7

transform(chunk, controller) {



8

controller.enqueue(



9

// for text-delta chunks, convert the text to uppercase:



10

chunk.type === 'text-delta'



11

? { ...chunk, text: chunk.text.toUpperCase() }



12

: chunk,



13

);



14

},



15

});
```

You can also stop the stream using the `stopStream` function.
This is e.g. useful if you want to stop the stream when model guardrails are violated, e.g. by generating inappropriate content.

When you invoke `stopStream`, it is important to simulate the `finish-step` and `finish` events to guarantee that a well-formed stream is returned
and all callbacks are invoked.

```
1

import { streamText, type TextStreamPart, type ToolSet } from 'ai';



2



3

const stopWordTransform =



4

<TOOLS extends ToolSet>() =>



5

({ stopStream }: { stopStream: () => void }) =>



6

new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({



7

// note: this is a simplified transformation for testing;



8

// in a real-world version more there would need to be



9

// stream buffering and scanning to correctly emit prior text



10

// and to detect all STOP occurrences.



11

transform(chunk, controller) {



12

if (chunk.type !== 'text-delta') {



13

controller.enqueue(chunk);



14

return;



15

}



16



17

if (chunk.text.includes('STOP')) {



18

// stop the stream



19

stopStream();



20



21

// simulate the finish-step event



22

controller.enqueue({



23

type: 'finish-step',



24

finishReason: 'stop',



25

rawFinishReason: 'stop',



26

usage: {



27

inputTokens: undefined,



28

inputTokenDetails: {



29

cacheReadTokens: undefined,



30

cacheWriteTokens: undefined,



31

noCacheTokens: undefined,



32

},



33

outputTokens: undefined,



34

outputTokenDetails: {



35

reasoningTokens: undefined,



36

textTokens: undefined,



37

},



38

totalTokens: undefined,



39

},



40

performance: {



41

effectiveOutputTokensPerSecond: 0,



42

outputTokensPerSecond: undefined,



43

inputTokensPerSecond: undefined,



44

effectiveTotalTokensPerSecond: 0,



45

stepTimeMs: 0,



46

responseTimeMs: 0,



47

toolExecutionMs: {},



48

timeToFirstOutputMs: undefined,



49

},



50

response: {



51

id: 'response-id',



52

modelId: 'mock-model-id',



53

timestamp: new Date(0),



54

},



55

providerMetadata: undefined,



56

});



57



58

// simulate the finish event



59

controller.enqueue({



60

type: 'finish',



61

finishReason: 'stop',



62

rawFinishReason: 'stop',



63

totalUsage: {



64

inputTokens: undefined,



65

inputTokenDetails: {



66

cacheReadTokens: undefined,



67

cacheWriteTokens: undefined,



68

noCacheTokens: undefined,



69

},



70

outputTokens: undefined,



71

outputTokenDetails: {



72

reasoningTokens: undefined,



73

textTokens: undefined,



74

},



75

totalTokens: undefined,



76

},



77

});



78



79

return;



80

}



81



82

controller.enqueue(chunk);



83

},



84

});
```

#### [Multiple transformations](#multiple-transformations)

You can also provide multiple transformations. They are applied in the order they are provided.

```
1

const result = streamText({



2

model,



3

prompt,



4

experimental_transform: [firstTransform, secondTransform],



5

});
```

[Sources](#sources)
-------------------

Some providers such as [Perplexity](/providers/ai-sdk-providers/perplexity#sources) and
[Google](/providers/ai-sdk-providers/google#sources) include sources in the response.

Currently sources are limited to web pages that ground the response.
You can access them using the `sources` property of the result.

Each `url` source contains the following properties:

* `id`: The ID of the source.
* `url`: The URL of the source.
* `title`: The optional title of the source.
* `providerMetadata`: Provider metadata for the source.

When you use `generateText`, you can access the sources using the `sources` property:

```
1

const result = await generateText({



2

model: 'google/gemini-2.5-flash',



3

tools: {



4

google_search: google.tools.googleSearch({}),



5

},



6

prompt: 'List the top 5 San Francisco news from the past week.',



7

});



8



9

for (const source of result.sources) {



10

if (source.sourceType === 'url') {



11

console.log('ID:', source.id);



12

console.log('Title:', source.title);



13

console.log('URL:', source.url);



14

console.log('Provider metadata:', source.providerMetadata);



15

console.log();



16

}



17

}
```

When you use `streamText`, you can access the sources using the `stream` property:

```
1

const result = streamText({



2

model: 'google/gemini-2.5-flash',



3

tools: {



4

google_search: google.tools.googleSearch({}),



5

},



6

prompt: 'List the top 5 San Francisco news from the past week.',



7

});



8



9

for await (const part of result.stream) {



10

if (part.type === 'source' && part.sourceType === 'url') {



11

console.log('ID:', part.id);



12

console.log('Title:', part.title);



13

console.log('URL:', part.url);



14

console.log('Provider metadata:', part.providerMetadata);



15

console.log();



16

}



17

}
```

The sources are also available in the `result.sources` promise.

[Examples](#examples)
---------------------

You can see `generateText` and `streamText` in action using various frameworks in the following examples:

### [`generateText`](#generatetext-1)

[Learn to generate text in Node.js](/examples/node/generating-text/generate-text)[Learn to generate text in Next.js with Route Handlers (AI SDK UI)](/examples/next-pages/basics/generating-text)[Learn to generate text in Next.js with Server Actions (AI SDK RSC)](/examples/next-app/basics/generating-text)

### [`streamText`](#streamtext-1)

[Learn to stream text in Node.js](/examples/node/generating-text/stream-text)[Learn to stream text in Next.js with Route Handlers (AI SDK UI)](/examples/next-pages/basics/streaming-text-generation)[Learn to stream text in Next.js with Server Actions (AI SDK RSC)](/examples/next-app/basics/streaming-text-generation)

[Previous

Overview](/docs/ai-sdk-core/overview)[Next

Generating Structured Data](/docs/ai-sdk-core/generating-structured-data)
