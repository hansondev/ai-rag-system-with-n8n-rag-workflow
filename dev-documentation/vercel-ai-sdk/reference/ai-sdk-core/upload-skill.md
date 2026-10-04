---
title: "uploadSkill()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/upload-skill
section: reference
crawled: 2026-09-20
---

# uploadSkill()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/upload-skill

[AI SDK Core](/docs/ai-sdk-core)uploadSkill


[`uploadSkill()`](#uploadskill)
===============================

Uploads a skill (a bundle of files) to a provider and returns a `ProviderReference` that can be used in subsequent inference calls.

```
1

import { uploadSkill } from 'ai';



2

import { anthropic } from '@ai-sdk/anthropic';



3

import { readFileSync } from 'fs';



4



5

const { providerReference } = await uploadSkill({



6

api: anthropic.skills(),



7

files: [



8

{



9

path: 'my-skill/SKILL.md',



10

content: readFileSync('./SKILL.md'),



11

},



12

],



13

displayTitle: 'My Skill',



14

});
```

[Import](#import)
-----------------

```
import { uploadSkill } from "ai"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### api:

SkillsV4 | ProviderV4

### files:

SkillsV4File[]

### displayTitle?:

string

### providerOptions?:

ProviderOptions

### [Returns](#returns)

### providerReference:

ProviderReference

### displayTitle?:

string

### name?:

string

### description?:

string

### latestVersion?:

string

### providerMetadata?:

ProviderMetadata

### warnings:

Warning[]

[Previous

uploadFile](/docs/reference/ai-sdk-core/upload-file)[Next

Agent (Interface)](/docs/reference/ai-sdk-core/agent)
