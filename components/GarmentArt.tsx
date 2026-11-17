/**
 * Illustrated garments — the placeholder system until cutout photography lands.
 *
 * Every garment is drawn in a 200×300 viewBox hanging from a wooden hanger whose hook
 * sits at (100, 10); the rail pivots items around that point. Each kind has a front and a
 * back, and prints are placed in centimetres from the collar seam, scaled to the body.
 */

import { useId } from "react";
import { noiseBars } from "@/lib/noise";
import type { Placement, Side } from "@/content/garments";

export type GarmentKind = "hoodie" | "cropped-hoodie" | "tee" | "crew" | "trucker" | "bomber";

export interface GarmentColors {
  body: string;
  shade: string;
  detail?: string;
}

/** ≈ units per cm: a size-M body is ~96 units across the chest for ~52 cm */
const UNIT = 96 / 52;

function Hanger() {
  return (
    <g>
      <path d="M100 34 L100 24 C100 14 92 10 86 14" fill="none" stroke="#8e8e93" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M100 32 L170 66 C174 68 172 74 168 73 L100 42 L32 73 C28 74 26 68 30 66 Z" fill="#a06c42" />
      <path d="M100 32 L170 66 C174 68 172 74 168 73 L100 42 Z" fill="#8d5c36" />
    </g>
  );
}

/* ——— silhouettes ——— */

interface Spec {
  bodyId: string;
  c: GarmentColors;
  side: Side;
}

function Hoodie({ c, side, bodyId, cropped = false }: Spec & { cropped?: boolean }) {
  const hem = cropped ? 216 : 268;
  const sleeveHem = cropped ? 210 : 252;
  return (
    <g>
      {side === "front" && <path d="M70 72 C68 50 132 50 130 72 C126 88 74 88 70 72 Z" fill={c.shade} />}
      <path d={`M44 84 C30 92 24 150 26 ${sleeveHem} L52 ${sleeveHem} C50 170 50 120 56 90 Z`} fill={c.shade} />
      <path d={`M156 84 C170 92 176 150 174 ${sleeveHem} L148 ${sleeveHem} C150 170 150 120 144 90 Z`} fill={c.shade} />
      <path
        id={bodyId}
        d={`M52 86 C48 140 46 200 50 ${hem} L150 ${hem} C154 200 152 140 148 86 C120 76 80 76 52 86 Z`}
        fill={c.body}
      />
      {side === "front" ? (
        <>
          <path d="M76 78 C78 64 122 64 124 78 C118 90 82 90 76 78 Z" fill={c.body} />
          <path d="M80 78 C84 70 116 70 120 78 C114 86 86 86 80 78 Z" fill={c.shade} opacity="0.55" />
          <path d="M94 86 L92 112 M106 86 L108 112" stroke={c.shade} strokeWidth="2.5" strokeLinecap="round" />
          <path
            d={`M72 ${hem - 54} L128 ${hem - 54} L122 ${hem - 16} L78 ${hem - 16} Z`}
            fill="none"
            stroke={c.shade}
            strokeWidth="2.5"
            strokeLinejoin="round"
            opacity="0.7"
          />
        </>
      ) : (
        /* hood seen from behind: a rounded panel folded over the yoke */
        <>
          <path d="M66 86 C62 54 138 54 134 86 C128 100 72 100 66 86 Z" fill={c.shade} />
          <path d="M72 86 C70 62 130 62 128 86 C122 96 78 96 72 86 Z" fill={c.body} />
          <path d="M100 64 L100 92" stroke={c.shade} strokeWidth="2" opacity="0.6" />
        </>
      )}
      <rect x="50" y={hem - 2} width="100" height="8" rx="3" fill={c.shade} />
      <path d={`M60 95 C58 150 57 210 59 ${hem}`} stroke="#000" strokeWidth="5" opacity="0.05" fill="none" />
    </g>
  );
}

function Tee({ c, side, bodyId }: Spec) {
  return (
    <g>
      <path d="M48 82 C30 92 24 118 30 138 L58 128 C54 112 54 96 58 86 Z" fill={c.shade} />
      <path d="M152 82 C170 92 176 118 170 138 L142 128 C146 112 146 96 142 86 Z" fill={c.shade} />
      <path id={bodyId} d="M56 84 C52 140 50 190 54 240 L146 240 C150 190 148 140 144 84 C116 74 84 74 56 84 Z" fill={c.body} />
      {side === "front" ? (
        <path d="M82 78 C88 88 112 88 118 78 C112 72 88 72 82 78 Z" fill={c.shade} />
      ) : (
        <path d="M82 77 C88 82 112 82 118 77 C112 73 88 73 82 77 Z" fill={c.shade} />
      )}
      <path d="M64 92 C61 150 60 200 62 238" stroke="#000" strokeWidth="5" opacity="0.05" fill="none" />
    </g>
  );
}

function Crew({ c, side, bodyId }: Spec) {
  return (
    <g>
      <path d="M46 84 C30 94 24 150 26 248 L52 248 C50 170 50 120 56 90 Z" fill={c.shade} />
      <path d="M154 84 C170 94 176 150 174 248 L148 248 C150 170 150 120 144 90 Z" fill={c.shade} />
      <rect x="25" y="244" width="28" height="9" rx="3.5" fill={c.shade} opacity="0.75" />
      <rect x="147" y="244" width="28" height="9" rx="3.5" fill={c.shade} opacity="0.75" />
      <path id={bodyId} d="M54 86 C50 140 48 200 52 258 L148 258 C152 200 150 140 146 86 C118 76 82 76 54 86 Z" fill={c.body} />
      {side === "front" ? (
        <path d="M80 80 C86 90 114 90 120 80 C112 73 88 73 80 80 Z" fill={c.shade} />
      ) : (
        <path d="M80 79 C86 84 114 84 120 79 C112 74 88 74 80 79 Z" fill={c.shade} />
      )}
      <rect x="52" y="254" width="96" height="9" rx="3.5" fill={c.shade} />
      <path d="M62 94 C59 150 58 210 60 256" stroke="#000" strokeWidth="5" opacity="0.05" fill="none" />
    </g>
  );
}

function Trucker({ c, side, bodyId }: Spec) {
  const collar = c.detail ?? "#b78e5a";
  return (
    <g>
      <path d="M44 86 C28 96 24 150 26 240 L52 240 C50 168 50 120 56 92 Z" fill={c.shade} />
      <path d="M156 86 C172 96 176 150 174 240 L148 240 C150 168 150 120 144 92 Z" fill={c.shade} />
      <path id={bodyId} d="M52 88 C48 140 46 196 50 246 L150 246 C154 196 152 140 148 88 C120 78 80 78 52 88 Z" fill={c.body} />
      {side === "front" ? (
        <>
          <path d="M74 82 L100 96 L126 82 C118 72 82 72 74 82 Z" fill={collar} />
          <path d="M100 96 L100 246" stroke={c.shade} strokeWidth="3" />
          <path d="M93 96 L93 246 M107 96 L107 246" stroke={c.shade} strokeWidth="1.5" opacity="0.6" />
          {[112, 142, 172, 202, 232].map((y) => (
            <circle key={y} cx="100" cy={y} r="2.6" fill={collar} />
          ))}
          <g stroke={c.shade} strokeWidth="2.5" fill="none" strokeLinejoin="round">
            <path d="M62 128 L86 128 L85 152 L63 152 Z" />
            <path d="M62 128 L86 128 L84 136 L64 136 Z" fill={c.shade} opacity="0.5" />
            <path d="M114 128 L138 128 L137 152 L115 152 Z" />
            <path d="M114 128 L138 128 L136 136 L116 136 Z" fill={c.shade} opacity="0.5" />
          </g>
        </>
      ) : (
        <>
          {/* collar band from behind + yoke seam */}
          <path d="M74 82 C82 74 118 74 126 82 C118 86 82 86 74 82 Z" fill={collar} />
          <path d="M56 112 C80 106 120 106 144 112" stroke={c.shade} strokeWidth="2" fill="none" opacity="0.8" />
          <path d="M70 112 L66 244 M130 112 L134 244" stroke={c.shade} strokeWidth="1.5" opacity="0.5" />
        </>
      )}
      <rect x="50" y="242" width="100" height="9" rx="3.5" fill={c.shade} />
      <path d="M60 96 C57 150 56 200 58 244" stroke="#000" strokeWidth="5" opacity="0.06" fill="none" />
    </g>
  );
}

function Bomber({ c, side, bodyId }: Spec) {
  return (
    <g>
      <path d="M42 88 C24 100 20 160 24 238 L54 238 C50 170 50 124 58 94 Z" fill={c.shade} />
      <path d="M158 88 C176 100 180 160 176 238 L146 238 C150 170 150 124 142 94 Z" fill={c.shade} />
      <rect x="23" y="233" width="32" height="10" rx="4" fill={c.shade} opacity="0.8" />
      <rect x="145" y="233" width="32" height="10" rx="4" fill={c.shade} opacity="0.8" />
      <path id={bodyId} d="M54 90 C46 140 46 200 52 240 L148 240 C154 200 154 140 146 90 C118 78 82 78 54 90 Z" fill={c.body} />
      <path d="M78 82 C84 92 116 92 122 82 C114 74 86 74 78 82 Z" fill={c.shade} />
      {side === "front" && (
        <>
          <path d="M100 92 L100 240" stroke={c.shade} strokeWidth="3.5" />
          <path d="M100 100 L100 240" stroke="#fff" strokeWidth="1" opacity="0.35" strokeDasharray="2 3" />
          <path d="M64 188 L84 206 M136 188 L116 206" stroke={c.shade} strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      <rect x="52" y="236" width="96" height="10" rx="4" fill={c.shade} />
      <path d="M62 100 C58 150 58 200 60 236" stroke="#000" strokeWidth="5" opacity="0.06" fill="none" />
    </g>
  );
}

const GARMENTS: Record<GarmentKind, (s: Spec) => React.ReactNode> = {
  hoodie: (s) => <Hoodie {...s} />,
  "cropped-hoodie": (s) => <Hoodie {...s} cropped />,
  tee: (s) => <Tee {...s} />,
  crew: (s) => <Crew {...s} />,
  trucker: (s) => <Trucker {...s} />,
  bomber: (s) => <Bomber {...s} />,
};

/** y of the collar seam per kind and side — prints are measured from here */
const COLLAR: Record<GarmentKind, { front: number; back: number }> = {
  hoodie: { front: 90, back: 96 },
  "cropped-hoodie": { front: 90, back: 96 },
  tee: { front: 86, back: 80 },
  crew: { front: 88, back: 82 },
  trucker: { front: 96, back: 86 },
  bomber: { front: 92, back: 86 },
};

/* ——— prints ——— */

const DISPLAY_FONT = {
  fontFamily: "var(--font-display), Archivo, ui-sans-serif, system-ui, sans-serif",
  fontWeight: 800,
  letterSpacing: "-0.01em",
} as const;

function PrintMarkArt({ p, ink, x, y, w, h, uid }: { p: Placement; ink: string; x: number; y: number; w: number; h: number; uid: string }) {
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
    const n = mark.lines.length;
    const lineH = h / n;
    return (
      <g>
        {mark.lines.map((line, i) => {
          const longest = Math.max(...mark.lines.map((l) => l.length));
          const lw = w * Math.max(0.35, line.length / longest);
          return (
            <text
              key={i}
              x={p.position === "chest-left" ? x : x + w / 2}
              y={y + lineH * i + lineH / 2}
              textAnchor={p.position === "chest-left" ? "start" : "middle"}
              dominantBaseline="central"
              fontSize={lineH * 0.82}
              textLength={lw}
              lengthAdjust="spacingAndGlyphs"
              fill={ink}
              opacity={mark.lines.length > 2 ? 1 - i * 0.28 : 1}
              style={DISPLAY_FONT}
            >
              {line}
            </text>
          );
        })}
      </g>
    );
  }
  if (mark.type === "bars") {
    const count = Math.max(8, Math.round(w / 2.2));
    const bars = noiseBars(mark.seed, count);
    const gap = w / count;
    const bw = gap * 0.62;
    return (
      <g fill={ink}>
        {bars.map((v, i) => {
          const bh = Math.max(1, v * h);
          return <rect key={i} x={x + i * gap} y={y + (h - bh)} width={bw} height={bh} rx={bw / 4} />;
        })}
      </g>
    );
  }
  // stamp
  const r = Math.min(w, h) / 2;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const id = `${uid}-stamp`;
  const bars = noiseBars(5, 9);
  return (
    <g>
      <defs>
        <path id={id} d={`M ${cx} ${cy} m -${r * 0.78} 0 a ${r * 0.78} ${r * 0.78} 0 1 1 ${r * 1.56} 0 a ${r * 0.78} ${r * 0.78} 0 1 1 -${r * 1.56} 0`} />
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={ink} strokeWidth={r * 0.07} />
      <circle cx={cx} cy={cy} r={r * 0.6} fill="none" stroke={ink} strokeWidth={r * 0.04} />
      <text fontSize={r * 0.3} fill={ink} style={{ ...DISPLAY_FONT, letterSpacing: "0.18em" }}>
        <textPath href={`#${id}`} startOffset="0" textLength={2 * Math.PI * r * 0.78 * 0.98} lengthAdjust="spacingAndGlyphs">
          {mark.text + " · "}
        </textPath>
      </text>
      <g fill={ink}>
        {bars.map((v, i) => {
          const bw = (r * 0.8) / 9;
          const bh = Math.max(r * 0.08, v * r * 0.55);
          return <rect key={i} x={cx - r * 0.4 + i * bw} y={cy + r * 0.26 - bh} width={bw * 0.6} height={bh} rx={bw * 0.15} />;
        })}
      </g>
    </g>
  );
}

function Print({ kind, side, placement, ink, uid }: { kind: GarmentKind; side: Side; placement: Placement; ink: string; uid: string }) {
  const collar = COLLAR[kind][side];
  const w = placement.widthCm * UNIT;
  const h = placement.heightCm * UNIT;
  const y = collar + placement.fromCollarCm * UNIT;
  // the wearer's left chest sits on the viewer's right
  const cx = placement.position === "chest-left" ? 124 : 100;
  const x = cx - w / 2;
  return (
    <g clipPath={`url(#${uid}-clip)`}>
      <PrintMarkArt p={placement} ink={ink} x={x} y={y} w={w} h={h} uid={uid} />
    </g>
  );
}

/* ——— the component ——— */

interface GarmentArtProps {
  kind: GarmentKind;
  colors: GarmentColors;
  side?: Side;
  print?: Placement;
  ink?: string;
  tag?: string;
  tagTone?: "carbon" | "terracotta" | "cobalt";
  hanger?: boolean;
  className?: string;
  /** accessible name; omit to mark decorative */
  title?: string;
}

const TAG_FILL = { carbon: "#111111", terracotta: "#b0451f", cobalt: "#1f3fd9" };

export default function GarmentArt({
  kind,
  colors,
  side = "front",
  print,
  ink = "#111111",
  tag,
  tagTone = "carbon",
  hanger = true,
  className,
  title,
}: GarmentArtProps) {
  const uid = "g" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg
      viewBox="0 0 200 300"
      className={className}
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <ellipse cx="100" cy="292" rx="58" ry="5" fill="#000" opacity="0.05" />
      <defs>
        <clipPath id={`${uid}-clip`}>
          <use href={`#${uid}-body`} />
        </clipPath>
      </defs>
      {GARMENTS[kind]({ c: colors, side, bodyId: `${uid}-body` })}
      {print && <Print kind={kind} side={side} placement={print} ink={ink} uid={uid} />}
      {hanger && <Hanger />}
      {tag && (
        <g transform="rotate(14 100 40)">
          <line x1="100" y1="38" x2="128" y2="66" stroke="#8e8e93" strokeWidth="1.5" />
          <g transform="rotate(8 128 66)">
            <rect x="118" y="64" width={tag.length * 7 + 18} height="22" rx="3" fill={TAG_FILL[tagTone]} />
            <circle cx="126" cy="75" r="2.2" fill="#f6f5f0" opacity="0.9" />
            <text x="133" y="79" fontSize="10.5" fontWeight="700" fill="#f6f5f0" style={{ letterSpacing: "0.1em" }}>
              {tag}
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}
