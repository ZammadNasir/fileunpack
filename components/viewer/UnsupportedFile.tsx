type UnsupportedFileProps = {
  extension?: string;
  message?: string;
};

export function UnsupportedFile({ extension, message }: UnsupportedFileProps) {
  return (
    <div className="unsupported-panel" role="status">
      <p className="eyebrow">Unsupported format</p>
      <h2>
        {extension
          ? `We don't support .${extension} yet.`
          : "We couldn't identify this file type."}
      </h2>
      <p>
        {message ??
          "This viewer currently supports STL, OBJ, GLB, GLTF, SVG, and RTF files."}
      </p>
    </div>
  );
}
