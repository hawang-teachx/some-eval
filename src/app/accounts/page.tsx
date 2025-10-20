"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  X,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Banknote,
  Wallet,
  ArrowRightLeft,
  ChevronDown,
  ChevronRight,
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
  DollarSign,
} from "lucide-react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  subMonths,
  eachMonthOfInterval,
  isWithinInterval,
} from "date-fns";
import { create } from "zustand";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

interface Account {
  id: string;
  type: AccountType;
  name: string;
  balance: number;
  color: string;
  icon: string;
}

interface AppState {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  addTransaction: (
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">
  ) => void;
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
  accounts: {
    checking: "#3b82f6",
    savings: "#10b981",
    credit: "#f59e0b",
    cash: "#8b5cf6",
  },
};

const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: "checking",
    type: "checking",
    name: "Checking",
    balance: 0,
    color: COLORS.accounts.checking,
    icon: "CreditCard",
  },
  {
    id: "savings",
    type: "savings",
    name: "Savings",
    balance: 0,
    color: COLORS.accounts.savings,
    icon: "PiggyBank",
  },
  {
    id: "credit",
    type: "credit",
    name: "Credit Card",
    balance: 0,
    color: COLORS.accounts.credit,
    icon: "CreditCard",
  },
  {
    id: "cash",
    type: "cash",
    name: "Cash",
    balance: 0,
    color: COLORS.accounts.cash,
    icon: "Banknote",
  },
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

function saveToStorage(key: string, data: any): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

function loadFromStorage(key: string): any {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function calculateAccountBalance(
  transactions: Transaction[],
  accountType: AccountType
): number {
  return transactions
    .filter((t) => t.accountType === accountType)
    .reduce((sum, t) => {
      return sum + (t.type === "income" ? t.amount : -t.amount);
    }, 0);
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

// ============================================================================
// ZUSTAND STORE
// ============================================================================

const useStore = create<AppState>((set) => ({
  transactions: [],
  categories: PREDEFINED_CATEGORIES,
  accounts: DEFAULT_ACCOUNTS,

  addTransaction: (transaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => {
      const newTransactions = [...state.transactions, newTransaction];
      saveToStorage(STORAGE_KEYS.TRANSACTIONS, newTransactions);
      return { transactions: newTransactions };
    });
  },

  initializeData: () => {
    const storedTransactions = loadFromStorage(STORAGE_KEYS.TRANSACTIONS);
    set({
      transactions: storedTransactions || [],
    });
  },
}));

// ============================================================================
// ICON MAPPER COMPONENT
// ============================================================================

const iconMap: Record<string, any> = {
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
  DollarSign,
  PiggyBank,
  CreditCard,
  Wallet,
  Banknote,
};

function IconComponent({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] || MoreHorizontal;
  return <Icon className={className} />;
}

// ============================================================================
// COMPONENTS
// ============================================================================

// Account Card Component
function AccountCard({
  account,
  transactionCount,
  onClick,
}: {
  account: Account;
  transactionCount: number;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
      style={{ borderLeftColor: account.color }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: account.color + "20" }}
          >
            <IconComponent
              name={account.icon}
              className="w-6 h-6"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {account.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {transactionCount} transactions
            </p>
          </div>
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {formatCurrency(account.balance)}
      </p>
    </div>
  );
}

// Account Detail Modal Component
function AccountDetailModal({
  isOpen,
  onClose,
  account,
  transactions,
  categories,
}: {
  isOpen: boolean;
  onClose: () => void;
  account: Account;
  transactions: Transaction[];
  categories: Category[];
}) {
  const accountTransactions = transactions
    .filter((t) => t.accountType === account.type)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: account.color + "20" }}
              >
                <IconComponent name={account.icon} className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {account.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Account Details
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current Balance
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(account.balance)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {accountTransactions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Transactions
          </h3>
          {accountTransactions.length > 0 ? (
            <div className="space-y-3">
              {accountTransactions.map((transaction) => {
                const category = categories.find(
                  (c) => c.id === transaction.categoryId
                );
                const parentCategory = category?.parentId
                  ? categories.find((c) => c.id === category.parentId)
                  : category;
                const isIncome = transaction.type === "income";

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          parentCategory?.color || "bg-gray-200"
                        }`}
                      >
                        <IconComponent
                          name={parentCategory?.icon || "MoreHorizontal"}
                          className="w-5 h-5 text-white"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {category?.name || "Unknown"}
                        </p>
                        {transaction.note && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.note}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {format(parseISO(transaction.date), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`text-lg font-semibold ${
                        isIncome
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No transactions yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Transfer Modal Component
function TransferModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const addTransaction = useStore((state) => state.addTransaction);
  const categories = useStore((state) => state.categories);

  const [amount, setAmount] = useState("");
  const [fromAccount, setFromAccount] = useState<AccountType>("checking");
  const [toAccount, setToAccount] = useState<AccountType>("savings");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const transferCategory = categories.find((c) => c.id === "savings-account");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0 || fromAccount === toAccount) {
      alert(
        "Please fill in all fields correctly and select different accounts"
      );
      return;
    }

    const transferAmount = parseFloat(amount);
    const transferId = generateId();

    // Create expense transaction from source account
    addTransaction({
      amount: transferAmount,
      type: "expense",
      categoryId: transferCategory?.id || "savings-account",
      accountType: fromAccount,
      note: note || `Transfer to ${toAccount}`,
      date,
      repeat: "never",
      recurringGroupId: transferId,
      isRecurringInstance: false,
    });

    // Create income transaction to destination account
    addTransaction({
      amount: transferAmount,
      type: "income",
      categoryId: transferCategory?.id || "savings-account",
      accountType: toAccount,
      note: note || `Transfer from ${fromAccount}`,
      date,
      repeat: "never",
      recurringGroupId: transferId,
      isRecurringInstance: false,
    });

    setAmount("");
    setNote("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Transfer Between Accounts
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Account *
              </label>
              <select
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value as AccountType)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="credit">Credit Card</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRightLeft className="w-6 h-6 text-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Account *
              </label>
              <select
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value as AccountType)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="credit">Credit Card</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Note (optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={200}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Add a note..."
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function AccountsPage() {
  const transactions = useStore((state) => state.transactions);
  const categories = useStore((state) => state.categories);
  const initializeData = useStore((state) => state.initializeData);

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAccountsForChart, setSelectedAccountsForChart] = useState<
    Set<AccountType>
  >(new Set(["checking", "savings", "credit", "cash"]));

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Calculate account balances
  const accounts = DEFAULT_ACCOUNTS.map((account) => ({
    ...account,
    balance: calculateAccountBalance(transactions, account.type),
  }));

  // Calculate net worth
  const netWorth = accounts.reduce((sum, account) => sum + account.balance, 0);

  // Get transaction counts
  const accountTransactionCounts = DEFAULT_ACCOUNTS.map((account) => ({
    type: account.type,
    count: transactions.filter((t) => t.accountType === account.type).length,
  }));

  // Prepare balance history chart data
  const balanceHistoryData = useMemo(() => {
    const last6Months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date(),
    });

    const datasets = accounts
      .filter((account) => selectedAccountsForChart.has(account.type))
      .map((account) => {
        const data = last6Months.map((month) => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          const monthTransactions = filterByDateRange(
            transactions,
            monthStart,
            monthEnd
          ).filter((t) => t.accountType === account.type);

          return monthTransactions.reduce((sum, t) => {
            return sum + (t.type === "income" ? t.amount : -t.amount);
          }, 0);
        });

        // Calculate cumulative balance
        let cumulativeBalance = 0;
        const cumulativeData = data.map((monthBalance) => {
          cumulativeBalance += monthBalance;
          return cumulativeBalance;
        });

        return {
          label: account.name,
          data: cumulativeData,
          borderColor: account.color,
          backgroundColor: account.color + "30",
          tension: 0.4,
          fill: false,
        };
      });

    return {
      labels: last6Months.map((month) => format(month, "MMM yyyy")),
      datasets,
    };
  }, [accounts, transactions, selectedAccountsForChart]);

  const chartOptions = {
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

  const toggleAccountInChart = (accountType: AccountType) => {
    const newSelected = new Set(selectedAccountsForChart);
    if (newSelected.has(accountType)) {
      newSelected.delete(accountType);
    } else {
      newSelected.add(accountType);
    }
    setSelectedAccountsForChart(newSelected);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Accounts
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your accounts and track balances
        </p>
      </div>

      {/* Net Worth Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 mb-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-blue-100 text-sm font-medium mb-2">
              Total Net Worth
            </p>
            <p className="text-5xl font-bold text-white mb-4">
              {formatCurrency(netWorth)}
            </p>
            <p className="text-blue-100 text-sm">
              Across {accounts.length} accounts • {transactions.length} total
              transactions
            </p>
          </div>
          <div className="p-4 bg-white bg-opacity-20 rounded-lg">
            <Wallet className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowTransferModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <ArrowRightLeft className="w-5 h-5" />
          Transfer
        </button>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {accounts.map((account) => {
          const transactionCount =
            accountTransactionCounts.find((c) => c.type === account.type)
              ?.count || 0;
          return (
            <AccountCard
              key={account.id}
              account={account}
              transactionCount={transactionCount}
              onClick={() => setSelectedAccount(account)}
            />
          );
        })}
      </div>

      {/* Balance History Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Balance History
          </h2>
          <div className="flex gap-2">
            {accounts.map((account) => (
              <button
                key={account.type}
                onClick={() => toggleAccountInChart(account.type)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedAccountsForChart.has(account.type)
                    ? "text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
                style={
                  selectedAccountsForChart.has(account.type)
                    ? { backgroundColor: account.color }
                    : {}
                }
              >
                {account.name}
              </button>
            ))}
          </div>
        </div>
        {selectedAccountsForChart.size > 0 ? (
          <div className="h-80">
            <Line data={balanceHistoryData} options={chartOptions} />
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Select at least one account to view history
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedAccount && (
        <AccountDetailModal
          isOpen={!!selectedAccount}
          onClose={() => setSelectedAccount(null)}
          account={selectedAccount}
          transactions={transactions}
          categories={categories}
        />
      )}

      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
      />
    </div>
  );
}
