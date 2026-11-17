"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { nav } from "@/content/site";
import Wordmark from "./Wordmark";

export default function Header() {
  const pathname = usePathname();
  const { count, openDrawer } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const linkCls = (href: string) =>
    `label transition-colors hover:text-terracotta ${pathname.startsWith(href) ? "text-terracotta" : "text-carbon"}`;

  return (
    <header className={`sticky top-0 z-40 bg-alabaster/90 backdrop-blur-sm transition-shadow ${scrolled ? "border-b hairline" : ""}`}>
      <a href="#main" className="skip-link label">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <nav aria-label="Primary" className="hidden flex-1 items-center gap-7 md:flex">
          {nav.primary.map((item) => (
            <Link key={item.href} href={item.href} className={linkCls(item.href)} aria-current={pathname === item.href ? "page" : undefined}>
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

        <Wordmark href="/" variant="horizontal" size="sm" />

        <div className="flex flex-1 items-center justify-end gap-7">
          {nav.secondary.map((item) => (
            <Link key={item.href} href={item.href} className={`hidden md:inline ${linkCls(item.href)}`}>
              {item.label}
            </Link>
          ))}
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

      {menuOpen && (
        <div id="mobile-menu" className="border-t hairline bg-alabaster md:hidden">
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
  );
}
