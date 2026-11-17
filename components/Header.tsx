"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

const NAV = [
  { href: "/men", label: "Men" },
  { href: "/women", label: "Women" },
  { href: "/new-arrivals", label: "New" },
];

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

  const linkCls = (href: string) =>
    `label transition-colors hover:text-cobalt ${
      pathname.startsWith(href) ? "text-cobalt" : "text-ink"
    }`;

  return (
    <header
      className={`sticky top-0 z-40 bg-chalk/90 backdrop-blur-sm transition-shadow ${
        scrolled ? "border-b hairline" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* left: nav (desktop) / burger (mobile) */}
        <nav aria-label="Primary" className="hidden flex-1 items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={linkCls(item.href)}>
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
        <Link href="/" aria-label="RABBLE home" className="display text-[1.35rem] leading-none">
          Rabble<span className="text-cobalt">.</span>
        </Link>

        {/* right */}
        <div className="flex flex-1 items-center justify-end gap-7">
          <Link href="/about" className={`hidden md:inline ${linkCls("/about")}`}>
            About
          </Link>
          <button type="button" onClick={openDrawer} className="label hover:text-cobalt">
            Bag
            <span className="tabular ml-1 inline-flex min-w-[1.3em] items-center justify-center rounded-full bg-ink px-1.5 py-0.5 text-[0.6rem] leading-none text-chalk">
              {count}
            </span>
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div id="mobile-menu" className="border-t hairline bg-chalk md:hidden">
          <nav aria-label="Mobile" className="flex flex-col px-4 py-6">
            {[...NAV, { href: "/about", label: "About" }, { href: "/bag", label: "Bag" }].map(
              (item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="display border-b hairline py-4 text-3xl"
                  style={{ animation: `page-in 0.4s ${i * 60}ms both` }}
                >
                  {item.label}
                </Link>
              ),
            )}
            <p className="serif-note pt-6 text-ink-3">Join the noise.</p>
          </nav>
        </div>
      )}
    </header>
  );
}
