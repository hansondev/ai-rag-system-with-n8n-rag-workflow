---
title: "File Uploads"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/file-uploads
section: ai-sdk-core
crawled: 2026-09-20
---

# File Uploads

> Source: https://ai-sdk.dev/docs/ai-sdk-core/file-uploads

[AI SDK Core](/docs/ai-sdk-core)File Uploads


[File Uploads](#file-uploads)
=============================

The AI SDK provides the [`uploadFile`](/docs/reference/ai-sdk-core/upload-file)
function to upload files to a provider and get back a `ProviderReference` that can be
used in subsequent API calls.

In the AI SDK, the uploaded file is identified by a `ProviderReference` — a
`Record<string, string>` mapping provider names to provider-specific identifiers.
This concept is used for other provider specific asset references too, such as
uploaded skills.

```
1

import { uploadFile, generateText } from 'ai';



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



10



11

const { text } = await generateText({



12

model: openai.responses('gpt-4o-mini'),



13

messages: [



14

{



15

role: 'user',



16

content: [



17

{ type: 'text', text: 'Describe what you see in this image.' },



18

{ type: 'file', mediaType: 'image', data: providerReference },



19

],



20

},



21

],



22

});
```

As a shorthand, you can pass a provider instance directly to `api` instead of calling `.files()` explicitly — the SDK will call `.files()` for you:

```
1

const { providerReference } = await uploadFile({



2

api: openai, // shorthand for openai.files()



3

data: fs.readFileSync('./photo.png'),



4

filename: 'photo.png',



5

});
```

[Supported File Types](#supported-file-types)
---------------------------------------------

You can upload images, PDFs, text files, and other documents depending on the provider.
The media type is auto-detected from the file bytes when not specified explicitly:

```
1

const { providerReference } = await uploadFile({



2

api: anthropic.files(),



3

data: fs.readFileSync('./document.pdf'),



4

mediaType: 'application/pdf', // optional, auto-detected if omitted



5

filename: 'document.pdf',



6

});
```

Use the `providerReference` in a file content part with its media type:

```
1

{



2

role: 'user',



3

content: [



4

{ type: 'text', text: 'Summarize this document.' },



5

{ type: 'file', data: providerReference, mediaType: 'application/pdf' },



6

],



7

}
```

[Provider-Specific Options](#provider-specific-options)
-------------------------------------------------------

Some providers accept additional options through `providerOptions`.
For example, OpenAI requires a `purpose` field:

```
1

import { openai, type OpenAIFilesOptions } from '@ai-sdk/openai';



2



3

const { providerReference } = await uploadFile({



4

api: openai.files(),



5

data: fs.readFileSync('./photo.png'),



6

providerOptions: {



7

openai: {



8

purpose: 'assistants',



9

} satisfies OpenAIFilesOptions,



10

},



11

});
```

[Streaming Uploads](#streaming-uploads)
---------------------------------------

Providers that support streaming uploads (e.g. OpenAI, xAI) accept a tagged
`{ type: 'stream', stream }` shape, sending the bytes without buffering the
full file in memory. Providers without streaming support reject stream data
with an `UnsupportedFunctionalityError`.

```
1

const { providerReference } = await uploadFile({



2

api: openai.files(),



3

data: { type: 'stream', stream: fileStream },



4

mediaType: 'application/jsonl',



5

filename: 'batch.jsonl',



6

});
```

The provider consumes the stream: any failed upload — including validation
failures before a request is made — cancels it, and it must not be reused. Stream data cannot be sniffed, so `mediaType` defaults to
`application/octet-stream` when omitted, and multipart-based providers default
the filename to `"blob"`.

Uploads can be cancelled with `abortSignal` and carry request-specific
`headers`. Results include `byteSize`, `createdAt`, and `expiresAt` (the
provider-applied retention expiry) when the provider reports them.

[Provider References](#provider-references)
-------------------------------------------

A `ProviderReference` is a `Record<string, string>` that maps provider names to
provider-specific file identifiers:

```
1

// Example ProviderReference



2

{



3

openai: 'file-abc123',



4

}
```

When you pass a `ProviderReference` as the `data` or `image` field of a message content
part, the provider looks up its own file ID from the reference. If the reference doesn't
contain an entry for the current provider, an error is thrown.

[Multi-Provider Usage](#multi-provider-usage)
---------------------------------------------

If you switch providers mid-conversation (for example, continuing a chat started with
OpenAI using Anthropic), you need to upload the file to both providers and merge the
references:

```
1

const openaiResult = await uploadFile({



2

api: openai.files(),



3

data: imageBytes,



4

filename: 'photo.png',



5

});



6



7

const anthropicResult = await uploadFile({



8

api: anthropic.files(),



9

data: imageBytes,



10

filename: 'photo.png',



11

});



12



13

const mergedReference = {



14

...openaiResult.providerReference,



15

...anthropicResult.providerReference,



16

};



17



18

// mergedReference: { openai: 'file-abc123', anthropic: 'file-xyz789' }
```

The merged reference can then be used in messages regardless of which provider processes
the request — each provider will find its own file ID.

[Supported Providers](#supported-providers)
-------------------------------------------

The following providers support `files()` and file uploads:

| Provider | Factory Method |
| --- | --- |
| Anthropic | `anthropic.files()` |
| Google | `google.files()` |
| OpenAI | `openai.files()` |
| xAI | `xai.files()` |

Providers without file upload support will throw an `UnsupportedFunctionalityError`
if they encounter a provider reference in a message.

[Previous

Video Generation](/docs/ai-sdk-core/video-generation)[Next

Language Model Middleware](/docs/ai-sdk-core/middleware)
