"use client";

import { ChangeEvent, DragEvent, KeyboardEvent, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MAX_FILE_SIZE_MB } from "@/src/config/site";
import { validateFile } from "@/src/lib/files";
import { FormatDefinition, getFormatFromFile, SUPPORTED_FORMATS } from "@/src/lib/formats";
import { savePendingFile } from "@/src/lib/pendingFile";

const ALL_EXTENSIONS = SUPPORTED_FORMATS.flatMap((format) => format.accepts).join(",");

type DropFileCardProps = {
  preferredFormat?: FormatDefinition;
};

export function DropFileCard({ preferredFormat }: DropFileCardProps) {
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");

  const idleBody = preferredFormat
    ? `Choose or drag a ${preferredFormat.name} file to view it full screen in your browser.`
    : "Choose or drag a file to unpack its contents locally in your browser.";
  const idleCta = preferredFormat
    ? `Choose a .${preferredFormat.extension} file · up to ${MAX_FILE_SIZE_MB} MB`
    : `Choose a file · up to ${MAX_FILE_SIZE_MB} MB`;

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.ok) {
      setStatus("error");
      setMessage(validation.message);
      return;
    }

    if (preferredFormat) {
      const detected = getFormatFromFile(file);
      if (detected?.extension !== preferredFormat.extension) {
        setStatus("error");
        setMessage(
          `This page is for ${preferredFormat.name} files. Open ${detected?.name ?? "other formats"} from the homepage.`,
        );
        return;
      }
    }

    setStatus("working");
    setMessage("");
    void (async () => {
      await savePendingFile(file);
      router.push("/view");
    })();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    handleFiles(event.currentTarget.files);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLLabelElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current?.click();
    }
  }

  return (
    <label
      className={`group relative flex min-h-0 min-w-0 cursor-pointer flex-col justify-center overflow-hidden border-b border-ink/20 bg-mist px-6 py-8 md:px-10 lg:py-12 max-lg:border-r ${
        isDragging ? "outline-2 -outline-offset-2 outline-ink" : ""
      }`}
      htmlFor={inputId}
      tabIndex={0}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
    >
      <input
        ref={inputRef}
        id={inputId}
        className="sr-only"
        type="file"
        accept={preferredFormat ? `.${preferredFormat.extension}` : ALL_EXTENSIONS}
        onChange={handleChange}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#8f9187] [clip-path:polygon(100%_0,100%_100%,0_100%)]"
      />
      <span className="relative">
        <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
          {preferredFormat ? `${preferredFormat.name}_Picker` : "Action_01"}
        </span>
        <span className="mt-3 block font-display text-[clamp(1.5rem,4vw,3.4rem)] font-black leading-none text-ink">
          Drop {preferredFormat ? `${preferredFormat.name} File` : "File"}
        </span>
        <span className="mt-4 block max-w-xs text-[0.98rem] leading-relaxed text-ink/80">
          {status === "working"
            ? "Processing locally, opening the viewer..."
            : status === "error"
              ? message
              : idleBody}
        </span>
        <span
          className={`mt-5 block font-mono text-xs uppercase tracking-widest underline underline-offset-4 ${
            status === "error" ? "text-[#9d2d22]" : "text-ink group-hover:text-sage-deep"
          }`}
        >
          {status === "working" ? "Working..." : status === "error" ? "Try another file" : idleCta}
        </span>
      </span>
    </label>
  );
}
