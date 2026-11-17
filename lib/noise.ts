/**
 * The "noise" motif: a row of vertical bars of varying height, like static on a meter.
 * Deterministic per seed so server and client render identically.
 */

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Bar heights in 0..1, with a loud centre and a quiet tail — a signal, not white noise. */
export function noiseBars(seed: number, count: number): number[] {
  const rand = mulberry32(seed * 7919 + count);
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / Math.max(1, count - 1);
    const envelope = 0.35 + 0.65 * Math.exp(-Math.pow((t - 0.42) * 2.6, 2));
    const jitter = 0.25 + rand() * 0.75;
    out.push(Math.min(1, envelope * jitter + (i % 5 === 0 ? 0.15 : 0)));
  }
  return out;
}
