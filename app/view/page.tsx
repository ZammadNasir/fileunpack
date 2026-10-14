import type { Metadata } from "next";
import Link from "next/link";
import { ViewerShell } from "@/components/viewer/ViewerShell";
import { siteConfig } from "@/src/config/site";
import { SUPPORTED_FORMATS } from "@/src/lib/formats";

export const metadata: Metadata = {
  title: "Viewer",
  description: `Open and inspect ${SUPPORTED_FORMATS.map((format) => format.name).join(", ")} files directly in your browser.`,
  alternates: { canonical: "/view" },
  openGraph: {
    title: `Viewer | ${siteConfig.name}`,
    description: `Open and inspect ${SUPPORTED_FORMATS.map((format) => format.name).join(", ")} files directly in your browser.`,
    url: "/view",
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function ViewPage() {
  return (
    <main className="view-page">
      <section className="format-hero">
        <Link className="back-link" href="/">
          Back
        </Link>
        <p className="eyebrow">Local viewer</p>
        <h1>Unpack a file in your browser.</h1>
        <p>
          Choose an STL, OBJ, GLB, GLTF, or SVG file to preview it without installing anything.
          Files are processed locally whenever possible.
        </p>
      </section>

      <ViewerShell
        intro={
          <p className="viewer-intro">
            Drop a supported file below. Nothing is uploaded unless a format genuinely requires it.
          </p>
        }
      />

      <p className="local-note mb-12 mt-4">
        Processed locally whenever possible. No account, no upload queue, no ceremony. Up to{" "}
        {siteConfig.maxFileSizeMB} MB per file.
      </p>
    </main>
  );
}
