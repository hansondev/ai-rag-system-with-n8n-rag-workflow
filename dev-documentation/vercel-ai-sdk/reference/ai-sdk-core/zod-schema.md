---
title: "zodSchema()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/zod-schema
section: reference
crawled: 2026-09-20
---

# zodSchema()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/zod-schema

[AI SDK Core](/docs/ai-sdk-core)zodSchema


[`zodSchema()`](#zodschema)
===========================

`zodSchema` is a helper function that converts a Zod schema into a JSON schema object that is compatible with the AI SDK.
It takes a Zod schema and optional configuration as inputs, and returns a typed schema.

You can use it to [generate structured data](/docs/ai-sdk-core/generating-structured-data) and in [tools](/docs/ai-sdk-core/tools-and-tool-calling).

You can also pass Zod objects directly to the AI SDK functions. Internally,
the AI SDK will convert the Zod schema to a JSON schema using `zodSchema()`.
However, if you want to specify options such as `useReferences`, you can pass
the `zodSchema()` helper function instead.

When using `.meta()` or `.describe()` to add metadata to your Zod schemas,
make sure these methods are called **at the end** of the schema chain.

metadata is attached to a specific schema
instance, and most schema methods (`.min()`, `.optional()`, `.extend()`, etc.)
return a new schema instance that does not inherit metadata from the previous one.
Due to Zod's immutability, metadata is only included in the JSON schema output
if `.meta()` or `.describe()` is the last method in the chain.

```
1

// ❌ Metadata will be lost - .min() returns a new instance without metadata



2

z.string().meta({ describe: 'first name' }).min(1);



3



4

// ✅ Metadata is preserved - .meta() is the final method



5

z.string().min(1).meta({ describe: 'first name' });
```

[Example with recursive schemas](#example-with-recursive-schemas)
-----------------------------------------------------------------

```
1

import { zodSchema } from 'ai';



2

import { z } from 'zod';



3



4

// Define a base category schema



5

const baseCategorySchema = z.object({



6

name: z.string(),



7

});



8



9

// Define the recursive Category type



10

type Category = z.infer<typeof baseCategorySchema> & {



11

subcategories: Category[];



12

};



13



14

// Create the recursive schema using z.lazy



15

const categorySchema: z.ZodType<Category> = baseCategorySchema.extend({



16

subcategories: z.lazy(() => categorySchema.array()),



17

});



18



19

// Create the final schema with useReferences enabled for recursive support



20

const mySchema = zodSchema(



21

z.object({



22

category: categorySchema,



23

}),



24

{ useReferences: true },



25

);
```

[Import](#import)
-----------------

```
import { zodSchema } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### zodSchema:

z.Schema

### options:

object

object

### useReferences?:

boolean

### [Returns](#returns)

A Schema object that is compatible with the AI SDK, containing both the JSON schema representation and validation functionality.

[Previous

jsonSchema](/docs/reference/ai-sdk-core/json-schema)[Next

valibotSchema](/docs/reference/ai-sdk-core/valibot-schema)
