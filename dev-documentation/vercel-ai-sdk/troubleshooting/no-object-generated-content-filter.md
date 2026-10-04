---
title: "Object generation failed with OpenAI"
source_url: https://ai-sdk.dev/docs/troubleshooting/no-object-generated-content-filter
section: troubleshooting
crawled: 2026-09-20
---

# Object generation failed with OpenAI

> Source: https://ai-sdk.dev/docs/troubleshooting/no-object-generated-content-filter

[Troubleshooting](/docs/troubleshooting)Object generation failed with OpenAI


[Object generation failed with OpenAI](#object-generation-failed-with-openai)
=============================================================================

[Issue](#issue)
---------------

When using structured output generation with OpenAI, you may encounter a `NoObjectGeneratedError` with the finish reason `content-filter`. This error occurs when your Zod schema contains incompatible types that OpenAI's structured output feature cannot process.

```
1

// Problematic code - incompatible schema types



2

import { generateText, Output } from 'ai';



3

import { openai } from '@ai-sdk/openai';



4

import { z } from 'zod';



5



6

const result = await generateText({



7

model: openai('gpt-4o-2024-08-06'),



8

output: Output.object({



9

schema: z.object({



10

name: z.string().nullish(), // ❌ .nullish() is not supported



11

email: z.string().optional(), // ❌ .optional() is not supported



12

age: z.number().nullable(), // ✅ .nullable() is supported



13

}),



14

}),



15

prompt: 'Generate a user profile',



16

});



17



18

// Error: NoObjectGeneratedError: No object generated.



19

// Finish reason: content-filter
```

[Background](#background)
-------------------------

OpenAI's structured output generation uses JSON Schema under the hood and has specific requirements for schema compatibility. The Zod methods `.nullish()` and `.optional()` generate JSON Schema patterns that are incompatible with OpenAI's implementation, causing the model to reject the schema and return a content-filter finish reason.

[Solution](#solution)
---------------------

Replace `.nullish()` and `.optional()` with `.nullable()` in your Zod schemas when using structured output generation with OpenAI models.

```
1

import { generateText, Output } from 'ai';



2

import { openai } from '@ai-sdk/openai';



3

import { z } from 'zod';



4



5

// Correct approach - use .nullable()



6

const result = await generateText({



7

model: openai('gpt-4o-2024-08-06'),



8

output: Output.object({



9

schema: z.object({



10

name: z.string().nullable(), // ✅ Use .nullable() instead of .nullish()



11

email: z.string().nullable(), // ✅ Use .nullable() instead of .optional()



12

age: z.number().nullable(),



13

}),



14

}),



15

prompt: 'Generate a user profile',



16

});



17



18

console.log(result.output);



19

// { name: "John Doe", email: "john@example.com", age: 30 }



20

// or { name: null, email: null, age: 25 }
```

### [Schema Type Comparison](#schema-type-comparison)

| Zod Type | Compatible | JSON Schema Behavior |
| --- | --- | --- |
| `.nullable()` | ✅ Yes | Allows `null` or the specified type |
| `.optional()` | ❌ No | Field can be omitted (not supported) |
| `.nullish()` | ❌ No | Allows `null`, `undefined`, or omitted (not supported) |

[Related Information](#related-information)
-------------------------------------------

* For more details on structured output generation, see [Generating Structured Data](/docs/ai-sdk-core/generating-structured-data)
* For OpenAI-specific structured output configuration, see [OpenAI Provider - Structured Outputs](/providers/ai-sdk-providers/openai#structured-outputs)

[Previous

Unsupported model version error](/docs/troubleshooting/unsupported-model-version)[Next

Missing Tool Results Error](/docs/troubleshooting/missing-tool-results-error)
