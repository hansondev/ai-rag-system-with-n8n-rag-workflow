---
title: "AI SDK Core"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core
section: reference
crawled: 2026-09-20
---

# AI SDK Core

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core

[Reference](/docs/reference)AI SDK Core


[AI SDK Core](#ai-sdk-core)
===========================

[AI SDK Core](/docs/ai-sdk-core) is a set of functions that allow you to interact with language models and other AI models.
These functions are designed to be easy-to-use and flexible, allowing you to generate text, structured data,
and embeddings from language models and other AI models.

AI SDK Core contains the following main functions:

[generateText()

Generate text and call tools from a language model.](/docs/reference/ai-sdk-core/generate-text)[streamText()

Stream text and call tools from a language model.](/docs/reference/ai-sdk-core/stream-text)[Output

Structured output types for generateText and streamText.](/docs/reference/ai-sdk-core/output)[embed()

Generate an embedding for a single value using an embedding model.](/docs/reference/ai-sdk-core/embed)[embedMany()

Generate embeddings for several values using an embedding model (batch embedding).](/docs/reference/ai-sdk-core/embed-many)[generateImage()

Generate images based on a given prompt using an image model.](/docs/reference/ai-sdk-core/generate-image)[experimental\_generateVideo()

Generate videos based on a given prompt using a video model.](/docs/reference/ai-sdk-core/generate-video)[experimental\_startBatch()

Start an asynchronous text-generation batch.](/docs/reference/ai-sdk-core/start-batch)[experimental\_getBatchStatus()

Retrieve the status of an asynchronous batch.](/docs/reference/ai-sdk-core/get-batch-status)[experimental\_getBatchResults()

Retrieve terminal results from an asynchronous batch.](/docs/reference/ai-sdk-core/get-batch-results)[experimental\_cancelBatch()

Request cancellation of an asynchronous batch.](/docs/reference/ai-sdk-core/cancel-batch)[experimental\_listBatches()

List asynchronous batches and their latest statuses.](/docs/reference/ai-sdk-core/list-batches)[transcribe()

Generate a transcript from an audio file.](/docs/reference/ai-sdk-core/transcribe)[experimental\_streamTranscribe()

Stream a transcript from live raw audio.](/docs/reference/ai-sdk-core/stream-transcribe)[experimental\_streamTranslate()

Stream a speech-to-speech translation from live raw audio.](/docs/reference/ai-sdk-core/stream-translate)[generateSpeech()

Generate speech audio from text.](/docs/reference/ai-sdk-core/generate-speech)[uploadFile()

Upload a file to a provider and get a provider reference.](/docs/reference/ai-sdk-core/upload-file)[uploadSkill()

Upload a skill to a provider and get a provider reference.](/docs/reference/ai-sdk-core/upload-skill)

It also contains the following helper functions:

[toolSearch()

Search deferred tools and load their definitions on demand.](/docs/reference/ai-sdk-core/tool-search)[tool()

Type inference helper function for tools.](/docs/reference/ai-sdk-core/tool)[experimental\_getRealtimeToolDefinitions()

Convert AI SDK tools into realtime tool definitions.](/docs/reference/ai-sdk-core/get-realtime-tool-definitions)[Experimental\_SandboxSession

Experimental execution environment interface passed to tool execution.](/docs/reference/ai-sdk-core/sandbox)[experimental\_filterActiveTools()

Filters a tool set to only the currently active tools.](/docs/reference/ai-sdk-core/filter-active-tools)[createMCPClient()

Creates a client for connecting to MCP servers.](/docs/reference/ai-sdk-core/create-mcp-client)[MCP Apps

Helpers for rendering interactive MCP tool UIs and filtering app-visible tools.](/docs/reference/ai-sdk-core/mcp-apps)[jsonSchema()

Creates AI SDK compatible JSON schema objects.](/docs/reference/ai-sdk-core/json-schema)[zodSchema()

Creates AI SDK compatible Zod schema objects.](/docs/reference/ai-sdk-core/zod-schema)[createProviderRegistry()

Creates a registry for using models from multiple providers.](/docs/reference/ai-sdk-core/provider-registry)[cosineSimilarity()

Calculates the cosine similarity between two vectors, e.g. embeddings.](/docs/reference/ai-sdk-core/cosine-similarity)[simulateReadableStream()

Creates a ReadableStream that emits values with configurable delays.](/docs/reference/ai-sdk-core/simulate-readable-stream)[wrapLanguageModel()

Wraps a language model with middleware.](/docs/reference/ai-sdk-core/wrap-language-model)[wrapImageModel()

Wraps an image model with middleware.](/docs/reference/ai-sdk-core/wrap-image-model)[extractReasoningMiddleware()

Extracts reasoning from the generated text and exposes it as a `reasoning` property on the result.](/docs/reference/ai-sdk-core/extract-reasoning-middleware)[extractJsonMiddleware()

Extracts JSON from text content by stripping markdown code fences.](/docs/reference/ai-sdk-core/extract-json-middleware)[isStepCount()

Creates a stop condition that triggers after a specified number of steps.](/docs/reference/ai-sdk-core/is-step-count)[hasToolCall()

Creates a stop condition that triggers when any specified tool is called.](/docs/reference/ai-sdk-core/has-tool-call)[isLoopFinished()

Creates a stop condition that lets the agent loop run until it naturally finishes.](/docs/reference/ai-sdk-core/loop-finished)[simulateStreamingMiddleware()

Simulates streaming behavior with responses from non-streaming language models.](/docs/reference/ai-sdk-core/simulate-streaming-middleware)[defaultSettingsMiddleware()

Applies default settings to a language model.](/docs/reference/ai-sdk-core/default-settings-middleware)[defaultInstructionsMiddleware()

Applies default instructions to a language model.](/docs/reference/ai-sdk-core/default-instructions-middleware)[smoothStream()

Smooths text and reasoning streaming output.](/docs/reference/ai-sdk-core/smooth-stream)[generateId()

Helper function for generating unique IDs](/docs/reference/ai-sdk-core/generate-id)[createIdGenerator()

Creates an ID generator](/docs/reference/ai-sdk-core/create-id-generator)

[Previous

Reference](/docs/reference)[Next

generateText](/docs/reference/ai-sdk-core/generate-text)
