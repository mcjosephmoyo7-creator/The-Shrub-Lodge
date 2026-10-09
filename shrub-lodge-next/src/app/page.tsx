import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { FeatureCard } from "@/components/feature-card";
import { RoomCard } from "@/components/room-card";
import { AmenitiesGrid } from "@/components/amenities-grid";
import { TestimonialSection } from "@/components/testimonial";
import { CtaBanner } from "@/components/cta-banner";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { IMAGES, wix } from "@/lib/images";
import { siteConfig } from "@/lib/site";
import { features, testimonials } from "@/lib/content/features";
import { rooms } from "@/lib/content/rooms";
import { amenities, amenitiesIntro } from "@/lib/content/amenities";

const showcase = [
  {
    title: "Rooms",
    description: "Thoughtfully styled rooms to rest and recharge.",
    href: "/about",
    image: IMAGES.roomDetail1,
  },
  {
    title: "Adventure",
    description: "Curated experiences across Victoria Falls and beyond.",
    href: "/activities",
    image: IMAGES.adrenaline,
  },
];

export default function HomePage() {
  return (
    <>
      <Hero
        size="full"
        eyebrow="Victoria Falls · Zimbabwe"
        title="More Than a Stay — Your Zimbabwe Story Begins Here"
        subtitle="Your gateway to unforgettable adventure in the heart of Zimbabwe."
        image={IMAGES.heroFalls}
      >
        <ButtonLink href={siteConfig.bookingHref}>Book Now</ButtonLink>
        <ButtonLink
          href="/activities"
          variant="ghost"
          className="border border-white/25 text-sand-50 hover:bg-white/10"
        >
          Explore Activities
        </ButtonLink>
      </Hero>

      {/* Features */}
      <section className="bg-sand-50 py-20 sm:py-24">
        <Container className="flex flex-col gap-14">
          <Reveal>
            <SectionHeading
              eyebrow="Features"
              title="Comfort, Convenience, Adventure. All in One Place"
            />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 90}>
                <FeatureCard feature={feature} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* About teaser */}
      <section className="bg-white py-20 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <SectionHeading
              align="left"
              eyebrow="About Us"
              title="Meet The Heart Behind The Shrub"
              intro="More than a stay. A feeling of warmth, wonder, and belonging that’s The Shrub Lodge. Nestled in the quiet suburbs of Victoria Falls, our family-run 3-star lodge blends relaxed luxury with heartfelt hospitality, creating a soulful escape for those who seek both comfort and adventure."
            />
            <ButtonLink href="/about" variant="outline" className="mt-8">
              Read More
            </ButtonLink>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl">
              <Image
                src={wix(IMAGES.lodgeExterior, 4 / 5)}
                alt="The Shrub Lodge"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Rooms */}
      <section className="bg-sand-50 py-20 sm:py-24">
        <Container className="flex flex-col gap-14">
          <Reveal>
            <SectionHeading
              eyebrow="Rooms"
              title="Luxury Stays For Your Comfort"
              intro="Whether you're a solo adventurer or a family on a bucket-list safari, The Shrub Lodge offers a sophisticated sanctuary in the heart of Victoria Falls. Our rooms are more than just a place to sleep, they are designed to be your personal retreat, providing a seamless blend of modern luxury and relaxation."
            />
          </Reveal>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room, index) => (
              <Reveal key={room.name} delay={index * 90}>
                <RoomCard room={room} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Amenities */}
      <section className="bg-white py-20 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Our Amenities"
              title="Everything you need to settle in"
              intro={amenitiesIntro}
            />
            <div className="mt-8 relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lg">
              <Image
                src={wix(IMAGES.lodgePool, 4 / 3)}
                alt="Pool at The Shrub Lodge"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <AmenitiesGrid items={amenities} />
          </Reveal>
        </Container>
      </section>

      {/* Showcase */}
      <section className="bg-sand-50 py-20 sm:py-24">
        <Container className="flex flex-col gap-14">
          <Reveal>
            <SectionHeading
              eyebrow="Projects"
              title="Comfort Inside, Adventure Outside"
            />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {showcase.map((item, index) => (
              <Reveal key={item.title} delay={index * 90}>
                <Link
                  href={item.href}
                  className="group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-[2rem] p-8 text-sand-50"
                >
                  <Image
                    src={wix(item.image, 4 / 3)}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/40 to-transparent" />
                  <div className="relative z-10 flex flex-col gap-2">
                    <h3 className="font-display text-3xl">{item.title}</h3>
                    <p className="text-sm text-sand-100/80">{item.description}</p>
                    <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-gold-300">
                      Discover
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <TestimonialSection items={testimonials} />

      {/* Explore */}
      <section className="bg-white py-20 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-xl">
              <Image
                src={wix(IMAGES.heroFallsTall, 4 / 3)}
                alt="Adventures at Victoria Falls"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SectionHeading
              align="left"
              eyebrow="Adventure"
              title="Explore With The Shrub Lodge"
              intro="Your stay at The Shrub Lodge is more than just luxury accommodation, it’s the gateway to unforgettable adventures. From guided tours of Victoria Falls and serene Zambezi River cruises, to thrilling safaris, cultural village visits, white-water rafting, and fishing trips, every experience is designed to showcase the very best of Zimbabwe."
            />
            <ButtonLink href="/activities" className="mt-8">
              Discover More
            </ButtonLink>
          </Reveal>
        </Container>
      </section>

      {/* Dining */}
      <section className="bg-forest-900 py-20 text-sand-50 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              align="left"
              tone="light"
              eyebrow="Dine with us"
              title="The Shrub Restaurant"
              intro="The Shrub Lodge menu features a selection of carefully crafted dishes, highlighting fresh, local ingredients and flavors. Perfect for a satisfying meal after a day of adventure or relaxation."
            />
            <ButtonLink href="/restaurant" className="mt-8">
              Explore the Restaurant
            </ButtonLink>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-xl">
              <Image
                src={wix(IMAGES.restaurantHero, 4 / 3)}
                alt="Dining at The Shrub Restaurant"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
