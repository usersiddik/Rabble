import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { editorial } from "@/lib/products";

export const metadata: Metadata = {
  title: "The manifesto",
  description:
    "RABBLE is what happens when the crowd gets a point of view. Designed in India, worn loudly.",
};

const LINES = [
  "Rabble, noun. A noisy crowd. The unruly many.",
  "Dictionaries mean it as an insult. We took it as a brief.",
  "We make clothes for people who show up in numbers — to courtyards, weddings, protests, basement gigs and 2 a.m. chai runs.",
  "No logos shouting over your face. No beige minimalism pretending to be a personality. No ₹40,000 hoodies.",
  "Heavyweight fabric, honest cuts, colours that commit. Made in small runs, because scarcity should be real, not marketing.",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 md:pt-20">
      <Reveal>
        <p className="label text-accent">The manifesto</p>
        <h1 className="display mt-4 max-w-4xl text-5xl md:text-7xl">
          The crowd got <span className="serif-note lowercase text-accent">a point of view.</span>
        </h1>
      </Reveal>

      <div className="mt-16 grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
        <div className="space-y-8">
          {LINES.map((line, i) => (
            <Reveal key={i} delay={i * 60}>
              <p
                className={
                  i === 0
                    ? "serif-note text-2xl text-ink md:text-3xl"
                    : "max-w-md text-lg text-ink-2"
                }
              >
                {line}
              </p>
            </Reveal>
          ))}
          <Reveal delay={320}>
            <p className="display text-2xl md:text-3xl">
              If that sounds like you —<br />
              welcome to the rabble<span className="text-accent">.</span>
            </p>
            <Link href="/new-arrivals" className="btn btn-ink mt-8">
              Shop Drop 01
            </Link>
          </Reveal>
        </div>

        <div className="space-y-5">
          <Reveal className="img-hover">
            <div className="img-frame relative aspect-[4/5]">
              <Image
                src={editorial.crowd}
                alt="Friends crowded on a city bench"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={100} className="img-hover ml-auto w-3/4">
            <div className="img-frame relative aspect-[4/3]">
              <Image
                src={editorial.rackBrick}
                alt="Jackets hanging on a rack against a brick wall"
                fill
                sizes="(min-width: 768px) 34vw, 75vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>

      {/* facts strip */}
      <Reveal className="mt-24 grid gap-px overflow-hidden rounded-md bg-ink/10 sm:grid-cols-3">
        {[
          ["Small runs", "Every piece is a limited run. Sold out means sold out."],
          ["Designed in India", "Cut for our weather, our streets and our volume settings."],
          ["Built to be lived in", "240 GSM tees, 450 GSM fleece. Wash tests before vibe tests."],
        ].map(([title, body]) => (
          <div key={title} className="bg-chalk p-8">
            <h2 className="display text-xl">{title}</h2>
            <p className="mt-3 text-sm text-ink-2">{body}</p>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
