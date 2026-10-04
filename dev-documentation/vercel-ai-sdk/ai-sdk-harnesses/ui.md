---
title: "Harnesses with AI SDK UI"
source_url: https://ai-sdk.dev/docs/ai-sdk-harnesses/ui
section: ai-sdk-harnesses
crawled: 2026-09-20
---

# Harnesses with AI SDK UI

> Source: https://ai-sdk.dev/docs/ai-sdk-harnesses/ui

[AI SDK Harnesses](/docs/ai-sdk-harnesses)UI


[Harnesses with AI SDK UI](#harnesses-with-ai-sdk-ui)
=====================================================

Harness streams are compatible with AI SDK UI message streams. You can use
`useChat()` on the client and stream `HarnessAgent` output from a server route.

The important difference from model-based chat routes is session management.
A harness owns its conversation state, so the route should resume or create a
`HarnessAgentSession` for the chat id instead of replaying the whole UI message
history into a model.

[Client](#client)
-----------------

app/page.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { DefaultChatTransport } from 'ai';



5

import { useState } from 'react';



6



7

export default function Page() {



8

const [input, setInput] = useState('');



9

const { error, messages, sendMessage, status } = useChat({



10

id: 'example-chat',



11

transport: new DefaultChatTransport({



12

api: '/api/chat',



13

}),



14

});



15



16

return (



17

<>



18

{messages.map(message => (



19

<div key={message.id}>



20

<strong>{message.role === 'user' ? 'You: ' : 'AI: '}</strong>



21

{message.parts.map((part, index) => {



22

if (part.type === 'text') {



23

return <span key={index}>{part.text}</span>;



24

}



25



26

if (part.type.startsWith('tool-') || part.type === 'dynamic-tool') {



27

return <pre key={index}>{JSON.stringify(part, null, 2)}</pre>;



28

}



29



30

return null;



31

})}



32

</div>



33

))}



34



35

{error && <div>{error.message}</div>}



36



37

<form



38

onSubmit={event => {



39

event.preventDefault();



40

if (input.trim()) {



41

sendMessage({ text: input });



42

setInput('');



43

}



44

}}



45

>



46

<input



47

value={input}



48

onChange={event => setInput(event.target.value)}



49

disabled={status !== 'ready'}



50

/>



51

<button type="submit" disabled={status !== 'ready'}>



52

Send



53

</button>



54

</form>



55

</>



56

);



57

}
```

[Agent](#agent)
---------------

Define the `HarnessAgent` on the server:

app/api/chat/agent.ts

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

sandbox: createVercelSandbox({



8

runtime: 'node24',



9

ports: [4000],



10

}),



11

instructions: 'You are a helpful coding assistant.',



12

});
```

[Session Store](#session-store)
-------------------------------

Persist only the opaque resume state returned by `session.detach()`. If the
turn paused for approval or was otherwise interrupted, that resume state carries
the continuation state internally. The chat id can also be the harness
`sessionId`, which gives the sandbox a stable identity across requests and
processes.

app/api/chat/session-store.ts

```
1

import type {



2

HarnessAgentResumeSessionState,



3

HarnessAgentSession,



4

} from '@ai-sdk/harness/agent';



5



6

const states: Record<string, HarnessAgentResumeSessionState | undefined> = {};



7



8

type SessionFactory = {



9

createSession(options?: {



10

sessionId?: string;



11

resumeFrom?: HarnessAgentResumeSessionState;



12

}): Promise<HarnessAgentSession>;



13

};



14



15

export async function resumeOrCreateSession({



16

agent,



17

chatId,



18

}: {



19

agent: SessionFactory;



20

chatId: string;



21

}) {



22

const resumeFrom = states[chatId];



23



24

return agent.createSession(



25

resumeFrom ? { sessionId: chatId, resumeFrom } : { sessionId: chatId },



26

);



27

}



28



29

export async function detachAndPersist({



30

chatId,



31

session,



32

}: {



33

chatId: string;



34

session: HarnessAgentSession;



35

}) {



36

states[chatId] = await session.detach();



37

}
```

Use durable storage instead of an in-memory map in production.

[Route](#route)
---------------

Convert UI messages to model messages, run the harness turn, and convert the
result stream back to a UI message stream:

app/api/chat/route.ts

```
1

import { agent } from './agent';



2

import { detachAndPersist, resumeOrCreateSession } from './session-store';



3

import { getHarnessErrorMessage } from '@ai-sdk/harness/agent';



4

import {



5

convertToModelMessages,



6

createUIMessageStream,



7

createUIMessageStreamResponse,



8

toUIMessageStream,



9

type UIMessage,



10

} from 'ai';



11



12

export async function POST(request: Request) {



13

const body: {



14

id?: string;



15

messages: UIMessage[];



16

} = await request.json();



17



18

if (!body.id) {



19

throw new Error('Missing chat id');



20

}



21



22

const chatId = body.id;



23

const messages = await convertToModelMessages(body.messages);



24



25

return createUIMessageStreamResponse({



26

stream: createUIMessageStream({



27

execute: async ({ writer }) => {



28

const session = await resumeOrCreateSession({ agent, chatId });



29

const result = await agent.stream({ session, messages });



30



31

writer.merge(



32

toUIMessageStream({



33

stream: result.stream,



34

onError: getHarnessErrorMessage,



35

onEnd: async () => {



36

await detachAndPersist({ chatId, session });



37

},



38

}),



39

);



40

},



41

onError: getHarnessErrorMessage,



42

}),



43

});



44

}
```

Creating the UI message stream before acquiring the session ensures sandbox,
bootstrap, and harness startup failures are sent as UI error parts instead of
becoming generic HTTP errors. `getHarnessErrorMessage` preserves reviewed,
client-safe harness messages and masks unknown server errors.

Do not use `createAgentUIStreamResponse` directly with `HarnessAgent` unless you
wrap the agent to inject the required session. `HarnessAgent.stream()` requires
`session` on every call.

[Detach or Stop](#detach-or-stop)
---------------------------------

Use `session.detach()` when you want to park the harness runtime and keep the
sandbox warm for the next request. Bridge-backed adapters can usually reattach
or replay efficiently. If the turn is unfinished, `detach()` includes the turn
continuation state in the returned resume state.

Use `session.stop()` when you want to save resume state and stop the runtime and
sandbox after each turn. The next request resumes from persisted state and
continues any unfinished turn before accepting a new prompt.

[Rendering Harness Parts](#rendering-harness-parts)
---------------------------------------------------

Harness output contains the same UI message part shapes used by AI SDK model
streams:

* `text` and `reasoning` parts for generated content.
* typed tool parts such as `tool-bash`, `tool-read`, or a host tool like
  `tool-weather`.
* `dynamic-tool` parts for dynamic events such as `fileChange` and
  `compaction`.

Render typed harness built-ins the same way you render normal AI SDK tool
parts. Check `part.state` for `input-streaming`, `input-available`, and
`output-available`.

[Type-Safe Tool Parts](#type-safe-tool-parts)
---------------------------------------------

Until `HarnessAgent` session options are part of the base `Agent` call
parameters, infer UI tools from `agent.tools`:

```
1

import type { InferUITools, UIMessage } from 'ai';



2

import { agent } from './agent';



3



4

export type HarnessMessage = UIMessage<



5

unknown,



6

never,



7

InferUITools<typeof agent.tools>



8

>;
```

Then use `useChat<HarnessMessage>()` on the client.

[Previous

Workflow Utilities](/docs/ai-sdk-harnesses/workflow-utilities)[Next

Terminal UI](/docs/ai-sdk-harnesses/terminal-ui)
