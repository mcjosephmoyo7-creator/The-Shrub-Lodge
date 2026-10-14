"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { wix } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * Cross-fading background slideshow for the page hero. Images swap slowly
 * (default 5s) so the hero eases through the lodge's signature shots, matching
 * the rotating hero on theshrublodge.com.
 */
export function HeroMedia({
  images,
  interval = 5000,
  priority = true,
}: {
  images: string[];
  interval?: number;
  priority?: boolean;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, interval);

    return () => window.clearInterval(id);
  }, [images.length, interval]);

  return (
    <>
      {images.map((image, index) => (
        <Image
          key={`${image}-${index}`}
          src={wix(image, 16 / 9)}
          alt=""
          fill
          priority={priority && index < 3}
          sizes="100vw"
          className={cn(
            "object-cover transition-opacity duration-1000 ease-out",
            index === active ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </>
  );
}
