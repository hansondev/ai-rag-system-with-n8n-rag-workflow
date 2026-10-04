---
title: "Saving and Restoring States"
source_url: https://ai-sdk.dev/docs/ai-sdk-rsc/saving-and-restoring-states
section: ai-sdk-rsc
crawled: 2026-09-20
---

# Saving and Restoring States

> Source: https://ai-sdk.dev/docs/ai-sdk-rsc/saving-and-restoring-states

[AI SDK RSC](/docs/ai-sdk-rsc)Saving and Restoring States


[Saving and Restoring States](#saving-and-restoring-states)
===========================================================

AI SDK RSC is currently experimental. We recommend using [AI SDK
UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).

AI SDK RSC provides convenient methods for saving and restoring AI and UI state. This is useful for saving the state of your application after every model generation, and restoring it when the user revisits the generations.

[AI State](#ai-state)
---------------------

### [Saving AI state](#saving-ai-state)

The AI state can be saved using the [`onSetAIState`](/docs/reference/ai-sdk-rsc/create-ai#on-set-ai-state) callback, which gets called whenever the AI state is updated. In the following example, you save the chat history to a database whenever the generation is marked as done.

app/ai.ts

```
1

export const AI = createAI<ServerMessage[], ClientMessage[]>({



2

actions: {



3

continueConversation,



4

},



5

onSetAIState: async ({ state, done }) => {



6

'use server';



7



8

if (done) {



9

saveChatToDB(state);



10

}



11

},



12

});
```

### [Restoring AI state](#restoring-ai-state)

The AI state can be restored using the [`initialAIState`](/docs/reference/ai-sdk-rsc/create-ai#initial-ai-state) prop passed to the context provider created by the [`createAI`](/docs/reference/ai-sdk-rsc/create-ai) function. In the following example, you restore the chat history from a database when the component is mounted.

```
1

import { ReactNode } from 'react';



2

import { AI } from './ai';



3



4

export default async function RootLayout({



5

children,



6

}: Readonly<{ children: ReactNode }>) {



7

const chat = await loadChatFromDB();



8



9

return (



10

<html lang="en">



11

<body>



12

<AI initialAIState={chat}>{children}</AI>



13

</body>



14

</html>



15

);



16

}
```

[UI State](#ui-state)
---------------------

### [Saving UI state](#saving-ui-state)

The UI state cannot be saved directly, since the contents aren't yet serializable. Instead, you can use the AI state as proxy to store details about the UI state and use it to restore the UI state when needed.

### [Restoring UI state](#restoring-ui-state)

The UI state can be restored using the AI state as a proxy. In the following example, you restore the chat history from the AI state when the component is mounted. You use the [`onGetUIState`](/docs/reference/ai-sdk-rsc/create-ai#on-get-ui-state) callback to listen for SSR events and restore the UI state.

app/ai.ts

```
1

export const AI = createAI<ServerMessage[], ClientMessage[]>({



2

actions: {



3

continueConversation,



4

},



5

onGetUIState: async () => {



6

'use server';



7



8

const historyFromDB: ServerMessage[] = await loadChatFromDB();



9

const historyFromApp: ServerMessage[] = getAIState();



10



11

// If the history from the database is different from the



12

// history in the app, they're not in sync so return the UIState



13

// based on the history from the database



14



15

if (historyFromDB.length !== historyFromApp.length) {



16

return historyFromDB.map(({ role, content }) => ({



17

id: generateId(),



18

role,



19

display:



20

role === 'function' ? (



21

<Component {...JSON.parse(content)} />



22

) : (



23

content



24

),



25

}));



26

}



27

},



28

});
```

To learn more, check out this [example](/examples/next-app/state-management/save-and-restore-states) that persists and restores states in your Next.js application.

---

Next, you will learn how you can use `@ai-sdk/rsc` functions like `useActions` and `useUIState` to create interactive, multistep interfaces.

[Previous

Managing Generative UI State](/docs/ai-sdk-rsc/generative-ui-state)[Next

Multistep Interfaces](/docs/ai-sdk-rsc/multistep-interfaces)
