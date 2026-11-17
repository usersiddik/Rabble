"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { nav } from "@/content/site";
import SearchOverlay from "./SearchOverlay";
import Wordmark from "./Wordmark";

export default function Header() {
  const pathname = usePathname();
  const { count, openDrawer } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

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

  // close the menu on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [pathname]);

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
    `label transition-colors hover:text-terracotta ${pathname.startsWith(href) ? "text-terracotta" : "text-carbon"}`;

  return (
    <>
      <header
        className={`glass sticky top-0 z-40 transition-shadow ${
          scrolled ? "border-b hairline shadow-[0_1px_0_rgb(255_255_255/0.6)_inset]" : ""
        }`}
      >
        <a href="#main" className="skip-link label">
          Skip to content
        </a>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <nav aria-label="Primary" className="hidden flex-1 items-center gap-7 lg:flex">
            {nav.primary.map((item) => (
              <Link key={item.href} href={item.href} className={linkCls(item.href)} aria-current={pathname === item.href ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="flex-1 text-left lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="label">{menuOpen ? "Close" : "Menu"}</span>
          </button>

          <Wordmark href="/" variant="horizontal" size="sm" />

          <div className="flex flex-1 items-center justify-end gap-6">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-keyshortcuts="Meta+K Control+K"
              className="label flex items-center gap-1.5 hover:text-terracotta"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <span className="sr-only sm:not-sr-only">Search</span>
            </button>
            <button type="button" onClick={openDrawer} className="label hover:text-terracotta">
              Bag
              <span aria-hidden className="tabular ml-1 inline-flex min-w-[1.3em] items-center justify-center rounded-full bg-carbon px-1.5 py-0.5 text-[0.6rem] leading-none text-alabaster">
                {count}
              </span>
              <span className="sr-only">
                , {count} {count === 1 ? "item" : "items"}
              </span>
            </button>
          </div>
        </div>

        {/* micro-header */}
        {pathname === "/" && !menuOpen && (
          <div className="border-t hairline">
            <p className="mx-auto max-w-7xl px-4 py-2 text-center text-[0.65rem] uppercase tracking-[0.2em] text-carbon-2 sm:px-6 sm:text-xs">
              {/* phones get the second line only, so the bar stays one line tall */}
              <span className="hidden sm:inline">
                {nav.micro[0]}
                <span className="mx-3 text-carbon/30" aria-hidden>
                  |
                </span>
              </span>
              {nav.micro[1]}
            </p>
          </div>
        )}

        {menuOpen && (
          <div id="mobile-menu" className="border-t hairline bg-alabaster lg:hidden">
            <nav aria-label="Mobile" className="flex flex-col px-4 py-6">
              {[...nav.primary, ...nav.secondary, { href: "/bag", label: "Bag" }].map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="display border-b hairline py-4 text-3xl"
                  style={{ animation: `page-in 0.4s ${i * 60}ms both` }}
                >
                  {item.label}
                </Link>
              ))}
              <p className="serif-note pt-6 text-steel-deep">Noise you can wear.</p>
            </nav>
          </div>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </>
  );
}
