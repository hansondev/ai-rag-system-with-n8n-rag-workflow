---
title: "rerank()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/rerank
section: reference
crawled: 2026-09-20
---

# rerank()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/rerank

[AI SDK Core](/docs/ai-sdk-core)rerank


[`rerank()`](#rerank)
=====================

Rerank a set of documents based on their relevance to a query using a reranking model.

This is ideal for improving search relevance by reordering documents, emails, or other content based on semantic understanding of the query and documents.

```
1

import { cohere } from '@ai-sdk/cohere';



2

import { rerank } from 'ai';



3



4

const { ranking } = await rerank({



5

model: cohere.reranking('rerank-v3.5'),



6

documents: ['sunny day at the beach', 'rainy afternoon in the city'],



7

query: 'talk about rain',



8

});
```

[Import](#import)
-----------------

```
import { rerank } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### model:

RerankingModel

### documents:

Array<VALUE>

### query:

string

### topN?:

number

### maxRetries?:

number

### abortSignal?:

AbortSignal

### headers?:

Record<string, string>

### providerOptions?:

ProviderOptions

### runtimeContext?:

RUNTIME\_CONTEXT

### telemetry?:

TelemetryOptions<RUNTIME\_CONTEXT>

TelemetryOptions

### isEnabled?:

boolean

### recordInputs?:

boolean

### recordOutputs?:

boolean

### functionId?:

string

### includeRuntimeContext?:

{ [KEY in keyof RUNTIME\_CONTEXT]?: boolean }

### integrations?:

Telemetry | Telemetry[]

### onStart?:

(event: RerankStartEvent<RUNTIME\_CONTEXT>) => void | Promise<void>

### onEnd?:

(event: RerankEndEvent<RUNTIME\_CONTEXT>) => void | Promise<void>

### [Returns](#returns)

### originalDocuments:

Array<VALUE>

### rerankedDocuments:

Array<VALUE>

### ranking:

Array<RankingItem<VALUE>>

RankingItem<VALUE>

### originalIndex:

number

### score:

number

### document:

VALUE

### response:

Response

Response

### id?:

string

### timestamp:

Date

### modelId:

string

### headers?:

Record<string, string>

### body?:

unknown

### providerMetadata?:

ProviderMetadata | undefined

[Examples](#examples)
---------------------

### [String Documents](#string-documents)

```
1

import { cohere } from '@ai-sdk/cohere';



2

import { rerank } from 'ai';



3



4

const { ranking, rerankedDocuments } = await rerank({



5

model: cohere.reranking('rerank-v3.5'),



6

documents: [



7

'sunny day at the beach',



8

'rainy afternoon in the city',



9

'snowy night in the mountains',



10

],



11

query: 'talk about rain',



12

topN: 2,



13

});



14



15

console.log(rerankedDocuments);



16

// ['rainy afternoon in the city', 'sunny day at the beach']



17



18

console.log(ranking);



19

// [



20

//   { originalIndex: 1, score: 0.9, document: 'rainy afternoon...' },



21

//   { originalIndex: 0, score: 0.3, document: 'sunny day...' }



22

// ]
```

### [Object Documents](#object-documents)

```
1

import { cohere } from '@ai-sdk/cohere';



2

import { rerank } from 'ai';



3



4

const documents = [



5

{



6

from: 'Paul Doe',



7

subject: 'Follow-up',



8

text: 'We are happy to give you a discount of 20%.',



9

},



10

{



11

from: 'John McGill',



12

subject: 'Missing Info',



13

text: 'Here is the pricing from Oracle: $5000/month',



14

},



15

];



16



17

const { ranking } = await rerank({



18

model: cohere.reranking('rerank-v3.5'),



19

documents,



20

query: 'Which pricing did we get from Oracle?',



21

topN: 1,



22

});



23



24

console.log(ranking[0].document);



25

// { from: 'John McGill', subject: 'Missing Info', ... }
```

### [With Provider Options](#with-provider-options)

```
1

import { cohere } from '@ai-sdk/cohere';



2

import { rerank } from 'ai';



3



4

const { ranking } = await rerank({



5

model: cohere.reranking('rerank-v3.5'),



6

documents: ['sunny day at the beach', 'rainy afternoon in the city'],



7

query: 'talk about rain',



8

providerOptions: {



9

cohere: {



10

maxTokensPerDoc: 1000,



11

},



12

},



13

});
```

[Previous

embedMany](/docs/reference/ai-sdk-core/embed-many)[Next

generateImage](/docs/reference/ai-sdk-core/generate-image)
