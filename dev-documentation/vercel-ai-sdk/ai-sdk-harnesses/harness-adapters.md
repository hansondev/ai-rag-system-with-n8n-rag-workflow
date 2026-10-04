---
title: "Harness Adapters"
source_url: https://ai-sdk.dev/docs/ai-sdk-harnesses/harness-adapters
section: ai-sdk-harnesses
crawled: 2026-09-20
---

# Harness Adapters

> Source: https://ai-sdk.dev/docs/ai-sdk-harnesses/harness-adapters

[AI SDK Harnesses](/docs/ai-sdk-harnesses)Harness Adapters


[Harness Adapters](#harness-adapters)
=====================================

Harness adapters connect `HarnessAgent` to a specific agent runtime. They are
the harness equivalent of AI SDK model providers: each adapter wraps one runtime
and normalizes its sessions, stream events, tools, usage, lifecycle state, and
configuration into the harness contract.

[AI SDK Harness Adapters](#ai-sdk-harness-adapters)
---------------------------------------------------

The AI SDK includes the following harness adapters:

* [Claude Code](/providers/ai-sdk-harnesses/claude-code) (`@ai-sdk/harness-claude-code`)
* [Cline](/providers/ai-sdk-harnesses/cline) (`@ai-sdk/harness-cline`)
* [Codex](/providers/ai-sdk-harnesses/codex) (`@ai-sdk/harness-codex`)
* [Cursor](/providers/ai-sdk-harnesses/cursor) (`@ai-sdk/harness-cursor`)
* [Deep Agents](/providers/ai-sdk-harnesses/deepagents) (`@ai-sdk/harness-deepagents`)
* [fx](/providers/ai-sdk-harnesses/fx) (`@ai-sdk/harness-fx`)
* [GitHub Copilot](/providers/ai-sdk-harnesses/github-copilot) (`@ai-sdk/harness-github-copilot`)
* [Grok Build](/providers/ai-sdk-harnesses/grok-build) (`@ai-sdk/harness-grok-build`)
* [OpenCode](/providers/ai-sdk-harnesses/opencode) (`@ai-sdk/harness-opencode`)
* [Pi](/providers/ai-sdk-harnesses/pi) (`@ai-sdk/harness-pi`)

### [Coming Soon](#coming-soon)

* Amp (`@ai-sdk/harness-amp`)
* Goose (`@ai-sdk/harness-goose`)
* Mastra (`@ai-sdk/harness-mastra`)

[Adapter Capabilities](#adapter-capabilities)
---------------------------------------------

| Adapter | Runtime location | Custom tools | Custom skills | Structured output | Built-in tool approval | Built-in tool filtering |
| --- | --- | --- | --- | --- | --- | --- |
| [Claude Code](/providers/ai-sdk-harnesses/claude-code) | Sandbox bridge |  |  |  |  |  |
| [Cline](/providers/ai-sdk-harnesses/cline) | Host process |  |  |  |  |  |
| [Codex](/providers/ai-sdk-harnesses/codex) | Sandbox bridge |  |  |  |  |  |
| [Cursor](/providers/ai-sdk-harnesses/cursor) | Sandbox via ACP |  |  |  |  |  |
| [Deep Agents](/providers/ai-sdk-harnesses/deepagents) | Sandbox bridge |  |  |  |  | via auto-rejection |
| [fx](/providers/ai-sdk-harnesses/fx) | Sandbox via ACP |  |  |  |  |  |
| [GitHub Copilot](/providers/ai-sdk-harnesses/github-copilot) | Sandbox via ACP |  |  |  |  |  |
| [Grok Build](/providers/ai-sdk-harnesses/grok-build) | Sandbox via ACP |  |  |  |  |  |
| [OpenCode](/providers/ai-sdk-harnesses/opencode) | Sandbox bridge |  |  |  |  | via auto-rejection |
| [Pi](/providers/ai-sdk-harnesses/pi) | Host process |  |  |  |  |  |

[Previous

Skills](/docs/ai-sdk-harnesses/skills)[Next

Workflow Utilities](/docs/ai-sdk-harnesses/workflow-utilities)
