---
title: "experimental_MCPAppRenderer"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-ui/mcp-app-renderer
section: reference
crawled: 2026-09-20
---

# experimental_MCPAppRenderer

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-ui/mcp-app-renderer

[AI SDK UI](/docs/ai-sdk-ui)experimental\_MCPAppRenderer


[`experimental_MCPAppRenderer`](#experimental_mcpapprenderer)
=============================================================

`experimental_MCPAppRenderer` is experimental and may change in a future
release.

`experimental_MCPAppRenderer` renders an MCP App for an AI SDK tool UI part. It detects MCP App metadata on the tool part, loads the app resource, renders the app in a sandbox proxy iframe, and bridges MCP Apps JSON-RPC messages between the iframe and your host application.

For tool parts without MCP App metadata, the component renders the `fallback`.

[Import](#import)
-----------------

```
import { experimental_MCPAppRenderer as MCPAppRenderer } from "@ai-sdk/react"
```

[Example](#example)
-------------------

```
1

'use client';



2



3

import {



4

experimental_MCPAppRenderer as MCPAppRenderer,



5

type MCPAppBridgeHandlers,



6

type MCPAppMetadata,



7

type MCPAppResource,



8

type MCPAppSandboxConfig,



9

} from '@ai-sdk/react';



10

import { isToolUIPart } from 'ai';



11



12

const sandbox = {



13

url: '/mcp-app-sandbox',



14

className: 'h-80 w-full rounded-lg border',



15

style: { border: 0 },



16

} satisfies MCPAppSandboxConfig;



17



18

async function loadResource(app: MCPAppMetadata): Promise<MCPAppResource> {



19

const response = await fetch('/api/mcp-app-host/read-resource', {



20

method: 'POST',



21

body: JSON.stringify({ uri: app.resourceUri }),



22

});



23



24

if (!response.ok) {



25

throw new Error('Failed to load MCP App resource');



26

}



27



28

return response.json();



29

}



30



31

const handlers: MCPAppBridgeHandlers = {



32

callTool: params =>



33

fetch('/api/mcp-app-host/call-tool', {



34

method: 'POST',



35

body: JSON.stringify(params),



36

}).then(response => response.json()),



37

openLink: ({ url }) => {



38

window.open(url, '_blank', 'noopener,noreferrer');



39

return {};



40

},



41

};



42



43

export function MessagePart({ part }: { part: unknown }) {



44

if (!isToolUIPart(part)) {



45

return null;



46

}



47



48

return (



49

<MCPAppRenderer



50

part={part}



51

loadResource={loadResource}



52

handlers={handlers}



53

sandbox={sandbox}



54

fallback={null}



55

/>



56

);



57

}
```

[Props](#props)
---------------

### part:

ToolUIPart<UITools> | DynamicToolUIPart

### sandbox:

MCPAppSandboxConfig

### resource?:

MCPAppResource

### loadResource?:

(app: MCPAppMetadata) => Promise<MCPAppResource>

### handlers?:

MCPAppBridgeHandlers

### hostInfo?:

{ name: string; version: string }

### hostContext?:

MCPAppHostContext

### fallback?:

ReactNode

[Sandbox Config](#sandbox-config)
---------------------------------

### url:

string | URL

### title?:

string

### className?:

string

### style?:

CSSProperties

### targetOrigin?:

string

### outerSandbox?:

string

### innerSandbox?:

string

[Bridge Handlers](#bridge-handlers)
-----------------------------------

`experimental_MCPAppRenderer` uses these handlers to respond to iframe requests. In production, server-backed handlers should validate authorization and MCP Apps tool visibility before calling the MCP server.

### allowedTools?:

string[]

### callTool?:

(params: MCPAppToolCallParams) => Promise<unknown> | unknown

### readResource?:

(params: { uri: string }) => Promise<unknown> | unknown

### listResources?:

(params?: unknown) => Promise<unknown> | unknown

### openLink?:

(params: { url: string }) => Promise<unknown> | unknown

### sendMessage?:

(params: unknown) => Promise<unknown> | unknown

### updateModelContext?:

(params: unknown) => Promise<unknown> | unknown

### requestDisplayMode?:

(params: { mode: 'inline' | 'fullscreen' | 'pip' }) => Promise<{ mode: MCPAppDisplayMode }> | { mode: MCPAppDisplayMode }

### onSizeChange?:

(params: { width?: number; height?: number }) => void

### onInitialized?:

() => void

### onRequestTeardown?:

(params: unknown) => void

### onLog?:

(params: unknown) => void

### onError?:

(error: Error) => void

[See Also](#see-also)
---------------------

[MCP Apps guide](/docs/ai-sdk-core/mcp-apps)[MCP Apps helpers](/docs/reference/ai-sdk-core/mcp-apps)

[Previous

InferUITool](/docs/reference/ai-sdk-ui/infer-ui-tool)[Next

DirectChatTransport](/docs/reference/ai-sdk-ui/direct-chat-transport)
