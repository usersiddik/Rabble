/**
 * GarmentRender — the procedural studio garment that hangs from a hook.
 *
 * Renders in a 300×440 viewBox. The hanger hook sits at (150, 14); the rack
 * pivots every item around that point for the pendulum sway.
 *
 * Three views:
 *   view="front"  chest print / front details
 *   view="back"   back print
 *   view="side"   the heavy edge-on shading used for inactive rail items
 *
 * Two render modes:
 *   - procedural: a vector silhouette with fabric grain, fold shading, rib
 *     trims and seam stitching (default — no assets needed)
 *   - photographic: pass `image` (a transparent PNG / WebP cutout) and the
 *     photo is masked into the silhouette instead of the flat fabric fill.
 *
 * Prints are the catalogue's own placements (`content/garments.ts`), measured
 * in centimetres from the collar seam, so the drawing always agrees with the
 * print spec on the product page.
 *
 * Use <GarmentCutout garment={…} /> in pages; it picks photography or this.
 * Needs <GarmentDefs /> once on the page (the root layout renders it).
 */

import { useId } from "react";
import { noiseBars } from "@/lib/noise";
import type { Placement } from "@/content/garments";

export type GarmentKind = "tee" | "hoodie" | "cropped-hoodie" | "crew" | "trucker" | "bomber" | "dress";
export type GarmentView = "front" | "back" | "side";
export type TagTone = "carbon" | "terracotta" | "cobalt";

export interface GarmentColors {
  /** base fabric colour */
  body: string;
  /** darker tone used for ribs, seams and fold shading */
  shade: string;
  /** trims: collars, buttons */
  detail?: string;
}

export interface GarmentRenderProps {
  kind: GarmentKind;
  view?: GarmentView;
  body: string;
  shade: string;
  detail?: string;
  ink?: string;
  print?: Placement;
  /** optional transparent cutout photo for this view */
  image?: string;
  tag?: string;
  tagTone?: TagTone;
  /** draw the hanger (off for thumbnails) */
  hanger?: boolean;
  /**
   * add the edge-on shading as a layer (`.garment-side-shade`) that CSS fades in —
   * the rack turns pieces sideways without drawing each garment twice
   */
  sideShade?: boolean;
  /** accessible name; omit to mark decorative */
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

const TAG_FILL: Record<TagTone, string> = { carbon: "#111111", terracotta: "#b0451f", cobalt: "#1f3fd9" };

/* ———————————————————————————— silhouettes ———————————————————————————— */

interface Silhouette {
  /** full outer outline (used as clip + base fill) */
  outline: string;
  /** sleeves drawn in the darker tone, behind the body */
  sleeves?: string[];
  /** the body only */
  body: string;
  /** bottom of the body, for hem ribs */
  hemY: number;
  /** bottom of long sleeves, for cuff ribs */
  sleeveHem?: number;
  /** y of the collar seam, front and back — prints are measured from here */
  collar: { front: number; back: number };
}

const LONG_SLEEVES = (hem: number) => [
  `M64 108 C46 116 36 200 42 ${hem} L84 ${hem} C84 260 86 180 100 110 Z`,
  `M236 108 C254 116 264 200 258 ${hem} L216 ${hem} C216 260 214 180 200 110 Z`,
];

const ribbed = (sleeveHem: number, hem: number): Silhouette => ({
  outline: `M112 96 C130 88 170 88 188 96 L236 108 C254 116 264 200 258 ${sleeveHem} L220 ${sleeveHem} L220 ${hem} L80 ${hem} L80 ${sleeveHem} L42 ${sleeveHem} C36 200 46 116 64 108 Z`,
  sleeves: LONG_SLEEVES(sleeveHem),
  body: `M94 108 C86 170 82 260 82 ${hem} L218 ${hem} C218 260 214 170 206 108 C176 96 124 96 94 108 Z`,
  hemY: hem,
  sleeveHem,
  collar: { front: 106, back: 100 },
});

const TEE: Silhouette = {
  outline:
    "M118 96 C132 90 168 90 182 96 L236 110 C250 118 262 150 262 178 L222 192 C220 240 220 290 222 334 L78 334 C80 290 80 240 78 192 L38 178 C38 150 50 118 64 110 Z",
  sleeves: [
    "M64 110 C50 118 38 150 38 178 L84 194 L96 172 C90 150 90 128 100 108 Z",
    "M236 110 C250 118 262 150 262 178 L216 194 L204 172 C210 150 210 128 200 108 Z",
  ],
  body: "M92 108 C84 170 80 250 78 334 L222 334 C220 250 216 170 208 108 C176 96 124 96 92 108 Z",
  hemY: 334,
  collar: { front: 108, back: 99 },
};

const HOODIE: Silhouette = { ...ribbed(356, 366), collar: { front: 106, back: 112 } };
const CROPPED: Silhouette = { ...ribbed(292, 302), collar: { front: 106, back: 112 } };
const CREW: Silhouette = { ...ribbed(346, 356), collar: { front: 108, back: 100 } };
const TRUCKER: Silhouette = { ...ribbed(340, 352), collar: { front: 122, back: 100 } };
const BOMBER: Silhouette = { ...ribbed(330, 344), collar: { front: 106, back: 100 } };

const DRESS_PATH =
  "M104 96 C110 94 118 102 124 112 C140 104 160 104 176 112 C182 102 190 94 196 96 C206 130 212 160 214 188 C224 250 236 320 242 400 L58 400 C64 320 76 250 86 188 C88 160 94 130 104 96 Z";
const DRESS: Silhouette = { outline: DRESS_PATH, body: DRESS_PATH, hemY: 400, collar: { front: 112, back: 112 } };

const SHAPES: Record<GarmentKind, Silhouette> = {
  tee: TEE,
  hoodie: HOODIE,
  "cropped-hoodie": CROPPED,
  crew: CREW,
  trucker: TRUCKER,
  bomber: BOMBER,
  dress: DRESS,
};

/* ———————————————————————————— prints ———————————————————————————— */

/** ≈ viewBox units per cm: a size-M body is ~140 units across the chest for ~52 cm */
const UNIT = 140 / 52;

const DISPLAY_FONT = {
  fontFamily: "var(--font-display), Archivo, ui-sans-serif, system-ui, sans-serif",
  fontWeight: 800,
  letterSpacing: "-0.01em",
} as const;

function luminance(hex: string): number {
  const n = parseInt(hex.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
}

function PrintMark({ p, ink, x, y, w, h, uid }: { p: Placement; ink: string; x: number; y: number; w: number; h: number; uid: string }) {
  const { mark } = p;
  if (mark.type === "wordmark") {
    return (
      <text
        x={x + w / 2}
        y={y + h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={h * 0.9}
        textLength={w}
        lengthAdjust="spacingAndGlyphs"
        fill={ink}
        style={DISPLAY_FONT}
      >
        {mark.text}
      </text>
    );
  }
  if (mark.type === "lines") {
    const lineH = h / mark.lines.length;
    const longest = Math.max(...mark.lines.map((l) => l.length));
    const left = p.position === "chest-left";
    return (
      <g>
        {mark.lines.map((line, i) => (
          <text
            key={i}
            x={left ? x : x + w / 2}
            y={y + lineH * i + lineH / 2}
            textAnchor={left ? "start" : "middle"}
            dominantBaseline="central"
            fontSize={lineH * 0.82}
            textLength={w * Math.max(0.35, line.length / longest)}
            lengthAdjust="spacingAndGlyphs"
            fill={ink}
            opacity={mark.lines.length > 2 ? 1 - i * 0.28 : 1}
            style={DISPLAY_FONT}
          >
            {line}
          </text>
        ))}
      </g>
    );
  }
  if (mark.type === "bars") {
    const count = Math.max(8, Math.round(w / 3.2));
    const gap = w / count;
    const bw = gap * 0.62;
    return (
      <g fill={ink}>
        {noiseBars(mark.seed, count).map((v, i) => {
          const bh = Math.max(1.5, v * h);
          return <rect key={i} x={x + i * gap} y={y + (h - bh)} width={bw} height={bh} rx={bw / 4} />;
        })}
      </g>
    );
  }
  // stamp: a ring of text around a small noise meter
  const r = Math.min(w, h) / 2;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const id = `${uid}-stamp`;
  const bw = (r * 0.8) / 9;
  return (
    <g>
      <defs>
        <path
          id={id}
          d={`M ${cx} ${cy} m -${r * 0.78} 0 a ${r * 0.78} ${r * 0.78} 0 1 1 ${r * 1.56} 0 a ${r * 0.78} ${r * 0.78} 0 1 1 -${r * 1.56} 0`}
        />
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={ink} strokeWidth={r * 0.07} />
      <circle cx={cx} cy={cy} r={r * 0.6} fill="none" stroke={ink} strokeWidth={r * 0.04} />
      <text fontSize={r * 0.3} fill={ink} style={{ ...DISPLAY_FONT, letterSpacing: "0.18em" }}>
        <textPath href={`#${id}`} startOffset="0" textLength={2 * Math.PI * r * 0.78 * 0.98} lengthAdjust="spacingAndGlyphs">
          {mark.text + " · "}
        </textPath>
      </text>
      <g fill={ink}>
        {noiseBars(5, 9).map((v, i) => {
          const bh = Math.max(r * 0.08, v * r * 0.55);
          return <rect key={i} x={cx - r * 0.4 + i * bw} y={cy + r * 0.26 - bh} width={bw * 0.6} height={bh} rx={bw * 0.15} />;
        })}
      </g>
    </g>
  );
}

function Print({ s, side, p, ink, uid }: { s: Silhouette; side: "front" | "back"; p: Placement; ink: string; uid: string }) {
  const w = p.widthCm * UNIT;
  const h = p.heightCm * UNIT;
  const y = s.collar[side] + p.fromCollarCm * UNIT;
  // the wearer's left chest sits on the viewer's right
  const cx = p.position === "chest-left" ? 184 : 150;
  return <PrintMark p={p} ink={ink} x={cx - w / 2} y={y} w={w} h={h} uid={uid} />;
}

/* ———————————————————————————— shared defs ———————————————————————————— */

/**
 * The filters and gradients every garment uses, defined once per page (rendered in the
 * root layout) instead of inside each of the dozens of SVGs on a page. Not display:none —
 * browsers skip gradients and filters that live in an undisplayed SVG.
 */
export function GarmentDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        {/* fabric grain */}
        <filter id="gr-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="7" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" intercept="-0.1" />
          </feComponentTransfer>
        </filter>
        {/* soft blur for drape streaks */}
        <filter id="gr-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="gr-tagshadow" x="-20%" y="-40%" width="140%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.25" />
        </filter>
        {/* fold shading, left to right */}
        <linearGradient id="gr-fold" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.22" />
          <stop offset="0.1" stopColor="#000" stopOpacity="0.02" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.52" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.72" stopColor="#000" stopOpacity="0.06" />
          <stop offset="0.9" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.24" />
        </linearGradient>
        {/* side-hang fold: heavy shading, like a garment seen edge-on */}
        <linearGradient id="gr-side" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.45" />
          <stop offset="0.35" stopColor="#000" stopOpacity="0.05" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
        {/* vertical light: slightly brighter at the shoulders */}
        <linearGradient id="gr-light" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="gr-wood" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#b8864f" />
          <stop offset="0.45" stopColor="#9a6a3b" />
          <stop offset="1" stopColor="#6e4826" />
        </linearGradient>
        <linearGradient id="gr-steel" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#6d6d71" />
          <stop offset="0.5" stopColor="#c9c9cc" />
          <stop offset="1" stopColor="#7a7a7e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ———————————————————————————— hanger + tag ———————————————————————————— */

function Hanger() {
  return (
    <g>
      {/* hook */}
      <path d="M150 52 L150 30 C150 16 140 11 133 16" fill="none" stroke="url(#gr-steel)" strokeWidth="4" strokeLinecap="round" />
      {/* swivel collar */}
      <rect x="146" y="48" width="8" height="7" rx="1.5" fill="#8e8e93" />
      {/* wooden bar */}
      <path d="M150 54 L252 100 C258 103 256 112 250 110 L150 66 L50 110 C44 112 42 103 48 100 Z" fill="url(#gr-wood)" />
      {/* grain */}
      <path d="M72 100 L150 64 M90 97 L150 70" stroke="#5c3a1c" strokeWidth="0.6" opacity="0.5" fill="none" />
      <path d="M228 100 L150 64 M210 97 L150 70" stroke="#5c3a1c" strokeWidth="0.6" opacity="0.5" fill="none" />
      {/* lower cross bar */}
      <path d="M58 108 L242 108" stroke="#8e8e93" strokeWidth="2" opacity="0.9" />
      <path d="M58 108 L242 108" stroke="#fff" strokeWidth="0.6" opacity="0.5" />
    </g>
  );
}

function NeckTag({ text, tone }: { text: string; tone: TagTone }) {
  const label = text.toUpperCase();
  const w = label.length * 5.6 + 14;
  return (
    <g transform="rotate(-6 150 44)">
      <line x1="151" y1="38" x2="160" y2="50" stroke="#8e8e93" strokeWidth="1" />
      <rect x="156" y="48" width={w} height="18" rx="2" fill={TAG_FILL[tone]} filter="url(#gr-tagshadow)" />
      <text x={156 + w / 2} y="60.5" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#f6f5f0" letterSpacing="0.12em">
        {label}
      </text>
    </g>
  );
}

/* ———————————————————————————— per-kind details ———————————————————————————— */

/** knit rib texture: 30 vertical ticks drawn as one dashed stroke */
function RibTicks({ y, h }: { y: number; h: number }) {
  return <path d={`M87.7 ${y} H213`} stroke="#000" strokeWidth={h} strokeDasharray="0.6 3.7" opacity="0.18" />;
}

function Ribs({ s, shade }: { s: Silhouette; shade: string }) {
  const sleeveHem = s.sleeveHem ?? s.hemY - 10;
  return (
    <g>
      <rect x="82" y={s.hemY - 5} width="136" height="10" rx="4" fill={shade} />
      <rect x="42" y={sleeveHem - 6} width="42" height="10" rx="4" fill={shade} opacity="0.9" />
      <rect x="216" y={sleeveHem - 6} width="42" height="10" rx="4" fill={shade} opacity="0.9" />
      <RibTicks y={s.hemY + 1} h={8} />
    </g>
  );
}

function Details({ kind, s, isBack, body, shade, detail }: { kind: GarmentKind; s: Silhouette; isBack: boolean; body: string; shade: string; detail: string }) {
  switch (kind) {
    case "tee":
      return (
        <g>
          <path
            d={isBack ? "M118 96 C132 102 168 102 182 96 C168 92 132 92 118 96 Z" : "M118 96 C126 112 174 112 182 96 C168 90 132 90 118 96 Z"}
            fill={shade}
          />
          <path
            d={isBack ? "M118 96 C132 102 168 102 182 96" : "M118 96 C126 112 174 112 182 96"}
            fill="none"
            stroke="#000"
            strokeWidth="0.8"
            opacity="0.25"
          />
          {/* sleeve hem stitching */}
          <path d="M48 170 L72 182 M252 170 L228 182" stroke={shade} strokeWidth="1.2" strokeDasharray="2 2" opacity="0.8" />
        </g>
      );
    case "hoodie":
    case "cropped-hoodie":
      return (
        <g>
          {!isBack && (
            <g>
              <path d="M112 94 C118 80 182 80 188 94 C176 108 124 108 112 94 Z" fill={body} />
              <path d="M118 95 C124 84 176 84 182 95 C172 104 128 104 118 95 Z" fill={shade} opacity="0.35" />
              <path d="M140 104 L136 140 M160 104 L164 140" stroke={shade} strokeWidth="2.6" strokeLinecap="round" />
              <circle cx="136" cy="141" r="2" fill={shade} />
              <circle cx="164" cy="141" r="2" fill={shade} />
              {/* kangaroo pocket */}
              <path
                d={`M104 ${s.hemY - 70} L196 ${s.hemY - 70} L188 ${s.hemY - 22} L112 ${s.hemY - 22} Z`}
                fill="none"
                stroke={shade}
                strokeWidth="2.2"
                strokeLinejoin="round"
                opacity="0.75"
              />
            </g>
          )}
          <Ribs s={s} shade={shade} />
        </g>
      );
    case "crew":
      return (
        <g>
          <path
            d={isBack ? "M112 96 C130 104 170 104 188 96 C170 90 130 90 112 96 Z" : "M112 96 C124 112 176 112 188 96 C170 88 130 88 112 96 Z"}
            fill={shade}
          />
          <Ribs s={s} shade={shade} />
        </g>
      );
    case "trucker":
      return isBack ? (
        <g>
          {/* collar band from behind, yoke seam, back pleats */}
          <path d="M112 96 C130 86 170 86 188 96 C170 106 130 106 112 96 Z" fill={detail} />
          <path d="M84 150 C120 140 180 140 216 150" stroke={shade} strokeWidth="2.2" fill="none" opacity="0.85" />
          <path d="M110 152 L104 340 M190 152 L196 340" stroke={shade} strokeWidth="1.6" opacity="0.55" />
          <rect x="82" y={s.hemY - 14} width="136" height="16" rx="3" fill={shade} />
          <rect x="42" y="330" width="42" height="12" rx="3" fill={shade} opacity="0.9" />
          <rect x="216" y="330" width="42" height="12" rx="3" fill={shade} opacity="0.9" />
        </g>
      ) : (
        <g>
          {/* point collar */}
          <path d="M112 96 L150 124 L188 96 C176 84 124 84 112 96 Z" fill={detail} />
          <path d="M112 96 L130 136 L150 124 Z M188 96 L170 136 L150 124 Z" fill={detail} />
          <path d="M112 96 L130 136 L150 124 M188 96 L170 136 L150 124" fill="none" stroke="#000" strokeWidth="0.8" opacity="0.25" />
          {/* yoke + placket */}
          <path d="M86 150 C112 144 128 144 146 148 M154 148 C172 144 188 144 214 150" stroke={shade} strokeWidth="1.6" fill="none" opacity="0.8" />
          <path d={`M150 124 L150 ${s.hemY}`} stroke={shade} strokeWidth="3" />
          <path d={`M143 128 L143 ${s.hemY} M157 128 L157 ${s.hemY}`} stroke={shade} strokeWidth="1.2" opacity="0.6" />
          {[146, 188, 230, 272, 314].map((y) => (
            <circle key={y} cx="150" cy={y} r="3.6" fill={detail} stroke="#000" strokeOpacity="0.25" strokeWidth="0.6" />
          ))}
          {/* flap chest pockets */}
          <g stroke={shade} strokeWidth="2.2" fill="none" strokeLinejoin="round">
            <path d="M100 162 L134 162 L133 198 L101 198 Z" />
            <path d="M166 162 L200 162 L199 198 L167 198 Z" />
          </g>
          <path d="M100 162 L134 162 L131 174 L103 174 Z M166 162 L200 162 L197 174 L169 174 Z" fill={shade} opacity="0.55" />
          {/* waistband + cuffs */}
          <rect x="82" y={s.hemY - 14} width="136" height="16" rx="3" fill={shade} />
          <rect x="42" y="330" width="42" height="12" rx="3" fill={shade} opacity="0.9" />
          <rect x="216" y="330" width="42" height="12" rx="3" fill={shade} opacity="0.9" />
        </g>
      );
    case "bomber":
      return (
        <g>
          {/* rib collar */}
          <path
            d={isBack ? "M112 96 C130 104 170 104 188 96 C170 88 130 88 112 96 Z" : "M112 96 C124 112 176 112 188 96 C170 86 130 86 112 96 Z"}
            fill={shade}
          />
          {!isBack && (
            <g>
              <path d={`M150 108 L150 ${s.hemY}`} stroke={shade} strokeWidth="3.5" />
              <path d={`M150 114 L150 ${s.hemY}`} stroke="#fff" strokeWidth="1" opacity="0.35" strokeDasharray="2 3" />
              <path d="M98 250 L120 280 M202 250 L180 280" stroke={shade} strokeWidth="3" strokeLinecap="round" />
            </g>
          )}
          <rect x="82" y={s.hemY - 10} width="136" height="16" rx="5" fill={shade} />
          <rect x="42" y="322" width="42" height="14" rx="5" fill={shade} opacity="0.9" />
          <rect x="216" y="322" width="42" height="14" rx="5" fill={shade} opacity="0.9" />
          <RibTicks y={s.hemY - 1.5} h={13} />
        </g>
      );
    case "dress":
      return (
        <g>
          {/* elasticated neckline */}
          <path d="M124 112 C140 104 160 104 176 112" fill="none" stroke={shade} strokeWidth="3" />
          <path d="M124 116 C140 110 160 110 176 116" fill="none" stroke={shade} strokeWidth="1" opacity="0.6" />
          {/* waist seam + drape */}
          <path d="M94 196 C120 190 180 190 206 196" fill="none" stroke={shade} strokeWidth="1.2" opacity="0.7" />
          <g stroke="#000" opacity="0.07" fill="none" strokeWidth="5">
            <path d="M118 200 C112 270 104 340 100 398" />
            <path d="M150 198 C150 270 150 340 150 398" />
            <path d="M182 200 C188 270 196 340 200 398" />
          </g>
        </g>
      );
  }
}

/* ———————————————————————————— garment ———————————————————————————— */

export default function GarmentRender({
  kind,
  view = "front",
  body,
  shade,
  detail,
  ink = "#111111",
  print,
  image,
  tag,
  tagTone = "carbon",
  hanger = true,
  sideShade = false,
  title,
  className,
  style,
}: GarmentRenderProps) {
  const uid = "g" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const s = SHAPES[kind];
  const isBack = view === "back";
  const clipId = `${uid}-clip`;
  // dark ink sinks into light cloth; light ink sits on top of dark cloth
  const blend = luminance(ink) < luminance(body) ? "multiply" : "normal";

  return (
    <svg
      viewBox="0 0 300 440"
      className={className}
      style={style}
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
      focusable="false"
      overflow="visible"
    >
      {title && <title>{title}</title>}
      <defs>
        <clipPath id={clipId}>
          <path d={s.outline} />
        </clipPath>
      </defs>

      {/* contact shadow on the studio floor */}
      <ellipse cx="150" cy={s.hemY + 10} rx="80" ry="6" fill="#000" opacity="0.06" />

      {image ? (
        /* photographic mode — a cutout masked into the silhouette */
        <g clipPath={`url(#${clipId})`}>
          <image href={image} x="0" y="40" width="300" height="400" preserveAspectRatio="xMidYMid slice" />
          <rect x="0" y="0" width="300" height="440" fill="url(#gr-light)" />
          {sideShade && <rect className="garment-side-shade" x="0" y="0" width="300" height="440" fill="url(#gr-side)" />}
        </g>
      ) : (
        <g>
          {/* hood, behind the body */}
          {(kind === "hoodie" || kind === "cropped-hoodie") && (
            <path
              d={isBack ? "M100 96 C104 56 196 56 200 96 C196 118 104 118 100 96 Z" : "M104 92 C108 62 192 62 196 92 C190 112 110 112 104 92 Z"}
              fill={isBack ? body : shade}
            />
          )}
          {s.sleeves?.map((d, i) => <path key={i} d={d} fill={shade} />)}
          <path d={s.body} fill={body} />

          {/* fabric grain, light and folds over everything */}
          <g clipPath={`url(#${clipId})`}>
            <rect x="0" y="0" width="300" height="440" filter="url(#gr-grain)" opacity="0.35" />
            <rect x="0" y="0" width="300" height="440" fill="url(#gr-light)" />
            <rect x="0" y="0" width="300" height="440" fill={view === "side" ? "url(#gr-side)" : "url(#gr-fold)"} />
            {sideShade && <rect className="garment-side-shade" x="0" y="0" width="300" height="440" fill="url(#gr-side)" />}
            <g filter="url(#gr-soft)" opacity="0.5">
              <path d="M112 130 C106 220 106 290 110 360" stroke="#000" strokeWidth="6" opacity="0.08" fill="none" />
              <path d="M188 140 C194 220 194 290 190 360" stroke="#000" strokeWidth="5" opacity="0.06" fill="none" />
              <path d="M150 120 C148 220 148 300 150 380" stroke="#fff" strokeWidth="8" opacity="0.12" fill="none" />
            </g>
          </g>

          <Details kind={kind} s={s} isBack={isBack} body={body} shade={shade} detail={detail ?? shade} />

          {/* side seams */}
          {kind !== "dress" && (
            <g fill="none" stroke="#000" strokeWidth="0.7" opacity="0.14">
              <path d={`M86 120 C84 200 84 280 86 ${s.hemY}`} />
              <path d={`M214 120 C216 200 216 280 214 ${s.hemY}`} />
            </g>
          )}

          {/* print */}
          {print && view !== "side" && (
            <g clipPath={`url(#${clipId})`} style={{ mixBlendMode: blend }}>
              <Print s={s} side={isBack ? "back" : "front"} p={print} ink={ink} uid={uid} />
            </g>
          )}
          {/* back-neck woven label */}
          {isBack && <rect x="143" y="104" width="14" height="8" rx="1" fill="#f6f5f0" stroke={shade} strokeWidth="0.6" />}
        </g>
      )}

      {hanger && <Hanger />}
      {tag && view !== "side" && <NeckTag text={tag} tone={tagTone} />}
    </svg>
  );
}
