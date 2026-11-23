import type { Crop } from "@/lib/crop";

export const company = {
  name: "Christus Veritas Technologies",
  short: "CVT",
  meaning: "Christ is Truth",
  location: "Mutare, Zimbabwe",
  website: "christusveritastech.co.zw",
  whatsapp: "", // TODO: CVT WhatsApp number, e.g. "263770000000"
  bio: "Apps and websites that make your business look as big as it is. Built in Mutare, priced for Africa.",
  clients: ["WD Logistics", "Forest Creek"],
};

export const offer = {
  price: 100,
  normalPrice: 1200,
  spots: 5,
  spotsLeft: 5, // update as spots are claimed
  reason: "We're building our portfolio. That's the only catch.",
  facts: ["Up to 15 screens", "2 revisions", "Live in 10 days", "No hidden costs"],
  included: ["Up to 15 screens", "Custom design", "Full development", "2 rounds of revisions", "Live in 10 days", "No hidden costs"],
  payment: "$50 deposit once you approve your designs. $50 when your app goes live.",
};

export type Device = "iphone" | "galaxy";
export type AppEntry = {
  slug: string; name: string; type: "business" | "consumer"; tag: string; line: string; bg: string;
  crop: Crop; screens: { src: string; caption: string }[]; hero: Device;
};

const s = (dir: string, files: [string, string][]) => files.map(([f, caption]) => ({ src: `/portfolio/${dir}/${f}`, caption }));

export const apps: AppEntry[] = [
  { slug: "smm-pos", name: "SMM POS", type: "business", tag: "Business tool", line: "A till that never loses a sale.", bg: "#E8EEFF", hero: "galaxy", crop: { x: 283, y: 118, w: 514 },
    screens: s("pos", [["01-point-of-sale.png", "Point of sale, offline ready"], ["02-current-sale.png", "Current sale with every payment method"], ["03-sales-history.png", "Sales history and daily revenue"]]) },
  { slug: "visualform", name: "VisualForm", type: "business", tag: "Business tool", line: "A pro flyer from one sentence.", bg: "#E6F7FF", hero: "iphone", crop: { x: 286, y: 112, w: 508 },
    screens: s("visualform", [["visualform-1-landing.png", "Landing: one sentence in"], ["visualform-2-studio-chat.png", "Studio chat with four layouts"], ["visualform-3-my-brand.png", "Brand kit applied to every design"]]) },
  { slug: "iron-sets", name: "Iron Sets", type: "consumer", tag: "Consumer app", line: "Every set logged, every record tracked.", bg: "#15181C", hero: "galaxy", crop: { x: 279, y: 110, w: 522 },
    screens: s("iron-sets", [["iron-sets-01-home.png", "Home with streak and consistency"], ["iron-sets-02-active-set.png", "Active set with suggested weight"], ["iron-sets-03-progression.png", "Progression and personal records"]]) },
  { slug: "designvantage", name: "DesignVantage", type: "business", tag: "Business tool", line: "App Store screenshots in minutes.", bg: "#141414", hero: "iphone", crop: { x: 284, y: 114, w: 512 },
    screens: s("designvantage", [["designvantage-01-home.png", "Home with projects in progress"], ["designvantage-02-editor.png", "Slide editor"], ["designvantage-03-exports.png", "Export history and quota"]]) },
  { slug: "staticwave", name: "staticwave", type: "consumer", tag: "Consumer app", line: "Live radio from around the world.", bg: "#F1E9FF", hero: "galaxy", crop: { x: 301, y: 143, w: 478 },
    screens: s("staticwave", [["01-home.png", "Home with picks and recents"], ["02-player.png", "Now playing"], ["03-station-details.png", "Station details"]]) },
];

export const clientSystems = [
  { name: "WD Logistics", line: "Truck management system.", big: "Every truck, trip and driver in one system." },
  { name: "Forest Creek", line: "Lodge website and booking system.", big: "Guests find the lodge and book online." },
];

export const services = [
  { n: "01", slug: "mobile-apps", name: "Mobile apps", short: "Your business on every customer’s phone.", headline: "Your business on every customer’s phone.", body: "Android apps that let customers order, book and come back without calling you first.", points: ["Custom design for your brand", "Built for the phones your customers carry", "Up to 15 screens on the $100 offer", "Live in 10 days"], proof: "SMM POS · Iron Sets · staticwave", phones: ["iron-sets", "staticwave"] },
  { n: "02", slug: "websites", name: "Websites & web apps", short: "Look established the moment someone checks.", headline: "Look established the moment someone checks you out.", body: "Websites and web apps that turn a quick Google search into an enquiry or a booking.", points: ["Business websites", "Online booking systems", "Web apps and dashboards", "Fast on mobile data"], proof: "Forest Creek · lodge site and bookings", phones: [] },
  { n: "03", slug: "pos", name: "POS systems", short: "Know where every dollar went.", headline: "Know where every dollar went.", body: "A till that keeps selling offline and records every payment, from cash to EcoCash.", points: ["Works offline, syncs later", "Cash, EcoCash and OneMoney", "Stock counts and low-stock flags", "Daily sales and receipts"], proof: "SMM POS", phones: ["smm-pos", "smm-pos"] },
  { n: "04", slug: "custom", name: "Custom software", short: "Replace notebooks and spreadsheets.", headline: "Replace the notebooks and spreadsheets.", body: "Booking, fleet and admin systems built around how your business already works.", points: ["Fleet and trip management", "Booking and scheduling", "Admin dashboards and reports", "Built around your process"], proof: "WD Logistics · truck management", phones: [] },
] as const;

export const steps = [
  { n: 1, title: "Tell us your idea", body: "Fill in a short form about your business and the app you want." },
  { n: 2, title: "Approve your designs", body: "We design every screen. You approve, then pay the $50 deposit." },
  { n: 3, title: "We build it", body: "Full development, with 2 rounds of revisions along the way." },
  { n: 4, title: "You go live", body: "Your app is live in 10 days. Pay the final $50." },
];

export const faqs = [
  { q: "What's the catch?", a: "We're building our portfolio. The first 5 apps we build at this price become projects we show future clients. That's the only catch." },
  { q: "Are there hidden costs?", a: "No. $100 covers design and development of up to 15 screens, with 2 rounds of revisions, live in 10 days." },
  { q: "How do I pay?", a: "A $50 deposit once you approve your designs, and the remaining $50 when your app goes live. EcoCash, InnBucks, bank transfer or cash." },
  { q: "Will it work on my customers’ phones?", a: "We build Android apps, the phones most of your customers already carry." },
];

export const promises = [
  { big: "$0", title: "No hidden costs", body: "You see the full price before we start. What we quote is what you pay." },
  { big: "100%", title: "Real work, shown", body: "Every screen on this site is from an app we designed and built." },
  { big: "MUT", title: "Built in Mutare", body: "A local team you can call, message and meet. Not an overseas reseller." },
];

export const values = [
  { n: "01", title: "Honest pricing", body: "The price we quote is the price you pay. No surprises after the designs are approved." },
  { n: "02", title: "Real work", body: "We only show screens from apps we actually built, so you know exactly what you are getting." },
  { n: "03", title: "Built here", body: "Designed and built in Mutare by people who understand how Zimbabwean businesses run." },
];

export const smmCase = {
  title: "A till that never loses a sale.",
  intro: "A point of sale for phone and accessory shops. It runs on Android, keeps selling offline and takes every way Zimbabweans pay.",
  chips: ["Android", "Offline ready", "Cash · EcoCash · OneMoney"],
  meta: [["Type", "Point of sale"], ["Platform", "Android"], ["Payments", "Cash, EcoCash, OneMoney"], ["Works", "Online and offline"]],
  rows: [
    { n: "01", title: "Sell even when the internet drops.", body: "Every till works offline and syncs when the connection comes back, so a power cut or bad signal never stops a sale.", points: ["Products, stock counts and SKUs on one screen", "Low-stock flags before you run out", "Search by name or SKU"], screen: 0, bg: "#E8EEFF" },
    { n: "02", title: "Every way your customers pay.", body: "Cash in USD, EcoCash and OneMoney on one checkout, with the change worked out for you.", points: ["Quick cash amounts and change due", "Discounts applied at the till", "One tap to charge"], screen: 1, bg: "#EEF0F3" },
    { n: "03", title: "Know where every dollar went.", body: "Today's revenue, split by cash and mobile money, with every receipt numbered and listed.", points: ["Revenue compared with last week", "Sales, items sold and average sale", "Every transaction with its payment method"], screen: 2, bg: "#E6F7FF" },
  ],
};

export type Field =
  | { kind: "input"; key: string; label: string; ph: string; type?: string }
  | { kind: "area"; key: string; label: string; ph: string }
  | { kind: "cards" | "chips"; key: string; label: string; options: string[] };

export const claimSteps: { title: string; hint: string; fields: Field[] }[] = [
  { title: "About you", hint: "So we know who we are talking to.", fields: [
    { kind: "input", key: "name", label: "Full name", ph: "e.g. Tendai Moyo" },
    { kind: "input", key: "phone", label: "Phone (WhatsApp)", ph: "+263 77 000 0000", type: "tel" },
    { kind: "input", key: "email", label: "Email", ph: "you@business.co.zw", type: "email" },
    { kind: "cards", key: "owner", label: "Are you the owner or decision-maker?", options: ["Yes, I own the business", "Yes, I make the decisions", "No, I'm asking for someone else"] },
  ] },
  { title: "Your business", hint: "Tell us what you do and how long you have been at it.", fields: [
    { kind: "input", key: "business", label: "Business name", ph: "e.g. Mutare Hardware" },
    { kind: "input", key: "what", label: "What does it do, and where?", ph: "Hardware shop in Mutare CBD, sells building materials" },
    { kind: "chips", key: "years", label: "How long has it been running?", options: ["Under 6 months", "6–12 months", "1–3 years", "3+ years"] },
    { kind: "chips", key: "staff", label: "How many people work there?", options: ["Just me", "2–5", "6–20", "20+"] },
  ] },
  { title: "Your app", hint: "The more detail you give, the better we can judge the fit.", fields: [
    { kind: "area", key: "idea", label: "Describe the app you want", ph: "Who will use it, what they should be able to do, and anything you like in other apps." },
    { kind: "cards", key: "goal", label: "Main result you want", options: ["More sales or orders", "Less time on admin", "Track stock, sales and money", "Look more professional"] },
    { kind: "chips", key: "brand", label: "Do you have a logo and brand colours?", options: ["Yes", "No, I need help"] },
  ] },
  { title: "Deposit and timing", hint: "Last step. Be honest, it helps us pick the right 5.", fields: [
    { kind: "cards", key: "deposit", label: "Are you ready to pay the $50 deposit when you see your designs?", options: ["Yes, I'm ready", "I'd need more time", "No"] },
    { kind: "chips", key: "start", label: "When do you want to start?", options: ["This week", "Within 2 weeks", "Within a month", "Just looking"] },
    { kind: "chips", key: "pay", label: "How would you pay?", options: ["EcoCash", "InnBucks", "Bank transfer", "Cash (USD)"] },
  ] },
];
