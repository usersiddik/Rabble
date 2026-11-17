/**
 * Waitlist storage. One function, one provider chosen by environment:
 *
 *   RESEND_API_KEY + RESEND_AUDIENCE_ID   → Resend Audiences (contacts API, no SDK needed)
 *   otherwise                             → local JSONL file in development, log-only in production
 *
 * Swapping to Mailchimp or Supabase means adding one more branch here. Nothing else changes.
 */

import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

export interface WaitlistEntry {
  email: string;
  /** where the signup came from: "hero", "footer", "drop", "product:<slug>" */
  source: string;
  /** garment slug for "notify me" per piece */
  piece?: string;
  size?: string;
  createdAt: string;
}

export type WaitlistResult = { ok: true; provider: "resend" | "file" | "log"; duplicate?: boolean } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normaliseEmail(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const email = input.trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) return null;
  return email;
}

async function toResend(entry: WaitlistEntry, apiKey: string, audienceId: string): Promise<WaitlistResult> {
  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: entry.email,
      unsubscribed: false,
      // Resend contacts carry first/last name only; we pack the signal into last_name for segmenting.
      first_name: entry.piece ? `piece:${entry.piece}` : entry.source,
      last_name: [entry.source, entry.size ? `size:${entry.size}` : null].filter(Boolean).join(" "),
    }),
  });
  if (res.status === 409) return { ok: true, provider: "resend", duplicate: true };
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, error: `Resend ${res.status}: ${text.slice(0, 200)}` };
  }
  return { ok: true, provider: "resend" };
}

async function toFile(entry: WaitlistEntry): Promise<WaitlistResult> {
  const dir = join(process.cwd(), ".data");
  await mkdir(dir, { recursive: true });
  await appendFile(join(dir, "waitlist.jsonl"), JSON.stringify(entry) + "\n", "utf8");
  return { ok: true, provider: "file" };
}

export async function storeWaitlistEntry(entry: WaitlistEntry): Promise<WaitlistResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (apiKey && audienceId) return toResend(entry, apiKey, audienceId);
  if (process.env.NODE_ENV !== "production") return toFile(entry);
  console.info("[waitlist] no provider configured; entry logged only", entry);
  return { ok: true, provider: "log" };
}
