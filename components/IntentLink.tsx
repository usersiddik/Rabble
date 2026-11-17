"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

type IntentLinkProps = Omit<ComponentProps<typeof Link>, "href" | "prefetch"> & { href: string };

/**
 * A Link that prefetches on intent (pointer over, focus, touch) instead of on sight.
 * Used for links to the homepage: its rack hero ships Framer Motion, and the logo is on
 * every page, so viewport prefetching made every page download the hero up front.
 */
export default function IntentLink({ href, onPointerEnter, onFocus, onTouchStart, ...rest }: IntentLinkProps) {
  const router = useRouter();
  const warm = () => router.prefetch(href);
  return (
    <Link
      href={href}
      prefetch={false}
      onPointerEnter={(e) => {
        warm();
        onPointerEnter?.(e);
      }}
      onFocus={(e) => {
        warm();
        onFocus?.(e);
      }}
      onTouchStart={(e) => {
        warm();
        onTouchStart?.(e);
      }}
      {...rest}
    />
  );
}
