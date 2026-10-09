import { Quote, Star } from "lucide-react";
import { Container } from "@/components/ui/container";

export function Testimonial({
  quote,
  author,
}: {
  quote: string;
  author: string;
}) {
  return (
    <figure className="flex flex-col items-center gap-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/15 text-gold-500">
        <Quote className="h-6 w-6" />
      </span>
      <div className="flex items-center gap-1 text-gold-400" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <blockquote className="max-w-3xl font-display text-2xl leading-relaxed text-sand-50 sm:text-3xl">
        {quote}
      </blockquote>
      <figcaption className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-300">
        {author}
      </figcaption>
    </figure>
  );
}

export function TestimonialSection({
  items,
}: {
  items: { quote: string; author: string }[];
}) {
  return (
    <section className="bg-forest-950 py-20 sm:py-24">
      <Container className="flex flex-col gap-12">
        {items.map((item) => (
          <Testimonial key={item.author} quote={item.quote} author={item.author} />
        ))}
      </Container>
    </section>
  );
}
