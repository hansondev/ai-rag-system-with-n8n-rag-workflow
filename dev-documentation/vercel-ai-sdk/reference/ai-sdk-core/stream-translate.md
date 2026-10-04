---
title: "experimental_streamTranslate()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-translate
section: reference
crawled: 2026-09-20
---

# experimental_streamTranslate()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-translate

[AI SDK Core](/docs/ai-sdk-core)experimental\_streamTranslate


[`experimental_streamTranslate()`](#experimental_streamtranslate)
=================================================================

`experimental_streamTranslate` is an experimental feature.

Streams a speech-to-speech translation from live raw audio. Models translate
live source audio into target-language audio and text.

`experimental_streamTranslate` is built on the speech translation model
specification (`Experimental_SpeechTranslationModelV4`). Provider
implementations of the specification ship separately — see your provider's
documentation for available translation models.

```
1

import { experimental_streamTranslate as streamTranslate } from 'ai';



2



3

const result = streamTranslate({



4

// any provider model instance that implements the experimental



5

// speech translation model specification (Experimental_SpeechTranslationModelV4):



6

model: translationModel,



7

audio: audioStream, // ReadableStream<Uint8Array | string>



8

inputAudioFormat: { type: 'audio/pcm', rate: 24000 },



9

targetLanguage: 'es',



10

});



11



12

for await (const part of result.fullStream) {



13

if (part.type === 'output-text-delta') {



14

process.stdout.write(part.delta);



15

}



16

}



17



18

console.log(await result.translationText);
```

[Import](#import)
-----------------

```
import { experimental_streamTranslate as streamTranslate } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### model:

Experimental\_SpeechTranslationModelV4

### audio:

ReadableStream<Uint8Array | string>

### inputAudioFormat:

{ type: string; rate?: number }

### targetLanguage:

string

### sourceLanguage?:

string

### outputAudioFormat?:

{ type: string; rate?: number }

### providerOptions?:

Record<string, JSONObject>

### abortSignal?:

AbortSignal

### headers?:

Record<string, string>

### includeRawChunks?:

boolean

### [Returns](#returns)

### fullStream:

AsyncIterableStream<TranslationStreamPart>

### sourceText:

Promise<string>

### translationText:

Promise<string>

### durationInSeconds:

Promise<number | undefined>

### usage:

Promise<Experimental\_SpeechTranslationModelV4Usage | undefined>

### warnings:

Promise<Warning[]>

### response:

Promise<SpeechTranslationModelResponseMetadata>

### providerMetadata:

Promise<Record<string, JSONObject>>

The result promises settle as the stream is consumed. If you stop consuming
`fullStream` early (e.g. `break` out of the loop), the underlying provider
connection is closed and pending result promises reject.

[Previous

experimental\_streamTranscribe](/docs/reference/ai-sdk-core/stream-transcribe)[Next

transcribe](/docs/reference/ai-sdk-core/transcribe)
