export const STAGES = [
  "inquiry",
  "quoting",
  "travelers",
  "payment",
  "ticketed",
  "pretravel",
  "support",
] as const;

export type Stage = (typeof STAGES)[number];

export const STAGE_META: Record<
  Stage,
  { label: string; short: string; hint: string }
> = {
  inquiry: {
    label: "New inquiry",
    short: "Inquiry",
    hint: "Caller or WhatsApp — capture route & dates",
  },
  quoting: {
    label: "Quoting in Sabre",
    short: "Quoting",
    hint: "Look up airline, class, and price in Sabre Red",
  },
  travelers: {
    label: "Traveler details",
    short: "Travelers",
    hint: "Collect names and documents for each passenger",
  },
  payment: {
    label: "Awaiting payment",
    short: "Payment",
    hint: "Total shared by call/email — pay in person or by phone",
  },
  ticketed: {
    label: "Ticketed",
    short: "Ticketed",
    hint: "Paid — forward confirmation email to customer",
  },
  pretravel: {
    label: "Pre-travel checklist",
    short: "Pre-travel",
    hint: "Passport, visa, and other needs before departure",
  },
  support: {
    label: "Support / mishaps",
    short: "Support",
    hint: "Cancellations, missed flights, changes",
  },
};

export type TripType = "domestic" | "international";
export type PaymentMethod = "unpaid" | "in_person" | "phone";

export type Traveler = {
  id: string;
  fullName: string;
  dob: string;
  passportOrId: string;
  notes: string;
};

export type Booking = {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  language: string;
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  airline: string;
  cabinClass: string;
  quoteAmount: string;
  tripType: TripType;
  paymentMethod: PaymentMethod;
  stage: Stage;
  travelers: Traveler[];
  checklist: {
    confirmationEmailed: boolean;
    passportChecked: boolean;
    visaChecked: boolean;
    customerNotified: boolean;
  };
  notes: string;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
};
