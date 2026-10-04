---
title: "Provider Options"
source_url: https://ai-sdk.dev/docs/foundations/provider-options
section: foundations
crawled: 2026-09-20
---

# Provider Options

> Source: https://ai-sdk.dev/docs/foundations/provider-options

[Foundations](/docs/foundations)Provider Options


[Provider Options](#provider-options)
=====================================

Provider options let you pass provider-specific configuration that goes beyond the [standard settings](/docs/ai-sdk-core/settings) shared by all providers. They are set via the `providerOptions` property on functions like `generateText` and `streamText`.

```
1

const result = await generateText({



2

model: openai('gpt-5.2'),



3

prompt: 'Explain quantum entanglement.',



4

providerOptions: {



5

openai: {



6

reasoningEffort: 'low',



7

},



8

},



9

});
```

Provider options are namespaced by the provider name (e.g. `openai`, `anthropic`) so you can even include options for multiple providers in the same call — only the options matching the active provider are used. See [Prompts: Provider Options](/docs/foundations/prompts#provider-options) for details on applying options at the message and message-part level.

For controlling reasoning effort, consider using the top-level [`reasoning`
parameter](/docs/ai-sdk-core/reasoning) instead of provider-specific options.
It provides a portable setting that works across all providers that support
reasoning. Use provider-specific options only when you need features like
exact token budgets.

[Common Provider Options](#common-provider-options)
---------------------------------------------------

The sections below cover the most frequently used provider options, focusing on reasoning and output control for OpenAI and Anthropic. For a complete reference, see the individual provider pages:

* [OpenAI provider options](/providers/ai-sdk-providers/openai)
* [Anthropic provider options](/providers/ai-sdk-providers/anthropic)

---

[OpenAI](#openai)
-----------------

### [Reasoning Effort](#reasoning-effort)

For reasoning models (e.g. `o3`, `o4-mini`, `gpt-5.2`), `reasoningEffort` controls how much internal reasoning the model performs before responding. Lower values are faster and cheaper; higher values produce more thorough answers.

```
1

import {



2

openai,



3

type OpenAILanguageModelResponsesOptions,



4

} from '@ai-sdk/openai';



5

import { generateText } from 'ai';



6



7

const result = await generateText({



8

model: openai('gpt-5.2'),



9

prompt: 'Invent a new holiday and describe its traditions.',



10

providerOptions: {



11

openai: {



12

reasoningEffort: 'low', // 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh'



13

} satisfies OpenAILanguageModelResponsesOptions,



14

},



15

});



16



17

console.log('Text:', result.text);



18

console.log('Usage:', result.usage);



19

console.log(



20

'Reasoning tokens:',



21

result.finalStep.providerMetadata?.openai?.reasoningTokens,



22

);
```

| Value | Behavior |
| --- | --- |
| `'none'` | No reasoning (GPT-5.1 models only) |
| `'minimal'` | Bare-minimum reasoning |
| `'low'` | Fast, concise reasoning |
| `'medium'` | Balanced (default) |
| `'high'` | Thorough reasoning |
| `'xhigh'` | Maximum reasoning (GPT-5.1-Codex-Max only) |

`'none'` and `'xhigh'` are only supported on specific models. Using them with
unsupported models will result in an error.

### [Reasoning Summary](#reasoning-summary)

When working with reasoning models, you may want to see *how* the model arrived at its answer. The `reasoningSummary` option surfaces the model's thought process.

When `reasoningEffort` is set to a value other than `'none'`, the OpenAI Responses provider defaults `reasoningSummary` to `'detailed'`. Set `reasoningSummary: null` to omit reasoning summaries.

#### [Streaming](#streaming)

```
1

import {



2

openai,



3

type OpenAILanguageModelResponsesOptions,



4

} from '@ai-sdk/openai';



5

import { streamText } from 'ai';



6



7

const result = streamText({



8

model: openai('gpt-5.2'),



9

prompt: 'Tell me about the Mission burrito debate in San Francisco.',



10

providerOptions: {



11

openai: {



12

reasoningSummary: 'detailed', // 'auto' | 'detailed'



13

} satisfies OpenAILanguageModelResponsesOptions,



14

},



15

});



16



17

for await (const part of result.stream) {



18

if (part.type === 'reasoning') {



19

console.log(`Reasoning: ${part.textDelta}`);



20

} else if (part.type === 'text-delta') {



21

process.stdout.write(part.textDelta);



22

}



23

}
```

#### [Non-streaming](#non-streaming)

```
1

import {



2

openai,



3

type OpenAILanguageModelResponsesOptions,



4

} from '@ai-sdk/openai';



5

import { generateText } from 'ai';



6



7

const result = await generateText({



8

model: openai('gpt-5.2'),



9

prompt: 'Tell me about the Mission burrito debate in San Francisco.',



10

providerOptions: {



11

openai: {



12

reasoningSummary: 'auto',



13

} satisfies OpenAILanguageModelResponsesOptions,



14

},



15

});



16



17

console.log('Reasoning:', result.finalStep.reasoning);
```

| Value | Behavior |
| --- | --- |
| `'auto'` | Condensed summary of reasoning |
| `'detailed'` | Comprehensive reasoning output |

### [Text Verbosity](#text-verbosity)

Control the length and detail of the model's text response independently of reasoning:

```
1

import {



2

openai,



3

type OpenAILanguageModelResponsesOptions,



4

} from '@ai-sdk/openai';



5

import { generateText } from 'ai';



6



7

const result = await generateText({



8

model: openai('gpt-5-mini'),



9

prompt: 'Write a poem about a boy and his first pet dog.',



10

providerOptions: {



11

openai: {



12

textVerbosity: 'low', // 'low' | 'medium' | 'high'



13

} satisfies OpenAILanguageModelResponsesOptions,



14

},



15

});
```

| Value | Behavior |
| --- | --- |
| `'low'` | Terse, minimal responses |
| `'medium'` | Balanced detail (default) |
| `'high'` | Verbose, comprehensive responses |

---

[Anthropic](#anthropic)
-----------------------

### [Thinking (Extended Reasoning)](#thinking-extended-reasoning)

Anthropic's thinking feature gives Claude models a dedicated "thinking" phase before they respond. You enable it by providing a `thinking` object with a token budget.

```
1

import { anthropic, AnthropicLanguageModelOptions } from '@ai-sdk/anthropic';



2

import { generateText } from 'ai';



3



4

const { text, reasoning, reasoningText } = await generateText({



5

model: anthropic('claude-opus-4-20250514'),



6

prompt: 'How many people will live in the world in 2040?',



7

providerOptions: {



8

anthropic: {



9

thinking: { type: 'enabled', budgetTokens: 12000 },



10

} satisfies AnthropicLanguageModelOptions,



11

},



12

});



13



14

console.log('Reasoning:', reasoningText);



15

console.log('Answer:', text);
```

The `budgetTokens` value sets the upper limit on how many tokens the model can use for its internal reasoning. Higher budgets allow deeper reasoning but increase latency and cost.

Thinking is supported on `claude-opus-4-20250514`, `claude-sonnet-4-20250514`,
and `claude-sonnet-4-5-20250929` models.

### [Effort](#effort)

The `effort` option provides a simpler way to control reasoning depth without specifying a token budget. It affects thinking, text responses, and function calls.

```
1

import { anthropic, AnthropicLanguageModelOptions } from '@ai-sdk/anthropic';



2

import { generateText } from 'ai';



3



4

const { text, usage } = await generateText({



5

model: anthropic('claude-opus-4-20250514'),



6

prompt: 'How many people will live in the world in 2040?',



7

providerOptions: {



8

anthropic: {



9

effort: 'low', // 'low' | 'medium' | 'high'



10

} satisfies AnthropicLanguageModelOptions,



11

},



12

});
```

| Value | Behavior |
| --- | --- |
| `'low'` | Minimal reasoning, fastest responses |
| `'medium'` | Balanced reasoning |
| `'high'` | Thorough reasoning (default) |

### [Fast Mode](#fast-mode)

For `claude-opus-4-6`, the `speed` option enables approximately 2.5x faster output token speeds:

```
1

import { anthropic, AnthropicLanguageModelOptions } from '@ai-sdk/anthropic';



2

import { generateText } from 'ai';



3



4

const { text } = await generateText({



5

model: anthropic('claude-opus-4-6'),



6

prompt: 'Write a short poem about the sea.',



7

providerOptions: {



8

anthropic: {



9

speed: 'fast', // 'fast' | 'standard'



10

} satisfies AnthropicLanguageModelOptions,



11

},



12

});
```

---

[Combining Options](#combining-options)
---------------------------------------

You can combine multiple provider options in a single call. For example, using both reasoning effort and reasoning summaries with OpenAI:

```
1

import {



2

openai,



3

type OpenAILanguageModelResponsesOptions,



4

} from '@ai-sdk/openai';



5

import { generateText } from 'ai';



6



7

const result = await generateText({



8

model: openai('gpt-5.2'),



9

prompt: 'What are the implications of quantum computing for cryptography?',



10

providerOptions: {



11

openai: {



12

reasoningEffort: 'high',



13

reasoningSummary: 'detailed',



14

} satisfies OpenAILanguageModelResponsesOptions,



15

},



16

});
```

Or enabling thinking with a low effort level for Anthropic:

```
1

import { anthropic, AnthropicLanguageModelOptions } from '@ai-sdk/anthropic';



2

import { generateText } from 'ai';



3



4

const result = await generateText({



5

model: anthropic('claude-opus-4-20250514'),



6

prompt: 'Explain the Riemann hypothesis in simple terms.',



7

providerOptions: {



8

anthropic: {



9

thinking: { type: 'enabled', budgetTokens: 8000 },



10

effort: 'medium',



11

} satisfies AnthropicLanguageModelOptions,



12

},



13

});
```

[Using Provider Options with the AI Gateway](#using-provider-options-with-the-ai-gateway)
-----------------------------------------------------------------------------------------

Provider options work the same way when using the [Vercel AI Gateway](/providers/ai-sdk-providers/ai-gateway). Use the underlying provider name (e.g. `openai`, `anthropic`) as the key — not `gateway`. The AI Gateway forwards these options to the target provider automatically.

```
1

import type { OpenAILanguageModelResponsesOptions } from '@ai-sdk/openai';



2

import { generateText } from 'ai';



3



4

const result = await generateText({



5

model: 'openai/gpt-5.2', // AI Gateway model string



6

prompt: 'What are the implications of quantum computing for cryptography?',



7

providerOptions: {



8

openai: {



9

reasoningEffort: 'high',



10

reasoningSummary: 'detailed',



11

} satisfies OpenAILanguageModelResponsesOptions,



12

},



13

});
```

You can also combine gateway-specific options (like routing and fallbacks) with provider-specific options in the same call:

```
1

import type { AnthropicLanguageModelOptions } from '@ai-sdk/anthropic';



2

import type { GatewayProviderOptions } from '@ai-sdk/gateway';



3

import { generateText } from 'ai';



4



5

const result = await generateText({



6

model: 'anthropic/claude-sonnet-4',



7

prompt: 'Explain quantum computing',



8

providerOptions: {



9

// Gateway-specific: control routing



10

gateway: {



11

order: ['vertex', 'anthropic'],



12

} satisfies GatewayProviderOptions,



13

// Provider-specific: enable reasoning



14

anthropic: {



15

thinking: { type: 'enabled', budgetTokens: 12000 },



16

} satisfies AnthropicLanguageModelOptions,



17

},



18

});
```

For more on gateway routing, fallbacks, and other gateway-specific options, see the [AI Gateway provider documentation](/providers/ai-sdk-providers/ai-gateway#provider-options).

[Type Safety](#type-safety)
---------------------------

Each provider exports a type for its options, which you can use with `satisfies` to get autocomplete and catch typos at build time:

```
1

import { type OpenAILanguageModelResponsesOptions } from '@ai-sdk/openai';



2

import { type AnthropicLanguageModelOptions } from '@ai-sdk/anthropic';
```

For a full list of available options, see the provider-specific documentation:

* [OpenAI Provider](/providers/ai-sdk-providers/openai)
* [Anthropic Provider](/providers/ai-sdk-providers/anthropic)

[Previous

Streaming](/docs/foundations/streaming)[Next

Getting Started](/docs/getting-started)
