"use client";

import { siteConfig } from "@/src/config/site";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/view", label: "Viewer" },
  { href: "/#formats", label: "Formats" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
];

const [brandFirst, ...brandRest] = siteConfig.name
  .trim()
  .toLowerCase()
  .split(/\s+/);

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/20 bg-paper">
      <div className="grid grid-cols-[1fr_auto] md:grid-cols-3">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          aria-label={`${siteConfig.name} home`}
          className="flex items-center gap-1 border-r border-ink/20 px-6 py-4 font-display text-xl font-black tracking-tight md:px-10"
        >
          <span>{brandFirst}</span>
          {brandRest.length > 0 && (
            <span aria-hidden="true" className="text-sage-deep">
              &mdash;
            </span>
          )}
          <span>{brandRest.join(" ")}</span>
        </Link>

        <p className="hidden items-center justify-center whitespace-nowrap border-r border-ink/20 px-8 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/70 md:flex">
          {siteConfig.tagline}
          <span aria-hidden="true" className="mx-3">
            &bull;
          </span>
          v{siteConfig.version}
        </p>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="site-menu"
          className="flex min-w-16 items-center justify-center justify-self-end border-0 bg-transparent px-6 py-4 shadow-none hover:bg-mist"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true" className="flex w-7 flex-col gap-1.5">
            <span
              className={`h-0.75 w-full bg-ink transition-transform ${open ? "-translate-y-2.25 rotate-45" : ""}`}
            />
            <span
              className={`h-0.75 w-full bg-ink transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.75 w-full bg-ink transition-transform ${open ? "-translate-y-2.25 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <nav
        id="site-menu"
        aria-label="Primary navigation"
        className={`border-t border-ink/20 bg-paper ${open ? "block" : "hidden"}`}
      >
        <ul className="m-0 grid list-none p-0 sm:grid-cols-2 lg:grid-cols-5">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="border-b border-ink/15 sm:border-r">
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-6 py-4 font-display text-lg font-bold hover:bg-sage md:px-10"
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
