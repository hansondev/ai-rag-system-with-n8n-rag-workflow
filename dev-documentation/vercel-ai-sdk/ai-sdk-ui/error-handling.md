---
title: "Error Handling and warnings"
source_url: https://ai-sdk.dev/docs/ai-sdk-ui/error-handling
section: ai-sdk-ui
crawled: 2026-09-20
---

# Error Handling and warnings

> Source: https://ai-sdk.dev/docs/ai-sdk-ui/error-handling

[AI SDK UI](/docs/ai-sdk-ui)Error Handling


[Error Handling and warnings](#error-handling-and-warnings)
===========================================================

[Warnings](#warnings)
---------------------

The AI SDK shows warnings when something might not work as expected.
These warnings help you fix problems before they cause errors.

### [When Warnings Appear](#when-warnings-appear)

Warnings are shown in the browser console when:

* **Unsupported features**: You use a feature or setting that is not supported by the AI model (e.g., certain options or parameters).
* **Compatibility warnings**: A feature is used in a compatibility mode, which might work differently or less optimally than intended.
* **Other warnings**: The AI model reports another type of issue, such as general problems or advisory messages.

### [Warning Messages](#warning-messages)

All warnings start with "AI SDK Warning:" so you can easily find them. For example:

```
1

AI SDK Warning: The feature "temperature" is not supported by this model
```

### [Turning Off Warnings](#turning-off-warnings)

By default, warnings are shown in the console. You can control this behavior:

#### [Turn Off All Warnings](#turn-off-all-warnings)

Set a global variable to turn off warnings completely:

```
1

globalThis.AI_SDK_LOG_WARNINGS = false;
```

#### [Custom Warning Handler](#custom-warning-handler)

You can also provide your own function to handle warnings.
It receives provider id, model id, and a list of warnings.

```
1

globalThis.AI_SDK_LOG_WARNINGS = ({ warnings, provider, model }) => {



2

// Handle warnings your own way



3

};
```

[Error Handling](#error-handling)
---------------------------------

### [Error Helper Object](#error-helper-object)

Each AI SDK UI hook also returns an [error](/docs/reference/ai-sdk-ui/use-chat#error) object that you can use to render the error in your UI.
You can use the error object to show an error message, disable the submit button, or show a retry button.

We recommend showing a generic error message to the user, such as "Something
went wrong." This is a good practice to avoid leaking information from the
server.

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { useState } from 'react';



5



6

export default function Chat() {



7

const [input, setInput] = useState('');



8

const { messages, sendMessage, error, regenerate } = useChat();



9



10

const handleSubmit = (e: React.FormEvent) => {



11

e.preventDefault();



12

sendMessage({ text: input });



13

setInput('');



14

};



15



16

return (



17

<div>



18

{messages.map(m => (



19

<div key={m.id}>



20

{m.role}:{' '}



21

{m.parts



22

.filter(part => part.type === 'text')



23

.map(part => part.text)



24

.join('')}



25

</div>



26

))}



27



28

{error && (



29

<>



30

<div>An error occurred.</div>



31

<button type="button" onClick={() => regenerate()}>



32

Retry



33

</button>



34

</>



35

)}



36



37

<form onSubmit={handleSubmit}>



38

<input



39

value={input}



40

onChange={e => setInput(e.target.value)}



41

disabled={error != null}



42

/>



43

</form>



44

</div>



45

);



46

}
```

#### [Alternative: replace the failed message](#alternative-replace-the-failed-message)

Alternatively, you can write a custom submit handler that replaces the failed
user message with new input. If the assistant response started streaming before
the error, remove both the partial assistant response and its user message.

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { useState } from 'react';



5



6

export default function Chat() {



7

const [input, setInput] = useState('');



8

const { sendMessage, error, messages, setMessages } = useChat();



9



10

function customSubmit(event: React.FormEvent<HTMLFormElement>) {



11

event.preventDefault();



12



13

if (error != null) {



14

setMessages(messages =>



15

messages.at(-1)?.role === 'assistant'



16

? messages.slice(0, -2)



17

: messages.slice(0, -1),



18

);



19

}



20



21

sendMessage({ text: input });



22

setInput('');



23

}



24



25

return (



26

<div>



27

{messages.map(m => (



28

<div key={m.id}>



29

{m.role}:{' '}



30

{m.parts



31

.filter(part => part.type === 'text')



32

.map(part => part.text)



33

.join('')}



34

</div>



35

))}



36



37

{error && <div>An error occurred.</div>}



38



39

<form onSubmit={customSubmit}>



40

<input value={input} onChange={e => setInput(e.target.value)} />



41

</form>



42

</div>



43

);



44

}
```

### [Error Handling Callback](#error-handling-callback)

Errors can be processed by passing an [`onError`](/docs/reference/ai-sdk-ui/use-chat#on-error) callback function as an option to the [`useChat`](/docs/reference/ai-sdk-ui/use-chat) or [`useCompletion`](/docs/reference/ai-sdk-ui/use-completion) hooks.
The callback function receives an error object as an argument.

AI SDK-created client errors use exported error classes with marker-based
`.isInstance()` guards:

| Error class | AI SDK UI failure |
| --- | --- |
| [`APICallError`](/docs/reference/ai-sdk-errors/ai-api-call-error) | A chat transport or completion request returns a non-successful HTTP response. |
| [`EmptyResponseBodyError`](/docs/reference/ai-sdk-errors/ai-empty-response-body-error) | A successful chat transport or completion response has no body. |
| [`UIMessageStreamError`](/docs/reference/ai-sdk-errors/ai-ui-message-stream-error) | A completion data stream reports an error or a UI message stream contains invalid chunks. |
| [`InvalidArgumentError`](/docs/reference/ai-sdk-errors/ai-invalid-argument-error) | An invalid stream protocol or message ID is used. |
| [`UnsupportedFunctionalityError`](/docs/reference/ai-sdk-errors/ai-unsupported-functionality-error) | A `FileList` is used in an environment that does not support it. |

Errors thrown by custom fetch implementations, callbacks, and stream parsers
continue to propagate unchanged.

```
1

import { useChat } from '@ai-sdk/react';



2

import { APICallError, EmptyResponseBodyError } from 'ai';



3



4

export default function Page() {



5

const {



6

/* ... */



7

} = useChat({



8

// handle error:



9

onError: error => {



10

if (APICallError.isInstance(error)) {



11

console.error('Request failed with status:', error.statusCode);



12

} else if (EmptyResponseBodyError.isInstance(error)) {



13

console.error('The server returned no response body.');



14

} else {



15

console.error(error);



16

}



17

},



18

});



19

}
```

For AI SDK UI requests, `APICallError.requestBodyValues` is `undefined` so
prompts and messages are not copied into client-facing error objects. The
response text remains available as `message` and `responseBody`; display a
generic message to users to avoid leaking server information.

### [Injecting Errors for Testing](#injecting-errors-for-testing)

You might want to create errors for testing.
You can easily do so by throwing an error in your route handler:

```
1

export async function POST(req: Request) {



2

throw new Error('This is a test error');



3

}
```

[Previous

Streaming Custom Data](/docs/ai-sdk-ui/streaming-data)[Next

Transport](/docs/ai-sdk-ui/transport)
