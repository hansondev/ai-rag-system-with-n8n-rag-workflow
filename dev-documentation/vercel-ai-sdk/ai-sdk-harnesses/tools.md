---
title: "Harness Tools"
source_url: https://ai-sdk.dev/docs/ai-sdk-harnesses/tools
section: ai-sdk-harnesses
crawled: 2026-09-20
---

# Harness Tools

> Source: https://ai-sdk.dev/docs/ai-sdk-harnesses/tools

[AI SDK Harnesses](/docs/ai-sdk-harnesses)Tools


[Harness Tools](#harness-tools)
===============================

Harnesses have three tool surfaces:

* Built-in tools exposed by the underlying harness runtime, such as file reads,
  edits, shell commands, and web search.
* AI SDK tools that you pass to `HarnessAgent` with the `tools` setting.
* External MCP tools configured through the harness adapter's `mcpServers`
  setting.

This page covers harness-specific behavior. For general AI SDK tool concepts,
schemas, tool results, and `tool()` usage, see [Tools](/docs/foundations/tools).

[Built-in Tools](#built-in-tools)
---------------------------------

Each adapter declares the built-in tools its runtime can call natively.
`HarnessAgent` merges those built-ins with your host-defined tools and exposes
the combined tool set through `agent.tools`.

```
1

const agent = new HarnessAgent({



2

harness: claudeCode,



3

sandbox: createVercelSandbox({



4

runtime: 'node24',



5

ports: [4000],



6

}),



7

});



8



9

agent.tools.bash;



10

agent.tools.read;



11

agent.tools.write;
```

Built-in calls are executed by the harness runtime, not by your application
process. Stream parts use `providerExecuted: true` when the runtime already
performed the call.

Adapters use common names where possible:

* `read`
* `write`
* `edit`
* `bash`
* `grep`
* `glob`
* `webSearch`

Some runtimes also expose native tools without a common cross-harness name.
Those appear under their native names.

[Host-Executed Tools](#host-executed-tools)
-------------------------------------------

Pass AI SDK tools to `HarnessAgent` the same way you do for a `ToolLoopAgent`:

```
1

import { HarnessAgent } from '@ai-sdk/harness/agent';



2

import { claudeCode } from '@ai-sdk/harness-claude-code';



3

import { createVercelSandbox } from '@ai-sdk/sandbox-vercel';



4

import { tool } from 'ai';



5

import { z } from 'zod';



6



7

const weather = tool({



8

description: 'Get the current temperature for a city.',



9

inputSchema: z.object({



10

city: z.string(),



11

}),



12

execute: async ({ city }) => {



13

const temperatures: Record<string, number> = {



14

Paris: 12,



15

Tokyo: 18,



16

Reykjavik: 3,



17

};



18



19

return { city, celsius: temperatures[city] ?? 20 };



20

},



21

});



22



23

const agent = new HarnessAgent({



24

harness: claudeCode,



25

sandbox: createVercelSandbox({



26

runtime: 'node24',



27

ports: [4000],



28

}),



29

tools: { weather },



30

});
```

When the harness calls `weather`, `HarnessAgent` executes the tool in your host
process, then submits the result back to the harness runtime.

[Client-Side Tools](#client-side-tools)
---------------------------------------

Omit `execute` when a browser, user interaction, or another external process
provides the tool result:

```
1

const weather = tool({



2

description: 'Get the current temperature for a city.',



3

inputSchema: z.object({ city: z.string() }),



4

});
```

When the harness calls a tool without `execute`, the returned result slice ends
after the tool-call step while the underlying turn waits for a result.
`session.hasUnfinishedTurn()` remains `true`, and `session.suspendTurn()`
includes the pending tool call in its serializable continuation state.

In UI flows, pass the model messages produced after `addToolOutput` to the next
`stream()` or `generate()` call. `HarnessAgent` extracts the trailing tool
result and continues the paused turn automatically.

For direct agent calls, provide the raw result to `continueStream()` or
`continueGenerate()`:

```
1

const continued = await agent.continueStream({



2

session,



3

toolResultContinuations: [



4

{



5

toolCallId,



6

output: { city: 'Paris', celsius: 12 },



7

},



8

],



9

});
```

Set `isError: true` when the external tool failed. To continue in another
process, call `suspendTurn()`, recreate the session with `continueFrom`, and
then pass the result to `continueStream()` or `continueGenerate()`.

[Tool Filtering](#tool-filtering)
---------------------------------

Use `activeTools` or `inactiveTools` on `HarnessAgent` to control which tools the
harness can call. Both settings accept tool names from the combined tool set:
the built-in tools declared by the harness adapter and the AI SDK tools passed
with `tools`.

`activeTools` is an allowlist:

```
1

const agent = new HarnessAgent({



2

harness: claudeCode,



3

sandbox: createVercelSandbox({



4

runtime: 'node24',



5

ports: [4000],



6

}),



7

tools: { weather },



8

activeTools: ['weather'],



9

});
```

`inactiveTools` is a denylist:

```
1

const agent = new HarnessAgent({



2

harness: claudeCode,



3

sandbox: createVercelSandbox({



4

runtime: 'node24',



5

ports: [4000],



6

}),



7

tools: { weather },



8

inactiveTools: ['bash', 'write'],



9

});
```

Pass either `activeTools` or `inactiveTools`, not both. The TypeScript settings
type prevents combining them, and `HarnessAgent` also throws at runtime when
both are specified.

For host-executed tools, inactive tools are not passed to the underlying
harness runtime. If the runtime still attempts to call one, `HarnessAgent`
returns an execution-denied tool result.

For built-in tools, support depends on the harness adapter. Some adapters can
filter built-ins natively. Others enforce filtering through their built-in tool
approval mechanism by denying inactive built-in calls before they execute,
without emitting approval request or response stream parts. Adapters that
support neither mechanism throw when you filter built-in tools.

[Sandbox in Tool Execution](#sandbox-in-tool-execution)
-------------------------------------------------------

Host-executed tools receive the session sandbox through the same
`experimental_sandbox` execution option used by AI SDK tools elsewhere. The
value is a restricted sandbox session, so tools can read, write, and run
commands without being able to stop the network sandbox or change its network
policy.

```
1

const inspectFile = tool({



2

description: 'Read a file from the harness workspace.',



3

inputSchema: z.object({



4

path: z.string(),



5

}),



6

execute: async ({ path }, { experimental_sandbox }) => {



7

return {



8

content: await experimental_sandbox?.readTextFile({ path }),



9

};



10

},



11

});
```

[Tool Approvals](#tool-approvals)
---------------------------------

Harnesses distinguish built-in tool permissions from host-executed tool
approvals.

Use `permissionMode` for adapter-native built-ins:

```
1

const agent = new HarnessAgent({



2

harness: pi,



3

sandbox: createVercelSandbox({ runtime: 'node24' }),



4

permissionMode: 'allow-edits',



5

});
```

Available values are:

* `allow-all`: allow built-in reads, edits, and shell commands. This is the
  default.
* `allow-edits`: allow reads and edits, but request approval for shell commands
  when the adapter supports built-in approvals.
* `allow-reads`: allow reads, but request approval for edits and shell commands
  when the adapter supports built-in approvals.

Use `toolApproval` for host-executed tools:

```
1

const agent = new HarnessAgent({



2

harness: claudeCode,



3

sandbox: createVercelSandbox({



4

runtime: 'node24',



5

ports: [4000],



6

}),



7

tools: { weather },



8

toolApproval: {



9

weather: 'user-approval',



10

},



11

});
```

`toolApproval` accepts the same status values as AI SDK tool approval status
objects: `not-applicable`, `approved`, `user-approval`, and `denied`.

When approval is required, the stream pauses after a `tool-approval-request`.
Continue the same session by sending a tool approval response message. In UI
flows, `useChat` sends those messages for you when you add the approval result.
In direct agent code, pass the approval response as `messages` on the next
`stream()` or `generate()` call.

[Built-in Approval Support](#built-in-approval-support)
-------------------------------------------------------

Most adapters can pause built-in tool calls for approval. Adapters that do not
support it will error if an unsupported tool approval mode is specified.

Host-executed tool approvals are handled by `HarnessAgent`, so they work across
adapters.

[File Changes and Compaction](#file-changes-and-compaction)
-----------------------------------------------------------

Some harness events are not ordinary tool calls. For UI compatibility,
`HarnessAgent` projects them as dynamic, provider-executed tool parts:

* `fileChange`: emitted for opaque workspace file mutations.
* `compaction`: emitted when the runtime compacts context.

Check `part.dynamic` before assuming a tool part belongs to your typed tool set.

[Previous

HarnessAgent](/docs/ai-sdk-harnesses/harness-agent)[Next

Skills](/docs/ai-sdk-harnesses/skills)
