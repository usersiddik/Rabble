import Image from "next/image";
import GarmentArt from "./GarmentArt";
import type { Garment, Side } from "@/content/garments";

/**
 * One garment, one side. Renders cutout photography when the catalogue has it
 * (`frontImage` / `backImage` / `sidePreview`), otherwise the illustrated placeholder.
 * Components never need to know which one they got.
 */

interface GarmentCutoutProps {
  garment: Garment;
  side?: Side | "side";
  hanger?: boolean;
  tag?: string;
  tagTone?: "carbon" | "terracotta" | "cobalt";
  className?: string;
  /** mark as LCP candidate when photography is present */
  priority?: boolean;
  sizes?: string;
  /** accessible name; defaults to "<name> — <side>" */
  alt?: string;
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
  const photo =
    side === "front" ? garment.frontImage : side === "back" ? garment.backImage : garment.sidePreview;
  const label = alt ?? `${garment.name} in ${garment.color} — ${side}`;

  if (photo) {
    return (
      <div className={`relative ${className}`}>
        <Image src={photo} alt={label} fill priority={priority} sizes={sizes} className="object-contain" />
      </div>
    );
  }

  const artSide: Side = side === "back" ? "back" : "front";
  const placement = artSide === "front" ? garment.print.front : garment.print.back;

  return (
    <GarmentArt
      kind={garment.art.kind}
      colors={garment.art.colors}
      side={artSide}
      print={placement}
      ink={garment.print.inkHex}
      hanger={hanger}
      tag={tag}
      tagTone={tagTone}
      title={label}
      className={className}
    />
  );
}
