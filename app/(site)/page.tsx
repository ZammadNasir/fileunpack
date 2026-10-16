import Link from "next/link";
import { DropFileCard } from "@/components/uploader/DropFileCard";
import { siteConfig } from "@/src/config/site";
import { SUPPORTED_FORMATS, getCategories } from "@/src/lib/formats";

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

const TICKER_ITEMS = [
  ...SUPPORTED_FORMATS.map((format) => `.${format.name}`),
  siteConfig.tagline.toUpperCase(),
  "PROCESSED LOCALLY WHENEVER POSSIBLE",
];

const formatList = SUPPORTED_FORMATS.map((format) => format.name).join(", ");

export default function Home() {
  return (
    <main>
      <div className="flex h-[calc(100svh_-_var(--header-h))] flex-col overflow-hidden">
        <section className="flex min-h-0 min-w-0 flex-1 flex-col border-b border-ink/20 lg:grid lg:grid-cols-2">
          <div className="flex min-h-0 min-w-0 flex-auto flex-col justify-between gap-6 border-b border-ink/20 bg-sage px-6 py-6 md:px-10 md:py-8 lg:border-b-0 lg:border-r">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
              Browser-first file inspection
            </p>
            <div>
              <h1 className="max-w-none font-display text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.88] tracking-[-0.03em] text-ink">
                Open unfamiliar files right in your browser.
              </h1>
              <p className="mt-7 max-w-lg text-[1.05rem] leading-relaxed text-ink/80">
                View uncommon files without installing specialized software. Start
                with {formatList}. Processed locally whenever possible &mdash; no
                account, no upload queue, no ceremony.
              </p>
            </div>
          </div>

          <div className="grid min-h-0 min-w-0 flex-auto grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
            <DropFileCard />

            <Link
              href="/#formats"
              className="flex min-w-0 flex-col justify-center overflow-hidden border-b border-ink/20 bg-white px-6 py-8 hover:bg-mist md:px-10 lg:py-12"
            >
              <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
                Action_02
              </span>
              <span className="mt-3 block font-display text-[clamp(1.25rem,3.5vw,2.8rem)] font-black leading-none text-sage-deep">
                Supported Formats
              </span>
              <span className="mt-4 block max-w-xs text-[0.98rem] leading-relaxed text-ink/80">
                {formatList} today &mdash; the registry is data-driven, so new
                formats slot in without a rewrite.
              </span>
            </Link>
          </div>
        </section>

        <div
          className="overflow-hidden border-b border-ink/20 bg-ink py-3 text-paper"
          aria-hidden="true"
        >
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center gap-10 pr-10 font-mono text-sm uppercase tracking-[0.2em]"
              >
                {TICKER_ITEMS.map((item) => (
                  <span key={item} className="whitespace-nowrap">
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section
        id="formats"
        aria-labelledby="formats-heading"
        className="border-b border-ink/20 px-6 py-16 md:px-10 md:py-20"
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
              Supported now
            </p>
            <h2
              id="formats-heading"
              className="mt-4 max-w-xl font-display text-[clamp(1.75rem,3.5vw,2.8rem)] font-black leading-[0.95] tracking-[-0.02em]"
            >
              A focused first set of file viewers.
            </h2>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/60">
            Registry v{siteConfig.version}
          </p>
        </div>

        <div className="mt-12 grid gap-x-14 gap-y-10 md:grid-cols-2">
          {getCategories().map((category) => (
            <div key={category}>
              <p className="border-b-2 border-ink pb-2 font-mono text-[11px] uppercase tracking-[0.2em]">
                {category}
              </p>
              <ul className="m-0 list-none p-0">
                {SUPPORTED_FORMATS.filter(
                  (format) => format.category === category,
                ).map((format) => (
                  <li key={format.extension}>
                    <Link
                      href={`/open/${format.extension}`}
                      className="flex items-baseline justify-between border-b border-ink/20 py-4 font-display text-2xl font-bold tracking-tight transition-colors hover:bg-sage"
                    >
                      <span>{format.name}</span>
                      <span className="font-mono text-xs font-normal tracking-widest text-ink/60">
                        .{format.extension}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        aria-labelledby="how-heading"
        className="px-6 py-16 md:px-10 md:py-20"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
          How it works
        </p>
        <h2
          id="how-heading"
          className="mt-4 font-display text-[clamp(1.75rem,3.5vw,2.8rem)] font-black leading-[0.95] tracking-[-0.02em]"
        >
          Choose, identify, view.
        </h2>

        <ol className="mt-12 grid list-none gap-8 p-0 md:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.number} className="border-t-2 border-ink pt-4">
              <span className="font-mono text-xs tracking-[0.2em] text-sage-deep">
                {step.number}
              </span>
              <strong className="mt-3 block font-display text-xl font-black tracking-tight">
                {step.title}
              </strong>
              <p className="mt-2 leading-relaxed text-ink/75">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
