import Link from "next/link";
import { siteConfig } from "@/src/config/site";

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand-mark" href="/" aria-label={`${siteConfig.name} home`}>
        <span className="brand-glyph" aria-hidden="true">FU</span>
        <span>{siteConfig.name}</span>
      </Link>
      <nav className="header-nav" aria-label="Primary navigation">
        <Link href="/#formats">Formats</Link>
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/#about">About</Link>
      </nav>
    </header>
  );
}
