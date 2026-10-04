---
title: "smoothStream()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/smooth-stream
section: reference
crawled: 2026-09-20
---

# smoothStream()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/smooth-stream

[AI SDK Core](/docs/ai-sdk-core)smoothStream


[`smoothStream()`](#smoothstream)
=================================

`smoothStream` is a utility function that creates a TransformStream
for the `streamText` `transform` option
to smooth out text and reasoning streaming by buffering and releasing complete chunks with configurable delays.
This creates a more natural reading experience when streaming text and reasoning responses.

```
1

import { smoothStream, streamText } from 'ai';



2



3

const result = streamText({



4

model,



5

prompt,



6

experimental_transform: smoothStream({



7

delayInMs: 20, // optional: defaults to 10ms



8

chunking: 'line', // optional: defaults to 'word'



9

}),



10

});
```

[Import](#import)
-----------------

```
import { smoothStream } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### delayInMs?:

number | null

### chunking?:

"word" | "line" | RegExp | Intl.Segmenter | (buffer: string) => string | undefined | null

#### [Word chunking caveats with non-latin languages](#word-chunking-caveats-with-non-latin-languages)

The word based chunking **does not work well** with the following languages that do not delimit words with spaces:

* Chinese
* Japanese
* Korean
* Vietnamese
* Thai

#### [Using Intl.Segmenter (recommended)](#using-intlsegmenter-recommended)

For these languages, we recommend using `Intl.Segmenter` for proper locale-aware word segmentation.
This is the preferred approach as it provides accurate word boundaries for CJK and other languages.

`Intl.Segmenter` is available in Node.js 16+ and all modern browsers (Chrome
87+, Firefox 125+, Safari 14.1+).

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

Japanese example with Intl.Segmenter

```
1

import { smoothStream, streamText } from 'ai';



2



3

const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });



4



5

const result = streamText({



6

model: "xai/grok-4.6",



7

prompt: 'Your prompt here',



8

experimental_transform: smoothStream({



9

chunking: segmenter,



10

}),



11

});
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

Chinese example with Intl.Segmenter

```
1

import { smoothStream, streamText } from 'ai';



2



3

const segmenter = new Intl.Segmenter('zh', { granularity: 'word' });



4



5

const result = streamText({



6

model: "xai/grok-4.6",



7

prompt: 'Your prompt here',



8

experimental_transform: smoothStream({



9

chunking: segmenter,



10

}),



11

});
```

#### [Regex based chunking](#regex-based-chunking)

To use regex based chunking, pass a `RegExp` to the `chunking` option. Global
and sticky expressions are supported. The expression must not match the empty
string.

```
1

// To split on underscores:



2

smoothStream({



3

chunking: /_+/,



4

});



5



6

// Also can do it like this, same behavior



7

smoothStream({



8

chunking: /[^_]*_/,



9

});
```

#### [Custom callback chunking](#custom-callback-chunking)

To use a custom callback for chunking, pass a function to the `chunking` option.

```
1

smoothStream({



2

chunking: text => {



3

const findString = 'some string';



4

const index = text.indexOf(findString);



5



6

if (index === -1) {



7

return null;



8

}



9



10

return text.slice(0, index) + findString;



11

},



12

});
```

### [Returns](#returns)

Returns a `TransformStream` that:

* Buffers incoming text and reasoning chunks
* Releases content when the chunking pattern is encountered
* Adds configurable delays between chunks for smooth output
* Passes through non-text/reasoning chunks (like tool calls, step-finish events) immediately

[Previous

simulateReadableStream](/docs/reference/ai-sdk-core/simulate-readable-stream)[Next

generateId](/docs/reference/ai-sdk-core/generate-id)
