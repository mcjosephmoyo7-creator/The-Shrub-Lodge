export type Feature = {
  number: string;
  title: string;
  icon: "location" | "sparkles" | "compass";
};

export const features: Feature[] = [
  { number: "01", title: "Prime Location", icon: "location" },
  { number: "02", title: "Luxury Touches", icon: "sparkles" },
  { number: "03", title: "Adventure Ready", icon: "compass" },
];

export const testimonials = [
  {
    quote:
      "The lodge seems to be pretty new, everything is perfect, the rooms have an excellent decoration and distribution. The breakfast is nice, and the swimming pool was great. We regret that we could not find availability to stay more days. This place is definitely one the best ones in Vic Falls. I recommend them 100%",
    author: "Santiago, Argentina",
  },
];
