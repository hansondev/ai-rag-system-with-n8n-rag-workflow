---
title: "Designing Multistep Interfaces"
source_url: https://ai-sdk.dev/docs/ai-sdk-rsc/multistep-interfaces
section: ai-sdk-rsc
crawled: 2026-09-20
---

# Designing Multistep Interfaces

> Source: https://ai-sdk.dev/docs/ai-sdk-rsc/multistep-interfaces

[AI SDK RSC](/docs/ai-sdk-rsc)Multistep Interfaces


[Designing Multistep Interfaces](#designing-multistep-interfaces)
=================================================================

AI SDK RSC is currently experimental. We recommend using [AI SDK
UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).

Multistep interfaces refer to user interfaces that require multiple independent steps to be executed in order to complete a specific task.

For example, if you wanted to build a Generative UI chatbot capable of booking flights, it could have three steps:

* Search all flights
* Pick flight
* Check availability

To build this kind of application you will leverage two concepts, **tool composition** and **application context**.

**Tool composition** is the process of combining multiple [tools](/docs/ai-sdk-core/tools-and-tool-calling) to create a new tool. This is a powerful concept that allows you to break down complex tasks into smaller, more manageable steps. In the example above, *"search all flights"*, *"pick flight"*, and *"check availability"* come together to create a holistic *"book flight"* tool.

**Application context** refers to the state of the application at any given point in time. This includes the user's input, the output of the language model, and any other relevant information. In the example above, the flight selected in *"pick flight"* would be used as context necessary to complete the *"check availability"* task.

[Overview](#overview)
---------------------

In order to build a multistep interface with `@ai-sdk/rsc`, you will need a few things:

* A Server Action that calls and returns the result from the `streamUI` function
* Tool(s) (sub-tasks necessary to complete your overall task)
* React component(s) that should be rendered when the tool is called
* A page to render your chatbot

The general flow that you will follow is:

* User sends a message (calls your Server Action with `useActions`, passing the message as an input)
* Message is appended to the AI State and then passed to the model alongside a number of tools
* Model can decide to call a tool, which will render the `<SomeTool />` component
* Within that component, you can add interactivity by using `useActions` to call the model with your Server Action and `useUIState` to append the model's response (`<SomeOtherTool />`) to the UI State
* And so on...

[Implementation](#implementation)
---------------------------------

The turn-by-turn implementation is the simplest form of multistep interfaces. In this implementation, the user and the model take turns during the conversation. For every user input, the model generates a response, and the conversation continues in this turn-by-turn fashion.

In the following example, you specify two tools (`searchFlights` and `lookupFlight`) that the model can use to search for flights and lookup details for a specific flight.

app/actions.tsx

```
1

import { streamUI } from '@ai-sdk/rsc';



2

import { openai } from '@ai-sdk/openai';



3

import { z } from 'zod';



4



5

const searchFlights = async (



6

source: string,



7

destination: string,



8

date: string,



9

) => {



10

return [



11

{



12

id: '1',



13

flightNumber: 'AA123',



14

},



15

{



16

id: '2',



17

flightNumber: 'AA456',



18

},



19

];



20

};



21



22

const lookupFlight = async (flightNumber: string) => {



23

return {



24

flightNumber: flightNumber,



25

departureTime: '10:00 AM',



26

arrivalTime: '12:00 PM',



27

};



28

};



29



30

export async function submitUserMessage(input: string) {



31

'use server';



32



33

const ui = await streamUI({



34

model: openai('gpt-4o'),



35

instructions: 'you are a flight booking assistant',



36

prompt: input,



37

text: async ({ content }) => <div>{content}</div>,



38

tools: {



39

searchFlights: {



40

description: 'search for flights',



41

inputSchema: z.object({



42

source: z.string().describe('The origin of the flight'),



43

destination: z.string().describe('The destination of the flight'),



44

date: z.string().describe('The date of the flight'),



45

}),



46

generate: async function* ({ source, destination, date }) {



47

yield `Searching for flights from ${source} to ${destination} on ${date}...`;



48

const results = await searchFlights(source, destination, date);



49



50

return (



51

<div>



52

{results.map(result => (



53

<div key={result.id}>



54

<div>{result.flightNumber}</div>



55

</div>



56

))}



57

</div>



58

);



59

},



60

},



61

lookupFlight: {



62

description: 'lookup details for a flight',



63

inputSchema: z.object({



64

flightNumber: z.string().describe('The flight number'),



65

}),



66

generate: async function* ({ flightNumber }) {



67

yield `Looking up details for flight ${flightNumber}...`;



68

const details = await lookupFlight(flightNumber);



69



70

return (



71

<div>



72

<div>Flight Number: {details.flightNumber}</div>



73

<div>Departure Time: {details.departureTime}</div>



74

<div>Arrival Time: {details.arrivalTime}</div>



75

</div>



76

);



77

},



78

},



79

},



80

});



81



82

return ui.value;



83

}
```

Next, create an AI context that will hold the UI State and AI State.

app/ai.ts

```
1

import { createAI } from '@ai-sdk/rsc';



2

import { submitUserMessage } from './actions';



3



4

export const AI = createAI<any[], React.ReactNode[]>({



5

initialUIState: [],



6

initialAIState: [],



7

actions: {



8

submitUserMessage,



9

},



10

});
```

Next, wrap your application with your newly created context.

app/layout.tsx

```
1

import { type ReactNode } from 'react';



2

import { AI } from './ai';



3



4

export default function RootLayout({



5

children,



6

}: Readonly<{ children: ReactNode }>) {



7

return (



8

<AI>



9

<html lang="en">



10

<body>{children}</body>



11

</html>



12

</AI>



13

);



14

}
```

To call your Server Action, update your root page with the following:

app/page.tsx

```
1

'use client';



2



3

import { useState } from 'react';



4

import { AI } from './ai';



5

import { useActions, useUIState } from '@ai-sdk/rsc';



6



7

export default function Page() {



8

const [input, setInput] = useState<string>('');



9

const [conversation, setConversation] = useUIState<typeof AI>();



10

const { submitUserMessage } = useActions();



11



12

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {



13

e.preventDefault();



14

setInput('');



15

setConversation(currentConversation => [



16

...currentConversation,



17

<div>{input}</div>,



18

]);



19

const message = await submitUserMessage(input);



20

setConversation(currentConversation => [...currentConversation, message]);



21

};



22



23

return (



24

<div>



25

<div>



26

{conversation.map((message, i) => (



27

<div key={i}>{message}</div>



28

))}



29

</div>



30

<div>



31

<form onSubmit={handleSubmit}>



32

<input



33

type="text"



34

value={input}



35

onChange={e => setInput(e.target.value)}



36

/>



37

<button>Send Message</button>



38

</form>



39

</div>



40

</div>



41

);



42

}
```

This page pulls in the current UI State using the `useUIState` hook, which is then mapped over and rendered in the UI. To access the Server Action, you use the `useActions` hook which will return all actions that were passed to the `actions` key of the `createAI` function in your `actions.tsx` file. Finally, you call the `submitUserMessage` function like any other TypeScript function. This function returns a React component (`message`) that is then rendered in the UI by updating the UI State with `setConversation`.

In this example, to call the next tool, the user must respond with plain text. **Given you are streaming a React component, you can add a button to trigger the next step in the conversation**.

To add user interaction, you will have to convert the component into a client component and use the `useAction` hook to trigger the next step in the conversation.

components/flights.tsx

```
1

'use client';



2



3

import { useActions, useUIState } from '@ai-sdk/rsc';



4

import { ReactNode } from 'react';



5



6

interface FlightsProps {



7

flights: { id: string; flightNumber: string }[];



8

}



9



10

export const Flights = ({ flights }: FlightsProps) => {



11

const { submitUserMessage } = useActions();



12

const [_, setMessages] = useUIState();



13



14

return (



15

<div>



16

{flights.map(result => (



17

<div key={result.id}>



18

<div



19

onClick={async () => {



20

const display = await submitUserMessage(



21

`lookupFlight ${result.flightNumber}`,



22

);



23



24

setMessages((messages: ReactNode[]) => [...messages, display]);



25

}}



26

>



27

{result.flightNumber}



28

</div>



29

</div>



30

))}



31

</div>



32

);



33

};
```

Now, update your `searchFlights` tool to render the new `<Flights />` component.

actions.tsx

```
1

...



2

searchFlights: {



3

description: 'search for flights',



4

inputSchema: z.object({



5

source: z.string().describe('The origin of the flight'),



6

destination: z.string().describe('The destination of the flight'),



7

date: z.string().describe('The date of the flight'),



8

}),



9

generate: async function* ({ source, destination, date }) {



10

yield `Searching for flights from ${source} to ${destination} on ${date}...`;



11

const results = await searchFlights(source, destination, date);



12

return (<Flights flights={results} />);



13

},



14

}



15

...
```

In the above example, the `Flights` component is used to display the search results. When the user clicks on a flight number, the `lookupFlight` tool is called with the flight number as a parameter. The `submitUserMessage` action is then called to trigger the next step in the conversation.

Learn more about tool calling in Next.js App Router by checking out examples [here](/examples/next-app/tools).

[Previous

Saving and Restoring States](/docs/ai-sdk-rsc/saving-and-restoring-states)[Next

Streaming Values](/docs/ai-sdk-rsc/streaming-values)
