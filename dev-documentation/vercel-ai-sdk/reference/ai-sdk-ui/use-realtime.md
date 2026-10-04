---
title: "experimental_useRealtime()"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-realtime
section: reference
crawled: 2026-09-20
---

# experimental_useRealtime()

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-realtime

[AI SDK UI](/docs/ai-sdk-ui)experimental\_useRealtime


[`experimental_useRealtime()`](#experimental_userealtime)
=========================================================

`experimental_useRealtime` is an experimental feature.

Creates a browser-side realtime session for bidirectional audio and text
conversations with a realtime provider model.

The hook supports token-based provider WebSockets, application-owned WebSocket
relays, and optional WebRTC where the model declares support. It provides controls for capture and playback, plus turn-based text input
and tool output. Turn-based conversation messages use `UIMessage[]`; continuous
transcript fragments remain in `session`.

```
1

import { openai } from '@ai-sdk/openai';



2

import { experimental_useRealtime } from '@ai-sdk/react';



3



4

const model = openai.experimental_realtime('gpt-realtime');



5



6

function Conversation() {



7

const realtime = experimental_useRealtime({



8

model,



9

api: { token: '/api/realtime/setup' },



10

});



11

return <button onClick={realtime.connect}>Connect</button>;



12

}
```

For AI Gateway, pass `gateway.experimental_realtime(...)` as the model and point
`api.token` at a server-side setup endpoint that calls
`gateway.experimental_realtime.getToken()`.

Keep the model and session configuration stable across renders, using module scope
or `useMemo`. Replacing either object replaces the hook's session.

[Continuous conversations](#continuous-conversations)
-----------------------------------------------------

For OpenAI Live, use `openai.experimental_realtime('gpt-live-1')` and an application-owned WebSocket
relay. The relay supplies server credentials and forwards the provider's native
text frames; it must authenticate clients before accepting connections.
Use `wss:` in production, keep provider credentials server-side, and apply your
application's authentication to the relay connection.

```
1

import {



2

openai,



3

type Experimental_OpenAIRealtimeModelLiveOptions,



4

} from '@ai-sdk/openai';



5

import { experimental_useRealtime } from '@ai-sdk/react';



6



7

const model = openai.experimental_realtime('gpt-live-1');



8

const sessionConfig = {



9

instructions: 'Be a concise, friendly assistant.',



10

providerOptions: {



11

openai: {



12

delegation: { type: 'client' },



13

} satisfies Experimental_OpenAIRealtimeModelLiveOptions,



14

},



15

};



16



17

function LiveConversation() {



18

const realtime = experimental_useRealtime({



19

model,



20

api: { websocket: 'wss://your-app.example/live' },



21

sessionConfig,



22

});



23

return (



24

<>



25

<button onClick={realtime.connect}>Connect microphone</button>



26

<button onClick={() => realtime.close()}>End conversation</button>



27

<p>



28

{realtime.status}: {realtime.session?.usage?.seconds} seconds



29

</p>



30

</>



31

);



32

}
```

The current continuous browser runtime supports a JSON/PCM16 WebSocket relay media
profile. Continuous conversation semantics alone do not guarantee support for every
codec or transport. Applications with their own audio pipeline can use the low-level
provider for other supported codecs. OpenAI-specific settings
live under `providerOptions.openai` and use camelCase fields; the provider converts
them to wire names.

### [Application-handled client delegation](#application-handled-client-delegation)

Live reports client delegation metadata through `session.delegations` and normalized
events. The application owns any text conversation, agent context, tool execution,
and result validation. The SDK does not run a generic agent executor for Live, and
Live delegations do not invoke `onToolCall`.

Use `sendEvent` to append context or a result. Set `delegationId` to a known client
delegation from the current session, or `null` for session-wide context:

```
1

await realtime.sendEvent({



2

type: 'context-append',



3

delegationId: null,



4

content: 'The application has confirmed that the appointment is at 3 PM.',



5

providerOptions: { openai: { channel: 'commentary' } },



6

});
```

The example uses application-provided content, not task arguments inferred from
delegation metadata. OpenAI's context channels are `commentary`, `thinking`, and
`instructions`; reserve `instructions` for trusted application instructions. A
successful send confirms local submission, not provider acceptance or audible delivery.

### [Optional WebRTC](#optional-webrtc)

For browser-direct Live audio, replace `api.websocket` with
`api: { session: '/api/realtime-live' }`. The hook posts JSON `{ sdp, sessionConfig }`
to that application endpoint and expects JSON `{ sdp, sessionId }` back. On the
server, authenticate the application user and validate the offer and allowed settings.

Use a same-origin broker authenticated with your application's session cookie.
The built-in setup request uses the browser's default same-origin credentials;
`api.session` does not accept custom authorization headers, a custom fetch, or
cross-origin credential options. A bearer-token-only or cross-origin cookie broker
therefore needs an application-owned same-origin endpoint in front of it. The
answer must contain nonempty `sdp` and `sessionId` strings (after trimming for
validation), and the JSON response body is limited to 1 MiB.

Exchange SDP using the server-held provider key:

```
1

const answer = await openai



2

.experimental_realtime('gpt-live-1')



3

.doCreateWebRTCSession({



4

sdp,



5

sessionConfig: {



6

providerOptions: {



7

openai: {



8

delegation: { type: 'client' },



9

client: {



10

dataChannel: {



11

allowedClientEvents: ['session.close', 'session.thinking.append'],



12

allowedServerEvents: [



13

{ type: 'session.started' },



14

{ type: 'session.closed' },



15

{ type: 'session.usage.updated' },



16

{ type: 'session.delegation.created' },



17

{ type: 'session.input_transcript.delta' },



18

{ type: 'session.output_transcript.delta' },



19

{ type: 'session.thinking.appended' },



20

{ type: 'error' },



21

],



22

},



23

},



24

},



25

},



26

},



27

});



28

// Return Response.json(answer) from the application endpoint.
```

Permissions are server-owned; override browser-supplied delegation and data-channel
policy. Allow the lifecycle, caption, delegation, command acknowledgment, and error
events needed by your UI. The runnable `/realtime-live` example in
`examples/ai-e2e-next` adds protocol mute and all three context channels.

WebRTC negotiates audio through SDP, so omit fixed audio formats and the PCM-only
`maxPlaybackBufferSeconds`. Audio travels as media rather than JSON audio commands.
`connect({ capture: false })` starts without microphone capture and keeps a reusable
audio sender; `resumeAudioCapture()` can attach a microphone later. Microphone access
requires browser permission and a secure context. Autoplay may require a user gesture
followed by `resumePlayback()`.

One live audio track is selected per attachment, preferring an enabled, unmuted
track. `isCapturing` follows that sender track, including mute and ended events;
it never switches tracks automatically. Caller-owned tracks are detached without
being stopped or disabled. Capture controls serialize sender changes; a stop is
reported only after detachment succeeds or the peer closes. If detachment fails,
the peer is closed to stop transmission while leaving borrowed tracks untouched.
Client delegation remains application-handled on either transport, and Live session
updates remain unsupported.

[Lifecycle and failure handling](#lifecycle-and-failure-handling)
-----------------------------------------------------------------

Use `status === 'connected'` as the readiness signal; `connect()` does not promise
to wait for provider readiness. Operational startup errors are reported through
`onError` and `status`; the legacy resolve-and-report behavior is preserved.

`close()` stops local capture and submissions, then drains events until the provider
confirms final usage or the close deadline expires. A failed close-command send
uses the shorter accepted-event drain rather than waiting for an acknowledgment
to an unsent command. Read `session.finalization`: a fulfilled close promise does
not by itself confirm usage. `disconnect()` and unmount release resources immediately.

Hook controls keep stable identities across renders and provider events. A retained
control targets the current **committed** session, including after a model or endpoint
change. Uncommitted renders cannot replace the active session or its callbacks.
Callback-only updates take effect at commit without reconnecting.

After unmount, `connect`, `close`, `resumeAudioCapture`, and `resumePlayback` reject
with a mounted-hook error. Other controls throw that error synchronously, including
`sendEvent`, which preserves synchronous validation and returns a promise for an
accepted submission. Retained controls cannot reopen an unmounted session.

Command rejection and playback failures are recoverable and do not mark a healthy
protocol connection as failed. Irrecoverable transport failures and protocol queue
overflow stop submissions and capture, drain the accepted event prefix, and clean
up. Events are never arbitrarily dropped while continuing with unreliable state.
No commands or side-effecting tools are transparently replayed on a replacement
connection.

Continuous Live WebSocket sessions have a 128 KiB outgoing wire-frame limit and a
128 KiB combined buffered-send budget, including the next frame and JSON/base64
encoding overhead. Oversized control messages are rejected, not silently split into
multiple commands. Keep Live context submissions within this budget; the example
relay's 128 KiB `maxPayload` aligns with the frame limit. These byte caps do not apply
to legacy turn-based sessions, which retain their pre-Live unlimited byte policy,
or to the optional WebRTC transport.

The continuous WebSocket PCM playback budget bounds local latency and memory. On overflow, stale queued audio
is discarded, playback pauses, and `onError` reports an audible gap. The connection
stays alive; `resumePlayback()` resumes from fresh audio at the live edge. Captions
and completion of delegated work do not prove that the corresponding audio was heard.

[Import](#import)
-----------------

```
import { experimental_useRealtime } from "@ai-sdk/react"
```

[API Signature](#api-signature)
-------------------------------

### [Parameters](#parameters)

### model:

Experimental\_RealtimeModel

### api:

{ token: string } | { websocket: string; protocols?: string[] } | { session: string }

Object

### token?:

string

### session?:

string

### websocket?:

string

### protocols?:

string[]

### sessionConfig?:

Partial<Experimental\_RealtimeSessionConfig>

### sampleRate?:

number

### maxEvents?:

number

### startupTimeoutMs?:

number

### closeTimeoutMs?:

number

### rtcDisconnectTimeoutMs?:

number

### maxPlaybackBufferSeconds?:

number

### onToolCall?:

(options: { toolCall: { toolCallId: string; toolName: string; args: unknown } }) => unknown | Promise<unknown> | undefined

### onEvent?:

(event: Experimental\_RealtimeServerEvent) => void

### onError?:

(error: Error) => void

### [Returns](#returns)

### status:

'disconnected' | 'connecting' | 'connected' | 'closing' | 'error'

### messages:

UIMessage[]

### events:

Experimental\_RealtimeServerEvent[]

### isCapturing:

boolean

### isPlaying:

boolean

### session:

Experimental\_RealtimeSessionState | undefined

### connect:

(options?: { stream?: MediaStream; capture?: boolean }) => Promise<void>

### close:

(options?: { eventId?: string }) => Promise<void>

### disconnect:

() => void

### addToolOutput:

(callId: string, result: unknown) => void

### sendEvent:

(event: Experimental\_RealtimeClientEvent) => Promise<void>

### sendTextMessage:

(text: string) => void

### sendAudio:

(base64Audio: string) => void

### commitAudio:

() => void

### clearAudioBuffer:

() => void

### requestResponse:

(options?: { modalities?: string[] }) => void

### cancelResponse:

() => void

### startAudioCapture:

(stream: MediaStream) => void

### stopAudioCapture:

() => void

### resumeAudioCapture:

() => Promise<void>

### stopPlayback:

() => void

### resumePlayback:

() => Promise<void>

[Tool Calling](#tool-calling)
-----------------------------

For turn-based models such as `gpt-realtime`, tool execution is client-driven.
Use `onToolCall` to handle tool calls and return the tool output. Keep the model
stable across callback updates:

```
1

const model = openai.experimental_realtime('gpt-realtime');



2



3

function WeatherConversation() {



4

const realtime = experimental_useRealtime({



5

model,



6

api: { token: '/api/realtime/setup' },



7

onToolCall: async ({ toolCall }) => {



8

if (toolCall.toolName === 'getWeather') {



9

const response = await fetch('/api/weather', {



10

method: 'POST',



11

headers: { 'Content-Type': 'application/json' },



12

body: JSON.stringify(toolCall.args),



13

});



14



15

return response.json();



16

}



17

},



18

});



19

return <button onClick={realtime.connect}>Connect</button>;



20

}
```

For tools that require user interaction, return `undefined` from `onToolCall`
and call `addToolOutput` later.

Turn-based providers retain their automatic continuation behavior. Live uses the
application-handled client delegation flow described above, rather than these tool
callbacks or turn controls.

Outstanding commands are bounded independently from the retained recent-ID history.
Completed work does not impose a lifetime command quota. Use fresh IDs and keep
durable operation deduplication in the application; bounded history is not a promise
of session-long exactly-once execution.

[Capture ownership](#capture-ownership)
---------------------------------------

SDK-acquired tracks are stopped on local capture stop or cleanup. Caller-owned Live
tracks are detached without stopping or disabling them. `stopAudioCapture()` controls
local hardware capture; provider `input-audio-mute` controls remote audio processing
and is tracked through its acknowledgment. These are separate operations: protocol
mute does not release the microphone, and resuming local capture does not unmute
provider input. Use `resumeAudioCapture()` to reuse a caller-supplied stream or
acquire a fresh SDK-owned microphone without reconnecting. The application remains
responsible for stopping its own tracks when finished with them.

`isCapturing` reflects SDK capture controls and events on the selected audio track;
it does not continuously observe caller-owned media. Assigning `track.enabled`
does not emit an event, and calling `track.stop()` does not emit an `ended` event.
After changing borrowed tracks externally, call `startAudioCapture(stream)` or
`resumeAudioCapture()` to refresh capture state and reattach as needed. If a track
was stopped, provide a stream with a live audio track; stopped tracks cannot be
restarted. The SDK does not poll external track state.

[Experimental compatibility](#experimental-compatibility)
---------------------------------------------------------

This update adds explicit relay options and changes experimental `sendEvent` to
return a promise. Existing token setups and the no-argument `connect` call remain
supported. New session state uses `session`, not a provider-branded state object.
Generic realtime-model consumers must check optional connection methods before calling
them. Model interfaces and event unions are experimental; exhaustive external switches
may need to handle the added events. OpenAI uses `experimental_realtime` for both
Realtime and Live models, with a provider-specific `{ api: 'live' }` override for
unknown or early-access Live model IDs. This factory option selects the provider API;
the hook's `api.websocket` option selects the application's transport endpoint.
OpenAI Live startup options are exported as `Experimental_OpenAIRealtimeModelLiveOptions`.

See [Realtime](/docs/ai-sdk-core/realtime#tool-calling) for a complete example
with server-backed app-specific tool endpoints.

[Previous

useObject](/docs/reference/ai-sdk-ui/use-object)[Next

convertToModelMessages](/docs/reference/ai-sdk-ui/convert-to-model-messages)
