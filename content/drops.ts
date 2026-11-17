/**
 * Drop mechanics. One live chapter, one on the way.
 */

export interface Drop {
  number: 1 | 2;
  code: string;
  name: string;
  status: "live" | "upcoming";
  /** ISO date. For upcoming drops, the countdown target. */
  date: string;
  pieces: number;
  /** total garments printed across the drop */
  runSize: number;
  tagline: string;
  blurb: string;
}

export const drops: Drop[] = [
  {
    number: 1,
    code: "DROP 01",
    name: "Signal",
    status: "live",
    date: "2026-10-03T10:00:00+05:30",
    pieces: 10,
    runSize: 2520,
    tagline: "The first broadcast.",
    blurb:
      "Ten pieces, every one printed front and back in a single run. When a print sells through, the screens are destroyed.",
  },
  {
    number: 2,
    code: "DROP 02",
    name: "Feedback",
    status: "upcoming",
    date: "2026-12-12T10:00:00+05:30",
    pieces: 6,
    runSize: 1290,
    tagline: "Louder on the way back.",
    blurb:
      "Six new pieces. Cobalt fleece, a carbon trucker, and the second one-run tee. Waitlist gets the link an hour before anyone else.",
  },
];

export function currentDrop(): Drop {
  return drops.find((d) => d.status === "live") ?? drops[0];
}

export function nextDrop(): Drop | undefined {
  return drops.find((d) => d.status === "upcoming");
}

export function getDrop(number: 1 | 2): Drop | undefined {
  return drops.find((d) => d.number === number);
}
