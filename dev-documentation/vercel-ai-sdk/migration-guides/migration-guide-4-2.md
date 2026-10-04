---
title: "Migrate AI SDK 4.1 to 4.2"
source_url: https://ai-sdk.dev/docs/migration-guides/migration-guide-4-2
section: migration-guides
crawled: 2026-09-20
---

# Migrate AI SDK 4.1 to 4.2

> Source: https://ai-sdk.dev/docs/migration-guides/migration-guide-4-2

[Migration Guides](/docs/migration-guides)Migrate AI SDK 4.1 to 4.2


[Migrate AI SDK 4.1 to 4.2](#migrate-ai-sdk-41-to-42)
=====================================================

Check out the [AI SDK 4.2 release blog
post](https://vercel.com/blog/ai-sdk-4-2) for more information about the
release.

This guide will help you upgrade to AI SDK 4.2:

[Stable APIs](#stable-apis)
---------------------------

The following APIs have been moved to stable and no longer have the `experimental_` prefix:

* `customProvider`
* `providerOptions` (renamed from `providerMetadata` for provider-specific inputs)
* `providerMetadata` (for provider-specific outputs)
* `toolCallStreaming` option for `streamText`

[Dependency Versions](#dependency-versions)
-------------------------------------------

AI SDK requires a non-optional `zod` dependency with version `^3.23.8`.

[UI Message Parts](#ui-message-parts)
-------------------------------------

In AI SDK 4.2, we've redesigned how `useChat` handles model outputs with message parts and multiple steps.
This is a significant improvement that simplifies rendering complex, multi-modal AI responses in your UI.

### [What's Changed](#whats-changed)

Assistant messages with tool calling now get combined into a single message with multiple parts, rather than creating separate messages for each step.
This change addresses two key developments in AI applications:

1. **Diverse Output Types**: Models now generate more than just text; they produce reasoning steps, sources, and tool calls.
2. **Interleaved Outputs**: In multi-step agent use-cases, these different output types are frequently interleaved.

### [Benefits of the New Approach](#benefits-of-the-new-approach)

Previously, `useChat` stored different output types separately, which made it challenging to maintain the correct sequence in your UI when these elements were interleaved in a response,
and led to multiple consecutive assistant messages when there were tool calls. For example:

```
1

message.content = "Final answer: 42";



2

message.reasoning = "First I'll calculate X, then Y...";



3

message.toolInvocations = [{toolName: "calculator", args: {...}}];
```

This structure was limiting. The new message parts approach replaces separate properties with an ordered array that preserves the exact sequence:

```
1

message.parts = [



2

{ type: "text", text: "Final answer: 42" },



3

{ type: "reasoning", reasoning: "First I'll calculate X, then Y..." },



4

{ type: "tool-invocation", toolInvocation: { toolName: "calculator", args: {...} } },



5

];
```

### [Migration](#migration)

Existing applications using the previous message format will need to update their UI components to handle the new `parts` array.
The fields from the previous format are still available for backward compatibility, but we recommend migrating to the new format for better support of multi-modal and multi-step interactions.

You can use the `useChat` hook with the new message parts as follows:

```
1

function Chat() {



2

const { messages } = useChat();



3

return (



4

<div>



5

{messages.map(message =>



6

message.parts.map((part, i) => {



7

switch (part.type) {



8

case 'text':



9

return <p key={i}>{part.text}</p>;



10

case 'source':



11

return <p key={i}>{part.source.url}</p>;



12

case 'reasoning':



13

return <div key={i}>{part.reasoning}</div>;



14

case 'tool-invocation':



15

return <div key={i}>{part.toolInvocation.toolName}</div>;



16

case 'file':



17

return (



18

<img



19

key={i}



20

src={`data:${part.mediaType};base64,${part.data}`}



21

/>



22

);



23

}



24

}),



25

)}



26

</div>



27

);



28

}
```

[Previous

Migrate AI SDK 4.x to 5.0](/docs/migration-guides/migration-guide-5-0)[Next

Migrate AI SDK 4.0 to 4.1](/docs/migration-guides/migration-guide-4-1)
