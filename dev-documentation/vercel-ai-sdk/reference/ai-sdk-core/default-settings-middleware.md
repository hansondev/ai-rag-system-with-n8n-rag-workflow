---
title: "defaultSettingsMiddleware()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/default-settings-middleware
section: reference
crawled: 2026-09-20
---

# defaultSettingsMiddleware()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/default-settings-middleware

[AI SDK Core](/docs/ai-sdk-core)defaultSettingsMiddleware


[`defaultSettingsMiddleware()`](#defaultsettingsmiddleware)
===========================================================

`defaultSettingsMiddleware` is a middleware function that applies default settings to language model calls. This is useful when you want to establish consistent default parameters across multiple model invocations.

To apply default system instructions, use
[`defaultInstructionsMiddleware`](/docs/reference/ai-sdk-core/default-instructions-middleware).

```
1

import { defaultSettingsMiddleware } from 'ai';



2



3

const middleware = defaultSettingsMiddleware({



4

settings: {



5

temperature: 0.7,



6

maxOutputTokens: 1000,



7

// other settings...



8

},



9

});
```

[Import](#import)
-----------------

```
import { defaultSettingsMiddleware } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

The middleware accepts a configuration object with the following properties:

* `settings`: An object containing default parameter values to apply to language model calls. These can include any valid `LanguageModelV4CallOptions` properties and optional provider metadata.

### [Returns](#returns)

Returns a middleware object that:

* Merges the default settings with the parameters provided in each model call
* Ensures that explicitly provided parameters take precedence over defaults
* Merges provider metadata objects

### [Usage Example](#usage-example)

```
1

import { streamText, wrapLanguageModel, defaultSettingsMiddleware } from 'ai';



2



3

// Create a model with default settings



4

const modelWithDefaults = wrapLanguageModel({



5

model: gateway('anthropic/claude-sonnet-4.5'),



6

middleware: defaultSettingsMiddleware({



7

settings: {



8

providerOptions: {



9

openai: {



10

reasoningEffort: 'high',



11

},



12

},



13

},



14

}),



15

});



16



17

// Use the model - default settings will be applied



18

const result = await streamText({



19

model: modelWithDefaults,



20

prompt: 'Your prompt here',



21

// These parameters will override the defaults



22

temperature: 0.8,



23

});
```

[How It Works](#how-it-works)
-----------------------------

The middleware:

1. Takes a set of default settings as configuration
2. Merges these defaults with the parameters provided in each model call
3. Ensures that explicitly provided parameters take precedence over defaults
4. Merges provider metadata objects from both sources

[Previous

defaultInstructionsMiddleware](/docs/reference/ai-sdk-core/default-instructions-middleware)[Next

addToolInputExamplesMiddleware](/docs/reference/ai-sdk-core/add-tool-input-examples-middleware)
