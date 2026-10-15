import { siteConfig } from "@/lib/site";
import {
  allActivities,
  resolvedFavourites,
  type ActivityWithCategory,
} from "@/lib/assistant/knowledge";
import { rooms } from "@/lib/content/rooms";
import { amenities } from "@/lib/content/amenities";
import { transfers } from "@/lib/content/transfers";
import {
  beverageHighlights,
  foodHighlights,
  restaurantIntro,
} from "@/lib/content/restaurant";

const STOPWORDS = new Set([
  "the", "and", "for", "you", "your", "with", "what", "which", "that", "this",
  "can", "could", "would", "should", "have", "has", "are", "was", "were", "any",
  "how", "much", "does", "did", "about", "from", "into", "some", "there", "here",
  "please", "want", "like", "need", "tell", "give", "show", "help", "been",
  "they", "them", "then", "than", "will", "just", "get", "got", "our", "out",
  "not", "but", "all", "also", "very", "more", "most", "one", "two", "you're",
  "i'm", "im", "me", "my", "we", "us", "is", "it", "of", "to", "in", "on", "at",
  "a", "an", "do", "i", "be", "as", "or", "if", "so", "no", "yes",
]);

const INTERESTS: Record<string, string[]> = {
  adrenaline: ["adrenaline", "thrill", "extreme", "bungee", "rafting", "swing", "zipline", "zip line", "jetboat", "jet boat", "quad"],
  wildlife: ["wildlife", "safari", "animals", "animal", "game drive", "big five", "elephant", "lion", "rhino", "bird", "nature", "park"],
  relax: ["relax", "relaxing", "chill", "calm", "peaceful", "quiet", "rest", "sunset", "cruise", "spa", "unwind"],
  romantic: ["romantic", "romance", "honeymoon", "couple", "couples", "anniversary", "date night"],
  family: ["family", "families", "kids", "children", "child", "toddler", "teenager", "teen"],
  culture: ["culture", "cultural", "village", "township", "local", "heritage", "music", "dance", "traditional", "town tour"],
  falls: ["falls", "victoria falls", "victoria", "devil", "angel", "scenic", "viewpoint", "torrent"],
  aerial: ["helicopter", "microlight", "flight", "aerial", "fly", "gorge flight"],
  water: ["river", "cruise", "boat", "rafting", "canoe", "fishing", "jetboat", "water"],
};

function normalise(input: string): string {
  return input.toLowerCase().replace(/[^\p{L}\p{N}$\s'-]/gu, " ").replace(/\s+/g, " ").trim();
}

function tokenise(input: string): string[] {
  return normalise(input)
    .split(" ")
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

function scoreActivity(query: string, queryTokens: string[], activity: ActivityWithCategory): number {
  const name = activity.name.toLowerCase();
  const category = activity.categoryTitle.toLowerCase();
  const description = activity.description.toLowerCase();
  const phrase = normalise(query);

  let score = 0;
  if (phrase.length > 2 && name.includes(phrase)) score += 8;
  for (const token of queryTokens) {
    if (name.includes(token)) score += 4;
    else if (category.includes(token)) score += 1.5;
    else if (description.includes(token)) score += 0.75;
  }
  return score;
}

function bestActivityMatch(query: string, queryTokens: string[]): ActivityWithCategory | undefined {
  let best: ActivityWithCategory | undefined;
  let bestScore = 0;
  for (const activity of allActivities) {
    const score = scoreActivity(query, queryTokens, activity);
    if (score > bestScore) {
      bestScore = score;
      best = activity;
    }
  }
  return bestScore >= 4 ? best : undefined;
}

function activityLine(activity: ActivityWithCategory): string {
  return `• ${activity.name} — US$${activity.price} per person\n${activity.description}\nCategory: ${activity.categoryTitle} → /activities/${activity.categorySlug}\nBook: ${activity.bookingUrl}`;
}

function guessInterests(query: string): string[] {
  const text = normalise(query);
  const matches: string[] = [];
  for (const [interest, keywords] of Object.entries(INTERESTS)) {
    if (keywords.some((keyword) => text.includes(keyword))) matches.push(interest);
  }
  return matches;
}

function recommendFromFavourites(query: string): string {
  const interests = guessInterests(query);
  const ranked = [...resolvedFavourites].sort((a, b) => {
    const score = (favourite: typeof a) =>
      interests.reduce(
        (total, interest) =>
          total +
          (favourite.tags.some((tag) => tag.includes(interest) || interest.includes(tag)) ? 2 : 0) +
          (favourite.categorySlug.includes(interest) ? 1 : 0),
        0,
      );
    return score(b) - score(a);
  });

  const hasInterest = interests.length > 0;
  const picks = ranked.slice(0, 3);
  const intro = hasInterest
    ? `Great — based on what you enjoy (${interests.join(", ")}), here are guest favourites that fit:`
    : `Happy to help you choose! If you're not sure, these are the activities guests love most at The Shrub Lodge:`;

  return [
    intro,
    "",
    ...picks.map((favourite, index) => `${index + 1}. ${favourite.activity} — US$${favourite.price}\n   ${favourite.why}\n   Details & booking: ${favourite.bookingUrl}`),
    "",
    hasInterest
      ? "Would you like more options in any of these, or shall I check prices for a specific one?"
      : "Tell me what you enjoy — adrenaline, wildlife, a relaxing river cruise, culture, or family time — and I'll narrow it down. You can also browse everything at /activities.",
  ].join("\n");
}

function priceAnswer(query: string, tokens: string[]): string {
  const match = bestActivityMatch(query, tokens);
  if (match) {
    return [
      `${match.name} costs US$${match.price} per person.`,
      match.description,
      `You can see it under ${match.categoryTitle} (/activities/${match.categorySlug}) and book here: ${match.bookingUrl}`,
      "Prices are as listed on our website and can change, so the booking page will confirm the final amount.",
    ].join("\n");
  }

  const text = normalise(query);
  const sorted = [...allActivities].sort((a, b) => a.price - b.price);
  if (/(cheap|budget|affordable|least|lowest)/.test(text)) {
    return [
      "These are the lowest-priced activities we list:",
      "",
      ...sorted.slice(0, 5).map((activity) => `• ${activity.name} — US$${activity.price}`),
      "",
      "All prices are per person and shown on each activity's booking page.",
    ].join("\n");
  }
  if (/(expensive|premium|luxury|luxurious|high end|top end)/.test(text)) {
    return [
      "Our most premium experiences are:",
      "",
      ...sorted.slice(-5).reverse().map((activity) => `• ${activity.name} — US$${activity.price}`),
      "",
      "All prices are per person and shown on each activity's booking page.",
    ].join("\n");
  }

  return [
    "Our activity prices are in US dollars, per person. A few examples:",
    "",
    ...resolvedFavourites.slice(0, 3).map((favourite) => `• ${favourite.activity} — US$${favourite.price}`),
    "",
    "Tell me a specific activity and I'll give you its exact price, or browse all prices at /activities.",
  ].join("\n");
}

/**
 * Deterministic, fully offline answer engine. It only ever quotes data that is
 * defined in the website's own content files, so it cannot invent or mislead.
 */
export function offlineAnswer(question: string): string {
  const text = normalise(question);
  const tokens = tokenise(question);

  if (!text) {
    return "What would you like to know? I can help with activities and prices, things to do in Victoria Falls, rooms, transfers, the restaurant, or how to book.";
  }

  if (/^(hi|hey|hello|good (morning|afternoon|evening)|howzit|greetings|hiya)\b/.test(text)) {
    return [
      `Hello and welcome to ${siteConfig.name}! 🌿`,
      "I can help you plan your stay — activities and prices, the best experiences for your interests, rooms, transfers, our restaurant, or booking.",
      "What would you like to start with? If you're undecided, just say \"I'm not sure\" and I'll share our guest favourites.",
    ].join("\n");
  }

  const wantsRecommendation =
    /(best|recommend|suggest|unsure|not sure|no idea|don't know|dont know|decide|indecisive|popular|favourite|favorite|must do|must-do|must see|top pick|what should i|which should|which activity|which one|help me choose)/.test(text);

  const mentionsPrice =
    /(how much|\bprice|\bcosts?\b|\bfee\b|rate for|expensive|cheap|budget|affordable)/.test(text) || /us\$|\$/.test(text);

  const activityMatch = bestActivityMatch(question, tokens);

  // A specific activity was named alongside a price question.
  if (activityMatch && mentionsPrice) {
    return priceAnswer(question, tokens);
  }

  // Recommendation request, or the guest described an interest such as
  // "I love wildlife safaris" — either way, suggest guest favourites.
  if ((wantsRecommendation || guessInterests(question).length > 0) && !activityMatch) {
    return recommendFromFavourites(question);
  }

  if (/(transfer|airport|pick ?up|pickup|shuttle|taxi|border|kazungula|kasane)/.test(text)) {
    return [
      `${transfers.title}: ${transfers.description}`,
      "",
      ...transfers.groups.flatMap((group) => [
        `${group.title}:`,
        ...group.items.map((item) => `• ${item.name} — US$${item.price}`),
        "",
      ]),
      `To arrange a transfer, contact reservations: ${siteConfig.phoneDisplay.reservations} or ${siteConfig.email.reservations}.`,
    ].join("\n");
  }

  if (/(room|rooms|stay|sleep|accommodation|accomodation|bed|suite|check ?in|check ?out|lodge rooms)/.test(text)) {
    return [
      "Here are our rooms and nightly rates (US$, per night):",
      "",
      ...rooms.map((room) => `• ${room.name} — US$${room.price}\n   ${room.description}`),
      "",
      `Check-in ${siteConfig.hours.checkIn.toLowerCase()}, check-out ${siteConfig.hours.checkOut.toLowerCase()}. Front desk: ${siteConfig.hours.frontDesk}.`,
      `Book a room: ${siteConfig.bookingHref}`,
    ].join("\n");
  }

  if (/(restaurant|food|\beat\b|meal|menu|breakfast|lunch|dinner|drink|cocktail|wine|\bbar\b|dining|vegetarian|vegan)/.test(text)) {
    return [
      `The Shrub Restaurant: ${restaurantIntro.intro}`,
      restaurantIntro.body,
      "",
      "Popular dishes:",
      ...foodHighlights.slice(0, 4).map((dish) => `• ${dish.name} (${dish.category})`),
      "Drinks:",
      ...beverageHighlights.map((drink) => `• ${drink.name} — ${drink.tag}`),
      "",
      `See the full PDF menu: ${siteConfig.url}${restaurantIntro.menuHref}`,
      "To book a table, visit /contact.",
    ].join("\n");
  }

  if (/(contact|phone|call|email|address|located|location|where|directions|map|whatsapp|opening|hours|open\b)/.test(text)) {
    return [
      `${siteConfig.name} is at ${siteConfig.address.full}.`,
      `Reservations: ${siteConfig.phoneDisplay.reservations} · ${siteConfig.email.reservations}`,
      `Reception: ${siteConfig.phoneDisplay.reception}`,
      `Tours & activities: ${siteConfig.email.tours}`,
      `Front desk hours: ${siteConfig.hours.frontDesk}. Check-in ${siteConfig.hours.checkIn.toLowerCase()}, check-out ${siteConfig.hours.checkOut.toLowerCase()}.`,
      "You can also send a message from /contact.",
    ].join("\n");
  }

  if (/password/.test(text)) {
    return [
      "I don't have the Wi-Fi password here, but reception will give it to you when you arrive.",
      "Wi-Fi is available throughout the lodge.",
      `Reception: ${siteConfig.phoneDisplay.reception}.`,
    ].join("\n");
  }

  if (/(amenit|facilit|pool|wifi|wi-fi|air ?con|air condition|tv|laundry|garden)/.test(text)) {
    return [
      `Our amenities include: ${amenities.map((item) => item.label).join(", ")}.`,
      "Rooms have ensuite bathrooms, air conditioning and DSTV, and the lodge has a sparkling outdoor pool.",
    ].join("\n");
  }

  if (/(book|booking|reserve|reservation|pay|payment|deposit)/.test(text)) {
    return [
      "Booking is easy:",
      `• Rooms: book online at ${siteConfig.bookingHref}`,
      "• Activities: open any activity at /activities and use its \"Book Now\" link, or ask us to arrange it.",
      `• Questions or a custom itinerary: ${siteConfig.email.reservations} · ${siteConfig.phoneDisplay.reservations}`,
    ].join("\n");
  }

  if (/(activit|things to do|what can i do|experience|tour|trip|excursion|do here|offer)/.test(text)) {
    return [
      "We arrange activities across eight areas:",
      "",
      ...categoriesOverview(),
      "",
      "Tell me your interests and I'll recommend something, or browse all activities at /activities.",
    ].join("\n");
  }

  // Generic pricing questions (cheapest, most expensive, or examples).
  if (mentionsPrice) {
    return priceAnswer(question, tokens);
  }

  // A specific activity was named without a price question.
  if (activityMatch) {
    return [
      `Here's what I have on ${activityMatch.name}:`,
      "",
      activityLine(activityMatch),
      "",
      `Want me to suggest similar options in ${activityMatch.categoryTitle}?`,
    ].join("\n");
  }

  return [
    "I'm not sure I have that on hand, and I'd rather not guess.",
    `I can help with: activities and prices, activity recommendations, rooms and rates, transfers, the restaurant, or contact details.`,
    `For anything else, our team can help directly — ${siteConfig.email.reservations} or ${siteConfig.phoneDisplay.reservations}.`,
  ].join("\n");
}

function categoriesOverview(): string[] {
  const unique = new Map<string, { title: string; href: string }>();
  for (const activity of allActivities) {
    if (!unique.has(activity.categorySlug)) {
      unique.set(activity.categorySlug, {
        title: activity.categoryTitle,
        href: `/activities/${activity.categorySlug}`,
      });
    }
  }
  return [...unique.values()].map(({ title, href }) => `• ${title} → ${href}`);
}
