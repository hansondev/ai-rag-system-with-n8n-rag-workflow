---
title: "Memory"
source_url: https://ai-sdk.dev/docs/agents/memory
section: agents
crawled: 2026-09-20
---

# Memory

> Source: https://ai-sdk.dev/docs/agents/memory

[Agents](/docs/agents)Memory


[Memory](#memory)
=================

Memory lets your agent save information and recall it later. Without memory, every conversation starts fresh. With memory, your agent builds context over time, recalls previous interactions, and adapts to the user.

[Three Approaches](#three-approaches)
-------------------------------------

You can add memory to your agent with the AI SDK in three ways, each with different tradeoffs:

| Approach | Effort | Flexibility | Provider Lock-in |
| --- | --- | --- | --- |
| [Provider-Defined Tools](#provider-defined-tools) | Low | Medium | Yes |
| [Memory Providers](#memory-providers) | Low | Low | Depends on memory provider |
| [Custom Tool](#custom-tool) | High | High | No |

[Provider-Defined Tools](#provider-defined-tools)
-------------------------------------------------

[Provider-defined tools](/docs/foundations/tools#types-of-tools) are tools where the provider specifies the tool's `inputSchema` and `description`, but you provide the `execute` function. The model has been trained to use these tools, which can result in better performance compared to custom tools.

### [Anthropic Memory Tool](#anthropic-memory-tool)

The [Anthropic Memory Tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool) gives Claude a structured interface for managing a `/memories` directory. Claude reads its memory before starting tasks, creates and updates files as it works, and references them in future conversations.

```
1

import { anthropic } from '@ai-sdk/anthropic';



2

import { ToolLoopAgent } from 'ai';



3



4

const memory = anthropic.tools.memory_20250818({



5

execute: async action => {



6

// `action` contains `command`, `path`, and other fields



7

// depending on the command (view, create, str_replace,



8

// insert, delete, rename).



9

// Implement your storage backend here.



10

// Return the result as a string.



11

},



12

});



13



14

const agent = new ToolLoopAgent({



15

model: 'anthropic/claude-haiku-4.5',



16

tools: { memory },



17

});



18



19

const result = await agent.generate({



20

prompt: 'Remember that my favorite editor is Neovim',



21

});
```

The tool receives structured commands (`view`, `create`, `str_replace`, `insert`, `delete`, `rename`), each with a `path` scoped to `/memories`. Your `execute` function maps these to your storage backend (the filesystem, a database, or any other persistence layer).

**When to use this**: you want memory with minimal implementation effort and are already using Anthropic models. The tradeoff is provider lock-in, since this tool only works with Claude.

[Memory Providers](#memory-providers)
-------------------------------------

Another approach is to use a provider that has memory built in. These providers wrap an external memory service and expose it through the AI SDK's standard interface. Memory storage, retrieval, and injection happen transparently, and you do not define any tools yourself.

### [Letta](#letta)

[Letta](https://letta.com) provides agents with persistent long-term memory. You create an agent on Letta's platform (cloud or self-hosted), configure its memory there, and use the AI SDK provider to interact with it. Letta's agent runtime handles memory management (core memory, archival memory, recall).

```
1

pnpm add @letta-ai/vercel-ai-sdk-provider
```

```
1

import { lettaCloud } from '@letta-ai/vercel-ai-sdk-provider';



2

import { ToolLoopAgent } from 'ai';



3



4

const agent = new ToolLoopAgent({



5

model: lettaCloud(),



6

providerOptions: {



7

letta: {



8

agent: { id: 'your-agent-id' },



9

},



10

},



11

});



12



13

const result = await agent.generate({



14

prompt: 'Remember that my favorite editor is Neovim',



15

});
```

You can also use Letta's built-in memory tools alongside custom tools:

```
1

import { lettaCloud } from '@letta-ai/vercel-ai-sdk-provider';



2

import { ToolLoopAgent } from 'ai';



3



4

const agent = new ToolLoopAgent({



5

model: lettaCloud(),



6

tools: {



7

core_memory_append: lettaCloud.tool('core_memory_append'),



8

memory_insert: lettaCloud.tool('memory_insert'),



9

memory_replace: lettaCloud.tool('memory_replace'),



10

},



11

providerOptions: {



12

letta: {



13

agent: { id: 'your-agent-id' },



14

},



15

},



16

});



17



18

const stream = agent.stream({



19

prompt: 'What do you remember about me?',



20

});
```

See the [Letta provider documentation](/providers/community-providers/letta) for full setup and configuration.

### [Mem0](#mem0)

[Mem0](https://mem0.ai) adds a memory layer on top of any supported LLM provider. It automatically extracts memories from conversations, stores them, and retrieves relevant ones for future prompts.

```
1

pnpm add @mem0/vercel-ai-provider
```

```
1

import { createMem0 } from '@mem0/vercel-ai-provider';



2

import { ToolLoopAgent } from 'ai';



3



4

const mem0 = createMem0({



5

provider: 'openai',



6

mem0ApiKey: process.env.MEM0_API_KEY,



7

apiKey: process.env.OPENAI_API_KEY,



8

});



9



10

const agent = new ToolLoopAgent({



11

model: mem0('gpt-4.1', { user_id: 'user-123' }),



12

});



13



14

const { text } = await agent.generate({



15

prompt: 'Remember that my favorite editor is Neovim',



16

});
```

Mem0 works across multiple LLM providers (OpenAI, Anthropic, Google, Groq, Cohere). You can also manage memories explicitly:

```
1

import { addMemories, retrieveMemories } from '@mem0/vercel-ai-provider';



2



3

await addMemories(messages, { user_id: 'user-123' });



4

const context = await retrieveMemories(prompt, { user_id: 'user-123' });
```

See the [Mem0 provider documentation](/providers/community-providers/mem0) for full setup and configuration.

### [Supermemory](#supermemory)

[Supermemory](https://supermemory.ai) is a long-term memory platform that adds persistent, self-growing memory to your AI applications. It provides tools that handle saving and retrieving memories automatically through semantic search.

```
1

pnpm add @supermemory/tools
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { supermemoryTools } from '@supermemory/tools/ai-sdk';



2

import { ToolLoopAgent } from 'ai';



3



4

const agent = new ToolLoopAgent({



5

model: "xai/grok-4.6",



6

tools: supermemoryTools(process.env.SUPERMEMORY_API_KEY!),



7

});



8



9

const result = await agent.generate({



10

prompt: 'Remember that my favorite editor is Neovim',



11

});
```

Supermemory works with any AI SDK provider. The tools give the model `addMemory` and `searchMemories` operations that handle storage and retrieval.

See the [Supermemory provider documentation](/providers/community-providers/supermemory) for full setup and configuration.

### [Hindsight](#hindsight)

[Hindsight](/providers/community-providers/hindsight) provides agents with persistent memory through five tools: `retain`, `recall`, `reflect`, `getMentalModel`, and `getDocument`. It can be self-hosted with Docker or used as a cloud service.

```
1

pnpm add @vectorize-io/hindsight-ai-sdk @vectorize-io/hindsight-client
```

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { HindsightClient } from '@vectorize-io/hindsight-client';



2

import { createHindsightTools } from '@vectorize-io/hindsight-ai-sdk';



3

import { ToolLoopAgent } from 'ai';



4

import { openai } from '@ai-sdk/openai';



5



6

const client = new HindsightClient({ baseUrl: process.env.HINDSIGHT_API_URL });



7



8

const agent = new ToolLoopAgent({



9

model: "xai/grok-4.6",



10

tools: createHindsightTools({ client, bankId: 'user-123' }),



11

instructions: 'You are a helpful assistant with long-term memory.',



12

});



13



14

const result = await agent.generate({



15

prompt: 'Remember that my favorite editor is Neovim',



16

});
```

The `bankId` identifies the memory store and is typically a user ID. In multi-user apps, call `createHindsightTools` inside your request handler so each request gets the right bank. Hindsight works with any AI SDK provider.

See the [Hindsight provider documentation](/providers/community-providers/hindsight) for full setup and configuration.

### [MongoDB](#mongodb)

[`@mongodb-developer/vercel-ai-memory`](https://www.npmjs.com/package/@mongodb-developer/vercel-ai-memory) provides MongoDB Atlas-backed persistent memory with five structured tiers: **Session**, **Semantic**, **Procedural**, **Episodic**, and **Scratchpad**. Retrieval is powered by Atlas Vector Search using any AI SDK embedding model, with automatic index creation and per-type retention policies.

```
1

pnpm add @mongodb-developer/vercel-ai-memory
```

This integration targets AI SDK v6 because it relies on v6 APIs such as `ModelMessage`, `ToolLoopAgent`, and `isLoopFinished()`:

```
1

{



2

"peerDependencies": {



3

"ai": "^6.0.0",



4

"mongodb": "^6.0.0",



5

"zod": "^3.0.0"



6

}



7

}
```

```
1

import { createMongoDBMemory } from '@mongodb-developer/vercel-ai-memory';



2

import { openai } from '@ai-sdk/openai';



3

import { ToolLoopAgent, isLoopFinished } from 'ai';



4



5

// Create the memory instance once at module/server level



6

const mongodbMemory = createMongoDBMemory({



7

uri: process.env.MONGODB_URI!,



8

embedder: openai.embedding('text-embedding-3-small'),



9

});



10



11

// Scope to a user and session per request



12

const agent = new ToolLoopAgent({



13

model: openai('gpt-4.1'),



14

tools: mongodbMemory({ userId: 'alice', sessionId: 'sess-001' }),



15

stopWhen: isLoopFinished(),



16

});



17



18

const result = await agent.generate({



19

prompt: 'My name is Alice and I love hiking. Remember that.',



20

});
```

`isLoopFinished()` lets the agent keep running until the tool loop naturally finishes, which is useful when memory tools need to read and write before the final response.

Session memory supports two modes: **tool-driven** (the LLM decides when to read/write — good for prototypes) and **hook-driven** (the runtime persists every turn via `prepareCall` + `onEnd` hooks — recommended for production). The other memory tiers (semantic, procedural, episodic, scratchpad) are always LLM-controlled and selective by design.

MongoDB memory works with any AI SDK model and embedding provider, with no vendor lock-in beyond MongoDB Atlas.

**When to use memory providers**: these providers are a good fit when you want memory without building any storage infrastructure. The tradeoff is that the provider controls memory behavior, so you have less visibility into what gets stored and how it is retrieved. You also take on a dependency on an external service.

[Custom Tool](#custom-tool)
---------------------------

Building your own memory tool from scratch is the most flexible approach. You control the storage format, the interface, and the retrieval logic. This requires the most upfront work but gives you full ownership of how memory works, with no provider lock-in and no external dependencies.

There are two common patterns:

* **Structured actions**: you define explicit operations (`view`, `create`, `update`, `search`) and handle structured input yourself. Safe by design since you control every operation.
* **Bash-backed**: you give the model a sandboxed bash environment to compose shell commands (`cat`, `grep`, `sed`, `echo`) for flexible memory access. More powerful but requires command validation for safety.

For a full walkthrough of implementing a custom memory tool with a bash-backed interface, AST-based command validation, and filesystem persistence, see the **[Build a Custom Memory Tool](/cookbook/guides/custom-memory-tool)** recipe.

[Previous

Configuring Call Options](/docs/agents/configuring-call-options)[Next

Policy-Based Tool Approvals](/docs/agents/policy-tool-approvals)
