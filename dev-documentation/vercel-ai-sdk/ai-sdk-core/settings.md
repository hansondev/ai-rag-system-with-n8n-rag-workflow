---
title: "Settings"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/settings
section: ai-sdk-core
crawled: 2026-09-20
---

# Settings

> Source: https://ai-sdk.dev/docs/ai-sdk-core/settings

[AI SDK Core](/docs/ai-sdk-core)Settings


[Settings](#settings)
=====================

Large language models (LLMs) typically provide settings to augment their output.

All AI SDK functions support the following common settings in addition to the model, the [prompt](/docs/foundations/prompts), and additional provider-specific settings:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

maxOutputTokens: 512,



4

temperature: 0.3,



5

maxRetries: 5,



6

timeout: 10000,



7

prompt: 'Invent a new holiday and describe its traditions.',



8

});
```

Some providers do not support all common settings. If you use a setting with a
provider that does not support it, a warning will be generated. You can check
the `warnings` property in the result object to see if any warnings were
generated.

[Language Model Call Options](#language-model-call-options)
-----------------------------------------------------------

Language model call options (`LanguageModelCallOptions`) are settings that influence how the language model generates its response — token limits, sampling behavior, penalties, stop sequences, seed, and reasoning. They are forwarded to the underlying model.

### [`maxOutputTokens`](#maxoutputtokens)

Maximum number of tokens to generate.

### [`temperature`](#temperature)

Temperature setting.

The value is passed through to the provider. The range depends on the provider and model.
For most providers, `0` means almost deterministic results, and higher values mean more randomness.

It is recommended to set either `temperature` or `topP`, but not both.

In AI SDK 5.0, temperature is no longer set to `0` by default.

### [`topP`](#topp)

Nucleus sampling.

The value is passed through to the provider. The range depends on the provider and model.
For most providers, nucleus sampling is a number between 0 and 1.
E.g. 0.1 would mean that only tokens with the top 10% probability mass are considered.

It is recommended to set either `temperature` or `topP`, but not both.

### [`topK`](#topk)

Only sample from the top K options for each subsequent token.

Used to remove "long tail" low probability responses.
Recommended for advanced use cases only. You usually only need to use `temperature`.

### [`presencePenalty`](#presencepenalty)

The presence penalty affects the likelihood of the model to repeat information that is already in the prompt.

The value is passed through to the provider. The range depends on the provider and model.
For most providers, `0` means no penalty.

### [`frequencyPenalty`](#frequencypenalty)

The frequency penalty affects the likelihood of the model to repeatedly use the same words or phrases.

The value is passed through to the provider. The range depends on the provider and model.
For most providers, `0` means no penalty.

### [`stopSequences`](#stopsequences)

The stop sequences to use for stopping the text generation.

If set, the model will stop generating text when one of the stop sequences is generated.
Providers may have limits on the number of stop sequences.

### [`seed`](#seed)

It is the seed (integer) to use for random sampling.
If set and supported by the model, calls will generate deterministic results.

### [`reasoning`](#reasoning)

Controls how much reasoning the model performs before generating a response.

| Value | Behavior |
| --- | --- |
| `'provider-default'` | Use the provider's default reasoning behavior (default when omitted) |
| `'none'` | Disable reasoning |
| `'minimal'` | Bare-minimum reasoning |
| `'low'` | Fast, concise reasoning |
| `'medium'` | Balanced reasoning |
| `'high'` | Thorough reasoning |
| `'xhigh'` | Maximum reasoning |

If you also set reasoning-related options in `providerOptions` (e.g. `openai.reasoningEffort` or `anthropic.thinking`), the provider-specific options take precedence and the top-level `reasoning` parameter is ignored.

See the [reasoning guide](/docs/ai-sdk-core/reasoning) for details on per-provider mapping and migration from `providerOptions`.

[Request Options](#request-options)
-----------------------------------

Request options (`RequestOptions`) are settings that affect transport, retries, cancellation, and timeouts — not model generation behavior. They control how the SDK communicates with the provider's API.

### [`maxRetries`](#maxretries)

Maximum number of retries. Set to 0 to disable retries. Default: `2`.

### [`abortSignal`](#abortsignal)

An optional abort signal that can be used to cancel the call.

The abort signal can e.g. be forwarded from a user interface to cancel the call,
or to define a timeout using `AbortSignal.timeout`.

#### [Example: AbortSignal.timeout](#example-abortsignaltimeout)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

prompt: 'Invent a new holiday and describe its traditions.',



4

abortSignal: AbortSignal.timeout(5000), // 5 seconds



5

});
```

### [`timeout`](#timeout)

An optional timeout in milliseconds. The call will be aborted if it takes longer than the specified duration.

This is a convenience parameter that creates an abort signal internally. It can be used alongside `abortSignal` - if both are provided, the call will abort when either condition is met.

You can specify the timeout either as a number (milliseconds) or as an object with the following properties:

* `totalMs`: The total timeout for the entire call including all steps.
* `stepMs`: The timeout for each individual step (LLM call). This is useful for multi-step generations where you want to limit the time spent on each step independently.
* `firstChunkMs`: The timeout until the first content-bearing output of each step (streaming only). Text deltas, reasoning deltas, tool-input deltas, generated files, and tool calls satisfy the timeout. Response metadata, stream starts, empty deltas, raw chunks, and transport activity do not satisfy or reset it.
* `chunkMs`: The timeout between content-bearing output chunks after output has started (streaming only). Non-content chunks do not reset it. This is useful for detecting streams that stall after generation begins.
* `toolMs`: The default timeout for all tool executions. If a tool takes longer, it aborts and returns a tool-error so the model can respond or retry.
* `tools`: Per-tool timeout overrides using `{toolName}Ms` keys (e.g. `weatherMs`, `slowApiMs`). Takes precedence over `toolMs`. Tool names are type-checked for autocomplete.

#### [Example: 5 second timeout (number format)](#example-5-second-timeout-number-format)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

prompt: 'Invent a new holiday and describe its traditions.',



4

timeout: 5000, // 5 seconds



5

});
```

#### [Example: 5 second total timeout (object format)](#example-5-second-total-timeout-object-format)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

prompt: 'Invent a new holiday and describe its traditions.',



4

timeout: { totalMs: 5000 }, // 5 seconds



5

});
```

#### [Example: 10 second step timeout](#example-10-second-step-timeout)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

prompt: 'Invent a new holiday and describe its traditions.',



4

timeout: { stepMs: 10000 }, // 10 seconds per step



5

});
```

#### [Example: Combined total and step timeout](#example-combined-total-and-step-timeout)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

prompt: 'Invent a new holiday and describe its traditions.',



4

timeout: {



5

totalMs: 60000, // 60 seconds total



6

stepMs: 10000, // 10 seconds per step



7

},



8

});
```

#### [Example: Per-chunk timeout for streaming (streamText only)](#example-per-chunk-timeout-for-streaming-streamtext-only)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = streamText({



2

model: "xai/grok-4.6",



3

prompt: 'Invent a new holiday and describe its traditions.',



4

timeout: { chunkMs: 5000 }, // abort if content stalls for 5 seconds



5

});
```

#### [Example: First-content timeout for streaming (streamText only)](#example-first-content-timeout-for-streaming-streamtext-only)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = streamText({



2

model: "xai/grok-4.6",



3

prompt: 'Invent a new holiday and describe its traditions.',



4

timeout: {



5

firstChunkMs: 10000, // 10 seconds for first content in each step



6

},



7

});
```

#### [Example: Tool execution timeout](#example-tool-execution-timeout)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

tools: { weather: weatherTool, slowApi: slowApiTool },



4

timeout: {



5

toolMs: 5000, // 5 seconds default for all tools



6

},



7

prompt: 'What is the weather in San Francisco?',



8

});
```

#### [Example: Per-tool timeout overrides](#example-per-tool-timeout-overrides)

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

tools: { weather: weatherTool, slowApi: slowApiTool },



4

timeout: {



5

toolMs: 5000, // default for all tools



6

tools: {



7

weatherMs: 3000, // 3 seconds for weather tool



8

slowApiMs: 10000, // 10 seconds for slow API tool



9

},



10

},



11

prompt: 'What is the weather in San Francisco?',



12

});
```

### [`headers`](#headers)

Additional HTTP headers to be sent with the request. Only applicable for HTTP-based providers.

You can use the request headers to provide additional information to the provider,
depending on what the provider supports. For example, some observability providers support
headers such as `Prompt-Id`.

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

headers: {



7

'Prompt-Id': 'my-prompt-id',



8

},



9

});
```

The `headers` setting is for request-specific headers. You can also set
`headers` in the provider configuration. These headers will be sent with every
request made by the provider.

[Previous

Prompt Engineering](/docs/ai-sdk-core/prompt-engineering)[Next

Reasoning](/docs/ai-sdk-core/reasoning)
