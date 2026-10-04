---
title: "Documentation"
source_url: https://chat-sdk.dev/docs/adapters
section: adapters
crawled: 2026-09-20
---

# Documentation

> Source: https://chat-sdk.dev/docs/adapters

Adapters connect Chat SDK to messaging platforms and state backends. Install only the adapters you need, then register them on your `Chat` instance.

### [Adapter tiers](#adapter-tiers)

| Tier | Who maintains it |
| --- | --- |
| Official | Vercel (`@chat-adapter/*`) |
| Vendor-official | The platform vendor |
| Community | Third-party developers |

Browse all three on the [Adapters](/adapters) listing page. To ship your own, start with [Building an adapter](/docs/contributing/building), then list as [community](/docs/contributing/publishing#listing-on-chat-sdkdev) or [vendor-official](/docs/contributing/vendor-official).

Use the dedicated guides for adapter-specific concepts:

* [Platform Adapters](/docs/platform-adapters) cover webhook verification, message parsing, API calls, feature support, and multi-platform bots.
* [State Adapters](/docs/state-adapters) cover subscriptions, distributed locking, and caching.

[Adapter catalog (`chat/adapters`)](#adapter-catalog-chatadapters)
------------------------------------------------------------------

The `chat/adapters` subpath is a static catalog of official and vendor-official adapters. It imports no adapter packages, so you can use it from setup screens, build scripts, or onboarding flows without pulling in Slack, Teams, Redis, or other platform SDKs.

scripts/list-adapters.ts

```
import { ADAPTER_NAMES, getAdapter } from "chat/adapters";

for (const slug of ADAPTER_NAMES) {
  const adapter = getAdapter(slug);
  console.log(adapter.name, adapter.packageName, adapter.peerDeps);
}
```

Use the env helpers when you need to show setup instructions or inject secrets for one adapter:

```
import { getAdapter, getSecretEnvVars } from "chat/adapters";

const slack = getAdapter("slack");
const secrets = getSecretEnvVars("slack").map((envVar) => envVar.key);

console.log(slack.name, secrets);
```

The catalog intentionally covers official and vendor-official adapters. Community adapters live on the [Adapters](/adapters) listing page.

### [Environment specs](#environment-specs)

Each adapter entry includes an `env` spec:

* `required` lists variables needed regardless of auth mode.
* `credentialModes` groups mutually exclusive ways to authenticate, such as a bot token vs OAuth client credentials.
* `optional` lists tuning variables that are safe to omit.
* `config` lists constructor options that do not have an environment-variable equivalent.

### [Types](#types)

The main `CatalogAdapter` metadata shape is:

Prop

Type

`slug?`string

`name?`string

`description?`string

`packageName?`string

`type?`"platform" | "state"

`group?`"official" | "vendor-official"

`peerDeps?`readonly string[]

`env?`AdapterEnvSpec

Prop

Type

`required?`readonly EnvVar[]

`credentialModes?`readonly EnvGroup[]

`optional?`readonly EnvVar[]

`config?`readonly string[]

`notes?`string

Prop

Type

`label?`string

`vars?`readonly EnvVar[]

Prop

Type

`key?`string

`description?`string

`secret?`boolean

`aliases?`readonly string[]

### [Helpers](#helpers)

* `getAdapter(slug)` returns one catalog entry, or `undefined` for unknown slugs.
* `isAdapterSlug(slug)` narrows a string to `AdapterSlug`.
* `listEnvVars(slug)` flattens required, credential-mode, and optional env vars, de-duplicated by key.
* `getSecretEnvVars(slug)` returns the subset of `listEnvVars(slug)` marked as secrets.

[Read more](#read-more)
-----------------------

[### Getting Started

Pick a guide to start building with Chat SDK.](/docs/getting-started)[### Platform Adapters

Platform-specific adapters that connect your bot to any messaging platform.](/docs/platform-adapters)[### State Adapters

Pluggable state adapters for thread subscriptions, distributed locking, and caching.](/docs/state-adapters)[### Streaming

Stream real-time text responses from AI models and other async sources to chat platforms.](/docs/streaming)
