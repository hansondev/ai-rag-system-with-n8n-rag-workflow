---
title: "uploadFile()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/upload-file
section: reference
crawled: 2026-09-20
---

# uploadFile()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/upload-file

[AI SDK Core](/docs/ai-sdk-core)uploadFile


[`uploadFile()`](#uploadfile)
=============================

Uploads a file to a provider and returns a `ProviderReference` that can be used in
subsequent API calls, such as in message content parts passed to `generateText` or
`streamText`.

```
1

import { uploadFile } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3

import fs from 'node:fs';



4



5

const { providerReference } = await uploadFile({



6

api: openai.files(),



7

data: fs.readFileSync('./photo.png'),



8

filename: 'photo.png',



9

});
```

[Import](#import)
-----------------

```
import { uploadFile } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### api:

FilesV4 | ProviderV4

### data:

DataContent | { type: "stream"; stream: ReadableStream<Uint8Array> }

### mediaType?:

string

### filename?:

string

### abortSignal?:

AbortSignal

### headers?:

Record<string, string>

### providerOptions?:

ProviderOptions

### [Returns](#returns)

### providerReference:

ProviderReference

### byteSize?:

number

### createdAt?:

Date

### expiresAt?:

Date

### providerMetadata?:

ProviderMetadata

### warnings:

Warning[]

[Previous

experimental\_evaluate](/docs/reference/ai-sdk-core/evaluate)[Next

uploadSkill](/docs/reference/ai-sdk-core/upload-skill)
