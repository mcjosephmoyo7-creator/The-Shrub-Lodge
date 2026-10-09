import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export function Logo({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={cn("group flex items-center gap-3", className)}
    >
      <span
        className={cn(
          "relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border p-1 transition-all duration-300 group-hover:scale-105",
          tone === "light"
            ? "border-gold-400/50 bg-forest-900/40 shadow-sm shadow-black/20"
            : "border-forest-900/20 bg-sand-100/80 shadow-sm",
        )}
      >
        <Image
          src="/images/logo.png"
          alt="The Shrub Lodge logo"
          width={40}
          height={40}
          priority
          className="h-full w-full object-contain"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg tracking-wide transition-colors duration-300",
            tone === "light" ? "text-sand-50" : "text-forest-950",
          )}
        >
          The Shrub Lodge
        </span>
        <span
          className={cn(
            "mt-1 text-[0.625rem] font-medium uppercase tracking-[0.28em] transition-colors duration-300",
            tone === "light" ? "text-sand-100/70" : "text-forest-700/80",
          )}
        >
          Victoria Falls
        </span>
      </span>
    </Link>
  );
}
