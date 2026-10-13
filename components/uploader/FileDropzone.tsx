"use client";

import { ChangeEvent, DragEvent, KeyboardEvent, useId, useRef, useState } from "react";
import { MAX_FILE_SIZE_MB } from "@/src/config/site";
import { SUPPORTED_FORMATS } from "@/src/lib/formats";

type FileDropzoneProps = {
  preferredExtension?: string;
  compact?: boolean;
  onFileSelected: (file: File) => void;
};

const ACCEPTED_EXTENSIONS = SUPPORTED_FORMATS.flatMap((format) => format.accepts).join(",");

export function FileDropzone({ preferredExtension, compact = false, onFileSelected }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const supportedLabel = preferredExtension
    ? preferredExtension.toUpperCase()
    : SUPPORTED_FORMATS.map((format) => format.name).join(" · ");

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) onFileSelected(file);
    if (inputRef.current) inputRef.current.value = "";
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

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    handleFiles(event.currentTarget.files);
  }

  return (
    <label
      className={`dropzone ${compact ? "dropzone-compact" : ""} ${isDragging ? "is-dragging" : ""}`}
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
        accept={preferredExtension ? `.${preferredExtension.toLowerCase()}` : ACCEPTED_EXTENSIONS}
        onChange={handleChange}
      />
      <span className="dropzone-kicker">Drop a file here</span>
      <span className="dropzone-title">{preferredExtension ? `Choose a ${preferredExtension.toUpperCase()} file` : "Choose a file"}</span>
      <span className="dropzone-meta">
        {supportedLabel} · up to {MAX_FILE_SIZE_MB} MB
      </span>
    </label>
  );
}
