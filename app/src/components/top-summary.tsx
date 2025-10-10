import { ArrowDownRight, ArrowUpRight, CreditCard } from "lucide-react";

type Metric = {
  label: string;
  value: string;
  trend: string;
  trendPositive?: boolean;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const metrics: Metric[] = [
  {
    label: "Total Credit Limit",
    value: "$15,000",
    trend: "+2.1% Across all cards",
    trendPositive: true,
    icon: CreditCard,
  },
  {
    label: "Available Credit",
    value: "$12,341",
    trend: "+5.2% Ready to use",
    trendPositive: true,
    icon: ArrowUpRight,
  },
  {
    label: "Monthly Spending",
    value: "$2,659",
    trend: "-12.5% This month",
    trendPositive: false,
    icon: ArrowDownRight,
  },
  {
    label: "Rewards Earned",
    value: "2,847",
    trend: "+18.2% Points this month",
    trendPositive: true,
    icon: ArrowUpRight,
  },
];

export function TopSummary() {
  return (
    <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ label, value, trend, trendPositive, icon: Icon }) => (
        <div
          key={label}
          className="flex items-start gap-4 rounded-3xl bg-white p-5 shadow-[0_20px_60px_-40px_rgba(234,80,88,0.7)] justify-between"
        >
          <div>
            <p className="text-sm text-[#a3a6b4]">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-[#1c1d23]">{value}</p>
            <p
              className="mt-2 text-xs font-medium"
              style={{ color: trendPositive === false ? "#e0546a" : "#1db05b" }}
            >
              {trend}
            </p>
          </div>
          <div className="h-full flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffe5e8] text-[#f0434a]">
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

