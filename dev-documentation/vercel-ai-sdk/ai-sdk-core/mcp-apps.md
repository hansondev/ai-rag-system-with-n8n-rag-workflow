---
title: "MCP Apps"
source_url: https://ai-sdk.dev/docs/ai-sdk-core/mcp-apps
section: ai-sdk-core
crawled: 2026-09-20
---

# MCP Apps

> Source: https://ai-sdk.dev/docs/ai-sdk-core/mcp-apps

[AI SDK Core](/docs/ai-sdk-core)MCP Apps


[MCP Apps](#mcp-apps)
=====================

MCP Apps extend [Model Context Protocol (MCP)](/docs/ai-sdk-core/mcp-tools) tools with interactive UI resources. The model still calls ordinary MCP tools, but tools can point to a `ui://` resource containing HTML that your app renders in a sandboxed iframe.

The AI SDK provides two pieces for building MCP Apps hosts:

* [`@ai-sdk/mcp`](/docs/reference/ai-sdk-core/mcp-apps) helpers for advertising MCP Apps support, filtering model-visible and app-visible tools, and reading `ui://` resources.
* [`@ai-sdk/react`](/docs/reference/ai-sdk-ui/mcp-app-renderer) components for rendering the app iframe and bridging MCP Apps JSON-RPC messages.

[Host Flow](#host-flow)
-----------------------

An MCP Apps host usually does the following:

1. Connect to the MCP server with MCP Apps client capabilities.
2. List tools and split them by MCP Apps visibility.
3. Pass only model-visible tools to `streamText` or `generateText`.
4. Read the app's `ui://` resource when a tool part includes MCP App metadata.
5. Render the HTML resource in a sandboxed iframe.
6. Proxy allowed iframe requests, such as app-visible `tools/call`, back to the MCP server.

[Connect With MCP Apps Support](#connect-with-mcp-apps-support)
---------------------------------------------------------------

Use `mcpAppClientCapabilities` when creating the MCP client. This advertises that your host can render `text/html;profile=mcp-app` resources.

```
1

import { createMCPClient, mcpAppClientCapabilities } from '@ai-sdk/mcp';



2

import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';



3



4

export function createMCPAppsClient(origin: string) {



5

return createMCPClient({



6

transport: new StreamableHTTPClientTransport(new URL('/mcp', origin)),



7

clientName: 'my-mcp-apps-host',



8

capabilities: mcpAppClientCapabilities,



9

});



10

}
```

Only advertise these capabilities if your host can fetch and render MCP App resources safely.

[Expose Only Model-Visible Tools](#expose-only-model-visible-tools)
-------------------------------------------------------------------

MCP Apps tools can declare `_meta.ui.visibility`. Tools with `"model"` visibility can be passed to the model. Tools with only `"app"` visibility should be kept for iframe requests and not exposed to the model.

app/api/chat/route.ts

```
1

import { splitMCPAppTools } from '@ai-sdk/mcp';



2

import {



3

convertToModelMessages,



4

createUIMessageStreamResponse,



5

streamText,



6

toUIMessageStream,



7

} from 'ai';



8

import { createMCPAppsClient } from './mcp-client';



9

import { openai } from '@ai-sdk/openai';



10



11

export async function POST(req: Request) {



12

const requestUrl = new URL(req.url);



13

const client = await createMCPAppsClient(requestUrl.origin);



14

const { messages } = await req.json();



15



16

try {



17

const definitions = await client.listTools();



18

const { modelVisible } = splitMCPAppTools(definitions);



19

const tools = client.toolsFromDefinitions(modelVisible);



20



21

const result = streamText({



22

model: openai('gpt-4o-mini'),



23

tools,



24

messages: await convertToModelMessages(messages),



25

onEnd: async () => {



26

await client.close();



27

},



28

});



29



30

return createUIMessageStreamResponse({



31

stream: toUIMessageStream({ stream: result.stream }),



32

});



33

} catch (error) {



34

await client.close();



35

throw error;



36

}



37

}
```

When the model calls an app-backed tool, the MCP client preserves the app metadata on the tool UI part. The React renderer uses that metadata to decide whether a tool part has an MCP App.

[Read App Resources](#read-app-resources)
-----------------------------------------

Use `readMCPAppResource` to read and normalize an app resource before sending it to the browser host.

app/api/mcp-app-host/route.ts

```
1

import { readMCPAppResource } from '@ai-sdk/mcp';



2

import { createMCPAppsClient } from '../chat/mcp-client';



3



4

export async function POST(req: Request) {



5

const requestUrl = new URL(req.url);



6

const { uri } = await req.json();



7

const client = await createMCPAppsClient(requestUrl.origin);



8



9

try {



10

return Response.json(await readMCPAppResource({ client, uri }));



11

} finally {



12

await client.close();



13

}



14

}
```

`readMCPAppResource` verifies the resource uses a `ui://` URI, requires the MCP Apps MIME type, decodes text or base64 resource contents, and returns the HTML plus rendering metadata such as CSP and permissions.

[Proxy App-Visible Tool Calls](#proxy-app-visible-tool-calls)
-------------------------------------------------------------

The iframe cannot connect directly to your MCP server. It sends JSON-RPC messages to your host, and your host decides what is allowed.

For app-initiated tool calls, validate that the requested tool is app-visible before calling the MCP server.

app/api/mcp-app-host/route.ts

```
1

import { splitMCPAppTools } from '@ai-sdk/mcp';



2

import { createMCPAppsClient } from '../chat/mcp-client';



3



4

export async function callAppVisibleTool(req: Request) {



5

const requestUrl = new URL(req.url);



6

const { name, arguments: toolArguments } = await req.json();



7

const client = await createMCPAppsClient(requestUrl.origin);



8



9

try {



10

const { appVisible } = splitMCPAppTools(await client.listTools());



11

const isAllowed = appVisible.tools.some(tool => tool.name === name);



12



13

if (!isAllowed) {



14

return Response.json(



15

{ error: 'Tool is not app-visible' },



16

{ status: 403 },



17

);



18

}



19



20

return Response.json(



21

await client.callTool({



22

name,



23

arguments: toolArguments ?? {},



24

}),



25

);



26

} finally {



27

await client.close();



28

}



29

}
```

In production, add any policy and user approval checks your app needs before forwarding iframe requests.

[Render With React](#render-with-react)
---------------------------------------

In your React chat UI, render normal message parts as usual and pass tool parts to `experimental_MCPAppRenderer`.

`experimental_MCPAppRenderer` is experimental and may change in a future
release.

app/page.tsx

```
1

'use client';



2



3

import {



4

experimental_MCPAppRenderer as MCPAppRenderer,



5

useChat,



6

type MCPAppBridgeHandlers,



7

type MCPAppMetadata,



8

type MCPAppResource,



9

type MCPAppSandboxConfig,



10

} from '@ai-sdk/react';



11

import { DefaultChatTransport, isToolUIPart } from 'ai';



12



13

const sandbox = {



14

url: '/mcp-app-sandbox',



15

className: 'h-80 w-full rounded-lg border',



16

style: { border: 0 },



17

} satisfies MCPAppSandboxConfig;



18



19

async function loadResource(app: MCPAppMetadata): Promise<MCPAppResource> {



20

const response = await fetch('/api/mcp-app-host/read-resource', {



21

method: 'POST',



22

body: JSON.stringify({ uri: app.resourceUri }),



23

});



24



25

if (!response.ok) {



26

throw new Error('Failed to load MCP App resource');



27

}



28



29

return response.json();



30

}



31



32

const handlers: MCPAppBridgeHandlers = {



33

callTool: params =>



34

fetch('/api/mcp-app-host/call-tool', {



35

method: 'POST',



36

body: JSON.stringify(params),



37

}).then(response => response.json()),



38

openLink: ({ url }) => {



39

window.open(url, '_blank', 'noopener,noreferrer');



40

return {};



41

},



42

};



43



44

export default function Chat() {



45

const { messages, sendMessage } = useChat({



46

transport: new DefaultChatTransport({ api: '/api/chat' }),



47

});



48



49

return (



50

<>



51

{messages.map(message =>



52

message.parts.map((part, index) => {



53

if (part.type === 'text') {



54

return <div key={index}>{part.text}</div>;



55

}



56



57

if (isToolUIPart(part)) {



58

return (



59

<MCPAppRenderer



60

key={part.toolCallId}



61

part={part}



62

loadResource={loadResource}



63

handlers={handlers}



64

sandbox={sandbox}



65

fallback={<div>Loading MCP App...</div>}



66

/>



67

);



68

}



69



70

return null;



71

}),



72

)}



73



74

<button onClick={() => sendMessage({ text: 'Show me a dashboard' })}>



75

Send



76

</button>



77

</>



78

);



79

}
```

`experimental_MCPAppRenderer` renders nothing for ordinary tools. For app-backed tools, it loads the resource, creates the sandbox bridge, sends tool input and result notifications to the iframe, and forwards supported app requests through your handlers.

[Best Practices](#best-practices)
---------------------------------

* Treat MCP App HTML as untrusted content. Render it in a sandboxed iframe, ideally through a sandbox proxy route on a separate origin.
* Never pass app-only tools to the model. Use `splitMCPAppTools` and expose only `modelVisible` tools.
* Validate every iframe request on the server before calling `client.callTool`.
* Cache app resources by `resourceUri` so repeated tool calls do not refetch identical HTML.
* Keep tool `content` and `structuredContent` useful without the UI, so text-only hosts still work.
* Close short-lived MCP clients when the response or host request finishes.

[Reference](#reference)
-----------------------

[MCP Apps helpers](/docs/reference/ai-sdk-core/mcp-apps)[MCP App Renderer](/docs/reference/ai-sdk-ui/mcp-app-renderer)

[Previous

Model Context Protocol (MCP)](/docs/ai-sdk-core/mcp-tools)[Next

Runtime and Tool Context](/docs/ai-sdk-core/runtime-and-tool-context)
