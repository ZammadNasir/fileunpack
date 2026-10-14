import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/src/config/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `${siteConfig.name} processes files in your browser whenever possible. Read how files are handled.`,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `Privacy | ${siteConfig.name}`,
    description: `${siteConfig.name} processes files in your browser whenever possible. Read how files are handled.`,
    url: "/privacy",
    siteName: siteConfig.name,
    type: "website",
  },
};

const POINTS = [
  {
    title: "Local by default",
    body: "For every currently supported format, parsing and rendering happen inside your browser tab. Your file never has to reach a server just to be previewed.",
  },
  {
    title: "No accounts, no storage",
    body: "There are no user accounts and no server-side file storage. Once you close or refresh the tab, the file is gone from the viewer.",
  },
  {
    title: "No third-party uploads",
    body: "Files are not sent to external services, analytics, or CDNs. If a future format ever requires server-side processing, it will be disclosed before it happens.",
  },
  {
    title: "Sensible limits",
    body: `Files larger than ${siteConfig.maxFileSizeMB} MB are rejected client-side so the tab stays responsive. Validation happens before any work starts.`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="format-page">
      <section className="format-hero">
        <Link className="back-link" href="/">
          Back
        </Link>
        <p className="eyebrow">Privacy</p>
        <h1>Your files are yours.</h1>
        <p>
          {siteConfig.name} is built browser-first: supported files are processed directly in your
          browser whenever possible, so there is no reason to keep them on a server.
        </p>
      </section>

      <section className="content-grid">
        {POINTS.map((point) => (
          <article key={point.title}>
            <h2>{point.title}</h2>
            <p>{point.body}</p>
          </article>
        ))}
      </section>

      <p className="local-note mb-6 mt-10">
        Questions about data handling? Reach us at{" "}
        <a href="mailto:feedback@fileunpack.com">feedback@fileunpack.com</a>.
      </p>
    </main>
  );
}
