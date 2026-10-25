export const STAGES = [
  "open",
  "working",
  "waiting_pay",
  "done",
  "problem",
] as const;

export type Stage = (typeof STAGES)[number];

export const STAGE_META: Record<Stage, { short: string }> = {
  open: { short: "New" },
  working: { short: "Working on it" },
  waiting_pay: { short: "Waiting for pay" },
  done: { short: "Done" },
  problem: { short: "Needs help" },
};

export type Booking = {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  passengers: string;
  price: string;
  stage: Stage;
  notes: string;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
};
