---
title: "AI_InvalidPromptError"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-invalid-prompt-error
section: reference
crawled: 2026-09-20
---

# AI_InvalidPromptError

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-errors/ai-invalid-prompt-error

[AI SDK Errors](/docs/reference/ai-sdk-errors)AI\_InvalidPromptError


[AI\_InvalidPromptError](#ai_invalidprompterror)
================================================

This error occurs when the prompt provided is invalid.

[Potential Causes](#potential-causes)
-------------------------------------

### [UI Messages](#ui-messages)

You are passing a `UIMessage[]` as messages into e.g. `streamText`.

You need to first convert them to a `ModelMessage[]` using `convertToModelMessages()`.

```
1

import { type UIMessage, generateText, convertToModelMessages } from 'ai';



2



3

const messages: UIMessage[] = [



4

/* ... */



5

];



6



7

const result = await generateText({



8

// ...



9

messages: await convertToModelMessages(messages),



10

});
```

[Properties](#properties)
-------------------------

* `prompt`: The invalid prompt value
* `message`: The error message (required in constructor)
* `cause`: The cause of the error (optional)

[Checking for this Error](#checking-for-this-error)
---------------------------------------------------

You can check if an error is an instance of `AI_InvalidPromptError` using:

```
1

import { InvalidPromptError } from 'ai';



2



3

if (InvalidPromptError.isInstance(error)) {



4

// Handle the error



5

}
```

[Previous

AI\_InvalidMessageRoleError](/docs/reference/ai-sdk-errors/ai-invalid-message-role-error)[Next

AI\_InvalidResponseDataError](/docs/reference/ai-sdk-errors/ai-invalid-response-data-error)
