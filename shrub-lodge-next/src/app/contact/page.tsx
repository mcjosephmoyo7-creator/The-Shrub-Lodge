import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Hero } from "@/components/hero";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { IMAGES } from "@/lib/images";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with The Shrub Lodge in Victoria Falls. Call, email or send us a message and our team will help plan your stay.",
};

export default function ContactPage() {
  return (
    <>
      <Hero
        eyebrow="Contact"
        title="Let's Chat"
        subtitle="Questions about your stay or an activity? Our team would love to hear from you."
        image={IMAGES.aboutHero}
      />

      <section className="bg-sand-50 py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-5">
            <Reveal>
              <a
                href={`tel:${siteConfig.phone.reservations}`}
                className="flex items-start gap-4 rounded-3xl border border-sand-200 bg-white p-6 shadow-sm transition-colors hover:border-gold-300"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-900 text-gold-300">
                  <Phone className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                    Phone
                  </span>
                  <span className="font-medium text-forest-900">
                    {siteConfig.phoneDisplay.reservations}
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal delay={80}>
              <a
                href={`mailto:${siteConfig.email.reservations}`}
                className="flex items-start gap-4 rounded-3xl border border-sand-200 bg-white p-6 shadow-sm transition-colors hover:border-gold-300"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-900 text-gold-300">
                  <Mail className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                    Email
                  </span>
                  <span className="font-medium text-forest-900">
                    {siteConfig.email.reservations}
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal delay={160}>
              <div className="flex items-start gap-4 rounded-3xl border border-sand-200 bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-900 text-gold-300">
                  <MapPin className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                    Address
                  </span>
                  <span className="font-medium text-forest-900">
                    {siteConfig.address.full}
                  </span>
                </span>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="flex items-start gap-4 rounded-3xl border border-sand-200 bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-900 text-gold-300">
                  <Clock className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div className="flex flex-col gap-1 text-forest-900">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                    Opening Hours
                  </span>
                  <span>Front Desk: {siteConfig.hours.frontDesk}</span>
                  <span>Check-in: {siteConfig.hours.checkIn}</span>
                  <span>Check-out: {siteConfig.hours.checkOut}</span>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="rounded-3xl border border-sand-200 bg-white p-8 shadow-sm sm:p-10">
              <h2 className="font-display text-2xl text-forest-900">
                Send us a message
              </h2>
              <p className="mt-2 text-sm text-forest-800/70">
                Fill in the form below and we will get back to you as soon as we
                can.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
