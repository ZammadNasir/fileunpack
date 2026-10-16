import { FullscreenViewer } from "@/components/viewer/FullscreenViewer";
import { siteConfig } from "@/src/config/site";
import { SUPPORTED_FORMATS } from "@/src/lib/formats";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Viewer",
  description: `Open and inspect ${SUPPORTED_FORMATS.map((format) => format.name).join(", ")} files directly in your browser.`,
  alternates: { canonical: "/view" },
  robots: { index: false },
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
    <main className="view-fullscreen">
      <FullscreenViewer />
    </main>
  );
}
