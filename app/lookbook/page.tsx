import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GarmentCutout from "@/components/GarmentCutout";
import JoinDrop from "@/components/JoinDrop";
import { NoiseBars, NoiseDivider } from "@/components/Noise";
import Parallax from "@/components/Parallax";
import Reveal from "@/components/Reveal";
import { getGarment } from "@/content/garments";
import { lookbook, type LookbookBlock } from "@/content/lookbook";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "Drop 01 seen the way it will be seen — mostly from behind. Mood, texture and type until the shoots exist.",
  alternates: { canonical: "/lookbook" },
};

const RATIO: Record<string, string> = {
  "3/4": "aspect-[3/4]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "16/9": "aspect-[16/9]",
  "2/3": "aspect-[2/3]",
};

const TONE_BG: Record<string, string> = {
  light: "studio grain grain-light text-carbon",
  dark: "studio-dark grain text-alabaster",
  terracotta: "bg-terracotta grain text-alabaster",
  cobalt: "bg-cobalt grain text-alabaster",
};

function Block({ block, index }: { block: LookbookBlock; index: number }) {
  if (block.type === "caption") {
    const g = block.slug ? getGarment(block.slug) : undefined;
    return (
      <Reveal as="div" className="flex flex-col justify-end py-6 md:py-10">
        <p className="label text-steel-deep">{block.kicker}</p>
        <p className="serif-note mt-3 text-[var(--text-note)] text-carbon">{block.body}</p>
        {g && (
          <Link href={`/product/${g.slug}`} className="label mt-5 inline-block hover:text-terracotta">
            {g.name} →
          </Link>
        )}
      </Reveal>
    );
  }

  const span = block.span === 2 ? "md:col-span-2" : "";
  const ratio = RATIO[block.ratio];

  if (block.type === "type") {
    return (
      <Reveal as="div" className={span}>
        <Parallax speed={block.parallax ?? 0} className={`${ratio} ${TONE_BG[block.tone]} relative flex items-end overflow-hidden rounded-md p-6 md:p-10`}>
          <div className="relative z-[2]">
            <p className="display text-[clamp(2.5rem,7vw,6rem)]">
              {block.lines.map((l, i) => (
                <span key={i} className="block">
                  {l}
                </span>
              ))}
            </p>
            {block.note && <p className="serif-note mt-4 text-2xl opacity-80">{block.note}</p>}
          </div>
        </Parallax>
      </Reveal>
    );
  }

  if (block.type === "texture") {
    return (
      <Reveal as="div" className={span}>
        <Parallax speed={block.parallax ?? 0} className={`${ratio} ${TONE_BG[block.tone]} relative overflow-hidden rounded-md`}>
          {block.texture === "bars" && <NoiseBars seed={index + 2} count={140} aspect={0.5} className="absolute inset-x-0 bottom-0 h-[70%] w-full opacity-30" />}
          {block.texture === "halftone" && (
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: "radial-gradient(currentColor 1.2px, transparent 1.4px)",
                backgroundSize: "9px 9px",
                maskImage: "linear-gradient(135deg, black, transparent 80%)",
                WebkitMaskImage: "linear-gradient(135deg, black, transparent 80%)",
              }}
            />
          )}
          <p className="micro absolute bottom-4 left-4 z-[2] opacity-70">{block.label}</p>
        </Parallax>
      </Reveal>
    );
  }

  // garment
  const g = getGarment(block.slug);
  if (!g) return null;
  return (
    <Reveal as="div" className={span}>
      <Link href={`/product/${g.slug}`} className="group block">
        <Parallax speed={block.parallax ?? 0} className={`${ratio} ${TONE_BG[block.backdrop]} relative overflow-hidden rounded-md`}>
          {block.image ? (
            <Image src={block.image} alt={block.caption} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-[10%] transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-[1.03]">
              <GarmentCutout garment={g} side={block.side} alt={block.caption} className="h-full w-auto max-w-full" />
            </div>
          )}
        </Parallax>
        <p className="mt-3 flex items-baseline justify-between gap-3 text-sm">
          <span className="font-semibold group-hover:text-terracotta">{block.caption}</span>
          <span className="micro shrink-0 text-steel-deep">{g.status === "waitlist" ? "Drop 02" : `Drop 0${g.drop}`}</span>
        </p>
      </Link>
    </Reveal>
  );
}

export default function LookbookPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 md:pt-20">
      <div className="rise">
        <p className="label text-terracotta">Lookbook</p>
        <h1 className="display display-xl mt-4">
          Seen from <span className="serif-note lowercase text-terracotta">behind.</span>
        </h1>
        <p className="prose-editorial mt-6 max-w-xl">
          Three chapters of Drop 01. Mood, texture and type until the shoots exist — every frame links to the piece it&rsquo;s about.
        </p>
      </div>

      {lookbook.map((chapter, ci) => (
        <section key={chapter.id} id={chapter.id} aria-labelledby={`${chapter.id}-title`} className="mt-[var(--space-section)]">
          <Reveal className="grid gap-4 md:grid-cols-[6rem_1fr] md:items-end">
            <p className="display text-6xl text-steel-2 md:text-7xl">{chapter.number}</p>
            <div>
              <h2 id={`${chapter.id}-title`} className="display display-lg">
                {chapter.title}
              </h2>
              <p className="serif-note mt-2 text-xl text-carbon-2">{chapter.intro}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2 md:gap-8">
            {chapter.blocks.map((block, i) => (
              <Block key={i} block={block} index={ci * 10 + i} />
            ))}
          </div>
          {ci < lookbook.length - 1 && <NoiseDivider className="mt-[var(--space-section)]" seed={ci + 30} label={`Chapter ${chapter.number}`} />}
        </section>
      ))}

      <section className="mt-[var(--space-section)] rounded-md bg-carbon p-8 text-alabaster md:p-12" aria-labelledby="lb-join">
        <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="label text-cobalt-light">Chapter IV — unwritten</p>
            <h2 id="lb-join" className="display display-md mt-3">
              Drop 02 gets its own pages.
            </h2>
            <p className="mt-3 max-w-md text-alabaster/70">Six pieces, 12 December. The list sees the proofs first.</p>
          </div>
          <JoinDrop source="lookbook" tone="dark" className="relative" />
        </div>
      </section>
    </div>
  );
}
