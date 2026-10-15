import Link from "next/link";
import { DropFileCard } from "@/components/uploader/DropFileCard";
import { FormatDefinition, relatedFormats } from "@/src/lib/formats";
import { siteConfig } from "@/src/config/site";

type FormatPageContentProps = {
  format: FormatDefinition;
};

export function FormatPageContent({ format }: FormatPageContentProps) {
  return (
    <main>
      <section className="grid border-b border-ink/20 lg:grid-cols-2">
        <div className="flex min-h-[72vh] flex-col justify-between gap-16 border-b border-ink/20 bg-sage px-6 py-12 md:px-10 md:py-16 lg:border-b-0 lg:border-r">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
            {format.category} viewer
          </p>
          <div>
            <h1 className="max-w-none font-display text-[clamp(3rem,7.2vw,6.4rem)] font-black leading-[0.88] tracking-[-0.03em] text-ink">
              Open {format.name} files right in your browser.
            </h1>
            <p className="mt-7 max-w-lg text-[1.05rem] leading-relaxed text-ink/80">
              {format.description} Processed locally whenever possible &mdash;
              no account, no upload queue, no ceremony.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-rows-2">
          <DropFileCard preferredFormat={format} />

          <a
            href="#format-guide"
            className="flex min-h-[300px] flex-col justify-center border-b border-ink/20 bg-white px-6 py-12 hover:bg-mist md:px-10"
          >
            <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
              Action_02
            </span>
            <span className="mt-3 block font-display text-[clamp(2.4rem,4vw,3.4rem)] font-black leading-none text-sage-deep">
              {format.name} Specs &amp; Limits
            </span>
            <span className="mt-4 block max-w-xs text-[0.98rem] leading-relaxed text-ink/80">
              Accepts {format.accepts.join(" and ")} up to {siteConfig.maxFileSizeMB} MB.{" "}
              {format.limitations ?? `No known limitations for ${format.name} files in this viewer.`}
            </span>
          </a>
        </div>
      </section>

      <section
        aria-labelledby="format-guide"
        className="border-b border-ink/20 px-6 py-16 md:px-10 md:py-20"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
          Guide
        </p>
        <h2
          id="format-guide"
          className="mt-4 max-w-xl font-display text-[clamp(2rem,4vw,3.4rem)] font-black leading-[0.95] tracking-[-0.02em]"
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
        aria-labelledby="related-formats"
        className="px-6 py-16 md:px-10 md:py-20"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
          Keep going
        </p>
        <h2
          id="related-formats"
          className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] font-black leading-[0.95] tracking-[-0.02em]"
        >
          Related formats
        </h2>
        <ul className="mt-8 max-w-3xl list-none p-0">
          {relatedFormats(format.extension).map((related) => (
            <li key={related.extension}>
              <Link
                href={`/open/${related.extension}`}
                className="flex items-baseline justify-between border-b border-ink/20 py-4 font-display text-2xl font-bold tracking-tight transition-colors hover:bg-sage"
              >
                <span>{related.name}</span>
                <span className="font-mono text-xs font-normal tracking-widest text-ink/60">
                  .{related.extension}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
