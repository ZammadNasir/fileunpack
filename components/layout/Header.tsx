"use client";

import { siteConfig } from "@/src/config/site";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/view", label: "Viewer" },
  { href: "/#formats", label: "Formats" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-50 border-b border-ink/10 bg-paper">
      <div className="grid min-h-[var(--header-h)] grid-cols-[1fr_auto] md:grid-cols-3">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          aria-label={`${siteConfig.name} home`}
          className="flex items-center border-r border-ink/10 px-6 py-4 font-display text-xl font-bold tracking-tight no-underline md:px-10"
        >
          {siteConfig.name}
        </Link>

        <p className="hidden items-center justify-center whitespace-nowrap border-r border-ink/10 px-8 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/65 md:flex">
          {siteConfig.tagline}
          <span className="ml-3 text-ink/45">v{siteConfig.version}</span>
        </p>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="site-menu"
          className="nav-toggle flex min-h-11 min-w-11 items-center justify-center justify-self-end border-0 bg-transparent px-4 text-ink transition-colors hover:bg-mist md:mr-5"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <X aria-hidden="true" size={20} strokeWidth={1.8} /> : <Menu aria-hidden="true" size={20} strokeWidth={1.8} />}
        </button>
      </div>

      <nav
        id="site-menu"
        aria-label="Primary navigation"
        className={`site-menu border-t border-ink/10 bg-paper ${open ? "block" : "hidden"}`}
      >
        <ul className="m-0 grid list-none p-0 sm:grid-cols-2 lg:grid-cols-5">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="border-b border-ink/10 sm:border-r">
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-6 py-4 font-display text-base font-semibold no-underline transition-colors hover:bg-mist md:px-10"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
