---
title: "Generating Structured Data"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data
section: ai-sdk-core
crawled: 2026-09-20
---

# Generating Structured Data

> Source: https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data

[AI SDK Core](/docs/ai-sdk-core)Generating Structured Data


[Generating Structured Data](#generating-structured-data)
=========================================================

While text generation can be useful, your use case will likely call for generating structured data.
For example, you might want to extract information from text, classify data, or generate synthetic data.

Many language models are capable of generating structured data, often defined as using "JSON modes" or "tools".
However, you need to manually provide schemas and then validate the generated data as LLMs can produce incorrect or incomplete structured data.

The AI SDK standardises structured object generation across model providers
using the `output` property on [`generateText`](/docs/reference/ai-sdk-core/generate-text)
and [`streamText`](/docs/reference/ai-sdk-core/stream-text).
You can use [Zod schemas](/docs/reference/ai-sdk-core/zod-schema), [Valibot](/docs/reference/ai-sdk-core/valibot-schema), or [JSON schemas](/docs/reference/ai-sdk-core/json-schema) to specify the shape of the data that you want,
and the AI model will generate data that conforms to that structure.

Structured output generation is part of the `generateText` and `streamText`
flow. This means you can combine it with tool calling in the same request.

[Generating Structured Outputs](#generating-structured-outputs)
---------------------------------------------------------------

Use `generateText` with `Output.object()` to generate structured data from a prompt.
The schema is also used to validate the generated data, ensuring type safety and correctness.

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

recipe: z.object({



9

name: z.string(),



10

ingredients: z.array(



11

z.object({ name: z.string(), amount: z.string() }),



12

),



13

steps: z.array(z.string()),



14

}),



15

}),



16

}),



17

prompt: 'Generate a lasagna recipe.',



18

});
```

Structured output generation counts as a step in the AI SDK's multi-turn
execution model (where each model call or tool execution is one step). When
combining with tools, account for this in your `stopWhen` configuration.

### [Accessing response headers & body](#accessing-response-headers--body)

Sometimes you need access to the full response from the model provider,
e.g. to access some provider-specific headers or body content.

You can access the raw response headers and body using the `response` property:

```
1

import { generateText, Output } from 'ai';



2



3

const result = await generateText({



4

// ...



5

output: Output.object({ schema }),



6

});



7



8

console.log(JSON.stringify(result.response.headers, null, 2));



9

console.log(JSON.stringify(result.response.body, null, 2));
```

[Stream Structured Outputs](#stream-structured-outputs)
-------------------------------------------------------

Given the added complexity of returning structured data, model response time can be unacceptable for your interactive use case.
With `streamText` and `output`, you can stream the model's structured response as it is generated.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { streamText, Output } from 'ai';



2

import { z } from 'zod';



3



4

const { partialOutputStream } = streamText({



5

model: "xai/grok-4.6",



6

output: Output.object({



7

schema: z.object({



8

recipe: z.object({



9

name: z.string(),



10

ingredients: z.array(



11

z.object({ name: z.string(), amount: z.string() }),



12

),



13

steps: z.array(z.string()),



14

}),



15

}),



16

}),



17

prompt: 'Generate a lasagna recipe.',



18

});



19



20

// use partialOutputStream as an async iterable



21

for await (const partialObject of partialOutputStream) {



22

console.log(partialObject);



23

}
```

You can consume the structured output on the client with the [`useObject`](/docs/reference/ai-sdk-ui/use-object) hook.

### [Error Handling in Streams](#error-handling-in-streams)

`streamText` starts streaming immediately. When errors occur during streaming, they become part of the stream rather than thrown exceptions (to prevent stream crashes).

To handle errors, provide an `onError` callback:

```
1

import { streamText, Output } from 'ai';



2



3

const result = streamText({



4

// ...



5

output: Output.object({ schema }),



6

onError({ error }) {



7

console.error(error); // log to your error tracking service



8

},



9

});
```

For non-streaming error handling with `generateText`, see the [Error Handling](#error-handling) section below.

[Output Types](#output-types)
-----------------------------

The AI SDK supports multiple ways of specifying the expected structure of generated data via the `Output` object. You can select from various strategies for structured/text generation and validation.

### [`Output.text()`](#outputtext)

Use `Output.text()` to generate plain text from a model. This option doesn't enforce any schema on the result: you simply receive the model's text as a string. This is the default behavior when no `output` is specified.

```
1

import { generateText, Output } from 'ai';



2



3

const { output } = await generateText({



4

// ...



5

output: Output.text(),



6

prompt: 'Tell me a joke.',



7

});



8

// output will be a string (the joke)
```

### [`Output.object()`](#outputobject)

Use `Output.object({ schema })` to generate a structured object based on a schema (for example, a Zod schema). The output is type-validated to ensure the returned result matches the schema.

```
1

import { generateText, Output } from 'ai';



2

import { z } from 'zod';



3



4

const { output } = await generateText({



5

// ...



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

// output will be an object matching the schema above
```

Partial outputs streamed via `streamText` cannot be validated against your
provided schema, as incomplete data may not yet conform to the expected
structure.

### [`Output.array()`](#outputarray)

Use `Output.array({ element, minItems, maxItems })` to specify that you expect
an array of typed objects from the model. Each element must conform to the
`element` schema, and the optional bounds constrain the number of elements.

```
1

import { generateText, Output } from 'ai';



2

import { z } from 'zod';



3



4

const { output } = await generateText({



5

// ...



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

// output will be an array of objects like:



18

// [



19

//   { location: 'San Francisco', temperature: 70, condition: 'Sunny' },



20

//   { location: 'Paris', temperature: 65, condition: 'Cloudy' },



21

// ]
```

`minItems` and `maxItems` must be non-negative integers, and `minItems` cannot
be greater than `maxItems`. Use the same value for both options to require an
exact length. The bounds are sent to providers as part of the structured output
schema when supported, and the AI SDK independently validates the final output.

When streaming arrays with `streamText`, you can use `elementStream` to receive each completed element as it is generated:

```
1

import { streamText, Output } from 'ai';



2

import { z } from 'zod';



3



4

const { elementStream } = streamText({



5

// ...



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
element schema. This differs from `partialOutputStream`, which streams the
entire partial array including incomplete elements. If the model generates
more than `maxItems`, `elementStream` errors before emitting the first excess
element. This does not automatically abort provider generation, and the final
`output` promise rejects.

### [`Output.choice()`](#outputchoice)

Use `Output.choice({ options })` when you expect the model to choose from a specific set of string options, such as for classification or fixed-enum answers.

```
1

import { generateText, Output } from 'ai';



2



3

const { output } = await generateText({



4

// ...



5

output: Output.choice({



6

options: ['sunny', 'rainy', 'snowy'],



7

}),



8

prompt: 'Is the weather sunny, rainy, or snowy today?',



9

});



10

// output will be one of: 'sunny', 'rainy', or 'snowy'
```

You can provide any set of string options, and the output will always be a single string value that matches one of the specified options. The AI SDK validates that the result matches one of your options, and will throw if the model returns something invalid.

This is especially useful for making classification-style generations or forcing valid values for API compatibility.

### [`Output.json()`](#outputjson)

Use `Output.json()` when you want to generate and parse unstructured JSON values from the model, without enforcing a specific schema. This is useful if you want to capture arbitrary objects, flexible structures, or when you want to rely on the model's natural output rather than rigid validation.

```
1

import { generateText, Output } from 'ai';



2



3

const { output } = await generateText({



4

// ...



5

output: Output.json(),



6

prompt:



7

'For each city, return the current temperature and weather condition as a JSON object.',



8

});



9



10

// output could be any valid JSON, for example:



11

// {



12

//   "San Francisco": { "temperature": 70, "condition": "Sunny" },



13

//   "Paris": { "temperature": 65, "condition": "Cloudy" }



14

// }
```

With `Output.json`, the AI SDK only checks that the response is valid JSON; it doesn't validate the structure or types of the values. If you need schema validation, use the `.object` or `.array` outputs instead.

For more advanced validation or different structures, see [the Output API reference](/docs/reference/ai-sdk-core/output).

[Generating Structured Outputs with Tools](#generating-structured-outputs-with-tools)
-------------------------------------------------------------------------------------

One of the key advantages of using structured output with `generateText` and `streamText` is the ability to combine it with tool calling.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, Output, tool, isStepCount } from 'ai';



2

import { z } from 'zod';



3



4

const { output } = await generateText({



5

model: "xai/grok-4.6",



6

tools: {



7

weather: tool({



8

description: 'Get the weather for a location',



9

inputSchema: z.object({ location: z.string() }),



10

execute: async ({ location }) => {



11

// fetch weather data



12

return { temperature: 72, condition: 'sunny' };



13

},



14

}),



15

},



16

output: Output.object({



17

schema: z.object({



18

summary: z.string(),



19

recommendation: z.string(),



20

}),



21

}),



22

stopWhen: isStepCount(5),



23

prompt: 'What should I wear in San Francisco today?',



24

});
```

When using tools with structured output, remember that generating the
structured output counts as a step. Configure `stopWhen` to allow enough steps
for both tool execution and output generation.

[Property Descriptions](#property-descriptions)
-----------------------------------------------

You can add `.describe("...")` to individual schema properties to give the model hints about what each property is for. This helps improve the quality and accuracy of generated structured data:

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

name: z.string().describe('The name of the recipe'),



9

ingredients: z



10

.array(



11

z.object({



12

name: z.string(),



13

amount: z



14

.string()



15

.describe('The amount of the ingredient (grams or ml)'),



16

}),



17

)



18

.describe('List of ingredients with amounts'),



19

steps: z.array(z.string()).describe('Step-by-step cooking instructions'),



20

}),



21

}),



22

prompt: 'Generate a lasagna recipe.',



23

});
```

Property descriptions are particularly useful for:

* Clarifying ambiguous property names
* Specifying expected formats or conventions
* Providing context for complex nested structures

[Output Name and Description](#output-name-and-description)
-----------------------------------------------------------

You can optionally specify a `name` and `description` for the output. These are used by some providers for additional LLM guidance, e.g. via tool or schema name.

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

name: 'Recipe',



8

description: 'A recipe for a dish.',



9

schema: z.object({



10

name: z.string(),



11

ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),



12

steps: z.array(z.string()),



13

}),



14

}),



15

prompt: 'Generate a lasagna recipe.',



16

});
```

This works with all output types that support structured generation:

* `Output.object({ name, description, schema })`
* `Output.array({ name, description, element, minItems, maxItems })`
* `Output.choice({ name, description, options })`
* `Output.json({ name, description })`

[Accessing Reasoning](#accessing-reasoning)
-------------------------------------------

You can access the reasoning used by the language model to generate the object via the `reasoning` property on the result. This property contains a string with the model's thought process, if available.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, Output } from 'ai';



2

import { z } from 'zod';



3



4

const result = await generateText({



5

model: "xai/grok-4.6", // must be a reasoning model



6

output: Output.object({



7

schema: z.object({



8

recipe: z.object({



9

name: z.string(),



10

ingredients: z.array(



11

z.object({



12

name: z.string(),



13

amount: z.string(),



14

}),



15

),



16

steps: z.array(z.string()),



17

}),



18

}),



19

}),



20

prompt: 'Generate a lasagna recipe.',



21

});



22



23

console.log(result.reasoningText);
```

[Error Handling](#error-handling)
---------------------------------

`generateText` can report structured output failures in two ways:

* If the model response cannot be parsed or validated against the schema,
  `generateText` rejects with an
  [`AI_NoObjectGeneratedError`](/docs/reference/ai-sdk-errors/ai-no-object-generated-error).
* If `generateText` returns a result without an output, accessing `result.output`
  throws an
  [`AI_NoOutputGeneratedError`](/docs/reference/ai-sdk-errors/ai-no-output-generated-error).
  This can happen when the final step does not finish with a `stop` reason, for
  example when it finishes with `tool-calls`.

The `output` property is a getter, so destructuring it also triggers this
access.

`NoObjectGeneratedError` preserves the following information to help you log
the issue:

* `text`: The text that was generated by the model. This can be the raw text or the tool call text, depending on the object generation mode.
* `response`: Metadata about the language model response, including response id, timestamp, and model.
* `usage`: Request token usage.
* `cause`: The cause of the error (e.g. a JSON parsing error). You can use this for more detailed error handling.

```
1

import {



2

generateText,



3

NoObjectGeneratedError,



4

NoOutputGeneratedError,



5

Output,



6

} from 'ai';



7



8

try {



9

const result = await generateText({



10

model,



11

output: Output.object({ schema }),



12

prompt,



13

});



14



15

console.log(result.output);



16

} catch (error) {



17

if (NoObjectGeneratedError.isInstance(error)) {



18

console.log('NoObjectGeneratedError');



19

console.log('Cause:', error.cause);



20

console.log('Text:', error.text);



21

console.log('Response:', error.response);



22

console.log('Usage:', error.usage);



23

} else if (NoOutputGeneratedError.isInstance(error)) {



24

console.log('NoOutputGeneratedError');



25

}



26

}
```

[More Examples](#more-examples)
-------------------------------

You can see structured output generation in action using various frameworks in the following examples:

### [`generateText` with Output](#generatetext-with-output)

[Learn to generate structured data in Node.js](/examples/node/generating-structured-data/generate-object)[Learn to generate structured data in Next.js with Route Handlers (AI SDK UI)](/examples/next-pages/basics/generating-object)[Learn to generate structured data in Next.js with Server Actions (AI SDK RSC)](/examples/next-app/basics/generating-object)

### [`streamText` with Output](#streamtext-with-output)

[Learn to stream structured data in Node.js](/examples/node/streaming-structured-data/stream-object)[Learn to stream structured data in Next.js with Route Handlers (AI SDK UI)](/examples/next-pages/basics/streaming-object-generation)[Learn to stream structured data in Next.js with Server Actions (AI SDK RSC)](/examples/next-app/basics/streaming-object-generation)

[Previous

Generating Text](/docs/ai-sdk-core/generating-text)[Next

Tool Calling](/docs/ai-sdk-core/tools-and-tool-calling)
