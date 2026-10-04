---
title: "runAgentTUI()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-tui/run-agent-tui
section: reference
crawled: 2026-09-20
---

# runAgentTUI()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-tui/run-agent-tui

[AI SDK TUI](/docs/reference/ai-sdk-tui)runAgentTUI


[`runAgentTUI()`](#runagenttui)
===============================

Runs a local agent or chat transport in an interactive terminal UI. The
terminal UI reads user prompts, streams assistant responses, renders markdown,
displays tool and reasoning sections, and handles manual tool approvals.

`runAgentTUI` runs until the user exits with `Esc` or `Ctrl+C`.

```
1

import { openai } from '@ai-sdk/openai';



2

import { runAgentTUI } from '@ai-sdk/tui';



3

import { ToolLoopAgent } from 'ai';



4



5

const agent = new ToolLoopAgent({



6

model: openai('gpt-5'),



7

instructions: 'You are a helpful terminal assistant.',



8

});



9



10

await runAgentTUI({



11

title: 'Assistant',



12

agent,



13

});
```

[Import](#import)
-----------------

```
import { runAgentTUI } from "@ai-sdk/tui"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### options:

RunAgentTUIOptions

RunAgentTUIOptions

### agent?:

AgentTUIAgent

### transport?:

ChatTransport<UIMessage>

### title?:

string

### tools?:

'full' | 'collapsed' | 'auto-collapsed' | 'hidden'

### reasoning?:

'full' | 'collapsed' | 'auto-collapsed' | 'hidden'

### responseStatistics?:

'outputTokenCount' | 'outputTokensPerSecond'

### contextSize?:

number

### sandbox?:

Experimental\_SandboxSession

### [Returns](#returns)

### returns:

Promise<void>

[Types](#types)
---------------

### [`AgentTUIAgent`](#agenttuiagent)

An agent that is compatible with the terminal UI:

```
1

type AgentTUIAgent = Agent<undefined, any, any, never>;
```

This means the agent has no per-call options and no structured output.

### [`TerminalPartDisplayMode`](#terminalpartdisplaymode)

Controls how terminal sections are displayed:

```
1

type TerminalPartDisplayMode =



2

| 'full'



3

| 'collapsed'



4

| 'auto-collapsed'



5

| 'hidden';
```

* `"full"`: Show the section header and full content.
* `"collapsed"`: Show only the section header.
* `"auto-collapsed"`: Show the latest section expanded until another visible
  section appears, then collapse it.
* `"hidden"`: Omit the section entirely.

### [`ResponseStatisticsMode`](#responsestatisticsmode)

Controls which response statistic is shown:

```
1

type ResponseStatisticsMode = 'outputTokenCount' | 'outputTokensPerSecond';
```

* `"outputTokenCount"`: Show the number of output tokens in the response.
* `"outputTokensPerSecond"`: Show output token throughput for the response.

[Example with Tool Display Options](#example-with-tool-display-options)
-----------------------------------------------------------------------

```
1

await runAgentTUI({



2

title: 'Assistant',



3

agent,



4

tools: 'auto-collapsed',



5

reasoning: 'collapsed',



6

responseStatistics: 'outputTokenCount',



7

contextSize: 200_000,



8

});
```

[Example with a Chat Transport](#example-with-a-chat-transport)
---------------------------------------------------------------

```
1

import { DefaultChatTransport } from 'ai';



2



3

await runAgentTUI({



4

title: 'Remote Assistant',



5

transport: new DefaultChatTransport({



6

api: 'https://example.com/api/chat',



7

}),



8

});
```

[Example with Sandbox](#example-with-sandbox)
---------------------------------------------

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

title: 'Sandbox Assistant',



9

agent,



10

sandbox: sandboxSession.restricted(),



11

});
```

The sandbox is forwarded to every `agent.stream()` call as
`experimental_sandbox`, making it available to tool description functions and
tool `execute` functions. Include the sandbox description in the agent
instructions when the model should know sandbox-specific details such as the
working directory or exposed ports.

[Compatibility](#compatibility)
-------------------------------

Use the `agent` option for agents that can run directly from free-form user
input. Use the `transport` option to communicate with a remote agent. Use
`agent.generate()` or `agent.stream()` directly when you need fixed prompts,
per-call options, structured output, custom result inspection, or custom stream
processing.

[Related](#related)
-------------------

* [Terminal UI guide](/docs/agents/terminal-ui)
* [Building Agents](/docs/agents/building-agents)
* [ToolLoopAgent guide](/docs/agents/overview#toolloopagent-class)

[Previous

AI SDK TUI](/docs/reference/ai-sdk-tui)[Next

Migration Guides](/docs/migration-guides)
