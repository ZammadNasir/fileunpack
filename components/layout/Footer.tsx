import Link from "next/link";
import { siteConfig } from "@/src/config/site";
import { SUPPORTED_FORMATS } from "@/src/lib/formats";

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" href="/">{siteConfig.name}</Link>
        <p>Browser-first file viewing for formats that are awkward to open.</p>
      </div>
      <nav aria-label="Footer">
        <Link href="/#formats">Formats</Link>
        <Link href="/#privacy">Privacy</Link>
        <Link href="/#about">About</Link>
        <a href="mailto:feedback@fileunpack.com">Feedback</a>
      </nav>
      <div className="footer-format-row" aria-label="Supported formats">
        {SUPPORTED_FORMATS.map((format) => (
          <Link key={format.extension} href={`/open/${format.extension}`}>
            {format.name}
          </Link>
        ))}
      </div>
    </footer>
  );
}
