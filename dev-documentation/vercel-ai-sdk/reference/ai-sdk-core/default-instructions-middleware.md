---
title: "defaultInstructionsMiddleware()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/default-instructions-middleware
section: reference
crawled: 2026-09-20
---

# defaultInstructionsMiddleware()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/default-instructions-middleware

[AI SDK Core](/docs/ai-sdk-core)defaultInstructionsMiddleware


[`defaultInstructionsMiddleware()`](#defaultinstructionsmiddleware)
===================================================================

`defaultInstructionsMiddleware` applies default instructions to language model
calls that do not already contain a system message. This is useful for
configuring reusable model behavior while allowing call-level `instructions` to
take precedence.

[Import](#import)
-----------------

```
import { defaultInstructionsMiddleware } from "ai"
```

[API Signature](#api-signature)
-------------------------------

```
1

function defaultInstructionsMiddleware(options: {



2

instructions: Instructions;



3

}): LanguageModelMiddleware;
```

### [Parameters](#parameters)

### instructions:

string | SystemModelMessage | Array<SystemModelMessage>

### [Returns](#returns)

Returns a
[LanguageModelMiddleware](/docs/ai-sdk-core/middleware) that:

* Prepends the configured instructions to calls without a system message.
* Preserves instruction-level `providerOptions`.
* Leaves calls containing any system message unchanged, so call-level
  instructions take precedence.
* Applies to both non-streaming and streaming language model calls.

[Usage Example](#usage-example)
-------------------------------

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import {



2

defaultInstructionsMiddleware,



3

generateText,



4

wrapLanguageModel,



5

} from 'ai';



6



7

const model = wrapLanguageModel({



8

model: "xai/grok-4.6",



9

middleware: defaultInstructionsMiddleware({



10

instructions: 'You are a concise technical assistant.',



11

}),



12

});



13



14

const defaultResult = await generateText({



15

model,



16

prompt: 'Explain HTTP caching.',



17

});



18



19

const overriddenResult = await generateText({



20

model,



21

instructions: 'Explain concepts for a complete beginner.',



22

prompt: 'Explain HTTP caching.',



23

});
```

You can attach provider options to default instructions by using a
`SystemModelMessage`:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const model = wrapLanguageModel({



2

model: "xai/grok-4.6",



3

middleware: defaultInstructionsMiddleware({



4

instructions: {



5

role: 'system',



6

content: 'You are a concise technical assistant.',



7

providerOptions: {



8

anthropic: {



9

cacheControl: { type: 'ephemeral' },



10

},



11

},



12

},



13

}),



14

});
```

This middleware provides defaults, not enforced instructions. Any system
message in the normalized prompt suppresses the defaults. Only use
`allowSystemInMessages` with trusted message histories, because an untrusted
system message could override the configured defaults.

[Previous

simulateStreamingMiddleware](/docs/reference/ai-sdk-core/simulate-streaming-middleware)[Next

defaultSettingsMiddleware](/docs/reference/ai-sdk-core/default-settings-middleware)
