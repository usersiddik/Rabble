import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { noiseBars } from "./noise";

/**
 * Shared Open Graph frame. Alabaster paper, carbon type, the noise strip, terracotta full stop.
 * Fonts are static instances in /assets/fonts because satori can't read variable fonts.
 */

export const OG_SIZE = { width: 1200, height: 630 };

const C = {
  alabaster: "#F6F5F0",
  carbon: "#111111",
  steel: "#8E8E93",
  terracotta: "#B0451F",
  cobalt: "#1F3FD9",
};

async function fonts() {
  const dir = join(process.cwd(), "assets/fonts");
  const [display, serif] = await Promise.all([
    readFile(join(dir, "Archivo-Expanded-ExtraBold.woff")),
    readFile(join(dir, "InstrumentSerif-Italic.ttf")),
  ]);
  return [
    { name: "Archivo", data: display, weight: 800 as const, style: "normal" as const },
    { name: "Instrument Serif", data: serif, weight: 400 as const, style: "italic" as const },
  ];
}

function Bars({ seed, count, color, width, height }: { seed: number; count: number; color: string; width: number; height: number }) {
  const bars = noiseBars(seed, count);
  const gap = width / count;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", width, height, gap: 0 }}>
      {bars.map((v, i) => (
        <div
          key={i}
          style={{
            width: gap * 0.6,
            marginRight: gap * 0.4,
            height: Math.max(height * 0.08, v * height),
            background: color,
            borderRadius: 3,
          }}
        />
      ))}
    </div>
  );
}

interface OgFrameProps {
  kicker: string;
  title: string;
  /** rendered in serif italic after the title */
  note?: string;
  meta?: string;
  tone?: "light" | "dark";
  art?: React.ReactNode;
}

export async function ogImage({ kicker, title, note, meta, tone = "light", art }: OgFrameProps) {
  const dark = tone === "dark";
  const bg = dark ? C.carbon : C.alabaster;
  const fg = dark ? C.alabaster : C.carbon;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: bg,
          color: fg,
          padding: 64,
          fontFamily: "Archivo",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", width: 44, height: 44, borderRadius: 9, background: fg, alignItems: "flex-end", justifyContent: "center", paddingBottom: 9 }}>
              <Bars seed={1} count={5} color={bg} width={28} height={24} />
            </div>
            <div style={{ display: "flex", fontSize: 30, letterSpacing: -0.5, textTransform: "uppercase" }}>
              Rabble<span style={{ color: C.terracotta }}>.</span>
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 3, textTransform: "uppercase", color: dark ? "rgba(246,245,240,0.55)" : C.steel }}>
            {kicker}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: art ? 600 : 1040, flexShrink: 1 }}>
            <div style={{ display: "flex", flexWrap: "wrap", fontSize: title.length > 24 ? 72 : 96, lineHeight: 0.95, letterSpacing: -2, textTransform: "uppercase" }}>
              {title}
            </div>
            {note && (
              <div style={{ display: "flex", fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 54, lineHeight: 1.05, marginTop: 18, color: C.terracotta }}>
                {note}
              </div>
            )}
            {meta && (
              <div style={{ display: "flex", marginTop: 28, fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: dark ? "rgba(246,245,240,0.55)" : C.steel }}>
                {meta}
              </div>
            )}
          </div>
          {art}
        </div>

        <Bars seed={13} count={80} color={dark ? "rgba(246,245,240,0.18)" : "rgba(17,17,17,0.12)"} width={1072} height={48} />
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
