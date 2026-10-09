import type { Metadata } from "next";
import Image from "next/image";
import { Hero } from "@/components/hero";
import { CtaBanner } from "@/components/cta-banner";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { IMAGES, wix } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Shrub Lodge was founded with a vision to create a home-away-from-home in Victoria Falls, rooted in a family-run tradition of hospitality.",
};

export default function AboutPage() {
  return (
    <>
      <Hero
        eyebrow="About Us"
        title="Where Comfort Meets the Wonder of the Falls"
        image={IMAGES.aboutHero}
      />

      <section className="bg-white py-20 sm:py-24">
        <Container className="grid items-start gap-12 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="flex flex-col gap-6 text-base leading-relaxed text-forest-800/80">
            <p>
              The Shrub Lodge was founded with a vision to create a
              home-away-from-home in Victoria Falls, one of the world’s most
              breathtaking destinations. Rooted in a family-run tradition of
              hospitality, the lodge began as a small, welcoming guesthouse and
              has since grown into a charming retreat where travelers from
              across the globe gather to rest, connect, and experience the
              beauty of Zimbabwe.
            </p>
            <p>
              Our name reflects our philosophy: just like a shrub that thrives
              with care, we believe every guest deserves thoughtful attention,
              comfort, and the right environment to flourish during their stay.
              We are more than a lodge, we are a team of passionate hosts
              dedicated to delivering genuine warmth and attentive service.
              Whether you are here for adventure, business, or relaxation, our
              goal is to make your experience seamless and memorable. We pride
              ourselves on blending professional service with the personal
              touch of a family-run business.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl">
              <Image
                src={wix(IMAGES.lodgeInterior, 4 / 5)}
                alt="Inside The Shrub Lodge"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-sand-50 py-20 sm:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeading
              eyebrow="Our Promise"
              title="You arrive as a guest, you leave as family"
              intro="Victoria Falls is a once-in-a-lifetime destination, and we’re here to ensure that your stay is every bit as unforgettable as the Falls themselves. At The Shrub Lodge, you arrive as a guest but leave as part of our extended family."
            />
          </Reveal>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
