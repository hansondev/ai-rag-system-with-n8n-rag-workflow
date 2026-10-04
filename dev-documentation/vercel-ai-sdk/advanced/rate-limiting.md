---
title: "Rate Limiting"
source_url: https://ai-sdk.dev/docs/advanced/rate-limiting
section: advanced
crawled: 2026-09-20
---

# Rate Limiting

> Source: https://ai-sdk.dev/docs/advanced/rate-limiting

[Advanced](/docs/advanced)Rate Limiting


[Rate Limiting](#rate-limiting)
===============================

Rate limiting helps you protect your APIs from abuse. It involves setting a
maximum threshold on the number of requests a client can make within a
specified timeframe. This simple technique acts as a gatekeeper,
preventing excessive usage that can degrade service performance and incur
unnecessary costs.

[Rate Limiting with Upstash Redis and Upstash Ratelimit](#rate-limiting-with-upstash-redis-and-upstash-ratelimit)
-----------------------------------------------------------------------------------------------------------------

In this example, you will protect an API endpoint using [Upstash Redis](https://upstash.com/redis) and [Upstash Ratelimit](https://github.com/upstash/ratelimit).

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

app/api/generate/route.ts

```
1

import {



2

createUIMessageStreamResponse,



3

streamText,



4

toUIMessageStream,



5

} from 'ai';



6

import { Ratelimit } from '@upstash/ratelimit';



7

import { Redis } from '@upstash/redis';



8

import { NextRequest } from 'next/server';



9



10

// Allow streaming responses up to 30 seconds



11

export const maxDuration = 30;



12



13

// Create Rate limit



14

const ratelimit = new Ratelimit({



15

redis: Redis.fromEnv(),



16

limiter: Ratelimit.fixedWindow(5, '30s'),



17

});



18



19

export async function POST(req: NextRequest) {



20

// call ratelimit with request ip



21

const ip = req.ip ?? 'ip';



22

const { success, remaining } = await ratelimit.limit(ip);



23



24

// block the request if unsuccessful



25

if (!success) {



26

return new Response('Ratelimited!', { status: 429 });



27

}



28



29

const { messages } = await req.json();



30



31

const result = streamText({



32

model: "xai/grok-4.6",



33

messages,



34

});



35



36

return createUIMessageStreamResponse({



37

stream: toUIMessageStream({ stream: result.stream }),



38

});



39

}
```

[Simplify API Protection](#simplify-api-protection)
---------------------------------------------------

With Upstash Redis and Upstash Ratelimit, it is possible to protect your APIs
from such attacks with ease. To learn more about how Ratelimit works and
how it can be configured to your needs, see [Ratelimit Documentation](https://upstash.com/docs/oss/sdks/ts/ratelimit/overview).

[Previous

Multiple Streamables](/docs/advanced/multiple-streamables)[Next

Rendering UI with Language Models](/docs/advanced/rendering-ui-with-language-models)
