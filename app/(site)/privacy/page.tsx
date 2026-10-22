import { siteConfig } from "@/src/config/site";
import type { Metadata } from "next";
import Link from "next/link";

const pageTitle = `Privacy Policy | ${siteConfig.name}`;

const pageDescription =
  `Learn how ${siteConfig.name} handles files, browser processing, ` +
  "technical information, and privacy when you use our online file viewers.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/privacy",
    siteName: siteConfig.name,
    type: "website",
  },
};

const PRIVACY_POINTS = [
  {
    title: "File processing",
    body:
      "Our file viewers are designed to process supported files in your " +
      "browser when the selected viewer supports local processing. In that " +
      "case, the file contents are read by your browser to display the file. " +
      "File handling can vary by format and feature, so check the relevant " +
      "viewer page for its supported formats and limitations.",
  },
  {
    title: "File uploads and server storage",
    body:
      "Opening a file in a browser does not automatically mean that it is " +
      "uploaded to a server. For viewers that process files locally, the " +
      "file contents are not intentionally uploaded for that preview. This " +
      "statement does not cover separate actions you may take, browser " +
      "extensions, or other software running on your device.",
  },
  {
    title: "Browser storage and file retention",
    body:
      "A viewer may temporarily hold file data in browser memory while " +
      "displaying a file. Temporary data may be released when you close " +
      "the page or reload it. Browser downloads, browser caches, and any " +
      "storage used by individual features can behave differently. Do not " +
      "assume that closing a tab securely erases every copy of a file.",
  },
  {
    title: "Accounts and personal information",
    body:
      `${siteConfig.name} is designed to let visitors use its file viewers ` +
      "without creating an account. If you contact us, we will receive the " +
      "information you choose to include in your message, such as your email " +
      "address and the details of your question.",
  },
  {
    title: "Technical information and website operations",
    body:
      "Like other websites, the service may involve technical information " +
      "needed to deliver pages, maintain security, diagnose errors, and " +
      "operate the website. Depending on the hosting provider and the " +
      "services enabled on the site, this may include request information, " +
      "browser details, timestamps, or IP addresses in server logs. The " +
      "information actually collected depends on the deployed configuration.",
  },
  {
    title: "Cookies, analytics, and third-party services",
    body:
      "Hosting, analytics, advertising, embedded resources, or other " +
      "third-party services may process technical information if they are " +
      "enabled on the website. Their use of cookies or similar technologies " +
      "depends on the services configured. Review the site's actual " +
      "configuration and any applicable third-party privacy notices for " +
      "details about which services are active.",
  },
  {
    title: "File size and compatibility",
    body:
      `The configured maximum file size is ${siteConfig.maxFileSizeMB} MB. ` +
      "Individual viewers may have additional format, parsing, or resource " +
      "limitations. Large or complex files can consume significant browser " +
      "memory. A file being accepted by a viewer does not guarantee that " +
      "every feature or every part of the file can be displayed correctly.",
  },
  {
    title: "Security and sensitive files",
    body:
      "We recommend opening only files you trust and keeping your browser " +
      "up to date. Browser-based viewing is not a guarantee of complete " +
      "security or confidentiality. Avoid using a public or shared device " +
      "for sensitive files, and consider whether a file contains confidential " +
      "information before opening it.",
  },
  {
    title: "Children's privacy",
    body:
      "Our file-viewing tools are general-purpose utilities and are not " +
      "specifically designed to collect personal information from children. " +
      "If you believe a child has provided personal information through a " +
      "contact channel, please contact us so we can review the request.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="format-page">
      <section aria-labelledby="privacy-heading" className="format-hero">
        <Link className="back-link" href="/">
          Back to home
        </Link>

        <p className="eyebrow">Privacy policy</p>

        <h1 id="privacy-heading">Your files deserve careful handling.</h1>

        <p>
          {siteConfig.name} provides online tools for viewing and inspecting
          supported file formats. This policy explains how files may be handled
          when you use our viewers, what technical information may be involved
          in operating the website, and how to contact us with privacy
          questions.
        </p>

        <p className="mt-4 text-sm text-ink/65">
          Last updated: October 22, 2026
        </p>
      </section>

      <section aria-labelledby="file-handling-heading" className="mt-10">
        <h2 id="file-handling-heading">How your files are handled</h2>

        <div className="content-grid mt-6">
          {PRIVACY_POINTS.slice(0, 3).map((point) => (
            <article key={point.title}>
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="website-data-heading" className="mt-12">
        <h2 id="website-data-heading">
          Website information and third-party services
        </h2>

        <div className="content-grid mt-6">
          {PRIVACY_POINTS.slice(3, 6).map((point) => (
            <article key={point.title}>
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="additional-privacy-heading" className="mt-12">
        <h2 id="additional-privacy-heading">Additional privacy information</h2>

        <div className="content-grid mt-6">
          {PRIVACY_POINTS.slice(6).map((point) => (
            <article key={point.title}>
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="changes-heading"
        className="mt-12 border-t border-ink/15 pt-8"
      >
        <h2 id="changes-heading">Changes to this policy</h2>

        <p className="mt-3 max-w-3xl leading-relaxed text-ink/75">
          We may update this policy when the website's features, file-processing
          behavior, or data practices change. The latest revision date will be
          shown at the top of this page. Please review this page periodically
          for updates.
        </p>
      </section>

      <section
        aria-labelledby="contact-heading"
        className="mt-10 border-t border-ink/15 pb-10 pt-8"
      >
        <h2 id="contact-heading">Contact us about privacy</h2>

        <p className="mt-3 max-w-3xl leading-relaxed text-ink/75">
          If you have a question about this policy or how the website handles
          information, contact us by email. Please do not attach confidential
          files or sensitive personal information unless it is necessary for
          your request.
        </p>

        <a
          href="mailto:zammadnasir@gmail.com?subject=Privacy%20inquiry"
          className="mt-4 inline-block font-semibold text-sage-deep underline underline-offset-4"
        >
          Contact us about privacy
        </a>
      </section>
    </main>
  );
}
