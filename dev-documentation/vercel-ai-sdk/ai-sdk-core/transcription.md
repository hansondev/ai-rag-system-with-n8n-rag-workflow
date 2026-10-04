---
title: "Transcription"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/transcription
section: ai-sdk-core
crawled: 2026-09-20
---

# Transcription

> Source: https://ai-sdk.dev/docs/ai-sdk-core/transcription

[AI SDK Core](/docs/ai-sdk-core)Transcription


[Transcription](#transcription)
===============================

The AI SDK provides the [`transcribe`](/docs/reference/ai-sdk-core/transcribe)
function to transcribe audio using a transcription model.

```
1

import { transcribe } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3

import { readFile } from 'fs/promises';



4



5

const transcript = await transcribe({



6

model: openai.transcription('whisper-1'),



7

audio: await readFile('audio.mp3'),



8

});
```

The `audio` property can be a `Uint8Array`, `ArrayBuffer`, `Buffer`, `string` (base64 encoded audio data), or a `URL`.

To access the generated transcript:

```
1

const text = transcript.text; // transcript text e.g. "Hello, world!"



2

const segments = transcript.segments; // array of segments with start and end times, if available



3

const language = transcript.language; // language of the transcript e.g. "en", if available



4

const durationInSeconds = transcript.durationInSeconds; // duration of the transcript in seconds, if available
```

[Streaming Transcription](#streaming-transcription)
---------------------------------------------------

Streaming transcription is an experimental feature.

Use `experimental_streamTranscribe` when you have live raw audio and need transcript updates before the full audio stream is complete. The function uses transcription models with streaming support; provider options configure provider-specific behavior, but the streaming operation is selected by the function itself.

```
1

import { openai } from '@ai-sdk/openai';



2

import { experimental_streamTranscribe as streamTranscribe } from 'ai';



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

providerOptions: {



9

openai: {



10

language: 'en',



11

streaming: {



12

delay: 'low',



13

},



14

},



15

},



16

});



17



18

for await (const part of result.fullStream) {



19

if (part.type === 'transcript-delta') {



20

process.stdout.write(part.delta);



21

}



22



23

if (part.type === 'transcript-partial') {



24

console.log('partial:', part.text);



25

}



26



27

if (part.type === 'transcript-final') {



28

console.log('final:', part.text);



29

}



30

}



31



32

console.log(await result.text);
```

`fullStream` is a single-consumer live stream and can only be accessed once.
When you need both stream parts and final results, access `fullStream` first and
await the result promises while or after consuming it. Accessing a result
promise first consumes the stream internally, so `fullStream` is no longer
available. This avoids retaining an unbounded replay buffer for live audio.

To access the final transcript metadata:

```
1

const text = await result.text; // final transcript text



2

const segments = await result.segments; // final segments with timing, if available



3

const language = await result.language; // language of the transcript, if available



4

const durationInSeconds = await result.durationInSeconds; // duration in seconds, if available
```

The `audio` stream must contain raw audio chunks. `Uint8Array` chunks are raw bytes; `string` chunks are base64-encoded raw bytes. Always set `inputAudioFormat` to match the chunks you send.

String model IDs resolve through the global provider (AI Gateway by
default). AI Gateway supports streaming transcription for supported models
(e.g. `openai/gpt-realtime-whisper`, `elevenlabs/eleven-scribe-2-realtime`,
`xai/grok-stt`), so string IDs work:
`experimental_streamTranscribe({ model: 'openai/gpt-realtime-whisper', ... })`. You can also pass a provider model instance (e.g.
`openai.transcription('gpt-realtime-whisper')`) to stream directly against
the provider.

OpenAI streaming transcription uses `openai.transcription('gpt-realtime-whisper')`.
Cartesia uses `cartesia.transcription('ink-2')` for streaming-only Ink 2
transcription. ElevenLabs uses
`elevenLabs.transcription('scribe_v2_realtime')` for Scribe v2 Realtime. xAI
uses the same `xai.transcription()` model for request/response and streaming
transcription; `experimental_streamTranscribe` selects the provider's
WebSocket STT transport.

```
1

import { xai } from '@ai-sdk/xai';



2

import { experimental_streamTranscribe as streamTranscribe } from 'ai';



3



4

const result = streamTranscribe({



5

model: xai.transcription(),



6

audio: audioStream,



7

inputAudioFormat: { type: 'audio/pcm', rate: 16000 },



8

providerOptions: {



9

xai: {



10

language: 'en',



11

keyterm: ['AI SDK', 'Grok'],



12

streaming: {



13

interimResults: true,



14

endpointing: 500,



15

},



16

},



17

},



18

});
```

Some providers require WebSocket headers for direct streaming STT. In those runtimes, pass a provider-specific `webSocket` implementation when creating the provider.

[Settings](#settings)
---------------------

### [Provider-Specific settings](#provider-specific-settings)

Transcription models often have provider or model-specific settings which you can set using the `providerOptions` parameter.

```
1

import { transcribe } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3

import { readFile } from 'fs/promises';



4



5

const transcript = await transcribe({



6

model: openai.transcription('whisper-1'),



7

audio: await readFile('audio.mp3'),



8

providerOptions: {



9

openai: {



10

timestampGranularities: ['word'],



11

},



12

},



13

});
```

### [Download Size Limits](#download-size-limits)

When `audio` is a URL, the SDK downloads the file with a default **2 GiB** size limit.
You can customize this using `createDownload`:

```
1

import { transcribe, createDownload } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3



4

const transcript = await transcribe({



5

model: openai.transcription('whisper-1'),



6

audio: new URL('https://example.com/audio.mp3'),



7

download: createDownload({ maxBytes: 50 * 1024 * 1024 }), // 50 MB limit



8

});
```

You can also provide a fully custom download function:

```
1

import { transcribe } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3



4

const transcript = await transcribe({



5

model: openai.transcription('whisper-1'),



6

audio: new URL('https://example.com/audio.mp3'),



7

download: async ({ url }) => {



8

const res = await myAuthenticatedFetch(url);



9

return {



10

data: new Uint8Array(await res.arrayBuffer()),



11

mediaType: res.headers.get('content-type') ?? undefined,



12

};



13

},



14

});
```

If a download exceeds the size limit, a `DownloadError` is thrown:

```
1

import { transcribe, DownloadError } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3



4

try {



5

await transcribe({



6

model: openai.transcription('whisper-1'),



7

audio: new URL('https://example.com/audio.mp3'),



8

});



9

} catch (error) {



10

if (DownloadError.isInstance(error)) {



11

console.log('Download failed:', error.message);



12

}



13

}
```

### [Abort Signals and Timeouts](#abort-signals-and-timeouts)

`transcribe` accepts an optional `abortSignal` parameter of
type [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
that you can use to abort the transcription process or set a timeout.

This is particularly useful when combined with URL downloads to prevent long-running requests:

```
1

import { openai } from '@ai-sdk/openai';



2

import { transcribe } from 'ai';



3



4

const transcript = await transcribe({



5

model: openai.transcription('whisper-1'),



6

audio: new URL('https://example.com/audio.mp3'),



7

abortSignal: AbortSignal.timeout(5000), // Abort after 5 seconds



8

});
```

### [Custom Headers](#custom-headers)

`transcribe` accepts an optional `headers` parameter of type `Record<string, string>`
that you can use to add custom headers to the transcription request.

```
1

import { openai } from '@ai-sdk/openai';



2

import { transcribe } from 'ai';



3

import { readFile } from 'fs/promises';



4



5

const transcript = await transcribe({



6

model: openai.transcription('whisper-1'),



7

audio: await readFile('audio.mp3'),



8

headers: { 'X-Custom-Header': 'custom-value' },



9

});
```

### [Warnings](#warnings)

Warnings (e.g. unsupported parameters) are available on the `warnings` property.

```
1

import { openai } from '@ai-sdk/openai';



2

import { transcribe } from 'ai';



3

import { readFile } from 'fs/promises';



4



5

const transcript = await transcribe({



6

model: openai.transcription('whisper-1'),



7

audio: await readFile('audio.mp3'),



8

});



9



10

const warnings = transcript.warnings;
```

### [Error Handling](#error-handling)

When `transcribe` cannot generate a valid transcript, it throws a [`AI_NoTranscriptGeneratedError`](/docs/reference/ai-sdk-errors/ai-no-transcript-generated-error).

This error can arise for any of the following reasons:

* The model failed to generate a response
* The model generated a response that could not be parsed

The error preserves the following information to help you log the issue:

* `responses`: Metadata about the transcription model responses, including timestamp, model, and headers.
* `cause`: The cause of the error. You can use this for more detailed error handling.

```
1

import { transcribe, NoTranscriptGeneratedError } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3

import { readFile } from 'fs/promises';



4



5

try {



6

await transcribe({



7

model: openai.transcription('whisper-1'),



8

audio: await readFile('audio.mp3'),



9

});



10

} catch (error) {



11

if (NoTranscriptGeneratedError.isInstance(error)) {



12

console.log('NoTranscriptGeneratedError');



13

console.log('Cause:', error.cause);



14

console.log('Responses:', error.responses);



15

}



16

}
```

[Transcription Models](#transcription-models)
---------------------------------------------

| Provider | Model |
| --- | --- |
| [OpenAI](/providers/ai-sdk-providers/openai#transcription-models) | `whisper-1` |
| [OpenAI](/providers/ai-sdk-providers/openai#transcription-models) | `gpt-4o-transcribe` |
| [OpenAI](/providers/ai-sdk-providers/openai#transcription-models) | `gpt-4o-mini-transcribe` |
| [OpenAI](/providers/ai-sdk-providers/openai#transcription-models) | `gpt-4o-transcribe-diarize` |
| [ElevenLabs](/providers/ai-sdk-providers/elevenlabs#transcription-models) | `scribe_v1` |
| [ElevenLabs](/providers/ai-sdk-providers/elevenlabs#transcription-models) | `scribe_v1_experimental` |
| [ElevenLabs](/providers/ai-sdk-providers/elevenlabs#transcription-models) | `scribe_v2` |
| [ElevenLabs](/providers/ai-sdk-providers/elevenlabs#streaming-transcription-models) | `scribe_v2_realtime` |
| [Groq](/providers/ai-sdk-providers/groq#transcription-models) | `whisper-large-v3-turbo` |
| [Groq](/providers/ai-sdk-providers/groq#transcription-models) | `whisper-large-v3` |
| [Mistral](/providers/ai-sdk-providers/mistral#transcription-models) | `voxtral-mini-latest` |
| [Azure OpenAI](/providers/ai-sdk-providers/azure#transcription-models) | `whisper-1` |
| [Azure OpenAI](/providers/ai-sdk-providers/azure#transcription-models) | `gpt-4o-transcribe` |
| [Azure OpenAI](/providers/ai-sdk-providers/azure#transcription-models) | `gpt-4o-mini-transcribe` |
| [Rev.ai](/providers/ai-sdk-providers/revai#transcription-models) | `machine` |
| [Rev.ai](/providers/ai-sdk-providers/revai#transcription-models) | `low_cost` |
| [Rev.ai](/providers/ai-sdk-providers/revai#transcription-models) | `fusion` |
| [Deepgram](/providers/ai-sdk-providers/deepgram#transcription-models) | `base` (+ variants) |
| [Deepgram](/providers/ai-sdk-providers/deepgram#transcription-models) | `enhanced` (+ variants) |
| [Deepgram](/providers/ai-sdk-providers/deepgram#transcription-models) | `nova` (+ variants) |
| [Deepgram](/providers/ai-sdk-providers/deepgram#transcription-models) | `nova-2` (+ variants) |
| [Deepgram](/providers/ai-sdk-providers/deepgram#transcription-models) | `nova-3` (+ variants) |
| [Gladia](/providers/ai-sdk-providers/gladia#transcription-models) | `default` |
| [AssemblyAI](/providers/ai-sdk-providers/assemblyai#transcription-models) | `universal-3-5-pro` |
| [AssemblyAI](/providers/ai-sdk-providers/assemblyai#transcription-models) | `universal-3-pro` |
| [Fal](/providers/ai-sdk-providers/fal#transcription-models) | `whisper` |
| [Fal](/providers/ai-sdk-providers/fal#transcription-models) | `wizper` |
| [Google Vertex](/providers/ai-sdk-providers/google-vertex#transcription-models) | `chirp_2` |
| [Google Vertex](/providers/ai-sdk-providers/google-vertex#transcription-models) | `chirp_3` |
| [Google Vertex](/providers/ai-sdk-providers/google-vertex#transcription-models) | `telephony` |
| [xAI](/providers/ai-sdk-providers/xai#transcription-models) | `default` |
| [Cartesia](/providers/ai-sdk-providers/cartesia#transcription-models) | `ink-whisper` |
| [Cartesia](/providers/ai-sdk-providers/cartesia#streaming-transcription-models) | `ink-2` |
| [Fish Audio](/providers/ai-sdk-providers/fish-audio#transcription-models) | `transcribe-1` |

Above are a small subset of the transcription models supported by the AI SDK providers. For more, see the respective provider documentation.

[Previous

Realtime](/docs/ai-sdk-core/realtime)[Next

Translation](/docs/ai-sdk-core/translation)
