---
title: "Publishing your adapter"
source_url: https://chat-sdk.dev/docs/contributing/publishing
section: contributing
crawled: 2026-09-20
---

# Publishing your adapter

> Source: https://chat-sdk.dev/docs/contributing/publishing

[Package checklist](#package-checklist)
---------------------------------------

Before publishing, verify your `package.json` meets these requirements:

package.json

```
{
  "name": "chat-adapter-matrix",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "peerDependencies": {
    "chat": "^4.0.0"
  },
  "publishConfig": {
    "access": "public"
  },
  "keywords": ["chat-sdk", "chat-adapter", "matrix"],
  "license": "MIT"
}
```

| Field | Why it matters |
| --- | --- |
| `"type": "module"` | ESM-only — matches the Chat SDK ecosystem |
| `"files": ["dist"]` | Only publish compiled output, keeping the package lean |
| `"exports"` | Explicit entry points for bundlers and Node.js |
| `"peerDependencies"` | Consumers provide their own `chat` instance |
| `"publishConfig"` | Required for scoped packages (`@your-scope/chat-adapter-*`) |
| `"keywords"` | Include `chat-sdk` and `chat-adapter` for npm discoverability |

[Naming conventions](#naming-conventions)
-----------------------------------------

| Convention | Example | When to use |
| --- | --- | --- |
| Unscoped | `chat-adapter-matrix` | Most community adapters |
| Scoped | `@your-org/chat-adapter-matrix` | Optional — if you prefer publishing under your org's scope |

The `@chat-adapter/` npm scope is reserved for Vercel-maintained adapters. Do not publish under this scope.

[Build and verify](#build-and-verify)
-------------------------------------

Run a full build and verify everything compiles before publishing.

Terminal

```
# Build
npm run build

# Type-check
npm run typecheck

# Run tests
npm test
```

Inspect the package contents to make sure only `dist/` is included:

Terminal

```
npm pack --dry-run
```

You should see output like:

```
dist/index.js
dist/index.d.ts
dist/index.js.map
package.json
README.md
LICENSE
```

If you see `src/`, `node_modules/`, or test files in the output, update your `"files"` field or add a `.npmignore`.

[Versioning](#versioning)
-------------------------

Follow [semver](https://semver.org):

| Change | Bump | Example |
| --- | --- | --- |
| Bug fix, internal refactor | `patch` | `1.0.0` → `1.0.1` |
| New feature, new export, new config option | `minor` | `1.0.0` → `1.1.0` |
| Breaking change (removed export, changed signature) | `major` | `1.0.0` → `2.0.0` |

When the Chat SDK releases a new major version, you'll need a major bump too if your adapter's peer dependency range changes.

[Publish to npm](#publish-to-npm)
---------------------------------

Terminal

```
npm publish
```

For scoped packages published for the first time:

Terminal

```
npm publish --access public
```

[Peer dependency compatibility](#peer-dependency-compatibility)
---------------------------------------------------------------

Your adapter should declare `chat` as a peer dependency with a caret range:

```
{
  "peerDependencies": {
    "chat": "^4.0.0"
  }
}
```

This means your adapter works with any `4.x` release. When the Chat SDK ships a new major version:

1. Test your adapter against the new version
2. Update the peer dependency range
3. Publish a new major version of your adapter

[Post-publish verification](#post-publish-verification)
-------------------------------------------------------

After publishing, verify the package works for consumers:

Terminal

```
# Create a temp directory
mkdir /tmp/test-adapter && cd /tmp/test-adapter
npm init -y

# Install your adapter
npm install chat chat-adapter-matrix

# Verify the import works
node -e "import('chat-adapter-matrix').then(m => console.log(Object.keys(m)))"
```

You should see your exported symbols (`createMatrixAdapter`, `MatrixAdapter`, etc.).

[Keeping your adapter up to date](#keeping-your-adapter-up-to-date)
-------------------------------------------------------------------

* Watch the [Chat SDK changelog](https://github.com/vercel/chat/releases) for new features and breaking changes
* Run your test suite against new Chat SDK releases before they ship to catch compatibility issues early
* When the `Adapter` interface adds new optional methods, consider implementing them to keep your adapter feature-complete

[Listing on chat-sdk.dev](#listing-on-chat-sdkdev)
--------------------------------------------------

Community adapters can be listed on the [Adapters](https://chat-sdk.dev/adapters) page by opening a PR that adds an entry to `apps/docs/adapters.json` in the [Chat SDK repo](https://github.com/vercel/chat). Your adapter's README is fetched from GitHub at build time and rendered on its dedicated page.

Platform vendors should follow the [vendor-official guide](/docs/contributing/vendor-official) instead.

### [Pin your README to a commit or tag](#pin-your-readme-to-a-commit-or-tag)

The `readme` field **must** reference a specific commit SHA or tag — not a branch name like `main`.

The docs site re-renders on every deploy, so an unpinned `readme` would serve whatever currently sits at your default branch — including edits made after the listing PR was reviewed. Pinning freezes the rendered content at the state we approved; new content goes live through a follow-up PR that bumps the ref.

apps/docs/adapters.json

```
{
  "name": "My Adapter",
  "slug": "my-adapter",
  "type": "platform",
  "community": true,
  "packageName": "chat-adapter-my-thing",
  "readme": "https://github.com/your-org/chat-adapter-my-thing/tree/v1.2.0"
}
```

Accepted `readme` formats:

| Format | Example |
| --- | --- |
| Repo root at a tag | `https://github.com/owner/repo/tree/v1.0.0` |
| Repo root at a commit | `https://github.com/owner/repo/tree/abc1234...` |
| Subpath in a monorepo | `https://github.com/owner/repo/tree/<ref>/packages/adapter` |

Unpinned refs (e.g., `tree/main`, or omitting `/tree/<ref>` entirely) will emit a build warning and are rejected during PR review.

[Read more](#read-more)
-----------------------

[### Overview

Overview of Chat SDK adapters and the static adapter catalog.](/docs/adapters)[### List a vendor-official adapter

Qualify for the vendor-official tier and add your adapter to the Chat SDK docs, chat/adapters catalog, create-chat-sdk, and eve.dev/integrations.](/docs/contributing/vendor-official)[### Building an adapter

Learn how to build your own Chat SDK adapter for any messaging platform.](/docs/contributing/building)[### Testing adapters

Write unit tests, integration tests, and replay tests for community Chat SDK adapters.](/docs/contributing/testing)
