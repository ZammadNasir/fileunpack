"use client";

import { ViewerError } from "@/components/viewer/ViewerError";
import { ViewerLoading } from "@/components/viewer/ViewerLoading";
import { ViewerToolbar } from "@/components/viewer/ViewerToolbar";
import { Maximize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type SvgViewerProps = {
  file: File;
};

type SvgState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; markup: string; dimensions: string };

export function SvgViewer({ file }: SvgViewerProps) {
  const [state, setState] = useState<SvgState>({ status: "loading" });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setState({ status: "loading" });
        const raw = await file.text();
        const parsed = sanitizeSvg(raw);
        if (!cancelled)
          setState({
            status: "ready",
            markup: parsed.markup,
            dimensions: parsed.dimensions,
          });
      } catch {
        if (!cancelled) {
          setState({
            status: "error",
            message:
              "The file may be malformed SVG or may contain markup that cannot be safely displayed.",
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
    return `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:100%;height:100%;display:grid;place-items:center;background:#f7f8f4}svg{max-width:100%;max-height:100%;display:block}</style></head><body>${state.markup}</body></html>`;
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
        className={`svg-frame ${isPanning ? "is-panning" : ""}`}
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
            title="SVG preview"
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
        <p className="viewer-note">
          Dimensions: {state.dimensions} · Drag to pan
        </p>
      )}
    </div>
  );
}

function sanitizeSvg(raw: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(raw, "image/svg+xml");
  if (doc.querySelector("parsererror")) throw new Error("Invalid SVG");

  const svg = doc.documentElement;
  if (svg.tagName.toLowerCase() !== "svg") throw new Error("Not an SVG");

  const blockedTags = new Set([
    "script",
    "foreignobject",
    "iframe",
    "object",
    "embed",
    "audio",
    "video",
    "canvas",
  ]);
  const walker = doc.createTreeWalker(svg, NodeFilter.SHOW_ELEMENT);
  const toRemove: Element[] = [];

  while (walker.nextNode()) {
    const element = walker.currentNode as Element;
    if (blockedTags.has(element.tagName.toLowerCase())) {
      toRemove.push(element);
      continue;
    }

    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      if (
        name.startsWith("on") ||
        value.startsWith("javascript:") ||
        value.includes("url(javascript:")
      ) {
        element.removeAttribute(attribute.name);
      }
      if (
        (name === "href" || name.endsWith(":href")) &&
        value.startsWith("data:text/html")
      ) {
        element.removeAttribute(attribute.name);
      }
    }
  }

  toRemove.forEach((element) => element.remove());

  const width = svg.getAttribute("width");
  const height = svg.getAttribute("height");
  const viewBox = svg.getAttribute("viewBox");
  const dimensions =
    width && height
      ? `${width} × ${height}`
      : viewBox
        ? `viewBox ${viewBox}`
        : "not declared";

  return {
    markup: new XMLSerializer().serializeToString(svg),
    dimensions,
  };
}
