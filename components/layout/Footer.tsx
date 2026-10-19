import { siteConfig } from "@/src/config/site";
import { SUPPORTED_FORMATS } from "@/src/lib/formats";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const formatCount = SUPPORTED_FORMATS.length;

  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" href="/">
          <Image
            src="/favicon-96x96.png"
            alt=""
            aria-hidden="true"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0"
          />
          {siteConfig.name}
        </Link>
        <p>Browser-first file viewing for formats that are awkward to open.</p>
      </div>
      <nav aria-label="Footer">
        <Link href="/view">Viewer</Link>
        <Link href="/#formats">Formats</Link>
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/about">About</Link>
        <a href="mailto:feedback@fileunpack.com">Feedback</a>
      </nav>
      <div className="footer-format-row" aria-label="Supported formats">
        <Link href="/#formats">{formatCount}+ supported formats</Link>
      </div>
    </footer>
  );
}
