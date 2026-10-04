---
title: "Workflow Utilities"
source_url: https://ai-sdk.dev/docs/ai-sdk-harnesses/workflow-utilities
section: ai-sdk-harnesses
crawled: 2026-09-20
---

# Workflow Utilities

> Source: https://ai-sdk.dev/docs/ai-sdk-harnesses/workflow-utilities

[AI SDK Harnesses](/docs/ai-sdk-harnesses)Workflow Utilities


[Workflow Utilities](#workflow-utilities)
=========================================

`@ai-sdk/workflow-harness` provides helpers for running `HarnessAgent` turns
inside a [workflow](https://vercel.com/docs/workflow).

The package provides a serializable state machine and runners for time-sliced
and semantic agent step turns. You call the appropriate runner from your own
`'use workflow'` and `'use step'` functions.

The core harness and workflow files are framework-independent. The HTTP handlers
shown below use Next.js as one example; adapt them to your runtime and Workflow
SDK integration. If you use Next.js, ensure you have
[configured your project for Workflow](https://workflow-sdk.dev/docs/getting-started/next)
before following the examples.

[Installation](#installation)
-----------------------------

pnpmnpmbunyarn

```
pnpm add @ai-sdk/workflow-harness workflow
```

In addition to the workflow specific packages, install the core harness package,
a harness adapter, and a sandbox provider as shown in
[HarnessAgent](/docs/ai-sdk-harnesses/harness-agent).

[Configuring the Harness Agent](#configuring-the-harness-agent)
---------------------------------------------------------------

The agent can be configured in the usual way, for the most part. When using
semantic agent steps, set `stopWhen` to `isStepCount(1)` so one call to
`stream()` completes one agent step. Omit it when using time slices.

harness-workflow/agent.ts

```
1

import { HarnessAgent } from '@ai-sdk/harness/agent';



2

import { claudeCode } from '@ai-sdk/harness-claude-code';



3

import { createVercelSandbox } from '@ai-sdk/sandbox-vercel';



4

import { isStepCount } from 'ai';



5



6

export const agent = new HarnessAgent({



7

harness: claudeCode,



8

sandbox: createVercelSandbox({



9

runtime: 'node24',



10

ports: [4000],



11

}),



12

instructions: 'You are a helpful coding assistant.',



13

/*



14

* Only needed for semantic agent-step workflows.



15

* Omit this for time-sliced workflows.



16

*/



17

stopWhen: isStepCount(1),



18

});
```

[Using Semantic Agent Steps](#using-semantic-agent-steps)
---------------------------------------------------------

Semantic agent steps persist the harness turn after each agent step. Configure
the shared agent with the highlighted `stopWhen` option shown above, then call
`runHarnessAgentStep()` from a Workflow step.

### [Defining the Agent Step](#defining-the-agent-step)

Keep the Workflow step in its own module and import the agent dynamically inside
the step body. This keeps the agent, sandbox provider, and other Node.js
dependencies out of the workflow bundle.

harness-workflow/agent-step.ts

```
1

import {



2

runHarnessAgentStep,



3

type HarnessWorkflowState,



4

} from '@ai-sdk/workflow-harness';



5



6

export async function agentStep(



7

state: HarnessWorkflowState,



8

): Promise<HarnessWorkflowState> {



9

'use step';



10



11

const { agent } = await import('./agent');



12



13

return runHarnessAgentStep({



14

agent,



15

state,



16

});



17

}
```

### [Defining the Semantic Agent Step Workflow](#defining-the-semantic-agent-step-workflow)

Create the workflow state and keep scheduling `agentStep()` while the agent has
more work.

harness-workflow/workflow.ts

```
1

import { agentStep } from './agent-step';



2

import {



3

createHarnessWorkflowState,



4

finalizeHarnessWorkflow,



5

type HarnessWorkflowInput,



6

} from '@ai-sdk/workflow-harness';



7



8

export async function agentWorkflow(input: {



9

messages: NonNullable<HarnessWorkflowInput['messages']>;



10

sessionId: string;



11

}) {



12

'use workflow';



13



14

let state = createHarnessWorkflowState(input);



15



16

do {



17

state = await agentStep(state);



18

} while (state.status === 'ready_for_next_step');



19



20

return finalizeHarnessWorkflow(state);



21

}
```

This example covers the workflow execution foundation only. For multi-turn
conversations, you must persist the harness session's `resumeFrom` state
between workflow runs. See [Resume Persistence](#resume-persistence).

Each `ready_for_next_step` result carries `continueFrom`, which lets the next
Workflow step continue the same unfinished turn. When the turn finishes,
`finalizeHarnessWorkflow()` returns its result or throws if the workflow failed.

### [Starting the Semantic Agent Step Workflow](#starting-the-semantic-agent-step-workflow)

Start the workflow from server-side code. This Next.js route converts the AI SDK
UI messages, starts `agentWorkflow()`, and returns the workflow's AI SDK UI
message stream. Passing the converted messages lets `HarnessAgent` distinguish a
new user turn from tool approval and tool result continuations.

app/api/harness-workflow/route.ts

```
1

import { agentWorkflow } from '../../../harness-workflow/workflow';



2

import {



3

convertToModelMessages,



4

createUIMessageStreamResponse,



5

type UIMessage,



6

type UIMessageChunk,



7

} from 'ai';



8

import { start } from 'workflow/api';



9



10

export async function POST(request: Request) {



11

const body: {



12

id?: string;



13

messages: UIMessage[];



14

} = await request.json();



15



16

if (!body.id) {



17

return new Response('Missing chat ID', { status: 400 });



18

}



19



20

const messages = await convertToModelMessages(body.messages);



21

const run = await start(agentWorkflow, [



22

{



23

messages,



24

sessionId: body.id,



25

},



26

]);



27



28

return createUIMessageStreamResponse({



29

stream: run.readable as ReadableStream<UIMessageChunk>,



30

});



31

}
```

The `sessionId` gives the sandbox a stable identity across workflow runs. Keep
`agent.ts`, `agent-step.ts`, `workflow.ts`, and the route in separate modules so
the workflow bundle does not include Node-heavy agent, sandbox, or framework
dependencies.

[Using Time Slices](#using-time-slices)
---------------------------------------

Time slices persist a long-running harness turn at wall-clock boundaries. Omit
the highlighted `stopWhen` option from the shared agent, then call
`runHarnessAgentTimeSlice()` from a Workflow step. It uses a 750-second budget
by default; pass `timeSliceSeconds` to choose a different budget.

### [Defining the Time Slice Step](#defining-the-time-slice-step)

As with semantic agent steps, keep the Workflow step in its own module and
import the agent dynamically inside the step body.

harness-workflow/time-slice-step.ts

```
1

import {



2

runHarnessAgentTimeSlice,



3

type HarnessWorkflowState,



4

} from '@ai-sdk/workflow-harness';



5



6

export async function timeSliceStep(



7

state: HarnessWorkflowState,



8

): Promise<HarnessWorkflowState> {



9

'use step';



10



11

const { agent } = await import('./agent');



12



13

return runHarnessAgentTimeSlice({



14

agent,



15

state,



16

});



17

}
```

### [Defining the Time-Sliced Workflow](#defining-the-time-sliced-workflow)

Create the workflow state and keep scheduling `timeSliceStep()` while the agent
has more work.

harness-workflow/workflow.ts

```
1

import { timeSliceStep } from './time-slice-step';



2

import {



3

createHarnessWorkflowState,



4

finalizeHarnessWorkflow,



5

type HarnessWorkflowInput,



6

} from '@ai-sdk/workflow-harness';



7



8

export async function timeSliceWorkflow(input: {



9

messages: NonNullable<HarnessWorkflowInput['messages']>;



10

sessionId: string;



11

}) {



12

'use workflow';



13



14

let state = createHarnessWorkflowState(input);



15



16

do {



17

state = await timeSliceStep(state);



18

} while (state.status === 'ready_for_next_step');



19



20

return finalizeHarnessWorkflow(state);



21

}
```

This example covers the workflow execution foundation only. For multi-turn
conversations, you must persist the harness session's `resumeFrom` state
between workflow runs. See [Resume Persistence](#resume-persistence).

Each `ready_for_next_step` result carries `continueFrom`, which lets the next
Workflow step continue the same unfinished turn. When the turn finishes,
`finalizeHarnessWorkflow()` returns its result or throws if the workflow failed.

### [Starting the Time-Sliced Workflow](#starting-the-time-sliced-workflow)

Start the workflow from server-side code. As with semantic agent steps, pass the
converted messages so `HarnessAgent` can distinguish a new user turn from tool
approval and tool result continuations.

app/api/harness-workflow/route.ts

```
1

import { timeSliceWorkflow } from '../../../harness-workflow/workflow';



2

import {



3

convertToModelMessages,



4

createUIMessageStreamResponse,



5

type UIMessage,



6

type UIMessageChunk,



7

} from 'ai';



8

import { start } from 'workflow/api';



9



10

export async function POST(request: Request) {



11

const body: {



12

id?: string;



13

messages: UIMessage[];



14

} = await request.json();



15



16

if (!body.id) {



17

return new Response('Missing chat ID', { status: 400 });



18

}



19



20

const messages = await convertToModelMessages(body.messages);



21

const run = await start(timeSliceWorkflow, [



22

{



23

messages,



24

sessionId: body.id,



25

},



26

]);



27



28

return createUIMessageStreamResponse({



29

stream: run.readable as ReadableStream<UIMessageChunk>,



30

});



31

}
```

The `sessionId` gives the sandbox a stable identity across workflow runs. Keep
`agent.ts`, `time-slice-step.ts`, `workflow.ts`, and the route in separate
modules so the workflow bundle does not include Node-heavy agent, sandbox, or
framework dependencies.

[Resume Persistence](#resume-persistence)
-----------------------------------------

Workflow automatically persists the `HarnessWorkflowState` returned by each
step, including `continueFrom`, for the duration of the current workflow run.
To continue the native harness session across separate user-turn workflow runs,
persist the opaque `resumeFrom` state by `sessionId`.

The storage implementation is the same for semantic agent steps and time
slices. This example uses Workflow steps because filesystem access must stay out
of the workflow function itself. Use durable storage instead of local files in
production.

harness-workflow/resume-store.ts

```
1

import type { HarnessV1ResumeSessionState } from '@ai-sdk/harness';



2

import { safeParseJSON } from '@ai-sdk/provider-utils';



3



4

const RESUME_DIR = '.harness-sessions';



5



6

function fileName(sessionId: string): string {



7

return `${sessionId.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;



8

}



9



10

export async function loadResumeStep(



11

sessionId: string,



12

): Promise<HarnessV1ResumeSessionState | undefined> {



13

'use step';



14



15

const { readFile } = await import('node:fs/promises');



16

const { join } = await import('node:path');



17



18

let text: string;



19

try {



20

text = await readFile(



21

join(process.cwd(), RESUME_DIR, fileName(sessionId)),



22

'utf8',



23

);



24

} catch {



25

return undefined;



26

}



27



28

const parsed = await safeParseJSON({ text });



29



30

return parsed.success



31

? (parsed.value as unknown as HarnessV1ResumeSessionState)



32

: undefined;



33

}



34



35

export async function persistResumeStep({



36

sessionId,



37

resumeState,



38

}: {



39

sessionId: string;



40

resumeState: HarnessV1ResumeSessionState | undefined;



41

}): Promise<void> {



42

'use step';



43



44

if (!resumeState) return;



45



46

const { mkdir, writeFile } = await import('node:fs/promises');



47

const { join } = await import('node:path');



48

const dir = join(process.cwd(), RESUME_DIR);



49



50

await mkdir(dir, { recursive: true });



51

await writeFile(join(dir, fileName(sessionId)), JSON.stringify(resumeState));



52

}
```

Load the previous `resumeFrom` state before creating the workflow state, then
persist the updated value after the execution loop. The integration points are
the same for both workflow approaches.

### [Semantic Agent Step Workflow](#semantic-agent-step-workflow)

harness-workflow/workflow.ts

```
1

import { agentStep } from './agent-step';



2

import { loadResumeStep, persistResumeStep } from './resume-store';



3

import {



4

createHarnessWorkflowState,



5

finalizeHarnessWorkflow,



6

type HarnessWorkflowInput,



7

} from '@ai-sdk/workflow-harness';



8



9

export async function agentWorkflow(input: {



10

messages: NonNullable<HarnessWorkflowInput['messages']>;



11

sessionId: string;



12

}) {



13

'use workflow';



14



15

const resumeFrom = await loadResumeStep(input.sessionId);



16

let state = createHarnessWorkflowState({ ...input, resumeFrom });



17



18

do {



19

state = await agentStep(state);



20

} while (state.status === 'ready_for_next_step');



21



22

await persistResumeStep({



23

sessionId: state.sessionId,



24

resumeState: state.resumeFrom,



25

});



26



27

return finalizeHarnessWorkflow(state);



28

}
```

### [Time-Sliced Workflow](#time-sliced-workflow)

harness-workflow/workflow.ts

```
1

import { loadResumeStep, persistResumeStep } from './resume-store';



2

import { timeSliceStep } from './time-slice-step';



3

import {



4

createHarnessWorkflowState,



5

finalizeHarnessWorkflow,



6

type HarnessWorkflowInput,



7

} from '@ai-sdk/workflow-harness';



8



9

export async function timeSliceWorkflow(input: {



10

messages: NonNullable<HarnessWorkflowInput['messages']>;



11

sessionId: string;



12

}) {



13

'use workflow';



14



15

const resumeFrom = await loadResumeStep(input.sessionId);



16

let state = createHarnessWorkflowState({ ...input, resumeFrom });



17



18

do {



19

state = await timeSliceStep(state);



20

} while (state.status === 'ready_for_next_step');



21



22

await persistResumeStep({



23

sessionId: state.sessionId,



24

resumeState: state.resumeFrom,



25

});



26



27

return finalizeHarnessWorkflow(state);



28

}
```

[Related](#related)
-------------------

* [HarnessAgent](/docs/ai-sdk-harnesses/harness-agent)
* [Harness adapters](/docs/ai-sdk-harnesses/harness-adapters)
* [UI](/docs/ai-sdk-harnesses/ui)

[Previous

Harness Adapters](/docs/ai-sdk-harnesses/harness-adapters)[Next

UI](/docs/ai-sdk-harnesses/ui)
