---
title: "cosineSimilarity()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/cosine-similarity
section: reference
crawled: 2026-09-20
---

# cosineSimilarity()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/cosine-similarity

[AI SDK Core](/docs/ai-sdk-core)cosineSimilarity


[`cosineSimilarity()`](#cosinesimilarity)
=========================================

When you want to compare the similarity of embeddings, standard vector similarity metrics
like cosine similarity are often used.

`cosineSimilarity` calculates the cosine similarity between two vectors.
A high value (close to 1) indicates that the vectors are very similar, while a low value (close to -1) indicates that they are different.

```
1

import { cosineSimilarity, embedMany } from 'ai';



2



3

const { embeddings } = await embedMany({



4

model: 'openai/text-embedding-3-small',



5

values: ['sunny day at the beach', 'rainy afternoon in the city'],



6

});



7



8

console.log(



9

`cosine similarity: ${cosineSimilarity(embeddings[0], embeddings[1])}`,



10

);
```

[Import](#import)
-----------------

```
import { cosineSimilarity } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### vector1:

number[]

### vector2:

number[]

### [Returns](#returns)

A number between -1 and 1 representing the cosine similarity between the two vectors.

[Previous

customProvider](/docs/reference/ai-sdk-core/custom-provider)[Next

wrapLanguageModel](/docs/reference/ai-sdk-core/wrap-language-model)
