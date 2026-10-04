---
title: "createMCPClient()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/create-mcp-client
section: reference
crawled: 2026-09-20
---

# createMCPClient()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/create-mcp-client

[AI SDK Core](/docs/ai-sdk-core)createMCPClient


[`createMCPClient()`](#createmcpclient)
=======================================

Creates a lightweight Model Context Protocol (MCP) client that connects to an MCP server. The client provides:

* **Tools**: Automatic conversion between MCP tools and AI SDK tools
* **Resources**: Methods to list, read, and discover resource templates from MCP servers
* **Prompts**: Methods to list available prompts and retrieve prompt messages
* **Completions**: Methods to request autocompletion suggestions for prompt arguments and resource template variables
* **Elicitation**: Support for handling server requests for additional input during tool execution

It currently does not support accepting notifications from an MCP server, and custom configuration of the client.

[Import](#import)
-----------------

```
import { createMCPClient } from "@ai-sdk/mcp"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### config:

MCPClientConfig

MCPClientConfig

### transport:

MCPTransportConfig | MCPTransport

MCPTransport

### start:

() => Promise<void>

### send:

(message: JSONRPCMessage) => Promise<void>

### close:

() => Promise<void>

### onclose:

() => void

### onerror:

(error: Error) => void

### onmessage:

(message: JSONRPCMessage) => void

MCPTransportConfig

### type:

'sse' | 'http'

### url:

string

### headers?:

Record<string, string>

### authProvider?:

OAuthClientProvider

### redirect?:

'follow' | 'error'

### initialSessionId?:

string

### initialProtocolVersion?:

string

### onSessionIdChange?:

(sessionId: string | undefined) => void

### onSessionExpired?:

(sessionId: string) => void

### terminateSessionOnClose?:

boolean

### fetch?:

FetchFunction

### initializationOptions?:

RequestOptions

### clientName?:

string

### name?:

string

### version?:

string

### onUncaughtError?:

(error: unknown) => void

### maxRetries?:

number

### initialInitializeResult?:

InitializeResult

### capabilities?:

ClientCapabilities

### [Returns](#returns)

Returns a Promise that resolves to an `MCPClient` with the following properties and methods:

### initializeResult:

InitializeResult

### serverInfo:

Configuration

### instructions?:

string

### tools:

async (options?: {
schemas?: TOOL\_SCHEMAS
}) => Promise<McpToolSet<TOOL\_SCHEMAS>>

options

### schemas?:

TOOL\_SCHEMAS

TOOL\_SCHEMAS

### inputSchema:

FlexibleSchema

### outputSchema?:

FlexibleSchema

### listTools:

async (options?: {
params?: PaginatedRequest['params'];
options?: RequestOptions;
}) => Promise<ListToolsResult>

options

### params?:

PaginatedRequest['params']

### options?:

RequestOptions

### callTool:

async (args: {
name: string;
arguments?: Record<string, unknown>;
options?: RequestOptions;
}) => Promise<CallToolResult>

args

### name:

string

### arguments?:

Record<string, unknown>

### options?:

RequestOptions

### toolsFromDefinitions:

(definitions: ListToolsResult, options?: {
schemas?: TOOL\_SCHEMAS
}) => McpToolSet<TOOL\_SCHEMAS>

parameters

### definitions:

ListToolsResult

### schemas?:

TOOL\_SCHEMAS

### listResources:

async (options?: {
params?: PaginatedRequest['params'];
options?: RequestOptions;
}) => Promise<ListResourcesResult>

options

### params?:

PaginatedRequest['params']

### options?:

RequestOptions

### readResource:

async (args: {
uri: string;
options?: RequestOptions;
}) => Promise<ReadResourceResult>

args

### uri:

string

### options?:

RequestOptions

### listResourceTemplates:

async (options?: {
options?: RequestOptions;
}) => Promise<ListResourceTemplatesResult>

options

### options?:

RequestOptions

### complete:

async (args: CompleteRequestParams & {
options?: RequestOptions;
}) => Promise<CompleteResult>

args

### ref:

{ type: 'ref/prompt'; name: string } | { type: 'ref/resource'; uri: string }

### argument:

{ name: string; value: string }

### context?:

{ arguments: Record<string, string> }

### options?:

RequestOptions

### experimental\_listPrompts:

async (options?: {
params?: PaginatedRequest['params'];
options?: RequestOptions;
}) => Promise<ListPromptsResult>

options

### params?:

PaginatedRequest['params']

### options?:

RequestOptions

### experimental\_getPrompt:

async (args: {
name: string;
arguments?: Record<string, unknown>;
options?: RequestOptions;
}) => Promise<GetPromptResult>

args

### name:

string

### arguments?:

Record<string, unknown>

### options?:

RequestOptions

### onElicitationRequest:

(
schema: typeof ElicitationRequestSchema,
handler: (request: ElicitationRequest) => Promise<ElicitResult> | ElicitResult
) => void

parameters

### schema:

typeof ElicitationRequestSchema

### handler:

(request: ElicitationRequest) => Promise<ElicitResult> | ElicitResult

### close:

() => Promise<void>

[Example](#example)
-------------------

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { createMCPClient } from '@ai-sdk/mcp';



2

import { generateText } from 'ai';



3

import { Experimental_StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';



4



5

let client;



6



7

try {



8

client = await createMCPClient({



9

transport: new Experimental_StdioMCPTransport({



10

command: 'node server.js',



11

}),



12

});



13



14

const tools = await client.tools();



15



16

const response = await generateText({



17

model: "xai/grok-4.6",



18

tools,



19

messages: [{ role: 'user', content: 'Query the data' }],



20

});



21



22

console.log(response);



23

} catch (error) {



24

console.error('Error:', error);



25

} finally {



26

// ensure the client is closed even if an error occurs



27

if (client) {



28

await client.close();



29

}



30

}
```

[Error Handling](#error-handling)
---------------------------------

The client throws `MCPClientError` for:

* Client initialization failures
* Protocol version mismatches
* Missing server capabilities
* Connection failures

For tool execution, errors are propagated as `CallToolError` errors.

For unknown errors, the client exposes an `onUncaughtError` callback that can be used to manually log or handle errors that are not covered by known error types.

[Previous

experimental\_cancelBatch](/docs/reference/ai-sdk-core/cancel-batch)[Next

experimental\_getRealtimeToolDefinitions](/docs/reference/ai-sdk-core/get-realtime-tool-definitions)
