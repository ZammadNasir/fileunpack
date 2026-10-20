"use client";

import { ViewerError } from "@/components/viewer/ViewerError";
import { ViewerLoading } from "@/components/viewer/ViewerLoading";
import { ViewerToolbar } from "@/components/viewer/ViewerToolbar";
import { Maximize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EMFJS, RTFJS, WMFJS } from "rtf.js";

type RtfViewerProps = {
  file: File;
};

type RtfState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; markup: string; details: string };

export function RtfViewer({ file }: RtfViewerProps) {
  const [state, setState] = useState<RtfState>({ status: "loading" });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setState({ status: "loading" });

        RTFJS.loggingEnabled(false);
        WMFJS.loggingEnabled(false);
        EMFJS.loggingEnabled(false);

        const buffer = await file.arrayBuffer();
        const doc = new RTFJS.Document(buffer, {
          onHyperlink(create, hyperlink) {
            const element = create();
            try {
              element.title = hyperlink.url();
            } catch {
              // Keep the link text if the URL cannot be read.
            }
            element.removeAttribute("href");
            element.removeAttribute("target");
            return { element, content: element };
          },
        });

        const elements = await doc.render();
        if (cancelled) return;

        const host = document.createElement("div");
        host.append(...elements);
        setState({
          status: "ready",
          markup: host.innerHTML,
          details: describeDocument(doc.metadata(), elements.length),
        });
      } catch {
        if (!cancelled) {
          setState({
            status: "error",
            message:
              "The file may be malformed RTF or contain content that cannot be safely displayed.",
          });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [file]);

  const srcDoc = useMemo(() => {
    if (state.status !== "ready") return "";
    return `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;min-height:100%;background:#e6e7e3}body{padding:28px;display:flex;justify-content:center;align-items:flex-start}.rtf-page{background:#fff;box-shadow:0 1px 10px rgba(15,23,42,.16);width:816px;min-height:1056px;padding:96px;box-sizing:border-box;font-family:Calibri,"Segoe UI",Arial,sans-serif;font-size:11pt;color:#111;line-height:1.45;overflow-wrap:break-word}.rtf-page a{color:inherit;text-decoration:underline;text-decoration-style:dotted;cursor:default;pointer-events:none}.rtf-page img{max-width:100%;height:auto}.rtf-page svg{max-width:100%}.rtf-page table{border-collapse:collapse}.rtf-page td,.rtf-page th{vertical-align:top}</style></head><body><div class="rtf-page">${state.markup}</div></body></html>`;
  }, [state]);

  function reset() {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }

  function fit() {
    reset();
  }

  return (
    <div className="viewer-block">
      <div
        className={`rtf-frame ${isPanning ? "is-panning" : ""}`}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setIsPanning(true);
        }}
        onPointerMove={(event) => {
          if (!isPanning) return;
          setOffset((current) => ({
            x: current.x + event.movementX,
            y: current.y + event.movementY,
          }));
        }}
        onPointerUp={() => setIsPanning(false)}
        onPointerCancel={() => setIsPanning(false)}
      >
        {state.status === "ready" && (
          <iframe
            title="RTF preview"
            sandbox=""
            srcDoc={srcDoc}
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            }}
          />
        )}
      </div>
      {state.status === "loading" && <ViewerLoading />}
      {state.status === "error" && <ViewerError message={state.message} />}
      <ViewerToolbar>
        <button
          type="button"
          className="viewer-control"
          disabled={scale <= 0.25}
          onClick={() => setScale((value) => Math.max(0.25, value - 0.25))}
        >
          <ZoomOut aria-hidden="true" size={16} strokeWidth={1.8} />
          Zoom out
        </button>
        <button
          type="button"
          className="viewer-control"
          disabled={scale >= 5}
          onClick={() => setScale((value) => Math.min(5, value + 0.25))}
        >
          <ZoomIn aria-hidden="true" size={16} strokeWidth={1.8} />
          Zoom in
        </button>
        <button type="button" className="viewer-control" onClick={fit}>
          <Maximize2 aria-hidden="true" size={16} strokeWidth={1.8} />
          Fit
        </button>
        <button type="button" className="viewer-control" onClick={reset}>
          <RotateCcw aria-hidden="true" size={16} strokeWidth={1.8} />
          Reset
        </button>
      </ViewerToolbar>
      {state.status === "ready" && (
        <p className="viewer-note">{state.details} · Drag to pan</p>
      )}
    </div>
  );
}

function describeDocument(
  metadata: Record<string, unknown>,
  blockCount: number,
) {
  const parts: string[] = [];
  const title = readTextMetadata(metadata.title);
  const author = readTextMetadata(metadata.author);
  if (title) parts.push(title);
  if (author) parts.push(author);
  parts.push(`${blockCount} paragraph${blockCount === 1 ? "" : "s"}`);
  return parts.join(" · ");
}

function readTextMetadata(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
