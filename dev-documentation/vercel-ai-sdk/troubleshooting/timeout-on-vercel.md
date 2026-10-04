---
title: "Getting Timeouts When Deploying on Vercel"
source_url: https://ai-sdk.dev/docs/troubleshooting/timeout-on-vercel
section: troubleshooting
crawled: 2026-09-20
---

# Getting Timeouts When Deploying on Vercel

> Source: https://ai-sdk.dev/docs/troubleshooting/timeout-on-vercel

[Troubleshooting](/docs/troubleshooting)Getting Timeouts When Deploying on Vercel


[Getting Timeouts When Deploying on Vercel](#getting-timeouts-when-deploying-on-vercel)
=======================================================================================

[Issue](#issue)
---------------

Streaming with the AI SDK works in my local development environment.
However, when I'm deploying to Vercel, longer responses get chopped off in the UI and I'm seeing timeouts in the Vercel logs or I'm seeing the error: `Uncaught (in promise) Error: Connection closed`.

[Solution](#solution)
---------------------

With Vercel's [Fluid Compute](https://vercel.com/docs/fluid-compute), the default function duration is now **5 minutes (300 seconds)** across all plans. This should be sufficient for most streaming applications.

If you need to extend the timeout for longer-running processes, you can increase the `maxDuration` setting:

### [Next.js (App Router)](#nextjs-app-router)

Add the following to your route file or the page you are calling your Server Action from:

```
1

export const maxDuration = 600;
```

Setting `maxDuration` above 300 seconds requires a Pro or Enterprise plan.

### [Other Frameworks](#other-frameworks)

For other frameworks, you can set timeouts in your `vercel.json` file:

```
1

{



2

"functions": {



3

"api/chat/route.ts": {



4

"maxDuration": 600



5

}



6

}



7

}
```

Setting `maxDuration` above 300 seconds requires a Pro or Enterprise plan.

### [Maximum Duration Limits](#maximum-duration-limits)

The maximum duration you can set depends on your Vercel plan:

* **Hobby**: Up to 300 seconds (5 minutes)
* **Pro**: Up to 800 seconds (~13 minutes)
* **Enterprise**: Up to 800 seconds (~13 minutes)

[Learn more](#learn-more)
-------------------------

* [Fluid Compute Default Settings](https://vercel.com/docs/fluid-compute#default-settings-by-plan)
* [Configuring Maximum Duration for Vercel Functions](https://vercel.com/docs/functions/configuring-functions/duration)

[Previous

Streaming Not Working When Proxied](/docs/troubleshooting/streaming-not-working-when-proxied)[Next

Unclosed Streams](/docs/troubleshooting/unclosed-streams)
