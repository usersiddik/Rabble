/**
 * Trust, help and legal copy. Brand voice: editorial register, plain English, specific numbers.
 */

export interface HelpSection {
  title: string;
  body: string[];
  list?: string[];
}

export interface HelpPage {
  slug: string;
  title: string;
  kicker: string;
  lede: string;
  sections: HelpSection[];
  updated: string;
}

export const helpPages: HelpPage[] = [
  {
    slug: "shipping-returns",
    title: "Shipping & returns",
    kicker: "Help",
    lede: "From a studio in Bengaluru to every pincode India Post reaches. No surprises at checkout, no interrogation at returns.",
    updated: "2026-11-01",
    sections: [
      {
        title: "Where we ship",
        body: ["All of India, every pincode. We don't ship internationally yet — if you're abroad and determined, write to us and we'll figure something out."],
      },
      {
        title: "How long it takes",
        body: ["Orders placed before 2 p.m. IST leave the studio the same working day."],
        list: [
          "Metros (Bengaluru, Mumbai, Delhi NCR, Chennai, Hyderabad, Kolkata, Pune): 2–4 working days",
          "Everywhere else: 4–7 working days",
          "North-east and remote pincodes: up to 10 working days",
        ],
      },
      {
        title: "What it costs",
        body: ["Free on orders over ₹1,999. Below that, a flat ₹99. Cash on delivery adds ₹49 for the courier's handling — it's their fee, not ours."],
      },
      {
        title: "Returns",
        body: [
          "14 days from delivery, no questions beyond 'what went wrong'. Tags on, unworn, unwashed. We'll arrange the pickup; refunds go back to the original payment method within 5–7 working days of the piece reaching us. COD orders are refunded to a UPI ID of your choice.",
          "One-run prints marked 'final run' in the last 48 hours of availability are exchange-only, since there's nothing left to put them back into.",
        ],
      },
    ],
  },
  {
    slug: "exchanges",
    title: "Exchanges",
    kicker: "Help",
    lede: "Wrong size happens. We make it a two-message conversation, not a ticket.",
    updated: "2026-11-01",
    sections: [
      {
        title: "How to exchange",
        body: ["WhatsApp us the order number and the size you need within 14 days of delivery. We'll confirm stock, book a reverse pickup, and dispatch the new size the day the old one is scanned by the courier."],
      },
      {
        title: "If the size is gone",
        body: ["Runs are small, so sometimes the size you need has sold through. In that case we'll offer a different piece at the same price or a full refund — your call."],
      },
      {
        title: "Limits",
        body: ["One exchange per order. Pieces must be unworn and unwashed with tags attached. Bombers and truckers must still have the hang tag threaded through the zip pull."],
      },
    ],
  },
  {
    slug: "size-help",
    title: "Size help",
    kicker: "Help",
    lede: "Our cuts run roomy on purpose. Size down for neat, up for loud.",
    updated: "2026-11-01",
    sections: [
      {
        title: "How to measure",
        body: ["Lay a tee you already love flat and measure across the chest, armpit to armpit, then double it. Compare that to the garment chest below, not your body measurement — it's more honest."],
      },
      {
        title: "By garment",
        body: [],
        list: [
          "Tees: boxy, slightly cropped. True to size. If you like a longer hem, size up.",
          "Crews and hoods: relaxed with a dropped shoulder. Size down if you want it close to the body.",
          "Crop hoods: cut to hit at the waistband. True to size.",
          "Truckers: classic cut, squared shoulder. Size up to layer over knits.",
          "Bombers: cropped at the hip, full through the body. True to size.",
        ],
      },
      {
        title: "Still unsure",
        body: ["Send us your height, usual tee size and how you like things to sit. We'll tell you straight — including when a piece just isn't going to work for you."],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    kicker: "Legal",
    lede: "We collect what we need to ship a parcel and send a drop reminder. That's the list.",
    updated: "2026-11-01",
    sections: [
      {
        title: "What we collect",
        body: [],
        list: [
          "Your name, delivery address, phone number and email when you order.",
          "Your email alone if you join the drop waitlist.",
          "A bag stored in your own browser so it survives a refresh. It never leaves your device.",
        ],
      },
      {
        title: "What we do with it",
        body: ["Ship your order, answer your messages, and email you when a drop opens. We don't sell, rent or swap your details with anyone. Payment details are handled by our payment partner and never touch our servers."],
      },
      {
        title: "Your rights",
        body: ["Ask us what we hold, ask us to correct it, or ask us to delete it. One email to hello@rabble.in does any of the three. Unsubscribe links are in every email we send."],
      },
      {
        title: "Cookies",
        body: ["None for tracking. The site uses local storage for your bag and nothing else."],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms",
    kicker: "Legal",
    lede: "The short version: we sell you a garment, you pay for it, both of us are reasonable about it.",
    updated: "2026-11-01",
    sections: [
      {
        title: "Who we are",
        body: ["Rabble Apparel LLP, Bengaluru, Karnataka. GSTIN on every invoice. Prices on the site are in Indian Rupees and inclusive of GST."],
      },
      {
        title: "Orders",
        body: ["An order is confirmed when you receive the confirmation email. We can cancel an order before dispatch if a piece is unavailable or a price was clearly wrong; you get a full refund either way. Runs are limited and allocated in order of payment."],
      },
      {
        title: "Waitlists",
        body: ["Joining a waitlist reserves nothing. It gets you the link early. Pieces are sold first-come, first-served when the drop opens."],
      },
      {
        title: "Artwork",
        body: ["Prints and the Rabble wordmark are ours. Wear them, photograph them, post them. Don't reprint them."],
      },
      {
        title: "Disputes",
        body: ["Talk to us first. If that fails, courts in Bengaluru have jurisdiction, and Indian law applies."],
      },
    ],
  },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const faq: { group: string; items: FaqItem[] }[] = [
  {
    group: "Drops",
    items: [
      { q: "What is a drop?", a: "A chapter of pieces released together, each printed once. Drop 01 is live now. Drop 02 lands 12 December." },
      { q: "Will you restock?", a: "No. When a print sells through, the screens are destroyed and the artwork retires. New drops bring new artwork." },
      { q: "What does the waitlist actually get me?", a: "The link an hour before the public, and a heads-up when a piece you asked about is down to its last sizes." },
    ],
  },
  {
    group: "Payment",
    items: [
      { q: "Do you take UPI?", a: "Yes — UPI, cards, netbanking and cash on delivery. COD adds ₹49 for the courier's handling." },
      { q: "Are prices inclusive of GST?", a: "Yes. The price you see is the price you pay. A GST invoice comes with every order." },
      { q: "Can I pay in instalments?", a: "Not yet. We're keeping the prices low enough that you shouldn't need to." },
    ],
  },
  {
    group: "The garments",
    items: [
      { q: "Why front and back?", a: "Because a garment is seen from behind for most of its life. Small signal on the chest, big broadcast on the back." },
      { q: "How do I wash a printed piece?", a: "Cold, inside out, line dry. No tumble dryer, no iron on the ink. Water-based prints soften and crack a little with age — that's the point." },
      { q: "Will the ink fade?", a: "Water-based ink sinks into the cotton; it mellows rather than peels. Plastisol on the jackets stays sharp for years." },
    ],
  },
  {
    group: "Orders",
    items: [
      { q: "Can I change my address after ordering?", a: "Before dispatch, yes — WhatsApp us. After dispatch, we'll try, but couriers are couriers." },
      { q: "Do you ship outside India?", a: "Not yet. Write to us if you're determined." },
      { q: "How do I reach a human?", a: "WhatsApp or email, 10 a.m. to 7 p.m. IST, Monday to Saturday. The person replying has handled the piece you're asking about." },
    ],
  },
];

export function getHelpPage(slug: string): HelpPage | undefined {
  return helpPages.find((p) => p.slug === slug);
}
