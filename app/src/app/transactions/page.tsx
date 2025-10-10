"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PenSquare, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const transactionSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  amount: z.number({ coerce: true }).positive("Amount must be positive"),
  type: z.enum(["debit", "credit"], { required_error: "Type is required" }),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["pending", "posted", "cancelled"], {
    required_error: "Status is required",
  }),
  date: z.string().min(1, "Date is required"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

type Transaction = TransactionFormValues & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "debit",
      category: "",
      status: "pending",
      date: new Date().toISOString().slice(0, 10),
    },
  });

  useEffect(() => {
    void fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      const res = await fetch(`${API_URL}/transactions`);
      if (!res.ok) {
        throw new Error("Failed to load transactions");
      }
      const data = (await res.json()) as { data: Transaction[] };
      setTransactions(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    }
  }

  function onEdit(transaction: Transaction) {
    setSelectedTransaction(transaction);
    form.reset({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      status: transaction.status,
      date: transaction.date,
    });
  }

  function resetForm() {
    form.reset({
      description: "",
      amount: 0,
      type: "debit",
      category: "",
      status: "pending",
      date: new Date().toISOString().slice(0, 10),
    });
    setSelectedTransaction(null);
  }

  async function onSubmit(values: TransactionFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      const { id, ...payload } = values;
      const method = id ? "PATCH" : "POST";
      const url = id ? `${API_URL}/transactions/${id}` : `${API_URL}/transactions`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save transaction");
      }

      const data = (await res.json()) as { data: Transaction };

      if (id) {
        setTransactions((prev) => prev.map((tx) => (tx.id === id ? data.data : tx)));
      } else {
        setTransactions((prev) => [data.data, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete transaction");
      }
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      if (selectedTransaction?.id === id) {
        resetForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1c1d23]">Transactions</h1>
          <p className="text-sm text-[#a3a6b4]">
            Create, update, and manage all card transactions
          </p>
        </div>
        <button
          onClick={resetForm}
          className="flex items-center gap-2 rounded-full bg-[#f0434a] px-5 py-3 text-sm font-semibold text-white shadow hover:bg-[#d93b40]"
        >
          <Plus className="h-4 w-4" /> New Transaction
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_-40px_rgba(234,80,88,0.7)]"
        >
          <h2 className="text-lg font-semibold text-[#1c1d23]">
            {selectedTransaction ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <div className="mt-4 space-y-4">
            <Field label="Description" error={form.formState.errors.description?.message}>
              <input
                type="text"
                {...form.register("description")}
                className="w-full rounded-2xl border border-[#ffe5e8] bg-[#fff7f8] px-4 py-3 text-sm text-[#1c1d23] focus:border-[#f0434a] focus:outline-none"
                placeholder="e.g. Grocery shopping"
              />
            </Field>

            <Field label="Amount" error={form.formState.errors.amount?.message}>
              <input
                type="number"
                step="0.01"
                {...form.register("amount", { valueAsNumber: true })}
                className="w-full rounded-2xl border border-[#ffe5e8] bg-[#fff7f8] px-4 py-3 text-sm text-[#1c1d23] focus:border-[#f0434a] focus:outline-none"
                placeholder="0.00"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Type" error={form.formState.errors.type?.message}>
                <select
                  {...form.register("type")}
                  className="w-full rounded-2xl border border-[#ffe5e8] bg-[#fff7f8] px-4 py-3 text-sm text-[#1c1d23] focus:border-[#f0434a] focus:outline-none"
                >
                  <option value="debit">Debit</option>
                  <option value="credit">Credit</option>
                </select>
              </Field>

              <Field label="Category" error={form.formState.errors.category?.message}>
                <input
                  type="text"
                  {...form.register("category")}
                  className="w-full rounded-2xl border border-[#ffe5e8] bg-[#fff7f8] px-4 py-3 text-sm text-[#1c1d23] focus:border-[#f0434a] focus:outline-none"
                  placeholder="e.g. Travel"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Status" error={form.formState.errors.status?.message}>
                <select
                  {...form.register("status")}
                  className="w-full rounded-2xl border border-[#ffe5e8] bg-[#fff7f8] px-4 py-3 text-sm text-[#1c1d23] focus:border-[#f0434a] focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="posted">Posted</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </Field>

              <Field label="Date" error={form.formState.errors.date?.message}>
                <input
                  type="date"
                  {...form.register("date")}
                  className="w-full rounded-2xl border border-[#ffe5e8] bg-[#fff7f8] px-4 py-3 text-sm text-[#1c1d23] focus:border-[#f0434a] focus:outline-none"
                />
              </Field>
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-[#d9534f]">{error}</p> : null}

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-full bg-[#f0434a] py-3 text-sm font-semibold text-white shadow hover:bg-[#d93b40] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : selectedTransaction ? "Update" : "Create"}
            </button>
            {selectedTransaction ? (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 rounded-full border border-[#ffe5e8] bg-white py-3 text-sm font-semibold text-[#f0434a] hover:bg-[#fff0f2]"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_-40px_rgba(234,80,88,0.7)]">
          <h2 className="text-lg font-semibold text-[#1c1d23]">Recent Transactions</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-[#ffe5e8]">
            <table className="min-w-full divide-y divide-[#ffe5e8]">
              <thead className="bg-[#fff0f2] text-left text-xs uppercase tracking-wide text-[#a3a6b4]">
                <tr>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ffe5e8] bg-white text-sm text-[#1c1d23]">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-[#fff7f8]">
                    <td className="px-4 py-3 font-medium text-[#1c1d23]">
                      {transaction.description}
                    </td>
                    <td className="px-4 py-3 text-[#555b66]">{transaction.category}</td>
                    <td className="px-4 py-3 capitalize text-[#555b66]">{transaction.type}</td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={statusStyles(transaction.status)}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#1c1d23]">
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-[#555b66]">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(transaction)}
                          className="rounded-full bg-[#fff0f2] p-2 text-[#f0434a] hover:bg-[#ffe5e8]"
                        >
                          <PenSquare className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(transaction.id)}
                          className="rounded-full bg-[#ffe5e8] p-2 text-[#f0434a] hover:bg-[#ffd0d4]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-sm text-[#a3a6b4]" colSpan={7}>
                      No transactions yet. Add a new one to get started.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-2 inline-block text-xs font-medium uppercase tracking-wide text-[#a3a6b4]">
        {label}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs text-[#d9534f]">{error}</span> : null}
    </label>
  );
}

function statusStyles(status: string): React.CSSProperties {
  switch (status) {
    case "posted":
      return { backgroundColor: "#e6f7ee", color: "#21b26f" };
    case "pending":
      return { backgroundColor: "#fff7e5", color: "#caa022" };
    case "cancelled":
      return { backgroundColor: "#ffe5e8", color: "#f0434a" };
    default:
      return {};
  }
}

