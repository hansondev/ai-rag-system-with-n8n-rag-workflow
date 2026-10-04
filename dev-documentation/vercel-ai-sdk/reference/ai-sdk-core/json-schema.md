---
title: "jsonSchema()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/json-schema
section: reference
crawled: 2026-09-20
---

# jsonSchema()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/json-schema

[AI SDK Core](/docs/ai-sdk-core)jsonSchema


[`jsonSchema()`](#jsonschema)
=============================

`jsonSchema` is a helper function that creates a JSON schema object that is compatible with the AI SDK.
It takes the JSON schema and an optional validation function as inputs, and can be typed.

You can use it to [generate structured data](/docs/ai-sdk-core/generating-structured-data) and in [tools](/docs/ai-sdk-core/tools-and-tool-calling).

`jsonSchema` is an alternative to using Zod schemas that provides you with flexibility in dynamic situations
(e.g. when using OpenAPI definitions) or for using other validation libraries.

```
1

import { jsonSchema } from 'ai';



2



3

const mySchema = jsonSchema<{



4

recipe: {



5

name: string;



6

ingredients: { name: string; amount: string }[];



7

steps: string[];



8

};



9

}>({



10

type: 'object',



11

properties: {



12

recipe: {



13

type: 'object',



14

properties: {



15

name: { type: 'string' },



16

ingredients: {



17

type: 'array',



18

items: {



19

type: 'object',



20

properties: {



21

name: { type: 'string' },



22

amount: { type: 'string' },



23

},



24

required: ['name', 'amount'],



25

},



26

},



27

steps: {



28

type: 'array',



29

items: { type: 'string' },



30

},



31

},



32

required: ['name', 'ingredients', 'steps'],



33

},



34

},



35

required: ['recipe'],



36

});
```

[Import](#import)
-----------------

```
import { jsonSchema } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### schema:

JSONSchema7

### options:

SchemaOptions

SchemaOptions

### validate?:

(value: unknown) => { success: true; value: OBJECT } | { success: false; error: Error };

### [Returns](#returns)

A JSON schema object that is compatible with the AI SDK.

[Previous

Experimental\_StdioMCPTransport](/docs/reference/ai-sdk-core/mcp-stdio-transport)[Next

zodSchema](/docs/reference/ai-sdk-core/zod-schema)
