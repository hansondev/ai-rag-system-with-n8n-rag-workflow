---
title: "safeValidateUIMessages"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/safe-validate-ui-messages
section: reference
crawled: 2026-09-20
---

# safeValidateUIMessages

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/safe-validate-ui-messages

[AI SDK Core](/docs/ai-sdk-core)safeValidateUIMessages


[`safeValidateUIMessages`](#safevalidateuimessages)
===================================================

`safeValidateUIMessages` is an async function that validates UI messages like [`validateUIMessages`](/docs/reference/ai-sdk-core/validate-ui-messages), but instead of throwing it returns an object with a `success` key and either `data` or `error`.

[Basic Usage](#basic-usage)
---------------------------

Simple validation without custom schemas:

```
1

import { safeValidateUIMessages } from 'ai';



2



3

const messages = [



4

{



5

id: '1',



6

role: 'user',



7

parts: [{ type: 'text', text: 'Hello!' }],



8

},



9

];



10



11

const result = await safeValidateUIMessages({



12

messages,



13

});



14



15

if (!result.success) {



16

console.error(result.error.message);



17

} else {



18

const validatedMessages = result.data;



19

}
```

[Deprecated `rawInput` field](#deprecated-rawinput-field)
---------------------------------------------------------

For backward compatibility, validation still accepts `rawInput` on tool parts
in the `output-error` state. When a defined `rawInput` value is found,
`safeValidateUIMessages` emits an AI SDK deprecation warning through
`AI_SDK_LOG_WARNINGS`.

Migrate persisted messages to store tool arguments in `input` and remove
`rawInput`. For backward compatibility, conversion uses `rawInput` as a
fallback when `input` is `null` or `undefined`. `rawInput` will be removed in
the next major version.

[Advanced Usage](#advanced-usage)
---------------------------------

Comprehensive validation with custom metadata, data parts, and tools:

```
1

import { safeValidateUIMessages, tool } from 'ai';



2

import { z } from 'zod';



3



4

// Define schemas



5

const metadataSchema = z.object({



6

timestamp: z.string().datetime(),



7

userId: z.string(),



8

});



9



10

const dataSchemas = {



11

chart: z.object({



12

data: z.array(z.number()),



13

labels: z.array(z.string()),



14

}),



15

image: z.object({



16

url: z.string().url(),



17

caption: z.string(),



18

}),



19

};



20



21

const tools = {



22

weather: tool({



23

description: 'Get weather info',



24

inputSchema: z.object({



25

location: z.string(),



26

}),



27

execute: async ({ location }) => `Weather in ${location}: sunny`,



28

}),



29

};



30



31

// Messages with custom parts



32

const messages = [



33

{



34

id: '1',



35

role: 'user',



36

metadata: { timestamp: '2024-01-01T00:00:00Z', userId: 'user123' },



37

parts: [



38

{ type: 'text', text: 'Show me a chart' },



39

{



40

type: 'data-chart',



41

data: { data: [1, 2, 3], labels: ['A', 'B', 'C'] },



42

},



43

],



44

},



45

{



46

id: '2',



47

role: 'assistant',



48

parts: [



49

{



50

type: 'tool-weather',



51

toolCallId: 'call_123',



52

state: 'output-available',



53

input: { location: 'San Francisco' },



54

output: 'Weather in San Francisco: sunny',



55

},



56

],



57

},



58

];



59



60

// Validate with all schemas



61

const result = await safeValidateUIMessages({



62

messages,



63

metadataSchema,



64

dataSchemas,



65

tools,



66

});



67



68

if (!result.success) {



69

console.error(result.error.message);



70

} else {



71

const validatedMessages = result.data;



72

}
```

[Previous

validateUIMessages](/docs/reference/ai-sdk-core/validate-ui-messages)[Next

Experimental\_SandboxSession](/docs/reference/ai-sdk-core/sandbox)
