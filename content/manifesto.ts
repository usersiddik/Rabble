/**
 * /about — the editorial long-form. Sections render in order.
 */

export interface ManifestoSection {
  id: string;
  kicker: string;
  title: string;
  /** paragraphs; **bold** is supported via <strong> in the renderer */
  body: string[];
  pullQuote?: string;
  /** garments to illustrate the section, by slug */
  pieces?: string[];
  tone?: "light" | "dark";
}

export const manifesto = {
  kicker: "The manifesto",
  title: "Noise you can wear.",
  lede: "Rabble, noun. A noisy crowd. The unruly many. Dictionaries mean it as an insult. We took it as a brief.",
  opening: [
    "We make clothes for people who show up in numbers — to courtyards, weddings, protests, basement gigs and 2 a.m. chai runs.",
    "No logos shouting over your face. No beige minimalism pretending to be a personality. No ₹40,000 hoodies.",
    "Heavyweight fabric, honest cuts, colours that commit. Printed front and back, in small runs, because scarcity should be real, not marketing.",
  ],
};

export const sections: ManifestoSection[] = [
  {
    id: "front-and-back",
    kicker: "01 — Why front & back",
    title: "Front says hello. Back says goodbye.",
    body: [
      "Most printed clothing is designed for a mirror. One graphic, dead centre, calibrated for a selfie. We think a garment is seen from behind for most of its life — on a bike, in a queue, walking away from an argument you won.",
      "So every Rabble piece carries two prints. A **signal on the chest**: small, specific, something you have to be close to read. And a **broadcast across the back**: large, legible from the next platform over.",
      "The two are never the same artwork at two sizes. The front is the question, the back is the answer.",
    ],
    pullQuote: "A garment is seen from behind for most of its life.",
    pieces: ["reprint-tee-01", "static-hoodie"],
  },
  {
    id: "boutique",
    kicker: "02 — Why boutique",
    title: "Small enough to mean it.",
    body: [
      "We print a few hundred of each piece. Not because small is a brand strategy, but because it's the honest limit of doing it properly: one screen-printing studio in Bengaluru, water-based inks, a proof approved by hand for every colourway.",
      "When a run sells through, the screens are destroyed and the artwork is retired. That's not a countdown gimmick. It's what happens when you don't own a warehouse.",
      "Boutique also means you can reach us. The person answering WhatsApp has handled the garment you're asking about.",
    ],
    pullQuote: "When the ink runs out, the artwork retires.",
    pieces: ["oat-crew", "loud-minority-crew"],
    tone: "dark",
  },
  {
    id: "india-first",
    kicker: "03 — India first",
    title: "Built for this weather. Priced for this wallet.",
    body: [
      "Designed and printed in India, for Indian summers, monsoon commutes and air-conditioned offices that run two degrees too cold. 240 GSM cotton that holds its shape past wash fifty. 450 GSM fleece for the three weeks a year you need it.",
      "**UPI, cards, netbanking or cash at the door.** Pan-India shipping from Bengaluru to every pincode India Post reaches — metros in two to four days, everywhere else in four to seven. Free over ₹1,999.",
      "Prices are inclusive of GST, and they're the same whether you're in Indiranagar or Imphal.",
    ],
    pullQuote: "The same price in Indiranagar and Imphal.",
    pieces: ["sunstrike-crop-hood", "open-invite-tee"],
  },
];

export const founderNote = {
  kicker: "A note from the founder",
  body: [
    "I started Rabble because every tee I loved had a graphic on the front and nothing to say on the way out. I wanted the walk-away to be the point.",
    "We're small. There are three of us, one studio, and a printer who argues with us about ink coverage. We'd rather make ten things properly than a hundred things that end up in a sale bin.",
    "If you're reading this before Drop 02 lands: thank you for finding us early. Join the waitlist, tell someone loud, and wear the back print like you mean it.",
  ],
  signature: "Sid, founder",
  location: "Bengaluru, November 2026",
};

export const facts = [
  { title: "One run", body: "A few hundred pieces per print. Sold out means retired." },
  { title: "Front & back", body: "Two prints on every piece. The question and the answer." },
  { title: "India first", body: "UPI, COD, pan-India shipping. Prices inclusive of GST." },
  { title: "Heavyweight", body: "240 GSM tees, 450 GSM fleece. Wash tests before vibe tests." },
];
