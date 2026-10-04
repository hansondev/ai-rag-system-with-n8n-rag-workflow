---
title: "useChat \"An error occurred\""
source_url: https://ai-sdk.dev/docs/troubleshooting/use-chat-an-error-occurred
section: troubleshooting
crawled: 2026-09-20
---

# useChat "An error occurred"

> Source: https://ai-sdk.dev/docs/troubleshooting/use-chat-an-error-occurred

[Troubleshooting](/docs/troubleshooting)useChat "An error occurred"


[`useChat` "An error occurred"](#usechat-an-error-occurred)
===========================================================

[Issue](#issue)
---------------

I am using [`useChat`](/docs/reference/ai-sdk-ui/use-chat) and I get the error "An error occurred".

[Background](#background)
-------------------------

Error messages from `streamText` are masked by default when using `toUIMessageStream` for security reasons (secure-by-default).
This prevents leaking sensitive information to the client.

[Solution](#solution)
---------------------

To forward error details to the client or to log errors, use the `onError` function when calling `toUIMessageStream`.

```
1

export function errorHandler(error: unknown) {



2

if (error == null) {



3

return 'unknown error';



4

}



5



6

if (typeof error === 'string') {



7

return error;



8

}



9



10

if (error instanceof Error) {



11

return error.message;



12

}



13



14

return JSON.stringify(error);



15

}
```

```
1

const result = streamText({



2

// ...



3

});



4



5

return createUIMessageStreamResponse({



6

stream: toUIMessageStream({



7

stream: result.stream,



8

onError: errorHandler,



9

}),



10

});
```

In case you are using `createDataStreamResponse`, you can use the `onError` function when calling `toDataStreamResponse`:

```
1

const response = createDataStreamResponse({



2

// ...



3

async execute(dataStream) {



4

// ...



5

},



6

onError: errorHandler,



7

});
```

[Previous

TypeScript performance issues with Zod and AI SDK 5](/docs/troubleshooting/typescript-performance-zod)[Next

Repeated assistant messages in useChat](/docs/troubleshooting/repeated-assistant-messages)
