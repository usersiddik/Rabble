/**
 * Realistic hanger rig: black metal hook + sculpted wooden hanger.
 * `profile` renders the edge-on view used while a garment hangs in its
 * compressed side-profile state on the rail.
 */
export function Hanger({ profile = false }: { profile?: boolean }) {
  if (profile) {
    return (
      <svg
        viewBox="0 0 28 96"
        className="h-full w-auto"
        aria-hidden
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="woodEdge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6b4a2f" />
            <stop offset="0.45" stopColor="#a97748" />
            <stop offset="1" stopColor="#59391f" />
          </linearGradient>
        </defs>
        {/* hook seen from the side */}
        <path
          d="M14 30 L14 20 Q14 8 21 8 Q27 8 27 14"
          fill="none"
          stroke="#161616"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        {/* neck */}
        <rect x="12" y="30" width="4" height="12" rx="2" fill="#1c1c1c" />
        {/* wooden body, edge-on */}
        <path d="M9 42 Q14 38 19 42 L20 88 Q14 93 8 88 Z" fill="url(#woodEdge)" />
        <path d="M10 44 L11 86" stroke="#ffffff55" strokeWidth="1.2" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 240 96"
      className="h-full w-auto"
      aria-hidden
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b98a55" />
          <stop offset="0.4" stopColor="#8f602f" />
          <stop offset="1" stopColor="#5e3c1c" />
        </linearGradient>
        <linearGradient id="hookGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0c0c0c" />
          <stop offset="0.5" stopColor="#3a3a3a" />
          <stop offset="1" stopColor="#111111" />
        </linearGradient>
      </defs>

      {/* black metal hook */}
      <path
        d="M120 34 L120 22 Q120 8 129 8 Q138 8 138 16"
        fill="none"
        stroke="url(#hookGrad)"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      {/* metal neck collar */}
      <rect x="116" y="33" width="8" height="9" rx="2" fill="#141414" />

      {/* sculpted wooden body — gentle shoulder curve */}
      <path
        d="M120 44
           C 96 44 48 58 14 76
           Q 8 79 10 84
           Q 12 89 19 87
           C 54 77 94 68 120 68
           C 146 68 186 77 221 87
           Q 228 89 230 84
           Q 232 79 226 76
           C 192 58 144 44 120 44 Z"
        fill="url(#woodGrad)"
      />
      {/* top sheen */}
      <path
        d="M120 48 C 98 48 58 60 26 76 C 60 64 96 56 120 56 C 144 56 180 64 214 76 C 182 60 142 48 120 48 Z"
        fill="#ffffff"
        opacity="0.18"
      />
    </svg>
  );
}

/** Angled black rectangular hang-tag clipped to the hanger neck. */
export function HangTag({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <div
      className="absolute left-1/2 z-20 pointer-events-none select-none"
      style={{ top: compact ? 26 : 30, transform: "translateX(2px)" }}
    >
      <div className="tag-string w-px h-5 ml-3" />
      <div
        className="bg-neutral-950 text-studio shadow-md px-2 py-1"
        style={{ transform: "rotate(8deg)", transformOrigin: "top left" }}
      >
        <span className="block text-[8px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap">
          {label}
        </span>
      </div>
    </div>
  );
}
