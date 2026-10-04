---
title: "Batch"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/batch
section: ai-sdk-core
crawled: 2026-09-20
---

# Batch

> Source: https://ai-sdk.dev/docs/ai-sdk-core/batch

[AI SDK Core](/docs/ai-sdk-core)Batch


[Batch](#batch)
===============

Batch support is experimental and the API may change in patch releases.

Batches let you submit multiple independent requests for asynchronous
processing. The provider processes the batch in the background, so your
application does not need to keep the request open while the model generates
the results. This is useful for workloads such as classification,
summarization, and content generation that do not need an immediate response.

The batch API supports text generation with `type: 'text'` and image generation
with `type: 'image'`.

The AI SDK provides five functions for the batch lifecycle:

* [`experimental_startBatch`](/docs/reference/ai-sdk-core/start-batch)
  submits a batch and returns its initial status and a serializable reference.
* [`experimental_getBatchStatus`](/docs/reference/ai-sdk-core/get-batch-status)
  retrieves the latest status and request counts.
* [`experimental_getBatchResults`](/docs/reference/ai-sdk-core/get-batch-results)
  asynchronously iterates over the terminal result for each request.
* [`experimental_cancelBatch`](/docs/reference/ai-sdk-core/cancel-batch)
  requests cancellation of a batch.
* [`experimental_listBatches`](/docs/reference/ai-sdk-core/list-batches)
  lists batches and their latest statuses.

All five functions are exported from `ai`. The examples below use aliases so
the shorter names can be used in application code:

```
1

import {



2

experimental_cancelBatch as cancelBatch,



3

experimental_getBatchResults as getBatchResults,



4

experimental_getBatchStatus as getBatchStatus,



5

experimental_listBatches as listBatches,



6

experimental_startBatch as startBatch,



7

} from 'ai';
```

Cancellation and listing are optional provider capabilities. Calling either
function with a provider that does not implement it throws an
`UnsupportedFunctionalityError`. In the cancellation and listing examples
below, `provider` represents a batch provider that implements the respective
capability.

[Supported providers](#supported-providers)
-------------------------------------------

Batch processing requires a provider that implements the batch interface.
Support is provider- and model-specific. The first-party providers with
support are:

| Provider | Provider value | Request types | Provider API |
| --- | --- | --- | --- |
| [Anthropic](/providers/ai-sdk-providers/anthropic) | `anthropic` | text | [Message Batches API](https://platform.claude.com/docs/en/build-with-claude/batch-processing) |
| [Google](/providers/ai-sdk-providers/google) | `google` | text, image | [Gemini Batch API](https://ai.google.dev/gemini-api/docs/batch-api) |
| [OpenAI](/providers/ai-sdk-providers/openai) | `openai` | text | [Batch API](https://developers.openai.com/api/docs/guides/batch) |
| [xAI](/providers/ai-sdk-providers/xai) | `xai` | text, image | [Batch API](https://docs.x.ai/developers/advanced-api-usage/batch-api) |
| [AI Gateway](/providers/ai-sdk-providers/ai-gateway) | global default | text | [Batch processing](https://vercel.com/docs/ai-gateway/models-and-providers/batch-processing) |

See the provider documentation for the supported models, limits, and native
batch behavior. For example, OpenAI batch support is available through the
Responses API, not `openai.chat()`.

[Starting a batch](#starting-a-batch)
-------------------------------------

Pass a provider and one or more uniquely identified requests to `startBatch`.
Each request must specify `type: 'text'`, a model ID, and either a text `prompt`
or a `messages` array. Requests can use different model IDs when supported by
the provider. Each request can also use the usual text-generation settings such
as `instructions`, `maxOutputTokens`, `temperature`, `topP`, `topK`,
`presencePenalty`, `frequencyPenalty`, `stopSequences`, `seed`, and `reasoning`.

Tool definitions and tool settings are provided on individual requests. A tool
with the same name must have the same definition in every request that uses it.

```
1

import { anthropic } from '@ai-sdk/anthropic';



2

import { experimental_startBatch as startBatch } from 'ai';



3



4

const provider = anthropic;



5



6

const batch = await startBatch({



7

provider,



8

requests: [



9

{



10

id: 'capital-france',



11

type: 'text',



12

model: 'claude-haiku-4-5',



13

prompt: 'What is the capital of France?',



14

},



15

{



16

id: 'capital-germany',



17

type: 'text',



18

model: 'claude-haiku-4-5',



19

prompt: 'What is the capital of Germany?',



20

},



21

],



22

});



23



24

console.log(batch.id, batch.status);
```

Request IDs must be non-empty and unique within the batch. They are the link
between an input request and its result. Results are not guaranteed to arrive
in input order, so use the ID rather than an array position when associating a
result with application data.

You can pass provider-specific settings at the batch level with
`providerOptions`, or on an individual request with that request's
`providerOptions`. Settings supported by the provider can differ between the
two levels. The `warnings` property on the start result contains warnings about
unsupported settings.

The batch reference returned by `startBatch` is serializable. Persist it
before the process exits if the batch will be completed by another process or
at a later time. When retrieving a batch, pass the same provider. The AI SDK
uses the reference to ensure that a batch is not read through an incompatible
provider.

### [Image requests](#image-requests)

Image requests use the same prompt and generation settings as `generateImage`:
`prompt`, `n`, `size`, `aspectRatio`, `seed`, and `providerOptions`. A prompt
can also contain input images and a mask for providers that support image
editing. Provider batch endpoints may support only a subset of these options;
unsupported options produce warnings or errors.

```
1

import { google } from '@ai-sdk/google';



2

import { experimental_startBatch as startBatch } from 'ai';



3



4

const batch = await startBatch({



5

provider: google,



6

requests: [



7

{



8

id: 'red-panda',



9

type: 'image',



10

model: 'gemini-2.5-flash-image',



11

prompt: 'A red panda reading beside a cabin window',



12

aspectRatio: '16:9',



13

},



14

],



15

});
```

Successful image items have an `images` array of `GeneratedFile` values, plus
image warnings, response metadata, usage, and provider metadata when the
provider supplies them. Successful text items have `text` and `content`
properties. Use the `type` property to narrow mixed results:

```
1

for await (const item of getBatchResults({ provider: google, batch })) {



2

if (item.type === 'image' && item.status === 'succeeded') {



3

console.log(item.images);



4

}



5

}
```

[Batch tools](#batch-tools)
---------------------------

Batch text requests support both client-defined tools and provider-defined
tools. Tool definitions are sent with each request that includes them, so the
model can call them independently for each request.

Client-defined tools are definition-only in a batch. Their `execute` functions
are never invoked, and the AI SDK does not submit tool results or start a
follow-up generation after retrieving a tool call. Pass the same tool set to
`getBatchResults` to validate and normalize returned tool calls:

```
1

import { anthropic } from '@ai-sdk/anthropic';



2

import {



3

experimental_getBatchResults as getBatchResults,



4

experimental_startBatch as startBatch,



5

tool,



6

} from 'ai';



7

import { z } from 'zod';



8



9

const tools = {



10

get_weather: tool({



11

description: 'Get the current weather for a location.',



12

inputSchema: z.object({ location: z.string() }),



13

execute: async ({ location }) => {



14

// This function is not called by batch processing.



15

return { location, temperature: 21, condition: 'sunny' };



16

},



17

}),



18

};



19



20

const batch = await startBatch({



21

provider: anthropic,



22

requests: [



23

{



24

id: 'weather-san-francisco',



25

type: 'text',



26

model: 'claude-haiku-4-5',



27

prompt: 'Call get_weather for San Francisco, California.',



28

tools,



29

toolChoice: { type: 'tool', toolName: 'get_weather' },



30

},



31

],



32

});



33



34

for await (const item of getBatchResults({



35

provider: anthropic,



36

batch,



37

tools,



38

})) {



39

if (item.status === 'succeeded') {



40

console.log(item.id, item.content);



41

}



42

}
```

Provider-defined tools, such as web search or code execution, can execute on
the provider when supported by that provider's batch API. Their tool calls and
results are returned as normalized `content` parts. See the provider
documentation for the tools and models available in batches.

[Checking batch status](#checking-batch-status)
-----------------------------------------------

The start result includes the initial status. Use `getBatchStatus` to retrieve
the latest status while the provider is processing the batch:

```
1

import { setTimeout } from 'node:timers/promises';



2



3

let status = batch.status;



4

let error = batch.error;



5



6

while (status === 'pending') {



7

await setTimeout(10_000);



8

const latestStatus = await getBatchStatus({



9

provider: anthropic,



10

batch,



11

});



12

status = latestStatus.status;



13

error = latestStatus.error;



14

}



15



16

if (status === 'failed') {



17

throw new Error(error?.message ?? 'The batch failed.');



18

}
```

The normalized batch status is one of:

* `pending` — the provider is still processing the batch.
* `completed` — the batch reached a terminal state and results can be
  retrieved.
* `failed` — the batch could not be completed. The `error` property may
  contain additional details.

Status responses can also include `requestCounts`, `createdAt`, `expiresAt`,
`rawStatus`, and provider metadata. `requestCounts` reports the total,
pending, completed, and failed requests known by the provider.

For webhook-capable providers, pass `webhookUrl` to `startBatch` to
receive a notification when the batch reaches a terminal state. Webhook
support and payloads are provider-specific. The provider pages linked above
describe their webhook behavior; providers that do not support webhooks return
an unsupported warning and continue without one.

[Cancelling a batch](#cancelling-a-batch)
-----------------------------------------

Use `cancelBatch` to ask the provider to stop processing a batch:

```
1

const result = await cancelBatch({



2

provider,



3

batch,



4

});



5



6

console.log(result.providerMetadata);
```

A successful call means that the provider accepted the cancellation request.
It does not guarantee that cancellation has finished or that every pending
request will be cancelled. Use `getBatchStatus` to retrieve the latest status
after requesting cancellation.

The result can include provider metadata with additional information from the
cancellation response.

[Listing batches](#listing-batches)
-----------------------------------

Use `listBatches` to retrieve batches from the provider. Results are paginated.
Pass the returned `nextCursor` as `cursor` to retrieve the next page:

```
1

let cursor: string | undefined;



2



3

do {



4

const page = await listBatches({



5

provider,



6

limit: 20,



7

cursor,



8

});



9



10

for (const batch of page.batches) {



11

console.log(batch.id, batch.status);



12

}



13



14

cursor = page.nextCursor;



15

} while (cursor != null);
```

Each item is a serializable batch reference with its latest normalized status,
so it can be passed directly to `getBatchStatus`, `getBatchResults`, or
`cancelBatch`. Cursors are opaque and provider-specific; applications should
store or pass them unchanged rather than inspect their contents.

[Retrieving results](#retrieving-results)
-----------------------------------------

After the batch is complete, `getBatchResults` returns an async iterable. Each
item contains the ID and terminal status for one input request:

```
1

for await (const item of getBatchResults({ provider: anthropic, batch })) {



2

if (item.status === 'succeeded') {



3

console.log(item.id, item.text);



4

} else {



5

console.error(item.id, item.status, item.error);



6

}



7

}
```

Successful items include:

* `text` — the concatenated text content. This can be an empty string when the
  result contains no text parts.
* `content` — ordered, normalized content parts, including text, reasoning,
  files, sources, tool calls, tool results, and provider content where
  supported.
* `finishReason` and optional `rawFinishReason`.
* `usage` and optional `response` metadata.
* Optional `providerMetadata`.

Failed, cancelled, and expired items include their `id` and status. Failed
items include an `error`; cancelled and expired items may also include one.
One failed request does not necessarily mean that every request in the batch
failed, so handle each item independently.

Batch retrieval does not run an AI SDK tool loop or invoke client-defined
`execute` functions. Provider-defined tools may execute on the provider as part
of batch processing. Treat result content and provider metadata as untrusted
model output, and avoid logging it indiscriminately because it can contain
sensitive data.

[Request controls](#request-controls)
-------------------------------------

All batch lifecycle functions accept `providerOptions`, `headers`, `timeout`,
and `abortSignal` for the current operation. `getBatchStatus`,
`getBatchResults`, and `listBatches` also accept `maxRetries`:

* `maxRetries` controls retries for status, result retrieval, and listing. It
  does not retry batch creation or cancellation. It defaults to 2; set it to 0
  to disable retries.
* `abortSignal` cancels the current API request.
* `timeout` limits the current HTTP operation.

These controls affect communication with the provider. They do not change the
provider's processing deadline or cancel a batch that has already been
submitted.

[Previous

Skill Uploads](/docs/ai-sdk-core/skill-uploads)[Next

Provider & Model Management](/docs/ai-sdk-core/provider-management)
