import type { ReactNode } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { wix } from "@/lib/images";
import { cn } from "@/lib/utils";

export function Hero({
  image,
  eyebrow,
  title,
  subtitle,
  size = "page",
  align = "left",
  priority = true,
  children,
  className,
}: {
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  size?: "full" | "page";
  align?: "left" | "center";
  priority?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative flex items-center overflow-hidden bg-forest-950",
        size === "full" ? "min-h-[88vh]" : "min-h-[48vh]",
        className,
      )}
    >
      <Image
        src={wix(image, 16 / 9)}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/95 via-forest-950/65 to-forest-950/45" />
      <Container className="relative z-10 py-24 sm:py-28">
        <div
          className={cn(
            "flex flex-col gap-5",
            align === "center" ? "mx-auto max-w-3xl items-center text-center" : "max-w-3xl",
          )}
        >
          {eyebrow ? (
            <span className="text-xs font-semibold uppercase tracking-[0.32em] text-gold-300">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="font-display text-4xl leading-[1.05] text-sand-50 sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-2xl text-lg leading-relaxed text-sand-100/85">
              {subtitle}
            </p>
          ) : null}
          {children ? (
            <div className="mt-2 flex flex-wrap items-center gap-4">{children}</div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
