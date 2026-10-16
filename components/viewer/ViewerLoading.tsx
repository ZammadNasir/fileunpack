export function ViewerLoading() {
  return (
    <div className="viewer-state" role="status" aria-live="polite">
      <div className="loader-line" aria-hidden="true" />
      <strong>Preparing your file...</strong>
      <span>
        Parsing happens locally in your browser for supported formats.
      </span>
    </div>
  );
}
