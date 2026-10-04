---
title: "Terminal UI"
source_url: https://ai-sdk.dev/docs/agents/terminal-ui
section: agents
crawled: 2026-09-20
---

# Terminal UI

> Source: https://ai-sdk.dev/docs/agents/terminal-ui

[Agents](/docs/agents)Terminal UI


[Terminal UI](#terminal-ui)
===========================

The `@ai-sdk/tui` package lets you run a local `ToolLoopAgent` or connect to a
remote agent through a `ChatTransport` in an interactive terminal interface.
It is useful for local development, demos, and internal tools where a terminal
experience is enough and you do not want to build a custom UI.

The terminal UI handles prompt input, streamed assistant responses, markdown
rendering, tool cards, reasoning sections, scrolling, and tool approval prompts.

[Installation](#installation)
-----------------------------

Install `@ai-sdk/tui` alongside `ai` and the provider package you use:

```
pnpm add @ai-sdk/tui ai @ai-sdk/openai
```

[Running an Agent](#running-an-agent)
-------------------------------------

Create a `ToolLoopAgent` and pass it to `runAgentTUI`:

```
1

import { openai } from '@ai-sdk/openai';



2

import { runAgentTUI } from '@ai-sdk/tui';



3

import { ToolLoopAgent, tool } from 'ai';



4

import { z } from 'zod';



5



6

const agent = new ToolLoopAgent({



7

model: openai('gpt-5'),



8

instructions:



9

'You are a helpful terminal assistant. Answer in markdown and use tools when they help.',



10

tools: {



11

weather: tool({



12

description: 'Get the weather in a location',



13

inputSchema: z.object({



14

location: z.string().describe('The location to get the weather for'),



15

}),



16

execute: async ({ location }) => ({



17

location,



18

temperature: 72,



19

}),



20

}),



21

},



22

});



23



24

await runAgentTUI({



25

title: 'Weather Agent',



26

agent,



27

});
```

`runAgentTUI` runs until the user exits with `Esc` or `Ctrl+C`.

[Connecting to a Remote Agent](#connecting-to-a-remote-agent)
-------------------------------------------------------------

Pass a `ChatTransport` instead of an `agent` to connect the terminal UI to a
remote AI SDK UI message endpoint:

```
1

import { runAgentTUI } from '@ai-sdk/tui';



2

import { DefaultChatTransport } from 'ai';



3



4

await runAgentTUI({



5

title: 'Remote Agent',



6

transport: new DefaultChatTransport({



7

api: 'https://example.com/api/chat',



8

}),



9

});
```

The transport controls the endpoint, authentication, request body, and other
remote communication behavior. The terminal UI keeps its internal chat id and
message history private to the transport contract.

[Sandbox](#sandbox)
-------------------

Pass a sandbox session with the `sandbox` option when your agent tools need an
execution environment:

```
1

import { createJustBashSandbox } from '@ai-sdk/sandbox-just-bash';



2



3

const sandboxSession = await createJustBashSandbox({



4

cwd: '/home/user',



5

}).createSession();



6



7

await runAgentTUI({



8

title: 'Sandbox Agent',



9

agent,



10

sandbox: sandboxSession.restricted(),



11

});
```

The terminal UI forwards the sandbox to every agent call as
`experimental_sandbox`. Tool description functions and tool `execute` functions
can read it from their options and delegate command or file operations to it.
Add the sandbox description to your agent instructions if the model should know
details such as the working directory, public hostname, or exposed ports.

[Display Options](#display-options)
-----------------------------------

You can control how tool calls, reasoning, and response statistics are shown:

```
1

await runAgentTUI({



2

title: 'Weather Agent',



3

agent,



4

tools: 'auto-collapsed',



5

reasoning: 'collapsed',



6

responseStatistics: 'outputTokensPerSecond',



7

contextSize: 200_000,



8

});
```

Settings:

* `tools`: Controls tool call rendering. Use `"full"` to show tool input and
  output, `"collapsed"` to show only tool cards, `"auto-collapsed"` to show the
  latest tool expanded until another visible section appears, or `"hidden"` to
  omit tool calls. Defaults to `"auto-collapsed"`.
* `reasoning`: Controls reasoning rendering. Use `"full"` to show reasoning,
  `"collapsed"` to show only reasoning cards, `"auto-collapsed"` to show the
  latest reasoning expanded until another visible section appears, or `"hidden"`
  to omit reasoning. Defaults to `"auto-collapsed"`.
* `responseStatistics`: Use `"outputTokensPerSecond"` to show output token
  throughput or `"outputTokenCount"` to show output token count. Defaults to
  `"outputTokensPerSecond"`.
* `contextSize`: When provided, the terminal UI shows total token usage as a
  percentage of the model context window.

[Tool Approvals](#tool-approvals)
---------------------------------

`runAgentTUI` supports `ToolLoopAgent` tool approval flows. When an agent emits a
manual approval request, the terminal UI prompts the user to approve or deny the
tool call before the agent continues.

```
1

const agent = new ToolLoopAgent({



2

model: openai('gpt-5'),



3

tools: { weather },



4

toolApproval: {



5

weather: ({ location }) =>



6

location.toLowerCase().includes('san francisco')



7

? 'approved'



8

: 'user-approval',



9

},



10

});



11



12

await runAgentTUI({ title: 'Weather Agent', agent });
```

[Compatibility](#compatibility)
-------------------------------

When using the `agent` option, the agent must be runnable directly from terminal
user input. It must not require per-call options and must not use structured
output, because the terminal UI cannot infer those values from a free-form
prompt. Use a `transport` for remote agents that need custom request handling.

Use `agent.generate()` or `agent.stream()` directly for examples or apps that
need fixed prompts, call options, structured output, custom result inspection, or
custom stream processing.

[Controls](#controls)
---------------------

* `Enter`: submit prompt
* `y` / `n`: approve or deny tool calls
* `Up` / `Down`: scroll transcript
* `PageUp` / `PageDown`: scroll transcript by a full page
* `Ctrl+L`: repaint
* `Esc` / `Ctrl+C`: exit

[Next Steps](#next-steps)
-------------------------

* [Building Agents](/docs/agents/building-agents) for creating `ToolLoopAgent`
  instances
* [Tool Approvals](/docs/agents/tool-approvals) for configuring human review of
  tool calls
* [runAgentTUI API Reference](/docs/reference/ai-sdk-tui/run-agent-tui) for
  detailed parameter documentation

[Previous

WorkflowAgent](/docs/agents/workflow-agent)[Next

AI SDK Core](/docs/ai-sdk-core)
