---
title: "DefaultGeneratedFile"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/default-generated-file
section: reference
crawled: 2026-09-20
---

# DefaultGeneratedFile

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/default-generated-file

[AI SDK Core](/docs/ai-sdk-core)DefaultGeneratedFile


[`DefaultGeneratedFile`](#defaultgeneratedfile)
===============================================

A concrete implementation of the `GeneratedFile` interface that provides lazy conversion between base64 and Uint8Array formats.

```
1

import { DefaultGeneratedFile } from 'ai';



2



3

const file = new DefaultGeneratedFile({



4

data: uint8ArrayData,



5

mediaType: 'image/png',



6

});



7



8

console.log(file.base64); // Automatically converted to base64



9

console.log(file.uint8Array); // Original Uint8Array
```

[Import](#import)
-----------------

```
import { DefaultGeneratedFile } from "ai"
```

[Constructor](#constructor)
---------------------------

### [Parameters](#parameters)

### data:

string | Uint8Array

### mediaType:

string

[Properties](#properties)
-------------------------

### base64:

string

### uint8Array:

Uint8Array

### mediaType:

string

[Previous

createIdGenerator](/docs/reference/ai-sdk-core/create-id-generator)[Next

AI SDK UI](/docs/reference/ai-sdk-ui)
