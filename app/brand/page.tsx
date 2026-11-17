import type { Metadata } from "next";
import GarmentCutout from "@/components/GarmentCutout";
import JoinDrop from "@/components/JoinDrop";
import { NoiseBars, NoiseDivider, NoiseMark } from "@/components/Noise";
import Reveal from "@/components/Reveal";
import Wordmark from "@/components/Wordmark";
import { getGarment } from "@/content/garments";
import { voice } from "@/content/site";

export const metadata: Metadata = {
  title: "Brand — living style guide",
  description: "The RABBLE identity system: palette, type, spacing, radii, motion and the noise motif. Tokens live in globals.css; this page reads them.",
  robots: { index: false },
  alternates: { canonical: "/brand" },
};

const COLORS = [
  { name: "Alabaster", token: "--color-alabaster", hex: "#F6F5F0", role: "Page, paper, light surfaces" },
  { name: "Alabaster 2", token: "--color-alabaster-2", hex: "#EDECE6", role: "Studio backdrops, tints" },
  { name: "Alabaster 3", token: "--color-alabaster-3", hex: "#E2E1D9", role: "Deeper tint, backdrop vignette" },
  { name: "Carbon", token: "--color-carbon", hex: "#111111", role: "Type, buttons, dark surfaces" },
  { name: "Carbon 2", token: "--color-carbon-2", hex: "#3D3D3D", role: "Body copy" },
  { name: "Steel", token: "--color-steel", hex: "#8E8E93", role: "Captions, metadata, rails" },
  { name: "Steel 2", token: "--color-steel-2", hex: "#C4C4C8", role: "Hanger rod highlights" },
  { name: "Steel deep", token: "--color-steel-deep", hex: "#6B6B70", role: "Steel for small text — passes AA on alabaster" },
  { name: "Terracotta", token: "--color-terracotta", hex: "#B0451F", role: "Accent: punctuation, hover, live. AA on alabaster" },
  { name: "Terracotta deep", token: "--color-terracotta-deep", hex: "#8F3717", role: "Accent pressed" },
  { name: "Cobalt", token: "--color-cobalt", hex: "#1F3FD9", role: "Signal: waitlist, focus ring, prints" },
  { name: "Cobalt deep", token: "--color-cobalt-deep", hex: "#162FA8", role: "Signal pressed" },
  { name: "Cobalt light", token: "--color-cobalt-light", hex: "#8FA0FF", role: "Signal as text on carbon" },
];

const TYPE = [
  { cls: "display display-xl", label: "Display XL", token: "--text-display-xl", sample: "Noise" },
  { cls: "display display-lg", label: "Display LG", token: "--text-display-lg", sample: "Front says hello." },
  { cls: "display display-md", label: "Display MD", token: "--text-display-md", sample: "New this week" },
  { cls: "display display-sm", label: "Display SM", token: "--text-display-sm", sample: "Print spec" },
  { cls: "serif-note text-[var(--text-note-lg)]", label: "Note LG", token: "--text-note-lg", sample: "Back says goodbye." },
  { cls: "serif-note text-[var(--text-note)]", label: "Note", token: "--text-note", sample: "Give the rail a drag." },
  { cls: "prose-editorial", label: "Body LG", token: "--text-body-lg", sample: "Heavyweight fabric, honest cuts, colours that commit." },
  { cls: "text-[var(--text-body)]", label: "Body", token: "--text-body", sample: "Cold wash, inside out, line dry." },
  { cls: "text-[var(--text-caption)] text-steel-deep", label: "Caption", token: "--text-caption", sample: "Measurements are for size M." },
  { cls: "label", label: "Label", token: "--text-label", sample: "Drop 01 — Signal" },
  { cls: "micro", label: "Micro", token: "--text-micro", sample: "Front · Back" },
];

const SPACING = [
  ["--space-section", "clamp(4rem, 9vw, 7.5rem)", "Between page sections"],
  ["--space-block", "clamp(2rem, 4.5vw, 3.5rem)", "Between blocks inside a section"],
  ["--space-gutter", "1rem", "Page gutter, mobile"],
  ["--space-gutter-md", "1.5rem", "Page gutter, tablet up"],
];

const RADII = [
  ["--radius-xs", "3px", "Tags, focus rings"],
  ["--radius-sm", "6px", "Frames, studio backdrops"],
  ["--radius-md", "12px", "Cards, dialogs"],
  ["--radius-pill", "9999px", "Buttons, pills"],
];

const MOTION = [
  ["--ease-out", "cubic-bezier(0.22, 1, 0.36, 1)", "Everything that enters or settles"],
  ["--ease-in-out", "cubic-bezier(0.65, 0, 0.35, 1)", "Flips and reversals"],
  ["--duration-fast", "150ms", "Press, hover"],
  ["--duration-base", "250ms", "Colour, border, small moves"],
  ["--duration-slow", "650ms", "Reveals, flips"],
  ["--duration-glacial", "1200ms", "Rail intro drift"],
];

function Section({ id, title, kicker, children }: { id: string; title: string; kicker: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="py-[var(--space-block)]">
      <Reveal>
        <p className="label text-steel-deep">{kicker}</p>
        <h2 id={`${id}-title`} className="display display-md mt-2">
          {title}
        </h2>
      </Reveal>
      <div className="mt-8">{children}</div>
      <NoiseDivider className="mt-[var(--space-block)]" seed={title.length} />
    </section>
  );
}

function Token({ children }: { children: string }) {
  return <code className="tabular rounded-[var(--radius-xs)] bg-alabaster-2 px-1.5 py-0.5 text-[0.7rem] text-carbon-2">{children}</code>;
}

export default function BrandPage() {
  const g = getGarment("reprint-tee-01")!;
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 md:pt-20">
      <div className="rise">
        <p className="label text-terracotta">Living style guide</p>
        <h1 className="display display-xl mt-4">Brand</h1>
        <p className="prose-editorial mt-6 max-w-xl">
          Every value on this page is read from the tokens in <Token>app/globals.css</Token>. If it looks wrong here, fix it there — never in a component.
        </p>
      </div>

      <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-2">
        {["wordmark", "noise", "palette", "type", "spacing", "radii", "motion", "voice", "components"].map((id) => (
          <a key={id} href={`#${id}`} className="pill label px-4 py-2">
            {id}
          </a>
        ))}
      </nav>

      {/* ——— wordmark ——— */}
      <Section id="wordmark" kicker="01" title="Wordmark & lockups">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="studio grain grain-light flex aspect-[4/3] items-center justify-center">
            <Wordmark variant="horizontal" size="md" />
          </div>
          <div className="flex aspect-[4/3] items-center justify-center rounded-md bg-carbon">
            <Wordmark variant="stacked" tone="alabaster" size="md" />
          </div>
          <div className="studio grain grain-light flex aspect-[4/3] items-center justify-center gap-6">
            <Wordmark variant="mark" size="lg" />
            <Wordmark variant="mark" tone="alabaster" size="md" />
          </div>
        </div>
        <ul className="mt-6 grid gap-3 text-sm text-carbon-2 md:grid-cols-3">
          <li>
            <strong className="text-carbon">Horizontal</strong> for headers and footers. Mark leads, type follows, terracotta full stop always.
          </li>
          <li>
            <strong className="text-carbon">Stacked</strong> for tags, packaging and the founder note. Never centre the stack.
          </li>
          <li>
            <strong className="text-carbon">Mark only</strong> for favicons, app icons and social avatars. Minimum 16px.
          </li>
        </ul>
        <p className="mt-4 text-xs text-steel-deep">
          Favicon, Apple icon and Open Graph images are generated from the same mark at <Token>/icon.svg</Token>, <Token>/apple-icon</Token> and <Token>/opengraph-image</Token>.
        </p>
      </Section>

      {/* ——— noise ——— */}
      <Section id="noise" kicker="02" title="The noise motif">
        <p className="prose-editorial max-w-xl">
          A row of bars — a crowd drawn as a meter. It&rsquo;s the house print, the hang tag, the section divider and the favicon. Always seeded, never random, so the same bars render everywhere.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-md bg-carbon p-6">
            <NoiseBars seed={7} count={24} tone="alabaster" className="h-16 w-full" aspect={0.3} />
            <p className="micro mt-4 text-alabaster/50">Print · seed 7</p>
          </div>
          <div className="studio p-6">
            <NoiseBars seed={3} count={18} tone="terracotta" className="h-16 w-full" aspect={0.3} />
            <p className="micro mt-4 text-steel-deep">Tag · seed 3</p>
          </div>
          <div className="studio p-6">
            <NoiseBars seed={11} count={48} tone="cobalt" className="h-16 w-full" aspect={0.3} />
            <p className="micro mt-4 text-steel-deep">Divider · seed 11</p>
          </div>
          <div className="studio flex items-center justify-center p-6">
            <NoiseMark bg="carbon" tone="alabaster" className="size-16" />
            <NoiseMark bg="terracotta" tone="alabaster" className="ml-3 size-16" />
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="grain studio aspect-[16/9]">
            <p className="micro absolute bottom-3 left-3 z-[2] text-steel-deep">Grain overlay · .grain</p>
          </div>
          <div className="grain studio-dark aspect-[16/9]">
            <p className="micro absolute bottom-3 left-3 z-[2] text-alabaster/50">Grain on dark · .grain.studio-dark</p>
          </div>
        </div>
      </Section>

      {/* ——— palette ——— */}
      <Section id="palette" kicker="03" title="Palette">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {COLORS.map((c) => (
            <div key={c.token} className="overflow-hidden rounded-md border hairline">
              <div className="aspect-[4/3]" style={{ background: `var(${c.token})` }} />
              <div className="p-3">
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="tabular mt-0.5 text-xs text-steel-deep">{c.hex}</p>
                <p className="mt-2 text-xs text-carbon-2">{c.role}</p>
                <p className="mt-2">
                  <Token>{c.token}</Token>
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-xl text-sm text-carbon-2">
          Two accents, two jobs. <strong className="text-carbon">Terracotta</strong> is the brand&rsquo;s punctuation: the full stop, the hover, anything live. <strong className="text-carbon">Cobalt</strong> is the signal: waitlists, focus rings, and the ink on the one-run tees. They never sit side by side as text.
        </p>
      </Section>

      {/* ——— type ——— */}
      <Section id="type" kicker="04" title="Type scale">
        <p className="prose-editorial max-w-xl">
          Archivo Expanded ExtraBold (a 15 KB static latin instance, self-hosted) for anything that shouts. Instrument Serif italic for the aside, the breath, the soft landing. Body is Archivo at normal width, weight axis only.
        </p>
        <div className="mt-8 divide-y hairline border-y hairline">
          {TYPE.map((t) => (
            <div key={t.token} className="grid items-baseline gap-4 py-5 md:grid-cols-[10rem_1fr_auto]">
              <p className="label text-steel-deep">{t.label}</p>
              <p className={t.cls}>{t.sample}</p>
              <Token>{t.token}</Token>
            </div>
          ))}
        </div>
      </Section>

      {/* ——— spacing ——— */}
      <Section id="spacing" kicker="05" title="Spacing">
        <div className="grid gap-4 md:grid-cols-2">
          {SPACING.map(([token, value, role]) => (
            <div key={token} className="flex items-center gap-5 rounded-md border hairline p-4">
              <div className="h-10 shrink-0 bg-terracotta/20" style={{ width: `var(${token})` }} />
              <div>
                <Token>{token}</Token>
                <p className="tabular mt-1 text-xs text-steel-deep">{value}</p>
                <p className="mt-1 text-sm text-carbon-2">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ——— radii ——— */}
      <Section id="radii" kicker="06" title="Radii">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {RADII.map(([token, value, role]) => (
            <div key={token} className="text-center">
              <div className="mx-auto aspect-square w-24 bg-carbon" style={{ borderRadius: `var(${token})` }} />
              <p className="mt-3">
                <Token>{token}</Token>
              </p>
              <p className="tabular mt-1 text-xs text-steel-deep">{value}</p>
              <p className="mt-1 text-sm text-carbon-2">{role}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ——— motion ——— */}
      <Section id="motion" kicker="07" title="Motion">
        <p className="prose-editorial max-w-xl">
          One easing for almost everything, three durations, no animation libraries. Scroll reveals are a 16px rise. The rail is a damped pendulum driven by track acceleration. Everything has a reduced-motion path.
        </p>
        <div className="mt-8 divide-y hairline border-y hairline">
          {MOTION.map(([token, value, role]) => (
            <div key={token} className="grid gap-2 py-4 md:grid-cols-[14rem_1fr_1fr]">
              <Token>{token}</Token>
              <p className="tabular text-sm">{value}</p>
              <p className="text-sm text-carbon-2">{role}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn btn-carbon">
            Press me
          </button>
          <button type="button" className="btn btn-ghost">
            Hover me
          </button>
          <button type="button" className="btn btn-terracotta">
            Accent
          </button>
          <span className="pill label is-on px-4 py-2">Pill on</span>
          <span className="pill label px-4 py-2">Pill off</span>
          <span className="hang-tag">Tag</span>
          <span className="hang-tag hang-tag--terracotta">New</span>
          <span className="hang-tag hang-tag--cobalt">Drop 02</span>
        </div>
      </Section>

      {/* ——— voice ——— */}
      <Section id="voice" kicker="08" title="One voice, two registers">
        <div className="grid gap-4 md:grid-cols-2">
          {[voice.prints, voice.boutique].map((v) => (
            <div key={v.name} className="rounded-md border hairline p-6">
              <p className="label text-terracotta">{v.name}</p>
              <p className="mt-2 text-sm text-carbon-2">{v.rule}</p>
              <ul className="mt-5 space-y-3">
                {v.examples.map((ex) => (
                  <li key={ex} className={v.name === "Punchy" ? "display text-xl" : "serif-note text-xl"}>
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ——— components ——— */}
      <Section id="components" kicker="09" title="Components in the wild">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="label text-steel-deep">Garment cutout · front / back</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="studio grain grain-light aspect-[4/5] p-[10%]">
                <GarmentCutout garment={g} side="front" className="h-full w-full" />
              </div>
              <div className="studio-dark grain aspect-[4/5] p-[10%]">
                <GarmentCutout garment={g} side="back" className="h-full w-full" />
              </div>
            </div>
            <p className="mt-2 text-xs text-carbon-2">
              Prints are placed in centimetres from the collar and scale with the body. Photography slots (<Token>frontImage</Token>, <Token>backImage</Token>, <Token>sidePreview</Token>) replace the illustration with no component changes.
            </p>
          </div>
          <div>
            <p className="label text-steel-deep">Join the drop · success state</p>
            <div className="mt-3 rounded-md border hairline p-5">
              <JoinDrop source="brand" className="relative" />
            </div>
            <p className="mt-2 text-xs text-carbon-2">Submits to <Token>/api/waitlist</Token>. Try it: a drawn tick lands on success.</p>
          </div>
          <div>
            <p className="label text-steel-deep">Studio backdrops</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="studio aspect-square" />
              <div className="studio-dark aspect-square" />
            </div>
            <p className="mt-2 text-xs text-carbon-2">
              <Token>.studio</Token> and <Token>.studio-dark</Token>: a vignette that suggests a seamless paper sweep. Add <Token>.grain</Token> for film texture.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
