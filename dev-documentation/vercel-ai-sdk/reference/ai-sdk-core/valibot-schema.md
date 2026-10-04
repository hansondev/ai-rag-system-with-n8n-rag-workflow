---
title: "valibotSchema()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/valibot-schema
section: reference
crawled: 2026-09-20
---

# valibotSchema()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/valibot-schema

[AI SDK Core](/docs/ai-sdk-core)valibotSchema


[`valibotSchema()`](#valibotschema)
===================================

`valibotSchema` is a helper function that converts a Valibot schema into a JSON schema object
that is compatible with the AI SDK.
It takes a Valibot schema as input, and returns a typed schema.

You can use it to [generate structured data](/docs/ai-sdk-core/generating-structured-data) and
in [tools](/docs/ai-sdk-core/tools-and-tool-calling).

[Example](#example)
-------------------

```
1

import { valibotSchema } from '@ai-sdk/valibot';



2

import { object, string, array } from 'valibot';



3



4

const recipeSchema = valibotSchema(



5

object({



6

name: string(),



7

ingredients: array(



8

object({



9

name: string(),



10

amount: string(),



11

}),



12

),



13

steps: array(string()),



14

}),



15

);
```

[Import](#import)
-----------------

```
import { valibotSchema } from "@ai-sdk/valibot"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### valibotSchema:

GenericSchema<unknown, T>

### [Returns](#returns)

A Schema object that is compatible with the AI SDK, containing both the JSON schema representation and validation functionality.

[Previous

zodSchema](/docs/reference/ai-sdk-core/zod-schema)[Next

Output](/docs/reference/ai-sdk-core/output)
