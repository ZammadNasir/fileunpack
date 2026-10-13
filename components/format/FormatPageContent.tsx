import Link from "next/link";
import { ViewerShell } from "@/components/viewer/ViewerShell";
import { FormatDefinition, relatedFormats } from "@/src/lib/formats";

type FormatPageContentProps = {
  format: FormatDefinition;
};

export function FormatPageContent({ format }: FormatPageContentProps) {
  return (
    <main className="format-page">
      <section className="format-hero">
        <Link className="back-link" href="/">Back</Link>
        <p className="eyebrow">{format.category} viewer</p>
        <h1>Open {format.name} Files Online</h1>
        <p>{format.description}</p>
      </section>

      <ViewerShell
        preferredFormat={format}
        intro={<p className="viewer-intro">Choose a {format.name} file to preview it locally in your browser whenever possible.</p>}
      />

      <section className="content-grid">
        <article>
          <h2>What is a {format.name} file?</h2>
          <p>{format.whatIs}</p>
        </article>
        <article>
          <h2>How to open a {format.name} file</h2>
          <p>{format.howToOpen}</p>
        </article>
        <article>
          <h2>Can I open {format.name} without installing software?</h2>
          <p>{format.withoutSoftware}</p>
        </article>
        <article>
          <h2>{format.name} viewer features</h2>
          <ul>
            {format.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="related-section" aria-labelledby="related-formats">
        <h2 id="related-formats">Related formats</h2>
        <div className="format-link-row">
          {relatedFormats(format.extension).map((related) => (
            <Link key={related.extension} href={`/open/${related.extension}`}>
              {related.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
