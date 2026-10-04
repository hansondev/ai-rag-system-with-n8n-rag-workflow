---
title: "ModelMessage"
source_url: https://ai-sdk.dev/docs/reference/ai-sdk-core/model-message
section: reference
crawled: 2026-09-20
---

# ModelMessage

> Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/model-message

[AI SDK Core](/docs/ai-sdk-core)ModelMessage


[`ModelMessage`](#modelmessage)
===============================

`ModelMessage` represents the fundamental message structure used with AI SDK Core functions.
It encompasses various message types that can be used in the `messages` field of any AI SDK Core functions.

You can access the Zod schema for `ModelMessage` with the `modelMessageSchema` export.

[`ModelMessage` Types](#modelmessage-types)
-------------------------------------------

### [`SystemModelMessage`](#systemmodelmessage)

A system message that can contain system information.

```
1

type SystemModelMessage = {



2

role: 'system';



3

content: string;



4

};
```

You can access the Zod schema for `SystemModelMessage` with the `systemModelMessageSchema` export.

Use the top-level `instructions` property instead of a system message for
system instructions. AI SDK functions reject system messages in `prompt` or
`messages` by default unless `allowSystemInMessages` is set to `true`. Opting
in can create a prompt injection risk if users can inject system messages.

### [`UserModelMessage`](#usermodelmessage)

A user message that can contain text or a combination of text, images, and files.

```
1

type UserModelMessage = {



2

role: 'user';



3

content: UserContent;



4

};



5



6

type UserContent = string | Array<TextPart | ImagePart | FilePart>;
```

You can access the Zod schema for `UserModelMessage` with the `userModelMessageSchema` export.

### [`AssistantModelMessage`](#assistantmodelmessage)

An assistant message that can contain text, tool calls, or a combination of both.

```
1

type AssistantModelMessage = {



2

role: 'assistant';



3

content: AssistantContent;



4

};



5



6

type AssistantContent = string | Array<TextPart | CustomPart | ToolCallPart>;
```

You can access the Zod schema for `AssistantModelMessage` with the `assistantModelMessageSchema` export.

### [`ToolModelMessage`](#toolmodelmessage)

A tool message that contains the result of one or more tool calls.

```
1

type ToolModelMessage = {



2

role: 'tool';



3

content: ToolContent;



4

};



5



6

type ToolContent = Array<ToolResultPart>;
```

You can access the Zod schema for `ToolModelMessage` with the `toolModelMessageSchema` export.

[`ModelMessage` Parts](#modelmessage-parts)
-------------------------------------------

### [`TextPart`](#textpart)

Represents a text content part of a prompt. It contains a string of text.

```
1

export interface TextPart {



2

type: 'text';



3

/**



4

* The text content.



5

*/



6

text: string;



7

}
```

### [`ImagePart` Deprecated](#imagepart-deprecated)

`ImagePart` is deprecated. Use [`FilePart`](#filepart) with `mediaType: 'image'` (or a more specific `image/*` subtype) instead.

Represents an image part in a user message.

```
1

/**



2

* @deprecated Use `FilePart` with `mediaType: 'image'` instead.



3

*/



4

export interface ImagePart {



5

type: 'image';



6



7

/**



8

* Image data. Can either be:



9

* - data: a base64-encoded string, a Uint8Array, an ArrayBuffer, or a Buffer



10

* - URL: a URL that points to the image



11

* - ProviderReference: a provider reference from `uploadFile`



12

*/



13

image: DataContent | URL | ProviderReference;



14



15

/**



16

* Optional IANA media type of the image.



17

* We recommend leaving this out as it will be detected automatically.



18

*/



19

mediaType?: string;



20

}
```

### [`FilePart`](#filepart)

Represents a file part in a user message.

```
1

export interface FilePart {



2

type: 'file';



3



4

/**



5

* File data. Use the tagged `FileData` shape.



6

* Bare `DataContent`, `URL`, and `ProviderReference` shorthands are also supported.



7

*/



8

data: FileData | DataContent | URL | ProviderReference;



9



10

/**



11

* Optional filename of the file.



12

*/



13

filename?: string;



14



15

/**



16

* Either a full IANA media type (`type/subtype`, e.g. `image/png`) or just



17

* the top-level IANA segment (e.g. `image`, `audio`, `video`, `text`).



18

*/



19

mediaType: string;



20

}



21



22

export type FileData =



23

// Raw bytes as a base64 string, Uint8Array, ArrayBuffer, or Buffer.



24

| { type: 'data'; data: DataContent }



25

// A URL that points to the file.



26

| { type: 'url'; url: URL }



27

// A provider reference from `uploadFile`.



28

| { type: 'reference'; reference: ProviderReference }



29

// Inline text content.



30

| { type: 'text'; text: string };
```

### [`CustomPart`](#custompart)

Represents a provider-specific custom content part. The `kind` field identifies the content type in the format `{provider}.{provider-type}`.

```
1

export interface CustomPart {



2

type: 'custom';



3



4

/**



5

* The kind of custom content, in the format `{provider}.{provider-type}`.



6

*/



7

kind: `${string}.${string}`;



8



9

/**



10

* Additional provider-specific metadata.



11

*/



12

providerOptions?: ProviderOptions;



13

}
```

### [`ToolCallPart`](#toolcallpart)

Represents a tool call content part of a prompt, typically generated by the AI model.

```
1

export interface ToolCallPart {



2

type: 'tool-call';



3



4

/**



5

* ID of the tool call. This ID is used to match the tool call with the tool result.



6

*/



7

toolCallId: string;



8



9

/**



10

* Name of the tool that is being called.



11

*/



12

toolName: string;



13



14

/**



15

* Arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema.



16

*/



17

args: unknown;



18

}
```

### [`ToolResultPart`](#toolresultpart)

Represents the result of a tool call in a tool message.

```
1

export interface ToolResultPart {



2

type: 'tool-result';



3



4

/**



5

* ID of the tool call that this result is associated with.



6

*/



7

toolCallId: string;



8



9

/**



10

* Name of the tool that generated this result.



11

*/



12

toolName: string;



13



14

/**



15

* Result of the tool call. This is a JSON-serializable object.



16

*/



17

output: LanguageModelV4ToolResultOutput;



18



19

/**



20

Additional provider-specific metadata. They are passed through



21

to the provider from the AI SDK and enable provider-specific



22

functionality that can be fully encapsulated in the provider.



23

*/



24

providerOptions?: ProviderOptions;



25

}
```

### [`LanguageModelV4ToolResultOutput`](#languagemodelv4toolresultoutput)

```
1

/**



2

* Output of a tool result.



3

*/



4

export type ToolResultOutput =



5

| {



6

/**



7

* Text tool output that should be directly sent to the API.



8

*/



9

type: 'text';



10

value: string;



11



12

/**



13

* Provider-specific options.



14

*/



15

providerOptions?: ProviderOptions;



16

}



17

| {



18

type: 'json';



19

value: JSONValue;



20



21

/**



22

* Provider-specific options.



23

*/



24

providerOptions?: ProviderOptions;



25

}



26

| {



27

/**



28

* Type when the user has denied the execution of the tool call.



29

*/



30

type: 'execution-denied';



31



32

/**



33

* Optional reason for the execution denial.



34

*/



35

reason?: string;



36



37

/**



38

* Provider-specific options.



39

*/



40

providerOptions?: ProviderOptions;



41

}



42

| {



43

type: 'error-text';



44

value: string;



45



46

/**



47

* Provider-specific options.



48

*/



49

providerOptions?: ProviderOptions;



50

}



51

| {



52

type: 'error-json';



53

value: JSONValue;



54



55

/**



56

* Provider-specific options.



57

*/



58

providerOptions?: ProviderOptions;



59

}



60

| {



61

type: 'content';



62

value: Array<



63

| {



64

type: 'text';



65



66

/**



67

Text content.



68

*/



69

text: string;



70



71

/**



72

* Provider-specific options.



73

*/



74

providerOptions?: ProviderOptions;



75

}



76

| {



77

/**



78

* @deprecated Use image-data or file-data instead.



79

*/



80

type: 'media';



81

data: string;



82

mediaType: string;



83

}



84

| {



85

type: 'file-data';



86



87

/**



88

Base-64 encoded media data.



89

*/



90

data: string;



91



92

/**



93

IANA media type.



94

@see https://www.iana.org/assignments/media-types/media-types.xhtml



95

*/



96

mediaType: string;



97



98

/**



99

* Optional filename of the file.



100

*/



101

filename?: string;



102



103

/**



104

* Provider-specific options.



105

*/



106

providerOptions?: ProviderOptions;



107

}



108

| {



109

type: 'file-url';



110



111

/**



112

* URL of the file.



113

*/



114

url: string;



115



116

/**



117

* IANA media type of the file.



118

* Used by providers to determine how to handle the file (e.g. image vs document).



119

* Optional; if omitted, the SDK will attempt to infer it from the URL file extension.



120

*/



121

mediaType?: string;



122



123

/**



124

* Provider-specific options.



125

*/



126

providerOptions?: ProviderOptions;



127

}



128

| {



129

/**



130

* @deprecated Use file-reference instead.



131

*/



132

type: 'file-id';



133



134

/**



135

* ID of the file.



136

*



137

* If you use multiple providers, you need to



138

* specify the provider specific ids using



139

* the Record option. The key is the provider



140

* name, e.g. 'openai' or 'anthropic'.



141

*/



142

fileId: string | Record<string, string>;



143



144

/**



145

* Provider-specific options.



146

*/



147

providerOptions?: ProviderOptions;



148

}



149

| {



150

type: 'file-reference';



151



152

/**



153

* Provider-specific references for the file.



154

* The key is the provider name, e.g. 'openai' or 'anthropic'.



155

*/



156

providerReference: ProviderReference;



157



158

/**



159

* Provider-specific options.



160

*/



161

providerOptions?: ProviderOptions;



162

}



163

| {



164

/**



165

* @deprecated Use file-data instead.



166

* Images that are referenced using base64 encoded data.



167

*/



168

type: 'image-data';



169



170

/**



171

Base-64 encoded image data.



172

*/



173

data: string;



174



175

/**



176

IANA media type.



177

@see https://www.iana.org/assignments/media-types/media-types.xhtml



178

*/



179

mediaType: string;



180



181

/**



182

* Provider-specific options.



183

*/



184

providerOptions?: ProviderOptions;



185

}



186

| {



187

/**



188

* @deprecated Use file-url instead.



189

* Images that are referenced using a URL.



190

*/



191

type: 'image-url';



192



193

/**



194

* URL of the image.



195

*/



196

url: string;



197



198

/**



199

* Provider-specific options.



200

*/



201

providerOptions?: ProviderOptions;



202

}



203

| {



204

/**



205

* @deprecated Use file-reference instead.



206

* Images that are referenced using a provider file id.



207

*/



208

type: 'image-file-id';



209



210

/**



211

* Image that is referenced using a provider file id.



212

*



213

* If you use multiple providers, you need to



214

* specify the provider specific ids using



215

* the Record option. The key is the provider



216

* name, e.g. 'openai' or 'anthropic'.



217

*/



218

fileId: string | Record<string, string>;



219



220

/**



221

* Provider-specific options.



222

*/



223

providerOptions?: ProviderOptions;



224

}



225

| {



226

/**



227

* @deprecated Use file-reference instead.



228

* Images that are referenced using a provider reference.



229

*/



230

type: 'image-file-reference';



231



232

/**



233

* Provider-specific references for the image file.



234

* The key is the provider name, e.g. 'openai' or 'anthropic'.



235

*/



236

providerReference: ProviderReference;



237



238

/**



239

* Provider-specific options.



240

*/



241

providerOptions?: ProviderOptions;



242

}



243

| {



244

/**



245

* Custom content part. This can be used to implement



246

* provider-specific content parts.



247

*/



248

type: 'custom';



249



250

/**



251

* Provider-specific options.



252

*/



253

providerOptions?: ProviderOptions;



254

}



255

>;



256

};
```

[Previous

filterActiveTools](/docs/reference/ai-sdk-core/filter-active-tools)[Next

UIMessage](/docs/reference/ai-sdk-core/ui-message)
