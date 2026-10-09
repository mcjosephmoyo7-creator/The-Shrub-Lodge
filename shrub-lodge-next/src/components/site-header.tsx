"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { navigation, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileActivitiesOpen, setMobileActivitiesOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    setMobileActivitiesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-300",
        scrolled
          ? "border-sand-300/70 bg-white/85 shadow-md shadow-forest-950/5"
          : "border-transparent bg-forest-950/80",
      )}
    >
      <Container className="flex h-20 items-center justify-between gap-4">
        <Logo tone={scrolled ? "dark" : "light"} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navigation.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    scrolled
                      ? "text-forest-900 hover:bg-forest-900/5 hover:text-forest-950"
                      : "text-sand-100/90 hover:bg-white/5 hover:text-white",
                    isActive(pathname, item.href) &&
                      (scrolled
                        ? "bg-sand-200/70 font-semibold text-forest-950"
                        : "bg-white/10 text-white font-semibold"),
                  )}
                >
                  {item.title}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform group-hover:rotate-180",
                      scrolled ? "text-forest-700" : "text-sand-200",
                    )}
                  />
                </Link>
                <div className="invisible absolute left-0 top-full z-50 w-80 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="overflow-hidden rounded-2xl border border-forest-100 bg-white p-2 shadow-xl">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block rounded-xl px-4 py-2.5 text-sm text-forest-800 transition-colors hover:bg-sand-100 hover:text-forest-950",
                          isActive(pathname, child.href) &&
                            "bg-sand-100 font-semibold text-forest-950",
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  scrolled
                    ? "text-forest-900 hover:bg-forest-900/5 hover:text-forest-950"
                    : "text-sand-100/90 hover:bg-white/5 hover:text-white",
                  isActive(pathname, item.href) &&
                    (scrolled
                      ? "bg-sand-200/70 font-semibold text-forest-950"
                      : "bg-white/10 text-white font-semibold"),
                )}
              >
                {item.title}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink
            href={siteConfig.bookingHref}
            className="hidden px-5 py-2.5 sm:inline-flex"
          >
            Book Now
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors lg:hidden",
              scrolled
                ? "border-forest-900/20 text-forest-900 hover:bg-forest-900/5"
                : "border-white/15 text-sand-50 hover:bg-white/10",
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-300 lg:hidden",
          scrolled
            ? "border-t border-sand-200 bg-white/95 text-forest-900 backdrop-blur-md shadow-lg"
            : "border-t border-forest-800 bg-forest-950 text-sand-100",
          open ? "max-h-[85vh] overflow-y-auto opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {navigation.map((item) =>
            item.children ? (
              <div key={item.href} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setMobileActivitiesOpen((value) => !value)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                    scrolled
                      ? "text-forest-900 hover:bg-forest-900/5"
                      : "text-sand-100 hover:bg-white/5",
                  )}
                >
                  {item.title}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      mobileActivitiesOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-[max-height] duration-300",
                    mobileActivitiesOpen ? "max-h-96" : "max-h-0",
                  )}
                >
                  <div
                    className={cn(
                      "ml-2 flex flex-col gap-0.5 border-l pb-1 pl-3",
                      scrolled ? "border-sand-300" : "border-forest-800",
                    )}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm transition-colors",
                        scrolled
                          ? "text-forest-800 hover:bg-sand-100 hover:text-forest-950"
                          : "text-sand-100/80 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      All Activities
                    </Link>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm transition-colors",
                          scrolled
                            ? "text-forest-800 hover:bg-sand-100 hover:text-forest-950"
                            : "text-sand-100/80 hover:bg-white/5 hover:text-white",
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  scrolled
                    ? "text-forest-900 hover:bg-forest-900/5"
                    : "text-sand-100 hover:bg-white/5",
                )}
              >
                {item.title}
              </Link>
            ),
          )}
          <ButtonLink href={siteConfig.bookingHref} className="mt-2 w-full">
            Book Now
          </ButtonLink>
        </Container>
      </div>
    </header>
  );
}
