import type { Metadata } from "next";
import Link from "next/link";
import DropCountdown from "@/components/DropCountdown";
import GarmentCutout from "@/components/GarmentCutout";
import JoinDrop from "@/components/JoinDrop";
import JsonLd from "@/components/JsonLd";
import NotifyMe from "@/components/NotifyMe";
import { NoiseBars, NoiseDivider } from "@/components/Noise";
import Reveal from "@/components/Reveal";
import { byDrop, formatINR } from "@/content/garments";
import { currentDrop, nextDrop } from "@/content/drops";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Drop 02 — Feedback",
  description: "Six new pieces land 12 December. Join the waitlist and get the link an hour before anyone else.",
  alternates: { canonical: "/drop" },
};

export default function DropPage() {
  const next = nextDrop();
  const live = currentDrop();
  const pieces = next ? byDrop(next.number) : [];
  const date = next ? new Date(next.date) : null;

  const eventLd = next
    ? {
        "@context": "https://schema.org",
        "@type": "SaleEvent",
        name: `${site.name} ${next.code} — ${next.name}`,
        startDate: next.date,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        location: { "@type": "VirtualLocation", url: `${site.url}/drop` },
        organizer: { "@type": "Organization", name: site.name, url: site.url },
        description: next.blurb,
      }
    : null;

  return (
    <div>
      {eventLd && <JsonLd data={eventLd} />}
      <section className="bg-carbon py-14 text-alabaster md:py-20" aria-labelledby="drop-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {next ? (
            <>
              <div className="rise flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="label text-cobalt-light">
                    {next.code} — {next.name}
                  </p>
                  <h1 id="drop-title" className="display display-xl mt-4">
                    {next.tagline}
                  </h1>
                </div>
                <dl className="tabular grid grid-cols-3 gap-6 text-right">
                  {[
                    ["Drop", next.code.replace("DROP ", "")],
                    ["Pieces", String(next.pieces)],
                    ["In the run", next.runSize.toLocaleString("en-IN")],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="micro text-alabaster/50">{k}</dt>
                      <dd className="display mt-1 text-3xl md:text-4xl">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <Reveal delay={120} className="mt-12 grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
                <DropCountdown target={next.date} tone="dark" />
                <div>
                  <p className="text-alabaster/70">
                    Lands{" "}
                    <strong className="text-alabaster">
                      {date?.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}, 10 a.m. IST
                    </strong>
                    . {next.blurb}
                  </p>
                  <JoinDrop source="drop" tone="dark" className="relative mt-5" />
                </div>
              </Reveal>
            </>
          ) : (
            <Reveal>
              <p className="label text-terracotta">{live.code} is live</p>
              <h1 id="drop-title" className="display display-xl mt-4">
                No drop scheduled.
              </h1>
              <Link href="/new-arrivals" className="btn btn-alabaster mt-8">
                Shop what&rsquo;s live
              </Link>
            </Reveal>
          )}
        </div>
        <NoiseBars seed={next?.number ?? 1} count={120} aspect={0.08} className="mt-14 h-10 w-full text-alabaster/10" />
      </section>

      {next && (
        <section className="mx-auto max-w-7xl px-4 py-[var(--space-section)] sm:px-6" aria-labelledby="pieces-title">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label text-steel-deep">The pieces</p>
              <h2 id="pieces-title" className="display display-lg mt-2">
                {next.pieces} in the run
              </h2>
            </div>
            <p className="serif-note max-w-sm text-lg text-carbon-2 md:text-right">
              Illustrated proofs for now. Tell us your size per piece and we&rsquo;ll shout the minute it&rsquo;s live.
            </p>
          </Reveal>

          <div className="mt-10 divide-y hairline border-t hairline">
            {pieces.map((g, i) => (
              <Reveal key={g.slug} as="div" className="grid gap-6 py-10 md:grid-cols-[6rem_1fr_1fr] md:gap-10">
                <div className="flex gap-3 md:block">
                  <p className="display tabular text-3xl text-steel-2">{String(i + 1).padStart(2, "0")}</p>
                  <div className="studio grain grain-light aspect-[4/5] w-24 p-2 md:mt-3 md:w-full">
                    <GarmentCutout garment={g} side="back" hanger={false} className="h-full w-full" />
                  </div>
                </div>
                <div>
                  <h3 className="display text-2xl">
                    <Link href={`/product/${g.slug}`} className="hover:text-terracotta">
                      {g.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-steel-deep">
                    {g.color} · {g.category} · {formatINR(g.price)}
                  </p>
                  <p className="prose-editorial mt-4 max-w-md text-base">{g.description}</p>
                  <dl className="tabular mt-4 grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <dt className="micro text-steel-deep">Run</dt>
                      <dd className="mt-0.5">{g.runSize} pcs</dd>
                    </div>
                    <div>
                      <dt className="micro text-steel-deep">Fabric</dt>
                      <dd className="mt-0.5">{g.print.gsm} GSM</dd>
                    </div>
                    <div>
                      <dt className="micro text-steel-deep">Ink</dt>
                      <dd className="mt-0.5">{g.print.inkName}</dd>
                    </div>
                  </dl>
                </div>
                <div className="rounded-md border hairline p-5">
                  <p className="label">Notify me</p>
                  <NotifyMe garment={g} compact />
                </div>
              </Reveal>
            ))}
          </div>

          <NoiseDivider className="mt-[var(--space-block)]" seed={5} label={live.code} />

          <Reveal className="mt-[var(--space-block)] flex flex-wrap items-center justify-between gap-4">
            <p className="serif-note text-xl text-carbon-2">Can&rsquo;t wait? {live.code} is on the rail right now.</p>
            <Link href="/new-arrivals" className="btn btn-carbon">
              Shop {live.code}
            </Link>
          </Reveal>
        </section>
      )}
    </div>
  );
}
