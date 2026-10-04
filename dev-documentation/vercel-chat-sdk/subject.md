---
title: "Message Subject"
source_url: https://chat-sdk.dev/docs/subject
section: subject
crawled: 2026-09-20
---

# Message Subject

> Source: https://chat-sdk.dev/docs/subject

When your bot receives a comment on a Linear issue, GitHub PR, or Notion page, `message.subject` resolves the parent resource so your handler knows what the conversation is about.

[Usage](#usage)
---------------

lib/bot.ts

```
bot.onNewMention(async (thread, message) => {
  const subject = await message.subject;

  if (subject) {
    await thread.post(
      `This is about: ${subject.title} (${subject.status})\n${subject.url}`
    );
  }
});
```

On Linear, GitHub, and Notion, comment webhooks deliver the comment text but not the full parent resource — `message.subject` fetches it from the platform API on first access. The result is cached on the message instance. On chat platforms (which have no parent-resource concept), or if the API call fails, it returns `null`.

See [`MessageSubject`](/docs/api/message#messagesubject) for the full type shape.

### [Platform support](#platform-support)

| Platform | `message.subject` returns |
| --- | --- |
| Linear | Parent issue (from comment webhooks) |
| GitHub | Parent issue or PR (from comment webhooks) |
| Notion | Parent page (from comment webhooks) |

All other platforms return `null`.

[User info](#user-info)
-----------------------

For user profile details, use [`bot.getUser`](/docs/api/chat#getuser):

lib/bot.ts

```
bot.onNewMention(async (thread, message) => {
  const user = await bot.getUser(message.author);
  if (user) {
    await thread.post(`Hi ${user.fullName} (${user.email})`);
  }
});
```

For anything beyond `message.subject`, access the platform's typed API client via [`bot.getAdapter("github").octokit`](/docs/api/chat#getadapter) or [`bot.getAdapter("linear").linearClient`](/docs/api/chat#getadapter).

[Read more](#read-more)
-----------------------

[### History

Store and retrieve message history across user, thread, and channel scopes.](/docs/history)[### Handling Events

Register handlers for mentions, messages, reactions, member joins, and platform-specific events.](/docs/handling-events)[### Overlapping Messages

Control how overlapping messages on the same thread are handled - burst, queue, debounce, drop, or process concurrently.](/docs/concurrency)[### Streaming

Stream real-time text responses from AI models and other async sources to chat platforms.](/docs/streaming)
