import type { Transaction } from "../types";

export const transactions: Transaction[] = [
  {
    id: "tx-1",
    description: "Groceries at FreshMart",
    amount: 125.48,
    type: "debit",
    category: "Groceries",
    status: "posted",
    date: "2025-09-05",
  },
  {
    id: "tx-2",
    description: "Flight Booking",
    amount: 489.99,
    type: "debit",
    category: "Travel",
    status: "pending",
    date: "2025-09-08",
  },
  {
    id: "tx-3",
    description: "Cashback Reward",
    amount: 45.0,
    type: "credit",
    category: "Rewards",
    status: "posted",
    date: "2025-09-10",
  },
];

