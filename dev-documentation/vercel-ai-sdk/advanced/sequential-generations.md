---
title: "Sequential Generations"
source_url: https://ai-sdk.dev/docs/advanced/sequential-generations
section: advanced
crawled: 2026-09-20
---

# Sequential Generations

> Source: https://ai-sdk.dev/docs/advanced/sequential-generations

[Advanced](/docs/advanced)Sequential Generations


[Sequential Generations](#sequential-generations)
=================================================

When working with the AI SDK, you may want to create sequences of generations (often referred to as "chains" or "pipes"), where the output of one becomes the input for the next. This can be useful for creating more complex AI-powered workflows or for breaking down larger tasks into smaller, more manageable steps.

[Example](#example)
-------------------

In a sequential chain, the output of one generation is directly used as input for the next generation. This allows you to create a series of dependent generations, where each step builds upon the previous one.

Here's an example of how you can implement sequential actions:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText } from 'ai';



2



3

async function sequentialActions() {



4

// Generate blog post ideas



5

const ideasGeneration = await generateText({



6

model: "xai/grok-4.6",



7

prompt: 'Generate 10 ideas for a blog post about making spaghetti.',



8

});



9



10

console.log('Generated Ideas:\n', ideasGeneration);



11



12

// Pick the best idea



13

const bestIdeaGeneration = await generateText({



14

model: "xai/grok-4.6",



15

prompt: `Here are some blog post ideas about making spaghetti:



16

${ideasGeneration}



17



18

Pick the best idea from the list above and explain why it's the best.`,



19

});



20



21

console.log('\nBest Idea:\n', bestIdeaGeneration);



22



23

// Generate an outline



24

const outlineGeneration = await generateText({



25

model: "xai/grok-4.6",



26

prompt: `We've chosen the following blog post idea about making spaghetti:



27

${bestIdeaGeneration}



28



29

Create a detailed outline for a blog post based on this idea.`,



30

});



31



32

console.log('\nBlog Post Outline:\n', outlineGeneration);



33

}



34



35

sequentialActions().catch(console.error);
```

In this example, we first generate ideas for a blog post, then pick the best idea, and finally create an outline based on that idea. Each step uses the output from the previous step as input for the next generation.

[Previous

Multistep Interfaces](/docs/advanced/multistep-interfaces)[Next

Vercel Deployment Guide](/docs/advanced/vercel-deployment-guide)
