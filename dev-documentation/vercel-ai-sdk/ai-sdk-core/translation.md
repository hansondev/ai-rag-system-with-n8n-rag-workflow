---
title: "Translation"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/translation
section: ai-sdk-core
crawled: 2026-09-20
---

# Translation

> Source: https://ai-sdk.dev/docs/ai-sdk-core/translation

[AI SDK Core](/docs/ai-sdk-core)Translation


[Translation](#translation)
===========================

Speech translation is an experimental feature.

The AI SDK provides the
[`experimental_streamTranslate`](/docs/reference/ai-sdk-core/stream-translate)
function to translate live speech into another language. Translation is a
streaming-only modality: models translate live source audio into
target-language audio and text.

`experimental_streamTranslate` is built on the speech translation model
specification (`Experimental_SpeechTranslationModelV4`).

Provider implementations of the speech translation model specification ship
separately. Pass any model instance that implements
`Experimental_SpeechTranslationModelV4` — see your provider's documentation
for available translation models.

```
1

import { openai } from '@ai-sdk/openai';



2

import { experimental_streamTranslate as streamTranslate } from 'ai';



3



4

const result = streamTranslate({



5

model: openai.translation('gpt-realtime-translate'),



6

audio: audioStream, // ReadableStream<Uint8Array | string>



7

inputAudioFormat: { type: 'audio/pcm', rate: 24000 },



8

targetLanguage: 'es',



9

});



10



11

for await (const part of result.fullStream) {



12

if (part.type === 'output-text-delta') {



13

process.stdout.write(part.delta);



14

}



15



16

if (part.type === 'audio') {



17

// translated audio chunk (Uint8Array or base64 string)



18

}



19



20

if (part.type === 'source-transcript-final') {



21

console.log('source:', part.text);



22

}



23

}



24



25

console.log(await result.translationText);
```

The `audio` stream must contain raw audio chunks. `Uint8Array` chunks are raw
bytes; `string` chunks are base64-encoded raw bytes. Always set
`inputAudioFormat` to match the chunks you send.

`targetLanguage` (and the optional `sourceLanguage`) are BCP-47-style language
tags (e.g. `en`, `es`, `fr-CA`). Supported values are provider-specific and
validated by the provider.

When `sourceLanguage` is absent, providers auto-detect the source language.

`fullStream` is a single-consumer live stream and can only be accessed once.
When you need both stream parts and final results, access `fullStream` first and
await the result promises while or after consuming it. Accessing a result
promise first consumes the stream internally, so `fullStream` is no longer
available. This avoids retaining an unbounded replay buffer for live audio.

To access the final translation metadata:

```
1

const sourceText = await result.sourceText; // final source-language transcript



2

const translationText = await result.translationText; // final translated text



3

const durationInSeconds = await result.durationInSeconds; // duration of the source audio in seconds, if available



4

const usage = await result.usage; // audio/text token usage, if reported
```

A translation stream is considered successful when at least one `audio` part
was emitted or the final output text is non-empty. For providers that produce
only audio output, `translationText` may resolve to an empty string.

[Stream parts](#stream-parts)
-----------------------------

The `fullStream` yields the following part types:

* `audio`: a translated audio chunk in the target language.
* `output-text-delta`: an append-only translated text delta.
* `output-text-final`: final translated text for a provider-defined segment or
  utterance.
* `source-transcript-delta`: an append-only source transcript delta.
* `source-transcript-partial`: non-final source transcript text that may be
  revised by later parts.
* `source-transcript-final`: final source transcript text for a
  provider-defined segment or utterance.
* `raw`: raw provider chunks when `includeRawChunks` is enabled.
* `error`: stream errors.

Output text is append-only: providers stream `output-text-delta` parts and
finalize per-utterance with `output-text-final`. There is no partial/revision
part for output text by design for now.

[Settings](#settings)
---------------------

### [Output audio format](#output-audio-format)

Use `outputAudioFormat` to request a specific audio format for translated
audio chunks. When absent, the provider default output format is used.

```
1

import { openai } from '@ai-sdk/openai';



2

import { experimental_streamTranslate as streamTranslate } from 'ai';



3



4

const result = streamTranslate({



5

model: openai.translation('gpt-realtime-translate'),



6

audio: audioStream,



7

inputAudioFormat: { type: 'audio/pcm', rate: 24000 },



8

outputAudioFormat: { type: 'audio/pcm', rate: 24000 },



9

targetLanguage: 'es',



10

});
```

### [Provider-Specific settings](#provider-specific-settings)

Translation models often have provider or model-specific settings which you can
set using the `providerOptions` parameter.

```
1

import { openai } from '@ai-sdk/openai';



2

import { experimental_streamTranslate as streamTranslate } from 'ai';



3



4

const result = streamTranslate({



5

model: openai.translation('gpt-realtime-translate'),



6

audio: audioStream,



7

inputAudioFormat: { type: 'audio/pcm', rate: 24000 },



8

targetLanguage: 'es',



9

providerOptions: {



10

openai: {



11

// provider-specific options



12

},



13

},



14

});
```

### [Abort Signals](#abort-signals)

Pass an `abortSignal` to cancel the translation:

```
1

import { openai } from '@ai-sdk/openai';



2

import { experimental_streamTranslate as streamTranslate } from 'ai';



3



4

const result = streamTranslate({



5

model: openai.translation('gpt-realtime-translate'),



6

audio: audioStream,



7

inputAudioFormat: { type: 'audio/pcm', rate: 24000 },



8

targetLanguage: 'es',



9

abortSignal: AbortSignal.timeout(60_000), // abort after 1 minute



10

});
```

### [Error Handling](#error-handling)

When `experimental_streamTranslate` cannot produce a translation — no `audio`
part was emitted and the final output text is empty, or the stream ends
without a finish event — it errors with a
[`AI_NoTranslationGeneratedError`](/docs/reference/ai-sdk-errors/ai-no-translation-generated-error).

The error preserves the following information to help you log the issue:

* `response`: Metadata about the speech translation model response, including
  timestamp, model, and headers.
* `cause`: The cause of the error. You can use this for more detailed error
  handling.

```
1

import { openai } from '@ai-sdk/openai';



2

import {



3

experimental_streamTranslate as streamTranslate,



4

NoTranslationGeneratedError,



5

} from 'ai';



6



7

try {



8

const result = streamTranslate({



9

model: openai.translation('gpt-realtime-translate'),



10

audio: audioStream,



11

inputAudioFormat: { type: 'audio/pcm', rate: 24000 },



12

targetLanguage: 'es',



13

});



14



15

console.log(await result.translationText);



16

} catch (error) {



17

if (NoTranslationGeneratedError.isInstance(error)) {



18

console.log('NoTranslationGeneratedError');



19

console.log('Cause:', error.cause);



20

console.log('Response:', error.response);



21

}



22

}
```

[Translation Models](#translation-models)
-----------------------------------------

| Provider | Model |
| --- | --- |
| [OpenAI](/providers/ai-sdk-providers/openai#translation-models) | `gpt-realtime-translate` |
| [Google](/providers/ai-sdk-providers/google#translation-models) | `gemini-3.5-live-translate-preview` |

Above are a small subset of the translation models supported by the AI SDK
providers. For more, see the respective provider documentation.

[Previous

Transcription](/docs/ai-sdk-core/transcription)[Next

Speech](/docs/ai-sdk-core/speech)
