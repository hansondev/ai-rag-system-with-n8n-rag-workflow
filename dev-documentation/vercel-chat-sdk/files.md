---
title: "File Uploads"
source_url: https://chat-sdk.dev/docs/files
section: files
crawled: 2026-09-20
---

# File Uploads

> Source: https://chat-sdk.dev/docs/files

[Send files](#send-files)
-------------------------

Attach files to messages using the `files` property:

lib/bot.ts

```
const reportBuffer = Buffer.from("PDF content");

await thread.post({
  markdown: "Here's the report you requested:",
  files: [
    {
      data: reportBuffer,
      filename: "report.pdf",
      mimeType: "application/pdf",
    },
  ],
});
```

### [Typed attachments](#typed-attachments)

Use `attachments` when you already have normalized `Attachment` objects and the adapter supports typed outgoing media. Telegram uses the native media method for the attachment type:

lib/bot.ts

```
await thread.post({
  markdown: "Here's the image:",
  attachments: [
    {
      data: imageBuffer,
      name: "diagram.png",
      mimeType: "image/png",
      type: "image",
    },
  ],
});
```

Outgoing `attachments` are available on `{ raw }`, `{ markdown }`, and `{ ast }` messages. Card messages use `files` for uploads. Use `files` for generic uploads. On Telegram, `files` always upload as documents, while `attachments` preserve image, audio, video, or file media type. Multiple Telegram `files` or compatible `attachments` are sent as media groups. Use `data` or `fetchData` for private/authenticated files; URL-only attachments must be public URLs Telegram can fetch directly.

### [Multiple files](#multiple-files)

lib/bot.ts

```
await thread.post({
  markdown: "Attached are the images:",
  files: [
    { data: image1, filename: "screenshot1.png" },
    { data: image2, filename: "screenshot2.png" },
  ],
});
```

### [Files without text](#files-without-text)

lib/bot.ts

```
await thread.post({
  markdown: "",
  files: [{ data: buffer, filename: "document.xlsx" }],
});
```

[Receive files](#receive-files)
-------------------------------

Access attachments from incoming messages:

lib/bot.ts

```
bot.onSubscribedMessage(async (thread, message) => {
  for (const attachment of message.attachments ?? []) {
    console.log(`File: ${attachment.name}, Type: ${attachment.mimeType}`);

    if (attachment.fetchData) {
      const data = await attachment.fetchData();
      console.log(`Downloaded ${data.byteLength} bytes`);
    }
  }
});
```

### [Attachment properties](#attachment-properties)

| Property | Type | Description |
| --- | --- | --- |
| `type` | `string` | Attachment type (e.g., "image", "file") |
| `url` | `string` (optional) | Public URL |
| `name` | `string` (optional) | Filename |
| `mimeType` | `string` (optional) | MIME type |
| `size` | `number` (optional) | File size in bytes |
| `width` | `number` (optional) | Image width |
| `height` | `number` (optional) | Image height |
| `fetchData` | `() => Promise<Buffer | ArrayBuffer>` (optional) | Download the file data |
| `fetchMetadata` | `Record<string, string>` (optional) | Platform-specific IDs for reconstructing `fetchData` after serialization |

[Read more](#read-more)
-----------------------

[### Creating a Chat Instance

Initialize the Chat class with adapters, state, and configuration options.](/docs/usage)[### History

Store and retrieve message history across user, thread, and channel scopes.](/docs/history)[### Message Subject

Fetch the parent resource that a message is about.](/docs/subject)[### Overlapping Messages

Control how overlapping messages on the same thread are handled - burst, queue, debounce, drop, or process concurrently.](/docs/concurrency)
