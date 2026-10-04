---
title: "Stale body values with useChat"
source_url: https://ai-sdk.dev/docs/troubleshooting/use-chat-stale-body-data
section: troubleshooting
crawled: 2026-09-20
---

# Stale body values with useChat

> Source: https://ai-sdk.dev/docs/troubleshooting/use-chat-stale-body-data

[Troubleshooting](/docs/troubleshooting)Stale body values with useChat


[Stale body values with useChat](#stale-body-values-with-usechat)
=================================================================

[Issue](#issue)
---------------

When using `useChat` and passing dynamic information via the `body` parameter at the hook level, the data remains stale and only reflects the value from the initial component render. This occurs because the body configuration is captured once when the hook is initialized and doesn't update with subsequent component re-renders.

```
1

// Problematic code - body data will be stale



2

export default function Chat() {



3

const [temperature, setTemperature] = useState(0.7);



4

const [userId, setUserId] = useState('user123');



5



6

// This body configuration is captured once and won't update



7

const { messages, sendMessage } = useChat({



8

transport: new DefaultChatTransport({



9

api: '/api/chat',



10

body: {



11

temperature, // Always the initial value (0.7)



12

userId, // Always the initial value ('user123')



13

},



14

}),



15

});



16



17

// Even if temperature or userId change, the body in requests will still use initial values



18

return (



19

<div>



20

<input



21

type="range"



22

value={temperature}



23

onChange={e => setTemperature(parseFloat(e.target.value))}



24

/>



25

{/* Chat UI */}



26

</div>



27

);



28

}
```

[Background](#background)
-------------------------

The hook-level body configuration is evaluated once during the initial render and doesn't re-evaluate when component state changes.

[Solution](#solution)
---------------------

Pass dynamic variables via the second argument of the `sendMessage` function instead of at the hook level. Request-level options are evaluated on each call and take precedence over hook-level options.

```
1

export default function Chat() {



2

const [temperature, setTemperature] = useState(0.7);



3

const [userId, setUserId] = useState('user123');



4

const [input, setInput] = useState('');



5



6

const { messages, sendMessage } = useChat({



7

// Static configuration only



8

transport: new DefaultChatTransport({



9

api: '/api/chat',



10

}),



11

});



12



13

return (



14

<div>



15

<input



16

type="range"



17

value={temperature}



18

onChange={e => setTemperature(parseFloat(e.target.value))}



19

/>



20



21

<form



22

onSubmit={event => {



23

event.preventDefault();



24

if (input.trim()) {



25

// Pass dynamic values as request-level options



26

sendMessage(



27

{ text: input },



28

{



29

body: {



30

temperature, // Current value at request time



31

userId, // Current value at request time



32

},



33

},



34

);



35

setInput('');



36

}



37

}}



38

>



39

<input value={input} onChange={e => setInput(e.target.value)} />



40

</form>



41

</div>



42

);



43

}
```

### [Alternative: Dynamic Hook-Level Configuration](#alternative-dynamic-hook-level-configuration)

If you need hook-level configuration that responds to changes, you can use functions that return configuration values. However, for component state, you'll need to use `useRef` to access current values:

```
1

export default function Chat() {



2

const temperatureRef = useRef(0.7);



3



4

const { messages, sendMessage } = useChat({



5

transport: new DefaultChatTransport({



6

api: '/api/chat',



7

body: () => ({



8

temperature: temperatureRef.current, // Access via ref.current



9

sessionId: getCurrentSessionId(), // Function calls work directly



10

}),



11

}),



12

});



13



14

// ...



15

}
```

**Recommendation:** Request-level configuration is simpler and more reliable for component state. Use it whenever you need to pass dynamic values that change during the component lifecycle.

### [Server-side handling](#server-side-handling)

On your server side, retrieve the custom fields by destructuring the request body:

```
1

// app/api/chat/route.ts



2

export async function POST(req: Request) {



3

const { messages, temperature, userId } = await req.json();



4



5

const result = streamText({



6

model: 'openai/gpt-5-mini',



7

messages: await convertToModelMessages(messages),



8

temperature, // Use the dynamic temperature from the request



9

// ... other configuration



10

});



11



12

return createUIMessageStreamResponse({



13

stream: toUIMessageStream({ stream: result.stream }),



14

});



15

}
```

For more information, see [chatbot request configuration documentation](/docs/ai-sdk-ui/chatbot#request-configuration).

[Previous

Streaming Status Shows But No Text Appears](/docs/troubleshooting/streaming-status-delay)[Next

Type Error with onToolCall](/docs/troubleshooting/ontoolcall-type-narrowing)
