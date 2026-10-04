---
title: "Output"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/output
section: reference
crawled: 2026-09-20
---

# Output

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/output

[AI SDK Core](/docs/ai-sdk-core)Output


[`Output`](#output)
===================

The `Output` object provides output specifications for structured data generation with [`generateText`](/docs/reference/ai-sdk-core/generate-text) and [`streamText`](/docs/reference/ai-sdk-core/stream-text). It allows you to specify the expected shape of the generated data and handles validation automatically.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, Output } from 'ai';



2

import { z } from 'zod';



3



4

const { output } = await generateText({



5

model: "xai/grok-4.6",



6

output: Output.object({



7

schema: z.object({



8

name: z.string(),



9

age: z.number(),



10

}),



11

}),



12

prompt: 'Generate a user profile.',



13

});
```

[Import](#import)
-----------------

```
import { Output } from "ai"
```

[Output Types](#output-types)
-----------------------------

### [`Output.text()`](#outputtext)

Output specification for plain text generation. This is the default behavior when no `output` is specified.

```
1

import { generateText, Output } from 'ai';



2



3

const { output } = await generateText({



4

model: yourModel,



5

output: Output.text(),



6

prompt: 'Tell me a joke.',



7

});



8

// output is a string
```

#### [Parameters](#parameters)

No parameters required.

#### [Returns](#returns)

An `Output<string, string>` specification that generates plain text without schema validation.

---

### [`Output.object()`](#outputobject)

Output specification for typed object generation using schemas. The output is validated against the provided schema to ensure type safety.

```
1

import { generateText, Output } from 'ai';



2

import { z } from 'zod';



3



4

const { output } = await generateText({



5

model: yourModel,



6

output: Output.object({



7

schema: z.object({



8

name: z.string(),



9

age: z.number().nullable(),



10

labels: z.array(z.string()),



11

}),



12

}),



13

prompt: 'Generate information for a test user.',



14

});



15

// output matches the schema type
```

#### [Parameters](#parameters-1)

### schema:

FlexibleSchema<OBJECT>

### name?:

string

### description?:

string

#### [Returns](#returns-1)

An `Output<OBJECT, DeepPartial<OBJECT>>` specification where:

* Complete output is fully validated against the schema
* Partial output (during streaming) is a deep partial version of the schema type

Partial outputs streamed via `streamText` cannot be validated against your
provided schema, as incomplete data may not yet conform to the expected
structure.

---

### [`Output.array()`](#outputarray)

Output specification for generating arrays of typed elements. Each element is validated against the provided element schema.

```
1

import { generateText, Output } from 'ai';



2

import { z } from 'zod';



3



4

const { output } = await generateText({



5

model: yourModel,



6

output: Output.array({



7

element: z.object({



8

location: z.string(),



9

temperature: z.number(),



10

condition: z.string(),



11

}),



12

minItems: 2,



13

maxItems: 2,



14

}),



15

prompt: 'List the weather for San Francisco and Paris.',



16

});



17

// output is an array of weather objects
```

#### [Parameters](#parameters-2)

### element:

FlexibleSchema<ELEMENT>

### minItems?:

number

### maxItems?:

number

### name?:

string

### description?:

string

#### [Returns](#returns-2)

An `Output<Array<ELEMENT>, Array<ELEMENT>>` specification where:

* Complete output is an array with all elements validated
* Complete output is validated against `minItems` and `maxItems`
* Partial output contains only fully validated elements (incomplete elements are excluded)

Set `minItems` and `maxItems` to the same value to require an exact number of
elements. The bounds are included in the provider-facing schema when the
provider supports them. The AI SDK also validates the completed output, so
providers that ignore these schema keywords cannot return an out-of-bounds
result.

#### [Streaming with `elementStream`](#streaming-with-elementstream)

When using `streamText` with `Output.array()`, you can iterate over elements as they are generated using `elementStream`:

```
1

import { streamText, Output } from 'ai';



2

import { z } from 'zod';



3



4

const { elementStream } = streamText({



5

model: yourModel,



6

output: Output.array({



7

element: z.object({



8

name: z.string(),



9

class: z.string(),



10

description: z.string(),



11

}),



12

}),



13

prompt: 'Generate 3 hero descriptions for a fantasy role playing game.',



14

});



15



16

for await (const hero of elementStream) {



17

console.log(hero); // Each hero is complete and validated



18

}
```

Each element emitted by `elementStream` is complete and validated against your
element schema, ensuring type safety for each item as it is generated. If the
model generates more than `maxItems`, `elementStream` errors before emitting
the first excess element. Provider generation is not aborted automatically,
and the final `output` promise also rejects.

---

### [`Output.choice()`](#outputchoice)

Output specification for selecting from a predefined set of string options. Useful for classification tasks or fixed-enum answers.

```
1

import { generateText, Output } from 'ai';



2



3

const { output } = await generateText({



4

model: yourModel,



5

output: Output.choice({



6

options: ['sunny', 'rainy', 'snowy'] as const,



7

}),



8

prompt: 'Is the weather sunny, rainy, or snowy today?',



9

});



10

// output is 'sunny' | 'rainy' | 'snowy'
```

#### [Parameters](#parameters-3)

### options:

Array<CHOICE>

### name?:

string

### description?:

string

#### [Returns](#returns-3)

An `Output<CHOICE, CHOICE>` specification where:

* Complete output is validated to be exactly one of the provided options

---

### [`Output.json()`](#outputjson)

Output specification for unstructured JSON generation. Use this when you want to generate arbitrary JSON without enforcing a specific schema.

```
1

import { generateText, Output } from 'ai';



2



3

const { output } = await generateText({



4

model: yourModel,



5

output: Output.json(),



6

prompt:



7

'For each city, return the current temperature and weather condition as a JSON object.',



8

});



9

// output is any valid JSON value
```

#### [Parameters](#parameters-4)

### name?:

string

### description?:

string

#### [Returns](#returns-4)

An `Output<JSONValue, JSONValue>` specification that:

* Validates that the output is valid JSON
* Does not enforce any specific structure

With `Output.json()`, the AI SDK only checks that the response is valid JSON;
it doesn't validate the structure or types of the values. If you need schema
validation, use `Output.object()` or `Output.array()` instead.

[Error Handling](#error-handling)
---------------------------------

When `generateText` with structured output cannot generate a valid object, it throws a [`NoObjectGeneratedError`](/docs/reference/ai-sdk-errors/ai-no-object-generated-error).

```
1

import { generateText, Output, NoObjectGeneratedError } from 'ai';



2



3

try {



4

await generateText({



5

model: yourModel,



6

output: Output.object({ schema }),



7

prompt: 'Generate a user profile.',



8

});



9

} catch (error) {



10

if (NoObjectGeneratedError.isInstance(error)) {



11

console.log('NoObjectGeneratedError');



12

console.log('Cause:', error.cause);



13

console.log('Text:', error.text);



14

console.log('Response:', error.response);



15

console.log('Usage:', error.usage);



16

}



17

}
```

[See also](#see-also)
---------------------

* [Generating Structured Data](/docs/ai-sdk-core/generating-structured-data)
* [`generateText()`](/docs/reference/ai-sdk-core/generate-text)
* [`streamText()`](/docs/reference/ai-sdk-core/stream-text)
* [`zod-schema`](/docs/reference/ai-sdk-core/zod-schema)
* [`json-schema`](/docs/reference/ai-sdk-core/json-schema)

[Previous

valibotSchema](/docs/reference/ai-sdk-core/valibot-schema)[Next

filterActiveTools](/docs/reference/ai-sdk-core/filter-active-tools)
