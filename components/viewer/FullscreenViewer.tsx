"use client";

import { FileDropzone } from "@/components/uploader/FileDropzone";
import { UnsupportedFile } from "@/components/viewer/UnsupportedFile";
import { ViewerLoading } from "@/components/viewer/ViewerLoading";
import { formatFileSize, validateFile } from "@/src/lib/files";
import {
  FormatDefinition,
  getExtension,
  getFormatFromFile,
  SUPPORTED_FORMATS,
} from "@/src/lib/formats";
import {
  clearPendingFile,
  readPendingFile,
  savePendingFile,
} from "@/src/lib/pendingFile";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, PanelLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

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

const ACCEPTED_EXTENSIONS = SUPPORTED_FORMATS.flatMap(
  (format) => format.accepts,
).join(",");

type RejectedReason = "empty" | "too-large" | "unsupported";

type EntryStatus =
  | { kind: "ready"; format: FormatDefinition }
  | {
      kind: "rejected";
      reason: RejectedReason;
      extension?: string;
      message: string;
    };

type ViewerEntry = {
  id: string;
  file: File;
  status: EntryStatus;
};

type Session =
  | { kind: "loading" }
  | { kind: "empty" }
  | { kind: "active"; entries: ViewerEntry[]; activeId: string };

const REASON_LABEL: Record<RejectedReason, string> = {
  empty: "Empty file",
  "too-large": "Too large",
  unsupported: "Unsupported",
};

let entryCounter = 0;

function statusFromFile(file: File): EntryStatus {
  const validation = validateFile(file);
  if (!validation.ok) {
    return {
      kind: "rejected",
      reason: validation.reason,
      extension: validation.extension,
      message: validation.message,
    };
  }

  const format = getFormatFromFile(file);
  if (!format) {
    return {
      kind: "rejected",
      reason: "unsupported",
      extension: getExtension(file.name) || undefined,
      message: "This file type is not supported yet.",
    };
  }

  return { kind: "ready", format };
}

function createEntry(file: File): ViewerEntry {
  entryCounter += 1;
  return { id: `file-${entryCounter}`, file, status: statusFromFile(file) };
}

function fileKey(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function renderActiveEntry(entry: ViewerEntry) {
  if (entry.status.kind === "rejected") {
    return (
      <UnsupportedFile
        extension={entry.status.extension}
        message={entry.status.message}
      />
    );
  }

  const format = entry.status.format;
  switch (format.viewer) {
    case "3d":
      return (
        <ThreeViewer
          key={entry.id}
          file={entry.file}
          extension={format.extension}
        />
      );
    case "svg":
      return <SvgViewer key={entry.id} file={entry.file} />;
    default:
      return (
        <UnsupportedFile
          key={entry.id}
          extension={format.extension}
          message={`A previewer for .${format.extension} is not available yet.`}
        />
      );
  }
}

export function FullscreenViewer() {
  const [session, setSession] = useState<Session>({ kind: "loading" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const addInputRef = useRef<HTMLInputElement>(null);
  const persistRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let cancelled = false;

    void readPendingFile().then((file) => {
      if (cancelled) return;
      setSession((current) => {
        if (!file) {
          return current.kind === "loading" ? { kind: "empty" } : current;
        }

        if (current.kind === "active") {
          const key = fileKey(file);
          const existing = current.entries.find(
            (entry) => fileKey(entry.file) === key,
          );
          if (existing) {
            return { ...current, activeId: existing.id };
          }
          const entry = createEntry(file);
          return {
            kind: "active",
            entries: [...current.entries, entry],
            activeId: entry.id,
          };
        }

        const entry = createEntry(file);
        return { kind: "active", entries: [entry], activeId: entry.id };
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    return () => {
      setIsDragging(false);
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const sync = () => setSidebarOpen(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (session.kind !== "active") return;
    const active = session.entries.find(
      (entry) => entry.id === session.activeId,
    );
    if (active) {
      persistRef.current = persistRef.current
        .then(() => savePendingFile(active.file))
        .catch(() => undefined);
    }
  }, [session]);

  useEffect(() => {
    if (session.kind !== "empty") return;
    persistRef.current = persistRef.current
      .then(() => clearPendingFile())
      .catch(() => undefined);
  }, [session.kind]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "Escape") {
        setSidebarOpen(false);
        return;
      }

      if (session.kind !== "active" || session.entries.length < 2) return;

      const index = session.entries.findIndex(
        (entry) => entry.id === session.activeId,
      );
      if (index < 0) return;

      let nextIndex = index;
      if (event.key === "ArrowDown") {
        nextIndex = Math.min(index + 1, session.entries.length - 1);
      } else if (event.key === "ArrowUp") {
        nextIndex = Math.max(index - 1, 0);
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = session.entries.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      if (nextIndex === index) return;
      setSession({
        ...session,
        activeId: session.entries[nextIndex].id,
      });
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [session]);

  function addFiles(files: FileList | File[] | null) {
    if (!files) return;
    const incoming = Array.from(files);
    if (incoming.length === 0) return;

    setSession((current) => {
      const existing =
        current.kind === "active"
          ? new Set(current.entries.map((entry) => fileKey(entry.file)))
          : new Set<string>();
      const added = incoming
        .filter((file) => !existing.has(fileKey(file)))
        .map(createEntry);
      if (added.length === 0) return current;

      if (current.kind === "active") {
        return {
          kind: "active",
          entries: [...current.entries, ...added],
          activeId: added[0].id,
        };
      }
      if (current.kind === "empty") {
        return { kind: "active", entries: added, activeId: added[0].id };
      }
      return current;
    });
  }

  function selectEntry(id: string) {
    setSession((current) =>
      current.kind === "active" ? { ...current, activeId: id } : current,
    );
  }

  function removeEntry(id: string) {
    setSession((current) => {
      if (current.kind !== "active") return current;
      const index = current.entries.findIndex((entry) => entry.id === id);
      if (index < 0) return current;

      const entries = current.entries.filter((entry) => entry.id !== id);
      if (entries.length === 0) return { kind: "empty" };

      const activeId =
        current.activeId === id
          ? entries[Math.min(index, entries.length - 1)].id
          : current.activeId;
      return { kind: "active", entries, activeId };
    });
  }

  if (session.kind === "active") {
    const foundIndex = session.entries.findIndex(
      (entry) => entry.id === session.activeId,
    );
    const activeIndex = foundIndex >= 0 ? foundIndex : 0;
    const active = session.entries[activeIndex];
    const total = session.entries.length;
    const chip =
      active.status.kind === "ready"
        ? active.status.format.extension
        : getExtension(active.file.name) || "—";

    return (
      <div
        className={`fullscreen-viewer${isDragging ? " is-dragging" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          if (event.currentTarget.contains(event.relatedTarget as Node | null))
            return;
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        {sidebarOpen && (
          <button
            type="button"
            className="viewer-files-backdrop"
            tabIndex={-1}
            aria-label="Close file list"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          id="viewer-files"
          className={`viewer-files ${sidebarOpen ? "is-open" : "is-collapsed"}`}
          aria-label="Open files"
        >
          <div className="viewer-files-head">
            <span className="viewer-files-title">
              Files <span className="viewer-files-count">{total}</span>
            </span>
            <button
              type="button"
              className="viewer-files-toggle"
              aria-label="Hide file list"
              onClick={() => setSidebarOpen(false)}
            >
              <X aria-hidden="true" size={16} strokeWidth={1.8} />
            </button>
          </div>
          <ul className="viewer-files-list">
            {session.entries.map((entry) => {
              const isActive = entry.id === active.id;
              const extension =
                entry.status.kind === "ready"
                  ? entry.status.format.extension
                  : getExtension(entry.file.name);
              return (
                <li
                  key={entry.id}
                  className={`viewer-file${isActive ? " is-active" : ""}${
                    entry.status.kind === "rejected" ? " is-rejected" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="viewer-file-select"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => selectEntry(entry.id)}
                  >
                    <span className="viewer-file-chip">
                      {extension || "—"}
                    </span>
                    <span className="viewer-file-text">
                      <span className="viewer-file-name">{entry.file.name}</span>
                      <span className="viewer-file-sub">
                        {entry.status.kind === "ready"
                          ? formatFileSize(entry.file.size)
                          : REASON_LABEL[entry.status.reason]}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="viewer-file-remove"
                    aria-label={`Remove ${entry.file.name}`}
                    onClick={() => removeEntry(entry.id)}
                  >
                    <X aria-hidden="true" size={14} strokeWidth={2} />
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="viewer-files-foot">
            <button
              type="button"
              className="viewer-control viewer-files-add"
              onClick={() => addInputRef.current?.click()}
            >
              <Plus aria-hidden="true" size={16} strokeWidth={1.8} />
              Add files
            </button>
            <input
              ref={addInputRef}
              className="sr-only"
              type="file"
              multiple
              accept={ACCEPTED_EXTENSIONS}
              onChange={(event) => {
                addFiles(event.currentTarget.files);
                event.currentTarget.value = "";
              }}
            />
          </div>
        </aside>

        <div className="fullscreen-stage">
          <header className="viewer-topbar">
            <button
              type="button"
              className="viewer-control viewer-topbar-toggle"
              aria-label={`Files (${total})`}
              aria-expanded={sidebarOpen}
              aria-controls="viewer-files"
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <PanelLeft aria-hidden="true" size={16} strokeWidth={1.8} />
              <span className="viewer-topbar-toggle-label">
                Files <span className="viewer-topbar-toggle-count">{total}</span>
              </span>
            </button>
            <div className="viewer-topbar-file">
              <span className="viewer-topbar-chip">{chip}</span>
              <span className="viewer-topbar-name" title={active.file.name}>
                {active.file.name}
              </span>
            </div>
            <span className="viewer-topbar-count">
              {activeIndex + 1} / {total}
            </span>
            <span className="sr-only" aria-live="polite">
              {`File ${activeIndex + 1} of ${total}: ${active.file.name}`}
            </span>
            <div className="viewer-topbar-actions">
              <button
                type="button"
                className="viewer-control viewer-topbar-nav"
                aria-label="Previous file"
                disabled={activeIndex === 0}
                onClick={() =>
                  selectEntry(session.entries[activeIndex - 1].id)
                }
              >
                <ChevronLeft aria-hidden="true" size={16} strokeWidth={1.8} />
              </button>
              <button
                type="button"
                className="viewer-control viewer-topbar-nav"
                aria-label="Next file"
                disabled={activeIndex === total - 1}
                onClick={() =>
                  selectEntry(session.entries[activeIndex + 1].id)
                }
              >
                <ChevronRight aria-hidden="true" size={16} strokeWidth={1.8} />
              </button>
              <Link
                className="fullscreen-close"
                href="/"
                aria-label="Close viewer and return home"
              >
                <X aria-hidden="true" size={20} strokeWidth={1.8} />
              </Link>
            </div>
          </header>
          <div className="fullscreen-stage-body">
            {isDragging && (
              <div className="viewer-drop-hint">Drop to add files</div>
            )}
            {renderActiveEntry(active)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fullscreen-panel">
      {session.kind === "loading" ? (
        <ViewerLoading />
      ) : (
        <>
          <p className="viewer-intro">
            Drop one or more supported files to view them full screen. Nothing
            is uploaded unless a format genuinely requires it.
          </p>
          <FileDropzone onFilesSelected={addFiles} />
        </>
      )}
      <Link className="back-link" href="/">
        Back to home
      </Link>
    </div>
  );
}
