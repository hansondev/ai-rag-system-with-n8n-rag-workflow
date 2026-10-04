---
title: "Custom headers, body, and credentials not working with useChat"
source_url: https://ai-sdk.dev/docs/troubleshooting/use-chat-custom-request-options
section: troubleshooting
crawled: 2026-09-20
---

# Custom headers, body, and credentials not working with useChat

> Source: https://ai-sdk.dev/docs/troubleshooting/use-chat-custom-request-options

[Troubleshooting](/docs/troubleshooting)Custom headers, body, and credentials not working with useChat


[Custom headers, body, and credentials not working with useChat](#custom-headers-body-and-credentials-not-working-with-usechat)
===============================================================================================================================

[Issue](#issue)
---------------

When using the `useChat` hook, custom request options like headers, body fields, and credentials configured directly on the hook are not being sent with the request:

```
1

// These options are not sent with the request



2

const { messages, sendMessage } = useChat({



3

headers: {



4

Authorization: 'Bearer token123',



5

},



6

body: {



7

user_id: '123',



8

},



9

credentials: 'include',



10

});
```

[Background](#background)
-------------------------

The `useChat` hook has changed its API for configuring request options. Direct options like `headers`, `body`, and `credentials` on the hook itself are no longer supported. Instead, you need to use the `transport` configuration with `DefaultChatTransport` or pass options at the request level.

[Solution](#solution)
---------------------

There are three ways to properly configure request options with `useChat`:

### [Option 1: Request-Level Configuration (Recommended for Dynamic Values)](#option-1-request-level-configuration-recommended-for-dynamic-values)

For dynamic values that change over time, the recommended approach is to pass options when calling `sendMessage`:

```
1

const { messages, sendMessage } = useChat();



2



3

// Send options with each message



4

sendMessage(



5

{ text: input },



6

{



7

headers: {



8

Authorization: `Bearer ${getAuthToken()}`, // Dynamic auth token



9

'X-Request-ID': generateRequestId(),



10

},



11

body: {



12

temperature: 0.7,



13

max_tokens: 100,



14

user_id: getCurrentUserId(), // Dynamic user ID



15

sessionId: getCurrentSessionId(), // Dynamic session



16

},



17

},



18

);
```

This approach ensures that the most up-to-date values are always sent with each request.

### [Option 2: Hook-Level Configuration with Static Values](#option-2-hook-level-configuration-with-static-values)

For static values that don't change during the component lifecycle, use the `DefaultChatTransport`:

```
1

import { useChat } from '@ai-sdk/react';



2

import { DefaultChatTransport } from 'ai';



3



4

const { messages, sendMessage } = useChat({



5

transport: new DefaultChatTransport({



6

api: '/api/chat',



7

headers: {



8

'X-API-Version': 'v1', // Static API version



9

'X-App-ID': 'my-app', // Static app identifier



10

},



11

body: {



12

model: 'gpt-5.1', // Default model



13

stream: true, // Static configuration



14

},



15

credentials: 'include', // Static credentials policy



16

}),



17

});
```

### [Option 3: Hook-Level Configuration with Resolvable Functions](#option-3-hook-level-configuration-with-resolvable-functions)

If you need dynamic values at the hook level, you can use functions that return configuration values. However, request-level configuration is generally preferred for better reliability:

```
1

import { useChat } from '@ai-sdk/react';



2

import { DefaultChatTransport } from 'ai';



3



4

const { messages, sendMessage } = useChat({



5

transport: new DefaultChatTransport({



6

api: '/api/chat',



7

headers: () => ({



8

Authorization: `Bearer ${getAuthToken()}`,



9

'X-User-ID': getCurrentUserId(),



10

}),



11

body: () => ({



12

sessionId: getCurrentSessionId(),



13

preferences: getUserPreferences(),



14

}),



15

credentials: () => (isAuthenticated() ? 'include' : 'same-origin'),



16

}),



17

});
```

For component state that changes over time, request-level configuration
(Option 1) is recommended. If using hook-level functions, consider using
`useRef` to store current values and reference `ref.current` in your
configuration function.

### [Combining Hook and Request Level Options](#combining-hook-and-request-level-options)

Request-level options take precedence over hook-level options:

```
1

// Hook-level default configuration



2

const { messages, sendMessage } = useChat({



3

transport: new DefaultChatTransport({



4

api: '/api/chat',



5

headers: {



6

'X-API-Version': 'v1',



7

},



8

body: {



9

model: 'gpt-5.1',



10

},



11

}),



12

});



13



14

// Override or add options per request



15

sendMessage(



16

{ text: input },



17

{



18

headers: {



19

'X-API-Version': 'v2', // This overrides the hook-level header



20

'X-Request-ID': '123', // This is added



21

},



22

body: {



23

model: 'gpt-5-mini', // This overrides the hook-level body field



24

temperature: 0.5, // This is added



25

},



26

},



27

);
```

For more details on request configuration, see the [Request Configuration](/docs/ai-sdk-ui/chatbot#request-configuration) documentation.

[Previous

useChat No Response](/docs/troubleshooting/use-chat-tools-no-response)[Next

TypeScript performance issues with Zod and AI SDK 5](/docs/troubleshooting/typescript-performance-zod)
