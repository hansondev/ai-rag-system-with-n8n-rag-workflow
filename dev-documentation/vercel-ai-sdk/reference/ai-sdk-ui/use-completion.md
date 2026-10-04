---
title: "useCompletion()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-completion
section: reference
crawled: 2026-09-20
---

# useCompletion()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-completion

[AI SDK UI](/docs/ai-sdk-ui)useCompletion


[`useCompletion()`](#usecompletion)
===================================

Allows you to create text completion based capabilities for your application. It enables the streaming of text completions from your AI provider, manages the state for chat input, and updates the UI automatically as new messages are received.

[Import](#import)
-----------------

ReactSvelteVueAngular

```
import { useCompletion } from '@ai-sdk/react'
```

[API Signature](#api-signature)
-------------------------------

### [Type Parameters](#type-parameters)

### BODY:

object

### [Parameters](#parameters)

### api:

string = '/api/completion'

### id:

string

### initialInput:

string

### initialCompletion:

string

### onFinish:

(prompt: string, completion: string) => void

### onError:

(error: Error) => void

### headers:

Record<string, string> | Headers

### body:

BODY

### credentials:

'omit' | 'same-origin' | 'include'

### streamProtocol?:

'text' | 'data'

### fetch?:

FetchFunction

### throttle?:

number

### [Returns](#returns)

### completion:

string

### complete:

(prompt: string, options?: { headers?: Record<string, string> | Headers, body?: BODY }) => Promise<string | null | undefined>

### error:

undefined | Error

### setCompletion:

(completion: string) => void

### stop:

() => void

### input:

string

### setInput:

React.Dispatch<React.SetStateAction<string>>

### handleInputChange:

(event: any) => void

### handleSubmit:

(event?: { preventDefault?: () => void }) => void

### isLoading:

boolean

[Previous

useChat](/docs/reference/ai-sdk-ui/use-chat)[Next

useObject](/docs/reference/ai-sdk-ui/use-object)
