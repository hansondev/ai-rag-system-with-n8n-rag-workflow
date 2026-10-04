---
title: "Provider & Model Management"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/provider-management
section: ai-sdk-core
crawled: 2026-09-20
---

# Provider & Model Management

> Source: https://ai-sdk.dev/docs/ai-sdk-core/provider-management

[AI SDK Core](/docs/ai-sdk-core)Provider & Model Management


[Provider & Model Management](#provider--model-management)
==========================================================

When you work with multiple providers and models, it is often desirable to manage them in a central place
and access the models through simple string ids.

The AI SDK offers [custom providers](/docs/reference/ai-sdk-core/custom-provider) and
a [provider registry](/docs/reference/ai-sdk-core/provider-registry) for this purpose:

* With **custom providers**, you can pre-configure model settings, provide model name aliases,
  and limit the available models.
* The **provider registry** lets you mix multiple providers and access them through simple string ids.

You can mix and match custom providers, the provider registry, and [middleware](/docs/ai-sdk-core/middleware) in your application.

[Custom Providers](#custom-providers)
-------------------------------------

You can create a [custom provider](/docs/reference/ai-sdk-core/custom-provider) using `customProvider`.

### [Example: custom model settings](#example-custom-model-settings)

You might want to override the default model settings for a provider or provide model name aliases
with pre-configured settings.

```
1

import {



2

gateway,



3

customProvider,



4

defaultSettingsMiddleware,



5

wrapLanguageModel,



6

} from 'ai';



7



8

// custom provider with different provider options:



9

export const openai = customProvider({



10

languageModels: {



11

// replacement model with custom provider options:



12

'gpt-5.1': wrapLanguageModel({



13

model: gateway('openai/gpt-5.1'),



14

middleware: defaultSettingsMiddleware({



15

settings: {



16

providerOptions: {



17

openai: {



18

reasoningEffort: 'high',



19

},



20

},



21

},



22

}),



23

}),



24

// alias model with custom provider options:



25

'gpt-5.1-high-reasoning': wrapLanguageModel({



26

model: gateway('openai/gpt-5.1'),



27

middleware: defaultSettingsMiddleware({



28

settings: {



29

providerOptions: {



30

openai: {



31

reasoningEffort: 'high',



32

},



33

},



34

},



35

}),



36

}),



37

},



38

fallbackProvider: gateway,



39

});
```

### [Example: model name alias](#example-model-name-alias)

You can also provide model name aliases, so you can update the model version in one place in the future:

```
1

import { customProvider, gateway } from 'ai';



2



3

// custom provider with alias names:



4

export const anthropic = customProvider({



5

languageModels: {



6

opus: gateway('anthropic/claude-opus-4.1'),



7

sonnet: gateway('anthropic/claude-sonnet-4.5'),



8

haiku: gateway('anthropic/claude-haiku-4.5'),



9

},



10

fallbackProvider: gateway,



11

});
```

### [Example: limit available models](#example-limit-available-models)

You can limit the available models in the system, even if you have multiple providers.

```
1

import {



2

customProvider,



3

defaultSettingsMiddleware,



4

wrapLanguageModel,



5

gateway,



6

} from 'ai';



7



8

export const myProvider = customProvider({



9

languageModels: {



10

'text-medium': gateway('anthropic/claude-3-5-sonnet-20240620'),



11

'text-small': gateway('openai/gpt-5-mini'),



12

'reasoning-medium': wrapLanguageModel({



13

model: gateway('openai/gpt-5.1'),



14

middleware: defaultSettingsMiddleware({



15

settings: {



16

providerOptions: {



17

openai: {



18

reasoningEffort: 'high',



19

},



20

},



21

},



22

}),



23

}),



24

'reasoning-fast': wrapLanguageModel({



25

model: gateway('openai/gpt-5.1'),



26

middleware: defaultSettingsMiddleware({



27

settings: {



28

providerOptions: {



29

openai: {



30

reasoningEffort: 'low',



31

},



32

},



33

},



34

}),



35

}),



36

},



37

embeddingModels: {



38

embedding: gateway.embeddingModel('openai/text-embedding-3-small'),



39

},



40

// no fallback provider



41

});
```

### [Example: files and skills interfaces](#example-files-and-skills-interfaces)

You can attach a provider's `files` or `skills` interface to your custom provider. This allows you to use `uploadFile` and `uploadSkill` through the same provider abstraction.

```
1

import { anthropic } from '@ai-sdk/anthropic';



2

import { openai } from '@ai-sdk/openai';



3

import { customProvider, uploadFile, uploadSkill } from 'ai';



4



5

// custom provider with files interface:



6

const myOpenAI = customProvider({



7

languageModels: {



8

'gpt-4o-mini': openai.responses('gpt-4o-mini'),



9

},



10

files: openai.files(),



11

});



12



13

// custom provider with skills interface:



14

const myAnthropic = customProvider({



15

languageModels: {



16

sonnet: anthropic('claude-sonnet-4-5'),



17

},



18

skills: anthropic.skills(),



19

});



20



21

// usage:



22

await uploadFile({



23

api: myOpenAI.files!(),



24

data: fileData,



25

filename: 'image.png',



26

});



27

await uploadSkill({



28

api: myAnthropic.skills!(),



29

files: skillFiles,



30

displayTitle: 'My Skill',



31

});
```

If no `files` or `skills` option is set but a `fallbackProvider` is configured, the custom provider will inherit those interfaces from the fallback.

[Provider Registry](#provider-registry)
---------------------------------------

You can create a [provider registry](/docs/reference/ai-sdk-core/provider-registry) with multiple providers and models using `createProviderRegistry`.

### [Setup](#setup)

registry.ts

```
1

import { anthropic } from '@ai-sdk/anthropic';



2

import { openai } from '@ai-sdk/openai';



3

import { createProviderRegistry, gateway } from 'ai';



4



5

export const registry = createProviderRegistry({



6

// register provider with prefix and default setup using gateway:



7

gateway,



8



9

// register provider with prefix and direct provider import:



10

anthropic,



11

openai,



12

});
```

### [Setup with Custom Separator](#setup-with-custom-separator)

By default, the registry uses `:` as the separator between provider and model IDs. You can customize this separator:

registry.ts

```
1

import { anthropic } from '@ai-sdk/anthropic';



2

import { openai } from '@ai-sdk/openai';



3

import { createProviderRegistry, gateway } from 'ai';



4



5

export const customSeparatorRegistry = createProviderRegistry(



6

{



7

gateway,



8

anthropic,



9

openai,



10

},



11

{ separator: ' > ' },



12

);
```

### [Example: Use language models](#example-use-language-models)

You can access language models by using the `languageModel` method on the registry.
The provider id will become the prefix of the model id: `providerId:modelId`.

```
1

import { generateText } from 'ai';



2

import { registry } from './registry';



3



4

const { text } = await generateText({



5

model: registry.languageModel('openai:gpt-5.1'), // default separator



6

// or with custom separator:



7

// model: customSeparatorRegistry.languageModel('openai > gpt-5.1'),



8

prompt: 'Invent a new holiday and describe its traditions.',



9

});
```

### [Example: Use text embedding models](#example-use-text-embedding-models)

You can access text embedding models by using the `.embeddingModel` method on the registry.
The provider id will become the prefix of the model id: `providerId:modelId`.

```
1

import { embed } from 'ai';



2

import { registry } from './registry';



3



4

const { embedding } = await embed({



5

model: registry.embeddingModel('openai:text-embedding-3-small'),



6

value: 'sunny day at the beach',



7

});
```

### [Example: Use image models](#example-use-image-models)

You can access image models by using the `imageModel` method on the registry.
The provider id will become the prefix of the model id: `providerId:modelId`.

```
1

import { generateImage } from 'ai';



2

import { registry } from './registry';



3



4

const { image } = await generateImage({



5

model: registry.imageModel('openai:dall-e-3'),



6

prompt: 'A beautiful sunset over a calm ocean',



7

});
```

### [Example: Use video models](#example-use-video-models)

You can access video models by using the `videoModel` method on the registry.
The provider id will become the prefix of the model id: `providerId:modelId`.

```
1

import { experimental_generateVideo } from 'ai';



2

import { fal } from '@ai-sdk/fal';



3

import { createProviderRegistry } from 'ai';



4



5

const registry = createProviderRegistry({ fal });



6



7

const { videos } = await experimental_generateVideo({



8

model: registry.videoModel('fal:luma-dream-machine/ray-2'),



9

prompt: 'A cat walking on a beach at sunset',



10

});
```

### [Example: Use files interface](#example-use-files-interface)

You can access a provider's files interface by calling `registry.files(providerId)`.
This is useful when you want to upload files through a provider in the registry before referencing them in model requests.

```
1

import { openai } from '@ai-sdk/openai';



2

import {



3

createProviderRegistry,



4

customProvider,



5

generateText,



6

uploadFile,



7

} from 'ai';



8



9

const registry = createProviderRegistry({



10

openai: customProvider({



11

languageModels: { 'gpt-4o-mini': openai.responses('gpt-4o-mini') },



12

files: openai.files(),



13

}),



14

});



15



16

const { providerReference } = await uploadFile({



17

api: registry.files('openai'),



18

data: fileData,



19

filename: 'image.png',



20

});



21



22

const { text } = await generateText({



23

model: registry.languageModel('openai:gpt-4o-mini'),



24

messages: [



25

{



26

role: 'user',



27

content: [



28

{ type: 'text', text: 'Describe what you see in this image.' },



29

{ type: 'file', mediaType: 'image', data: providerReference },



30

],



31

},



32

],



33

});
```

### [Example: Use skills interface](#example-use-skills-interface)

You can access a provider's skills interface by calling `registry.skills(providerId)`.

```
1

import { anthropic } from '@ai-sdk/anthropic';



2

import { createProviderRegistry, customProvider, uploadSkill } from 'ai';



3



4

const registry = createProviderRegistry({



5

anthropic: customProvider({



6

languageModels: { sonnet: anthropic('claude-sonnet-4-5') },



7

skills: anthropic.skills(),



8

}),



9

});



10



11

await uploadSkill({



12

api: registry.skills('anthropic'),



13

files: skillFiles,



14

displayTitle: 'My Skill',



15

});
```

[Combining Custom Providers, Provider Registry, and Middleware](#combining-custom-providers-provider-registry-and-middleware)
-----------------------------------------------------------------------------------------------------------------------------

The central idea of provider management is to set up a file that contains all the providers and models you want to use.
You may want to pre-configure model settings, provide model name aliases, limit the available models, and more.

Here is an example that implements the following concepts:

* pass through gateway with a namespace prefix (here: `gateway > *`)
* pass through a full provider with a namespace prefix (here: `xai > *`)
* setup an OpenAI-compatible provider with custom api key and base URL (here: `custom > *`)
* setup model name aliases (here: `anthropic > fast`, `anthropic > writing`, `anthropic > reasoning`)
* pre-configure model settings (here: `anthropic > reasoning`)
* validate the provider-specific options (here: `AnthropicLanguageModelOptions`)
* use a fallback provider (here: `anthropic > *`)
* limit a provider to certain models without a fallback (here: `groq > gemma2-9b-it`, `groq > qwen-qwq-32b`)
* define a custom separator for the provider registry (here: `>`)

```
1

import { anthropic, AnthropicLanguageModelOptions } from '@ai-sdk/anthropic';



2

import { createOpenAICompatible } from '@ai-sdk/openai-compatible';



3

import { xai } from '@ai-sdk/xai';



4

import { groq } from '@ai-sdk/groq';



5

import {



6

createProviderRegistry,



7

customProvider,



8

defaultSettingsMiddleware,



9

gateway,



10

wrapLanguageModel,



11

} from 'ai';



12



13

export const registry = createProviderRegistry(



14

{



15

// pass through gateway with a namespace prefix



16

gateway,



17



18

// pass through full providers with namespace prefixes



19

xai,



20



21

// access an OpenAI-compatible provider with custom setup



22

custom: createOpenAICompatible({



23

name: 'provider-name',



24

apiKey: process.env.CUSTOM_API_KEY,



25

baseURL: 'https://api.custom.com/v1',



26

}),



27



28

// setup model name aliases



29

anthropic: customProvider({



30

languageModels: {



31

fast: anthropic('claude-haiku-4-5'),



32



33

// simple model



34

writing: anthropic('claude-sonnet-4-5'),



35



36

// extended reasoning model configuration:



37

reasoning: wrapLanguageModel({



38

model: anthropic('claude-sonnet-4-5'),



39

middleware: defaultSettingsMiddleware({



40

settings: {



41

maxOutputTokens: 100000, // example default setting



42

providerOptions: {



43

anthropic: {



44

thinking: {



45

type: 'enabled',



46

budgetTokens: 32000,



47

},



48

} satisfies AnthropicLanguageModelOptions,



49

},



50

},



51

}),



52

}),



53

},



54

fallbackProvider: anthropic,



55

}),



56



57

// limit a provider to certain models without a fallback



58

groq: customProvider({



59

languageModels: {



60

'gemma2-9b-it': groq('gemma2-9b-it'),



61

'qwen-qwq-32b': groq('qwen-qwq-32b'),



62

},



63

}),



64

},



65

{ separator: ' > ' },



66

);



67



68

// usage:



69

const model = registry.languageModel('anthropic > reasoning');
```

[Global Provider Configuration](#global-provider-configuration)
---------------------------------------------------------------

The AI SDK 5 includes a global provider feature that allows you to specify a model using just a plain model ID string:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { streamText } from 'ai';



2



3

const result = await streamText({



4

model: "xai/grok-4.6", // Uses the global provider (defaults to gateway)



5

prompt: 'Invent a new holiday and describe its traditions.',



6

});
```

By default, the global provider is set to the Vercel AI Gateway.

### [Customizing the Global Provider](#customizing-the-global-provider)

You can set your own preferred global provider:

setup.ts

```
1

import { openai } from '@ai-sdk/openai';



2



3

// Initialize once during startup:



4

globalThis.AI_SDK_DEFAULT_PROVIDER = openai;
```

app.ts

```
1

import { streamText } from 'ai';



2



3

const result = await streamText({



4

model: 'gpt-5.1', // Uses OpenAI provider without prefix



5

prompt: 'Invent a new holiday and describe its traditions.',



6

});
```

This simplifies provider usage and makes it easier to switch between providers without changing your model references throughout your codebase.

[Experimental evaluation models](#experimental-evaluation-models)
-----------------------------------------------------------------

Custom providers accept `evaluationModels` aliases, and registries expose
`evaluationModel('provider:model')`. These methods return model instances for
`experimental_evaluate`. Direct string IDs use Gateway by default, or an
explicitly configured default provider with an `evaluationModel` method. Registry
middleware for language and image models does not apply to evaluation.
See [Evaluation](/docs/ai-sdk-core/evaluation#model-aliases-and-registries)
for aliases, default-provider configuration, and capability differences.

[Previous

Batch](/docs/ai-sdk-core/batch)[Next

Error Handling](/docs/ai-sdk-core/error-handling)
