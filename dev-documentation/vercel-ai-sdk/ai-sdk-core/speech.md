---
title: "Speech"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/speech
section: ai-sdk-core
crawled: 2026-09-20
---

# Speech

> Source: https://ai-sdk.dev/docs/ai-sdk-core/speech

[AI SDK Core](/docs/ai-sdk-core)Speech


[Speech](#speech)
=================

The AI SDK provides the [`generateSpeech`](/docs/reference/ai-sdk-core/generate-speech)
function to generate speech from text using a speech model.

```
1

import { generateSpeech } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3



4

const audio = await generateSpeech({



5

model: openai.speech('tts-1'),



6

text: 'Hello, world!',



7

voice: 'alloy',



8

});
```

To access the generated audio:

```
1

const audioData = result.audio.uint8Array; // audio data as Uint8Array



2

// or



3

const audioBase64 = result.audio.base64; // audio data as base64 string
```

[Settings](#settings)
---------------------

### [Provider-Specific settings](#provider-specific-settings)

You can set model-specific settings with the `providerOptions` parameter.

```
1

import { generateSpeech } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3



4

const audio = await generateSpeech({



5

model: openai.speech('tts-1'),



6

text: 'Hello, world!',



7

providerOptions: {



8

openai: {



9

// ...



10

},



11

},



12

});
```

### [Abort Signals and Timeouts](#abort-signals-and-timeouts)

`generateSpeech` accepts an optional `abortSignal` parameter of
type [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
that you can use to abort the speech generation process or set a timeout.

```
1

import { openai } from '@ai-sdk/openai';



2

import { generateSpeech } from 'ai';



3



4

const audio = await generateSpeech({



5

model: openai.speech('tts-1'),



6

text: 'Hello, world!',



7

abortSignal: AbortSignal.timeout(1000), // Abort after 1 second



8

});
```

### [Custom Headers](#custom-headers)

`generateSpeech` accepts an optional `headers` parameter of type `Record<string, string>`
that you can use to add custom headers to the speech generation request.

```
1

import { openai } from '@ai-sdk/openai';



2

import { generateSpeech } from 'ai';



3



4

const audio = await generateSpeech({



5

model: openai.speech('tts-1'),



6

text: 'Hello, world!',



7

headers: { 'X-Custom-Header': 'custom-value' },



8

});
```

### [Warnings](#warnings)

Warnings (e.g. unsupported parameters) are available on the `warnings` property.

```
1

import { openai } from '@ai-sdk/openai';



2

import { generateSpeech } from 'ai';



3



4

const audio = await generateSpeech({



5

model: openai.speech('tts-1'),



6

text: 'Hello, world!',



7

});



8



9

const warnings = audio.warnings;
```

### [Error Handling](#error-handling)

When `generateSpeech` cannot generate a valid audio, it throws a [`AI_NoSpeechGeneratedError`](/docs/reference/ai-sdk-errors/ai-no-speech-generated-error).

This error can arise for any of the following reasons:

* The model failed to generate a response
* The model generated a response that could not be parsed

The error preserves the following information to help you log the issue:

* `responses`: Metadata about the speech model responses, including timestamp, model, and headers.
* `cause`: The cause of the error. You can use this for more detailed error handling.

```
1

import { generateSpeech, NoSpeechGeneratedError } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3



4

try {



5

await generateSpeech({



6

model: openai.speech('tts-1'),



7

text: 'Hello, world!',



8

});



9

} catch (error) {



10

if (NoSpeechGeneratedError.isInstance(error)) {



11

console.log('AI_NoSpeechGeneratedError');



12

console.log('Cause:', error.cause);



13

console.log('Responses:', error.responses);



14

}



15

}
```

[Speech Models](#speech-models)
-------------------------------

| Provider | Model |
| --- | --- |
| [OpenAI](/providers/ai-sdk-providers/openai#speech-models) | `tts-1` |
| [OpenAI](/providers/ai-sdk-providers/openai#speech-models) | `tts-1-hd` |
| [OpenAI](/providers/ai-sdk-providers/openai#speech-models) | `gpt-4o-mini-tts` |
| [Mistral](/providers/ai-sdk-providers/mistral#speech-models) | `voxtral-mini-tts-2603` |
| [ElevenLabs](/providers/ai-sdk-providers/elevenlabs#speech-models) | `eleven_v3` |
| [ElevenLabs](/providers/ai-sdk-providers/elevenlabs#speech-models) | `eleven_multilingual_v2` |
| [ElevenLabs](/providers/ai-sdk-providers/elevenlabs#speech-models) | `eleven_flash_v2_5` |
| [ElevenLabs](/providers/ai-sdk-providers/elevenlabs#speech-models) | `eleven_flash_v2` |
| [ElevenLabs](/providers/ai-sdk-providers/elevenlabs#speech-models) | `eleven_turbo_v2_5` |
| [ElevenLabs](/providers/ai-sdk-providers/elevenlabs#speech-models) | `eleven_turbo_v2` |
| [Hume](/providers/ai-sdk-providers/hume#speech-models) | `default` |
| [Google](/providers/ai-sdk-providers/google#speech-models) | `gemini-2.5-flash-preview-tts` |
| [Google](/providers/ai-sdk-providers/google#speech-models) | `gemini-2.5-pro-preview-tts` |
| [Google](/providers/ai-sdk-providers/google#speech-models) | `gemini-3.1-flash-tts-preview` |
| [Google Vertex](/providers/ai-sdk-providers/google-vertex#speech-models) | `gemini-2.5-flash-tts` |
| [Google Vertex](/providers/ai-sdk-providers/google-vertex#speech-models) | `gemini-2.5-pro-tts` |
| [Google Vertex](/providers/ai-sdk-providers/google-vertex#speech-models) | `gemini-2.5-flash-lite-preview-tts` |
| [Google Vertex](/providers/ai-sdk-providers/google-vertex#speech-models) | `gemini-3.1-flash-tts-preview` |
| [xAI](/providers/ai-sdk-providers/xai#speech-models) | `default` |
| [Cartesia](/providers/ai-sdk-providers/cartesia#speech-models) | `sonic-3.5` |
| [Cartesia](/providers/ai-sdk-providers/cartesia#speech-models) | `sonic-3` |
| [Cartesia](/providers/ai-sdk-providers/cartesia#speech-models) | `sonic-2` |
| [Cartesia](/providers/ai-sdk-providers/cartesia#speech-models) | `sonic-turbo` |
| [Fish Audio](/providers/ai-sdk-providers/fish-audio#speech-models) | `s1` |
| [Fish Audio](/providers/ai-sdk-providers/fish-audio#speech-models) | `s2-pro` |
| [Fish Audio](/providers/ai-sdk-providers/fish-audio#speech-models) | `s2.1-pro` |

Above are a small subset of the speech models supported by the AI SDK providers. For more, see the respective provider documentation.

[Previous

Translation](/docs/ai-sdk-core/translation)[Next

Video Generation](/docs/ai-sdk-core/video-generation)
