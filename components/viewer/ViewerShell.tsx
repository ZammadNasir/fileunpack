"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { FileDropzone } from "@/components/uploader/FileDropzone";
import { ViewerLoading } from "@/components/viewer/ViewerLoading";
import { UnsupportedFile } from "@/components/viewer/UnsupportedFile";
import { formatFileSize, validateFile } from "@/src/lib/files";
import { FormatDefinition, getExtension, getFormatFromFile } from "@/src/lib/formats";

const ThreeViewer = dynamic(() => import("@/components/viewers/ThreeViewer").then((mod) => mod.ThreeViewer), {
  ssr: false,
  loading: () => <ViewerLoading />,
});

const SvgViewer = dynamic(() => import("@/components/viewers/SvgViewer").then((mod) => mod.SvgViewer), {
  ssr: false,
  loading: () => <ViewerLoading />,
});

type ViewerShellProps = {
  preferredFormat?: FormatDefinition;
  intro?: React.ReactNode;
};

type Selection =
  | { kind: "empty" }
  | { kind: "unsupported"; extension?: string; message: string }
  | { kind: "ready"; file: File; format: FormatDefinition };

export function ViewerShell({ preferredFormat, intro }: ViewerShellProps) {
  const [selection, setSelection] = useState<Selection>({ kind: "empty" });

  function handleFile(file: File) {
    const validation = validateFile(file);
    if (!validation.ok) {
      setSelection({ kind: "unsupported", extension: validation.extension, message: validation.message });
      return;
    }

    const format = getFormatFromFile(file);
    if (!format) {
      setSelection({ kind: "unsupported", extension: getExtension(file.name), message: "This file type is not supported yet." });
      return;
    }

    if (preferredFormat && format.extension !== preferredFormat.extension) {
      setSelection({
        kind: "unsupported",
        extension: format.extension,
        message: `This page is for ${preferredFormat.name} files. You can still open ${format.name} from the homepage.`,
      });
      return;
    }

    setSelection({ kind: "ready", file, format });
  }

  const fileDetails = useMemo(() => {
    if (selection.kind !== "ready") return null;
    return [
      ["File", selection.file.name],
      ["Type", `${selection.format.name} · ${selection.format.category}`],
      ["Size", formatFileSize(selection.file.size)],
    ];
  }, [selection]);

  return (
    <section className="viewer-shell" aria-label="File viewer">
      {intro}
      <FileDropzone preferredExtension={preferredFormat?.extension} compact={selection.kind === "ready"} onFileSelected={handleFile} />

      {selection.kind === "unsupported" && <UnsupportedFile extension={selection.extension} message={selection.message} />}

      {selection.kind === "ready" && (
        <div className="viewer-card">
          <div className="viewer-heading">
            <div>
              <p className="eyebrow">{selection.format.name} · {selection.format.category}</p>
              <h2>{selection.file.name}</h2>
            </div>
            <button className="text-button" type="button" onClick={() => setSelection({ kind: "empty" })}>
              Clear
            </button>
          </div>

          {selection.format.viewer === "3d" ? (
            <ThreeViewer file={selection.file} extension={selection.format.extension} />
          ) : (
            <SvgViewer file={selection.file} />
          )}

          {selection.format.limitations && <p className="viewer-note">{selection.format.limitations}</p>}

          <dl className="file-details">
            {fileDetails?.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
