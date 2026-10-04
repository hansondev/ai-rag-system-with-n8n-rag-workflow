---
title: "HarnessAgent"
source_url: https://ai-sdk.dev/docs/ai-sdk-harnesses/harness-agent
section: ai-sdk-harnesses
crawled: 2026-09-20
---

# HarnessAgent

> Source: https://ai-sdk.dev/docs/ai-sdk-harnesses/harness-agent

[AI SDK Harnesses](/docs/ai-sdk-harnesses)HarnessAgent


[HarnessAgent](#harnessagent)
=============================

`HarnessAgent` is an AI SDK `Agent` implementation backed by a harness adapter.
It gives you `generate()` and `stream()` methods that return AI SDK-compatible
results while a preconfigured harness powers these results.

[Installation](#installation)
-----------------------------

Install the core harness package, a harness adapter, and a sandbox provider:

pnpmnpmbunyarn

```
pnpm add @ai-sdk/harness @ai-sdk/harness-claude-code @ai-sdk/sandbox-vercel
```

Bridge-backed harnesses such as Claude Code and Codex require using real network sandbox
like `@ai-sdk/sandbox-vercel`. Host-runtime harnesses such as Pi can also run with
`@ai-sdk/sandbox-just-bash` because they do not need a sandbox-exposed port.

[Create an Agent](#create-an-agent)
-----------------------------------

```
1

import { HarnessAgent } from '@ai-sdk/harness/agent';



2

import { claudeCode } from '@ai-sdk/harness-claude-code';



3

import { createVercelSandbox } from '@ai-sdk/sandbox-vercel';



4



5

export const agent = new HarnessAgent({



6

harness: claudeCode,



7

model: 'claude-sonnet-4-6',



8

sandbox: createVercelSandbox({



9

runtime: 'node24',



10

ports: [4000],



11

}),



12

instructions:



13

'You are a careful coding assistant. Prefer small changes and explain tradeoffs.',



14

});
```

Construct the agent at module scope. It holds configuration, not a live session.
Live state belongs to `HarnessAgentSession`.

Set `model` to select the model that the harness runtime uses. Model identifiers
are specific to each harness. When omitted, the harness uses its default model.
The model is applied per turn, so `prepareCall` can replace it between turns.

To use this agent, ensure environment variables with sandbox and harness credentials
are set.

[Run a Turn](#run-a-turn)
-------------------------

```
1

const session = await agent.createSession();



2



3

let exitCode = 0;



4

try {



5

const result = await agent.generate({



6

session,



7

prompt: 'Create a short TODO.md for this repository.',



8

});



9



10

console.log(result.text);



11

} catch (err) {



12

exitCode = 1;



13

console.error(err);



14

} finally {



15

await session.destroy();



16

process.exit(exitCode);



17

}
```

`generate()` drains the turn and returns a `GenerateTextResult`.

Use `stream()` for incremental output:

```
1

const session = await agent.createSession();



2



3

let exitCode = 0;



4

try {



5

const result = await agent.stream({



6

session,



7

prompt: 'Create a short TODO.md for this repository.',



8

});



9



10

for await (const part of result.stream) {



11

if (part.type === 'text-delta') {



12

process.stdout.write(part.text);



13

}



14

}



15

} catch (err) {



16

exitCode = 1;



17

console.error(err);



18

} finally {



19

await session.destroy();



20

process.exit(exitCode);



21

}
```

[Lifecycle Callbacks](#lifecycle-callbacks)
-------------------------------------------

Configure lifecycle callbacks on `HarnessAgent` to observe agent calls, model
steps, and tool executions:

```
1

const agent = new HarnessAgent({



2

harness: claudeCode,



3

sandbox,



4

tools: { weather },



5

onStart: event => console.log('call started', event.callId),



6

onStepStart: event => console.log('step started', event.stepNumber),



7

onLanguageModelCallStart: event =>



8

console.log('model call started', event.modelId),



9

onLanguageModelCallEnd: event =>



10

console.log('model call ended', event.finishReason),



11

onToolExecutionStart: event =>



12

console.log('tool started', event.toolCall.toolName),



13

onToolExecutionEnd: event => console.log('tool ended', event.toolOutput.type),



14

onStepEnd: step => console.log('step ended', step.stepNumber),



15

onEnd: event => console.log('call ended', event.finishReason),



16

});
```

Callbacks configured on individual `generate()` and `stream()` calls are
invoked in addition to settings callbacks, with settings callbacks invoked
first. Callback errors are ignored and do not change agent execution.

Harness runtimes execute their built-in tools internally. For those tools,
`onToolExecutionStart` and `onToolExecutionEnd` describe the logical tool
lifecycle after the runtime reports the result. The callbacks are still
delivered before the tool result is published to the result stream.

[Generate Structured Output](#generate-structured-output)
---------------------------------------------------------

Set `output` when constructing `HarnessAgent` to require the same typed output
on every turn. The agent converts the output specification to JSON Schema for
the harness adapter, validates the completed response, and returns the parsed
value through `result.output`.

```
1

import { HarnessAgent } from '@ai-sdk/harness/agent';



2

import { Output } from 'ai';



3

import { z } from 'zod';



4



5

const agent = new HarnessAgent({



6

harness: claudeCode,



7

sandbox,



8

output: Output.object({



9

schema: z.object({



10

recipe: z.object({



11

name: z.string(),



12

ingredients: z.array(



13

z.object({



14

name: z.string(),



15

amount: z.number(),



16

unit: z.enum(['oz', 'fl oz', 'cup', 'gallon']),



17

}),



18

),



19

steps: z.array(z.string()),



20

}),



21

}),



22

}),



23

});



24



25

const session = await agent.createSession();



26

try {



27

const result = await agent.generate({



28

session,



29

prompt: 'Generate a lasagna recipe.',



30

});



31

console.dir(result.output, { depth: Infinity });



32

} finally {



33

await session.destroy();



34

}
```

With `stream()`, read `partialOutputStream` for incrementally parsed values and
await `result.output` for the validated final value. Structured data also remains
available as JSON in the normal text and stream surfaces; adapters do not add it
to the `finish` part.

Harness structured output requires a schema. Schema-less `Output.json()` and
adapters or runtime configurations that cannot enforce the schema throw
`HarnessCapabilityUnsupportedError`; see the
[adapter capability table](/docs/ai-sdk-harnesses/harness-adapters#adapter-capabilities).

[Messages and History](#messages-and-history)
---------------------------------------------

A harness session owns its native conversation history. When you pass `messages`
or a message-array `prompt`, `HarnessAgent` takes the latest user message as the
fresh input for the turn. It does not replay the full prior conversation into
the harness.

A trailing tool message is handled differently: tool approval responses and
client-provided tool results continue the unfinished harness turn that produced
the corresponding request or tool call.

This is different from model calls, where the application usually sends the full
message history. In chat routes, persist and resume the harness session instead
of relying on message replay.

[Session Lifecycle](#session-lifecycle)
---------------------------------------

End every session explicitly:

* `session.destroy()` stops the runtime and discards resumability.
* `session.detach()` parks the runtime and sandbox, returns resume state, and
  keeps the sandbox warm for a later attach. If the turn is unfinished, the
  resume state includes the continuation state.
* `session.stop()` saves resume state, then stops the runtime and sandbox. If
  the turn is unfinished, the resume state includes the continuation state.
* `session.suspendTurn()` is for advanced active-turn continuation across a
  process boundary.
* `session.hasUnfinishedTurn()` reports whether the current turn must be
  continued or suspended before the session accepts a new prompt.

Use `destroy()` for one-off scripts and tests. Use `detach()` or `stop()` for
HTTP routes that need multi-turn continuity.

[Change Settings Between Turns](#change-settings-between-turns)
---------------------------------------------------------------

Use `callOptionsSchema` and `prepareCall` to derive `model`, `skills`,
`instructions`, and `tools` for each new turn. This follows the same
call-options pattern as `ToolLoopAgent`:

```
1

import { HarnessAgent } from '@ai-sdk/harness/agent';



2

import { tool } from 'ai';



3

import { z } from 'zod';



4



5

const getPolicy = tool({



6

description: 'Look up the active project policy.',



7

inputSchema: z.object({}),



8

execute: async () => 'Keep public APIs backward compatible.',



9

});



10



11

const agent = new HarnessAgent({



12

harness: claudeCode,



13

sandbox,



14

tools: { getPolicy },



15

callOptionsSchema: z.object({



16

area: z.enum(['frontend', 'backend']),



17

enablePolicyTool: z.boolean(),



18

useCheaperModel: z.boolean(),



19

}),



20

prepareCall: ({ options, ...call }) => ({



21

...call,



22

model: options.useCheaperModel ? 'claude-haiku-4-5' : undefined,



23

instructions: `Work as the ${options.area} specialist.`,



24

skills: [options.area === 'frontend' ? frontendSkill : backendSkill],



25

tools: options.enablePolicyTool ? { getPolicy } : undefined,



26

}),



27

});



28



29

const session = await agent.createSession();



30

try {



31

await agent.generate({



32

session,



33

prompt: 'Review the current implementation.',



34

options: {



35

area: 'frontend',



36

enablePolicyTool: false,



37

useCheaperModel: false,



38

},



39

});



40



41

await agent.generate({



42

session,



43

prompt: 'Now review the API contract.',



44

options: {



45

area: 'backend',



46

enablePolicyTool: true,



47

useCheaperModel: true,



48

},



49

});



50

} finally {



51

await session.destroy();



52

}
```

`prepareCall` runs for a new prompt after its custom `options` have been
validated. Its settings are then fixed for that whole turn. If the turn pauses
for a tool result, approval, stop condition, or process handoff, its
continuation reuses the same settings and does not call `prepareCall` again.
This prevents settings from changing mid-turn.

Changing `model` does not create a new harness session. Each adapter switches or
reconfigures its runtime before the next prompt while preserving the session's
conversation history.

The Codex adapter starts a fresh native Codex thread when its skills,
instructions, or tool catalog changes because `codex exec resume` retains the
original native thread bootstrap. The harness session remains usable, but prior
native conversation context does not carry across that settings-change boundary.
Turns with unchanged settings continue the existing native thread.

Pass `abortSignal` directly to `generate()` or `stream()`; it is already a
per-call setting and is not part of `prepareCall`. `output` also stays fixed on
the agent because its response format is tied to the agent's output schema.

When you pass `sandboxSession` to `agent.createSession()`, the caller retains
ownership of that sandbox. `session.stop()` and `session.destroy()` still end
the harness runtime but do not stop or destroy the supplied sandbox session.
In this case, the agent does not need a `sandbox` provider in its constructor.

```
1

const session = await agent.createSession({ sessionId: chatId });



2



3

try {



4

const result = await agent.stream({ session, messages });



5



6

for await (const part of result.stream) {



7

if (part.type === 'text-delta') {



8

process.stdout.write(part.text);



9

}



10

}



11



12

const resumeState = await session.detach();



13

await persistResumeState({ chatId, resumeState });



14

} catch (error) {



15

await session.destroy();



16

throw error;



17

}
```

[Resuming](#resuming)
---------------------

Persist the opaque resume state and pass it back with the original `sessionId`:

```
1

const resumeState = await loadResumeState({ chatId });



2



3

const session = await agent.createSession(



4

resumeState



5

? { sessionId: chatId, resumeFrom: resumeState }



6

: { sessionId: chatId },



7

);
```

`HarnessAgent` validates that the resume state was produced by the same harness
adapter before handing it to the runtime. If the resume state includes an
unfinished turn, call `continueStream()` or `continueGenerate()` before sending a
new prompt.

[Continue a Suspended Turn](#continue-a-suspended-turn)
-------------------------------------------------------

For advanced workflows that must hand off an active turn across a process
boundary, suspend the turn and persist the continuation state:

```
1

if (session.hasUnfinishedTurn()) {



2

const continuationState = await session.suspendTurn();



3

await persistContinuationState({ chatId, continuationState });



4

}
```

When you only have raw continuation state from `suspendTurn()`, resume with
`continueFrom`, then continue the turn without sending a new prompt:

```
1

const session = await agent.createSession({



2

sessionId: chatId,



3

continueFrom: continuationState,



4

});



5



6

const result = await agent.continueStream({ session });
```

Use `continueStream()` for incremental output, or `continueGenerate()` to drain
the continued turn and return a `GenerateTextResult`.

[Stop After a Harness Step](#stop-after-a-harness-step)
-------------------------------------------------------

Use `stopWhen` to opt into semantic step boundaries. Predicates run after real
harness tool steps that can continue into another model step, and receive the
completed steps from the current invocation. When a predicate matches, the
returned result finishes while the underlying turn remains unfinished. A
terminal text-only step instead consumes the turn's `finish` event and finishes
naturally.

```
1

import { isStepCount } from 'ai';



2



3

const steppedAgent = new HarnessAgent({



4

harness: claudeCode,



5

sandbox: createVercelSandbox({



6

runtime: 'node24',



7

ports: [4000],



8

}),



9

stopWhen: isStepCount(1),



10

});



11



12

const session = await steppedAgent.createSession();



13

const result = await steppedAgent.generate({



14

session,



15

prompt: 'Create a short TODO.md for this repository.',



16

});



17



18

if (session.hasUnfinishedTurn()) {



19

const continueFrom = await session.suspendTurn();



20

await persistContinuationState({ chatId, continuationState: continueFrom });



21

}
```

`stopWhen` has no default. When omitted, `HarnessAgent` continues running until
the turn naturally finishes or pauses for host input, preserving the behavior
of agents without step control. Pass one predicate or an array; matching any
predicate finishes the current result slice. Resume a stopped turn with
`createSession({ continueFrom })` and `continueStream()` or
`continueGenerate()`.

[Prepare the Sandbox](#prepare-the-sandbox)
-------------------------------------------

Use `sandboxConfig` to prepare the sandbox before the harness starts.

`sandboxConfig.onBootstrap` runs during sandbox template creation, after the
harness adapter's own bootstrap and before snapshot-capable providers publish a
snapshot. Use it for expensive setup that should be reused by future sessions.
When you provide `onBootstrap`, also provide `bootstrapHash`; change the hash
whenever the bootstrap output should invalidate the reusable snapshot.

`sandboxConfig.onSession` runs after each sandbox session is acquired and its
working directory exists, including resumed sessions. Use it for per-session
files or lightweight configuration.

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

sandboxConfig: {



8

workDir: 'repo',



9

bootstrapHash: 'ripgrep-v1',



10

onBootstrap: async ({ session, abortSignal }) => {



11

const result = await session.run({



12

command:



13

'command -v rg >/dev/null || (apt-get update && apt-get install -y ripgrep)',



14

abortSignal,



15

});



16

if (result.exitCode !== 0) {



17

throw new Error(`Failed to install ripgrep: ${result.stderr}`);



18

}



19

},



20

onSession: async ({ session, sessionWorkDir, abortSignal }) => {



21

await session.writeTextFile({



22

path: `${sessionWorkDir}/README.md`,



23

content: 'Session notes for the harness.',



24

abortSignal,



25

});



26

},



27

},



28

});
```

`workDir` is optional. When provided, it must be relative to the sandbox's
default working directory and is used as the session working directory. When
omitted, regular sessions use the default `<harnessId>-<sessionId>` directory,
while `onBootstrap` receives the sandbox's default working directory.

[Prepare Reusable Sandboxes](#prepare-reusable-sandboxes)
---------------------------------------------------------

Use `prepareHarnessSandboxTemplate()` when you want the sandbox provider to
create or refresh its reusable template for one harness ahead of time:

```
1

import { prepareHarnessSandboxTemplate } from '@ai-sdk/harness/agent';



2



3

await prepareHarnessSandboxTemplate({



4

harness: claudeCode,



5

sandboxProvider: createVercelSandbox({



6

runtime: 'node24',



7

ports: [4000],



8

}),



9

sandboxConfig: {



10

bootstrapHash: 'ripgrep-v1',



11

onBootstrap: async ({ session, abortSignal }) => {



12

await session.run({



13

command:



14

'command -v rg >/dev/null || (apt-get update && apt-get install -y ripgrep)',



15

abortSignal,



16

});



17

},



18

},



19

});
```

Use `prepareSandboxForHarness()` when you own the native sandbox lifecycle and
want to snapshot the prepared sandbox yourself. It applies the selected harness
bootstrap recipes and `sandboxConfig.onBootstrap`, then returns preparation
metadata. It does not stop or snapshot the sandbox.

```
1

import { HarnessAgent, prepareSandboxForHarness } from '@ai-sdk/harness/agent';



2

import { createVercelSandbox } from '@ai-sdk/sandbox-vercel';



3

import { Sandbox } from '@vercel/sandbox';



4



5

const nativeSandbox = await Sandbox.create({



6

runtime: 'node24',



7

ports: [4000],



8

});



9

const sandboxProvider = createVercelSandbox({ sandbox: nativeSandbox });



10

const session = await sandboxProvider.createSession();



11



12

const preparation = await prepareSandboxForHarness({



13

session: session.restricted(),



14

harnesses: [claudeCode, codex],



15

sandboxConfig,



16

});



17



18

const { snapshot } = await nativeSandbox.stop();



19

if (snapshot == null) {



20

throw new Error('Prepared sandbox did not create a snapshot.');



21

}



22



23

const sandboxFromSnapshot = await Sandbox.create({



24

source: {



25

type: 'snapshot',



26

snapshotId: snapshot.id,



27

},



28

ports: [4000],



29

});



30



31

const agent = new HarnessAgent({



32

harness: claudeCode,



33

sandbox: createVercelSandbox({ sandbox: sandboxFromSnapshot }),



34

sandboxConfig,



35

});



36



37

console.log(preparation.identity);
```

[Settings](#settings)
---------------------

`HarnessAgent` accepts these main settings:

* `harness`: the adapter instance.
* `model`: optional harness-specific model identifier. When omitted, the
  harness uses its default model.
* `sandbox`: a `HarnessV1SandboxProvider`.
* `id`: optional stable agent identifier.
* `instructions`: instructions appended to the runtime's system or developer
  prompt when supported, or prepended to the user prompt otherwise.
* `headers`: additional headers sent with model requests. Headers are fixed at
  construction time. `authorization`, `x-api-key`, `user-agent`, and
  `x-client-app` are not allowed.
* `callOptionsSchema` and `prepareCall`: validate custom call options and derive
  model, skills, instructions, and tools for each new turn.
* `output`: typed output specification applied to every turn.
* `stopWhen`: condition(s) for finishing a result slice after a completed
  harness tool step that can continue into another model step.
* `tools`: AI SDK tools executed by the host when the harness calls them.
* `activeTools`: allowlist of built-in and host-executed tools the harness can
  call.
* `inactiveTools`: denylist of built-in and host-executed tools the harness
  cannot call.
* `skills`: instruction bundles surfaced by the adapter.
* `permissionMode`: built-in tool permission mode.
* `toolApproval`: approval status map for host-executed tools.
* `sandboxConfig`: sandbox working-directory and lifecycle hook configuration.
* `telemetry`, `debug`, and `onLog`: observability and diagnostics.

Telemetry reports each turn's resolved model, instructions, and active
host-defined tools. Skills are adapter context and do not have a corresponding
AI SDK telemetry field, so they are not included in standard telemetry events.

Adapter-specific settings belong on the adapter factory, for example
`createCodex({ reasoningEffort: 'high' })`.

[Custom Sandbox Orchestration](#custom-sandbox-orchestration)
-------------------------------------------------------------

When your application creates and manages sandboxes itself, prepare the network
sandbox session first and then pass that same session to `agent.createSession()`.
The agent does not need a sandbox provider and does not stop or destroy the
caller-owned sandbox.

```
1

import { HarnessAgent, prepareSandboxForHarness } from '@ai-sdk/harness/agent';



2

import { claudeCode } from '@ai-sdk/harness-claude-code';



3

import { createVercelSandbox } from '@ai-sdk/sandbox-vercel';



4

import { Sandbox } from '@vercel/sandbox';



5



6

const sandbox = await Sandbox.create({



7

runtime: 'node24',



8

ports: [4000],



9

});



10

const sandboxProvider = createVercelSandbox({ sandbox });



11

const sandboxSession = await sandboxProvider.createSession();



12



13

await prepareSandboxForHarness({



14

session: sandboxSession.restricted(),



15

harnesses: [claudeCode],



16

});



17



18

const agent = new HarnessAgent({ harness: claudeCode });



19

const session = await agent.createSession({ sandboxSession });



20



21

try {



22

const result = await agent.stream({



23

session,



24

prompt: 'Create a short TODO.md for this repository.',



25

});



26



27

for await (const part of result.stream) {



28

if (part.type === 'text-delta') {



29

process.stdout.write(part.text);



30

}



31

}



32

} finally {



33

await session.destroy();



34

await sandbox.stop();



35

}
```

### [Basic Sandbox Sessions Without Network Control](#basic-sandbox-sessions-without-network-control)

The following example demonstrates how the basic-session API works. If your
project can expose a full network sandbox session, passing that session is
strongly recommended. Pass a restricted basic session only when your project
cannot expose the full network session.

A basic sandbox session only exposes filesystem and process APIs. The agent
still leaves the sandbox lifecycle to the caller. For a bridge-backed harness,
configure the bridge port and its externally reachable endpoint on the adapter
because the basic session cannot resolve them.

```
1

import { HarnessAgent, prepareSandboxForHarness } from '@ai-sdk/harness/agent';



2

import { createClaudeCode } from '@ai-sdk/harness-claude-code';



3

import { createVercelSandbox } from '@ai-sdk/sandbox-vercel';



4

import { Sandbox } from '@vercel/sandbox';



5



6

const sandbox = await Sandbox.create({



7

runtime: 'node24',



8

ports: [4000],



9

});



10

const sandboxProvider = createVercelSandbox({ sandbox });



11

const sandboxSession = await sandboxProvider.createSession();



12

const portEndpoint = await sandboxSession.getPortEndpoint({



13

port: 4000,



14

protocol: 'ws',



15

});



16

const restrictedSandboxSession = sandboxSession.restricted();



17

const claudeCode = createClaudeCode({ port: 4000, portEndpoint });



18



19

await prepareSandboxForHarness({



20

session: restrictedSandboxSession,



21

harnesses: [claudeCode],



22

});



23



24

const agent = new HarnessAgent({ harness: claudeCode });



25

const session = await agent.createSession({



26

sandboxSession: restrictedSandboxSession,



27

});



28



29

try {



30

const result = await agent.stream({



31

session,



32

prompt: 'Create a short TODO.md for this repository.',



33

});



34



35

for await (const part of result.stream) {



36

if (part.type === 'text-delta') {



37

process.stdout.write(part.text);



38

}



39

}



40

} finally {



41

await session.destroy();



42

await sandbox.stop();



43

}
```

[Next Steps](#next-steps)
-------------------------

* [Tools](/docs/ai-sdk-harnesses/tools) for built-in and host-executed tools.
* [Skills](/docs/ai-sdk-harnesses/skills) for reusable instruction bundles.
* [Harness adapters](/docs/ai-sdk-harnesses/harness-adapters) for adapter-specific
  settings.
* [Workflow utilities](/docs/ai-sdk-harnesses/workflow-utilities) for durable
  long-running turns.
* [UI](/docs/ai-sdk-harnesses/ui) for `useChat` integration.

[Previous

Overview](/docs/ai-sdk-harnesses/overview)[Next

Tools](/docs/ai-sdk-harnesses/tools)
