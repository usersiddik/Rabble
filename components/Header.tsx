"use client";

import Link from "next/link";
import { useBag } from "./CartContext";

const linkCls =
  "text-[11px] uppercase tracking-[0.18em] text-neutral-700 hover:text-neutral-950 transition-colors";

export default function Header() {
  const { count } = useBag();

  return (
    <header className="sticky top-0 z-50 bg-studio/90 backdrop-blur-sm border-b border-neutral-300/60">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8 h-14 grid grid-cols-[1fr_auto_1fr] items-center">
        <nav className="hidden md:flex items-center gap-7">
          <Link href="/men" className={linkCls}>
            Printed Tees
          </Link>
          <Link href="/women" className={linkCls}>
            Women&apos;s Boutique
          </Link>
          <Link href="/new-arrivals" className={linkCls}>
            New Drops
          </Link>
        </nav>
        {/* mobile: just the two key links */}
        <nav className="flex md:hidden items-center gap-4">
          <Link href="/men" className={linkCls}>
            Tees
          </Link>
          <Link href="/women" className={linkCls}>
            Boutique
          </Link>
        </nav>

        <Link
          href="/"
          className="justify-self-center font-bold text-[22px] tracking-tight text-neutral-950"
        >
          Rabble.
        </Link>

        <nav className="justify-self-end flex items-center gap-7">
          <Link href="/#manifesto" className={`${linkCls} hidden md:inline`}>
            Manifesto
          </Link>
          <span className={`${linkCls} cursor-pointer select-none`}>Bag ({count})</span>
        </nav>
      </div>
    </header>
  );
}
