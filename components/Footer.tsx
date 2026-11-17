"use client";

import Link from "next/link";
import { useState } from "react";

const colLink =
  "block text-[12px] text-neutral-500 hover:text-neutral-900 transition-colors py-1";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer className="bg-studio border-t border-neutral-300/70">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* newsletter */}
        <div className="md:col-span-6">
          <p className="font-bold text-xl tracking-tight">Rabble.</p>
          <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-neutral-600">
            New drops, early access, zero spam. One email a week, tops.
          </p>
          <form
            className="mt-5 flex max-w-sm"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setSent(true);
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="h-11 flex-1 border border-neutral-400 bg-transparent px-4 text-[13px] outline-none focus:border-neutral-900 transition-colors"
            />
            <button
              type="submit"
              className="h-11 border border-l-0 border-neutral-900 bg-neutral-900 px-5 text-[11px] uppercase tracking-[0.18em] text-white hover:bg-neutral-700 transition-colors"
            >
              {sent ? "Joined ✓" : "Join"}
            </button>
          </form>
        </div>

        {/* nav columns */}
        <div className="md:col-span-3">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Shop</h3>
          <nav className="mt-4">
            <Link href="/men" className={colLink}>
              Printed Tees
            </Link>
            <Link href="/women" className={colLink}>
              Women&apos;s Boutique
            </Link>
            <Link href="/new-arrivals" className={colLink}>
              New Drops
            </Link>
          </nav>
        </div>
        <div className="md:col-span-3">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Brand</h3>
          <nav className="mt-4">
            <Link href="/#manifesto" className={colLink}>
              Manifesto
            </Link>
            <span className={colLink}>Shipping &amp; Exchanges</span>
            <span className={colLink}>Contact</span>
          </nav>
        </div>
      </div>

      <div className="border-t border-neutral-300/70">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-[0.16em] text-neutral-400">
            UPI &amp; COD Available · Free Shipping Over ₹1,999 · 7-Day Easy Exchange
          </p>
          <p className="text-[10px] text-neutral-400">
            © {new Date().getFullYear()} Rabble. Designed in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
