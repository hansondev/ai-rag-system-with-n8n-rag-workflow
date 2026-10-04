---
title: "Harnesses with Terminal UI"
source_url: https://ai-sdk.dev/docs/ai-sdk-harnesses/terminal-ui
section: ai-sdk-harnesses
crawled: 2026-09-20
---

# Harnesses with Terminal UI

> Source: https://ai-sdk.dev/docs/ai-sdk-harnesses/terminal-ui

[AI SDK Harnesses](/docs/ai-sdk-harnesses)Terminal UI


[Harnesses with Terminal UI](#harnesses-with-terminal-ui)
=========================================================

`@ai-sdk/tui` can render harness streams, tool calls, reasoning sections, and
approval prompts in a terminal. Because `HarnessAgent` requires a session on
every call, wrap it with a small `AgentTUIAgent` adapter that injects one
session for the lifetime of the terminal UI.

[Installation](#installation)
-----------------------------

pnpmnpmbunyarn

```
pnpm add @ai-sdk/tui @ai-sdk/harness @ai-sdk/harness-codex @ai-sdk/sandbox-vercel
```

[Example](#example)
-------------------

tui.ts

```
1

import { HarnessAgent, type HarnessAgentSession } from '@ai-sdk/harness/agent';



2

import { codex } from '@ai-sdk/harness-codex';



3

import { createVercelSandbox } from '@ai-sdk/sandbox-vercel';



4

import { runAgentTUI, type AgentTUIAgent } from '@ai-sdk/tui';



5



6

const agent = new HarnessAgent({



7

harness: codex,



8

sandbox: createVercelSandbox({



9

runtime: 'node24',



10

ports: [4000],



11

}),



12

});



13



14

function createTUIAgent({



15

agent,



16

session,



17

}: {



18

agent: HarnessAgent<any, any, any>;



19

session: HarnessAgentSession;



20

}): AgentTUIAgent {



21

return {



22

version: 'agent-v1',



23

id: agent.id,



24

tools: agent.tools,



25

generate(request) {



26

return agent.generate({



27

...request,



28

session,



29

} as Parameters<typeof agent.generate>[0]);



30

},



31

stream(request) {



32

return agent.stream({



33

...request,



34

session,



35

} as Parameters<typeof agent.stream>[0]);



36

},



37

} as AgentTUIAgent;



38

}



39



40

const session = await agent.createSession();



41



42

try {



43

await runAgentTUI({



44

title: 'Codex',



45

agent: createTUIAgent({ agent, session }),



46

tools: 'auto-collapsed',



47

reasoning: 'collapsed',



48

});



49

} finally {



50

await session.destroy();



51

}
```

The terminal UI runs until the user exits with `Esc` or `Ctrl+C`.

Use one session per terminal run. For long-lived terminal tools, persist the
state from `session.detach()` or `session.stop()` if you need to resume later.

[Related](#related)
-------------------

* [Terminal UI](/docs/agents/terminal-ui)
* [runAgentTUI API Reference](/docs/reference/ai-sdk-tui/run-agent-tui)
* [HarnessAgent](/docs/ai-sdk-harnesses/harness-agent)

[Previous

UI](/docs/ai-sdk-harnesses/ui)[Next

AI SDK UI](/docs/ai-sdk-ui)
