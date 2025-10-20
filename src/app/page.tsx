"use client";

import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
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
  X,
  Search,
  ChevronDown,
  ChevronRight,
  Calendar,
  Plus,
  Pencil,
  Trash2,
  CreditCard,
  Wallet as WalletIcon,
  Banknote,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  eachMonthOfInterval,
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay,
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
type RepeatFrequency =
  | "never"
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "yearly";
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
  repeat: RepeatFrequency;
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

interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: "monthly" | "yearly";
  month?: string;
}

interface AppState {
  isLoading: boolean;
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  budgets: Budget[];
  lastSaved: number | null;
  addTransaction: (
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, "id">) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  loadData: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

// ============================================================================
// CONSTANTS & DATA
// ============================================================================

const STORAGE_KEYS = {
  TRANSACTIONS: "financial_app_transactions",
  CATEGORIES: "financial_app_categories",
  ACCOUNTS: "financial_app_accounts",
  BUDGETS: "financial_app_budgets",
  SETTINGS: "financial_app_settings",
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
  budget: {
    good: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
  },
};

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

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Simulate API calls with delays
function asyncSaveToStorage(key: string, data: any): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(data));
      resolve();
    }, Math.random() * 100 + 50);
  });
}

// Simulate API calls with delays
function asyncLoadFromStorage(key: string): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stored = localStorage.getItem(key);
      resolve(stored ? JSON.parse(stored) : null);
    }, Math.random() * 200 + 100);
  });
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

function getCategoryTotals(
  transactions: Transaction[],
  type: TransactionType
): Record<string, number> {
  return transactions
    .filter((t) => t.type === type)
    .reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  const today = startOfDay(new Date());
  const yesterday = startOfDay(new Date(today.getTime() - 86400000));
  const transactionDate = startOfDay(date);

  if (transactionDate.getTime() === today.getTime()) {
    return "Today";
  } else if (transactionDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    return format(date, "MMM d, yyyy");
  }
}

// ============================================================================
// ZUSTAND STORE
// ============================================================================

const useStore = create<AppState>((set, get) => ({
  transactions: [],
  categories: PREDEFINED_CATEGORIES,
  accounts: DEFAULT_ACCOUNTS,
  budgets: [],
  isLoading: false,
  lastSaved: Date.now(),

  setLoading: (loading) => set({ isLoading: loading }),

  loadData: async () => {
    set({ isLoading: true });
    const [transactions, budgets] = await Promise.all([
      asyncLoadFromStorage(STORAGE_KEYS.TRANSACTIONS),
      asyncLoadFromStorage(STORAGE_KEYS.BUDGETS),
    ]);

    set({
      transactions: transactions || [],
      budgets: budgets || [],
      isLoading: false,
      lastSaved: Date.now(),
    });
  },

  addTransaction: (transaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => {
      const newTransactions = [...state.transactions, newTransaction];
      asyncSaveToStorage(STORAGE_KEYS.TRANSACTIONS, newTransactions);
      return { transactions: newTransactions, lastSaved: Date.now() };
    });
  },

  updateTransaction: (id, updates) => {
    set((state) => {
      const newTransactions = state.transactions.map((t) =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      );
      asyncSaveToStorage(STORAGE_KEYS.TRANSACTIONS, newTransactions);
      return { transactions: newTransactions, lastSaved: Date.now() };
    });
  },

  deleteTransaction: (id) => {
    set((state) => {
      const newTransactions = state.transactions.filter((t) => t.id !== id);
      asyncSaveToStorage(STORAGE_KEYS.TRANSACTIONS, newTransactions);
      return { transactions: newTransactions, lastSaved: Date.now() };
    });
  },

  addBudget: (budget) => {
    const newBudget: Budget = { ...budget, id: generateId() };
    set((state) => {
      const newBudgets = [...state.budgets, newBudget];
      asyncSaveToStorage(STORAGE_KEYS.BUDGETS, newBudgets);
      return { budgets: newBudgets, lastSaved: Date.now() };
    });
  },

  updateBudget: (id, updates) => {
    set((state) => {
      const newBudgets = state.budgets.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      );
      asyncSaveToStorage(STORAGE_KEYS.BUDGETS, newBudgets);
      return { budgets: newBudgets, lastSaved: Date.now() };
    });
  },

  deleteBudget: (id) => {
    set((state) => {
      const newBudgets = state.budgets.filter((b) => b.id !== id);
      asyncSaveToStorage(STORAGE_KEYS.BUDGETS, newBudgets);
      return { budgets: newBudgets, lastSaved: Date.now() };
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
  WalletIcon,
  Banknote,
};

function IconComponent({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] || MoreHorizontal;
  return <Icon className={className} />;
}

// ============================================================================
// COMPONENTS
// ============================================================================

// Summary Card Component
function SummaryCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
  color = "blue",
}: {
  title: string;
  value: string;
  icon: any;
  change?: number;
  changeLabel?: string;
  color?: string;
}) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
          {change !== undefined && (
            <div className="flex items-center mt-2 text-sm">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={isPositive ? "text-green-600" : "text-red-600"}>
                {Math.abs(change)}%
              </span>
              {changeLabel && (
                <span className="text-gray-500 ml-1">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-lg bg-${color}-50 dark:bg-${color}-900/20`}
        >
          <Icon
            className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`}
          />
        </div>
      </div>
    </div>
  );
}

// Account Badge Component
function AccountBadge({ type }: { type: AccountType }) {
  const config = {
    checking: {
      label: "Checking",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    savings: {
      label: "Savings",
      color:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    credit: {
      label: "Credit",
      color:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    cash: {
      label: "Cash",
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
  };

  const { label, color } = config[type];

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${color}`}
    >
      {label}
    </span>
  );
}

// Transaction Card Component
function TransactionCard({
  transaction,
  category,
  onEdit,
}: {
  transaction: Transaction;
  category?: Category;
  onEdit: () => void;
}) {
  const isIncome = transaction.type === "income";
  const parentCategory = category?.parentId
    ? PREDEFINED_CATEGORIES.find((c) => c.id === category.parentId)
    : category;

  return (
    <div
      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onEdit}
    >
      <div className="flex items-center space-x-4 flex-1">
        <div
          className={`p-2 rounded-lg ${parentCategory?.color || "bg-gray-200"}`}
        >
          <IconComponent
            name={parentCategory?.icon || "MoreHorizontal"}
            className="w-5 h-5 text-white"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {category?.name || "Unknown"}
          </p>
          {transaction.note && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {transaction.note}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {formatDate(transaction.date)}
            </p>
            <AccountBadge type={transaction.accountType} />
          </div>
        </div>
      </div>
      <div className="text-right ml-4">
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
    </div>
  );
}

// Budget Progress Card Component
function BudgetProgressCard({
  budget,
  category,
  spent,
}: {
  budget: Budget;
  category: Category;
  spent: number;
}) {
  const percentage = (spent / budget.amount) * 100;
  const remaining = budget.amount - spent;

  let progressColor = COLORS.budget.good;
  if (percentage >= 100) progressColor = COLORS.budget.danger;
  else if (percentage >= 70) progressColor = COLORS.budget.warning;

  const parentCategory = category.parentId
    ? PREDEFINED_CATEGORIES.find((c) => c.id === category.parentId)
    : category;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div
            className={`p-2 rounded-lg ${
              parentCategory?.color || "bg-gray-200"
            }`}
          >
            <IconComponent
              name={parentCategory?.icon || "MoreHorizontal"}
              className="w-4 h-4 text-white"
            />
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {category.name}
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: progressColor,
          }}
        />
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400">
          {formatCurrency(spent)} / {formatCurrency(budget.amount)}
        </span>
        <span
          className={
            remaining >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }
        >
          {remaining >= 0
            ? formatCurrency(remaining)
            : formatCurrency(Math.abs(remaining))}{" "}
          {remaining >= 0 ? "left" : "over"}
        </span>
      </div>
    </div>
  );
}

// Category Selector Modal Component
function CategorySelectorModal({
  isOpen,
  onClose,
  onSelect,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (categoryId: string) => void;
  type: TransactionType;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedParents, setExpandedParents] = useState<Set<string>>(
    new Set()
  );
  const categories = useStore((state) => state.categories);

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const matchesType = c.type === type || c.type === "both";
      const matchesSearch = c.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [categories, type, searchQuery]);

  const parentCategories = filteredCategories.filter(
    (c) => c.parentId === null
  );

  const toggleParent = (parentId: string) => {
    const newExpanded = new Set(expandedParents);
    if (newExpanded.has(parentId)) {
      newExpanded.delete(parentId);
    } else {
      newExpanded.add(parentId);
    }
    setExpandedParents(newExpanded);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Select Category
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {parentCategories.map((parent) => {
              const children = filteredCategories.filter(
                (c) => c.parentId === parent.id
              );
              const isExpanded = expandedParents.has(parent.id);

              return (
                <div key={parent.id}>
                  <button
                    onClick={() => toggleParent(parent.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${parent.color}`}>
                        <IconComponent
                          name={parent.icon}
                          className="w-5 h-5 text-white"
                        />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {parent.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({children.length})
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => {
                            onSelect(child.id);
                            onClose();
                          }}
                          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <div className={`p-2 rounded-lg ${child.color}`}>
                            <IconComponent
                              name={child.icon}
                              className="w-4 h-4 text-white"
                            />
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {child.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add/Edit Transaction Modal Component
function TransactionModal({
  isOpen,
  onClose,
  transaction,
}: {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction;
}) {
  const addTransaction = useStore((state) => state.addTransaction);
  const updateTransaction = useStore((state) => state.updateTransaction);
  const deleteTransaction = useStore((state) => state.deleteTransaction);
  const categories = useStore((state) => state.categories);

  const [amount, setAmount] = useState(transaction?.amount.toString() || "");
  const [type, setType] = useState<TransactionType>(
    transaction?.type || "expense"
  );
  const [categoryId, setCategoryId] = useState(transaction?.categoryId || "");
  const [accountType, setAccountType] = useState<AccountType>(
    transaction?.accountType || "checking"
  );
  const [note, setNote] = useState(transaction?.note || "");
  const [date, setDate] = useState(
    transaction?.date || format(new Date(), "yyyy-MM-dd")
  );
  const [repeat, setRepeat] = useState<RepeatFrequency>(
    transaction?.repeat || "never"
  );
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !categoryId || parseFloat(amount) <= 0) {
      alert("Please fill in all required fields with valid values");
      return;
    }

    const transactionData = {
      amount: parseFloat(amount),
      type,
      categoryId,
      accountType,
      note,
      date,
      repeat,
      isRecurringInstance: false,
    };

    if (transaction) {
      updateTransaction(transaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }

    onClose();
  };

  const handleDelete = () => {
    if (
      transaction &&
      confirm("Are you sure you want to delete this transaction?")
    ) {
      deleteTransaction(transaction.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {transaction ? "Edit Transaction" : "Add Transaction"}
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
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setType("expense")}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      type === "expense"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("income")}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      type === "income"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <button
                  type="button"
                  onClick={() => setShowCategorySelector(true)}
                  className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:bg-gray-700"
                >
                  {selectedCategory ? (
                    <div className="flex items-center space-x-2">
                      <div
                        className={`p-2 rounded-lg ${selectedCategory.color}`}
                      >
                        <IconComponent
                          name={selectedCategory.icon}
                          className="w-4 h-4 text-white"
                        />
                      </div>
                      <span className="text-gray-900 dark:text-white">
                        {selectedCategory.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      Select category
                    </span>
                  )}
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account *
                </label>
                <select
                  value={accountType}
                  onChange={(e) =>
                    setAccountType(e.target.value as AccountType)
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="credit">Credit Card</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Note (optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={200}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Add a note..."
                />
              </div>

              {/* Repeat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Repeat
                </label>
                <select
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value as RepeatFrequency)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="never">Never</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              {transaction && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
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
                {transaction ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <CategorySelectorModal
        isOpen={showCategorySelector}
        onClose={() => setShowCategorySelector(false)}
        onSelect={setCategoryId}
        type={type}
      />
    </>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function Dashboard() {
  const transactions = useStore((state) => state.transactions);
  const categories = useStore((state) => state.categories);
  const budgets = useStore((state) => state.budgets);
  const isLoading = useStore((state) => state.isLoading);
  const loadData = useStore((state) => state.loadData);
  const lastSaved = useStore((state) => state.lastSaved);

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >();
  const [autoSaveStatus, setAutoSaveStatus] = useState("Saved");

  console.log(showTransactionModal);

  // Initialize app data on first render
  useEffect(() => {
    loadData();
  }, []);

  // Auto-save transactions every 3 seconds to prevent data loss
  useEffect(() => {
    const interval = setInterval(() => {
      setAutoSaveStatus("Saving...");
      asyncSaveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions).then(() => {
        setAutoSaveStatus("Saved");
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [transactions]);

  // Recalculate account balances whenever transactions change
  useEffect(() => {
    const updateBalances = () => {
      const balances = DEFAULT_ACCOUNTS.map((account) => ({
        ...account,
        balance: calculateAccountBalance(transactions, account.type),
      }));
      // Balances are now up to date
    };
    updateBalances();
  }, [transactions]);

  // Sync with storage after save operations to ensure data consistency
  useEffect(() => {
    if (lastSaved && !isLoading) {
      setTimeout(() => {
        loadData();
      }, 500);
    }
  }, [lastSaved]);

  // Calculate current month data
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());
  const currentMonthTransactions = filterByDateRange(
    transactions,
    currentMonthStart,
    currentMonthEnd
  );

  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  // Calculate account balances
  const accountBalances = DEFAULT_ACCOUNTS.map((account) => ({
    ...account,
    balance: calculateAccountBalance(transactions, account.type),
  }));

  // Get recent transactions (last 10)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // Calculate budget progress (top 5)
  const currentMonth = format(new Date(), "yyyy-MM");
  const monthlyBudgets = budgets.filter(
    (b) => b.period === "monthly" && (!b.month || b.month === currentMonth)
  );

  const budgetProgress = monthlyBudgets
    .map((budget) => {
      const category = categories.find((c) => c.id === budget.categoryId);
      const spent = currentMonthTransactions
        .filter(
          (t) => t.categoryId === budget.categoryId && t.type === "expense"
        )
        .reduce((sum, t) => sum + t.amount, 0);

      return { budget, category, spent };
    })
    .filter((item) => item.category)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);

  // Prepare chart data (last 6 months)
  const last6Months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date(),
  });

  const chartData = {
    labels: last6Months.map((month) => format(month, "MMM")),
    datasets: [
      {
        label: "Income",
        data: last6Months.map((month) => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          const monthTransactions = filterByDateRange(
            transactions,
            monthStart,
            monthEnd
          );
          return monthTransactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
        }),
        borderColor: COLORS.income.primary,
        backgroundColor: COLORS.income.light,
        fill: true,
      },
      {
        label: "Expenses",
        data: last6Months.map((month) => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          const monthTransactions = filterByDateRange(
            transactions,
            monthStart,
            monthEnd
          );
          return monthTransactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);
        }),
        borderColor: COLORS.expense.primary,
        backgroundColor: COLORS.expense.light,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
      },
      tooltip: {
        enabled: true,
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
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {format(new Date(), "MMMM yyyy")}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={TrendingUp}
          color="green"
        />
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          color="red"
        />
        <SummaryCard
          title="Net Balance"
          value={formatCurrency(netBalance)}
          icon={DollarSign}
          color="blue"
        />
        <SummaryCard
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          icon={PiggyBank}
          color="purple"
        />
      </div>

      {/* Account Balances */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Account Balances
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {accountBalances.map((account) => (
            <div
              key={account.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 shadow-sm"
              style={{ borderLeftColor: account.color }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {account.name}
                </span>
                <IconComponent
                  name={account.icon}
                  className="w-5 h-5 text-gray-400"
                />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(account.balance)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions & Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Transactions
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  category={categories.find(
                    (c) => c.id === transaction.categoryId
                  )}
                  onEdit={() => {
                    setEditingTransaction(transaction);
                    setShowTransactionModal(true);
                  }}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  No transactions yet
                </p>
                <button
                  onClick={() => setShowTransactionModal(true)}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Add your first transaction
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Budget Overview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Budget Overview
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {budgetProgress.length > 0 ? (
              budgetProgress.map(
                ({ budget, category, spent }) =>
                  category && (
                    <BudgetProgressCard
                      key={budget.id}
                      budget={budget}
                      category={category}
                      spent={spent}
                    />
                  )
              )
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  No budgets set
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Set budgets to track your spending
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mini Trend Chart */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          6-Month Trend
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => {
          setShowTransactionModal(false);
          setEditingTransaction(undefined);
        }}
        transaction={editingTransaction}
      />
    </div>
  );
}
