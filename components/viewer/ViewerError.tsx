type ViewerErrorProps = {
  title?: string;
  message: string;
};

export function ViewerError({
  title = "We couldn't read this file.",
  message,
}: ViewerErrorProps) {
  return (
    <div className="viewer-state viewer-state-error" role="alert">
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );
}
