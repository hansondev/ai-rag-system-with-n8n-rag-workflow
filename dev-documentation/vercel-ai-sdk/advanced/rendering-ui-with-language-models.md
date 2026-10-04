---
title: "Rendering User Interfaces with Language Models"
source_url: https://ai-sdk.dev/docs/advanced/rendering-ui-with-language-models
section: advanced
crawled: 2026-09-20
---

# Rendering User Interfaces with Language Models

> Source: https://ai-sdk.dev/docs/advanced/rendering-ui-with-language-models

[Advanced](/docs/advanced)Rendering UI with Language Models


[Rendering User Interfaces with Language Models](#rendering-user-interfaces-with-language-models)
=================================================================================================

Language models generate text, so at first it may seem like you would only need to render text in your application.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/actions.tsx

```
1

const text = generateText({



2

model: "xai/grok-4.6",



3

instructions: 'You are a friendly assistant',



4

prompt: 'What is the weather in SF?',



5

tools: {



6

getWeather: {



7

description: 'Get the weather for a location',



8

inputSchema: z.object({



9

city: z.string().describe('The city to get the weather for'),



10

unit: z



11

.enum(['C', 'F'])



12

.describe('The unit to display the temperature in'),



13

}),



14

execute: async ({ city, unit }) => {



15

const weather = getWeather({ city, unit });



16

return `It is currently ${weather.value}°${unit} and ${weather.description} in ${city}!`;



17

},



18

},



19

},



20

});
```

Above, the language model is passed a [tool](/docs/ai-sdk-core/tools-and-tool-calling) called `getWeather` that returns the weather information as text. However, instead of returning text, if you return a JSON object that represents the weather information, you can use it to render a React component instead.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/action.ts

```
1

const text = generateText({



2

model: "xai/grok-4.6",



3

instructions: 'You are a friendly assistant',



4

prompt: 'What is the weather in SF?',



5

tools: {



6

getWeather: {



7

description: 'Get the weather for a location',



8

inputSchema: z.object({



9

city: z.string().describe('The city to get the weather for'),



10

unit: z



11

.enum(['C', 'F'])



12

.describe('The unit to display the temperature in'),



13

}),



14

execute: async ({ city, unit }) => {



15

const weather = getWeather({ city, unit });



16

const { temperature, unit, description, forecast } = weather;



17



18

return {



19

temperature,



20

unit,



21

description,



22

forecast,



23

};



24

},



25

},



26

},



27

});
```

Now you can use the object returned by the `getWeather` function to conditionally render a React component `<WeatherCard/>` that displays the weather information by passing the object as props.

app/page.tsx

```
1

return (



2

<div>



3

{messages.map(message => {



4

// Check assistant message parts for tool results



5

if (message.role === 'assistant') {



6

return message.parts.map(part => {



7

if (



8

part.type === 'tool-weather' &&



9

part.state === 'output-available'



10

) {



11

const { temperature, unit, description, forecast } = part.output;



12



13

return (



14

<WeatherCard



15

weather={{



16

temperature,



17

unit,



18

description,



19

forecast,



20

}}



21

/>



22

);



23

}



24

});



25

}



26

})}



27

</div>



28

);
```

Here's a little preview of what that might look like.

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

Weather

An example of an assistant that renders the weather information in a streamed component.

Rendering interfaces as part of language model generations elevates the user experience of your application, allowing people to interact with language models beyond text.

They also make it easier for you to interpret [sequential tool calls](/docs/ai-sdk-rsc/multistep-interfaces) that take place in multiple steps and help identify and debug where the model reasoned incorrectly.

[Rendering Multiple User Interfaces](#rendering-multiple-user-interfaces)
-------------------------------------------------------------------------

To recap, an application has to go through the following steps to render user interfaces as part of model generations:

1. The user prompts the language model.
2. The language model generates a response that includes a tool call.
3. The tool call returns a JSON object that represents the user interface.
4. The response is sent to the client.
5. The client receives the response and checks if the latest message was a tool call.
6. If it was a tool call, the client renders the user interface based on the JSON object returned by the tool call.

Most applications have multiple tools that are called by the language model, and each tool can return a different user interface.

For example, a tool that searches for courses can return a list of courses, while a tool that searches for people can return a list of people. As this list grows, the complexity of your application will grow as well and it can become increasingly difficult to manage these user interfaces.

app/page.tsx

```
1

{



2

message.parts.map(part => {



3

if (part.state !== 'output-available') return null;



4



5

switch (part.type) {



6

case 'tool-api-search-course':



7

return <Courses courses={part.output} />;



8

case 'tool-api-search-profile':



9

return <People people={part.output} />;



10

case 'tool-api-meetings':



11

return <Meetings meetings={part.output} />;



12

case 'tool-api-search-building':



13

return <Buildings buildings={part.output} />;



14

case 'tool-api-events':



15

return <Events events={part.output} />;



16

case 'tool-api-meals':



17

return <Meals meals={part.output} />;



18

case 'text':



19

return <div>{part.text}</div>;



20

default:



21

return null;



22

}



23

});



24

}
```

[Rendering User Interfaces on the Server](#rendering-user-interfaces-on-the-server)
-----------------------------------------------------------------------------------

The **AI SDK RSC (`@ai-sdk/rsc`)** takes advantage of RSCs to solve the problem of managing all your React components on the client side, allowing you to render React components on the server and stream them to the client.

Rather than conditionally rendering user interfaces on the client based on the data returned by the language model, you can directly stream them from the server during a model generation.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/action.ts

```
1

import { createStreamableUI } from '@ai-sdk/rsc'



2



3

const uiStream = createStreamableUI();



4



5

const text = generateText({



6

model: "xai/grok-4.6",



7

instructions: 'you are a friendly assistant'



8

prompt: 'what is the weather in SF?'



9

tools: {



10

getWeather: {



11

description: 'Get the weather for a location',



12

inputSchema: z.object({



13

city: z.string().describe('The city to get the weather for'),



14

unit: z



15

.enum(['C', 'F'])



16

.describe('The unit to display the temperature in')



17

}),



18

execute: async ({ city, unit }) => {



19

const weather = getWeather({ city, unit })



20

const { temperature, unit, description, forecast } = weather



21



22

uiStream.done(



23

<WeatherCard



24

weather={{



25

temperature: 47,



26

unit: 'F',



27

description: 'sunny'



28

forecast,



29

}}



30

/>



31

)



32

}



33

}



34

}



35

})



36



37

return {



38

display: uiStream.value



39

}
```

The [`createStreamableUI`](/docs/reference/ai-sdk-rsc/create-streamable-ui) function belongs to the `@ai-sdk/rsc` module and creates a stream that can send React components to the client.

On the server, you render the `<WeatherCard/>` component with the props passed to it, and then stream it to the client. On the client side, you only need to render the UI that is streamed from the server.

app/page.tsx

```
1

return (



2

<div>



3

{messages.map(message => (



4

<div>{message.display}</div>



5

))}



6

</div>



7

);
```

Now the steps involved are simplified:

1. The user prompts the language model.
2. The language model generates a response that includes a tool call.
3. The tool call renders a React component along with relevant props that represent the user interface.
4. The response is streamed to the client and rendered directly.

> **Note:** You can also render text on the server and stream it to the client using React Server Components. This way, all operations from language model generation to UI rendering can be done on the server, while the client only needs to render the UI that is streamed from the server.

Check out this [example](/examples/next-app/interface/stream-component-updates) for a full illustration of how to stream component updates with React Server Components in Next.js App Router.

[Previous

Rate Limiting](/docs/advanced/rate-limiting)[Next

Language Models as Routers](/docs/advanced/model-as-router)
