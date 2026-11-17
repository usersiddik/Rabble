import type { Metadata } from "next";
import Link from "next/link";
import GarmentCutout from "@/components/GarmentCutout";
import JoinDrop from "@/components/JoinDrop";
import { NoiseBars, NoiseDivider } from "@/components/Noise";
import PullQuote from "@/components/PullQuote";
import Reveal from "@/components/Reveal";
import Wordmark from "@/components/Wordmark";
import { getGarment } from "@/content/garments";
import { facts, founderNote, manifesto, sections } from "@/content/manifesto";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "The manifesto",
  description:
    "Why print, why boutique, why India first. RABBLE is what happens when the crowd gets a point of view.",
  alternates: { canonical: "/about" },
};

/** `**bold**` → <strong>, nothing else. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>,
      )}
    </>
  );
}

export default function AboutPage() {
  return (
    <article>
      {/* ——— opening ——— */}
      <header className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 md:pt-20">
        <div className="rise">
          <p className="label text-terracotta">{manifesto.kicker}</p>
          <h1 className="display display-xl mt-4 max-w-5xl">
            Noise you can <span className="serif-note lowercase text-terracotta">wear.</span>
          </h1>
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-20">
          <div>
            <Reveal>
              <p className="serif-note text-[var(--text-note-lg)]">{manifesto.lede}</p>
            </Reveal>
            <div className="prose-editorial mt-8 max-w-lg">
              {manifesto.opening.map((p, i) => (
                <Reveal key={i} delay={i * 80} as="div">
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={120} className="md:pt-10">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md bg-carbon/10">
              {facts.map((f) => (
                <div key={f.title} className="bg-alabaster p-5">
                  <NoiseBars seed={f.title.length} count={10} aspect={0.5} className="h-3 w-6 text-terracotta" />
                  <h2 className="display mt-3 text-lg">{f.title}</h2>
                  <p className="mt-2 text-sm text-carbon-2">{f.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </header>

      {/* ——— sections ——— */}
      {sections.map((s, i) => {
        const dark = s.tone === "dark";
        const pieces = (s.pieces ?? []).map((slug) => getGarment(slug)).filter(Boolean);
        return (
          <section
            key={s.id}
            id={s.id}
            aria-labelledby={`${s.id}-title`}
            className={`mt-[var(--space-section)] py-[var(--space-section)] ${dark ? "bg-carbon text-alabaster" : ""}`}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className={`grid gap-10 md:grid-cols-2 md:gap-20 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div>
                  <Reveal>
                    <p className={`label ${dark ? "text-alabaster/50" : "text-steel-deep"}`}>{s.kicker}</p>
                    <h2 id={`${s.id}-title`} className="display display-lg mt-3">
                      {s.title}
                    </h2>
                  </Reveal>
                  <div className={`prose-editorial mt-8 max-w-lg ${dark ? "on-dark" : ""}`}>
                    {s.body.map((p, j) => (
                      <Reveal key={j} delay={j * 80} as="div">
                        <p>
                          <Rich text={p} />
                        </p>
                      </Reveal>
                    ))}
                  </div>
                </div>
                <Reveal delay={100} className="grid grid-cols-2 gap-4 self-center">
                  {pieces.map((g, j) => (
                    <Link
                      key={g!.slug}
                      href={`/product/${g!.slug}`}
                      className={`group block aspect-[4/5] p-[10%] ${dark ? "studio-dark grain" : "studio grain grain-light"} ${j === 1 ? "mt-10" : ""}`}
                    >
                      <GarmentCutout garment={g!} side="front" className="h-full w-full transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.03]" />
                      <p className={`micro mt-2 text-center ${dark ? "text-alabaster/50" : "text-steel-deep"}`}>
                        {g!.name} · {g!.color}
                      </p>
                    </Link>
                  ))}
                </Reveal>
              </div>
              {s.pullQuote && <PullQuote tone={dark ? "dark" : "light"}>{s.pullQuote}</PullQuote>}
            </div>
          </section>
        );
      })}

      {/* ——— founder note ——— */}
      <section className="mx-auto max-w-7xl px-4 py-[var(--space-section)] sm:px-6" aria-labelledby="founder-title">
        <NoiseDivider seed={8} className="mb-[var(--space-block)]" label="Founder" />
        <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-20">
          <Reveal>
            <p className="label text-steel-deep">{founderNote.kicker}</p>
            <h2 id="founder-title" className="display display-md mt-3">
              Three of us, one studio.
            </h2>
            <Wordmark variant="stacked" size="md" className="mt-8" />
          </Reveal>
          <Reveal delay={100}>
            <div className="serif-note space-y-6 text-[var(--text-note)] leading-snug text-carbon">
              {founderNote.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="label mt-8">{founderNote.signature}</p>
            <p className="mt-1 text-xs text-steel-deep">{founderNote.location}</p>
          </Reveal>
        </div>
      </section>

      {/* ——— close ——— */}
      <section className="bg-alabaster-2 py-[var(--space-section)]" aria-labelledby="close-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="grid items-end gap-8 md:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 id="close-title" className="display display-lg">
                If that sounds like you —<br />
                welcome to the rabble<span className="text-terracotta">.</span>
              </h2>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/new-arrivals" className="btn btn-carbon">
                  Shop Drop 01
                </Link>
                <a href={site.whatsapp.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  WhatsApp us
                </a>
              </div>
            </div>
            <div>
              <p className="label text-cobalt">Drop 02 — the list hears first</p>
              <JoinDrop source="about" className="relative mt-3" />
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
