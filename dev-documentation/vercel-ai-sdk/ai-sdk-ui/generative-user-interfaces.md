---
title: "Generative User Interfaces"
source_url: https://ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces
section: ai-sdk-ui
crawled: 2026-09-20
---

# Generative User Interfaces

> Source: https://ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces

[AI SDK UI](/docs/ai-sdk-ui)Generative User Interfaces


[Generative User Interfaces](#generative-user-interfaces)
=========================================================

Generative user interfaces (generative UI) is the process of allowing a large language model (LLM) to go beyond text and "generate UI". This creates a more engaging and AI-native experience for users.

What is the weather in SF?

getWeather("San Francisco")

Thursday, March 7

47°

sunny

7am

48°

8am

50°

9am

52°

10am

54°

11am

56°

12pm

58°

1pm

60°

Thanks!

At the core of generative UI are  [tools](/docs/ai-sdk-core/tools-and-tool-calling) , which are functions you provide to the model to perform specialized tasks like getting the weather in a location. The model can decide when and how to use these tools based on the context of the conversation.

Generative UI is the process of connecting the results of a tool call to a React component. Here's how it works:

1. You provide the model with a prompt or conversation history, along with a set of tools.
2. Based on the context, the model may decide to call a tool.
3. If a tool is called, it will execute and return data.
4. This data can then be passed to a React component for rendering.

By passing the tool results to React components, you can create a generative UI experience that's more engaging and adaptive to your needs.

[Build a Generative UI Chat Interface](#build-a-generative-ui-chat-interface)
-----------------------------------------------------------------------------

Let's create a chat interface that handles text-based conversations and incorporates dynamic UI elements based on model responses.

### [Basic Chat Implementation](#basic-chat-implementation)

Start with a basic chat implementation using the `useChat` hook:

app/page.tsx

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

export default function Page() {



7

const [input, setInput] = useState('');



8

const { messages, sendMessage } = useChat();



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

{messages.map(message => (



19

<div key={message.id}>



20

<div>{message.role === 'user' ? 'User: ' : 'AI: '}</div>



21

<div>



22

{message.parts.map((part, index) => {



23

if (part.type === 'text') {



24

return <span key={index}>{part.text}</span>;



25

}



26

return null;



27

})}



28

</div>



29

</div>



30

))}



31



32

<form onSubmit={handleSubmit}>



33

<input



34

value={input}



35

onChange={e => setInput(e.target.value)}



36

placeholder="Type a message..."



37

/>



38

<button type="submit">Send</button>



39

</form>



40

</div>



41

);



42

}
```

To handle the chat requests and model responses, set up an API route:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat/route.ts

```
1

import {



2

convertToModelMessages,



3

createUIMessageStreamResponse,



4

isStepCount,



5

streamText,



6

toUIMessageStream,



7

UIMessage,



8

} from 'ai';



9



10

export async function POST(request: Request) {



11

const { messages }: { messages: UIMessage[] } = await request.json();



12



13

const result = streamText({



14

model: "xai/grok-4.6",



15

instructions: 'You are a friendly assistant!',



16

messages: await convertToModelMessages(messages),



17

stopWhen: isStepCount(5),



18

});



19



20

return createUIMessageStreamResponse({



21

stream: toUIMessageStream({ stream: result.stream }),



22

});



23

}
```

This API route uses the `streamText` function to process chat messages and stream the model's responses back to the client.

### [Create a Tool](#create-a-tool)

Before enhancing your chat interface with dynamic UI elements, you need to create a tool and corresponding React component. A tool will allow the model to perform a specific action, such as fetching weather information.

Create a new file called `ai/tools.ts` with the following content:

ai/tools.ts

```
1

import { tool as createTool } from 'ai';



2

import { z } from 'zod';



3



4

export const weatherTool = createTool({



5

description: 'Display the weather for a location',



6

inputSchema: z.object({



7

location: z.string().describe('The location to get the weather for'),



8

}),



9

execute: async function ({ location }) {



10

await new Promise(resolve => setTimeout(resolve, 2000));



11

return { weather: 'Sunny', temperature: 75, location };



12

},



13

});



14



15

export const tools = {



16

displayWeather: weatherTool,



17

};
```

In this file, you've created a tool called `weatherTool`. This tool simulates fetching weather information for a given location. This tool will return simulated data after a 2-second delay. In a real-world application, you would replace this simulation with an actual API call to a weather service.

### [Update the API Route](#update-the-api-route)

Update the API route to include the tool you've defined:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/chat/route.ts

```
1

import {



2

convertToModelMessages,



3

createUIMessageStreamResponse,



4

isStepCount,



5

streamText,



6

toUIMessageStream,



7

UIMessage,



8

} from 'ai';



9

import { tools } from '@/ai/tools';



10



11

export async function POST(request: Request) {



12

const { messages }: { messages: UIMessage[] } = await request.json();



13



14

const result = streamText({



15

model: "xai/grok-4.6",



16

instructions: 'You are a friendly assistant!',



17

messages: await convertToModelMessages(messages),



18

stopWhen: isStepCount(5),



19

tools,



20

});



21



22

return createUIMessageStreamResponse({



23

stream: toUIMessageStream({ stream: result.stream }),



24

});



25

}
```

Now that you've defined the tool and added it to your `streamText` call, let's build a React component to display the weather information it returns.

### [Create UI Components](#create-ui-components)

Create a new file called `components/weather.tsx`:

components/weather.tsx

```
1

type WeatherProps = {



2

temperature: number;



3

weather: string;



4

location: string;



5

};



6



7

export const Weather = ({ temperature, weather, location }: WeatherProps) => {



8

return (



9

<div>



10

<h2>Current Weather for {location}</h2>



11

<p>Condition: {weather}</p>



12

<p>Temperature: {temperature}°C</p>



13

</div>



14

);



15

};
```

This component will display the weather information for a given location. It takes three props: `temperature`, `weather`, and `location` (exactly what the `weatherTool` returns).

### [Render the Weather Component](#render-the-weather-component)

Now that you have your tool and corresponding React component, let's integrate them into your chat interface. You'll render the Weather component when the model calls the weather tool.

To check if the model has called a tool, you can check the `parts` array of the UIMessage object for tool-specific parts. In AI SDK 5.0, tool parts use typed naming: `tool-${toolName}` instead of generic types.

Update your `page.tsx` file:

app/page.tsx

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { useState } from 'react';



5

import { Weather } from '@/components/weather';



6



7

export default function Page() {



8

const [input, setInput] = useState('');



9

const { messages, sendMessage } = useChat();



10



11

const handleSubmit = (e: React.FormEvent) => {



12

e.preventDefault();



13

sendMessage({ text: input });



14

setInput('');



15

};



16



17

return (



18

<div>



19

{messages.map(message => (



20

<div key={message.id}>



21

<div>{message.role === 'user' ? 'User: ' : 'AI: '}</div>



22

<div>



23

{message.parts.map((part, index) => {



24

if (part.type === 'text') {



25

return <span key={index}>{part.text}</span>;



26

}



27



28

if (part.type === 'tool-displayWeather') {



29

switch (part.state) {



30

case 'input-available':



31

return <div key={index}>Loading weather...</div>;



32

case 'output-available':



33

return (



34

<div key={index}>



35

<Weather {...part.output} />



36

</div>



37

);



38

case 'output-error':



39

return <div key={index}>Error: {part.errorText}</div>;



40

default:



41

return null;



42

}



43

}



44



45

return null;



46

})}



47

</div>



48

</div>



49

))}



50



51

<form onSubmit={handleSubmit}>



52

<input



53

value={input}



54

onChange={e => setInput(e.target.value)}



55

placeholder="Type a message..."



56

/>



57

<button type="submit">Send</button>



58

</form>



59

</div>



60

);



61

}
```

In this updated code snippet, you:

1. Use manual input state management with `useState` instead of the built-in `input` and `handleInputChange`.
2. Use `sendMessage` instead of `handleSubmit` to send messages.
3. Check the `parts` array of each message for different content types.
4. Handle tool parts with type `tool-displayWeather` and their different states (`input-available`, `output-available`, `output-error`).

This approach allows you to dynamically render UI components based on the model's responses, creating a more interactive and context-aware chat experience.

[Expanding Your Generative UI Application](#expanding-your-generative-ui-application)
-------------------------------------------------------------------------------------

You can enhance your chat application by adding more tools and components, creating a richer and more versatile user experience. Here's how you can expand your application:

### [Adding More Tools](#adding-more-tools)

To add more tools, simply define them in your `ai/tools.ts` file:

```
1

// Add a new stock tool



2

export const stockTool = createTool({



3

description: 'Get price for a stock',



4

inputSchema: z.object({



5

symbol: z.string().describe('The stock symbol to get the price for'),



6

}),



7

execute: async function ({ symbol }) {



8

// Simulated API call



9

await new Promise(resolve => setTimeout(resolve, 2000));



10

return { symbol, price: 100 };



11

},



12

});



13



14

// Update the tools object



15

export const tools = {



16

displayWeather: weatherTool,



17

getStockPrice: stockTool,



18

};
```

Now, create a new file called `components/stock.tsx`:

```
1

type StockProps = {



2

price: number;



3

symbol: string;



4

};



5



6

export const Stock = ({ price, symbol }: StockProps) => {



7

return (



8

<div>



9

<h2>Stock Information</h2>



10

<p>Symbol: {symbol}</p>



11

<p>Price: ${price}</p>



12

</div>



13

);



14

};
```

Finally, update your `page.tsx` file to include the new Stock component:

```
1

'use client';



2



3

import { useChat } from '@ai-sdk/react';



4

import { useState } from 'react';



5

import { Weather } from '@/components/weather';



6

import { Stock } from '@/components/stock';



7



8

export default function Page() {



9

const [input, setInput] = useState('');



10

const { messages, sendMessage } = useChat();



11



12

const handleSubmit = (e: React.FormEvent) => {



13

e.preventDefault();



14

sendMessage({ text: input });



15

setInput('');



16

};



17



18

return (



19

<div>



20

{messages.map(message => (



21

<div key={message.id}>



22

<div>{message.role}</div>



23

<div>



24

{message.parts.map((part, index) => {



25

if (part.type === 'text') {



26

return <span key={index}>{part.text}</span>;



27

}



28



29

if (part.type === 'tool-displayWeather') {



30

switch (part.state) {



31

case 'input-available':



32

return <div key={index}>Loading weather...</div>;



33

case 'output-available':



34

return (



35

<div key={index}>



36

<Weather {...part.output} />



37

</div>



38

);



39

case 'output-error':



40

return <div key={index}>Error: {part.errorText}</div>;



41

default:



42

return null;



43

}



44

}



45



46

if (part.type === 'tool-getStockPrice') {



47

switch (part.state) {



48

case 'input-available':



49

return <div key={index}>Loading stock price...</div>;



50

case 'output-available':



51

return (



52

<div key={index}>



53

<Stock {...part.output} />



54

</div>



55

);



56

case 'output-error':



57

return <div key={index}>Error: {part.errorText}</div>;



58

default:



59

return null;



60

}



61

}



62



63

return null;



64

})}



65

</div>



66

</div>



67

))}



68



69

<form onSubmit={handleSubmit}>



70

<input



71

type="text"



72

value={input}



73

onChange={e => setInput(e.target.value)}



74

/>



75

<button type="submit">Send</button>



76

</form>



77

</div>



78

);



79

}
```

By following this pattern, you can continue to add more tools and components, expanding the capabilities of your Generative UI application.

[Previous

Chatbot Tool Usage](/docs/ai-sdk-ui/chatbot-tool-usage)[Next

Completion](/docs/ai-sdk-ui/completion)
