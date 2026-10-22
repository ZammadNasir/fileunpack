import { siteConfig } from "@/src/config/site";
import { SUPPORTED_FORMATS } from "@/src/lib/formats";
import type { Metadata } from "next";
import Link from "next/link";

const pageTitle = `About ${siteConfig.name}`;

const pageDescription =
  `${siteConfig.name} helps you open and inspect supported file formats ` +
  "online. Learn how the file viewers work, what they support, and how to request a format.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/about",
    siteName: siteConfig.name,
    type: "website",
  },
};

const PRINCIPLES = [
  {
    title: "Purpose-built file viewers",
    body:
      "Different file formats have different requirements. Each supported " +
      "format has its own viewer configuration and documentation, helping " +
      "you understand how to open a file and which viewing features are " +
      "available. Supported capabilities depend on the format and viewer.",
  },
  {
    title: "Useful information before you begin",
    body:
      "Format guides explain what a file type is used for, how to open it, " +
      "and what limitations to expect. This information can help you choose " +
      "the right viewer and understand when a dedicated editor or another " +
      "specialized application may be necessary.",
  },
  {
    title: "Designed for browser-based access",
    body:
      "The service is designed to make file inspection accessible through " +
      "a compatible web browser without requiring a separate desktop " +
      "application for supported viewing tasks. File compatibility and " +
      "performance depend on the format, file size, browser, and device.",
  },
  {
    title: "Clear about limitations",
    body:
      "Viewing a file is not the same as editing, converting, repairing, " +
      "or validating it. We aim to explain the capabilities and limitations " +
      "of each viewer so you can decide whether it meets your needs.",
  },
];

export default function AboutPage() {
  const formatCount = SUPPORTED_FORMATS.length;

  return (
    <main className="format-page">
      {/* Introduction */}
      <section aria-labelledby="about-heading" className="format-hero">
        <Link className="back-link" href="/">
          Back to home
        </Link>

        <p className="eyebrow">About us</p>

        <h1 id="about-heading">A simpler way to open and inspect files.</h1>

        <p>
          {siteConfig.name} is an online file-viewing service for people who
          need to inspect a file without first finding and installing a
          specialized desktop application. Choose a supported format, open its
          viewer, and explore the file using the controls available for that
          format.
        </p>
      </section>

      {/* What the service offers */}
      <section aria-labelledby="what-we-do-heading" className="mt-10">
        <h2 id="what-we-do-heading">What you can do with {siteConfig.name}</h2>

        <p className="mt-3 max-w-3xl leading-relaxed text-ink/75">
          File extensions can represent very different kinds of information. A
          3D model, document, or structured data file may require a different
          tool to display correctly.
          {` ${siteConfig.name}`} brings supported file viewers together in one
          place and provides format-specific information to help you get
          started.
        </p>

        <div className="content-grid mt-8">
          <article>
            <h3>Find a viewer for your format</h3>
            <p>
              Browse the supported formats and open the viewer associated with
              your file extension. Each format page explains its purpose and
              available viewing features.
            </p>
          </article>

          <article>
            <h3>Inspect supported files</h3>
            <p>
              Use the controls provided by the selected viewer to examine your
              file. For example, a compatible 3D viewer may provide rotation,
              zoom, and alternative display modes.
            </p>
          </article>

          <article>
            <h3>Understand compatibility</h3>
            <p>
              Check format guides for supported file types, opening
              instructions, common issues, and limitations before relying on a
              viewer for a particular task.
            </p>
          </article>

          <article>
            <h3>Know when another tool is needed</h3>
            <p>
              If you need to edit a model, convert a document, repair a mesh, or
              perform specialized analysis, you may need a dedicated application
              that supports those operations.
            </p>
          </article>
        </div>
      </section>

      {/* Product principles */}
      <section aria-labelledby="principles-heading" className="mt-12">
        <h2 id="principles-heading">How we approach file viewing</h2>

        <div className="content-grid mt-6">
          {PRINCIPLES.map((principle) => (
            <article key={principle.title}>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Supported formats */}
      <section
        aria-labelledby="supported-formats-heading"
        className="related-section mt-12 border-t border-ink/15 pt-8"
      >
        <p className="eyebrow">Format directory</p>

        <h2 id="supported-formats-heading">
          {formatCount} supported file formats
        </h2>

        <p className="mt-3 max-w-3xl leading-relaxed text-ink/75">
          The format registry defines the file extensions, viewer
          configurations, and documentation used throughout the site. Available
          formats and features may differ, so visit the relevant guide for
          details about the file you want to open.
        </p>

        <Link
          href="/#formats"
          className="mt-5 inline-block font-semibold text-sage-deep underline underline-offset-4"
        >
          Browse all supported formats
        </Link>
      </section>

      {/* Privacy */}
      <section
        aria-labelledby="privacy-heading"
        className="mt-12 border-t border-ink/15 pt-8"
      >
        <h2 id="privacy-heading">File handling and privacy</h2>

        <p className="mt-3 max-w-3xl leading-relaxed text-ink/75">
          File handling depends on the viewer and its implementation. Our
          browser-based viewing approach is designed to let supported files be
          inspected without sending them to a file-processing server when local
          processing is used. For details about file handling and website data
          practices, read our privacy policy.
        </p>

        <Link
          href="/privacy"
          className="mt-5 inline-block font-semibold text-sage-deep underline underline-offset-4"
        >
          Read our privacy policy
        </Link>
      </section>

      {/* Contact and feedback */}
      <section
        aria-labelledby="feedback-heading"
        className="mt-12 border-t border-ink/15 pb-10 pt-8"
      >
        <h2 id="feedback-heading">Feedback, bugs, and format requests</h2>

        <p className="mt-3 max-w-3xl leading-relaxed text-ink/75">
          File formats and real-world files can behave differently depending on
          how they were created. If a supported file does not open as expected,
          a viewer behaves incorrectly, or you would like us to consider another
          format, please contact us. Helpful details include the file extension,
          browser, and a description of the problem. Avoid sending confidential
          files unless necessary.
        </p>

        <a
          href="mailto:zammadnasir@gmail.com?subject=File%20viewer%20feedback"
          className="mt-5 inline-block font-semibold text-sage-deep underline underline-offset-4"
        >
          Send feedback or request a format
        </a>
      </section>
    </main>
  );
}
