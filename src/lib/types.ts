export const STAGES = [
  "open",
  "working",
  "waiting_pay",
  "done",
  "problem",
] as const;

export type Stage = (typeof STAGES)[number];

/** Lower = higher in the caller list (needs Amira’s attention first). */
export const STAGE_LIST_PRIORITY: Record<Stage, number> = {
  waiting_pay: 0,
  open: 1,
  problem: 2,
  working: 3,
  done: 4,
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
