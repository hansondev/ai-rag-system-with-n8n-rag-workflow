---
title: "Configuring Call Options"
source_url: https://ai-sdk.dev/docs/agents/configuring-call-options
section: agents
crawled: 2026-09-20
---

# Configuring Call Options

> Source: https://ai-sdk.dev/docs/agents/configuring-call-options

[Agents](/docs/agents)Configuring Call Options


[Configuring Call Options](#configuring-call-options)
=====================================================

Call options allow you to pass type-safe structured inputs to your agent. Use them to dynamically modify any agent setting based on the specific request.

[Why Use Call Options?](#why-use-call-options)
----------------------------------------------

When you need agent behavior to change based on runtime inputs:

* **Add dynamic context** - Inject retrieved documents, user preferences, or session data into prompts
* **Select models dynamically** - Choose faster or more capable models based on request complexity
* **Configure tools per request** - Pass user location to search tools or adjust tool behavior
* **Customize provider options** - Set reasoning effort, temperature, or other provider-specific settings

Without call options, you'd need to create multiple agents or handle configuration logic outside the agent.

[How It Works](#how-it-works)
-----------------------------

Define call options in three steps:

1. **Define the schema** - Specify what inputs you accept using `callOptionsSchema`
2. **Configure with `prepareCall`** - Use those inputs to modify agent settings
3. **Pass options at runtime** - Provide the options when calling `generate()` or `stream()`

[Basic Example](#basic-example)
-------------------------------

Add user context to your agent's prompt at runtime:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent } from 'ai';



2

import { z } from 'zod';



3



4

const supportAgent = new ToolLoopAgent({



5

model: "xai/grok-4.6",



6

callOptionsSchema: z.object({



7

userId: z.string(),



8

accountType: z.enum(['free', 'pro', 'enterprise']),



9

}),



10

instructions: 'You are a helpful customer support agent.',



11

prepareCall: ({ options, ...settings }) => ({



12

...settings,



13

instructions:



14

settings.instructions +



15

`\nUser context:



16

- Account type: ${options.accountType}



17

- User ID: ${options.userId}



18



19

Adjust your response based on the user's account level.`,



20

}),



21

});



22



23

// Call the agent with specific user context



24

const result = await supportAgent.generate({



25

prompt: 'How do I upgrade my account?',



26

options: {



27

userId: 'user_123',



28

accountType: 'free',



29

},



30

});
```

The `options` parameter is now required and type-checked. If you don't provide it or pass incorrect types, TypeScript will error.

[Modifying Agent Settings](#modifying-agent-settings)
-----------------------------------------------------

Use `prepareCall` to modify any agent setting. Return only the settings you want to change.

### [Dynamic Model Selection](#dynamic-model-selection)

Choose models based on request characteristics:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent } from 'ai';



2

import { z } from 'zod';



3



4

const agent = new ToolLoopAgent({



5

model: "xai/grok-4.6", // Default model



6

callOptionsSchema: z.object({



7

complexity: z.enum(['simple', 'complex']),



8

}),



9

prepareCall: ({ options, ...settings }) => ({



10

...settings,



11

model:



12

options.complexity === 'simple' ? 'openai/gpt-4o-mini' : 'openai/o1-mini',



13

}),



14

});



15



16

// Use faster model for simple queries



17

await agent.generate({



18

prompt: 'What is 2+2?',



19

options: { complexity: 'simple' },



20

});



21



22

// Use more capable model for complex reasoning



23

await agent.generate({



24

prompt: 'Explain quantum entanglement',



25

options: { complexity: 'complex' },



26

});
```

### [Dynamic Tool Configuration](#dynamic-tool-configuration)

Configure tools based on runtime inputs:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { openai } from '@ai-sdk/openai';



2

import { ToolLoopAgent } from 'ai';



3

import { z } from 'zod';



4



5

const newsAgent = new ToolLoopAgent({



6

model: "xai/grok-4.6",



7

callOptionsSchema: z.object({



8

userCity: z.string().optional(),



9

userRegion: z.string().optional(),



10

}),



11

tools: {



12

web_search: openai.tools.webSearch(),



13

},



14

prepareCall: ({ options, ...settings }) => ({



15

...settings,



16

tools: {



17

web_search: openai.tools.webSearch({



18

searchContextSize: 'low',



19

userLocation: {



20

type: 'approximate',



21

city: options.userCity,



22

region: options.userRegion,



23

country: 'US',



24

},



25

}),



26

},



27

}),



28

});



29



30

await newsAgent.generate({



31

prompt: 'What are the top local news stories?',



32

options: {



33

userCity: 'San Francisco',



34

userRegion: 'California',



35

},



36

});
```

### [Provider-Specific Options](#provider-specific-options)

Configure provider settings dynamically:

```
1

import { OpenAILanguageModelResponsesOptions } from '@ai-sdk/openai';



2

import { ToolLoopAgent } from 'ai';



3

import { z } from 'zod';



4



5

const agent = new ToolLoopAgent({



6

model: 'openai/o3',



7

callOptionsSchema: z.object({



8

taskDifficulty: z.enum(['low', 'medium', 'high']),



9

}),



10

prepareCall: ({ options, ...settings }) => ({



11

...settings,



12

providerOptions: {



13

openai: {



14

reasoningEffort: options.taskDifficulty,



15

} satisfies OpenAILanguageModelResponsesOptions,



16

},



17

}),



18

});



19



20

await agent.generate({



21

prompt: 'Analyze this complex scenario...',



22

options: { taskDifficulty: 'high' },



23

});
```

[Advanced Patterns](#advanced-patterns)
---------------------------------------

### [Retrieval Augmented Generation (RAG)](#retrieval-augmented-generation-rag)

Fetch relevant context and inject it into your prompt:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent } from 'ai';



2

import { z } from 'zod';



3



4

const ragAgent = new ToolLoopAgent({



5

model: "xai/grok-4.6",



6

callOptionsSchema: z.object({



7

query: z.string(),



8

}),



9

prepareCall: async ({ options, ...settings }) => {



10

// Fetch relevant documents (this can be async)



11

const documents = await vectorSearch(options.query);



12



13

return {



14

...settings,



15

instructions: `Answer questions using the following context:



16



17

${documents.map(doc => doc.content).join('\n\n')}`,



18

};



19

},



20

});



21



22

await ragAgent.generate({



23

prompt: 'What is our refund policy?',



24

options: { query: 'refund policy' },



25

});
```

The `prepareCall` function can be async, enabling you to fetch data before configuring the agent.

### [Combining Multiple Modifications](#combining-multiple-modifications)

Modify multiple settings together:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent } from 'ai';



2

import { z } from 'zod';



3



4

const agent = new ToolLoopAgent({



5

model: "xai/grok-4.6",



6

callOptionsSchema: z.object({



7

userRole: z.enum(['admin', 'user']),



8

urgency: z.enum(['low', 'high']),



9

}),



10

tools: {



11

readDatabase: readDatabaseTool,



12

writeDatabase: writeDatabaseTool,



13

},



14

prepareCall: ({ options, ...settings }) => ({



15

...settings,



16

// Upgrade model for urgent requests



17

model: options.urgency === 'high' ? "xai/grok-4.6" : settings.model,



18

// Limit tools based on user role



19

activeTools:



20

options.userRole === 'admin'



21

? ['readDatabase', 'writeDatabase']



22

: ['readDatabase'],



23

// Adjust instructions



24

instructions: `You are a ${options.userRole} assistant.



25

${options.userRole === 'admin' ? 'You have full database access.' : 'You have read-only access.'}`,



26

}),



27

});



28



29

await agent.generate({



30

prompt: 'Update the user record',



31

options: {



32

userRole: 'admin',



33

urgency: 'high',



34

},



35

});
```

[Using with createAgentUIStreamResponse](#using-with-createagentuistreamresponse)
---------------------------------------------------------------------------------

Pass call options through API routes to your agent:

app/api/chat/route.ts

```
1

import { createAgentUIStreamResponse } from 'ai';



2

import { myAgent } from '@/ai/agents/my-agent';



3



4

export async function POST(request: Request) {



5

const { messages, userId, accountType } = await request.json();



6



7

return createAgentUIStreamResponse({



8

agent: myAgent,



9

messages,



10

options: {



11

userId,



12

accountType,



13

},



14

});



15

}
```

[Next Steps](#next-steps)
-------------------------

* Learn about [loop control](/docs/agents/loop-control) for execution management
* Explore [workflow patterns](/docs/agents/workflows) for complex multi-step processes

[Previous

Loop Control](/docs/agents/loop-control)[Next

Memory](/docs/agents/memory)
