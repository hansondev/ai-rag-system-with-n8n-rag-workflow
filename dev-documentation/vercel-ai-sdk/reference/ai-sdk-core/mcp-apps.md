---
title: "MCP Apps"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/mcp-apps
section: reference
crawled: 2026-09-20
---

# MCP Apps

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/mcp-apps

[AI SDK Core](/docs/ai-sdk-core)MCP Apps


[MCP Apps](#mcp-apps)
=====================

The MCP Apps helpers in `@ai-sdk/mcp` help an MCP host advertise UI support, keep model-visible and app-visible tools separate, and read `ui://` HTML resources for rendering.

[Import](#import)
-----------------

```
import {
MCP_APP_MIME_TYPE,
mcpAppClientCapabilities,
readMCPAppResource,
splitMCPAppTools,
} from "@ai-sdk/mcp"
```

[`MCP_APP_MIME_TYPE`](#mcp_app_mime_type)
-----------------------------------------

The MIME type for HTML resources that should be rendered as MCP Apps.

```
1

const MCP_APP_MIME_TYPE = 'text/html;profile=mcp-app';
```

[`mcpAppClientCapabilities`](#mcpappclientcapabilities)
-------------------------------------------------------

Client capabilities to pass to [`createMCPClient`](/docs/reference/ai-sdk-core/create-mcp-client) when your host supports MCP Apps.

```
1

import { createMCPClient, mcpAppClientCapabilities } from '@ai-sdk/mcp';



2



3

const client = await createMCPClient({



4

transport: {



5

type: 'http',



6

url: 'https://example.com/mcp',



7

},



8

capabilities: mcpAppClientCapabilities,



9

});
```

The advertised capability is:

```
1

{



2

"extensions": {



3

"io.modelcontextprotocol/ui": {



4

"mimeTypes": ["text/html;profile=mcp-app"]



5

}



6

}



7

}
```

[`splitMCPAppTools()`](#splitmcpapptools)
-----------------------------------------

Splits MCP tool definitions into model-visible tools and app-visible tools.

Tools without MCP Apps visibility metadata remain model-visible. Tools whose `_meta.ui.visibility` includes `"app"` are returned in `appVisible`.

```
1

const definitions = await client.listTools();



2

const { modelVisible, appVisible } = splitMCPAppTools(definitions);



3



4

const tools = client.toolsFromDefinitions(modelVisible);
```

### [Parameters](#parameters)

### definitions:

ListToolsResult

### [Returns](#returns)

### modelVisible:

ListToolsResult

### appVisible:

ListToolsResult

[`readMCPAppResource()`](#readmcpappresource)
---------------------------------------------

Reads a `ui://` resource from an MCP server and normalizes it into HTML plus rendering metadata.

```
1

const resource = await readMCPAppResource({



2

client,



3

uri: 'ui://example/dashboard',



4

});
```

The helper validates that the URI starts with `ui://`, requires the `text/html;profile=mcp-app` MIME type, and supports resource contents returned as either text or base64 blob data.

### [Parameters](#parameters-1)

### client:

Pick<MCPClient, 'readResource'>

### uri:

string

### options?:

RequestOptions

### [Returns](#returns-1)

Returns a `Promise<MCPAppResource>`.

### uri:

string

### mimeType:

'text/html;profile=mcp-app'

### html:

string

### meta?:

MCPAppResourceMeta

[See Also](#see-also)
---------------------

[MCP Apps guide](/docs/ai-sdk-core/mcp-apps)[createMCPClient](/docs/reference/ai-sdk-core/create-mcp-client)

[Previous

experimental\_listBatches](/docs/reference/ai-sdk-core/list-batches)[Next

Experimental\_StdioMCPTransport](/docs/reference/ai-sdk-core/mcp-stdio-transport)
