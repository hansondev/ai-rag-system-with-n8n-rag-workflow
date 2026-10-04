---
title: "transcribe()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/transcribe
section: reference
crawled: 2026-09-20
---

# transcribe()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/transcribe

[AI SDK Core](/docs/ai-sdk-core)transcribe


[`transcribe()`](#transcribe)
=============================

Generates a transcript from an audio file.

```
1

import { transcribe } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3

import { readFile } from 'fs/promises';



4



5

const { text: transcript } = await transcribe({



6

model: openai.transcription('whisper-1'),



7

audio: await readFile('audio.mp3'),



8

});



9



10

console.log(transcript);
```

[Import](#import)
-----------------

```
import { transcribe } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### model:

TranscriptionModelV4

### audio:

DataContent (string | Uint8Array | ArrayBuffer | Buffer) | URL

### providerOptions?:

Record<string, JSONObject>

### maxRetries?:

number

### abortSignal?:

AbortSignal

### headers?:

Record<string, string>

### download?:

(options: { url: URL; abortSignal?: AbortSignal }) => Promise<{ data: Uint8Array; mediaType: string | undefined }>

### [Returns](#returns)

### text:

string

### segments:

Array<{ text: string; startSecond: number; endSecond: number }>

### language:

string | undefined

### durationInSeconds:

number | undefined

### warnings:

Warning[]

### providerMetadata?:

Record<string, JSONObject>

### responses:

Array<TranscriptionModelResponseMetadata>

TranscriptionModelResponseMetadata

### timestamp:

Date

### modelId:

string

### headers?:

Record<string, string>

[Previous

experimental\_streamTranslate](/docs/reference/ai-sdk-core/stream-translate)[Next

generateSpeech](/docs/reference/ai-sdk-core/generate-speech)
