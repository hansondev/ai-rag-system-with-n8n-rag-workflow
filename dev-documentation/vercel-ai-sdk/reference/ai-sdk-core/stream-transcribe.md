---
title: "experimental_streamTranscribe()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-transcribe
section: reference
crawled: 2026-09-20
---

# experimental_streamTranscribe()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-transcribe

[AI SDK Core](/docs/ai-sdk-core)experimental\_streamTranscribe


[`experimental_streamTranscribe()`](#experimental_streamtranscribe)
===================================================================

`experimental_streamTranscribe` is an experimental feature.

Streams a transcript from live raw audio using a transcription model with
streaming support.

```
1

import { experimental_streamTranscribe as streamTranscribe } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3



4

const result = streamTranscribe({



5

model: openai.transcription('gpt-realtime-whisper'),



6

audio: audioStream, // ReadableStream<Uint8Array | string>



7

inputAudioFormat: { type: 'audio/pcm', rate: 24000 },



8

});



9



10

for await (const part of result.fullStream) {



11

if (part.type === 'transcript-delta') {



12

process.stdout.write(part.delta);



13

}



14

}



15



16

console.log(await result.text);
```

[Import](#import)
-----------------

```
import { experimental_streamTranscribe as streamTranscribe } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### model:

TranscriptionModelV4

### audio:

ReadableStream<Uint8Array | string>

### inputAudioFormat:

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

AsyncIterableStream<TranscriptionStreamPart>

### text:

Promise<string>

### segments:

Promise<Array<{ text: string; startSecond: number; endSecond: number }>>

### language:

Promise<string | undefined>

### durationInSeconds:

Promise<number | undefined>

### warnings:

Promise<Warning[]>

### responses:

Promise<Array<TranscriptionModelResponseMetadata>>

### providerMetadata:

Promise<Record<string, JSONObject>>

The result promises settle as the stream is consumed. If you stop consuming
`fullStream` early (e.g. `break` out of the loop), the underlying provider
connection is closed and pending result promises reject.

[Wire format (experimental)](#wire-format-experimental)
-------------------------------------------------------

Streaming transcription over WebSocket is serialized with the experimental
transcription-stream envelope defined in `@ai-sdk/provider-utils`
(`experimental_parseTranscriptionStreamClientFrame`,
`experimental_serializeTranscriptionStreamPart`,
`experimental_parseTranscriptionStreamPart`): the client sends one
`transcription-stream.start` TEXT frame, audio as BINARY frames, and a
`transcription-stream.audio-done` TEXT frame; each server TEXT frame is one
JSON-serialized transcription stream part. AI Gateway implements the server
side of this envelope.

[Previous

generateImage](/docs/reference/ai-sdk-core/generate-image)[Next

experimental\_streamTranslate](/docs/reference/ai-sdk-core/stream-translate)
