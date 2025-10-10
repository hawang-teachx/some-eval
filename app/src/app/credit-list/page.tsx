import { CardGrid } from "@/components/card-grid";
import { SummaryCards } from "@/components/summary-cards";

export default function CreditListPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1c1d23]">Credit Card Management</h1>
          <p className="text-sm text-[#a3a6b4]">
            Manage all your credit cards in one place
          </p>
        </div>
        <button className="rounded-full bg-[#f0434a] px-5 py-3 text-sm font-semibold text-white shadow hover:bg-[#d93b40]">
          + Apply for New Card
        </button>
      </header>

      <CardGrid />
      <SummaryCards />
    </div>
  );
}

