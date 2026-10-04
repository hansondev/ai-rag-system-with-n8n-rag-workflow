---
title: "Authentication"
source_url: https://ai-sdk.dev/docs/ai-sdk-rsc/authentication
section: ai-sdk-rsc
crawled: 2026-09-20
---

# Authentication

> Source: https://ai-sdk.dev/docs/ai-sdk-rsc/authentication

[AI SDK RSC](/docs/ai-sdk-rsc)Handling Authentication


[Authentication](#authentication)
=================================

AI SDK RSC is currently experimental. We recommend using [AI SDK
UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).

The RSC API makes extensive use of [`Server Actions`](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) to power streaming values and UI from the server.

Server Actions are exposed as public, unprotected endpoints. As a result, you should treat Server Actions as you would public-facing API endpoints and ensure that the user is authorized to perform the action before returning any data.

app/actions.tsx

```
1

'use server';



2



3

import { cookies } from 'next/headers';



4

import { createStreamableUI } from '@ai-sdk/rsc';



5

import { validateToken } from '../utils/auth';



6



7

export const getWeather = async () => {



8

const token = cookies().get('token');



9



10

if (!token || !validateToken(token)) {



11

return {



12

error: 'This action requires authentication',



13

};



14

}



15

const streamableDisplay = createStreamableUI(null);



16



17

streamableDisplay.update(<Skeleton />);



18

streamableDisplay.done(<Weather />);



19



20

return {



21

display: streamableDisplay.value,



22

};



23

};
```

[Previous

Error Handling](/docs/ai-sdk-rsc/error-handling)[Next

Migrating from RSC to UI](/docs/ai-sdk-rsc/migrating-to-ui)
