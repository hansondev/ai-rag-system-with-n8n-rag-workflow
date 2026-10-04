---
title: "Tool Approvals"
source_url: https://ai-sdk.dev/docs/agents/tool-approvals
section: agents
crawled: 2026-09-20
---

# Tool Approvals

> Source: https://ai-sdk.dev/docs/agents/tool-approvals

[Agents](/docs/agents)Tool Approvals


[Tool Approvals](#tool-approvals)
=================================

By default, tools with an `execute` function run automatically when the model calls them. Use `toolApproval` on `ToolLoopAgent` to review, approve, or deny selected tool calls before they execute.

`toolApproval` is useful for tools that can modify data, spend money, execute code, send messages, access private data, or perform any other sensitive action.

`toolApproval` applies to tools executed by the AI SDK. Provider-executed
tools run provider-side and do not use AI SDK tool approvals.

[Statuses](#statuses)
---------------------

Every approval rule returns one of these statuses, either as a string or as an object with a `type` field:

* `'not-applicable'`: execute the tool normally without approval metadata. This is the default.
* `'approved'`: record an automatic approval, then execute the tool.
* `'denied'`: record an automatic denial and return a denied tool output.
* `'user-approval'`: emit an approval request and wait for an explicit response.

For automatic approvals and denials, use the object form when you want to include a reason:

```
1

toolApproval: {



2

deleteFile: {



3

type: 'denied',



4

reason: 'Deleting files is disabled in this workspace',



5

},



6

}
```

Approval functions can also return `undefined`, which is treated the same as `'not-applicable'`.

[Require Approval for a Tool](#require-approval-for-a-tool)
-----------------------------------------------------------

Use a per-tool map when each tool has a simple policy.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, tool } from 'ai';



2

import { z } from 'zod';



3



4

const agent = new ToolLoopAgent({



5

model: "xai/grok-4.6",



6

tools: {



7

runCommand: tool({



8

inputSchema: z.object({ command: z.string() }),



9

execute: async ({ command }) => runCommand(command),



10

}),



11

},



12

toolApproval: {



13

runCommand: 'user-approval',



14

},



15

});
```

When `runCommand` is called, the agent returns a `tool-approval-request` instead of executing the tool.

[Decide Based on Tool Input](#decide-based-on-tool-input)
---------------------------------------------------------

Use a per-tool approval function when the decision depends on the parsed tool input. The function receives the typed input plus `toolCallId`, `messages`, `toolContext`, and `runtimeContext`.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, tool } from 'ai';



2

import { z } from 'zod';



3



4

const agent = new ToolLoopAgent({



5

model: "xai/grok-4.6",



6

tools: {



7

processPayment: tool({



8

inputSchema: z.object({



9

amount: z.number(),



10

recipient: z.string(),



11

}),



12

execute: async ({ amount, recipient }) =>



13

processPayment({ amount, recipient }),



14

}),



15

},



16

toolApproval: {



17

processPayment: async ({ amount }, { runtimeContext }) => {



18

if (runtimeContext.role !== 'admin') {



19

return { type: 'denied', reason: 'Only admins can send payments' };



20

}



21

return amount > 1000 ? 'user-approval' : undefined;



22

},



23

},



24

});
```

In this example, non-admin users are denied automatically, large payments require manual approval, and smaller admin payments execute normally.

[Use One Policy for All Tools](#use-one-policy-for-all-tools)
-------------------------------------------------------------

Pass a function directly as `toolApproval` when approval depends on the full tool call, shared state across tools, or the complete tool set. This is called a `GenericToolApprovalFunction`.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const agent = new ToolLoopAgent({



2

model: "xai/grok-4.6",



3

tools: {



4

readFile: tool({



5

inputSchema: z.object({ path: z.string() }),



6

execute: async ({ path }) => readFile(path),



7

}),



8

deleteFile: tool({



9

inputSchema: z.object({ path: z.string() }),



10

execute: async ({ path }) => deleteFile(path),



11

}),



12

},



13

toolApproval: ({ toolCall }) => {



14

if (toolCall.dynamic) {



15

return 'user-approval';



16

}



17



18

if (toolCall.toolName === 'deleteFile') {



19

return 'user-approval';



20

}



21



22

return undefined;



23

},



24

});
```

The generic function receives:

* `toolCall`: the full tool call, including `toolName`, `toolCallId`, `input`, and whether it is dynamic.
* `tools`: all tools available to the model.
* `toolsContext`: context for all tools.
* `messages`: the messages sent to the model for the step that produced the tool call.
* `runtimeContext`: the call's shared runtime context.

[Configure Approval per Request](#configure-approval-per-request)
-----------------------------------------------------------------

Because `toolApproval` is an agent setting, you can also return it from `prepareCall`. This is useful when approval policy depends on call options, tenant policy, or user permissions.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { ToolLoopAgent, tool } from 'ai';



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

canRunCommands: z.boolean(),



8

}),



9

prepareCall: ({ options, ...settings }) => ({



10

...settings,



11

toolApproval: {



12

runCommand: options.canRunCommands



13

? 'user-approval'



14

: { type: 'denied', reason: 'Command access is disabled' },



15

},



16

}),



17

tools: {



18

runCommand: tool({



19

inputSchema: z.object({ command: z.string() }),



20

execute: async ({ command }) => runCommand(command),



21

}),



22

},



23

});
```

[Handle Manual Approvals](#handle-manual-approvals)
---------------------------------------------------

Manual approval requires two calls:

1. Call `agent.generate()` or `agent.stream()` with `toolApproval`.
2. Read the `tool-approval-request` from the result or UI stream.
3. Ask the user or your approval system for a decision.
4. Add a `tool-approval-response` to the messages.
5. Call the agent again with the updated messages.

```
1

import { type ModelMessage, type ToolApprovalResponse } from 'ai';



2



3

const messages: ModelMessage[] = [{ role: 'user', content: 'Delete temp.txt' }];



4



5

const result = await agent.generate({ messages });



6

messages.push(...result.responseMessages);



7



8

const approvalResponses: ToolApprovalResponse[] = [];



9



10

for (const part of result.content) {



11

if (part.type === 'tool-approval-request' && !part.isAutomatic) {



12

approvalResponses.push({



13

type: 'tool-approval-response',



14

approvalId: part.approvalId,



15

approved: true,



16

reason: 'User confirmed the file can be deleted',



17

});



18

}



19

}



20



21

messages.push({



22

role: 'tool',



23

content: approvalResponses,



24

});



25



26

const finalResult = await agent.generate({ messages });
```

If approved, the tool runs on the second call. If denied, the model receives the denial and can respond without the tool result.

When a tool execution is denied, consider adding an instruction such as "When
a tool execution is not approved, do not retry it" to prevent repeated
approval requests for the same action.

[Use with `useChat`](#use-with-usechat)
---------------------------------------

When streaming an agent to a chat UI, approval requests appear as tool parts with `state: 'approval-requested'`. Respond with `addToolApprovalResponse`.

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai';



5



6

export default function Chat() {



7

const { messages, addToolApprovalResponse } = useChat({



8

sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,



9

});



10



11

return messages.map(message =>



12

message.parts.map(part => {



13

if (part.type !== 'tool-runCommand') {



14

return null;



15

}



16



17

if (part.state === 'approval-requested' && !part.approval.isAutomatic) {



18

return (



19

<div key={part.toolCallId}>



20

{part.approval.requestReason && (



21

<p>{part.approval.requestReason}</p>



22

)}



23

<button



24

onClick={() =>



25

addToolApprovalResponse({



26

id: part.approval.id,



27

approved: true,



28

})



29

}



30

>



31

Approve



32

</button>



33

<button



34

onClick={() =>



35

addToolApprovalResponse({



36

id: part.approval.id,



37

approved: false,



38

})



39

}



40

>



41

Deny



42

</button>



43

</div>



44

);



45

}



46

}),



47

);



48

}
```

Only call `addToolApprovalResponse` for manual approvals. Automatic approvals and denials already include approval state in the stream.
When a manual approval status includes a reason, it is available as
`part.approval.requestReason`. A reason supplied with
`addToolApprovalResponse` is stored separately as `part.approval.reason`.

[Security Considerations](#security-considerations)
---------------------------------------------------

### [Trust model](#trust-model)

In the standard `useChat` pattern, the server rebuilds the conversation from the messages the client sends each turn. The server does not persist conversation state between requests. This means the message history is client-controlled input.

Tool approvals reconstructed from this history are re-validated before execution: the tool input is checked against the tool's schema, and the approval policy is re-evaluated. However, without additional protection, a client that crafts a valid-looking approval for a schema-conforming input can bypass the human-in-the-loop step.

If your tools perform sensitive operations (modifying data, spending money, calling external APIs, accessing private resources), use `experimental_toolApprovalSecret` to cryptographically bind approvals to the server that issued them.

### [Signing approvals with `experimental_toolApprovalSecret`](#signing-approvals-with-experimental_toolapprovalsecret)

When you provide a secret, the server HMAC-signs each approval request at issuance and verifies the signature when the approval is replayed. A forged or tampered approval is rejected before the tool executes. Configure the secret on `ToolLoopAgent` (or pass it directly to `generateText` or `streamText`).

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const agent = new ToolLoopAgent({



2

model: "xai/grok-4.6",



3

tools: { deleteFile, runQuery },



4

toolApproval: { deleteFile: 'user-approval', runQuery: 'user-approval' },



5

experimental_toolApprovalSecret: process.env.TOOL_APPROVAL_SECRET,



6

});



7



8

const result = await agent.generate({



9

messages,



10

});
```

The signature binds the approval to the exact tool name, tool call ID, and input arguments. Changing any of these after signing invalidates the approval.

**Setting up the secret:**

1. Generate a high-entropy random string (at least 32 bytes):

   ```
   1

   openssl rand -base64 32
   ```
2. Store it as an environment variable accessible to all server instances:

   ```
   1

   TOOL_APPROVAL_SECRET=your-generated-secret-here
   ```
3. Pass it to `ToolLoopAgent`, `generateText`, or `streamText` via `experimental_toolApprovalSecret`.

Every serverless instance that might handle a request needs the same secret, since one instance signs the approval and a different instance may verify it on the next turn.

**Behavior when configured:**

* Approval requests without a valid signature are rejected (fail-closed)
* No secret configured: approvals work as before (backward compatible)
* The secret is never sent to the client or included in the stream

`WorkflowAgent` also supports `experimental_toolApprovalSecret`. It signs in
a workflow step before writing the durable approval request. Pass an
environment variable reference, such as
`{ environmentVariable: 'TOOL_APPROVAL_SECRET' }`, so the raw secret is read
only inside signing and verification steps. Only the signature is persisted
and sent to the client.

[Related APIs](#related-apis)
-----------------------------

* Use `toolApproval` with `ToolLoopAgent`, `generateText`, and `streamText`.
* Author approval rules as code with [Policy-Based Tool Approvals](/docs/agents/policy-tool-approvals) (`@ai-sdk/policy-opa`).
* Use `needsApproval` only with [`WorkflowAgent`](/docs/agents/workflow-agent), where approvals suspend and resume durable workflow execution.
* Subagent tools cannot use `toolApproval`; see [Subagents](/docs/agents/subagents#no-tool-approvals-in-subagents).

[Previous

Subagents](/docs/agents/subagents)[Next

WorkflowAgent](/docs/agents/workflow-agent)
