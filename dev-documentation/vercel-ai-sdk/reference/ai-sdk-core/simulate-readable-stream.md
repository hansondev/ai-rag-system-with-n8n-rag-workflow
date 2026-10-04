---
title: "simulateReadableStream()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/simulate-readable-stream
section: reference
crawled: 2026-09-20
---

# simulateReadableStream()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/simulate-readable-stream

[AI SDK Core](/docs/ai-sdk-core)simulateReadableStream


[`simulateReadableStream()`](#simulatereadablestream)
=====================================================

`simulateReadableStream` is a utility function that creates a ReadableStream which emits provided values sequentially with configurable delays. This is particularly useful for testing streaming functionality or simulating time-delayed data streams.

```
1

import { simulateReadableStream } from 'ai';



2



3

const stream = simulateReadableStream({



4

chunks: ['Hello', ' ', 'World'],



5

initialDelayInMs: 100,



6

chunkDelayInMs: 50,



7

});
```

[Import](#import)
-----------------

```
import { simulateReadableStream } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### chunks:

T[]

### initialDelayInMs?:

number | null

### chunkDelayInMs?:

number | null

### [Returns](#returns)

Returns a `ReadableStream<T>` that:

* Emits each value from the provided `chunks` array sequentially
* Waits for `initialDelayInMs` before emitting the first value (if not `null`)
* Waits for `chunkDelayInMs` between emitting subsequent values (if not `null`)
* Closes automatically after all chunks have been emitted

### [Type Parameters](#type-parameters)

* `T`: The type of values contained in the chunks array and emitted by the stream

[Examples](#examples)
---------------------

### [Basic Usage](#basic-usage)

```
1

const stream = simulateReadableStream({



2

chunks: ['Hello', ' ', 'World'],



3

});
```

### [With Delays](#with-delays)

```
1

const stream = simulateReadableStream({



2

chunks: ['Hello', ' ', 'World'],



3

initialDelayInMs: 1000, // Wait 1 second before first chunk



4

chunkDelayInMs: 500, // Wait 0.5 seconds between chunks



5

});
```

### [Without Delays](#without-delays)

```
1

const stream = simulateReadableStream({



2

chunks: ['Hello', ' ', 'World'],



3

initialDelayInMs: null, // No initial delay



4

chunkDelayInMs: null, // No delay between chunks



5

});
```

[Previous

isLoopFinished](/docs/reference/ai-sdk-core/loop-finished)[Next

smoothStream](/docs/reference/ai-sdk-core/smooth-stream)
