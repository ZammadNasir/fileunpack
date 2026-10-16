type ViewerToolbarProps = {
  children: React.ReactNode;
};

export function ViewerToolbar({ children }: ViewerToolbarProps) {
  return (
    <div className="viewer-toolbar" aria-label="Viewer controls">
      {children}
    </div>
  );
}
