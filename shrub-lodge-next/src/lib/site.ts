export type NavChild = {
  title: string;
  href: string;
};

export type NavItem = {
  title: string;
  href: string;
  children?: NavChild[];
};

export const siteConfig = {
  name: "The Shrub Lodge",
  tagline: "Luxury Stay in Victoria Falls",
  description:
    "The Shrub Lodge is a family-run 3-star lodge in Victoria Falls, Zimbabwe, blending relaxed luxury with heartfelt hospitality. Your gateway to unforgettable adventure.",
  url: "https://www.theshrublodge.com",
  address: {
    street: "649 Reynard Road",
    city: "Victoria Falls",
    country: "Zimbabwe",
    full: "649 Reynard Rd, Victoria Falls, Zimbabwe",
    coordinates: {
      lat: -17.9268248,
      lng: 25.8271366,
    },
  },
  phone: {
    reservations: "+263788746909",
    reception: "+263781739213",
  },
  phoneDisplay: {
    reservations: "+263 788 746 909",
    reception: "+263 781 739 213",
  },
  email: {
    reservations: "reservations@theshrublodge.com",
    tours: "tours@theshrublodge.com",
  },
  hours: {
    frontDesk: "8:00 am - 10:00 pm daily",
    checkIn: "From 2:00 pm",
    checkOut: "By 10:00 am",
  },
  bookingHref: "/contact",
} as const;

export const navigation: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  {
    title: "Activities",
    href: "/activities",
    children: [
      { title: "Victoria Falls & Scenic Experiences", href: "/activities/victoria-falls-scenic" },
      { title: "Safari, Wildlife & Nature", href: "/activities/safari-wildlife-nature" },
      { title: "Animal Encounters & Conservation", href: "/activities/animal-encounters" },
      { title: "Cruises & River Experiences", href: "/activities/cruises-river" },
      { title: "Adventure & Adrenaline", href: "/activities/adventure-adrenaline" },
      { title: "Aerial Adventures", href: "/activities/aerial-adventures" },
      { title: "Cultural, City & Local Experiences", href: "/activities/cultural-city" },
      { title: "Transfers", href: "/transfers" },
    ],
  },
  { title: "The Shrub Restaurant", href: "/restaurant" },
  { title: "Contact", href: "/contact" },
];

export const footerLinks = [
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Terms and Conditions", href: "/terms-and-conditions" },
  { title: "Contact", href: "/contact" },
];
