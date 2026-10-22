import { DropFileCard } from "@/components/uploader/DropFileCard";
import { siteConfig } from "@/src/config/site";
import { SUPPORTED_FORMATS, getCategories } from "@/src/lib/formats";
import type { Metadata } from "next";
import Link from "next/link";

const formatCount = SUPPORTED_FORMATS.length;
const formatNames = SUPPORTED_FORMATS.map((format) => format.name);
const formatsForMetadata = formatNames.join(", ");
const homeTitle = `Online File Viewer for ${formatsForMetadata} | ${siteConfig.name}`;
const homeDescription = `Open ${formatCount}+ file formats online. Preview 3D models, vector images, and more in your browser—no installation, account, or file upload required.`;

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: homeTitle,
    description: homeDescription,
  },
};

const STEPS = [
  {
    number: "01",
    title: "Choose a file",
    body: "Click the uploader or drop a supported file onto the page.",
  },
  {
    number: "02",
    title: "We identify the format",
    body: "The extension is normalized and matched against the format registry.",
  },
  {
    number: "03",
    title: "View it instantly",
    body: "The right browser viewer loads only when it is actually needed.",
  },
];

const TICKER_CATEGORIES = getCategories().map((category) => ({
  category,
  formats: SUPPORTED_FORMATS.filter((format) => format.category === category),
}));

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    description: homeDescription,
    featureList: formatNames.map((format) => `${format} file viewer`),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      {/* Hero */}
      <section
        aria-labelledby="home-heading"
        className="hero-grid grid min-w-0 grid-cols-1 border-b border-ink/15 lg:grid-cols-2"
      >
        <div className="hero-copy flex min-w-0 flex-col justify-between gap-12 bg-sage px-6 py-10 md:px-10 md:py-14 lg:px-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
            Online file viewers
          </p>

          <div>
            <h1
              id="home-heading"
              className="max-w-none font-display text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.88] tracking-[-0.03em] text-ink"
            >
              Open and inspect files in your browser.
            </h1>

            <p className="mt-7 max-w-lg text-[1.05rem] leading-relaxed text-ink/80">
              Choose a file, open the matching viewer, and inspect supported
              formats without installing specialized desktop software. Explore
              3D models, documents, images, and other supported file types in
              one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#formats"
                className="inline-flex min-h-12 items-center justify-center bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-deep focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                Explore file viewers
              </a>

              <a
                href="#how-it-works"
                className="inline-flex min-h-12 items-center justify-center border border-ink/25 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-white/50 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                How it works
              </a>
            </div>
          </div>

          <div className="max-w-md">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
              At a glance
            </p>

            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink/75">
              <li>{formatCount} supported file formats</li>
              <li>Format-specific viewing tools and controls</li>
              <li>No account required for the described viewing workflow</li>
            </ul>
          </div>
        </div>

        <div className="hero-actions grid min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
          <div className="min-w-0">
            <DropFileCard />
          </div>

          <a
            href="#formats"
            className="hero-action flex min-w-0 flex-col justify-center border-b border-ink/15 bg-white px-6 py-8 transition-colors hover:bg-mist focus-visible:outline focus-visible:outline-ink md:px-10 lg:py-12"
          >
            <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
              Find your format
            </span>

            <span className="mt-3 block font-display text-[clamp(1.25rem,3.5vw,2.8rem)] font-black leading-none text-sage-deep">
              Browse supported viewers
            </span>

            <span className="mt-4 block max-w-xs text-[0.98rem] leading-relaxed text-ink/80">
              Choose a file format to see its supported features, opening
              instructions, and format-specific guidance.
            </span>
          </a>
        </div>
      </section>

      {/* Supported format ticker */}
      <div
        className="overflow-hidden border-b border-ink/10 bg-ink py-3 text-paper"
        aria-hidden="true"
      >
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-10 pr-10 font-mono text-sm uppercase tracking-[0.2em]"
            >
              {TICKER_CATEGORIES.map(({ category, formats }) => (
                <span
                  key={category}
                  className="flex shrink-0 items-center gap-3 whitespace-nowrap"
                >
                  <span className="text-paper/55">{category}</span>

                  <span className="flex items-center gap-3">
                    {formats.map((format) => (
                      <span key={format.extension}>.{format.extension}</span>
                    ))}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Format directory */}
      <section
        id="formats"
        aria-labelledby="formats-heading"
        className="scroll-mt-20 border-b border-ink/10 px-6 py-16 md:px-10 md:py-20 lg:px-14"
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
              Browse file types
            </p>

            <h2
              id="formats-heading"
              className="mt-4 max-w-xl font-display text-[clamp(1.75rem,3.5vw,2.8rem)] font-black leading-[0.95] tracking-[-0.02em]"
            >
              Find the right viewer for your file.
            </h2>

            <p className="mt-5 max-w-2xl leading-relaxed text-ink/75">
              Select a format to open its viewer and learn about supported
              files, available controls, and common compatibility questions.
            </p>
          </div>

          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/60">
            {formatCount} formats
          </p>
        </div>

        <div className="mt-12 grid gap-x-14 gap-y-10 md:grid-cols-2">
          {getCategories().map((category) => {
            const categoryFormats = SUPPORTED_FORMATS.filter(
              (format) => format.category === category,
            );

            if (categoryFormats.length === 0) {
              return null;
            }

            return (
              <section key={category} aria-label={`${category} file viewers`}>
                <h3 className="border-b-2 border-ink pb-2 font-mono text-[11px] uppercase tracking-[0.2em]">
                  {category}
                </h3>

                <ul className="m-0 list-none p-0">
                  {categoryFormats.map((format) => (
                    <li key={format.extension}>
                      <Link
                        href={`/open/${format.extension}`}
                        className="flex min-w-0 items-baseline justify-between gap-4 border-b border-ink/20 py-4 font-display text-xl font-bold tracking-tight transition-colors hover:bg-sage focus-visible:outline focus-visible:outline-inset focus-visible:outline-ink md:text-2xl"
                      >
                        <span className="min-w-0">{format.name} viewer</span>

                        <span className="shrink-0 font-mono text-xs font-normal tracking-widest text-ink/60">
                          .{format.extension}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        aria-labelledby="how-heading"
        className="scroll-mt-20 border-b border-ink/10 px-6 py-16 md:px-10 md:py-20 lg:px-14"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
          Getting started
        </p>

        <h2
          id="how-heading"
          className="mt-4 max-w-xl font-display text-[clamp(1.75rem,3.5vw,2.8rem)] font-black leading-[0.95] tracking-[-0.02em]"
        >
          Open a file in three steps.
        </h2>

        <p className="mt-5 max-w-2xl leading-relaxed text-ink/75">
          The process depends on the file format, but the goal is simple: find
          the right viewer, open a supported file, and use the available tools
          to inspect it.
        </p>

        <ol className="mt-12 grid list-none gap-8 p-0 md:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.number} className="border-t-2 border-ink pt-4">
              <span className="font-mono text-xs tracking-[0.2em] text-sage-deep">
                {step.number}
              </span>

              <h3 className="mt-3 font-display text-xl font-black tracking-tight">
                {step.title}
              </h3>

              <p className="mt-2 leading-relaxed text-ink/75">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Privacy */}
      <section
        aria-labelledby="private-heading"
        className="border-y border-ink/10 bg-sage px-6 py-16 md:px-10 md:py-20 lg:px-14"
      >
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
            File privacy
          </p>

          <h2
            id="private-heading"
            className="mt-4 font-display text-[clamp(1.75rem,3.5vw,2.8rem)] font-black leading-[0.95] tracking-[-0.02em]"
          >
            Know how your files are handled.
          </h2>

          <p className="mt-5 max-w-2xl leading-relaxed text-ink/80">
            The viewer is designed to process supported files in your browser
            without sending them to a file-processing server. This lets you
            inspect compatible files without creating an account. Review our
            privacy policy for details about site analytics, third-party
            services, and other data handling.
          </p>

          <Link
            href="/privacy"
            className="mt-5 inline-block font-semibold text-sage-deep underline underline-offset-4 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            Read our privacy policy
          </Link>
        </div>
      </section>

      {/* General FAQs */}
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="scroll-mt-20 px-6 py-16 md:px-10 md:py-20 lg:px-14"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
          Frequently asked questions
        </p>

        <h2
          id="faq-heading"
          className="mt-4 max-w-xl font-display text-[clamp(1.75rem,3.5vw,2.8rem)] font-black leading-[0.95] tracking-[-0.02em]"
        >
          Using the online file viewers.
        </h2>

        <p className="mt-5 max-w-2xl leading-relaxed text-ink/75">
          Learn how to choose a viewer, understand format support, and
          troubleshoot common file-opening problems.
        </p>

        <div className="content-grid mt-10">
          <article>
            <h3>Which file formats are supported?</h3>
            <p>
              The available viewers support {formatCount} file formats. Each
              format has its own compatibility requirements and viewing
              features. Open the relevant format page to check its supported
              extensions and capabilities.
            </p>

            <Link
              href="#formats"
              className="mt-4 inline-block font-semibold text-sage-deep underline underline-offset-4"
            >
              Browse supported formats
            </Link>
          </article>

          <article>
            <h3>How do I choose the right file viewer?</h3>
            <p>
              Identify your file's extension, such as .stl, .obj, .pdf, or .csv,
              and select the matching viewer. If you are unsure about
              compatibility, check the format guide before opening the file.
            </p>
          </article>

          <article>
            <h3>Are my files uploaded to a server?</h3>
            <p>
              Supported files are intended to be processed in your browser
              rather than uploaded to a file-processing server. See our{" "}
              <Link
                href="/privacy"
                className="font-semibold text-sage-deep underline underline-offset-4"
              >
                privacy policy
              </Link>{" "}
              for information about the site's data practices.
            </p>
          </article>

          <article>
            <h3>Can I edit or convert files?</h3>
            <p>
              The site's primary purpose is file viewing and inspection. Editing
              and conversion are not provided unless a particular tool
              explicitly offers those functions. Use a compatible editor or
              converter when you need to modify a file.
            </p>
          </article>

          <article>
            <h3>What is the maximum supported file size?</h3>
            <p>
              The configured file-size limit is {siteConfig.maxFileSizeMB} MB.
              Individual formats may have additional compatibility or processing
              constraints. Large or complex files can also require more browser
              memory and processing time.
            </p>
          </article>

          <article>
            <h3>Why won't my file open?</h3>
            <p>
              The file may be damaged, use an unsupported variation of a format,
              exceed the file-size limit, or contain external assets the viewer
              cannot access. Confirm the file extension, review the relevant
              format guide, and try a valid sample file if one is available.
            </p>
          </article>

          <article>
            <h3>Do I need to install an application?</h3>
            <p>
              The viewers are designed to run in a compatible web browser, so a
              separate desktop application is not required for supported viewing
              tasks. Some advanced editing, conversion, or file-repair tasks may
              still require dedicated software.
            </p>
          </article>

          <article>
            <h3>Can I open files on a phone or tablet?</h3>
            <p>
              Compatibility depends on the browser, device resources, file
              format, and model or document complexity. Smaller files may work
              well on mobile devices, while larger files can require more memory
              or processing power.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
