---
title: "Experimental_SandboxSession"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/sandbox
section: reference
crawled: 2026-09-20
---

# Experimental_SandboxSession

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/sandbox

[AI SDK Core](/docs/ai-sdk-core)Experimental\_SandboxSession


[`Experimental_SandboxSession`](#experimental_sandboxsession)
=============================================================

The `Experimental_SandboxSession` interface describes an execution environment that
tools can use to run commands. Pass an experimental sandbox using the
`experimental_sandbox` option to `generateText`, `streamText`,
`ToolLoopAgent.generate`, `ToolLoopAgent.stream`, or agent UI stream helpers to
make it available to tool description functions and tool execution.

This API is experimental and can change in patch releases. Passing an
experimental sandbox does not sandbox the tool itself. Tool code still runs in
your application process unless the tool explicitly delegates work to the
experimental sandbox.

[Import](#import)
-----------------

```
import type { Experimental_SandboxSession } from "ai"
```

[Type Definition](#type-definition)
-----------------------------------

```
1

type Experimental_SandboxSession = {



2

readonly description: string;



3

readonly run: (options: {



4

command: string;



5

workingDirectory?: string;



6

env?: Record<string, string>;



7

abortSignal?: AbortSignal;



8

}) => PromiseLike<{



9

exitCode: number;



10

stdout: string;



11

stderr: string;



12

}>;



13

};
```

[Properties](#properties)
-------------------------

### description:

string

### run:

(options: { command: string; workingDirectory?: string; env?: Record<string, string>; abortSignal?: AbortSignal }) => PromiseLike<{ exitCode: number; stdout: string; stderr: string }>

options

### command:

string

### workingDirectory:

string | undefined

### env:

Record<string, string> | undefined

### abortSignal:

AbortSignal | undefined

[Example](#example)
-------------------

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

const result = await generateText({



2

model: "xai/grok-4.6",



3

tools: { shell },



4

experimental_sandbox,



5

prompt: 'Run the test suite.',



6

});
```

Inside a tool, read the experimental sandbox from the second `execute` argument:

```
1

const shell = tool({



2

inputSchema: z.object({



3

command: z.string(),



4

workingDirectory: z.string().optional(),



5

}),



6

execute: async (



7

{ command, workingDirectory },



8

{ abortSignal, experimental_sandbox },



9

) => {



10

if (!experimental_sandbox) {



11

throw new Error('Experimental sandbox is not available');



12

}



13



14

return experimental_sandbox.run({



15

command,



16

workingDirectory,



17

abortSignal,



18

});



19

},



20

});
```

[See Also](#see-also)
---------------------

* [Tool Calling: Experimental Sandbox](/docs/ai-sdk-core/tools-and-tool-calling#experimental-sandbox)
* [`generateText`](/docs/reference/ai-sdk-core/generate-text)
* [`streamText`](/docs/reference/ai-sdk-core/stream-text)
* [`ToolLoopAgent`](/docs/reference/ai-sdk-core/tool-loop-agent)

[Previous

safeValidateUIMessages](/docs/reference/ai-sdk-core/safe-validate-ui-messages)[Next

createProviderRegistry](/docs/reference/ai-sdk-core/provider-registry)
