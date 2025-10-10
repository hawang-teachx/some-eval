export type TransactionStatus = "pending" | "posted" | "cancelled";
export type TransactionType = "debit" | "credit";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  status: TransactionStatus;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

