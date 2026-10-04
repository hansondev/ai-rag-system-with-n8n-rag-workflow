---
title: "Skill Uploads"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/skill-uploads
section: ai-sdk-core
crawled: 2026-09-20
---

# Skill Uploads

> Source: https://ai-sdk.dev/docs/ai-sdk-core/skill-uploads

[AI SDK Core](/docs/ai-sdk-core)Skill Uploads


[Skill Uploads](#skill-uploads)
===============================

The AI SDK provides the [`uploadSkill`](/docs/reference/ai-sdk-core/upload-skill)
function to upload custom skills to a provider and get back a `ProviderReference` that
can be passed to subsequent inference calls.

A **skill** is a bundle of files (e.g. a `SKILL.md` describing the skill's behavior)
that providers can load, e.g. in sandboxed container environments.

In the AI SDK, the uploaded skill is identified by a `ProviderReference` — a
`Record<string, string>` mapping provider names to provider-specific identifiers.
This concept is used for other provider specific asset references too, such as
uploaded media files.

```
1

import { uploadSkill, generateText } from 'ai';



2

import {



3

anthropic,



4

type AnthropicLanguageModelOptions,



5

} from '@ai-sdk/anthropic';



6

import { readFileSync } from 'fs';



7



8

const { providerReference } = await uploadSkill({



9

api: anthropic.skills(),



10

files: [



11

{



12

path: 'my-skill/SKILL.md',



13

content: readFileSync('./SKILL.md'),



14

},



15

],



16

displayTitle: 'My Skill',



17

});



18



19

const { text } = await generateText({



20

model: anthropic('claude-sonnet-4-6'),



21

tools: {



22

code_execution: anthropic.tools.codeExecution_20260120(),



23

},



24

prompt: 'Use the skill to complete the task.',



25

providerOptions: {



26

anthropic: {



27

container: {



28

skills: [{ type: 'custom', providerReference }],



29

},



30

} satisfies AnthropicLanguageModelOptions,



31

},



32

});
```

As a shorthand, you can pass a provider instance directly to `api` instead of calling `.skills()` explicitly — the SDK will call `.skills()` for you:

```
1

const { providerReference } = await uploadSkill({



2

api: anthropic, // shorthand for anthropic.skills()



3

files: [{ path: 'my-skill/SKILL.md', content: readFileSync('./SKILL.md') }],



4

displayTitle: 'My Skill',



5

});
```

[Skill Files](#skill-files)
---------------------------

A skill is composed of one or more files, each with a relative `path` and `content`.
File content can be provided as a `Uint8Array` (e.g. from `fs.readFileSync`) or as a
base64-encoded string:

```
1

const { providerReference } = await uploadSkill({



2

api: openai.skills(),



3

files: [



4

{



5

path: 'my-skill/SKILL.md',



6

content: readFileSync('./SKILL.md'), // Uint8Array



7

},



8

{



9

path: 'my-skill/helper.py',



10

content: readFileSync('./helper.py'),



11

},



12

],



13

});
```

[Upload Result](#upload-result)
-------------------------------

`uploadSkill` returns an `UploadSkillResult` with the following fields:

| Field | Type | Description |
| --- | --- | --- |
| `providerReference` | `ProviderReference` | Maps provider names to provider-specific skill IDs |
| `displayTitle` | `string?` | Human-readable title (if supported and provided) |
| `name` | `string?` | Name inferred by the provider from the skill files |
| `description` | `string?` | Description inferred by the provider from the skill files |
| `latestVersion` | `string?` | Latest version identifier assigned by the provider |
| `providerMetadata` | `object?` | Additional provider-specific metadata (e.g. timestamps) |
| `warnings` | `Warning[]` | Warnings for unsupported options (e.g. `displayTitle` on OpenAI) |

[Provider References](#provider-references)
-------------------------------------------

A `ProviderReference` is a `Record<string, string>` mapping provider names to
provider-specific skill identifiers:

```
1

// Example ProviderReference



2

{



3

anthropic: 'skill_abc123',



4

}
```

Pass the `providerReference` when referencing the skill during inference. Each provider
looks up its own skill ID from the reference. If no entry exists for the current
provider, an error is thrown.

[Multi-Provider Usage](#multi-provider-usage)
---------------------------------------------

If you want to use the same skill across multiple providers, upload it to each one and
merge the references:

```
1

const [openaiUpload, anthropicUpload] = await Promise.all([



2

uploadSkill({



3

api: openai.skills(),



4

files: [{ path: 'my-skill/SKILL.md', content: skillSource }],



5

}),



6

uploadSkill({



7

api: anthropic.skills(),



8

files: [{ path: 'my-skill/SKILL.md', content: skillSource }],



9

displayTitle: 'My Skill',



10

}),



11

]);



12



13

const mergedReference = {



14

...openaiUpload.providerReference,



15

...anthropicUpload.providerReference,



16

};



17



18

// mergedReference: { openai: 'sk_...', anthropic: 'sk_...' }
```

The merged reference can then be used in inference calls regardless of which provider
processes the request — each provider will find its own skill ID.

[Using Skills in Inference Calls](#using-skills-in-inference-calls)
-------------------------------------------------------------------

How you attach a skill to an inference call depends on the provider.

### [Anthropic](#anthropic)

Pass the `providerReference` inside the `container.skills` array in `providerOptions`:

```
1

await generateText({



2

model: anthropic('claude-sonnet-4-6'),



3

tools: {



4

code_execution: anthropic.tools.codeExecution_20260120(),



5

},



6

prompt: '...',



7

providerOptions: {



8

anthropic: {



9

container: {



10

skills: [{ type: 'custom', providerReference }],



11

},



12

} satisfies AnthropicLanguageModelOptions,



13

},



14

});
```

### [OpenAI](#openai)

Pass the `providerReference` inside the `shell` tool's `environment.skills` array:

```
1

await generateText({



2

model: openai.responses('gpt-5.2'),



3

tools: {



4

shell: openai.tools.shell({



5

environment: {



6

type: 'containerAuto',



7

skills: [{ type: 'skillReference', providerReference }],



8

},



9

}),



10

},



11

prompt: '...',



12

});
```

[Supported Providers](#supported-providers)
-------------------------------------------

The following providers support `skills()` and skill uploads:

| Provider | Factory Method |
| --- | --- |
| Anthropic | `anthropic.skills()` |
| OpenAI | `openai.skills()` |

[Previous

Language Model Middleware](/docs/ai-sdk-core/middleware)[Next

Batch](/docs/ai-sdk-core/batch)
