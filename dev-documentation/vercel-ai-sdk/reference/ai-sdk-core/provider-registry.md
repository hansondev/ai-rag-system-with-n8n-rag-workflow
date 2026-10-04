---
title: "createProviderRegistry()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/provider-registry
section: reference
crawled: 2026-09-20
---

# createProviderRegistry()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/provider-registry

[AI SDK Core](/docs/ai-sdk-core)createProviderRegistry


[`createProviderRegistry()`](#createproviderregistry)
=====================================================

When you work with multiple providers and models, it is often desirable to manage them
in a central place and access the models through simple string ids.

`createProviderRegistry` lets you create a registry with multiple providers that you
can access by their ids in the format `providerId:modelId`.

In TypeScript, registry model IDs are inferred from the registered provider IDs.
When a provider exposes literal model ID types, editors can suggest the combined
`providerId:modelId` values.

### [Setup](#setup)

You can create a registry with multiple providers and models using `createProviderRegistry`.

```
1

import { anthropic } from '@ai-sdk/anthropic';



2

import { createOpenAI } from '@ai-sdk/openai';



3

import { createProviderRegistry } from 'ai';



4



5

export const registry = createProviderRegistry({



6

// register provider with prefix and default setup:



7

anthropic,



8



9

// register provider with prefix and custom setup:



10

openai: createOpenAI({



11

apiKey: process.env.OPENAI_API_KEY,



12

}),



13

});
```

### [Custom Separator](#custom-separator)

By default, the registry uses `:` as the separator between provider and model IDs. You can customize this separator by passing a `separator` option:

```
1

const registry = createProviderRegistry(



2

{



3

anthropic,



4

openai,



5

},



6

{ separator: ' > ' },



7

);



8



9

// Now you can use the custom separator



10

const model = registry.languageModel('anthropic > claude-3-opus-20240229');
```

### [Language models](#language-models)

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

model: registry.languageModel('openai:gpt-4.1'),



6

prompt: 'Invent a new holiday and describe its traditions.',



7

});
```

### [Text embedding models](#text-embedding-models)

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

### [Image models](#image-models)

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

### [Video models](#video-models)

You can access video models by using the `videoModel` method on the registry.
The provider id will become the prefix of the model id: `providerId:modelId`.

```
1

import { fal } from '@ai-sdk/fal';



2

import { createProviderRegistry, experimental_generateVideo } from 'ai';



3



4

const registry = createProviderRegistry({ fal });



5



6

const { videos } = await experimental_generateVideo({



7

model: registry.videoModel('fal:luma-dream-machine/ray-2'),



8

prompt: 'A cat walking on a beach at sunset',



9

});
```

### [Files and skills](#files-and-skills)

You can access a provider's files and skills interfaces by calling
`registry.files(providerId)` and `registry.skills(providerId)`.

[Import](#import)
-----------------

```
import { createProviderRegistry } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### providers:

Record<string, Provider>

Provider

### languageModel:

(id: string) => LanguageModel

### embeddingModel:

(id: string) => EmbeddingModel<string>

### imageModel:

(id: string) => ImageModel

### transcriptionModel?:

(id: string) => TranscriptionModel

### speechModel?:

(id: string) => SpeechModel

### rerankingModel?:

(id: string) => RerankingModel

### videoModel?:

(id: string) => VideoModelV4

### files?:

() => FilesV4

### skills?:

() => SkillsV4

### options?:

object

Options

### separator?:

string

### languageModelMiddleware?:

LanguageModelMiddleware | LanguageModelMiddleware[]

### imageModelMiddleware?:

ImageModelMiddleware | ImageModelMiddleware[]

### [Returns](#returns)

The `createProviderRegistry` function returns a `Provider` instance. It has the following methods:

### languageModel:

(id: string) => LanguageModel

### embeddingModel:

(id: string) => EmbeddingModel<string>

### imageModel:

(id: string) => ImageModel

### transcriptionModel:

(id: string) => TranscriptionModel

### speechModel:

(id: string) => SpeechModel

### rerankingModel:

(id: string) => RerankingModel

### videoModel:

(id: string) => VideoModelV4

### files:

(providerId: string) => FilesV4

### skills:

(providerId: string) => SkillsV4

[Experimental evaluation models](#experimental-evaluation-models)
-----------------------------------------------------------------

The inferred return type also exposes `evaluationModel('providerId:modelId')`,
returning `Experimental_EvaluationModelV4`. The provider must expose an
`evaluationModel` factory. Custom separators and model ID
inference work as they do for video models. Language and image middleware do not
wrap evaluation models. `ProviderRegistryProvider` remains a stable interface;
use the inferred return type or `Experimental_EvaluationProviderRegistry` to
retain experimental evaluation access.

Unavailable evaluation capabilities or models throw `NoSuchModelError` with
`modelType: 'evaluationModel'`; unknown registry providers throw
`NoSuchProviderError`. These capabilities are structural extensions and are not
added to the stable `ProviderV4` contract. Direct evaluation string IDs default
to Gateway when no default provider is configured.
See [Evaluation](/docs/ai-sdk-core/evaluation#model-aliases-and-registries)
for runnable usage patterns.

[Previous

Experimental\_SandboxSession](/docs/reference/ai-sdk-core/sandbox)[Next

customProvider](/docs/reference/ai-sdk-core/custom-provider)
