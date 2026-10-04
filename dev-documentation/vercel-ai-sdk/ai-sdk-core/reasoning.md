---
title: "Reasoning"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/reasoning
section: ai-sdk-core
crawled: 2026-09-20
---

# Reasoning

> Source: https://ai-sdk.dev/docs/ai-sdk-core/reasoning

[AI SDK Core](/docs/ai-sdk-core)Reasoning


[Reasoning](#reasoning)
=======================

Many language models support an internal "reasoning" phase (sometimes also called "thinking") before producing a response. The AI SDK provides a top-level `reasoning` parameter on [`generateText`](/docs/reference/ai-sdk-core/generate-text) and [`streamText`](/docs/reference/ai-sdk-core/stream-text) that controls this behavior across providers with a single, portable setting.

[Basic Usage](#basic-usage)
---------------------------

```
1

import { generateText } from 'ai';



2



3

const { text, reasoning, reasoningText } = await generateText({



4

model: 'anthropic/claude-sonnet-4.6',



5

reasoning: 'medium',



6

prompt: 'How many people will live in the world in 2040?',



7

});
```

The `reasoning` parameter accepts the following values:

| Value | Behavior |
| --- | --- |
| `'provider-default'` | Use the provider's default reasoning behavior (default when omitted) |
| `'none'` | Disable reasoning |
| `'minimal'` | Bare-minimum reasoning |
| `'low'` | Fast, concise reasoning |
| `'medium'` | Balanced reasoning |
| `'high'` | Thorough reasoning |
| `'xhigh'` | Maximum reasoning |

[Streaming](#streaming)
-----------------------

The `reasoning` parameter works the same way with `streamText`:

```
1

import { streamText } from 'ai';



2



3

const result = streamText({



4

model: 'google/gemini-3-flash-preview',



5

reasoning: 'high',



6

prompt: 'Explain the Riemann hypothesis in simple terms.',



7

});



8



9

for await (const part of result.stream) {



10

if (part.type === 'reasoning') {



11

process.stdout.write(part.textDelta);



12

} else if (part.type === 'text-delta') {



13

process.stdout.write(part.textDelta);



14

}



15

}
```

[Precedence Rules](#precedence-rules)
-------------------------------------

The top-level `reasoning` parameter and provider-specific `providerOptions` are **never merged**. If you set reasoning-related options in `providerOptions`, they take full precedence and the top-level `reasoning` parameter is ignored.

```
1

import { generateText } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3



4

const { text } = await generateText({



5

model: openai.responses('gpt-5.4'),



6

reasoning: 'low', // ignored because providerOptions.openai.reasoningEffort is set



7

providerOptions: {



8

openai: {



9

reasoningEffort: 'high', // this wins



10

},



11

},



12

prompt: 'Explain quantum entanglement.',



13

});
```

This design lets you use the portable `reasoning` parameter by default and fall back to `providerOptions` only when you need provider-specific features like exact token budgets.

[Provider Support](#provider-support)
-------------------------------------

The `reasoning` parameter is supported by the following providers: OpenAI, Anthropic, Google, xAI, Groq, DeepSeek, Fireworks, and Amazon Bedrock. Each provider translates the value to its native reasoning API. Some providers support all six levels natively, while others coerce to fewer levels (a warning is emitted when coercion occurs). Some providers use a numeric token budget instead of an enum for reasoning control; in those cases the top-level `reasoning` value is mapped to a budget calculated as a percentage of the model's maximum output tokens.

Providers that do not support reasoning (e.g. Mistral, Perplexity, Cohere) emit an `unsupported` warning and ignore the parameter.

[Migrating from `providerOptions`](#migrating-from-provideroptions)
-------------------------------------------------------------------

If you currently control reasoning via `providerOptions`, you can migrate to the top-level `reasoning` parameter for portability across providers.

### [Before (Anthropic)](#before-anthropic)

```
1

const { text } = await generateText({



2

model: anthropic('claude-opus-4.6'),



3

providerOptions: {



4

anthropic: {



5

thinking: { type: 'adaptive', effort: 'high' },



6

},



7

},



8

prompt: 'How many people will live in the world in 2040?',



9

});
```

### [After (Anthropic)](#after-anthropic)

```
1

const { text } = await generateText({



2

model: anthropic('claude-opus-4.6'),



3

reasoning: 'high',



4

prompt: 'How many people will live in the world in 2040?',



5

});
```

### [Before (Anthropic with older model)](#before-anthropic-with-older-model)

```
1

const { text } = await generateText({



2

model: anthropic('claude-sonnet-4-20250514'),



3

providerOptions: {



4

anthropic: {



5

thinking: { type: 'enabled', budgetTokens: 12000 },



6

},



7

},



8

prompt: 'How many people will live in the world in 2040?',



9

});
```

### [After (Anthropic with older model)](#after-anthropic-with-older-model)

```
1

const { text } = await generateText({



2

model: anthropic('claude-sonnet-4-20250514'),



3

reasoning: 'medium',



4

prompt: 'How many people will live in the world in 2040?',



5

});
```

If you need to enforce an exact token budget (e.g. exactly 12000 tokens), keep using `providerOptions` instead of the top-level `reasoning` parameter.

### [Before (Google with `includeThoughts`)](#before-google-with-includethoughts)

```
1

const { text } = await generateText({



2

model: google('gemini-3-flash-preview'),



3

providerOptions: {



4

google: {



5

thinkingConfig: { thinkingBudget: 4096, includeThoughts: true },



6

},



7

},



8

prompt: 'Explain the Riemann hypothesis in simple terms.',



9

});
```

### [After (Google with `includeThoughts`)](#after-google-with-includethoughts)

```
1

const { text } = await generateText({



2

model: google('gemini-3-flash-preview'),



3

reasoning: 'medium',



4

providerOptions: {



5

google: { thinkingConfig: { includeThoughts: true } },



6

},



7

prompt: 'Explain the Riemann hypothesis in simple terms.',



8

});
```

### [Before (OpenAI with `reasoningSummary`)](#before-openai-with-reasoningsummary)

```
1

const { text } = await generateText({



2

model: openai.responses('o3'),



3

providerOptions: {



4

openai: { reasoningEffort: 'high', reasoningSummary: 'auto' },



5

},



6

prompt: 'Explain quantum entanglement.',



7

});
```

### [After (OpenAI with `reasoningSummary`)](#after-openai-with-reasoningsummary)

```
1

const { text } = await generateText({



2

model: openai.responses('o3'),



3

reasoning: 'high',



4

providerOptions: {



5

openai: { reasoningSummary: 'auto' },



6

},



7

prompt: 'Explain quantum entanglement.',



8

});
```

Note that `providerOptions` can still be used alongside `reasoning` for provider-specific features unrelated to reasoning effort. However, if `providerOptions` includes reasoning effort/budget settings (e.g. `reasoningEffort`, `thinking`, `thinkingConfig.thinkingBudget`), those take full precedence and the top-level `reasoning` parameter is ignored.

[Previous

Settings](/docs/ai-sdk-core/settings)[Next

Embeddings](/docs/ai-sdk-core/embeddings)
