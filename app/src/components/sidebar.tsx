"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  Home,
  LineChart,
  Menu,
  PiggyBank,
  Receipt,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/credit-list", label: "Credit List", icon: CreditCard },
  { href: "/loans", label: "Loans", icon: PiggyBank },
  { href: "/transactions", label: "Transactions", icon: Receipt },
  { href: "/command-center", label: "Command Center", icon: Menu },
  { href: "/reports", label: "Reports", icon: LineChart },
  { href: "/rewards", label: "Rewards", icon: Sparkles },
  { href: "/help", label: "Help", icon: ShieldCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[280px] flex-col bg-white p-6 shadow-[0_20px_60px_-40px_rgba(234,80,88,0.7)]">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f55d5d] text-white">
          <CreditCard className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-semibold text-[#1c1d23]">RedBank</p>
          <p className="text-sm text-[#a3a6b4]">Credit Management</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-[#ffe5e8] text-[#f0434a]"
                  : "text-[#555b66] hover:bg-[#fff0f2] hover:text-[#f0434a]"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#ffe1e5] via-white to-[#ffd9e0] p-4">
        <p className="mb-1 text-sm text-[#a3a6b4]">Account Summary</p>
        <div className="flex flex-col gap-2 text-sm">
          <SummaryRow label="Total Credit" value="$15,000" />
          <SummaryRow label="Available" value="$12,341" valueClass="text-[#21b26f]" />
          <SummaryRow label="Used" value="$2,659" />
        </div>
      </div>
    </aside>
  );
}

function SummaryRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between text-[#1c1d23]">
      <span className="text-xs text-[#a3a6b4]">{label}</span>
      <span className={cn("text-sm font-semibold", valueClass)}>{value}</span>
    </div>
  );
}

