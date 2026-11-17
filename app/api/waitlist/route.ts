import { getGarment } from "@/content/garments";
import { normaliseEmail, storeWaitlistEntry } from "@/lib/waitlist";

/**
 * POST /api/waitlist
 * body: { email: string; source: string; piece?: string; size?: string; company?: string }
 * `company` is a honeypot — bots fill it, people never see it.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "Send JSON." }, { status: 400 });
  }

  if (typeof body.company === "string" && body.company.length > 0) {
    // honeypot tripped: pretend success so the bot moves on
    return Response.json({ ok: true });
  }

  const email = normaliseEmail(body.email);
  if (!email) {
    return Response.json({ ok: false, error: "That email doesn't look right." }, { status: 422 });
  }

  const source = typeof body.source === "string" ? body.source.slice(0, 40) : "unknown";
  const piece = typeof body.piece === "string" && getGarment(body.piece) ? body.piece : undefined;
  const size = typeof body.size === "string" ? body.size.slice(0, 8) : undefined;

  const result = await storeWaitlistEntry({ email, source, piece, size, createdAt: new Date().toISOString() });

  if (!result.ok) {
    console.error("[waitlist]", result.error);
    return Response.json({ ok: false, error: "Couldn't save that. Try again in a minute." }, { status: 502 });
  }
  return Response.json({ ok: true, duplicate: result.duplicate ?? false });
}
