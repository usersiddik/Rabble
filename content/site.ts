/**
 * Site-wide brand facts and copy. Components read from here — never hardcode.
 */

export const site = {
  name: "RABBLE",
  tagline: "Noise you can wear",
  description:
    "RABBLE is a front-and-back print label from India. Small batches, heavyweight cotton, one run per print. Designed in India for the loud majority.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rabble.in",
  locale: "en_IN",
  founded: 2026,
  city: "Bengaluru",
  email: "hello@rabble.in",
  instagram: { handle: "@rabble.in", url: "https://instagram.com/rabble.in" },
  whatsapp: { display: "+91 98765 43210", url: "https://wa.me/919876543210" },
  /** placeholder until registration completes */
  gstin: "29AAAAA0000A1Z5",
  legalName: "Rabble Apparel LLP",
  address: "Studio 4, 2nd Floor, Indiranagar, Bengaluru 560038, Karnataka, India",
  freeShippingOver: 1999,
  returnsWindowDays: 14,
  deliveryMetroDays: "2–4",
  deliveryRestDays: "4–7",
  payments: ["UPI", "Cards", "Netbanking", "COD"] as const,
} as const;

export const ticker = [
  "Drop 01 is live",
  "Front & back prints only",
  "One run per print — no restocks",
  "UPI · Cards · COD",
  "Free shipping over ₹1,999",
  "Designed in India",
];

export const nav = {
  primary: [
    { href: "/men", label: "Men" },
    { href: "/women", label: "Women" },
    { href: "/new-arrivals", label: "New" },
    { href: "/drop", label: "Drop 02" },
  ],
  secondary: [
    { href: "/lookbook", label: "Lookbook" },
    { href: "/about", label: "About" },
  ],
} as const;

export const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "Men", href: "/men" },
      { label: "Women", href: "/women" },
      { label: "New arrivals", href: "/new-arrivals" },
      { label: "Drop 02 — waitlist", href: "/drop" },
      { label: "Your bag", href: "/bag" },
    ],
  },
  {
    title: "Brand",
    links: [
      { label: "The manifesto", href: "/about" },
      { label: "Lookbook", href: "/lookbook" },
      { label: "Style guide", href: "/brand" },
      { label: "Instagram", href: "https://instagram.com/rabble.in" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping & returns", href: "/shipping-returns" },
      { label: "Exchanges", href: "/exchanges" },
      { label: "Size help", href: "/size-help" },
      { label: "FAQ", href: "/faq" },
      { label: "WhatsApp us", href: "https://wa.me/919876543210" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;

/** One brand voice, two registers. Used by /brand to show the rule, and by copywriters to keep it. */
export const voice = {
  prints: {
    name: "Punchy",
    rule: "Short. Declarative. A little cocky. Three to eight words, no adjectives that don't earn their keep.",
    examples: ["Noise you can wear.", "Front says hello. Back says goodbye.", "One run. Then it's gone."],
  },
  boutique: {
    name: "Editorial",
    rule: "Longer sentences, specific nouns, numbers where they matter. Warm, not precious. Never 'curated'.",
    examples: [
      "Every piece is printed in a single run of a few hundred. When the ink is used up, the artwork is retired.",
      "We ship from Bengaluru to every pincode India Post reaches. UPI, cards, or cash at the door.",
    ],
  },
} as const;
