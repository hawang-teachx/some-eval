"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Home,
  ShoppingCart,
  Car,
  Coffee,
  Zap,
  Heart,
  Film,
  GraduationCap,
  Users,
  Plane,
  MoreHorizontal,
  PiggyBank,
} from "lucide-react";
import {
  format,
  parseISO,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  getWeek,
  isWithinInterval,
  isSameDay,
} from "date-fns";
import { create } from "zustand";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type TransactionType = "income" | "expense";
type AccountType = "checking" | "savings" | "credit" | "cash";
type PeriodView = "day" | "week" | "month";
type TypeFilter = "all" | "income" | "expense";

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  icon: string;
  color: string;
  type: "expense" | "income" | "both";
}

interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountType: AccountType;
  note?: string;
  date: string;
  repeat: string;
  createdAt: string;
  updatedAt: string;
  recurringGroupId?: string;
  isRecurringInstance: boolean;
}

interface AppState {
  transactions: Transaction[];
  categories: Category[];
  initializeData: () => void;
}

// ============================================================================
// CONSTANTS & DATA
// ============================================================================

const STORAGE_KEYS = {
  TRANSACTIONS: "financial_app_transactions",
  CATEGORIES: "financial_app_categories",
};

const COLORS = {
  income: {
    primary: "#10b981",
    light: "#d1fae5",
    dark: "#065f46",
  },
  expense: {
    primary: "#ef4444",
    light: "#fee2e2",
    dark: "#991b1b",
  },
  accounts: {
    checking: "#3b82f6",
    savings: "#10b981",
    credit: "#f59e0b",
    cash: "#8b5cf6",
  },
};

const CHART_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#6366f1",
  "#14b8a6",
  "#f43f5e",
  "#22d3ee",
  "#a3e635",
  "#fb923c",
];

const PREDEFINED_CATEGORIES: Category[] = [
  // Housing
  {
    id: "housing",
    name: "Housing",
    parentId: null,
    icon: "Home",
    color: "bg-blue-500",
    type: "expense",
  },
  {
    id: "housing-rent",
    name: "Rent",
    parentId: "housing",
    icon: "Home",
    color: "bg-blue-400",
    type: "expense",
  },
  {
    id: "housing-mortgage",
    name: "Mortgage",
    parentId: "housing",
    icon: "Home",
    color: "bg-blue-400",
    type: "expense",
  },
  {
    id: "housing-electricity",
    name: "Electricity",
    parentId: "housing",
    icon: "Zap",
    color: "bg-yellow-400",
    type: "expense",
  },
  {
    id: "housing-water",
    name: "Water",
    parentId: "housing",
    icon: "Home",
    color: "bg-blue-300",
    type: "expense",
  },
  {
    id: "housing-gas",
    name: "Gas",
    parentId: "housing",
    icon: "Home",
    color: "bg-orange-400",
    type: "expense",
  },
  {
    id: "housing-internet",
    name: "Internet",
    parentId: "housing",
    icon: "Home",
    color: "bg-purple-400",
    type: "expense",
  },
  {
    id: "housing-phone",
    name: "Phone/Mobile",
    parentId: "housing",
    icon: "Home",
    color: "bg-indigo-400",
    type: "expense",
  },
  {
    id: "housing-maintenance",
    name: "Home Maintenance",
    parentId: "housing",
    icon: "Home",
    color: "bg-gray-400",
    type: "expense",
  },
  {
    id: "housing-insurance",
    name: "Home Insurance",
    parentId: "housing",
    icon: "Home",
    color: "bg-blue-600",
    type: "expense",
  },
  {
    id: "housing-tax",
    name: "Property Tax",
    parentId: "housing",
    icon: "Home",
    color: "bg-red-400",
    type: "expense",
  },
  {
    id: "housing-other",
    name: "Other",
    parentId: "housing",
    icon: "MoreHorizontal",
    color: "bg-gray-400",
    type: "expense",
  },

  // Food & Drinks
  {
    id: "food",
    name: "Food & Drinks",
    parentId: null,
    icon: "Coffee",
    color: "bg-orange-500",
    type: "expense",
  },
  {
    id: "food-groceries",
    name: "Groceries",
    parentId: "food",
    icon: "ShoppingCart",
    color: "bg-green-500",
    type: "expense",
  },
  {
    id: "food-restaurants",
    name: "Restaurants",
    parentId: "food",
    icon: "Coffee",
    color: "bg-orange-400",
    type: "expense",
  },
  {
    id: "food-coffee",
    name: "Coffee Shops",
    parentId: "food",
    icon: "Coffee",
    color: "bg-amber-600",
    type: "expense",
  },
  {
    id: "food-fastfood",
    name: "Fast Food",
    parentId: "food",
    icon: "Coffee",
    color: "bg-red-400",
    type: "expense",
  },
  {
    id: "food-bars",
    name: "Bars/Alcohol",
    parentId: "food",
    icon: "Coffee",
    color: "bg-purple-400",
    type: "expense",
  },
  {
    id: "food-snacks",
    name: "Snacks",
    parentId: "food",
    icon: "Coffee",
    color: "bg-pink-400",
    type: "expense",
  },
  {
    id: "food-other",
    name: "Other",
    parentId: "food",
    icon: "MoreHorizontal",
    color: "bg-gray-400",
    type: "expense",
  },

  // Transportation
  {
    id: "transport",
    name: "Transportation",
    parentId: null,
    icon: "Car",
    color: "bg-indigo-500",
    type: "expense",
  },
  {
    id: "transport-gas",
    name: "Gas/Fuel",
    parentId: "transport",
    icon: "Car",
    color: "bg-red-500",
    type: "expense",
  },
  {
    id: "transport-transit",
    name: "Public Transit",
    parentId: "transport",
    icon: "Car",
    color: "bg-blue-500",
    type: "expense",
  },
  {
    id: "transport-parking",
    name: "Parking",
    parentId: "transport",
    icon: "Car",
    color: "bg-gray-500",
    type: "expense",
  },
  {
    id: "transport-maintenance",
    name: "Car Maintenance",
    parentId: "transport",
    icon: "Car",
    color: "bg-orange-500",
    type: "expense",
  },
  {
    id: "transport-payment",
    name: "Car Payment",
    parentId: "transport",
    icon: "Car",
    color: "bg-indigo-600",
    type: "expense",
  },
  {
    id: "transport-insurance",
    name: "Car Insurance",
    parentId: "transport",
    icon: "Car",
    color: "bg-blue-600",
    type: "expense",
  },
  {
    id: "transport-rideshare",
    name: "Uber/Taxi/Rideshare",
    parentId: "transport",
    icon: "Car",
    color: "bg-purple-500",
    type: "expense",
  },
  {
    id: "transport-other",
    name: "Other",
    parentId: "transport",
    icon: "MoreHorizontal",
    color: "bg-gray-400",
    type: "expense",
  },

  // Entertainment
  {
    id: "entertainment",
    name: "Entertainment",
    parentId: null,
    icon: "Film",
    color: "bg-pink-500",
    type: "expense",
  },
  {
    id: "entertainment-movies",
    name: "Movies/Cinema",
    parentId: "entertainment",
    icon: "Film",
    color: "bg-red-500",
    type: "expense",
  },
  {
    id: "entertainment-games",
    name: "Video Games",
    parentId: "entertainment",
    icon: "Film",
    color: "bg-purple-500",
    type: "expense",
  },
  {
    id: "entertainment-streaming",
    name: "Streaming Services",
    parentId: "entertainment",
    icon: "Film",
    color: "bg-pink-600",
    type: "expense",
  },
  {
    id: "entertainment-hobbies",
    name: "Hobbies",
    parentId: "entertainment",
    icon: "Film",
    color: "bg-indigo-500",
    type: "expense",
  },
  {
    id: "entertainment-events",
    name: "Events/Concerts",
    parentId: "entertainment",
    icon: "Film",
    color: "bg-orange-500",
    type: "expense",
  },
  {
    id: "entertainment-sports",
    name: "Sports Activities",
    parentId: "entertainment",
    icon: "Film",
    color: "bg-green-500",
    type: "expense",
  },
  {
    id: "entertainment-books",
    name: "Books/Magazines",
    parentId: "entertainment",
    icon: "Film",
    color: "bg-amber-600",
    type: "expense",
  },
  {
    id: "entertainment-other",
    name: "Other",
    parentId: "entertainment",
    icon: "MoreHorizontal",
    color: "bg-gray-400",
    type: "expense",
  },

  // Shopping
  {
    id: "shopping",
    name: "Shopping",
    parentId: null,
    icon: "ShoppingCart",
    color: "bg-purple-500",
    type: "expense",
  },
  {
    id: "shopping-clothing",
    name: "Clothing",
    parentId: "shopping",
    icon: "ShoppingCart",
    color: "bg-pink-500",
    type: "expense",
  },
  {
    id: "shopping-electronics",
    name: "Electronics",
    parentId: "shopping",
    icon: "ShoppingCart",
    color: "bg-blue-500",
    type: "expense",
  },
  {
    id: "shopping-home",
    name: "Home Goods",
    parentId: "shopping",
    icon: "ShoppingCart",
    color: "bg-orange-500",
    type: "expense",
  },
  {
    id: "shopping-personal",
    name: "Personal Care",
    parentId: "shopping",
    icon: "ShoppingCart",
    color: "bg-green-500",
    type: "expense",
  },
  {
    id: "shopping-beauty",
    name: "Beauty Products",
    parentId: "shopping",
    icon: "ShoppingCart",
    color: "bg-purple-400",
    type: "expense",
  },
  {
    id: "shopping-gifts",
    name: "Gifts",
    parentId: "shopping",
    icon: "ShoppingCart",
    color: "bg-red-500",
    type: "expense",
  },
  {
    id: "shopping-other",
    name: "Other",
    parentId: "shopping",
    icon: "MoreHorizontal",
    color: "bg-gray-400",
    type: "expense",
  },

  // Health & Fitness
  {
    id: "health",
    name: "Health & Fitness",
    parentId: null,
    icon: "Heart",
    color: "bg-red-500",
    type: "expense",
  },
  {
    id: "health-doctor",
    name: "Doctor Visits",
    parentId: "health",
    icon: "Heart",
    color: "bg-red-400",
    type: "expense",
  },
  {
    id: "health-pharmacy",
    name: "Pharmacy/Medicine",
    parentId: "health",
    icon: "Heart",
    color: "bg-blue-400",
    type: "expense",
  },
  {
    id: "health-gym",
    name: "Gym Membership",
    parentId: "health",
    icon: "Heart",
    color: "bg-orange-500",
    type: "expense",
  },
  {
    id: "health-insurance",
    name: "Health Insurance",
    parentId: "health",
    icon: "Heart",
    color: "bg-blue-600",
    type: "expense",
  },
  {
    id: "health-dental",
    name: "Dental Care",
    parentId: "health",
    icon: "Heart",
    color: "bg-cyan-500",
    type: "expense",
  },
  {
    id: "health-vision",
    name: "Vision Care",
    parentId: "health",
    icon: "Heart",
    color: "bg-indigo-500",
    type: "expense",
  },
  {
    id: "health-other",
    name: "Other",
    parentId: "health",
    icon: "MoreHorizontal",
    color: "bg-gray-400",
    type: "expense",
  },

  // Bills & Utilities
  {
    id: "bills",
    name: "Bills & Utilities",
    parentId: null,
    icon: "Zap",
    color: "bg-yellow-500",
    type: "expense",
  },
  {
    id: "bills-phone",
    name: "Phone Bill",
    parentId: "bills",
    icon: "Zap",
    color: "bg-blue-500",
    type: "expense",
  },
  {
    id: "bills-internet",
    name: "Internet Bill",
    parentId: "bills",
    icon: "Zap",
    color: "bg-purple-500",
    type: "expense",
  },
  {
    id: "bills-subscriptions",
    name: "Subscriptions",
    parentId: "bills",
    icon: "Zap",
    color: "bg-pink-500",
    type: "expense",
  },
  {
    id: "bills-credit",
    name: "Credit Card Payment",
    parentId: "bills",
    icon: "Zap",
    color: "bg-red-500",
    type: "expense",
  },
  {
    id: "bills-loan",
    name: "Loan Payment",
    parentId: "bills",
    icon: "Zap",
    color: "bg-orange-500",
    type: "expense",
  },
  {
    id: "bills-insurance",
    name: "Insurance Premiums",
    parentId: "bills",
    icon: "Zap",
    color: "bg-blue-600",
    type: "expense",
  },
  {
    id: "bills-other",
    name: "Other",
    parentId: "bills",
    icon: "MoreHorizontal",
    color: "bg-gray-400",
    type: "expense",
  },

  // Income
  {
    id: "income",
    name: "Income",
    parentId: null,
    icon: "DollarSign",
    color: "bg-green-500",
    type: "income",
  },
  {
    id: "income-salary",
    name: "Salary/Wages",
    parentId: "income",
    icon: "DollarSign",
    color: "bg-green-600",
    type: "income",
  },
  {
    id: "income-freelance",
    name: "Freelance",
    parentId: "income",
    icon: "DollarSign",
    color: "bg-blue-500",
    type: "income",
  },
  {
    id: "income-investment",
    name: "Investment Returns",
    parentId: "income",
    icon: "DollarSign",
    color: "bg-purple-500",
    type: "income",
  },
  {
    id: "income-gifts",
    name: "Gifts Received",
    parentId: "income",
    icon: "DollarSign",
    color: "bg-pink-500",
    type: "income",
  },
  {
    id: "income-refunds",
    name: "Refunds",
    parentId: "income",
    icon: "DollarSign",
    color: "bg-orange-500",
    type: "income",
  },
  {
    id: "income-bonus",
    name: "Bonus",
    parentId: "income",
    icon: "DollarSign",
    color: "bg-yellow-500",
    type: "income",
  },
  {
    id: "income-other",
    name: "Other",
    parentId: "income",
    icon: "MoreHorizontal",
    color: "bg-gray-400",
    type: "income",
  },

  // Savings & Investment
  {
    id: "savings",
    name: "Savings & Investment",
    parentId: null,
    icon: "PiggyBank",
    color: "bg-emerald-500",
    type: "expense",
  },
  {
    id: "savings-account",
    name: "Savings Account Transfer",
    parentId: "savings",
    icon: "PiggyBank",
    color: "bg-green-500",
    type: "expense",
  },
  {
    id: "savings-stock",
    name: "Stock Investment",
    parentId: "savings",
    icon: "PiggyBank",
    color: "bg-blue-600",
    type: "expense",
  },
  {
    id: "savings-retirement",
    name: "Retirement Fund",
    parentId: "savings",
    icon: "PiggyBank",
    color: "bg-purple-600",
    type: "expense",
  },
  {
    id: "savings-emergency",
    name: "Emergency Fund",
    parentId: "savings",
    icon: "PiggyBank",
    color: "bg-red-600",
    type: "expense",
  },
  {
    id: "savings-crypto",
    name: "Crypto",
    parentId: "savings",
    icon: "PiggyBank",
    color: "bg-orange-600",
    type: "expense",
  },
  {
    id: "savings-other",
    name: "Other",
    parentId: "savings",
    icon: "MoreHorizontal",
    color: "bg-gray-400",
    type: "expense",
  },

  // Education
  {
    id: "education",
    name: "Education",
    parentId: null,
    icon: "GraduationCap",
    color: "bg-cyan-500",
    type: "expense",
  },
  {
    id: "education-tuition",
    name: "Tuition",
    parentId: "education",
    icon: "GraduationCap",
    color: "bg-blue-600",
    type: "expense",
  },
  {
    id: "education-books",
    name: "Books & Supplies",
    parentId: "education",
    icon: "GraduationCap",
    color: "bg-orange-500",
    type: "expense",
  },
  {
    id: "education-courses",
    name: "Courses/Training",
    parentId: "education",
    icon: "GraduationCap",
    color: "bg-purple-500",
    type: "expense",
  },
  {
    id: "education-loan",
    name: "Student Loan Payment",
    parentId: "education",
    icon: "GraduationCap",
    color: "bg-red-500",
    type: "expense",
  },
  {
    id: "education-other",
    name: "Other",
    parentId: "education",
    icon: "MoreHorizontal",
    color: "bg-gray-400",
    type: "expense",
  },

  // Personal
  {
    id: "personal",
    name: "Personal",
    parentId: null,
    icon: "Users",
    color: "bg-violet-500",
    type: "expense",
  },
  {
    id: "personal-haircut",
    name: "Haircut/Salon",
    parentId: "personal",
    icon: "Users",
    color: "bg-pink-500",
    type: "expense",
  },
  {
    id: "personal-clothing-care",
    name: "Clothing Care",
    parentId: "personal",
    icon: "Users",
    color: "bg-blue-500",
    type: "expense",
  },
  {
    id: "personal-services",
    name: "Personal Services",
    parentId: "personal",
    icon: "Users",
    color: "bg-purple-500",
    type: "expense",
  },
  {
    id: "personal-other",
    name: "Other",
    parentId: "personal",
    icon: "MoreHorizontal",
    color: "bg-gray-400",
    type: "expense",
  },

  // Family & Pets
  {
    id: "family",
    name: "Family & Pets",
    parentId: null,
    icon: "Users",
    color: "bg-rose-500",
    type: "expense",
  },
  {
    id: "family-childcare",
    name: "Childcare",
    parentId: "family",
    icon: "Users",
    color: "bg-pink-500",
    type: "expense",
  },
  {
    id: "family-pet-food",
    name: "Pet Food",
    parentId: "family",
    icon: "Users",
    color: "bg-amber-500",
    type: "expense",
  },
  {
    id: "family-vet",
    name: "Veterinary",
    parentId: "family",
    icon: "Users",
    color: "bg-red-500",
    type: "expense",
  },
  {
    id: "family-pet-supplies",
    name: "Pet Supplies",
    parentId: "family",
    icon: "Users",
    color: "bg-orange-500",
    type: "expense",
  },
  {
    id: "family-other",
    name: "Other",
    parentId: "family",
    icon: "MoreHorizontal",
    color: "bg-gray-400",
    type: "expense",
  },

  // Travel
  {
    id: "travel",
    name: "Travel",
    parentId: null,
    icon: "Plane",
    color: "bg-sky-500",
    type: "expense",
  },
  {
    id: "travel-flights",
    name: "Flights",
    parentId: "travel",
    icon: "Plane",
    color: "bg-blue-600",
    type: "expense",
  },
  {
    id: "travel-hotels",
    name: "Hotels",
    parentId: "travel",
    icon: "Plane",
    color: "bg-purple-600",
    type: "expense",
  },
  {
    id: "travel-vacation",
    name: "Vacation",
    parentId: "travel",
    icon: "Plane",
    color: "bg-orange-500",
    type: "expense",
  },
  {
    id: "travel-insurance",
    name: "Travel Insurance",
    parentId: "travel",
    icon: "Plane",
    color: "bg-red-500",
    type: "expense",
  },
  {
    id: "travel-other",
    name: "Other",
    parentId: "travel",
    icon: "MoreHorizontal",
    color: "bg-gray-400",
    type: "expense",
  },

  // Miscellaneous
  {
    id: "misc",
    name: "Miscellaneous",
    parentId: null,
    icon: "MoreHorizontal",
    color: "bg-gray-500",
    type: "both",
  },
  {
    id: "misc-charity",
    name: "Charity/Donations",
    parentId: "misc",
    icon: "MoreHorizontal",
    color: "bg-green-500",
    type: "expense",
  },
  {
    id: "misc-fees",
    name: "Fees & Charges",
    parentId: "misc",
    icon: "MoreHorizontal",
    color: "bg-red-500",
    type: "expense",
  },
  {
    id: "misc-other",
    name: "Other",
    parentId: "misc",
    icon: "MoreHorizontal",
    color: "bg-gray-400",
    type: "both",
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function loadFromStorage(key: string): any {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function filterByDateRange(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] {
  return transactions.filter((t) => {
    const transactionDate = parseISO(t.date);
    return isWithinInterval(transactionDate, {
      start: startDate,
      end: endDate,
    });
  });
}

function getCategoryTotals(
  transactions: Transaction[],
  categories: Category[]
): Array<{ categoryId: string; name: string; amount: number; color: string }> {
  const totals: Record<string, number> = {};

  transactions.forEach((t) => {
    totals[t.categoryId] = (totals[t.categoryId] || 0) + t.amount;
  });

  return Object.entries(totals)
    .map(([categoryId, amount]) => {
      const category = categories.find((c) => c.id === categoryId);
      const parentCategory = category?.parentId
        ? categories.find((c) => c.id === category.parentId)
        : category;

      return {
        categoryId,
        name: category?.name || "Unknown",
        amount,
        color: parentCategory?.color || "bg-gray-500",
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

// ============================================================================
// ZUSTAND STORE
// ============================================================================

const useStore = create<AppState>((set) => ({
  transactions: [],
  categories: PREDEFINED_CATEGORIES,

  initializeData: () => {
    const storedTransactions = loadFromStorage(STORAGE_KEYS.TRANSACTIONS);
    set({
      transactions: storedTransactions || [],
    });
  },
}));

// ============================================================================
// COMPONENTS
// ============================================================================

// Stat Card Component
function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  icon: any;
  trend?: { value: number; isPositive: boolean };
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs prev period</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function AnalyticsPage() {
  const transactions = useStore((state) => state.transactions);
  const categories = useStore((state) => state.categories);
  const initializeData = useStore((state) => state.initializeData);

  const [periodView, setPeriodView] = useState<PeriodView>("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("expense");
  const [accountFilter, setAccountFilter] = useState<AccountType[]>([]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Calculate date range based on period view
  const dateRange = useMemo(() => {
    switch (periodView) {
      case "day":
        return {
          start: startOfDay(selectedDate),
          end: endOfDay(selectedDate),
        };
      case "week":
        return {
          start: startOfWeek(selectedDate, { weekStartsOn: 0 }),
          end: endOfWeek(selectedDate, { weekStartsOn: 0 }),
        };
      case "month":
        return {
          start: startOfMonth(selectedDate),
          end: endOfMonth(selectedDate),
        };
    }
  }, [periodView, selectedDate]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let result = filterByDateRange(
      transactions,
      dateRange.start,
      dateRange.end
    );

    if (typeFilter !== "all") {
      result = result.filter((t) => t.type === typeFilter);
    }

    if (accountFilter.length > 0) {
      result = result.filter((t) => accountFilter.includes(t.accountType));
    }

    return result;
  }, [transactions, dateRange, typeFilter, accountFilter]);

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Prepare bar chart data
  const barChartData = useMemo(() => {
    let labels: string[] = [];
    let incomeData: number[] = [];
    let expenseData: number[] = [];

    if (periodView === "day") {
      // 24 hours
      labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
      incomeData = new Array(24).fill(0);
      expenseData = new Array(24).fill(0);

      filteredTransactions.forEach((t) => {
        const hour = parseISO(t.date).getHours();
        if (t.type === "income") {
          incomeData[hour] += t.amount;
        } else {
          expenseData[hour] += t.amount;
        }
      });
    } else if (periodView === "week") {
      // 7 days
      const days = eachDayOfInterval({
        start: dateRange.start,
        end: dateRange.end,
      });
      labels = days.map((d) => format(d, "EEE"));
      incomeData = new Array(7).fill(0);
      expenseData = new Array(7).fill(0);

      filteredTransactions.forEach((t) => {
        const transactionDate = parseISO(t.date);
        const dayIndex = days.findIndex((d) => isSameDay(d, transactionDate));
        if (dayIndex >= 0) {
          if (t.type === "income") {
            incomeData[dayIndex] += t.amount;
          } else {
            expenseData[dayIndex] += t.amount;
          }
        }
      });
    } else {
      // Days in month
      const days = eachDayOfInterval({
        start: dateRange.start,
        end: dateRange.end,
      });
      labels = days.map((d) => format(d, "d"));
      incomeData = new Array(days.length).fill(0);
      expenseData = new Array(days.length).fill(0);

      filteredTransactions.forEach((t) => {
        const transactionDate = parseISO(t.date);
        const dayIndex = days.findIndex((d) => isSameDay(d, transactionDate));
        if (dayIndex >= 0) {
          if (t.type === "income") {
            incomeData[dayIndex] += t.amount;
          } else {
            expenseData[dayIndex] += t.amount;
          }
        }
      });
    }

    return {
      labels,
      datasets:
        typeFilter === "all"
          ? [
              {
                label: "Income",
                data: incomeData,
                backgroundColor: COLORS.income.primary,
              },
              {
                label: "Expenses",
                data: expenseData,
                backgroundColor: COLORS.expense.primary,
              },
            ]
          : [
              {
                label: typeFilter === "income" ? "Income" : "Expenses",
                data: typeFilter === "income" ? incomeData : expenseData,
                backgroundColor:
                  typeFilter === "income"
                    ? COLORS.income.primary
                    : COLORS.expense.primary,
              },
            ],
    };
  }, [periodView, dateRange, filteredTransactions, typeFilter]);

  // Prepare doughnut chart data
  const doughnutChartData = useMemo(() => {
    const categoryTotals = getCategoryTotals(
      filteredTransactions.filter(
        (t) => typeFilter === "all" || t.type === typeFilter
      ),
      categories
    );

    const top10 = categoryTotals.slice(0, 10);
    const total = top10.reduce((sum, cat) => sum + cat.amount, 0);

    return {
      labels: top10.map((cat) => cat.name),
      datasets: [
        {
          data: top10.map((cat) => cat.amount),
          backgroundColor: CHART_COLORS,
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    };
  }, [filteredTransactions, categories, typeFilter]);

  // Prepare trend line chart data
  const trendChartData = useMemo(() => {
    let periods: Date[] = [];

    if (periodView === "day") {
      // Last 7 days
      periods = Array.from({ length: 7 }, (_, i) =>
        subDays(selectedDate, 6 - i)
      );
    } else if (periodView === "week") {
      // Last 4 weeks
      periods = Array.from({ length: 4 }, (_, i) =>
        subWeeks(selectedDate, 3 - i)
      );
    } else {
      // Last 6 months
      periods = Array.from({ length: 6 }, (_, i) =>
        subMonths(selectedDate, 5 - i)
      );
    }

    const incomeData = periods.map((period) => {
      let start, end;
      if (periodView === "day") {
        start = startOfDay(period);
        end = endOfDay(period);
      } else if (periodView === "week") {
        start = startOfWeek(period, { weekStartsOn: 0 });
        end = endOfWeek(period, { weekStartsOn: 0 });
      } else {
        start = startOfMonth(period);
        end = endOfMonth(period);
      }

      return filterByDateRange(transactions, start, end)
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    });

    const expenseData = periods.map((period) => {
      let start, end;
      if (periodView === "day") {
        start = startOfDay(period);
        end = endOfDay(period);
      } else if (periodView === "week") {
        start = startOfWeek(period, { weekStartsOn: 0 });
        end = endOfWeek(period, { weekStartsOn: 0 });
      } else {
        start = startOfMonth(period);
        end = endOfMonth(period);
      }

      return filterByDateRange(transactions, start, end)
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
    });

    const labels = periods.map((p) => {
      if (periodView === "day") return format(p, "MMM d");
      if (periodView === "week") return `W${getWeek(p)}`;
      return format(p, "MMM");
    });

    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          borderColor: COLORS.income.primary,
          backgroundColor: COLORS.income.light,
          fill: true,
          tension: 0.4,
        },
        {
          label: "Expenses",
          data: expenseData,
          borderColor: COLORS.expense.primary,
          backgroundColor: COLORS.expense.light,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [periodView, selectedDate, transactions]);

  // Top categories
  const topCategories = useMemo(() => {
    return getCategoryTotals(
      filteredTransactions.filter(
        (t) => typeFilter === "all" || t.type === typeFilter
      ),
      categories
    ).slice(0, 10);
  }, [filteredTransactions, categories, typeFilter]);

  // Statistics
  const averageDaily = useMemo(() => {
    const days = eachDayOfInterval({
      start: dateRange.start,
      end: dateRange.end,
    }).length;
    return (
      (typeFilter === "expense"
        ? totalExpenses
        : typeFilter === "income"
        ? totalIncome
        : totalExpenses) / days
    );
  }, [dateRange, totalExpenses, totalIncome, typeFilter]);

  const highestTransaction = useMemo(() => {
    if (filteredTransactions.length === 0) return 0;
    return Math.max(...filteredTransactions.map((t) => t.amount));
  }, [filteredTransactions]);

  const mostFrequentCategory = useMemo(() => {
    if (filteredTransactions.length === 0) return "None";
    const categoryCounts: Record<string, number> = {};
    filteredTransactions.forEach((t) => {
      categoryCounts[t.categoryId] = (categoryCounts[t.categoryId] || 0) + 1;
    });
    const mostFrequent = Object.entries(categoryCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];
    const category = categories.find((c) => c.id === mostFrequent[0]);
    return category?.name || "Unknown";
  }, [filteredTransactions, categories]);

  // Navigation handlers
  const handlePrevious = () => {
    switch (periodView) {
      case "day":
        setSelectedDate(subDays(selectedDate, 1));
        break;
      case "week":
        setSelectedDate(subWeeks(selectedDate, 1));
        break;
      case "month":
        setSelectedDate(subMonths(selectedDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (periodView) {
      case "day":
        setSelectedDate(addDays(selectedDate, 1));
        break;
      case "week":
        setSelectedDate(addWeeks(selectedDate, 1));
        break;
      case "month":
        setSelectedDate(addMonths(selectedDate, 1));
        break;
    }
  };

  const getDateLabel = () => {
    switch (periodView) {
      case "day":
        return format(selectedDate, "MMMM d, yyyy");
      case "week":
        return `Week ${getWeek(selectedDate)}, ${format(selectedDate, "yyyy")}`;
      case "month":
        return format(selectedDate, "MMMM yyyy");
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: typeFilter === "all",
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${formatCurrency(
              context.parsed.y
            )}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(
              context.parsed
            )} (${percentage}%)`;
          },
        },
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
      },
      tooltip: {
        mode: "index" as const,
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${formatCurrency(
              context.parsed.y
            )}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Visualize your financial data
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Period Selector */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPeriodView("day")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                periodView === "day"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setPeriodView("week")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                periodView === "week"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setPeriodView("month")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                periodView === "month"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Month
            </button>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevious}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[180px] text-center">
                {getDateLabel()}
              </span>
            </div>
            <button
              onClick={handleNext}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Type and Account Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <div className="flex gap-2">
              {(["all", "expense", "income"] as TypeFilter[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    typeFilter === type
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Accounts
            </label>
            <div className="flex flex-wrap gap-2">
              {(["checking", "savings", "credit", "cash"] as AccountType[]).map(
                (acc) => (
                  <button
                    key={acc}
                    onClick={() => {
                      const newAccounts = accountFilter.includes(acc)
                        ? accountFilter.filter((a) => a !== acc)
                        : [...accountFilter, acc];
                      setAccountFilter(newAccounts);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                      accountFilter.includes(acc)
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {acc}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          label="Total Income"
          value={formatCurrency(totalIncome)}
          icon={TrendingUp}
        />
        <StatCard
          label="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
        />
        <StatCard
          label="Net Balance"
          value={formatCurrency(netBalance)}
          icon={DollarSign}
        />
      </div>

      {/* Primary Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {periodView === "day"
            ? "Hourly Breakdown"
            : periodView === "week"
            ? "Daily Breakdown"
            : "Daily Breakdown"}
        </h2>
        <div className="h-80">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      {/* Category Breakdown and Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Doughnut Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Category Distribution
          </h2>
          {topCategories.length > 0 ? (
            <div className="h-80">
              <Doughnut
                data={doughnutChartData}
                options={doughnutChartOptions}
              />
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Top Categories
          </h2>
          {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map((cat, index) => {
                const total = topCategories.reduce(
                  (sum, c) => sum + c.amount,
                  0
                );
                const percentage = ((cat.amount / total) * 100).toFixed(1);

                return (
                  <div key={cat.categoryId}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {index + 1}. {cat.name}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(cat.amount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor:
                            CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {percentage}% of total
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Trend Line Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Trend -{" "}
          {periodView === "day"
            ? "Last 7 Days"
            : periodView === "week"
            ? "Last 4 Weeks"
            : "Last 6 Months"}
        </h2>
        <div className="h-80">
          <Line data={trendChartData} options={lineChartOptions} />
        </div>
      </div>

      {/* Statistics Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Average Daily
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(averageDaily)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Highest Transaction
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(highestTransaction)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Most Frequent Category
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {mostFrequentCategory}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Transaction Count
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredTransactions.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
