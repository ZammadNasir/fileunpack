import { MAX_FILE_SIZE_MB } from "@/src/config/site";
import { getExtension, getFormatFromFile } from "@/src/lib/formats";

export type FileValidationResult =
  | { ok: true }
  | { ok: false; reason: "empty" | "too-large" | "unsupported"; message: string; extension?: string };

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = units.shift() ?? "KB";
  while (value >= 1024 && units.length > 0) {
    value /= 1024;
    unit = units.shift() ?? unit;
  }
  return `${value.toFixed(value >= 10 ? 1 : 2)} ${unit}`;
}

export function validateFile(file: File): FileValidationResult {
  if (file.size === 0) {
    return { ok: false, reason: "empty", message: "This file is empty, so there is nothing to preview." };
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return {
      ok: false,
      reason: "too-large",
      message: `This file is too large to process comfortably in your browser. The current limit is ${MAX_FILE_SIZE_MB} MB.`,
    };
  }

  const format = getFormatFromFile(file);
  if (!format) {
    const extension = getExtension(file.name);
    return {
      ok: false,
      reason: "unsupported",
      extension,
      message: extension ? `We don't support .${extension} yet.` : "We couldn't identify this file type from its extension.",
    };
  }

  return { ok: true };
}
