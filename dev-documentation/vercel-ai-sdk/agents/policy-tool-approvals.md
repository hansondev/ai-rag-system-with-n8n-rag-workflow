---
title: "Policy-Based Tool Approvals"
source_url: https://ai-sdk.dev/docs/agents/policy-tool-approvals
section: agents
crawled: 2026-09-20
---

# Policy-Based Tool Approvals

> Source: https://ai-sdk.dev/docs/agents/policy-tool-approvals

[Agents](/docs/agents)Policy-Based Tool Approvals


[Policy-Based Tool Approvals](#policy-based-tool-approvals)
===========================================================

[Tool Approvals](/docs/agents/tool-approvals) let you approve or deny tool calls with a function in your agent setup. `@ai-sdk/policy-opa` moves those rules out of code and into [Open Policy Agent](https://www.openpolicyagent.org/) (OPA) policies written in `.rego`.

Use it when you want authorization to be:

* Written as a separate, reviewable artifact instead of a function buried in agent setup.
* Testable in CI with `opa test`, independent of the SDK.
* Editable without a code deploy (when served from a running OPA instance).

The package sits entirely on top of the public `toolApproval` callback. Nothing changes on the wire: the same `tool-approval-request` / `tool-approval-response` flow as built-in approvals.

[What you can enforce](#what-you-can-enforce)
---------------------------------------------

OPA is a general policy engine. If you can express a rule as code over structured input, you can enforce it at the tool boundary. Common categories:

* Security and access: scopes, roles, permissions, tenant isolation, allowlists of tools, hosts, or paths.
* Business rules: who can do what, on which resources, under which conditions (for example, payments above a threshold need approval).
* Cost and usage: deny or require approval for calls that exceed a budget, token ceiling, or per-user quota.
* Compliance and change control: gate destructive or regulated actions on the right approver, environment, or time window.

The decision is not limited to the current call's arguments. The policy `input` also carries `messages`, the full model and tool-call history for the run, so a rule can factor in what already happened: prior tool calls, the sequence of actions so far, or a running total across the conversation. Examples:

* Require approval once a run has already performed N writes.
* Deny a second irreversible action (a push, a delete) in the same conversation.
* Track cumulative spend or token usage across steps and stop at a ceiling.

### [Best fit: deterministic checks](#best-fit-deterministic-checks)

Policy enforcement is strongest when the decision is deterministic and verifiable from structured fields, whether those fields come from the current call or the history in `messages`. The policy extracts a value and compares it, so the answer is the same every time.

* Strong fits: scopes, permissions, numeric thresholds, allowlists, time windows, and history-aware checks like counts, sequences, and running totals.
* Weak fits: content-based or semantic filtering such as "do not use bad language" or "block toxic content". These are best-effort, hard to verify, and easy to bypass. Use a dedicated moderation or classification step for them, and keep policy for the deterministic gate around it.

Rule of thumb: if you can point at a field in the `input` object and write an exact check on it, this is the right tool. If the rule depends on judging free-form meaning, do not lean on policy alone.

[Install](#install)
-------------------

```
1

pnpm add @ai-sdk/policy-opa



2

# pick one (or both) OPA backends:



3

pnpm add @open-policy-agent/opa-wasm   # in-process WASM evaluation



4

pnpm add @open-policy-agent/opa        # HTTP client to a running OPA server
```

* The backends are optional peer dependencies.
* Only the backend you import is loaded.

[How it works](#how-it-works)
-----------------------------

The policy is consulted before every tool dispatch and maps to one of the standard approval statuses:

* `allow` runs the tool.
* `deny` returns a denied result the model can reason about (no human needed).
* `requires-approval` pauses the run and waits for a human `tool-approval-response`.
* No matching rule normalizes to `not-applicable`, which the SDK treats as allow. Add `default decision := { "decision": "deny" }` to your policy to default-deny instead.

[Quick start](#quick-start)
---------------------------

```
1

import { generateText } from 'ai';



2

import { anthropic } from '@ai-sdk/anthropic';



3

import { opaPolicy, wasmPolicyClient } from '@ai-sdk/policy-opa';



4

import { readFile } from 'node:fs/promises';



5



6

// 1. Load the compiled policy bundle.



7

const wasm = await readFile('./policy.wasm');



8

const client = await wasmPolicyClient({ wasm });



9



10

// 2. Build the toolApproval configuration.



11

const toolApproval = opaPolicy({



12

client,



13

path: 'agent/call/decision',



14

});



15



16

// 3. Pass it to generateText (or streamText / ToolLoopAgent). Everything else is normal.



17

const result = await generateText({



18

model: anthropic('claude-sonnet-4-5'),



19

tools: { git, bash, queryLogs },



20

toolApproval,



21

prompt: 'find the failing test and push the fix',



22

});
```

[Writing the Rego policy](#writing-the-rego-policy)
---------------------------------------------------

The policy emits a decision object. `reason` is optional and is surfaced back to the model (for `deny`) or to the human approver (for `requires-approval`). A manual approval request exposes it as `reason` in core results and as `approval.requestReason` in UI messages.

```
1

package agent.call



2



3

# Default to "not-applicable" so unmatched calls fall through.



4

# Use { decision: "deny" } to default-deny instead.



5

default decision := { "decision": "not-applicable" }



6



7

# Hard deny: pushes are never allowed automatically.



8

decision := { "decision": "deny", "reason": "pushes require human review" } {



9

input.tool.name == "git"



10

input.args.args[0] == "push"



11

}



12



13

# Auto-allow: read-only git operations.



14

decision := { "decision": "allow" } {



15

input.tool.name == "git"



16

input.args.args[0] in {"status", "log", "diff", "show"}



17

}



18



19

# Human-in-the-loop: kubectl by oncall.



20

decision := { "decision": "requires-approval", "reason": "kubectl by oncall" } {



21

input.tool.name == "kubectl"



22

input.runtimeContext.role == "sre-oncall"



23

}
```

Notes:

* The legacy boolean shape (`{ "allow": true | false, "reason": "..." }`) is also accepted, so existing rules migrate without rewriting.
* The default OPA `input` shape is `{ tool: { name }, args, messages, runtimeContext }`.
* Override the input shape with `toInput`:

```
1

opaPolicy({



2

client,



3

path: 'agent/call/decision',



4

toInput: ({ toolCall, runtimeContext }) => ({



5

action: toolCall.toolName,



6

principal: runtimeContext.role,



7

resource: toolCall.input,



8

}),



9

});
```

### [Test the policy in CI](#test-the-policy-in-ci)

OPA ships its own test framework. These tests run without the SDK, which is the main reason policy-as-code beats policy-in-application-code.

```
1

# policy_test.rego



2

package agent.call



3



4

test_push_denied {



5

decision.decision == "deny" with input as {



6

"tool": { "name": "git" },



7

"args": { "args": ["push", "origin", "main"] }



8

}



9

}
```

Run with `opa test policy.rego policy_test.rego`.

### [Errors fail closed](#errors-fail-closed)

* If the backend errors (server unreachable, WASM fault, misbuilt bundle), `opaPolicy` returns `denied` with the error message as the reason.
* If the backend returns a present but unrecognized decision, such as an unknown `decision` value or a non-boolean legacy `allow` value, `opaPolicy` returns `denied`.
* The error never rejects out of the callback and never aborts the run.
* A backend outage blocks the affected call rather than silently allowing it.
* This is distinct from a rule that returns no match: `null` or `undefined` normalizes to `not-applicable` (allow). Use a `default ... deny` rule if you want unmatched calls denied too.

[Loading the policy](#loading-the-policy)
-----------------------------------------

### [Option A: WASM (in-process)](#option-a-wasm-in-process)

Compile the `.rego` to WASM ahead of time:

```
1

opa build -t wasm -e 'agent/call/decision' -o bundle.tar.gz policy.rego



2

tar -xzf bundle.tar.gz /policy.wasm
```

```
1

import { wasmPolicyClient, opaPolicy } from '@ai-sdk/policy-opa';



2

import { readFile } from 'node:fs/promises';



3



4

const wasm = await readFile('./policy.wasm');



5

const client = await wasmPolicyClient({ wasm });



6

const toolApproval = opaPolicy({ client, path: 'agent/call/decision' });
```

* No network call per decision.
* Good fit when you ship the policy with the app, or fetch it from object storage at startup.
* Hot-reload means rebuilding the WASM and re-instantiating the client.

### [Option B: HTTP (running OPA server)](#option-b-http-running-opa-server)

```
1

import { httpPolicyClient, opaPolicy } from '@ai-sdk/policy-opa';



2



3

const client = httpPolicyClient({ url: 'http://localhost:8181' });



4

const toolApproval = opaPolicy({ client, path: 'agent/call/decision' });
```

* One HTTP round-trip per decision.
* Good fit when policies change frequently and you want hot-reload without redeploying, or when multiple services share one OPA.
* Pass `headers` for Styra DAS / EOPA authentication.

[Bring in external data and integrations](#bring-in-external-data-and-integrations)
-----------------------------------------------------------------------------------

Policies are not limited to the tool-call input. OPA can decide based on external data such as role-to-permission mappings, IDP group memberships, entitlement lists, or allowlists, and that data can update without redeploying your app.

How OPA sources data is OPA's concern, not this package's. The common approaches:

* Static data at load time: pass `data` to `wasmPolicyClient({ wasm, data })`. It is handed to the bundle's `setData`, so the policy can read it under `data.*`.
* Bundles: point a running OPA server (the HTTP backend) at a bundle service so it periodically pulls fresh policy and data. Role mappings and IDP groups update without a code deploy.
* Lookups during evaluation: a policy can call out to an external service (for example an IDP or entitlements API) while it evaluates a decision.

Learn the details from OPA, not here:

* [Policy reference](https://www.openpolicyagent.org/docs/policy-reference)
* [External data](https://www.openpolicyagent.org/docs/external-data) (including connecting to an IDP)

This package only maps the resulting decision to the SDK's approval status. The `input` it passes is what your policy combines with whatever data OPA already has.

[Roll out safely with shadow mode](#roll-out-safely-with-shadow-mode)
---------------------------------------------------------------------

Do not ship a new policy straight to enforce. The first version almost always denies things you did not mean to. `shadow(approval, opts)` evaluates the policy and reports the decision via `onDecision`, but tells the SDK every call is approved until you flip `enforce: true`.

```
1

import { opaPolicy, shadow, wasmPolicyClient } from '@ai-sdk/policy-opa';



2



3

const client = await wasmPolicyClient({ wasm });



4



5

const toolApproval = shadow(



6

opaPolicy({ client, path: 'agent/call/decision' }),



7

{



8

enforce: process.env.ENFORCE_POLICY === 'true',



9

onDecision: event => {



10

logger.info('policy.decision', {



11

tool: event.toolCall.toolName,



12

decision: event.decision.type,



13

reason: event.decision.reason,



14

enforced: event.enforced,



15

wouldBlock: event.decision.type === 'denied',



16

});



17

},



18

},



19

);
```

Recommended rollout:

1. Write the policy and test it with `opa test`.
2. Wrap it in `shadow(...)` with `enforce: false` (the default) and wire `onDecision` to your logs/metrics.
3. Run in your real environment. Inspect events where `decision.type` is `denied` or `user-approval`: those are the calls the policy would have changed.
4. Fix the policy and iterate.
5. When the only `denied` / `user-approval` events are ones you want, set `enforce: true`.

Telemetry semantics:

* `onDecision` is fire-and-forget. A slow or throwing logger cannot block or break enforcement, and thrown errors are swallowed.
* The contract is enforcement first, observability second.
* For the opposite (enforcement waits for the audit log), log from inside the underlying `toolApproval` instead of through `shadow`.

[Send decisions to your observability platform](#send-decisions-to-your-observability-platform)
-----------------------------------------------------------------------------------------------

`onDecision` is not only for rollout. Keep `shadow` in place with `enforce: true` and every decision flows to your logging, metrics, or tracing stack while the policy stays load-bearing.

```
1

const toolApproval = shadow(



2

opaPolicy({ client, path: 'agent/call/decision' }),



3

{



4

enforce: true, // enforcing AND observing



5

onDecision: event => {



6

metrics.increment('agent.policy.decision', {



7

tool: event.toolCall.toolName,



8

decision: event.decision.type, // approved | denied | user-approval | not-applicable



9

enforced: String(event.enforced),



10

});



11

},



12

},



13

);
```

* Each `PolicyDecisionEvent` carries the tool call, the policy `decision` (type and reason), `enforced`, and `effective` (what the SDK acted on). Compare `decision` against `effective` to spot drift.
* `onDecision` is fire-and-forget; see the telemetry semantics under shadow mode.

When you use the HTTP backend, OPA can also emit [decision logs](https://www.openpolicyagent.org/docs/management-decision-logs) natively, shipping every evaluation to a remote service for a full audit trail without any application code.

[Capability scoping at the model boundary](#capability-scoping-at-the-model-boundary)
-------------------------------------------------------------------------------------

`opaCapabilityMiddleware` enforces policy earlier than `toolApproval`: before the model is even told a tool exists. This is defense in depth, plus it saves tokens and improves jailbreak rejection.

```
1

import { wrapLanguageModel } from 'ai';



2

import { wasmPolicyClient, opaCapabilityMiddleware } from '@ai-sdk/policy-opa';



3



4

const client = await wasmPolicyClient({ wasm });



5



6

const wrappedModel = wrapLanguageModel({



7

model: anthropic('claude-sonnet-4-5'),



8

middleware: opaCapabilityMiddleware({ client, path: 'agent/tools/allowed' }),



9

});
```

* The rule at `path` returns a `string[]` of allowed tool names, or `{ tools: string[] }`.
* Tools not in the allowlist are dropped before the model sees them.
* Fails closed: on a malformed response or evaluator error, `params.tools` is set to `undefined` so the model is told it has no tools. For fail-open, write the fallback in Rego.

[Scoping a discovered tool surface](#scoping-a-discovered-tool-surface)
-----------------------------------------------------------------------

When tools come from MCP discovery or a plugin registry, you cannot write per-tool rules ahead of time, and any tool you forgot is silently allowed. `wrapMcpTools` makes the approval total over the discovered surface by routing unmatched tools to a configurable default.

```
1

import { opaPolicy, wasmPolicyClient, wrapMcpTools } from '@ai-sdk/policy-opa';



2



3

const discovered = await mcpClient.tools();



4

const client = await wasmPolicyClient({ wasm });



5



6

const { tools, toolApproval } = wrapMcpTools(



7

discovered,



8

opaPolicy({ client, path: 'agent/call/decision' }),



9

{ default: 'user-approval' }, // anything OPA does not match needs a human



10

);



11



12

await generateText({ model, tools, toolApproval, prompt });
```

Defaults for uncovered tools:

* `'user-approval'` (default): require a human. Good when you trust the source but want a safety net.
* `'denied'`: hard allowlist mode. The policy enumerates what is allowed; everything else is rejected.
* `'approved'`: allow. Only when the discovery source is fully trusted.

Despite the name, it works on any `Record<string, Tool>`.

[Allow-all when no policy is configured](#allow-all-when-no-policy-is-configured)
---------------------------------------------------------------------------------

`optionalOpaPolicy` returns `undefined` when `client` is `undefined`, which is the same as not passing `toolApproval` (the SDK approves every call). Useful for local dev or CI where the policy file is absent.

```
1

import { optionalOpaPolicy, wasmPolicyClient } from '@ai-sdk/policy-opa';



2

import { readFile } from 'node:fs/promises';



3



4

const wasm = process.env.POLICY_WASM_PATH



5

? await readFile(process.env.POLICY_WASM_PATH)



6

: undefined;



7



8

const client = wasm ? await wasmPolicyClient({ wasm }) : undefined;



9



10

const toolApproval = optionalOpaPolicy({ client, path: 'agent/call/decision' });
```

* `POLICY_WASM_PATH` unset: `toolApproval` is `undefined`, all calls allowed, OPA modules never loaded.
* `POLICY_WASM_PATH` set: policy loads, enforcement on.
* For stricter behavior (refuse to start without a policy), use `opaPolicy` directly and let the missing bytes throw at startup.

[Transitive enforcement: composite tools](#transitive-enforcement-composite-tools)
----------------------------------------------------------------------------------

`toolApproval` only fires when the model calls a tool directly. A coarse dispatcher tool (a `bash` tool that can run `git push`, an HTTP tool, an MCP proxy) lets the model bypass a per-action rule by routing through it.

The fix lives inside the dispatcher's `toolApproval` entry: parse the dispatcher input down to a logical `(name, args)` pair, then evaluate it against the same rule the direct tool uses.

```
1

const bashApproval = opaPolicy({



2

client,



3

path: 'agent/action/decision',



4

toInput: ({ toolCall }) => {



5

const { command } = toolCall.input as { command: string };



6

const [bin, ...rest] = command.split(/\s+/);



7

return { kind: bin, args: rest };



8

},



9

});
```

Guidance:

* Keep the matching logic in one place: either a shared Rego helper rule (both approvals call `opaPolicy` with the same `path`) or a shared TypeScript predicate.
* Deny anything you cannot reduce to a clean invocation. Shell input is adversarial to parse, so "cannot prove it is safe" means deny.
* Honest limitation: this gates dispatch at the model's call boundary. It does not stop a tool that, once approved, performs extra side effects beyond what its input describes. For that, run untrusted execution in an out-of-band sandbox (Vercel Sandbox, Firecracker, containers) and treat the sandbox as the trust boundary.

Worked examples for SQL, HTTP, MCP, browser, and shell dispatchers live in the [package README](https://github.com/vercel/ai/tree/main/packages/policy-opa).

[Example application](#example-application)
-------------------------------------------

The [ai-sdk-slackbot](https://github.com/vercel-labs/ai-sdk-slackbot) example wires this package into a real agent end to end. It shows:

* Every tool call gated by Rego in `policies/decision.rego`, editable without touching TypeScript.
* Real tools under policy: a web search scoped to a domain, a weather tool with a city allowlist, and a `bash` tool restricted to a read-only command allowlist (transitive enforcement).
* Switching backends with one env var (`POLICY_MODE`): in-process WASM by default, or a live OPA HTTP server for hot-reloading policies in dev.
* Policy code tested independently with OPA-native tests in `policies/decision_test.rego`.

See [`policies/`](https://github.com/vercel-labs/ai-sdk-slackbot/tree/main/policies) and [`lib/policy/load.ts`](https://github.com/vercel-labs/ai-sdk-slackbot/blob/main/lib/policy/load.ts) for how the policy is loaded and applied.

[API reference](#api-reference)
-------------------------------

Everything is exported from the package root, `@ai-sdk/policy-opa`.

Engine-neutral core:

* `shadow(approval, opts?)`: wrap any approval so it is evaluated and reported but not enforced until `opts.enforce: true`. Recommended starting point for any new policy.
* `wrapMcpTools(tools, approval, opts?)`: make an approval total over a discovered tool set. `opts.default` controls uncovered tools.
* `PolicyClient`: the `evaluate(path, input)` interface every backend implements. The seam for non-OPA engines.
* Helper types: `PolicyDecision`, `WrappedMcpTools`, `PolicyDecisionEvent`.

OPA backend and adapters:

* `wasmPolicyClient({ wasm, data? })`: async; loads a compiled OPA WASM bundle in-process.
* `httpPolicyClient({ url, headers? })`: sync; client against a running OPA server.
* `opaPolicy({ client, path, toInput? })`: returns a `toolApproval` configuration. Fails closed.
* `optionalOpaPolicy({ client, path, toInput? })`: like `opaPolicy` but returns `undefined` when `client` is `undefined`.
* `opaCapabilityMiddleware({ client, path, toInput? })`: a `LanguageModelV4Middleware` that narrows `params.tools` to an allowlist. Fails closed.
* `normalizeOpaDecision(result)`: standalone result normalization, for users who call OPA themselves.

[Related](#related)
-------------------

* [Tool Approvals](/docs/agents/tool-approvals): the underlying `toolApproval` callback this package plugs into.
* [Building Agents](/docs/agents/building-agents)
* [ai-sdk-slackbot example](https://github.com/vercel-labs/ai-sdk-slackbot): a full agent with policy-gated tools.
* [Open Policy Agent documentation](https://www.openpolicyagent.org/docs/)

[Previous

Memory](/docs/agents/memory)[Next

Subagents](/docs/agents/subagents)
