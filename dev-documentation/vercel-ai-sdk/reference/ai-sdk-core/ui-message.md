---
title: "UIMessage"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/ui-message
section: reference
crawled: 2026-09-20
---

# UIMessage

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/ui-message

[AI SDK Core](/docs/ai-sdk-core)UIMessage


[`UIMessage`](#uimessage)
=========================

`UIMessage` serves as the source of truth for your application's state, representing the complete message history including metadata, data parts, and all contextual information. In contrast to `ModelMessage`, which represents the state or context passed to the model, `UIMessage` contains the full application state needed for UI rendering and client-side functionality.

[Type Safety](#type-safety)
---------------------------

`UIMessage` is designed to be type-safe and accepts three generic parameters to ensure proper typing throughout your application:

1. **`METADATA`** - Custom metadata type for additional message information
2. **`DATA_PARTS`** - Custom data part types for structured data components
3. **`TOOLS`** - Tool definitions for type-safe tool interactions

[Creating Your Own UIMessage Type](#creating-your-own-uimessage-type)
---------------------------------------------------------------------

Here's an example of how to create a custom typed UIMessage for your application:

```
1

import { InferUITools, ToolSet, UIMessage, tool } from 'ai';



2

import z from 'zod';



3



4

const metadataSchema = z.object({



5

someMetadata: z.string().datetime(),



6

});



7



8

type MyMetadata = z.infer<typeof metadataSchema>;



9



10

const dataPartSchema = z.object({



11

someDataPart: z.object({}),



12

anotherDataPart: z.object({}),



13

});



14



15

type MyDataPart = z.infer<typeof dataPartSchema>;



16



17

const tools = {



18

someTool: tool({}),



19

} satisfies ToolSet;



20



21

type MyTools = InferUITools<typeof tools>;



22



23

export type MyUIMessage = UIMessage<MyMetadata, MyDataPart, MyTools>;
```

[`UIMessage` Interface](#uimessage-interface)
---------------------------------------------

```
1

interface UIMessage<



2

METADATA = unknown,



3

DATA_PARTS extends UIDataTypes = UIDataTypes,



4

TOOLS extends UITools = UITools,



5

> {



6

/**



7

* A unique identifier for the message.



8

*/



9

id: string;



10



11

/**



12

* The role of the message.



13

*/



14

role: 'system' | 'user' | 'assistant';



15



16

/**



17

* The metadata of the message.



18

*/



19

metadata?: METADATA;



20



21

/**



22

* The parts of the message. Use this for rendering the message in the UI.



23

*/



24

parts: Array<UIMessagePart<DATA_PARTS, TOOLS>>;



25

}
```

[`UIMessagePart` Types](#uimessagepart-types)
---------------------------------------------

### [`TextUIPart`](#textuipart)

A text part of a message.

```
1

type TextUIPart = {



2

type: 'text';



3

/**



4

* The text content.



5

*/



6

text: string;



7

/**



8

* The state of the text part.



9

*/



10

state?: 'streaming' | 'done';



11

};
```

### [`ReasoningUIPart`](#reasoninguipart)

A reasoning part of a message.

```
1

type ReasoningUIPart = {



2

type: 'reasoning';



3

/**



4

* The reasoning part ID.



5

*/



6

id?: string;



7

/**



8

* The reasoning text.



9

*/



10

text: string;



11

/**



12

* The state of the reasoning part.



13

*/



14

state?: 'streaming' | 'done';



15

/**



16

* The provider metadata.



17

*/



18

providerMetadata?: Record<string, any>;



19

};
```

### [`ToolUIPart`](#tooluipart)

A tool part of a message that represents tool invocations and their results.

The type is based on the name of the tool (e.g., `tool-someTool` for a tool
named `someTool`).

```
1

type ToolUIPart<TOOLS extends UITools = UITools> = ValueOf<{



2

[NAME in keyof TOOLS & string]: {



3

type: `tool-${NAME}`;



4

toolCallId: string;



5

} & (



6

| {



7

state: 'input-streaming';



8

input: DeepPartial<TOOLS[NAME]['input']> | undefined;



9

providerExecuted?: boolean;



10

output?: never;



11

errorText?: never;



12

}



13

| {



14

state: 'input-available';



15

input: TOOLS[NAME]['input'];



16

providerExecuted?: boolean;



17

output?: never;



18

errorText?: never;



19

}



20

| {



21

state: 'approval-requested';



22

input: TOOLS[NAME]['input'];



23

output?: never;



24

errorText?: never;



25

approval: {



26

id: string;



27

approved?: never;



28

descriptor?: unknown;



29

requestReason?: string;



30

reason?: never;



31

isAutomatic?: boolean;



32

signature?: string;



33

};



34

}



35

| {



36

state: 'approval-responded';



37

input: TOOLS[NAME]['input'];



38

output?: never;



39

errorText?: never;



40

approval: {



41

id: string;



42

approved: boolean;



43

descriptor?: unknown;



44

requestReason?: string;



45

reason?: string;



46

isAutomatic?: boolean;



47

signature?: string;



48

};



49

}



50

| {



51

state: 'output-available';



52

input: TOOLS[NAME]['input'];



53

output: TOOLS[NAME]['output'];



54

errorText?: never;



55

providerExecuted?: boolean;



56

}



57

| {



58

state: 'output-error';



59

input: TOOLS[NAME]['input'];



60

output?: never;



61

errorText: string;



62

providerExecuted?: boolean;



63

}



64

);



65

}>;
```

`approval.descriptor` contains optional opaque metadata supplied as
`approvalDescriptor` on the approval request stream chunk. It is preserved when
the tool part transitions from `approval-requested` to `approval-responded` and
in later approval-bearing output states.

### [`ToolOutputErrorUIPart`](#tooloutputerroruipart)

A static or dynamic tool part whose execution failed. Use the
`isToolOutputErrorUIPart` type guard when rendering messages so your code does
not need to check the tool state discriminator directly.

```
1

import { isToolOutputErrorUIPart, type UIMessage } from 'ai';



2



3

function ToolError({ part }: { part: UIMessage['parts'][number] }) {



4

if (!isToolOutputErrorUIPart(part)) {



5

return null;



6

}



7



8

return <div role="alert">{part.errorText}</div>;



9

}
```

The generic `ToolOutputErrorUIPart<TOOLS>` type preserves the input types of
static tools and also includes dynamic tool errors:

```
1

type ToolOutputErrorUIPart<TOOLS extends UITools = UITools> = Extract<



2

ToolUIPart<TOOLS> | DynamicToolUIPart,



3

{ state: 'output-error' }



4

>;
```

### [`CustomContentUIPart`](#customcontentuipart)

A provider-specific custom content part of a message.

```
1

type CustomContentUIPart = {



2

type: 'custom';



3

/**



4

* The kind of custom content, in the format `{provider}.{provider-type}`.



5

*/



6

kind: `${string}.${string}`;



7

/**



8

* The provider metadata.



9

*/



10

providerMetadata?: Record<string, any>;



11

};
```

### [`SourceUrlUIPart`](#sourceurluipart)

A source URL part of a message.

```
1

type SourceUrlUIPart = {



2

type: 'source-url';



3

sourceId: string;



4

url: string;



5

title?: string;



6

providerMetadata?: Record<string, any>;



7

};
```

### [`SourceDocumentUIPart`](#sourcedocumentuipart)

A document source part of a message.

```
1

type SourceDocumentUIPart = {



2

type: 'source-document';



3

sourceId: string;



4

mediaType: string;



5

title: string;



6

filename?: string;



7

providerMetadata?: Record<string, any>;



8

};
```

### [`FileUIPart`](#fileuipart)

A file part of a message.

```
1

type FileUIPart = {



2

type: 'file';



3

/**



4

* IANA media type of the file.



5

*/



6

mediaType: string;



7

/**



8

* Optional filename of the file.



9

*/



10

filename?: string;



11

/**



12

* The URL of the file.



13

* It can either be a URL to a hosted file or a Data URL.



14

*/



15

url: string;



16

};
```

### [`DataUIPart`](#datauipart)

A data part of a message for custom data types.

The type is based on the name of the data part (e.g., `data-someDataPart` for
a data part named `someDataPart`).

```
1

type DataUIPart<DATA_TYPES extends UIDataTypes> = ValueOf<{



2

[NAME in keyof DATA_TYPES & string]: {



3

type: `data-${NAME}`;



4

id?: string;



5

data: DATA_TYPES[NAME];



6

};



7

}>;
```

### [`StepStartUIPart`](#stepstartuipart)

A step boundary part of a message.

```
1

type StepStartUIPart = {



2

type: 'step-start';



3

};
```

[Previous

ModelMessage](/docs/reference/ai-sdk-core/model-message)[Next

validateUIMessages](/docs/reference/ai-sdk-core/validate-ui-messages)
