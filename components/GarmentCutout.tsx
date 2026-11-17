import Image from "next/image";
import GarmentRender, { type GarmentRenderProps, type GarmentView, type TagTone } from "./GarmentRender";
import type { Garment, Side } from "@/content/garments";

/**
 * One garment, one side. Renders cutout photography when the catalogue has it
 * (`frontImage` / `backImage` / `sidePreview`), otherwise the procedural studio
 * render (<GarmentRender />). Components never need to know which one they got.
 */

interface GarmentCutoutProps {
  garment: Garment;
  side?: Side | "side";
  hanger?: boolean;
  tag?: string;
  tagTone?: TagTone;
  className?: string;
  /** mark as LCP candidate when photography is present */
  priority?: boolean;
  sizes?: string;
  /** accessible name; defaults to "<name> — <side>" */
  alt?: string;
}

/** Catalogue garment → <GarmentRender /> props for one view (colours, kind, ink, print placement). */
export function renderProps(garment: Garment, view: GarmentView): GarmentRenderProps {
  const { art, print } = garment;
  return {
    kind: art.kind,
    view,
    body: art.colors.body,
    shade: art.colors.shade,
    detail: art.colors.detail,
    ink: print.inkHex,
    print: view === "front" ? print.front : view === "back" ? print.back : undefined,
  };
}

/** The photo slot for a view, if the catalogue has one. */
export function photoFor(garment: Garment, view: GarmentView): string | undefined {
  return view === "front" ? garment.frontImage : view === "back" ? garment.backImage : garment.sidePreview;
}

export default function GarmentCutout({
  garment,
  side = "front",
  hanger = true,
  tag,
  tagTone = "carbon",
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  alt,
}: GarmentCutoutProps) {
  const photo = photoFor(garment, side);
  const label = alt ?? `${garment.name} in ${garment.color} — ${side}`;

  if (photo) {
    return (
      <div className={`relative ${className}`}>
        <Image src={photo} alt={label} fill priority={priority} sizes={sizes} className="object-contain" />
      </div>
    );
  }

  return (
    <GarmentRender
      {...renderProps(garment, side === "side" ? "side" : side)}
      hanger={hanger}
      tag={tag}
      tagTone={tagTone}
      title={label || undefined}
      className={className}
    />
  );
}
