"use client";

import { FileDropzone } from "@/components/uploader/FileDropzone";
import { UnsupportedFile } from "@/components/viewer/UnsupportedFile";
import { ViewerLoading } from "@/components/viewer/ViewerLoading";
import { validateFile } from "@/src/lib/files";
import { FormatDefinition, getFormatFromFile } from "@/src/lib/formats";
import { readPendingFile, savePendingFile } from "@/src/lib/pendingFile";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const ThreeViewer = dynamic(
  () =>
    import("@/components/viewers/ThreeViewer").then((mod) => mod.ThreeViewer),
  {
    ssr: false,
    loading: () => <ViewerLoading />,
  },
);

const SvgViewer = dynamic(
  () => import("@/components/viewers/SvgViewer").then((mod) => mod.SvgViewer),
  {
    ssr: false,
    loading: () => <ViewerLoading />,
  },
);

type Selection =
  | { kind: "loading" }
  | { kind: "empty" }
  | { kind: "unsupported"; extension?: string; message: string }
  | { kind: "ready"; file: File; format: FormatDefinition };

function selectionFromFile(file: File): Selection {
  const validation = validateFile(file);
  if (!validation.ok) {
    return {
      kind: "unsupported",
      extension: validation.extension,
      message: validation.message,
    };
  }

  const format = getFormatFromFile(file);
  if (!format) {
    return {
      kind: "unsupported",
      extension: file.name.includes(".")
        ? file.name.split(".").pop()
        : undefined,
      message: "This file type is not supported yet.",
    };
  }

  return { kind: "ready", file, format };
}

export function FullscreenViewer() {
  const [selection, setSelection] = useState<Selection>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;

    void readPendingFile().then((file) => {
      if (cancelled) return;
      setSelection(file ? selectionFromFile(file) : { kind: "empty" });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleFileSelected(file: File) {
    void savePendingFile(file);
    setSelection(selectionFromFile(file));
  }

  if (selection.kind === "ready") {
    return (
      <div className="fullscreen-viewer">
        <div className="fullscreen-stage">
          {selection.format.viewer === "3d" ? (
            <ThreeViewer
              file={selection.file}
              extension={selection.format.extension}
            />
          ) : (
            <SvgViewer file={selection.file} />
          )}
        </div>
        <Link
          className="fullscreen-close"
          href="/"
          aria-label="Close viewer and return home"
        >
          <X aria-hidden="true" size={20} strokeWidth={1.8} />
        </Link>
      </div>
    );
  }

  return (
    <div className="fullscreen-panel">
      {selection.kind === "unsupported" && (
        <UnsupportedFile
          extension={selection.extension}
          message={selection.message}
        />
      )}
      {selection.kind === "loading" ? (
        <ViewerLoading />
      ) : (
        <>
          <p className="viewer-intro">
            Drop a supported file to view it full screen. Nothing is uploaded
            unless a format genuinely requires it.
          </p>
          <FileDropzone onFileSelected={handleFileSelected} />
        </>
      )}
      <Link className="back-link" href="/">
        Back to home
      </Link>
    </div>
  );
}
