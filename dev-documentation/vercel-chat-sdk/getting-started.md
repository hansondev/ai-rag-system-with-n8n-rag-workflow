---
title: "Getting Started"
source_url: https://chat-sdk.dev/docs/getting-started
section: getting-started
crawled: 2026-09-20
---

# Getting Started

> Source: https://chat-sdk.dev/docs/getting-started

[Usage](#usage)
---------------

Learn the core patterns for handling incoming events and posting messages back to your users.

[### Creating a Chat Instance

Initialize the Chat class with adapters, state, and configuration options.](/docs/usage)[### Threads, Messages, and Channels

Work with threads, messages, and channels across platforms.](/docs/threads-messages-channels)[### Handling Events

Register handlers for mentions, messages, reactions, and platform-specific events.](/docs/handling-events)[### Posting Messages

Different ways to render and send messages with thread.post().](/docs/posting-messages)

[Adapters](#adapters)
---------------------

Connect your bot to chat platforms and persist state across restarts.

[### Platform Adapters

Connect your bot to messaging platforms with webhook verification, parsing, and native formatting.](/docs/platform-adapters)[### State Adapters

Pluggable state adapters for thread subscriptions, distributed locking, and caching.](/docs/state-adapters)

Browse all official, vendor-official, and community adapters on the [Adapters](/adapters) page.

[Resources](#resources)
-----------------------

* [The Complete Guide to Chat SDK](https://vercel.com/kb/guide/the-complete-guide-to-chat-sdk?utm_source=chat-sdk_site&utm_medium=docs&utm_campaign=getting-started&utm_content=the-complete-guide-to-chat-sdk) — End-to-end walkthrough that takes you from zero to a deployed multi-platform bot, covering adapters, state, handlers, cards, and streaming.

See all guides and templates on the [resources](/resources?utm_source=chat-sdk_site&utm_medium=docs&utm_campaign=getting-started&utm_content=resources) page.

[Read more](#read-more)
-----------------------

[### Creating a Chat Instance

Initialize the Chat class with adapters, state, and configuration options.](/docs/usage)[### Platform Adapters

Platform-specific adapters that connect your bot to any messaging platform.](/docs/platform-adapters)[### Vercel Connect

Authenticate Slack, Microsoft Teams, GitHub, Linear, Discord, Notion, and Telegram adapters with Vercel Connect — short-lived runtime tokens for outbound calls and OIDC-verified inbound webhooks where supported.](/docs/vercel-connect)[### CLI

Scaffold a Chat SDK bot app with a single command.](/docs/create-chat-sdk)
