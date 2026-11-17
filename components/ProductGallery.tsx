"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  name: string;
  badge?: string;
  badgeTone?: "ink" | "cobalt";
}

export default function ProductGallery({ images, name, badge, badgeTone = "ink" }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      {images.length > 1 && (
        <div className="order-2 flex gap-3 md:order-1 md:flex-col">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1} of ${name}`}
              aria-current={i === index}
              className={`img-frame relative h-20 w-16 shrink-0 transition-opacity ${
                i === index ? "ring-1 ring-ink" : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="img-frame relative order-1 aspect-[4/5] flex-1 md:order-2">
        <Image
          key={images[index]}
          src={images[index]}
          alt={name}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          style={{ animation: "page-in 0.4s both" }}
        />
        {badge && (
          <span className={`hang-tag absolute left-4 top-4 ${badgeTone === "cobalt" ? "hang-tag--cobalt" : ""}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
