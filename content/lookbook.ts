/**
 * /lookbook — editorial layouts until shoots exist.
 * Each block is mood / texture / typography led, and captions link to placeholder pieces.
 * When photography lands, add `image` to a block and the renderer prefers it.
 */

export type LookbookBlock =
  | {
      type: "garment";
      slug: string;
      side: "front" | "back";
      caption: string;
      /** aspect ratio as w/h */
      ratio: "3/4" | "4/5" | "1/1" | "16/9" | "2/3";
      backdrop: "light" | "dark" | "terracotta" | "cobalt";
      span?: 1 | 2;
      parallax?: number;
      image?: string;
    }
  | {
      type: "type";
      lines: string[];
      note?: string;
      tone: "light" | "dark" | "terracotta" | "cobalt";
      ratio: "1/1" | "16/9" | "4/5" | "2/3";
      span?: 1 | 2;
      parallax?: number;
    }
  | {
      type: "texture";
      texture: "bars" | "grain" | "halftone";
      label: string;
      tone: "light" | "dark" | "terracotta" | "cobalt";
      ratio: "1/1" | "4/5" | "2/3" | "16/9";
      span?: 1 | 2;
      parallax?: number;
    }
  | {
      type: "caption";
      kicker: string;
      body: string;
      slug?: string;
    };

export interface LookbookChapter {
  id: string;
  number: string;
  title: string;
  intro: string;
  blocks: LookbookBlock[];
}

export const lookbook: LookbookChapter[] = [
  {
    id: "signal",
    number: "I",
    title: "Signal",
    intro: "Drop 01, seen the way it will be seen — mostly from behind.",
    blocks: [
      { type: "garment", slug: "reprint-tee-01", side: "back", caption: "Reprint Tee 01 — the back", ratio: "16/9", backdrop: "light", span: 2, parallax: 0.12 },
      { type: "type", lines: ["Front", "says", "hello."], tone: "terracotta", ratio: "4/5", parallax: -0.06 },
      { type: "garment", slug: "reprint-tee-01", side: "front", caption: "Reprint Tee 01 — the front", ratio: "3/4", backdrop: "light", parallax: 0.08 },
      { type: "caption", kicker: "On the one-run series", body: "A stamp the size of a coaster on the chest. Three letters the size of a billboard on the back. 250 printed. When they're gone, the screens are destroyed.", slug: "reprint-tee-01" },
      { type: "texture", texture: "bars", label: "Static — the house motif", tone: "dark", ratio: "16/9", span: 2, parallax: 0.05 },
      { type: "garment", slug: "static-hoodie", side: "back", caption: "Static Hoodie — full-back broadcast", ratio: "2/3", backdrop: "dark", parallax: 0.1 },
      { type: "garment", slug: "low-volume-tee", side: "front", caption: "Low Volume Tee — the whisper", ratio: "2/3", backdrop: "light", parallax: -0.04 },
    ],
  },
  {
    id: "volume",
    number: "II",
    title: "Volume",
    intro: "Colour that commits. Terracotta, cobalt, turmeric — nothing that apologises.",
    blocks: [
      { type: "garment", slug: "sunstrike-crop-hood", side: "front", caption: "Sunstrike Crop Hood", ratio: "4/5", backdrop: "cobalt", parallax: 0.09 },
      { type: "garment", slug: "open-invite-tee", side: "back", caption: "Open Invite Tee — alabaster on cobalt", ratio: "4/5", backdrop: "light", parallax: -0.05 },
      { type: "type", lines: ["Quiet", "is also", "a choice."], note: "Just not ours.", tone: "dark", ratio: "16/9", span: 2, parallax: 0.04 },
      { type: "garment", slug: "loud-minority-crew", side: "back", caption: "Loud Minority Crew", ratio: "16/9", backdrop: "light", span: 2, parallax: 0.1 },
      { type: "texture", texture: "halftone", label: "Terracotta, 40% coverage", tone: "terracotta", ratio: "1/1", parallax: -0.07 },
      { type: "caption", kicker: "On ink", body: "Water-based ink sinks into the cotton instead of sitting on it. It cracks a little with age, like it's supposed to. Plastisol only on the jackets, where the denim demands it.", slug: "oat-crew" },
    ],
  },
  {
    id: "second-shift",
    number: "III",
    title: "Second shift",
    intro: "The outerwear chapter. For the hours after the workday ends.",
    blocks: [
      { type: "garment", slug: "second-shift-trucker", side: "back", caption: "Second Shift Trucker — the broadcast", ratio: "16/9", backdrop: "dark", span: 2, parallax: 0.12 },
      { type: "type", lines: ["Built", "for the", "walk-away."], tone: "light", ratio: "4/5", parallax: -0.05 },
      { type: "garment", slug: "half-day-bomber", side: "back", caption: "Half Day Bomber — stamp between the shoulders", ratio: "4/5", backdrop: "light", parallax: 0.08 },
      { type: "texture", texture: "grain", label: "Night, Bengaluru", tone: "dark", ratio: "16/9", span: 2, parallax: 0.03 },
      { type: "caption", kicker: "Next", body: "Drop 02 — Feedback — lands 12 December. Cobalt fleece, a carbon trucker, the second one-run tee. The waitlist gets the link an hour early." },
    ],
  },
];
