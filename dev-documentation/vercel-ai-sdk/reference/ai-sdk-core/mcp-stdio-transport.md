---
title: "Experimental_StdioMCPTransport"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/mcp-stdio-transport
section: reference
crawled: 2026-09-20
---

# Experimental_StdioMCPTransport

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/mcp-stdio-transport

[AI SDK Core](/docs/ai-sdk-core)Experimental\_StdioMCPTransport


[`Experimental_StdioMCPTransport`](#experimental_stdiomcptransport)
===================================================================

Creates a transport for Model Context Protocol (MCP) clients to communicate with MCP servers using standard input and output streams. This transport is only supported in Node.js environments.

This feature is experimental and may change or be removed in the future.

[Import](#import)
-----------------

```
import { Experimental_StdioMCPTransport } from "@ai-sdk/mcp/mcp-stdio"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### config:

StdioConfig

StdioConfig

### command:

string

### args?:

string[]

### env?:

Record<string, string>

### stderr?:

IOType | Stream | number

### cwd?:

string

[Previous

MCP Apps](/docs/reference/ai-sdk-core/mcp-apps)[Next

jsonSchema](/docs/reference/ai-sdk-core/json-schema)
