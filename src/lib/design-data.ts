export type WalkStepId =
  | "intro"
  | "desk"
  | "new-caller"
  | "booking"
  | "search"
  | "feedback"
  | "signoff";

export type WalkStep = {
  id: WalkStepId;
  number: number;
  title: string;
  ownerScript: string;
  whatToNotice: string[];
};

export const WALK_STEPS: WalkStep[] = [
  {
    id: "intro",
    number: 1,
    title: "How we’ll review this",
    ownerScript:
      "Hi Amira — this is a clickable design for your Princess Travel desk. We’ll walk screen by screen. Tell me what feels wrong, missing, or confusing.",
    whatToNotice: [
      "This is for you (the owner), not customers online.",
      "It works alongside Sabre Red — you paste quotes in by hand.",
      "Goal: stop relying on memory for names, numbers, and next steps.",
    ],
  },
  {
    id: "desk",
    number: 2,
    title: "Desk home",
    ownerScript:
      "This is your main screen after a WhatsApp or phone call. You can search by name or number, filter by stage, and see what needs action.",
    whatToNotice: [
      "Search bar for phone / name",
      "Stage chips (Inquiry, Quoting, Payment…)",
      "Each row shows route, quote, and next action",
    ],
  },
  {
    id: "new-caller",
    number: 3,
    title: "New caller",
    ownerScript:
      "When someone new texts you, tap New caller. Save name and phone first so you can find them later — then add route and dates while you talk.",
    whatToNotice: [
      "Name + WhatsApp phone required",
      "From / to / dates optional while talking",
      "Notes for language or family size",
    ],
  },
  {
    id: "booking",
    number: 4,
    title: "Booking detail",
    ownerScript:
      "Open any booking to update Sabre quote, travelers, payment, and the pre-travel checklist. Tap a stage pill to move the booking forward.",
    whatToNotice: [
      "Stage pills match your real workflow",
      "Sabre fields: airline, class, total",
      "Checklist for email forward, passport, visa",
    ],
  },
  {
    id: "search",
    number: 5,
    title: "Find by phone",
    ownerScript:
      "Someone calls back and you don’t remember the number? Type it here — the desk jumps to their booking and next action.",
    whatToNotice: [
      "Phone search is the main fix for the memory bottleneck",
      "Needs action filter shows only open follow-ups",
    ],
  },
  {
    id: "feedback",
    number: 6,
    title: "Your feedback",
    ownerScript:
      "What should we change? Bigger text? Arabic labels? Fewer stages? Type notes here so Samuel can revise the design.",
    whatToNotice: [
      "Write likes, dislikes, and must-have changes",
      "Samuel revises until you’re happy",
    ],
  },
  {
    id: "signoff",
    number: 7,
    title: "Owner sign-off",
    ownerScript:
      "When the design feels right, add your name and date below. That matches the UI Design Worksheet approval.",
    whatToNotice: [
      "Confirms the design meets Princess Travel’s needs",
      "You can still ask for changes later before building",
    ],
  },
];

export type SampleBooking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  language: string;
  from: string;
  to: string;
  depart: string;
  returnDate: string;
  airline: string;
  cabin: string;
  quote: string;
  stage: string;
  nextAction: string;
  tripType: "Domestic" | "International";
  payment: string;
  travelers: { name: string; dob: string; doc: string }[];
  checklist: { label: string; done: boolean }[];
  notes: string;
};

export const SAMPLE_BOOKINGS: SampleBooking[] = [
  {
    id: "1",
    name: "Hassan Farouk",
    phone: "(773) 555-0142",
    email: "hassan.f@email.com",
    language: "Arabic",
    from: "ORD",
    to: "CAI",
    depart: "Nov 12, 2026",
    returnDate: "Dec 3, 2026",
    airline: "EgyptAir",
    cabin: "Economy",
    quote: "$1,180",
    stage: "Payment",
    nextAction: "Collect payment in person Saturday afternoon",
    tripType: "International",
    payment: "Unpaid",
    travelers: [
      { name: "Hassan Farouk", dob: "Mar 11, 1984", doc: "A12345678" },
      { name: "Nour Farouk", dob: "Aug 22, 1987", doc: "A87654321" },
    ],
    checklist: [
      { label: "Confirmation email forwarded", done: false },
      { label: "Customer notified of next steps", done: true },
      { label: "Passport / ID reviewed", done: true },
      { label: "Visa / entry rules checked", done: false },
    ],
    notes: "Prefers WhatsApp. Quoted two EgyptAir options in Sabre.",
  },
  {
    id: "2",
    name: "Layla Mansour",
    phone: "(312) 555-0198",
    email: "",
    language: "Arabic",
    from: "MDW",
    to: "LAX",
    depart: "Oct 28, 2026",
    returnDate: "—",
    airline: "—",
    cabin: "—",
    quote: "—",
    stage: "Inquiry",
    nextAction: "Confirm flexible dates, then price in Sabre",
    tripType: "Domestic",
    payment: "Unpaid",
    travelers: [],
    checklist: [
      { label: "Confirmation email forwarded", done: false },
      { label: "Customer notified of next steps", done: false },
      { label: "Passport / ID reviewed", done: false },
      { label: "Visa / entry rules checked", done: false },
    ],
    notes: "WhatsApp. One-way for daughter visiting university.",
  },
  {
    id: "3",
    name: "Omar Khalil",
    phone: "(708) 555-0111",
    email: "omar.k@email.com",
    language: "English / Arabic",
    from: "ORD",
    to: "DXB",
    depart: "Dec 18, 2026",
    returnDate: "Jan 8, 2027",
    airline: "Emirates",
    cabin: "Business",
    quote: "$4,200",
    stage: "Pre-travel",
    nextAction: "Call to confirm visa plan",
    tripType: "International",
    payment: "Paid by phone",
    travelers: [
      { name: "Omar Khalil", dob: "Jan 5, 1979", doc: "X99887766" },
    ],
    checklist: [
      { label: "Confirmation email forwarded", done: true },
      { label: "Customer notified of next steps", done: false },
      { label: "Passport / ID reviewed", done: true },
      { label: "Visa / entry rules checked", done: false },
    ],
    notes: "Ticket issued. Check UAE entry rules.",
  },
  {
    id: "4",
    name: "Samira Haddad",
    phone: "(847) 555-0166",
    email: "samira.h@email.com",
    language: "Arabic",
    from: "ORD",
    to: "JFK",
    depart: "Oct 15, 2026",
    returnDate: "Oct 20, 2026",
    airline: "United",
    cabin: "Economy",
    quote: "$340",
    stage: "Support",
    nextAction: "Rebook missed Newark connection — text WhatsApp update",
    tripType: "Domestic",
    payment: "Paid in person",
    travelers: [
      { name: "Samira Haddad", dob: "Jun 30, 1992", doc: "IL-D-445566" },
    ],
    checklist: [
      { label: "Confirmation email forwarded", done: true },
      { label: "Customer notified of next steps", done: true },
      { label: "Passport / ID reviewed", done: true },
      { label: "Visa / entry rules checked", done: false },
    ],
    notes: "Missed connecting flight in Newark.",
  },
];

export const STAGES = [
  "Inquiry",
  "Quoting",
  "Travelers",
  "Payment",
  "Ticketed",
  "Pre-travel",
  "Support",
] as const;

export const FEEDBACK_KEY = "princess-travel-ui-feedback-v1";
export const SIGNOFF_KEY = "princess-travel-ui-signoff-v1";
