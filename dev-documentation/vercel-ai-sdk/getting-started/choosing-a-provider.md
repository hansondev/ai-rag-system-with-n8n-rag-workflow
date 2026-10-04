---
title: "Choosing a Provider"
source_url: https://ai-sdk.dev/docs/getting-started/choosing-a-provider
section: getting-started
crawled: 2026-09-20
---

# Choosing a Provider

> Source: https://ai-sdk.dev/docs/getting-started/choosing-a-provider

[Getting Started](/docs/getting-started)Choosing a Provider


[Choosing a Provider](#choosing-a-provider)
===========================================

The AI SDK supports dozens of model providers through [first-party](/providers/ai-sdk-providers), [OpenAI-compatible](/providers/openai-compatible-providers), and [community](/providers/community-providers) packages.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText } from 'ai';



2



3

const { text } = await generateText({



4

model: "xai/grok-4.6",



5

prompt: 'What is love?',



6

});
```

[AI Gateway](#ai-gateway)
-------------------------

The [Vercel AI Gateway](/providers/ai-sdk-providers/ai-gateway) is the fastest way to get started with the AI SDK. Access models from OpenAI, Anthropic, Google, and other providers. Authenticate with [OIDC](https://ai-sdk.dev/providers/ai-sdk-providers/ai-gateway#oidc-authentication-vercel-deployments) or an AI Gateway API key

[Get an API Key](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys%3Futm_source%3Dgateway-models-page%26showCreateKeyModal%3Dtrue&title=Get+Started+with+Vercel+AI+Gateway)

Add your API key to your environment:

.env.local

```
1

AI_GATEWAY_API_KEY=your_api_key_here
```

The AI Gateway is the default [global provider](/docs/ai-sdk-core/provider-management#global-provider-configuration), so you can access models using a simple string:

```
1

import { generateText } from 'ai';



2



3

const { text } = await generateText({



4

model: 'anthropic/claude-sonnet-4.5',



5

prompt: 'What is love?',



6

});
```

You can also explicitly import and use the gateway provider:

```
1

// Option 1: Import from 'ai' package (included by default)



2

import { gateway } from 'ai';



3

model: gateway('anthropic/claude-sonnet-4.5');



4



5

// Option 2: Install and import from '@ai-sdk/gateway' package



6

import { gateway } from '@ai-sdk/gateway';



7

model: gateway('anthropic/claude-sonnet-4.5');
```

[Using Dedicated Providers](#using-dedicated-providers)
-------------------------------------------------------

You can also use [first-party](/providers/ai-sdk-providers), [OpenAI-compatible](/providers/openai-compatible-providers), and [community](/providers/community-providers) provider packages directly. Install the package and create a provider instance. For example, to use Anthropic:

pnpmnpmbunyarn

```
pnpm add @ai-sdk/anthropic
```

```
1

import { anthropic } from '@ai-sdk/anthropic';



2



3

model: anthropic('claude-sonnet-4-5');
```

You can change the default global provider so string model references use your preferred provider everywhere in your application. Learn more about [provider management](/docs/ai-sdk-core/provider-management#global-provider-configuration).

See [available providers](/providers/ai-sdk-providers) for setup instructions for each provider.

[Custom Providers](#custom-providers)
-------------------------------------

You can build your own provider to integrate any service with the AI SDK. The AI SDK provides a [Language Model Specification](https://github.com/vercel/ai/tree/main/packages/provider/src/language-model/v3) that ensures compatibility across providers.

```
1

import { generateText } from 'ai';



2

import { yourProvider } from 'your-custom-provider';



3



4

const { text } = await generateText({



5

model: yourProvider('your-model-id'),



6

prompt: 'What is love?',



7

});
```

See [Writing a Custom Provider](/providers/community-providers/custom-providers) for a complete guide.

[Previous

Getting Started](/docs/getting-started)[Next

Navigating the Library](/docs/getting-started/navigating-the-library)
