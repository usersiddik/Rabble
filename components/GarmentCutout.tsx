"use client";

import { useId } from "react";

/**
 * GarmentCutout — a studio-style garment render that hangs from a hook.
 *
 * Renders in a 300×440 viewBox. The hanger hook sits at (150, 14); the rack
 * pivots every item around that point for the pendulum sway.
 *
 * Three visual states:
 *   view="front"  chest graphic / boutique front silhouette
 *   view="back"   full back print
 *   view="side"   the compressed hanging-sideways fold (used for inactive rail items)
 *
 * Two render modes:
 *   - procedural: a vector silhouette with fabric grain, fold shading, rib
 *     trims and seam stitching (default — no assets needed)
 *   - photographic: pass `image` (a transparent PNG / WebP cutout) and the
 *     photo is masked into the silhouette instead of the flat fabric fill.
 */

export type GarmentKind =
  "tee" | "hoodie" | "cropped-hoodie" | "crew" | "dress";
export type GarmentView = "front" | "back" | "side";
export type PrintId =
  | "mark-chest"
  | "reprint-chest"
  | "reprint-back"
  | "wave-back"
  | "crowd-back"
  | "arc-back";

export interface GarmentCutoutProps {
  kind: GarmentKind;
  view?: GarmentView;
  body: string;
  shade: string;
  ink?: string;
  print?: PrintId;
  /** optional transparent cutout photo for this view */
  image?: string;
  tag?: string;
  tagTone?: "ink" | "accent" | "cobalt";
  /** draw the hanger (off for the compact side preview on tiny screens) */
  hanger?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/* ———————————————————————————— silhouettes ———————————————————————————— */

interface Silhouette {
  /** full outer outline (used as clip + base fill) */
  outline: string;
  /** sleeves drawn in the darker tone, behind/over the body */
  sleeves?: string[];
  /** the body only (receives the print + fold shading) */
  body: string;
  /** bottom of the body, for hem ribs */
  hemY: number;
  /** vertical span of the printable area */
  printBox: { x: number; y: number; w: number; h: number };
}

const TEE: Silhouette = {
  outline:
    "M118 96 C132 90 168 90 182 96 L236 110 C250 118 262 150 262 178 L222 192 C220 240 220 290 222 334 L78 334 C80 290 80 240 78 192 L38 178 C38 150 50 118 64 110 Z",
  sleeves: [
    "M64 110 C50 118 38 150 38 178 L84 194 L96 172 C90 150 90 128 100 108 Z",
    "M236 110 C250 118 262 150 262 178 L216 194 L204 172 C210 150 210 128 200 108 Z",
  ],
  body: "M92 108 C84 170 80 250 78 334 L222 334 C220 250 216 170 208 108 C176 96 124 96 92 108 Z",
  hemY: 334,
  printBox: { x: 100, y: 150, w: 100, h: 140 },
};

const HOODIE: Silhouette = {
  outline:
    "M112 96 C130 88 170 88 188 96 L236 108 C254 116 264 200 258 356 L220 356 L220 366 L80 366 L80 356 L42 356 C36 200 46 116 64 108 Z",
  sleeves: [
    "M64 108 C46 116 36 200 42 356 L84 356 C84 260 86 180 100 110 Z",
    "M236 108 C254 116 264 200 258 356 L216 356 C216 260 214 180 200 110 Z",
  ],
  body: "M94 108 C86 170 82 260 82 366 L218 366 C218 260 214 170 206 108 C176 96 124 96 94 108 Z",
  hemY: 366,
  printBox: { x: 100, y: 170, w: 100, h: 150 },
};

const CROPPED: Silhouette = {
  outline:
    "M112 96 C130 88 170 88 188 96 L236 108 C254 116 264 200 258 292 L220 292 L220 302 L80 302 L80 292 L42 292 C36 200 46 116 64 108 Z",
  sleeves: [
    "M64 108 C46 116 36 200 42 292 L84 292 C84 260 86 180 100 110 Z",
    "M236 108 C254 116 264 200 258 292 L216 292 C216 260 214 180 200 110 Z",
  ],
  body: "M94 108 C86 170 82 260 82 302 L218 302 C218 260 214 170 206 108 C176 96 124 96 94 108 Z",
  hemY: 302,
  printBox: { x: 100, y: 160, w: 100, h: 110 },
};

const CREW: Silhouette = {
  outline:
    "M112 96 C130 88 170 88 188 96 L236 108 C254 116 264 200 258 346 L220 346 L220 356 L80 356 L80 346 L42 346 C36 200 46 116 64 108 Z",
  sleeves: [
    "M64 108 C46 116 36 200 42 346 L84 346 C84 260 86 180 100 110 Z",
    "M236 108 C254 116 264 200 258 346 L216 346 C216 260 214 180 200 110 Z",
  ],
  body: "M94 108 C86 170 82 260 82 356 L218 356 C218 260 214 170 206 108 C176 96 124 96 94 108 Z",
  hemY: 356,
  printBox: { x: 100, y: 170, w: 100, h: 150 },
};

const DRESS: Silhouette = {
  outline:
    "M104 96 C110 94 118 102 124 112 C140 104 160 104 176 112 C182 102 190 94 196 96 C206 130 212 160 214 188 C224 250 236 320 242 400 L58 400 C64 320 76 250 86 188 C88 160 94 130 104 96 Z",
  body: "M104 96 C110 94 118 102 124 112 C140 104 160 104 176 112 C182 102 190 94 196 96 C206 130 212 160 214 188 C224 250 236 320 242 400 L58 400 C64 320 76 250 86 188 C88 160 94 130 104 96 Z",
  hemY: 400,
  printBox: { x: 110, y: 200, w: 80, h: 120 },
};

const SHAPES: Record<GarmentKind, Silhouette> = {
  tee: TEE,
  hoodie: HOODIE,
  "cropped-hoodie": CROPPED,
  crew: CREW,
  dress: DRESS,
};

/* ———————————————————————————— prints ———————————————————————————— */

function Print({
  id,
  ink,
  box,
  uid,
}: {
  id: PrintId;
  ink: string;
  box: Silhouette["printBox"];
  uid: string;
}) {
  const cx = box.x + box.w / 2;
  switch (id) {
    case "mark-chest":
      return (
        <g fill={ink}>
          <text
            x={box.x + 6}
            y={box.y + 14}
            fontSize="11"
            fontWeight="800"
            letterSpacing="0.1em"
          >
            RBL.
          </text>
          <rect x={box.x + 6} y={box.y + 18} width="26" height="1.5" />
        </g>
      );
    case "reprint-chest":
      return (
        <g fill={ink} stroke={ink}>
          <rect
            x={cx - 30}
            y={box.y + 8}
            width="60"
            height="34"
            fill="none"
            strokeWidth="2.5"
          />
          <text
            x={cx}
            y={box.y + 24}
            textAnchor="middle"
            fontSize="11"
            fontWeight="800"
            stroke="none"
            letterSpacing="0.14em"
          >
            REPRINT
          </text>
          <text
            x={cx}
            y={box.y + 36}
            textAnchor="middle"
            fontSize="8"
            fontWeight="600"
            stroke="none"
            letterSpacing="0.3em"
          >
            01 · AW26
          </text>
        </g>
      );
    case "reprint-back":
      return (
        <g fill={ink}>
          <rect
            x={box.x - 4}
            y={box.y - 6}
            width={box.w + 8}
            height={box.h + 12}
            fill="none"
            stroke={ink}
            strokeWidth="3"
          />
          <text
            x={cx}
            y={box.y + 40}
            textAnchor="middle"
            fontSize="40"
            fontWeight="900"
            letterSpacing="-0.02em"
          >
            NO
          </text>
          <text
            x={cx}
            y={box.y + 76}
            textAnchor="middle"
            fontSize="40"
            fontWeight="900"
            letterSpacing="-0.02em"
          >
            RE-
          </text>
          <text
            x={cx}
            y={box.y + 112}
            textAnchor="middle"
            fontSize="28"
            fontWeight="900"
            letterSpacing="0.02em"
          >
            STOCKS
          </text>
          {Array.from({ length: 22 }, (_, i) => (
            <rect
              key={i}
              x={box.x + 4 + i * 4.2}
              y={box.y + 120}
              width={i % 3 === 0 ? 2.4 : 1.2}
              height="12"
            />
          ))}
          <text
            x={cx}
            y={box.y + 148}
            textAnchor="middle"
            fontSize="7"
            fontWeight="700"
            letterSpacing="0.28em"
          >
            ONE-RUN PRINT · 01/01
          </text>
        </g>
      );
    case "wave-back": {
      const bars = [
        8, 18, 34, 54, 42, 70, 96, 60, 80, 110, 74, 50, 88, 40, 26, 46, 20, 10,
      ];
      return (
        <g fill={ink}>
          {bars.map((h, i) => (
            <rect
              key={i}
              x={box.x + 4 + i * 5.2}
              y={box.y + 70 - h / 2}
              width="3.2"
              height={h}
              rx="1.6"
            />
          ))}
          <text
            x={cx}
            y={box.y + 150}
            textAnchor="middle"
            fontSize="9"
            fontWeight="800"
            letterSpacing="0.28em"
          >
            NOISE YOU CAN WEAR
          </text>
        </g>
      );
    }
    case "crowd-back":
      return (
        <g fill="none" stroke={ink} strokeWidth="3">
          {[14, 28, 42, 56].map((r) => (
            <circle key={r} cx={cx} cy={box.y + 66} r={r} />
          ))}
          <text
            x={cx}
            y={box.y + 150}
            textAnchor="middle"
            fontSize="18"
            fontWeight="900"
            fill={ink}
            stroke="none"
            letterSpacing="0.12em"
          >
            RABBLE
          </text>
        </g>
      );
    case "arc-back":
      return (
        <g fill={ink}>
          <defs>
            <path
              id={`${uid}-arc`}
              d={`M ${cx - 46} ${box.y + 44} A 46 46 0 0 1 ${cx + 46} ${box.y + 44}`}
            />
          </defs>
          <text fontSize="13" fontWeight="800" letterSpacing="0.3em">
            <textPath
              href={`#${uid}-arc`}
              startOffset="50%"
              textAnchor="middle"
            >
              RABBLE
            </textPath>
          </text>
          <text
            x={cx}
            y={box.y + 60}
            textAnchor="middle"
            fontSize="7"
            fontWeight="600"
            letterSpacing="0.3em"
          >
            EST. AW26
          </text>
        </g>
      );
  }
}

/* ———————————————————————————— hanger + tag ———————————————————————————— */

function Hanger({ uid }: { uid: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-wood`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#b8864f" />
          <stop offset="0.45" stopColor="#9a6a3b" />
          <stop offset="1" stopColor="#6e4826" />
        </linearGradient>
        <linearGradient id={`${uid}-steel`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#6d6d71" />
          <stop offset="0.5" stopColor="#c9c9cc" />
          <stop offset="1" stopColor="#7a7a7e" />
        </linearGradient>
      </defs>
      {/* hook */}
      <path
        d="M150 52 L150 30 C150 16 140 11 133 16"
        fill="none"
        stroke={`url(#${uid}-steel)`}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* swivel collar */}
      <rect x="146" y="48" width="8" height="7" rx="1.5" fill="#8e8e93" />
      {/* wooden bar */}
      <path
        d="M150 54 L252 100 C258 103 256 112 250 110 L150 66 L50 110 C44 112 42 103 48 100 Z"
        fill={`url(#${uid}-wood)`}
      />
      {/* grain */}
      <path
        d="M72 100 L150 64 M90 97 L150 70"
        stroke="#5c3a1c"
        strokeWidth="0.6"
        opacity="0.5"
        fill="none"
      />
      <path
        d="M228 100 L150 64 M210 97 L150 70"
        stroke="#5c3a1c"
        strokeWidth="0.6"
        opacity="0.5"
        fill="none"
      />
      {/* lower cross bar */}
      <path
        d="M58 108 L242 108"
        stroke="#8e8e93"
        strokeWidth="2"
        opacity="0.9"
      />
      <path
        d="M58 108 L242 108"
        stroke="#fff"
        strokeWidth="0.6"
        opacity="0.5"
      />
    </g>
  );
}

function NeckTag({
  text,
  tone,
  uid,
}: {
  text: string;
  tone: "ink" | "accent" | "cobalt";
  uid: string;
}) {
  const fill =
    tone === "accent" ? "#6e2a35" : tone === "cobalt" ? "#2438e8" : "#111111";
  const w = text.length * 5.6 + 14;
  return (
    <g transform="rotate(-6 150 44)">
      <line
        x1="151"
        y1="38"
        x2="160"
        y2="50"
        stroke="#8e8e93"
        strokeWidth="1"
      />
      <rect
        x="156"
        y="48"
        width={w}
        height="18"
        rx="2"
        fill={fill}
        filter={`url(#${uid}-tagshadow)`}
      />
      <text
        x={156 + w / 2}
        y="60.5"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="700"
        fill="#f6f5f0"
        letterSpacing="0.12em"
      >
        {text}
      </text>
    </g>
  );
}

/* ———————————————————————————— garment ———————————————————————————— */

export default function GarmentCutout({
  kind,
  view = "front",
  body,
  shade,
  ink = "#111111",
  print,
  image,
  tag,
  tagTone = "ink",
  hanger = true,
  className,
  style,
}: GarmentCutoutProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const s = SHAPES[kind];
  const isBack = view === "back";
  const clipId = `${uid}-clip`;

  return (
    <svg
      viewBox="0 0 300 440"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
      overflow="visible"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={s.outline} />
        </clipPath>
        {/* fabric grain */}
        <filter id={`${uid}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.4"
            numOctaves="2"
            seed="7"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" intercept="-0.1" />
          </feComponentTransfer>
        </filter>
        {/* soft blur for drape streaks */}
        <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter
          id={`${uid}-tagshadow`}
          x="-20%"
          y="-40%"
          width="140%"
          height="200%"
        >
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.25" />
        </filter>
        {/* fold shading, left to right */}
        <linearGradient id={`${uid}-fold`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.22" />
          <stop offset="0.1" stopColor="#000" stopOpacity="0.02" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.52" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.72" stopColor="#000" stopOpacity="0.06" />
          <stop offset="0.9" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.24" />
        </linearGradient>
        {/* side-hang fold: heavy shading, like a garment seen edge-on */}
        <linearGradient id={`${uid}-side`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.45" />
          <stop offset="0.35" stopColor="#000" stopOpacity="0.05" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
        {/* vertical light: slightly brighter at the shoulders */}
        <linearGradient id={`${uid}-light`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* contact shadow on the studio floor */}
      <ellipse
        cx="150"
        cy={s.hemY + 10}
        rx="80"
        ry="6"
        fill="#000"
        opacity="0.06"
      />

      {image ? (
        /* photographic mode — a cutout masked into the silhouette */
        <g clipPath={`url(#${clipId})`}>
          <image
            href={image}
            x="0"
            y="40"
            width="300"
            height="400"
            preserveAspectRatio="xMidYMid slice"
          />
          <rect
            x="0"
            y="0"
            width="300"
            height="440"
            fill={`url(#${uid}-light)`}
          />
        </g>
      ) : (
        <g>
          {/* hood, behind the body */}
          {(kind === "hoodie" || kind === "cropped-hoodie") && (
            <path
              d={
                isBack
                  ? "M100 96 C104 56 196 56 200 96 C196 118 104 118 100 96 Z"
                  : "M104 92 C108 62 192 62 196 92 C190 112 110 112 104 92 Z"
              }
              fill={isBack ? body : shade}
            />
          )}
          {/* sleeves */}
          {s.sleeves?.map((d, i) => (
            <path key={i} d={d} fill={shade} />
          ))}
          {/* body */}
          <path d={s.body} fill={body} />
          {/* fabric grain over everything */}
          <g clipPath={`url(#${clipId})`}>
            <rect
              x="0"
              y="0"
              width="300"
              height="440"
              filter={`url(#${uid}-grain)`}
              opacity="0.35"
            />
            <rect
              x="0"
              y="0"
              width="300"
              height="440"
              fill={`url(#${uid}-light)`}
            />
            <rect
              x="0"
              y="0"
              width="300"
              height="440"
              fill={`url(#${view === "side" ? `${uid}-side` : `${uid}-fold`})`}
            />
            {/* soft drape streaks */}
            <g filter={`url(#${uid}-soft)`} opacity="0.5">
              <path
                d="M112 130 C106 220 106 290 110 360"
                stroke="#000"
                strokeWidth="6"
                opacity="0.08"
                fill="none"
              />
              <path
                d="M188 140 C194 220 194 290 190 360"
                stroke="#000"
                strokeWidth="5"
                opacity="0.06"
                fill="none"
              />
              <path
                d="M150 120 C148 220 148 300 150 380"
                stroke="#fff"
                strokeWidth="8"
                opacity="0.12"
                fill="none"
              />
            </g>
          </g>

          {/* collar / ribs / details per kind */}
          {kind === "tee" && (
            <g>
              <path
                d={
                  isBack
                    ? "M118 96 C132 102 168 102 182 96 C168 92 132 92 118 96 Z"
                    : "M118 96 C126 112 174 112 182 96 C168 90 132 90 118 96 Z"
                }
                fill={shade}
              />
              <path
                d={
                  isBack
                    ? "M118 96 C132 102 168 102 182 96"
                    : "M118 96 C126 112 174 112 182 96"
                }
                fill="none"
                stroke="#000"
                strokeWidth="0.8"
                opacity="0.25"
              />
              {/* sleeve hem stitching */}
              <path
                d="M48 170 L72 182 M252 170 L228 182"
                stroke={shade}
                strokeWidth="1.2"
                strokeDasharray="2 2"
                opacity="0.8"
              />
            </g>
          )}
          {(kind === "hoodie" || kind === "cropped-hoodie") && !isBack && (
            <g>
              <path
                d="M112 94 C118 80 182 80 188 94 C176 108 124 108 112 94 Z"
                fill={body}
              />
              <path
                d="M118 95 C124 84 176 84 182 95 C172 104 128 104 118 95 Z"
                fill={shade}
                opacity="0.35"
              />
              <path
                d="M140 104 L136 140 M160 104 L164 140"
                stroke={shade}
                strokeWidth="2.6"
                strokeLinecap="round"
              />
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
          {kind === "crew" && (
            <path
              d={
                isBack
                  ? "M112 96 C130 104 170 104 188 96 C170 90 130 90 112 96 Z"
                  : "M112 96 C124 112 176 112 188 96 C170 88 130 88 112 96 Z"
              }
              fill={shade}
            />
          )}
          {kind !== "tee" && kind !== "dress" && (
            <g>
              {/* hem + cuff ribs */}
              <rect
                x="82"
                y={s.hemY - 5}
                width="136"
                height="10"
                rx="4"
                fill={shade}
              />
              <rect
                x="42"
                y={s.hemY - 16}
                width="40"
                height="10"
                rx="4"
                fill={shade}
                opacity="0.9"
              />
              <rect
                x="218"
                y={s.hemY - 16}
                width="40"
                height="10"
                rx="4"
                fill={shade}
                opacity="0.9"
              />
              <g stroke="#000" strokeWidth="0.6" opacity="0.18">
                {Array.from({ length: 30 }, (_, i) => (
                  <line
                    key={i}
                    x1={88 + i * 4.3}
                    y1={s.hemY - 3}
                    x2={88 + i * 4.3}
                    y2={s.hemY + 5}
                  />
                ))}
              </g>
            </g>
          )}
          {kind === "dress" && (
            <g>
              {/* elasticated neckline */}
              <path
                d="M124 112 C140 104 160 104 176 112"
                fill="none"
                stroke={shade}
                strokeWidth="3"
              />
              <path
                d="M124 116 C140 110 160 110 176 116"
                fill="none"
                stroke={shade}
                strokeWidth="1"
                opacity="0.6"
              />
              {/* waist seam + drape */}
              <path
                d="M94 196 C120 190 180 190 206 196"
                fill="none"
                stroke={shade}
                strokeWidth="1.2"
                opacity="0.7"
              />
              <g stroke="#000" opacity="0.07" fill="none" strokeWidth="5">
                <path d="M118 200 C112 270 104 340 100 398" />
                <path d="M150 198 C150 270 150 340 150 398" />
                <path d="M182 200 C188 270 196 340 200 398" />
              </g>
              {!isBack && (
                <g stroke={shade} strokeWidth="1" opacity="0.6" fill="none">
                  <path d="M88 236 L96 260" />
                  <path d="M212 236 L204 260" />
                </g>
              )}
            </g>
          )}

          {/* side seams */}
          <path
            d={`M86 120 C84 200 84 280 86 ${s.hemY}`}
            fill="none"
            stroke="#000"
            strokeWidth="0.7"
            opacity="0.14"
          />
          <path
            d={`M214 120 C216 200 216 280 214 ${s.hemY}`}
            fill="none"
            stroke="#000"
            strokeWidth="0.7"
            opacity="0.14"
          />

          {/* print */}
          {print && view !== "side" && (
            <g
              clipPath={`url(#${clipId})`}
              style={{ mixBlendMode: "multiply" }}
            >
              <Print id={print} ink={ink} box={s.printBox} uid={uid} />
            </g>
          )}
          {/* back-neck woven label */}
          {isBack && (
            <rect
              x="143"
              y="104"
              width="14"
              height="8"
              rx="1"
              fill="#f6f5f0"
              stroke={shade}
              strokeWidth="0.6"
            />
          )}
        </g>
      )}

      {hanger && <Hanger uid={uid} />}
      {tag && view !== "side" && (
        <NeckTag text={tag} tone={tagTone} uid={uid} />
      )}
    </svg>
  );
}
