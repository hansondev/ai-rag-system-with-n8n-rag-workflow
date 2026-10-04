---
title: "Model Context Protocol (MCP)"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/mcp-tools
section: ai-sdk-core
crawled: 2026-09-20
---

# Model Context Protocol (MCP)

> Source: https://ai-sdk.dev/docs/ai-sdk-core/mcp-tools

[AI SDK Core](/docs/ai-sdk-core)Model Context Protocol (MCP)


[Model Context Protocol (MCP)](#model-context-protocol-mcp)
===========================================================

The AI SDK supports connecting to [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers to access their tools, resources, and prompts.
This enables your AI applications to discover and use capabilities across various services through a standardized interface.

If you're using OpenAI's Responses API, you can also use the built-in
`openai.tools.mcp` tool, which provides direct MCP server integration without
needing to convert tools. See the [OpenAI provider
documentation](/providers/ai-sdk-providers/openai#mcp-tool) for details.

[Initializing an MCP Client](#initializing-an-mcp-client)
---------------------------------------------------------

We recommend using HTTP transport (like `StreamableHTTPClientTransport`) for production deployments. The stdio transport should only be used for connecting to local servers as it cannot be deployed to production environments.

Create an MCP client using one of the following transport options:

* **HTTP transport (Recommended)**: Either configure HTTP directly via the client using `transport: { type: 'http', ... }`, or use MCP's official TypeScript SDK `StreamableHTTPClientTransport`
* SSE (Server-Sent Events): An alternative HTTP-based transport
* `stdio`: For local development only. Uses standard input/output streams for local MCP servers

The AI SDK MCP client supports both legacy initialization-based protocol
versions and stateless MCP `2026-07-28`. The built-in stdio transport probes
with `server/discover` and automatically falls back to the legacy
`initialize` handshake for older servers. Custom transports can opt into this
negotiation with `supportsProtocolVersionDiscovery: true`.

### [HTTP Transport (Recommended)](#http-transport-recommended)

For production deployments, we recommend using the HTTP transport. You can configure it directly on the client:

```
1

import { createMCPClient } from '@ai-sdk/mcp';



2



3

const mcpClient = await createMCPClient({



4

transport: {



5

type: 'http',



6

url: 'https://your-server.com/mcp',



7



8

// optional: configure HTTP headers



9

headers: { Authorization: 'Bearer my-api-key' },



10



11

// optional: provide an OAuth client provider for automatic authorization



12

authProvider: myOAuthClientProvider,



13



14

// optional: allow redirect responses (default is 'error' to prevent SSRF)



15

redirect: 'follow',



16

},



17

});
```

If a legacy MCP server uses Streamable HTTP sessions, you can reattach to a
saved session by restoring both the previous session id and initialize result.
MCP `2026-07-28` is stateless and does not use these options:

```
1

import { createMCPClient } from '@ai-sdk/mcp';



2



3

const savedSession = await loadMcpSession();



4

let currentSessionId = savedSession?.sessionId;



5



6

const mcpClient = await createMCPClient({



7

transport: {



8

type: 'http',



9

url: 'https://your-server.com/mcp',



10

initialSessionId: savedSession?.sessionId,



11

initialProtocolVersion: savedSession?.initializeResult.protocolVersion,



12

terminateSessionOnClose: false,



13



14

onSessionIdChange: sessionId => {



15

currentSessionId = sessionId;



16

},



17



18

onSessionExpired: sessionId => {



19

if (currentSessionId === sessionId) {



20

currentSessionId = undefined;



21

void clearMcpSession();



22

}



23

},



24

},



25

initialInitializeResult: savedSession?.initializeResult,



26

});



27



28

if (currentSessionId) {



29

await saveMcpSession({



30

sessionId: currentSessionId,



31

initializeResult: mcpClient.initializeResult,



32

});



33

}
```

When `initialInitializeResult` is provided, `createMCPClient` reuses the cached
initialize metadata and does not send another `initialize` request. When
`onSessionExpired` is called, the transport has already cleared the session id
and the request still fails with the underlying HTTP error. Retry by creating a
fresh client without `initialSessionId` or `initialInitializeResult`.
Set `terminateSessionOnClose` to `false` when closing only the local client but
keeping the MCP session available for a later reattach.

Alternatively, you can use `StreamableHTTPClientTransport` from MCP's official TypeScript SDK:

```
1

import { createMCPClient } from '@ai-sdk/mcp';



2

import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';



3



4

const url = new URL('https://your-server.com/mcp');



5

const mcpClient = await createMCPClient({



6

transport: new StreamableHTTPClientTransport(url, {



7

sessionId: 'session_123',



8

}),



9

});
```

### [SSE Transport](#sse-transport)

SSE provides an alternative HTTP-based transport option. Configure it with a `type` and `url` property. You can also provide an `authProvider` for OAuth:

```
1

import { createMCPClient } from '@ai-sdk/mcp';



2



3

const mcpClient = await createMCPClient({



4

transport: {



5

type: 'sse',



6

url: 'https://my-server.com/sse',



7



8

// optional: configure HTTP headers



9

headers: { Authorization: 'Bearer my-api-key' },



10



11

// optional: provide an OAuth client provider for automatic authorization



12

authProvider: myOAuthClientProvider,



13



14

// optional: allow redirect responses (default is 'error' to prevent SSRF)



15

redirect: 'follow',



16

},



17

});
```

### [Stdio Transport (Local Servers)](#stdio-transport-local-servers)

The stdio transport should only be used for local servers.

The Stdio transport can be imported from either the MCP SDK or the AI SDK:

```
1

import { createMCPClient } from '@ai-sdk/mcp';



2

import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';



3

// Or use the AI SDK's stdio transport:



4

// import { Experimental_StdioMCPTransport as StdioClientTransport } from '@ai-sdk/mcp/mcp-stdio';



5



6

const mcpClient = await createMCPClient({



7

transport: new StdioClientTransport({



8

command: 'node',



9

args: ['src/stdio/dist/server.js'],



10

}),



11

});
```

### [Custom Transport](#custom-transport)

You can also bring your own transport by implementing the `MCPTransport` interface for specific requirements not covered by the standard transports.

The client returned by the `createMCPClient` function is a
lightweight client intended for use in tool conversion. It currently does not
support all features of the full MCP client, such as automatic session
persistence, resumable streams, and receiving notifications.

Authorization via OAuth is supported when using the AI SDK MCP HTTP or SSE
transports by providing an `authProvider`.

### [OAuth Authorization Server Validation](#oauth-authorization-server-validation)

When using MCP OAuth in server-side applications, the MCP server can advertise
the OAuth authorization server to use. If you connect to MCP servers outside
your control, implement `validateAuthorizationServerURL` on your
`authProvider` to allow only the authorization server origins you trust:

```
1

const allowedAuthorizationServerOrigins = new Set([



2

'https://accounts.example.com',



3

'https://tenant.auth0.com',



4

]);



5



6

const myOAuthClientProvider = {



7

// ...other OAuthClientProvider methods



8



9

validateAuthorizationServerURL(serverUrl, authorizationServerUrl) {



10

const origin = new URL(authorizationServerUrl).origin;



11



12

if (!allowedAuthorizationServerOrigins.has(origin)) {



13

throw new Error(



14

`Unexpected OAuth authorization server for ${serverUrl}: ${origin}`,



15

);



16

}



17

},



18

};
```

This hook is called before the SDK fetches authorization server metadata, so a
rejected URL is not requested. It is optional and does not change existing OAuth
flows unless you implement it.

### [OAuth Callback Issuer Validation](#oauth-callback-issuer-validation)

When completing an OAuth authorization callback, pass the callback's `iss`
parameter to `auth` as `callbackIssuer`:

```
1

import { auth } from '@ai-sdk/mcp';



2



3

const callbackUrl = new URL(request.url);



4



5

await auth(myOAuthClientProvider, {



6

serverUrl: 'https://mcp.example.com',



7

authorizationCode: callbackUrl.searchParams.get('code')!,



8

callbackState: callbackUrl.searchParams.get('state') ?? undefined,



9

callbackIssuer: callbackUrl.searchParams.get('iss') ?? undefined,



10

});
```

When `iss` is present, it must exactly match the discovered authorization
server issuer. The authorization code is not exchanged when it does not match.

Dynamic client registration requests include an OAuth `application_type`. The
client infers `native` for loopback, localhost, and custom-scheme redirects,
and `web` for remote HTTP(S) redirects. You can override this by setting
`application_type` in the provider's `clientMetadata`.

### [Retrying Transient Tool Failures](#retrying-transient-tool-failures)

MCP tool calls can fail for transient transport reasons, such as rate limits,
temporary overload, or gateway timeouts. You can opt into automatic retries for
`tools/call` requests by passing `maxRetries` when creating the client:

```
1

const mcpClient = await createMCPClient({



2

transport: {



3

type: 'http',



4

url: 'https://your-server.com/mcp',



5

},



6

maxRetries: 2,



7

});
```

Retries are disabled by default. Built-in retry matching is intended for
transient HTTP and network failures only. JSON-RPC application errors, such as
invalid tool arguments, are surfaced immediately without retrying. Successful
MCP tool responses with `isError: true` are also returned to the model without
retrying.

Only enable retries for MCP tools where retrying is safe. Retrying
non-idempotent tools, such as tools that send emails or create records, can
duplicate side effects.

### [Closing the MCP Client](#closing-the-mcp-client)

After initialization, you should close the MCP client based on your usage pattern:

* For short-lived usage (e.g., single requests), close the client when the response is finished
* For long-running clients (e.g., command line apps), keep the client open but ensure it's closed when the application terminates

When streaming responses, you can close the client when the LLM response has finished. For example, when using `streamText`, you should use the `onEnd` callback:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const mcpClient = await createMCPClient({



2

// ...



3

});



4



5

const tools = await mcpClient.tools();



6



7

const result = await streamText({



8

model: "xai/grok-4.6",



9

tools,



10

prompt: 'What is the weather in Brooklyn, New York?',



11

onEnd: async () => {



12

await mcpClient.close();



13

},



14

});
```

When generating responses without streaming, you can use try/finally or cleanup functions in your framework:

```
1

import { createMCPClient, type MCPClient } from '@ai-sdk/mcp';



2



3

let mcpClient: MCPClient | undefined;



4



5

try {



6

mcpClient = await createMCPClient({



7

// ...



8

});



9

} finally {



10

await mcpClient?.close();



11

}
```

[Using MCP Tools](#using-mcp-tools)
-----------------------------------

The client's `tools` method acts as an adapter between MCP tools and AI SDK tools. It supports two approaches for working with tool schemas:

### [Schema Discovery](#schema-discovery)

With schema discovery, all tools offered by the server are automatically listed, and input parameter types are inferred based on the schemas provided by the server:

```
1

const tools = await mcpClient.tools();
```

This approach is simpler to implement and automatically stays in sync with server changes. However, you won't have TypeScript type safety during development, and all tools from the server will be loaded

### [Tool Annotations and Approval](#tool-annotations-and-approval)

MCP servers can describe tool behavior with annotations such as
`readOnlyHint`, `destructiveHint`, `idempotentHint`, and `openWorldHint`. The
MCP client exposes these annotations on each tool's `metadata.annotations` and
on the resulting tool call's `toolMetadata.annotations`.

Annotations are untrusted, server-provided hints. The MCP client does not turn
them into an approval policy automatically. Applications should combine them
with deterministic controls such as tool allowlists, scoped credentials, and
their own [`toolApproval`](/docs/agents/tool-approvals) policy.

The following conservative policy allows tools to run automatically only when
the server explicitly marks them as read-only. Tools with `readOnlyHint: false`
or no `readOnlyHint` require user approval:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { type McpProviderMetadata } from '@ai-sdk/mcp';



2



3

const result = streamText({



4

model: "xai/grok-4.6",



5

tools,



6

toolApproval: ({ toolCall }) => {



7

const annotations = (



8

toolCall.toolMetadata as McpProviderMetadata | undefined



9

)?.annotations;



10



11

return annotations?.readOnlyHint === true



12

? 'not-applicable'



13

: {



14

type: 'user-approval',



15

reason:



16

annotations?.destructiveHint === true



17

? 'The MCP server marks this tool as destructive.'



18

: 'The MCP server does not mark this tool as read-only.',



19

};



20

},



21

prompt,



22

});
```

See the
[local tool annotations example](https://github.com/vercel/ai/tree/main/examples/mcp/src/tool-annotations)
for a complete annotated MCP server and application-layer approval
configuration. Start the server and client in separate terminals:

```
1

cd examples/mcp



2

pnpm server:tool-annotations
```

```
1

cd examples/mcp



2

pnpm client:tool-annotations
```

Ask the client to read, delete, or create a note. The read-only tool executes
immediately. The destructive and unannotated tools prompt for approval; after
you enter `y` or `n`, the client sends the decision back and prints the model's
response.

### [Schema Definition](#schema-definition)

For better type safety and control, you can define the tools and their input schemas explicitly in your client code:

```
1

import { z } from 'zod';



2



3

const tools = await mcpClient.tools({



4

schemas: {



5

'get-data': {



6

inputSchema: z.object({



7

query: z.string().describe('The data query'),



8

format: z.enum(['json', 'text']).optional(),



9

}),



10

},



11

// For tools with zero inputs, you should use an empty object:



12

'tool-with-no-args': {



13

inputSchema: z.object({}),



14

},



15

},



16

});
```

This approach provides full TypeScript type safety and IDE autocompletion, letting you catch parameter mismatches during development. When you define `schemas`, the client only pulls the explicitly defined tools, keeping your application focused on the tools it needs

### [Typed Tool Outputs](#typed-tool-outputs)

When MCP servers return `structuredContent` (per the [MCP specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools#structured-content)), you can define an `outputSchema` to get typed tool results:

```
1

import { z } from 'zod';



2



3

const tools = await mcpClient.tools({



4

schemas: {



5

'get-weather': {



6

inputSchema: z.object({



7

location: z.string(),



8

}),



9

// Define outputSchema for typed results



10

outputSchema: z.object({



11

temperature: z.number(),



12

conditions: z.string(),



13

humidity: z.number(),



14

}),



15

},



16

},



17

});



18



19

const result = await tools['get-weather'].execute(



20

{ location: 'New York' },



21

{ messages: [], toolCallId: 'weather-1' },



22

);



23



24

console.log(`Temperature: ${result.temperature}°C`);
```

When `outputSchema` is provided:

* The client extracts `structuredContent` from the tool result
* The output is validated against your schema at runtime
* You get full TypeScript type safety for the result

If the server doesn't return `structuredContent`, the client falls back to parsing JSON from the text content. If neither is available or validation fails, an error is thrown.

If a server returns `structuredContent` without the backwards-compatible `content` field, the client adds a text content block containing the serialized JSON before returning the result. This compatibility behavior handles servers that omit the text mirror recommended by the MCP specification.

Without `outputSchema`, the tool returns the raw `CallToolResult` object
containing `content` and optional `isError` fields.

[Using MCP Resources](#using-mcp-resources)
-------------------------------------------

According to the [MCP specification](https://modelcontextprotocol.io/docs/learn/server-concepts#resources), resources are **application-driven** data sources that provide context to the model. Unlike tools (which are model-controlled), your application decides when to fetch and pass resources as context.

The MCP client provides three methods for working with resources:

### [Listing Resources](#listing-resources)

List all available resources from the MCP server:

```
1

const resources = await mcpClient.listResources();
```

### [Reading Resource Contents](#reading-resource-contents)

Read the contents of a specific resource by its URI:

```
1

const resourceData = await mcpClient.readResource({



2

uri: 'file:///example/document.txt',



3

});
```

### [Listing Resource Templates](#listing-resource-templates)

Resource templates are dynamic URI patterns that allow flexible queries. List all available templates:

```
1

const templates = await mcpClient.listResourceTemplates();
```

[Using MCP Completions](#using-mcp-completions)
-----------------------------------------------

MCP servers can provide autocompletion suggestions for prompt arguments and
resource template variables when they advertise the `completions` capability.
Use `complete` to ask the server for suggestions based on the current partial
argument value:

```
1

const completion = await mcpClient.complete({



2

ref: {



3

type: 'ref/resource',



4

uri: 'file:///{path}',



5

},



6

argument: {



7

name: 'path',



8

value: 'doc',



9

},



10

});



11



12

console.log(completion.completion.values);
```

For resource templates or prompts with multiple arguments, pass already resolved
values through `context.arguments`:

```
1

const completion = await mcpClient.complete({



2

ref: {



3

type: 'ref/resource',



4

uri: 'kubernetes://namespaced/{plural}/{namespace}',



5

},



6

argument: {



7

name: 'namespace',



8

value: 'auth',



9

},



10

context: {



11

arguments: {



12

plural: 'deployments',



13

},



14

},



15

});
```

If the connected server does not advertise `capabilities.completions`, the
client throws an `MCPClientError`.

[Using MCP Prompts](#using-mcp-prompts)
---------------------------------------

MCP Prompts is an experimental feature and may change in the future.

According to the MCP specification, prompts are user-controlled templates that servers expose for clients to list and retrieve with optional arguments.

### [Listing Prompts](#listing-prompts)

```
1

const prompts = await mcpClient.experimental_listPrompts();
```

### [Getting a Prompt](#getting-a-prompt)

Retrieve prompt messages, optionally passing arguments defined by the server:

```
1

const prompt = await mcpClient.experimental_getPrompt({



2

name: 'code_review',



3

arguments: { code: 'function add(a, b) { return a + b; }' },



4

});
```

[Handling Elicitation Requests](#handling-elicitation-requests)
---------------------------------------------------------------

Elicitation is a mechanism where MCP servers can request additional information from the client during tool execution. For example, a server might need user input to complete a registration form or confirmation for a sensitive operation.

It is up to the client application to handle elicitation requests properly.
The MCP client simply surfaces these requests from the server to your
application code.

### [Enabling Elicitation Support](#enabling-elicitation-support)

To enable elicitation, you need to advertise the capability when creating the MCP client:

```
1

const mcpClient = await createMCPClient({



2

transport: {



3

type: 'sse',



4

url: 'https://your-server.com/sse',



5

},



6

capabilities: {



7

elicitation: {},



8

},



9

});
```

### [Registering an Elicitation Handler](#registering-an-elicitation-handler)

Use the `onElicitationRequest` method to register a handler that will be called when the server requests input:

```
1

import { ElicitationRequestSchema } from '@ai-sdk/mcp';



2



3

mcpClient.onElicitationRequest(ElicitationRequestSchema, async request => {



4

// request.params.message: A message describing what input is needed



5

// request.params.requestedSchema: JSON schema defining the expected input structure



6



7

// Get input from the user (implement according to your application's needs)



8

const userInput = await getInputFromUser(



9

request.params.message,



10

request.params.requestedSchema,



11

);



12



13

// Return the result with one of three actions:



14

return {



15

action: 'accept', // or 'decline' or 'cancel'



16

content: userInput, // only required when action is 'accept'



17

};



18

});
```

### [Elicitation Response Actions](#elicitation-response-actions)

Your handler must return an object with an `action` field that can be one of:

* `'accept'`: User provided the requested information. Must include `content` with the data.
* `'decline'`: User chose not to provide the information.
* `'cancel'`: User cancelled the operation entirely.

[Detecting tool-definition drift ("rug pull")](#detecting-tool-definition-drift-rug-pull)
-----------------------------------------------------------------------------------------

An MCP server sends tool definitions (name, description, input schema) when your
app first connects, and you typically review and approve them at that point.
Nothing in the protocol prevents the server from later serving a *different*
definition for the same tool name — for example a description carrying injected
instructions, or an input schema widened with an extra field. Because the SDK
uses whatever tools you pass on each call, a mutated definition returned by a
later `mcpClient.tools()` fetch would be used without any comparison to what was
approved. This is the MCP ["rug pull"](https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks)
class of attack.

The AI SDK provides two functions to pin the approved definitions and detect
changes. `fingerprintTools` digests the server-controlled, security-relevant
fields of each tool (string `description`, resolved input schema, and `title`)
into a stable map of tool name to digest. `detectToolDrift` diffs two such maps.
Your app owns baseline storage and the response to drift (block, force
re-approval, or alert):

```
1

import { fingerprintTools, detectToolDrift } from 'ai';



2



3

// Trust time (first connect, human-reviewed): capture and persist the baseline.



4

const baseline = await fingerprintTools(await mcpClient.tools());



5



6

// Every later fetch, before handing tools to generateText:



7

const tools = await mcpClient.tools();



8

const drift = detectToolDrift(await fingerprintTools(tools), baseline);



9



10

if (drift.changed.length || drift.added.length) {



11

// A pinned definition changed, or a new tool appeared. Block, re-approve,



12

// or alert per your policy — do not silently pass `tools` to the model.



13

}
```

This detects mutation of a tool's description, input schema, or title — the
prompt-injection and schema-widening vectors. It cannot detect a
behavior/endpoint swap where the name, description, and schema are all
unchanged, because the tool runs remotely on the MCP server and that change is
invisible to the client. Core stays unopinionated: it does not persist
baselines or block calls — those are your app's responsibility.

[Examples](#examples)
---------------------

You can see MCP in action in the following examples:

[Learn to use MCP tools in Node.js](/cookbook/node/mcp-tools)[Learn to handle MCP elicitation requests in Node.js](/cookbook/node/mcp-elicitation)[Learn to render MCP Apps](/docs/ai-sdk-core/mcp-apps)

[Previous

Tool Calling](/docs/ai-sdk-core/tools-and-tool-calling)[Next

MCP Apps](/docs/ai-sdk-core/mcp-apps)
