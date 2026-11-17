"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SearchOverlay from "./SearchOverlay";
import { useCart } from "@/lib/cart";

const NAV = [
  { href: "/men", label: "Printed Tees" },
  { href: "/women", label: "Women's Boutique" },
  { href: "/new-arrivals", label: "New Drops" },
];

export default function Header() {
  const pathname = usePathname();
  const { count, openDrawer } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  // ⌘K / Ctrl+K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const linkCls = (href: string) =>
    `label transition-colors hover:text-accent ${
      pathname.startsWith(href) ? "text-accent" : "text-ink"
    }`;

  const isHome = pathname === "/";

  return (
    <>
      <header
        className={`glass sticky top-0 z-40 transition-shadow ${
          scrolled
            ? "border-b border-ink/10 shadow-[0_1px_0_rgb(255_255_255/0.6)_inset]"
            : ""
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* left: nav (desktop) / burger (mobile) */}
          <nav
            aria-label="Primary"
            className="hidden flex-1 items-center gap-7 md:flex"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={linkCls(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="flex-1 text-left md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="label">{menuOpen ? "Close" : "Menu"}</span>
          </button>

          {/* center: wordmark */}
          <Link
            href="/"
            aria-label="RABBLE home"
            className="display text-[1.4rem] leading-none"
          >
            Rabble<span className="text-accent">.</span>
          </Link>

          {/* right */}
          <div className="flex flex-1 items-center justify-end gap-6">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="label flex items-center gap-1.5 hover:text-accent"
              aria-label="Search the store"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <span className="hidden sm:inline">Search</span>
            </button>
            <button
              type="button"
              onClick={openDrawer}
              className="label hover:text-accent"
            >
              Bag
              <span className="tabular ml-1">({count})</span>
            </button>
          </div>
        </div>

        {/* micro-header */}
        {isHome && !menuOpen && (
          <div className="border-t border-ink/10">
            <p className="mx-auto max-w-7xl px-4 py-2 text-center text-[0.65rem] uppercase tracking-[0.2em] text-ink-2 sm:px-6 sm:text-xs">
              New collection
              <span className="mx-3 text-ink/30" aria-hidden>
                |
              </span>
              Premium printed tees &amp; boutique wear
            </p>
          </div>
        )}

        {/* mobile menu */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="border-t hairline bg-studio md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col px-4 py-6">
              {[
                ...NAV,
                { href: "/about", label: "About" },
                { href: "/bag", label: "Bag" },
              ].map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="display border-b hairline py-4 text-3xl"
                  style={{ animation: `page-in 0.4s ${i * 60}ms both` }}
                >
                  {item.label}
                </Link>
              ))}
              <p className="serif-note pt-6 text-ink-3">Join the noise.</p>
            </nav>
          </div>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
