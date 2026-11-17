import Link from "next/link";
import { footerColumns, site } from "@/content/site";
import JoinDrop from "./JoinDrop";
import { NoiseBars } from "./Noise";
import Wordmark from "./Wordmark";

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="micro rounded-[var(--radius-xs)] border border-alabaster/25 px-2 py-1 text-alabaster/80">{children}</span>;
}

export default function Footer() {
  return (
    <footer className="bg-carbon text-alabaster">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))]">
          <div>
            <h2 className="display text-2xl">
              Join the drop<span className="text-terracotta">.</span>
            </h2>
            <p className="mt-2 max-w-xs text-sm text-alabaster/60">
              Drop 02 lands 12 December. The list gets the link an hour early, plus the occasional bad idea.
            </p>
            <JoinDrop source="footer" tone="dark" className="relative mt-5 max-w-sm" cta="Join" />
            <div className="mt-6 flex flex-wrap gap-2" aria-label="Payment methods">
              {site.payments.map((p) => (
                <Badge key={p}>{p}</Badge>
              ))}
            </div>
          </div>

          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="label text-alabaster/50">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-alabaster/85 transition-colors hover:text-terracotta">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-sm text-alabaster/85 transition-colors hover:text-terracotta">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-alabaster/10 pt-6 text-sm text-alabaster/70">
          <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-terracotta">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            {site.instagram.handle}
          </a>
          <a href={site.whatsapp.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-terracotta">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 20l1.3-3.8A8 8 0 1 1 8.3 19L4 20z" />
              <path d="M9.5 9.5c0 3 2 5 5 5l1-1.5-2-1-1 1a4 4 0 0 1-2-2l1-1-1-2-1 1.5z" fill="currentColor" stroke="none" />
            </svg>
            WhatsApp {site.whatsapp.display}
          </a>
          <a href={`mailto:${site.email}`} className="hover:text-terracotta">
            {site.email}
          </a>
        </div>
      </div>

      <div aria-hidden className="select-none overflow-hidden px-2">
        <NoiseBars seed={21} count={96} aspect={0.05} className="h-6 w-full text-alabaster/15" />
        <p data-text="Rabble" className="ghost-type display text-center text-[clamp(4rem,18vw,16rem)] leading-[0.8] text-alabaster/10" />
      </div>

      <div className="border-t border-alabaster/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-alabaster/70 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <Wordmark variant="mark" tone="alabaster" size="sm" />
            <p>
              © {site.founded} {site.legalName}. Designed in India.
            </p>
          </div>
          <p className="tabular">GSTIN {site.gstin} · {site.city}</p>
        </div>
      </div>
    </footer>
  );
}
