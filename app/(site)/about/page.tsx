import { siteConfig } from "@/src/config/site";
import { SUPPORTED_FORMATS } from "@/src/lib/formats";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: `${siteConfig.name} is a browser-first viewer for uncommon file formats. Learn what it is and how it is built.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About | ${siteConfig.name}`,
    description: `${siteConfig.name} is a browser-first viewer for uncommon file formats. Learn what it is and how it is built.`,
    url: "/about",
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function AboutPage() {
  const formatCount = SUPPORTED_FORMATS.length;

  return (
    <main className="format-page">
      <section className="format-hero">
        <Link className="back-link" href="/">
          Back
        </Link>
        <p className="eyebrow">About</p>
        <h1>A small tool with a clear job.</h1>
        <p>
          {siteConfig.name} exists for one moment: someone sends you a file, you
          have no idea what opens it, and you just need to see what is inside.
        </p>
      </section>

      <section className="content-grid">
        <article>
          <h2>How it is built</h2>
          <p>
            The viewer layer is a registry rather than a hard-coded switch.
            Every format declares its category, renderer, and documentation as
            data, so adding a format means adding an entry &mdash; not rewriting
            the product.
          </p>
        </article>
        <article>
          <h2>What it supports today</h2>
          <p>
            {formatCount}+ file formats ship in this release. More uncommon formats
            are slotted into the same registry as the viewer architecture grows.
          </p>
        </article>
        <article>
          <h2>Runs cheap on purpose</h2>
          <p>
            No accounts, no database, no upload pipeline. The site is static
            content plus client-side viewers, which keeps it fast to load and
            cheap to run.
          </p>
        </article>
        <article>
          <h2>Feedback</h2>
          <p>
            Broken file? Missing format? Write to{" "}
            <a href="mailto:feedback@fileunpack.com">feedback@fileunpack.com</a>{" "}
            — format requests shape the roadmap.
          </p>
        </article>
      </section>

      <section className="related-section" aria-labelledby="about-formats">
        <h2 id="about-formats">Supported formats</h2>
        <Link
          href="/#formats"
          className="inline-block font-semibold text-sage-deep underline underline-offset-4"
        >
          View all {formatCount}+ supported formats
        </Link>
      </section>
    </main>
  );
}
