"use client";

import Link from "next/link";
import { useState } from "react";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Men", href: "/men" },
      { label: "Women", href: "/women" },
      { label: "New arrivals", href: "/new-arrivals" },
      { label: "Your bag", href: "/bag" },
    ],
  },
  {
    title: "Brand",
    links: [
      { label: "The manifesto", href: "/about" },
      { label: "Drop 01", href: "/new-arrivals" },
    ],
  },
] as const;

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <footer className="bg-ink text-chalk">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          {/* newsletter */}
          <div>
            <h2 className="display text-2xl">
              Get the noise first<span className="text-accent">.</span>
            </h2>
            <p className="mt-2 max-w-xs text-sm text-chalk/60">
              Drops, restocks and the occasional bad idea. One email a week, tops.
            </p>
            {done ? (
              <p className="serif-note mt-5 text-lg text-chalk/90">
                You&rsquo;re in. Welcome to the rabble.
              </p>
            ) : (
              <form
                className="mt-5 flex max-w-sm overflow-hidden rounded-full border border-chalk/25 focus-within:border-chalk/60"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.includes("@")) setDone(true);
                }}
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent px-5 py-3 text-sm text-chalk placeholder:text-chalk/40 focus:outline-none"
                />
                <button type="submit" className="label shrink-0 px-5 text-chalk hover:text-accent">
                  Join
                </button>
              </form>
            )}
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="label text-chalk/50">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-chalk/85 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* giant wordmark */}
      <div aria-hidden className="select-none overflow-hidden px-2">
        <p className="display text-center text-[clamp(4rem,18vw,16rem)] leading-[0.8] text-chalk/10">
          Rabble
        </p>
      </div>

      <div className="border-t border-chalk/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-chalk/45 sm:flex-row sm:px-6">
          <p>© 2026 RABBLE. Designed in India.</p>
          <p>A concept store — nothing here ships. Yet.</p>
        </div>
      </div>
    </footer>
  );
}
