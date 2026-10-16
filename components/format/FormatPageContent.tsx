import { DropFileCard } from "@/components/uploader/DropFileCard";
import { siteConfig } from "@/src/config/site";
import { FormatDefinition, getFormatByExtension } from "@/src/lib/formats";
import Link from "next/link";

type FormatPageContentProps = {
  format: FormatDefinition;
};

export function FormatPageContent({ format }: FormatPageContentProps) {
  return (
    <main>
      <section className="hero-grid grid min-w-0 grid-cols-1 border-b border-ink/15 lg:grid-cols-2">
        <div className="hero-copy flex min-w-0 flex-col justify-between gap-12 bg-sage px-6 py-10 md:px-10 md:py-14 lg:px-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
            {format.category} viewer
          </p>
          <div>
            <h1 className="max-w-none font-display text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.88] tracking-[-0.03em] text-ink">
              Open {format.name} files right in your browser.
            </h1>
            <p className="mt-7 max-w-lg text-[1.05rem] leading-relaxed text-ink/80">
              {format.description} Processed locally whenever possible &mdash;
              no account, no upload queue, no ceremony.
            </p>
          </div>
        </div>

        <div className="hero-actions grid min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
          <DropFileCard preferredFormat={format} />

          <a
            href="#format-guide"
            className="hero-action flex min-w-0 flex-col justify-center border-b border-ink/15 bg-white px-6 py-8 transition-colors hover:bg-mist md:px-10 lg:py-12"
          >
            <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
              Format details
            </span>
            <span className="mt-3 block font-display text-[clamp(1.25rem,3.5vw,2.8rem)] font-black leading-none text-sage-deep">
              {format.name} Specs &amp; Limits
            </span>
            <span className="mt-4 block max-w-xs text-[0.98rem] leading-relaxed text-ink/80">
              Accepts {format.accepts.join(" and ")} up to{" "}
              {siteConfig.maxFileSizeMB} MB.{" "}
              {format.limitations ??
                `No known limitations for ${format.name} files in this viewer.`}
            </span>
          </a>
        </div>
      </section>

      <section
        aria-labelledby="format-guide"
        className="border-b border-ink/10 px-6 py-16 md:px-10 md:py-20 lg:px-14"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
          Guide
        </p>
        <h2
          id="format-guide"
          className="mt-4 max-w-xl font-display text-[clamp(1.75rem,3.5vw,2.8rem)] font-black leading-[0.95] tracking-[-0.02em]"
        >
          Everything about {format.name} files.
        </h2>

        <div className="mt-12 grid gap-x-14 gap-y-10 md:grid-cols-2">
          <article className="border-t-2 border-ink pt-4">
            <strong className="block font-display text-xl font-black tracking-tight">
              What is a {format.name} file?
            </strong>
            <p className="mt-2 leading-relaxed text-ink/75">{format.whatIs}</p>
          </article>
          <article className="border-t-2 border-ink pt-4">
            <strong className="block font-display text-xl font-black tracking-tight">
              How to open a {format.name} file
            </strong>
            <p className="mt-2 leading-relaxed text-ink/75">
              {format.howToOpen}
            </p>
          </article>
          <article className="border-t-2 border-ink pt-4">
            <strong className="block font-display text-xl font-black tracking-tight">
              Can I open {format.name} without installing software?
            </strong>
            <p className="mt-2 leading-relaxed text-ink/75">
              {format.withoutSoftware}
            </p>
          </article>
          <article className="border-t-2 border-ink pt-4">
            <strong className="block font-display text-xl font-black tracking-tight">
              {format.name} viewer features
            </strong>
            <ul className="mt-2 list-none space-y-2 p-0 leading-relaxed text-ink/75">
              {format.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section
        aria-labelledby="faqs"
        className="border-b border-ink/10 px-6 py-16 md:px-10 md:py-20 lg:px-14"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
          FAQ
        </p>
        <h2
          id="faqs"
          className="mt-4 max-w-xl font-display text-[clamp(1.75rem,3.5vw,2.8rem)] font-black leading-[0.95] tracking-[-0.02em]"
        >
          Frequently asked questions about {format.name}
        </h2>

        <div className="mt-12 space-y-6">
          {format.faqs.map((faq, index) => (
            <article key={index} className="border-t-2 border-ink pt-4">
              <strong className="block font-display text-xl font-black tracking-tight">
                {faq.question}
              </strong>
              <p className="mt-2 leading-relaxed text-ink/75">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      {format.relatedFormats.length > 0 && (
        <section
          aria-labelledby="related-formats"
          className="px-6 py-16 md:px-10 md:py-20 lg:px-14"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
            Keep going
          </p>
          <h2
            id="related-formats"
            className="mt-4 font-display text-[clamp(1.75rem,3.5vw,2.8rem)] font-black leading-[0.95] tracking-[-0.02em]"
          >
            Related formats
          </h2>
          <ul className="mt-8 max-w-3xl list-none p-0">
            {format.relatedFormats.map((relatedExtension) => {
              const related = getFormatByExtension(relatedExtension);
              if (!related) return null;
              return (
                <li key={related.extension}>
                  <Link
                    href={`/open/${related.extension}`}
                    className="block border-b border-ink/20 py-6 transition-colors hover:bg-sage"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-display text-2xl font-bold tracking-tight">
                        {related.name}
                      </span>
                      <span className="font-mono text-xs font-normal tracking-widest text-ink/60">
                        .{related.extension}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {related.faqs.slice(0, 2).map((faq, faqIndex) => (
                        <div
                          key={faqIndex}
                          className="text-sm leading-relaxed text-ink/70"
                        >
                          <span className="font-semibold text-ink/90">
                            Q: {faq.question}
                          </span>
                          <span className="ml-2">{faq.answer}</span>
                        </div>
                      ))}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}
