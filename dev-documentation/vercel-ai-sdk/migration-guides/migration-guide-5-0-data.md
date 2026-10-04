---
title: "Migrate Your Data to AI SDK 5.0"
source_url: https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0-data
section: migration-guides
crawled: 2026-09-20
---

# Migrate Your Data to AI SDK 5.0

> Source: https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0-data

[Migration Guides](/docs/migration-guides)Migrate Your Data to AI SDK 5.0


[Migrate Your Data to AI SDK 5.0](#migrate-your-data-to-ai-sdk-50)
==================================================================

AI SDK 5.0 introduces changes to the message structure and persistence patterns. Unlike code migrations that can often be automated with codemods, data migration depends on your specific persistence approach, database schema, and application requirements.

**This guide helps you get your application working with AI SDK 5.0 first** using a runtime conversion layer. This allows you to update your app immediately without database migrations blocking you. You can then migrate your data schema at your own pace.

[Recommended Migration Process](#recommended-migration-process)
---------------------------------------------------------------

Follow this two-phase approach for a safe migration:

### [Phase 1: Get Your App Working (Runtime Conversion)](#phase-1-get-your-app-working-runtime-conversion)

**Goal:** Update your application to AI SDK 5.0 without touching your database.

1. Update dependencies (install v4 types alongside v5)
2. Add conversion functions to transform between v4 and v5 message formats
3. Update data fetching logic to convert messages when reading from the database
4. Update the rest of your application code to AI SDK 5.0 (see the [main migration guide](/docs/migration-guides/migration-guide-5-0))

Your database schema remains unchanged during Phase 1. You're only adding a conversion layer that transforms messages at runtime.

**Timeline:** Can be completed in hours or days.

### [Phase 2: Migrate to V5 Schema (Recommended)](#phase-2-migrate-to-v5-schema-recommended)

**Goal:** Migrate your data to a v5-compatible schema, eliminating the runtime conversion overhead.

While Phase 1 gets you working immediately, migrate your schema soon after completing Phase 1. This phase uses a side-by-side migration approach with an equivalent v5 schema:

1. Create `messages_v5` table alongside existing `messages` table
2. Start dual-writing to both tables (with conversion)
3. Run a background migration to convert existing messages
4. Switch reads to the v5 schema
5. Remove conversion from your route handlers
6. Remove dual-write (write only to v5)
7. Drop old tables

**Timeline:** Do this soon after Phase 1.

**Why this matters:**

* Removes runtime conversion overhead
* Eliminates technical debt early
* Type safety with v5 message format
* Easier to maintain and extend

[Understanding the Changes](#understanding-the-changes)
-------------------------------------------------------

Before starting, understand the main persistence-related changes in AI SDK 5.0:

**AI SDK 4.0:**

* `content` field for text
* `reasoning` as a top-level property
* `toolInvocations` as a top-level property
* `parts` (optional) ordered array

**AI SDK 5.0:**

* `parts` array is the single source of truth
* `content` is removed (deprecated) and accessed via a `text` part
* `reasoning` is removed and replaced with a `reasoning` part
* `toolInvocations` is removed and replaced with `tool-${toolName}` parts with `input`/`output` (renamed from `args`/`result`)
* `data` role removed (use data parts instead)

[Phase 1: Runtime Conversion Pattern](#phase-1-runtime-conversion-pattern)
--------------------------------------------------------------------------

This creates a conversion layer without making changes to your database schema.

### [Step 1: Update Dependencies](#step-1-update-dependencies)

To get proper TypeScript types for your v4 messages, install the v4 package alongside v5 using npm aliases:

package.json

```
1

{



2

"dependencies": {



3

"ai": "^5.0.0",



4

"ai-legacy": "npm:ai@^4.3.2"



5

}



6

}
```

Run:

```
1

pnpm install
```

Import v4 types for proper type safety:

```
1

import type { Message as V4Message } from 'ai-legacy';



2

import type { UIMessage } from 'ai';
```

### [Step 2: Add Conversion Functions](#step-2-add-conversion-functions)

Create type guards to detect which message format you're working with, and build a conversion function that handles all v4 message types:

```
1

import type {



2

ToolInvocation,



3

Message as V4Message,



4

UIMessage as LegacyUIMessage,



5

} from 'ai-legacy';



6

import type { ToolUIPart, UIMessage, UITools } from 'ai';



7



8

export type MyUIMessage = UIMessage<unknown, { custom: any }, UITools>;



9



10

type V4Part = NonNullable<V4Message['parts']>[number];



11

type V5Part = MyUIMessage['parts'][number];



12



13

// Type definitions for V4 parts



14

type V4ToolInvocationPart = Extract<V4Part, { type: 'tool-invocation' }>;



15



16

type V4ReasoningPart = Extract<V4Part, { type: 'reasoning' }>;



17



18

type V4SourcePart = Extract<V4Part, { type: 'source' }>;



19



20

type V4FilePart = Extract<V4Part, { type: 'file' }>;



21



22

// Type guards



23

function isV4Message(msg: V4Message | MyUIMessage): msg is V4Message {



24

return (



25

'toolInvocations' in msg ||



26

(msg?.parts?.some(p => p.type === 'tool-invocation') ?? false) ||



27

msg?.role === 'data' ||



28

('reasoning' in msg && typeof msg.reasoning === 'string') ||



29

(msg?.parts?.some(p => 'args' in p || 'result' in p) ?? false) ||



30

(msg?.parts?.some(p => 'reasoning' in p && 'details' in p) ?? false) ||



31

(msg?.parts?.some(



32

p => p.type === 'file' && 'mimeType' in p && 'data' in p,



33

) ??



34

false)



35

);



36

}



37



38

function isV4ToolInvocationPart(part: unknown): part is V4ToolInvocationPart {



39

return (



40

typeof part === 'object' &&



41

part !== null &&



42

'type' in part &&



43

part.type === 'tool-invocation' &&



44

'toolInvocation' in part



45

);



46

}



47



48

function isV4ReasoningPart(part: unknown): part is V4ReasoningPart {



49

return (



50

typeof part === 'object' &&



51

part !== null &&



52

'type' in part &&



53

part.type === 'reasoning' &&



54

'reasoning' in part



55

);



56

}



57



58

function isV4SourcePart(part: unknown): part is V4SourcePart {



59

return (



60

typeof part === 'object' &&



61

part !== null &&



62

'type' in part &&



63

part.type === 'source' &&



64

'source' in part



65

);



66

}



67



68

function isV4FilePart(part: unknown): part is V4FilePart {



69

return (



70

typeof part === 'object' &&



71

part !== null &&



72

'type' in part &&



73

part.type === 'file' &&



74

'mimeType' in part &&



75

'data' in part



76

);



77

}



78



79

// State mapping



80

const V4_TO_V5_STATE_MAP = {



81

'partial-call': 'input-streaming',



82

call: 'input-available',



83

result: 'output-available',



84

} as const;



85



86

function convertToolInvocationState(



87

v4State: ToolInvocation['state'],



88

): 'input-streaming' | 'input-available' | 'output-available' {



89

return V4_TO_V5_STATE_MAP[v4State] ?? 'output-available';



90

}



91



92

// Tool conversion



93

function convertV4ToolInvocationToV5ToolUIPart(



94

toolInvocation: ToolInvocation,



95

): ToolUIPart {



96

return {



97

type: `tool-${toolInvocation.toolName}`,



98

toolCallId: toolInvocation.toolCallId,



99

input: toolInvocation.args,



100

output:



101

toolInvocation.state === 'result' ? toolInvocation.result : undefined,



102

state: convertToolInvocationState(toolInvocation.state),



103

};



104

}



105



106

// Part converters



107

function convertV4ToolInvocationPart(part: V4ToolInvocationPart): V5Part {



108

return convertV4ToolInvocationToV5ToolUIPart(part.toolInvocation);



109

}



110



111

function convertV4ReasoningPart(part: V4ReasoningPart): V5Part {



112

return { type: 'reasoning', text: part.reasoning };



113

}



114



115

function convertV4SourcePart(part: V4SourcePart): V5Part {



116

return {



117

type: 'source-url',



118

url: part.source.url,



119

sourceId: part.source.id,



120

title: part.source.title,



121

};



122

}



123



124

function convertV4FilePart(part: V4FilePart): V5Part {



125

return {



126

type: 'file',



127

mediaType: part.mimeType,



128

url: part.data,



129

};



130

}



131



132

function convertPart(part: V4Part | V5Part): V5Part {



133

if (isV4ToolInvocationPart(part)) {



134

return convertV4ToolInvocationPart(part);



135

}



136

if (isV4ReasoningPart(part)) {



137

return convertV4ReasoningPart(part);



138

}



139

if (isV4SourcePart(part)) {



140

return convertV4SourcePart(part);



141

}



142

if (isV4FilePart(part)) {



143

return convertV4FilePart(part);



144

}



145

// Already V5 format



146

return part;



147

}



148



149

// Message conversion



150

function createBaseMessage(



151

msg: V4Message | MyUIMessage,



152

index: number,



153

): Pick<MyUIMessage, 'id' | 'role'> {



154

return {



155

id: msg.id || `msg-${index}`,



156

role: msg.role === 'data' ? 'assistant' : msg.role,



157

};



158

}



159



160

function convertDataMessage(msg: V4Message, index: number): MyUIMessage {



161

return {



162

...createBaseMessage(msg, index),



163

parts: [



164

{



165

type: 'data-custom',



166

data: msg.data || msg.content,



167

},



168

],



169

};



170

}



171



172

function buildPartsFromTopLevelFields(msg: V4Message): MyUIMessage['parts'] {



173

const parts: MyUIMessage['parts'] = [];



174



175

if (msg.reasoning) {



176

parts.push({ type: 'reasoning', text: msg.reasoning });



177

}



178



179

if (msg.toolInvocations) {



180

parts.push(



181

...msg.toolInvocations.map(convertV4ToolInvocationToV5ToolUIPart),



182

);



183

}



184



185

if (msg.content && typeof msg.content === 'string') {



186

parts.push({ type: 'text', text: msg.content });



187

}



188



189

return parts;



190

}



191



192

function convertPartsArray(parts: V4Part[]): MyUIMessage['parts'] {



193

return parts.map(convertPart);



194

}



195



196

export function convertV4MessageToV5(



197

msg: V4Message | MyUIMessage,



198

index: number,



199

): MyUIMessage {



200

if (!isV4Message(msg)) {



201

return msg as MyUIMessage;



202

}



203



204

if (msg.role === 'data') {



205

return convertDataMessage(msg, index);



206

}



207



208

const base = createBaseMessage(msg, index);



209

const parts = msg.parts



210

? convertPartsArray(msg.parts)



211

: buildPartsFromTopLevelFields(msg);



212



213

return { ...base, parts };



214

}



215



216

// V5 to V4 conversion



217

function convertV5ToolUIPartToV4ToolInvocation(



218

part: ToolUIPart,



219

): ToolInvocation {



220

const state =



221

part.state === 'input-streaming'



222

? 'partial-call'



223

: part.state === 'input-available'



224

? 'call'



225

: 'result';



226



227

const toolName = part.type.startsWith('tool-')



228

? part.type.slice(5)



229

: part.type;



230



231

const base = {



232

toolCallId: part.toolCallId,



233

toolName,



234

args: part.input,



235

state,



236

};



237



238

if (state === 'result' && part.output !== undefined) {



239

return { ...base, state: 'result' as const, result: part.output };



240

}



241



242

return base as ToolInvocation;



243

}



244



245

export function convertV5MessageToV4(msg: MyUIMessage): LegacyUIMessage {



246

const parts: V4Part[] = [];



247



248

const base: LegacyUIMessage = {



249

id: msg.id,



250

role: msg.role,



251

content: '',



252

parts,



253

};



254



255

let textContent = '';



256

let reasoning: string | undefined;



257

const toolInvocations: ToolInvocation[] = [];



258



259

for (const part of msg.parts) {



260

if (part.type === 'text') {



261

textContent = part.text;



262

parts.push({ type: 'text', text: part.text });



263

} else if (part.type === 'reasoning') {



264

reasoning = part.text;



265

parts.push({



266

type: 'reasoning',



267

reasoning: part.text,



268

details: [{ type: 'text', text: part.text }],



269

});



270

} else if (part.type.startsWith('tool-')) {



271

const toolInvocation = convertV5ToolUIPartToV4ToolInvocation(



272

part as ToolUIPart,



273

);



274

parts.push({ type: 'tool-invocation', toolInvocation: toolInvocation });



275

toolInvocations.push(toolInvocation);



276

} else if (part.type === 'source-url') {



277

parts.push({



278

type: 'source',



279

source: {



280

id: part.sourceId,



281

url: part.url,



282

title: part.title,



283

sourceType: 'url',



284

},



285

});



286

} else if (part.type === 'file') {



287

parts.push({



288

type: 'file',



289

mimeType: part.mediaType,



290

data: part.url,



291

});



292

} else if (part.type === 'data-custom') {



293

base.data = part.data;



294

}



295

}



296



297

if (textContent) {



298

base.content = textContent;



299

}



300



301

if (reasoning) {



302

base.reasoning = reasoning;



303

}



304



305

if (toolInvocations.length > 0) {



306

base.toolInvocations = toolInvocations;



307

}



308



309

if (parts.length > 0) {



310

base.parts = parts;



311

}



312

return base;



313

}
```

### [Step 3: Convert Messages When Reading](#step-3-convert-messages-when-reading)

Apply the conversion when loading messages from your database:

Adapt this code to your specific database and ORM.

```
1

import { convertV4MessageToV5, type MyUIMessage } from './conversion';



2



3

export async function loadChat(chatId: string): Promise<MyUIMessage[]> {



4

// Fetch messages from your database (pseudocode - update based on your data access layer)



5

const rawMessages = await db



6

.select()



7

.from(messages)



8

.where(eq(messages.chatId, chatId))



9

.orderBy(messages.createdAt);



10



11

// Convert on read



12

return rawMessages.map((msg, index) => convertV4MessageToV5(msg, index));



13

}
```

### [Step 4: Convert Messages When Saving](#step-4-convert-messages-when-saving)

In Phase 1, your application runs on v5 but your database stores v4 format. Convert messages inline in your route handlers before passing them to your database functions:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import {



2

convertV5MessageToV4,



3

convertV4MessageToV5,



4

type MyUIMessage,



5

} from './conversion';



6

import { upsertMessage, loadChat } from './db/actions';



7

import { streamText, generateId, convertToModelMessages } from 'ai';



8



9

export async function POST(req: Request) {



10

const { message, chatId }: { message: MyUIMessage; chatId: string } =



11

await req.json();



12



13

// Convert and save incoming user message (v5 to v4 inline)



14

await upsertMessage({



15

chatId,



16

id: message.id,



17

message: convertV5MessageToV4(message), // convert to v4



18

});



19



20

// Load previous messages (already in v5 format)



21

const previousMessages = await loadChat(chatId);



22

const messages = [...previousMessages, message];



23



24

const result = streamText({



25

model: "xai/grok-4.6",



26

messages: convertToModelMessages(messages),



27

tools: {



28

// Your tools here



29

},



30

});



31



32

return result.toUIMessageStreamResponse({



33

generateMessageId: generateId,



34

originalMessages: messages,



35

onFinish: async ({ responseMessage }) => {



36

// Convert and save assistant response (v5 to v4 inline)



37

await upsertMessage({



38

chatId,



39

id: responseMessage.id,



40

message: convertV5MessageToV4(responseMessage),



41

});



42

},



43

});



44

}
```

Keep your `upsertMessage` (or equivalent) function unchanged to continue working with v4 messages.

With Steps 3 and 4 complete, you have a bidirectional conversion layer:

* **Reading:** v4 (database) → v5 (application)
* **Writing:** v5 (application) → v4 (database)

Your database schema remains unchanged, but your application now works with v5 format.

**What's next:** Follow the main migration guide to update the rest of your application code to AI SDK 5.0, including API routes, components, and other code that uses the AI SDK. Then proceed to Phase 2.

See the [main migration guide](/docs/migration-guides/migration-guide-5-0) for details.

[Phase 2: Side-by-Side Schema Migration](#phase-2-side-by-side-schema-migration)
--------------------------------------------------------------------------------

Now that your application is updated to AI SDK 5.0 and working with the runtime conversion layer from Phase 1, you have a fully functional system. However, **the conversion functions are only a temporary solution**. Your database still stores messages in the v4 format, which means:

* Every read operation requires runtime conversion overhead
* You maintain backward compatibility code indefinitely
* Future features require working with the legacy schema

**Phase 2 migrates your message history to the v5 schema**, eliminating the conversion layer and enabling better performance and long-term maintainability.

This phase uses a simplified approach: create a new `messages_v5` table with the same structure as your current `messages` table, but storing v5-formatted message parts.

**Adapt phase 2 examples to your setup**

These code examples demonstrate migration patterns. Your implementation will differ based on your database (Postgres, MySQL, SQLite), ORM (Drizzle, Prisma, raw SQL), schema design, and data persistence patterns.

Use these examples as a guide, then adapt them to your specific setup.

### [Overview: Migration Strategy](#overview-migration-strategy)

1. **Create `messages_v5` table** alongside existing `messages` table
2. **Dual-write** new messages to both schemas (with conversion)
3. **Background migration** to convert existing messages
4. **Verify** data integrity
5. **Update read functions** to use `messages_v5` schema
6. **Remove conversion** from route handlers
7. **Remove dual-write** (write only to `messages_v5`)
8. **Clean up** old tables

This ensures your application keeps running throughout the migration with no data loss risk.

### [Step 1: Create V5 Schema Alongside V4](#step-1-create-v5-schema-alongside-v4)

Create a new `messages_v5` table with the same structure as your existing table, but designed to store v5 message parts:

**Existing v4 Schema (keep running):**

```
1

import { UIMessage } from 'ai-legacy';



2



3

export const messages = pgTable('messages', {



4

id: varchar()



5

.primaryKey()



6

.$defaultFn(() => nanoid()),



7

chatId: varchar()



8

.references(() => chats.id, { onDelete: 'cascade' })



9

.notNull(),



10

createdAt: timestamp().defaultNow().notNull(),



11

parts: jsonb().$type<UIMessage['parts']>().notNull(),



12

role: text().$type<UIMessage['role']>().notNull(),



13

});
```

**New v5 Schema (create alongside):**

```
1

import { MyUIMessage } from './conversion';



2



3

export const messages_v5 = pgTable('messages_v5', {



4

id: varchar()



5

.primaryKey()



6

.$defaultFn(() => nanoid()),



7

chatId: varchar()



8

.references(() => chats.id, { onDelete: 'cascade' })



9

.notNull(),



10

createdAt: timestamp().defaultNow().notNull(),



11

parts: jsonb().$type<MyUIMessage['parts']>().notNull(),



12

role: text().$type<MyUIMessage['role']>().notNull(),



13

});
```

Run your migration to create the new table:

```
1

pnpm drizzle-kit generate



2

pnpm drizzle-kit migrate
```

### [Step 2: Implement Dual-Write for New Messages](#step-2-implement-dual-write-for-new-messages)

Update your save functions to write to both schemas during the migration period. This ensures new messages are available in both formats:

```
1

import { convertV4MessageToV5 } from './conversion';



2

import { messages, messages_v5 } from './schema';



3

import type { UIMessage } from 'ai-legacy';



4



5

export const upsertMessage = async ({



6

chatId,



7

message,



8

id,



9

}: {



10

id: string;



11

chatId: string;



12

message: UIMessage; // Still accepts v4 format



13

}) => {



14

return await db.transaction(async tx => {



15

// Write to v4 schema (existing)



16

const [result] = await tx



17

.insert(messages)



18

.values({



19

chatId,



20

parts: message.parts ?? [],



21

role: message.role,



22

id,



23

})



24

.onConflictDoUpdate({



25

target: messages.id,



26

set: {



27

parts: message.parts ?? [],



28

chatId,



29

},



30

})



31

.returning();



32



33

// Convert and write to v5 schema (new)



34

const v5Message = convertV4MessageToV5(



35

{



36

...message,



37

content: '',



38

},



39

0,



40

);



41



42

await tx



43

.insert(messages_v5)



44

.values({



45

chatId,



46

parts: v5Message.parts ?? [],



47

role: v5Message.role,



48

id,



49

})



50

.onConflictDoUpdate({



51

target: messages_v5.id,



52

set: {



53

parts: v5Message.parts ?? [],



54

chatId,



55

},



56

});



57



58

return result;



59

});



60

};
```

### [Step 3: Migrate Existing Messages](#step-3-migrate-existing-messages)

Create a script to migrate existing messages from v4 to v5 schema:

```
1

import { convertV4MessageToV5 } from './conversion';



2

import { db } from './db';



3

import { messages, messages_v5 } from './db/schema';



4



5

async function migrateExistingMessages() {



6

console.log('Starting migration of existing messages...');



7



8

// Get all v4 messages that haven't been migrated yet



9

const migratedIds = await db.select({ id: messages_v5.id }).from(messages_v5);



10



11

const migratedIdSet = new Set(migratedIds.map(m => m.id));



12



13

const allMessages = await db.select().from(messages);



14

const unmigrated = allMessages.filter(msg => !migratedIdSet.has(msg.id));



15



16

console.log(`Found ${unmigrated.length} messages to migrate`);



17



18

let migrated = 0;



19

let errors = 0;



20

const batchSize = 100;



21



22

for (let i = 0; i < unmigrated.length; i += batchSize) {



23

const batch = unmigrated.slice(i, i + batchSize);



24



25

await db.transaction(async tx => {



26

for (const msg of batch) {



27

try {



28

// Convert message to v5 format



29

const v5Message = convertV4MessageToV5(



30

{



31

id: msg.id,



32

content: '',



33

role: msg.role,



34

parts: msg.parts,



35

createdAt: msg.createdAt,



36

},



37

0,



38

);



39



40

// Insert into v5 messages table



41

await tx.insert(messages_v5).values({



42

id: v5Message.id,



43

chatId: msg.chatId,



44

role: v5Message.role,



45

parts: v5Message.parts,



46

createdAt: msg.createdAt,



47

});



48



49

migrated++;



50

} catch (error) {



51

console.error(`Error migrating message ${msg.id}:`, error);



52

errors++;



53

}



54

}



55

});



56



57

console.log(`Progress: ${migrated}/${unmigrated.length} messages migrated`);



58

}



59



60

console.log(`Migration complete: ${migrated} migrated, ${errors} errors`);



61

}



62



63

// Run migration



64

migrateExistingMessages().catch(console.error);
```

This script:

* Only migrates messages that haven't been migrated yet
* Uses batching for better performance
* Can be run multiple times safely
* Can be stopped and resumed

### [Step 4: Verify Migration](#step-4-verify-migration)

Create a verification script to ensure data integrity:

```
1

import { count } from 'drizzle-orm';



2

import { db } from './db';



3

import { messages, messages_v5 } from './db/schema';



4



5

async function verifyMigration() {



6

// Count messages in both schemas



7

const v4Count = await db.select({ count: count() }).from(messages);



8

const v5Count = await db.select({ count: count() }).from(messages_v5);



9



10

console.log('Migration Status:');



11

console.log(`V4 Messages: ${v4Count[0].count}`);



12

console.log(`V5 Messages: ${v5Count[0].count}`);



13

console.log(



14

`Migration progress: ${((v5Count[0].count / v4Count[0].count) * 100).toFixed(2)}%`,



15

);



16

}



17



18

verifyMigration().catch(console.error);
```

### [Step 5: Read from V5 Schema](#step-5-read-from-v5-schema)

Once migration is complete, update your read functions to use the new v5 schema. Since the data is now in v5 format, you don't need conversion:

```
1

import type { MyUIMessage } from './conversion';



2



3

export const loadChat = async (chatId: string): Promise<MyUIMessage[]> => {



4

// Load from v5 schema - no conversion needed



5

const messages = await db



6

.select()



7

.from(messages_v5)



8

.where(eq(messages_v5.chatId, chatId))



9

.orderBy(messages_v5.createdAt);



10



11

return messages;



12

};
```

### [Step 6: Write to V5 Schema Only](#step-6-write-to-v5-schema-only)

Once your read functions work with v5 and your background migration is complete, stop dual-writing and only write to v5:

```
1

import type { MyUIMessage } from './conversion';



2



3

export const upsertMessage = async ({



4

chatId,



5

message,



6

id,



7

}: {



8

id: string;



9

chatId: string;



10

message: MyUIMessage; // Now accepts v5 format



11

}) => {



12

// Write to v5 schema only



13

const [result] = await db



14

.insert(messages_v5)



15

.values({



16

chatId,



17

parts: message.parts ?? [],



18

role: message.role,



19

id,



20

})



21

.onConflictDoUpdate({



22

target: messages_v5.id,



23

set: {



24

parts: message.parts ?? [],



25

chatId,



26

},



27

})



28

.returning();



29



30

return result;



31

};
```

Update your route handler to pass v5 messages directly:

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

export async function POST(req: Request) {



2

const { message, chatId }: { message: MyUIMessage; chatId: string } =



3

await req.json();



4



5

// Pass v5 message directly - no conversion needed



6

await upsertMessage({



7

chatId,



8

id: message.id,



9

message,



10

});



11



12

const previousMessages = await loadChat(chatId);



13

const messages = [...previousMessages, message];



14



15

const result = streamText({



16

model: "xai/grok-4.6",



17

messages: convertToModelMessages(messages),



18

tools: {



19

// Your tools here



20

},



21

});



22



23

return result.toUIMessageStreamResponse({



24

generateMessageId: generateId,



25

originalMessages: messages,



26

onFinish: async ({ responseMessage }) => {



27

await upsertMessage({



28

chatId,



29

id: responseMessage.id,



30

message: responseMessage, // No conversion needed



31

});



32

},



33

});



34

}
```

### [Step 7: Complete the Switch](#step-7-complete-the-switch)

Once verification passes and you're confident in the migration:

1. **Remove conversion functions**: Delete the v4↔v5 conversion utilities
2. **Remove `ai-legacy` dependency**: Uninstall the v4 types package
3. **Test thoroughly**: Ensure your application works correctly with v5 schema
4. **Monitor**: Watch for issues in production
5. **Clean up**: After a safe period (1-2 weeks), drop the old table

```
1

-- After confirming everything works



2

DROP TABLE messages;



3



4

-- Optionally rename v5 table to standard name



5

ALTER TABLE messages_v5 RENAME TO messages;
```

**Phase 2 is now complete.** Your application is fully migrated to v5 schema with no runtime conversion overhead.

[Community Resources](#community-resources)
-------------------------------------------

The following community members have shared their migration experiences:

* [AI SDK Migration: Handling Previously Saved Messages](https://jhakim.com/blog/ai-sdk-migration-handling-previously-saved-messages) - Detailed transformation function implementation
* [How we migrated Atypica.ai to AI SDK v5 without breaking 10M+ chat histories](https://blog.web3nomad.com/p/how-we-migrated-atypicaai-to-ai-sdk-v5-without-breaking-10m-chat-histories) - Runtime conversion approach for large-scale migration

For more API change details, see the [main migration guide](/docs/migration-guides/migration-guide-5-0).

[Previous

Migrate AI SDK 5.x to 6.0](/docs/migration-guides/migration-guide-6-0)[Next

Migrate AI SDK 4.x to 5.0](/docs/migration-guides/migration-guide-5-0)
