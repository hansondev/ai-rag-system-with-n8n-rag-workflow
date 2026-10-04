---
title: "Reranking"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/reranking
section: ai-sdk-core
crawled: 2026-09-20
---

# Reranking

> Source: https://ai-sdk.dev/docs/ai-sdk-core/reranking

[AI SDK Core](/docs/ai-sdk-core)Reranking


[Reranking](#reranking)
=======================

Reranking is a technique used to improve search relevance by reordering a set of documents based on their relevance to a query.
Unlike embedding-based similarity search, reranking models are specifically trained to understand the relationship between queries and documents,
often producing more accurate relevance scores.

[Reranking Documents](#reranking-documents)
-------------------------------------------

The AI SDK provides the [`rerank`](/docs/reference/ai-sdk-core/rerank) function to rerank documents based on their relevance to a query.
You can use it with reranking models, e.g. `cohere.reranking('rerank-v3.5')` or `bedrock.reranking('cohere.rerank-v3-5:0')`.

```
1

import { rerank } from 'ai';



2

import { cohere } from '@ai-sdk/cohere';



3



4

const documents = [



5

'sunny day at the beach',



6

'rainy afternoon in the city',



7

'snowy night in the mountains',



8

];



9



10

const { ranking } = await rerank({



11

model: cohere.reranking('rerank-v3.5'),



12

documents,



13

query: 'talk about rain',



14

topN: 2, // Return top 2 most relevant documents



15

});



16



17

console.log(ranking);



18

// [



19

//   { originalIndex: 1, score: 0.9, document: 'rainy afternoon in the city' },



20

//   { originalIndex: 0, score: 0.3, document: 'sunny day at the beach' }



21

// ]
```

[Working with Object Documents](#working-with-object-documents)
---------------------------------------------------------------

Reranking also supports structured documents (JSON objects), making it ideal for searching through databases, emails, or other structured content:

```
1

import { rerank } from 'ai';



2

import { cohere } from '@ai-sdk/cohere';



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

text: 'We are happy to give you a discount of 20% on your next order.',



9

},



10

{



11

from: 'John McGill',



12

subject: 'Missing Info',



13

text: 'Sorry, but here is the pricing information from Oracle: $5000/month',



14

},



15

];



16



17

const { ranking, rerankedDocuments } = await rerank({



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

console.log(rerankedDocuments[0]);



25

// { from: 'John McGill', subject: 'Missing Info', text: '...' }
```

[Understanding the Results](#understanding-the-results)
-------------------------------------------------------

The `rerank` function returns a comprehensive result object:

```
1

import { cohere } from '@ai-sdk/cohere';



2

import { rerank } from 'ai';



3



4

const { ranking, rerankedDocuments, originalDocuments } = await rerank({



5

model: cohere.reranking('rerank-v3.5'),



6

documents: ['sunny day at the beach', 'rainy afternoon in the city'],



7

query: 'talk about rain',



8

});



9



10

// ranking: sorted array of { originalIndex, score, document }



11

// rerankedDocuments: documents sorted by relevance (convenience property)



12

// originalDocuments: original documents array
```

Each item in the `ranking` array contains:

* `originalIndex`: Position in the original documents array
* `score`: Relevance score (typically 0-1, where higher is more relevant)
* `document`: The original document

[Settings](#settings)
---------------------

### [Top-N Results](#top-n-results)

Use `topN` to limit the number of results returned. This is useful for retrieving only the most relevant documents:

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

documents: ['doc1', 'doc2', 'doc3', 'doc4', 'doc5'],



7

query: 'relevant information',



8

topN: 3, // Return only top 3 most relevant documents



9

});
```

### [Provider Options](#provider-options)

Reranking model settings can be configured using `providerOptions` for provider-specific parameters:

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

maxTokensPerDoc: 1000, // Limit tokens per document



11

},



12

},



13

});
```

### [Retries](#retries)

The `rerank` function accepts an optional `maxRetries` parameter of type `number`
that you can use to set the maximum number of retries for the reranking process.
It defaults to `2` retries (3 attempts in total). You can set it to `0` to disable retries.

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

maxRetries: 0, // Disable retries



9

});
```

### [Abort Signals and Timeouts](#abort-signals-and-timeouts)

The `rerank` function accepts an optional `abortSignal` parameter of
type [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
that you can use to abort the reranking process or set a timeout.

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

abortSignal: AbortSignal.timeout(5000), // Abort after 5 seconds



9

});
```

### [Custom Headers](#custom-headers)

The `rerank` function accepts an optional `headers` parameter of type `Record<string, string>`
that you can use to add custom headers to the reranking request.

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

headers: { 'X-Custom-Header': 'custom-value' },



9

});
```

[Response Information](#response-information)
---------------------------------------------

The `rerank` function returns response information that includes the raw provider response:

```
1

import { cohere } from '@ai-sdk/cohere';



2

import { rerank } from 'ai';



3



4

const { ranking, response } = await rerank({



5

model: cohere.reranking('rerank-v3.5'),



6

documents: ['sunny day at the beach', 'rainy afternoon in the city'],



7

query: 'talk about rain',



8

});



9



10

console.log(response); // { id, timestamp, modelId, headers, body }
```

[Reranking Providers & Models](#reranking-providers--models)
------------------------------------------------------------

Several providers offer reranking models:

| Provider | Model |
| --- | --- |
| [Cohere](/providers/ai-sdk-providers/cohere#reranking-models) | `rerank-v3.5` |
| [Cohere](/providers/ai-sdk-providers/cohere#reranking-models) | `rerank-english-v3.0` |
| [Cohere](/providers/ai-sdk-providers/cohere#reranking-models) | `rerank-multilingual-v3.0` |
| [Amazon Bedrock](/providers/ai-sdk-providers/amazon-bedrock#reranking-models) | `amazon.rerank-v1:0` |
| [Amazon Bedrock](/providers/ai-sdk-providers/amazon-bedrock#reranking-models) | `cohere.rerank-v3-5:0` |
| [Together.ai](/providers/ai-sdk-providers/togetherai#reranking-models) | `Salesforce/Llama-Rank-v1` |
| [Together.ai](/providers/ai-sdk-providers/togetherai#reranking-models) | `mixedbread-ai/Mxbai-Rerank-Large-V2` |

[Previous

Embeddings](/docs/ai-sdk-core/embeddings)[Next

Evaluation](/docs/ai-sdk-core/evaluation)
