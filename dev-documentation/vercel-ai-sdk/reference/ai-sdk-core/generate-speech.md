---
title: "generateSpeech()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-speech
section: reference
crawled: 2026-09-20
---

# generateSpeech()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-speech

[AI SDK Core](/docs/ai-sdk-core)generateSpeech


[`generateSpeech()`](#generatespeech)
=====================================

Generates speech audio from text.

```
1

import { generateSpeech } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3



4

const { audio } = await generateSpeech({



5

model: openai.speech('tts-1'),



6

text: 'Hello from the AI SDK!',



7

voice: 'alloy',



8

});



9



10

console.log(audio);
```

[Examples](#examples)
---------------------

### [OpenAI](#openai)

```
1

import { generateSpeech } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3



4

const { audio } = await generateSpeech({



5

model: openai.speech('tts-1'),



6

text: 'Hello from the AI SDK!',



7

voice: 'alloy',



8

});
```

### [ElevenLabs](#elevenlabs)

```
1

import { generateSpeech } from 'ai';



2

import { elevenLabs } from '@ai-sdk/elevenlabs';



3



4

const { audio } = await generateSpeech({



5

model: elevenLabs.speech('eleven_multilingual_v2'),



6

text: 'Hello from the AI SDK!',



7

voice: 'your-voice-id', // Required: get this from your ElevenLabs account



8

});
```

[Import](#import)
-----------------

```
import { generateSpeech } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### model:

SpeechModelV4

### text:

string

### voice?:

string

### outputFormat?:

string

### instructions?:

string

### speed?:

number

### language?:

string

### providerOptions?:

Record<string, JSONObject>

### maxRetries?:

number

### abortSignal?:

AbortSignal

### headers?:

Record<string, string>

### [Returns](#returns)

### audio:

GeneratedAudioFile

GeneratedAudioFile

### base64:

string

### uint8Array:

Uint8Array

### mediaType:

string

### format:

string

### warnings:

Warning[]

### providerMetadata?:

Record<string, JSONObject>

### responses:

Array<SpeechModelResponseMetadata>

SpeechModelResponseMetadata

### timestamp:

Date

### modelId:

string

### body?:

unknown

### headers?:

Record<string, string>

[Previous

transcribe](/docs/reference/ai-sdk-core/transcribe)[Next

experimental\_generateVideo](/docs/reference/ai-sdk-core/generate-video)
