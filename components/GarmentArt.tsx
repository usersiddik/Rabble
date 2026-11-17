/**
 * Illustrated garments for the hanging rail.
 * Each garment is drawn in a 200×300 viewBox, hanging from a wooden hanger
 * whose hook sits at (100, 10) — the rail component pivots items around that point.
 */

export type GarmentKind =
  | "hoodie"
  | "cropped-hoodie"
  | "tee"
  | "graphic-tee"
  | "crew"
  | "trucker"
  | "bomber";

export interface GarmentColors {
  body: string;
  shade: string;
  detail?: string;
}

function Hanger() {
  return (
    <g>
      {/* hook */}
      <path
        d="M100 34 L100 24 C100 14 92 10 86 14"
        fill="none"
        stroke="#8f8e88"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* wooden bar */}
      <path
        d="M100 32 L170 66 C174 68 172 74 168 73 L100 42 L32 73 C28 74 26 68 30 66 Z"
        fill="#a06c42"
      />
      <path d="M100 32 L170 66 C174 68 172 74 168 73 L100 42 Z" fill="#8d5c36" />
    </g>
  );
}

function Hoodie({ c, cropped = false }: { c: GarmentColors; cropped?: boolean }) {
  const hem = cropped ? 216 : 268;
  const sleeveHem = cropped ? 210 : 252;
  return (
    <g>
      {/* hood behind */}
      <path
        d="M70 72 C68 50 132 50 130 72 C126 88 74 88 70 72 Z"
        fill={c.shade}
      />
      {/* sleeves */}
      <path
        d={`M44 84 C30 92 24 150 26 ${sleeveHem} L52 ${sleeveHem} C50 170 50 120 56 90 Z`}
        fill={c.shade}
      />
      <path
        d={`M156 84 C170 92 176 150 174 ${sleeveHem} L148 ${sleeveHem} C150 170 150 120 144 90 Z`}
        fill={c.shade}
      />
      {/* body */}
      <path
        d={`M52 86 C48 140 46 200 50 ${hem} L150 ${hem} C154 200 152 140 148 86 C120 76 80 76 52 86 Z`}
        fill={c.body}
      />
      {/* hood opening */}
      <path
        d="M76 78 C78 64 122 64 124 78 C118 90 82 90 76 78 Z"
        fill={c.body}
      />
      <path
        d="M80 78 C84 70 116 70 120 78 C114 86 86 86 80 78 Z"
        fill={c.shade}
        opacity="0.55"
      />
      {/* drawstrings */}
      <path d="M94 86 L92 112 M106 86 L108 112" stroke={c.shade} strokeWidth="2.5" strokeLinecap="round" />
      {/* kangaroo pocket */}
      <path
        d={`M72 ${hem - 54} L128 ${hem - 54} L122 ${hem - 16} L78 ${hem - 16} Z`}
        fill="none"
        stroke={c.shade}
        strokeWidth="2.5"
        strokeLinejoin="round"
        opacity="0.7"
      />
      {/* hem rib */}
      <rect x="50" y={hem - 2} width="100" height="8" rx="3" fill={c.shade} />
      {/* soft fold shadow */}
      <path d={`M60 95 C58 150 57 210 59 ${hem}`} stroke="#000" strokeWidth="5" opacity="0.05" fill="none" />
    </g>
  );
}

function Tee({ c, print = false }: { c: GarmentColors; print?: boolean }) {
  return (
    <g>
      {/* sleeves */}
      <path d="M48 82 C30 92 24 118 30 138 L58 128 C54 112 54 96 58 86 Z" fill={c.shade} />
      <path d="M152 82 C170 92 176 118 170 138 L142 128 C146 112 146 96 142 86 Z" fill={c.shade} />
      {/* body */}
      <path
        d="M56 84 C52 140 50 190 54 240 L146 240 C150 190 148 140 144 84 C116 74 84 74 56 84 Z"
        fill={c.body}
      />
      {/* collar */}
      <path
        d="M82 78 C88 88 112 88 118 78 C112 72 88 72 82 78 Z"
        fill={c.shade}
      />
      {print && c.detail && (
        <g>
          <rect x="72" y="118" width="56" height="64" rx="3" fill="none" stroke={c.detail} strokeWidth="4" />
          <text
            x="100"
            y="144"
            textAnchor="middle"
            fontSize="17"
            fontWeight="800"
            fill={c.detail}
            style={{ letterSpacing: "0.08em" }}
          >
            RBL
          </text>
          <text
            x="100"
            y="168"
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill={c.detail}
            style={{ letterSpacing: "0.22em" }}
          >
            AW26
          </text>
        </g>
      )}
      <path d="M64 92 C61 150 60 200 62 238" stroke="#000" strokeWidth="5" opacity="0.05" fill="none" />
    </g>
  );
}

function Crew({ c }: { c: GarmentColors }) {
  return (
    <g>
      {/* sleeves */}
      <path d="M46 84 C30 94 24 150 26 248 L52 248 C50 170 50 120 56 90 Z" fill={c.shade} />
      <path d="M154 84 C170 94 176 150 174 248 L148 248 C150 170 150 120 144 90 Z" fill={c.shade} />
      <rect x="25" y="244" width="28" height="9" rx="3.5" fill={c.shade} opacity="0.75" />
      <rect x="147" y="244" width="28" height="9" rx="3.5" fill={c.shade} opacity="0.75" />
      {/* body */}
      <path
        d="M54 86 C50 140 48 200 52 258 L148 258 C152 200 150 140 146 86 C118 76 82 76 54 86 Z"
        fill={c.body}
      />
      {/* collar rib */}
      <path d="M80 80 C86 90 114 90 120 80 C112 73 88 73 80 80 Z" fill={c.shade} />
      {/* hem rib */}
      <rect x="52" y="254" width="96" height="9" rx="3.5" fill={c.shade} />
      <path d="M62 94 C59 150 58 210 60 256" stroke="#000" strokeWidth="5" opacity="0.05" fill="none" />
    </g>
  );
}

function Trucker({ c }: { c: GarmentColors }) {
  return (
    <g>
      {/* sleeves */}
      <path d="M44 86 C28 96 24 150 26 240 L52 240 C50 168 50 120 56 92 Z" fill={c.shade} />
      <path d="M156 86 C172 96 176 150 174 240 L148 240 C150 168 150 120 144 92 Z" fill={c.shade} />
      {/* body */}
      <path
        d="M52 88 C48 140 46 196 50 246 L150 246 C154 196 152 140 148 88 C120 78 80 78 52 88 Z"
        fill={c.body}
      />
      {/* corduroy collar */}
      <path d="M74 82 L100 96 L126 82 C118 72 82 72 74 82 Z" fill={c.detail ?? "#b78e5a"} />
      {/* placket */}
      <path d="M100 96 L100 246" stroke={c.shade} strokeWidth="3" />
      <path d="M93 96 L93 246 M107 96 L107 246" stroke={c.shade} strokeWidth="1.5" opacity="0.6" />
      {/* buttons */}
      {[112, 142, 172, 202, 232].map((y) => (
        <circle key={y} cx="100" cy={y} r="2.6" fill={c.detail ?? "#b78e5a"} />
      ))}
      {/* chest pockets with flaps */}
      <g stroke={c.shade} strokeWidth="2.5" fill="none" strokeLinejoin="round">
        <path d="M62 128 L86 128 L85 152 L63 152 Z" />
        <path d="M62 128 L86 128 L84 136 L64 136 Z" fill={c.shade} opacity="0.5" />
        <path d="M114 128 L138 128 L137 152 L115 152 Z" />
        <path d="M114 128 L138 128 L136 136 L116 136 Z" fill={c.shade} opacity="0.5" />
      </g>
      {/* waistband */}
      <rect x="50" y="242" width="100" height="9" rx="3.5" fill={c.shade} />
      {/* seam shading */}
      <path d="M60 96 C57 150 56 200 58 244" stroke="#000" strokeWidth="5" opacity="0.06" fill="none" />
    </g>
  );
}

function Bomber({ c }: { c: GarmentColors }) {
  return (
    <g>
      {/* sleeves — fuller */}
      <path d="M42 88 C24 100 20 160 24 238 L54 238 C50 170 50 124 58 94 Z" fill={c.shade} />
      <path d="M158 88 C176 100 180 160 176 238 L146 238 C150 170 150 124 142 94 Z" fill={c.shade} />
      <rect x="23" y="233" width="32" height="10" rx="4" fill={c.shade} opacity="0.8" />
      <rect x="145" y="233" width="32" height="10" rx="4" fill={c.shade} opacity="0.8" />
      {/* body — rounded, cropped */}
      <path
        d="M54 90 C46 140 46 200 52 240 L148 240 C154 200 154 140 146 90 C118 78 82 78 54 90 Z"
        fill={c.body}
      />
      {/* ribbed collar */}
      <path d="M78 82 C84 92 116 92 122 82 C114 74 86 74 78 82 Z" fill={c.shade} />
      {/* zip */}
      <path d="M100 92 L100 240" stroke={c.shade} strokeWidth="3.5" />
      <path d="M100 100 L100 240" stroke="#fff" strokeWidth="1" opacity="0.35" strokeDasharray="2 3" />
      {/* slant pockets */}
      <path d="M64 188 L84 206 M136 188 L116 206" stroke={c.shade} strokeWidth="3" strokeLinecap="round" />
      {/* hem rib */}
      <rect x="52" y="236" width="96" height="10" rx="4" fill={c.shade} />
      <path d="M62 100 C58 150 58 200 60 236" stroke="#000" strokeWidth="5" opacity="0.06" fill="none" />
    </g>
  );
}

const GARMENTS: Record<GarmentKind, (c: GarmentColors) => React.ReactNode> = {
  hoodie: (c) => <Hoodie c={c} />,
  "cropped-hoodie": (c) => <Hoodie c={c} cropped />,
  tee: (c) => <Tee c={c} />,
  "graphic-tee": (c) => <Tee c={c} print />,
  crew: (c) => <Crew c={c} />,
  trucker: (c) => <Trucker c={c} />,
  bomber: (c) => <Bomber c={c} />,
};

interface GarmentArtProps {
  kind: GarmentKind;
  colors: GarmentColors;
  tag?: string;
  tagTone?: "ink" | "accent";
  className?: string;
}

export default function GarmentArt({ kind, colors, tag, tagTone = "ink", className }: GarmentArtProps) {
  return (
    <svg viewBox="0 0 200 300" className={className} aria-hidden="true" focusable="false">
      {/* soft drop shadow under garment */}
      <ellipse cx="100" cy="292" rx="58" ry="5" fill="#000" opacity="0.05" />
      {GARMENTS[kind](colors)}
      <Hanger />
      {tag && (
        <g transform="rotate(14 100 40)">
          <line x1="100" y1="38" x2="128" y2="66" stroke="#8f8e88" strokeWidth="1.5" />
          <g transform="rotate(8 128 66)">
            <rect
              x="118"
              y="64"
              width={tag.length * 7 + 18}
              height="22"
              rx="3"
              fill={tagTone === "accent" ? "#6e2a35" : "#1b1a16"}
            />
            <circle cx="126" cy="75" r="2.2" fill="#f2efe8" opacity="0.9" />
            <text
              x="133"
              y="79"
              fontSize="10.5"
              fontWeight="700"
              fill="#f2efe8"
              style={{ letterSpacing: "0.1em" }}
            >
              {tag}
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}
