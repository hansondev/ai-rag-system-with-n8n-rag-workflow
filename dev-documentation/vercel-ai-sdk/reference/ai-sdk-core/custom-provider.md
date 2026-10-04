---
title: "customProvider()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/custom-provider
section: reference
crawled: 2026-09-20
---

# customProvider()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/custom-provider

[AI SDK Core](/docs/ai-sdk-core)customProvider


[`customProvider()`](#customprovider)
=====================================

With a custom provider, you can map ids to any model.
This allows you to set up custom model configurations, alias names, and more.
The custom provider also supports a fallback provider, which is useful for
wrapping existing providers and adding additional functionality. Custom
providers can expose language, embedding, image, transcription, speech,
reranking, video, files, and skills capabilities.

### [Example: custom model settings](#example-custom-model-settings)

You can create a custom provider using `customProvider`.

```
1

import { openai } from '@ai-sdk/openai';



2

import { customProvider } from 'ai';



3



4

// custom provider with different model settings:



5

export const myOpenAI = customProvider({



6

languageModels: {



7

// replacement model with custom settings:



8

'gpt-5': wrapLanguageModel({



9

model: openai('gpt-5'),



10

middleware: defaultSettingsMiddleware({



11

settings: {



12

providerOptions: {



13

openai: {



14

reasoningEffort: 'high',



15

},



16

},



17

},



18

}),



19

}),



20

// alias model with custom settings:



21

'gpt-4o-reasoning-high': wrapLanguageModel({



22

model: openai('gpt-4o'),



23

middleware: defaultSettingsMiddleware({



24

settings: {



25

providerOptions: {



26

openai: {



27

reasoningEffort: 'high',



28

},



29

},



30

},



31

}),



32

}),



33

},



34

fallbackProvider: openai,



35

});
```

[Import](#import)
-----------------

```
import { customProvider } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### languageModels?:

Record<string, LanguageModel>

### embeddingModels?:

Record<string, EmbeddingModel<string>>

### imageModels?:

Record<string, ImageModel>

### transcriptionModels?:

Record<string, TranscriptionModel>

### speechModels?:

Record<string, SpeechModel>

### rerankingModels?:

Record<string, RerankingModel>

### videoModels?:

Record<string, VideoModel>

### files?:

FilesV4

### skills?:

SkillsV4

### fallbackProvider?:

Provider

### [Returns](#returns)

The `customProvider` function returns a `Provider` instance. It has the following methods:

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

### files?:

() => FilesV4

### skills?:

() => SkillsV4

[Experimental evaluation models](#experimental-evaluation-models)
-----------------------------------------------------------------

Pass `evaluationModels: Record<string, Experimental_EvaluationModel>` to define
aliases for evaluation model instances or string IDs. The returned provider adds
`evaluationModel(alias): Experimental_EvaluationModelV4`. String aliases resolve
through Gateway by default, or an explicitly configured default provider with
an `evaluationModel` method. Unknown aliases use the fallback provider's evaluation
factory when available; model failures and unsupported questions do not trigger
substitution.

Unavailable evaluation capabilities or models throw `NoSuchModelError` with
`modelType: 'evaluationModel'`; unknown registry providers throw
`NoSuchProviderError`. These capabilities are structural extensions and are not
added to the stable `ProviderV4` contract. Direct evaluation string IDs default
to Gateway when no default provider is configured.
See [Evaluation](/docs/ai-sdk-core/evaluation#model-aliases-and-registries)
for runnable usage patterns.

[Previous

createProviderRegistry](/docs/reference/ai-sdk-core/provider-registry)[Next

cosineSimilarity](/docs/reference/ai-sdk-core/cosine-similarity)
