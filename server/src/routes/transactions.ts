import { Router } from "express";
import { z } from "zod";
import { transactions } from "../data/transactions";
import type { Transaction } from "../types";

const router = Router();

const transactionSchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  type: z.enum(["debit", "credit"]),
  category: z.string().min(1),
  status: z.enum(["pending", "posted", "cancelled"]),
  date: z.string(),
});

const transactionUpdateSchema = transactionSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
);

router.get("/", (_req, res) => {
  res.json({ data: transactions });
});

router.get("/:id", (req, res) => {
  const txn = transactions.find((t) => t.id === req.params.id);
  if (!txn) {
    return res.status(404).json({ error: "Transaction not found" });
  }
  res.json({ data: txn });
});

router.post("/", (req, res) => {
  const parseResult = transactionSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const id = `tx-${Date.now().toString(36)}`;
  const timestamp = new Date().toISOString();
  const newTransaction: Transaction = {
    id,
    ...parseResult.data,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  transactions.unshift(newTransaction);
  res.status(201).json({ data: newTransaction });
});

router.put("/:id", (req, res) => {
  const parseResult = transactionSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const index = transactions.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  const updated: Transaction = {
    ...transactions[index],
    ...parseResult.data,
    updatedAt: new Date().toISOString(),
  };

  transactions[index] = updated;
  res.json({ data: updated });
});

router.patch("/:id", (req, res) => {
  const parseResult = transactionUpdateSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const index = transactions.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  const updated: Transaction = {
    ...transactions[index],
    ...parseResult.data,
    updatedAt: new Date().toISOString(),
  };

  transactions[index] = updated;
  res.json({ data: updated });
});

router.delete("/:id", (req, res) => {
  const index = transactions.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  const [deleted] = transactions.splice(index, 1);
  res.json({ data: deleted });
});

export default router;

