"use client";

import { MAX_FILE_SIZE_MB } from "@/src/config/site";
import { validateFile } from "@/src/lib/files";
import {
  FormatDefinition,
  getFormatFromFile,
  SUPPORTED_FORMATS,
} from "@/src/lib/formats";
import { savePendingFile } from "@/src/lib/pendingFile";
import { AlertCircle, LoaderCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  DragEvent,
  KeyboardEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const ALL_EXTENSIONS = SUPPORTED_FORMATS.flatMap(
  (format) => format.accepts,
).join(",");

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

  useLayoutEffect(() => {
    return () => {
      setStatus("idle");
      setMessage("");
      setIsDragging(false);
    };
  }, []);

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
      className={`drop-card ${isDragging ? "is-dragging" : ""} ${status === "error" ? "has-error" : ""}`}
      htmlFor={inputId}
      tabIndex={0}
      aria-busy={status === "working"}
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
        accept={
          preferredFormat ? `.${preferredFormat.extension}` : ALL_EXTENSIONS
        }
        onChange={handleChange}
      />
      <span className="drop-card-content">
        <span className="drop-card-kicker">
          {preferredFormat ? `${preferredFormat.name} viewer` : "Choose a file"}
        </span>
        <span className="drop-card-title">
          Drop {preferredFormat ? `${preferredFormat.name} File` : "File"}
        </span>
        <span
          className="drop-card-description"
          aria-live="polite"
          role={status === "error" ? "alert" : undefined}
        >
          {status === "working"
            ? "Processing locally, opening the viewer..."
            : status === "error"
              ? message
              : idleBody}
        </span>
        <span className="drop-card-cta">
          {status === "working" ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" size={18} strokeWidth={1.8} />
          ) : status === "error" ? (
              <AlertCircle aria-hidden="true" size={18} strokeWidth={1.8} />
          ) : (
              <Upload aria-hidden="true" size={18} strokeWidth={1.8} />
          )}
          {status === "working"
              ? "Opening viewer..."
              : status === "error"
                ? "Try another file"
              : idleCta}
        </span>
      </span>
    </label>
  );
}
