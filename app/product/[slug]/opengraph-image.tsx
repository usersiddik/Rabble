import { ogImage, OG_SIZE } from "@/lib/og";
import { formatINR, garments, getGarment } from "@/content/garments";

export const alt = "RABBLE garment";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return garments.map((g) => ({ slug: g.slug }));
}

/** A flat swatch of the garment + ink, since the illustration is SVG and satori can't render it. */
function Swatch({ body, ink, back }: { body: string; ink: string; back: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div
        style={{
          display: "flex",
          width: 200,
          height: 240,
          borderRadius: 24,
          background: body,
          alignItems: back ? "flex-start" : "flex-start",
          justifyContent: back ? "center" : "flex-end",
          padding: back ? "56px 22px" : "48px 30px",
          boxShadow: "0 24px 60px -20px rgba(17,17,17,0.35)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: back ? 124 : 36,
            height: back ? 56 : 16,
            borderRadius: 6,
            background: ink,
          }}
        />
      </div>
      <div style={{ display: "flex", fontSize: 16, letterSpacing: 3, textTransform: "uppercase", color: "#8E8E93" }}>{back ? "Back" : "Front"}</div>
    </div>
  );
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGarment(slug);
  if (!g) {
    return ogImage({ kicker: "RABBLE", title: "Lost the crowd.", meta: "404" });
  }
  const waitlist = g.status === "waitlist";
  return ogImage({
    kicker: waitlist ? "Drop 02 — waitlist" : "Drop 01 — live",
    title: g.name,
    note: g.color,
    meta: `${formatINR(g.price)} · ${g.print.gsm} GSM · ${g.print.inkName} ink · ${g.runSize} in the run`,
    tone: waitlist ? "dark" : "light",
    art: (
      <div style={{ display: "flex", gap: 20, flexShrink: 0 }}>
        <Swatch body={g.art.colors.body} ink={g.print.inkHex} back={false} />
        {g.print.back && <Swatch body={g.art.colors.body} ink={g.print.inkHex} back />}
      </div>
    ),
  });
}
