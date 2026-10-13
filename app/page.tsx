import Link from "next/link";
import { ViewerShell } from "@/components/viewer/ViewerShell";
import { siteConfig } from "@/src/config/site";
import { SUPPORTED_FORMATS } from "@/src/lib/formats";

export default function Home() {
  return (
    <main>
      <section className="home-hero">
        <p className="eyebrow">{siteConfig.name}</p>
        <h1>Open unfamiliar files right in your browser.</h1>
        <p className="hero-copy">
          View uncommon files without installing specialized software. Start with STL, OBJ, GLB, GLTF, and SVG.
        </p>
        <ViewerShell />
        <p className="local-note">Processed locally whenever possible. No account, no upload queue, no ceremony.</p>
      </section>

      <section className="section" id="formats" aria-labelledby="formats-heading">
        <div className="section-heading">
          <p className="eyebrow">Supported now</p>
          <h2 id="formats-heading">A focused first set of file viewers.</h2>
        </div>
        <div className="format-grid">
          {["3D", "Vector"].map((category) => (
            <div className="format-group" key={category}>
              <h3>{category}</h3>
              <div className="format-link-row">
                {SUPPORTED_FORMATS.filter((format) => format.category === category).map((format) => (
                  <Link key={format.extension} href={`/open/${format.extension}`}>
                    {format.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section steps-section" id="how-it-works" aria-labelledby="how-heading">
        <div className="section-heading">
          <p className="eyebrow">How it works</p>
          <h2 id="how-heading">Choose, identify, view.</h2>
        </div>
        <ol className="steps">
          <li><span>01</span><strong>Choose a file</strong><p>Click the uploader or drop a supported file onto the page.</p></li>
          <li><span>02</span><strong>We identify the format</strong><p>The extension is normalized and matched against the registry.</p></li>
          <li><span>03</span><strong>View it instantly</strong><p>The right browser viewer loads only when it is needed.</p></li>
        </ol>
      </section>

      <section className="privacy-band" id="privacy">
        <div>
          <p className="eyebrow">Privacy</p>
          <h2>Your files are yours.</h2>
        </div>
        <p>
          Supported files are processed directly in your browser whenever possible, so there is no reason to store them on a server for this MVP.
        </p>
      </section>

      <section className="section about-section" id="about">
        <h2>A small tool with a clear job.</h2>
        <p>
          {siteConfig.name} is built for quick inspection: the moment when someone sends you a file and you just need to see what is inside.
          The architecture is deliberately registry-based, so new formats can be added without rewriting the product.
        </p>
      </section>
    </main>
  );
}
