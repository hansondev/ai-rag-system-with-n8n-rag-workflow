export const ALLOWED_EXTENSIONS = [
  ".txt",
  ".md",
  ".pdf",
  ".docx",
  ".xls",
  ".xlsx",
] as const;

export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export interface UploadedFile {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  size: number;
}

export type UploadValidation =
  | { ok: true; file: UploadedFile }
  | { ok: false; error: string };

function sanitizeFilename(filename: string): string {
  const basename = filename.split(/[/\\]/).pop() || filename;
  const sanitized = basename
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(/^\.+/, "")
    .trim();
  if (!sanitized) return "";
  if (sanitized.length > 255) {
    const ext = sanitized.slice(sanitized.lastIndexOf("."));
    return sanitized.slice(0, 255 - ext.length) + ext;
  }
  return sanitized;
}

export async function validateUpload(file: File): Promise<UploadValidation> {
  const filename = sanitizeFilename(file.name);
  if (!filename) {
    return { ok: false, error: "Invalid filename" };
  }

  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXTENSIONS.some((allowed) => allowed === ext)) {
    return {
      ok: false,
      error: `Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, error: "File exceeds the 10 MB limit" };
  }

  if (file.size === 0) {
    return { ok: false, error: "File is empty" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return {
    ok: true,
    file: { buffer, filename, mimeType: file.type, size: file.size },
  };
}