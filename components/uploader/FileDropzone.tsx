"use client";

import { MAX_FILE_SIZE_MB } from "@/src/config/site";
import { SUPPORTED_FORMATS } from "@/src/lib/formats";
import { Upload } from "lucide-react";
import {
  ChangeEvent,
  DragEvent,
  KeyboardEvent,
  useId,
  useRef,
  useState,
} from "react";

type FileDropzoneProps = {
  onFilesSelected: (files: File[]) => void;
};

const ACCEPTED_EXTENSIONS = SUPPORTED_FORMATS.flatMap(
  (format) => format.accepts,
).join(",");

export function FileDropzone({ onFilesSelected }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const supportedLabel = SUPPORTED_FORMATS.map((format) => format.name).join(
    " · ",
  );

  function handleFiles(files: FileList | null) {
    const selected = files ? Array.from(files) : [];
    if (selected.length > 0) onFilesSelected(selected);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.stopPropagation();
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
      className={`dropzone ${isDragging ? "is-dragging" : ""}`}
      htmlFor={inputId}
      tabIndex={0}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.stopPropagation();
        setIsDragging(false);
      }}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
    >
      <input
        ref={inputRef}
        id={inputId}
        className="sr-only"
        type="file"
        multiple
        accept={ACCEPTED_EXTENSIONS}
        onChange={handleChange}
      />
      <span className="dropzone-kicker">Drop files here</span>
      <span className="dropzone-title">
        <Upload aria-hidden="true" size={18} strokeWidth={1.8} />
        Choose files
      </span>
      <span className="dropzone-meta">
        {supportedLabel} · up to {MAX_FILE_SIZE_MB} MB
      </span>
    </label>
  );
}
