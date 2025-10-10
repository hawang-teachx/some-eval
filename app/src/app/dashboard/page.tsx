import { CardCarousel } from "@/components/dashboard/card-carousel";
import { CreditUtilization } from "@/components/dashboard/credit-utilization";
import { TopSummary } from "@/components/top-summary";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <TopSummary />
      <div className="flex flex-col">
        <CardCarousel />
        <CreditUtilization />
      </div>
    </div>
  );
}

