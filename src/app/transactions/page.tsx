"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronRight,
  Download,
  Trash2,
  Calendar,
  SortAsc,
  SortDesc,
  Check,
  MoreHorizontal,
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
  DollarSign,
  PiggyBank,
  CreditCard,
  WalletIcon,
  Banknote,
  Plus,
} from "lucide-react";
import {
  format,
  parseISO,
  startOfDay,
  startOfWeek,
  startOfMonth,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  isBefore,
  isAfter,
  isWithinInterval,
} from "date-fns";
import { create } from "zustand";

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
type SortField = "date" | "amount" | "category";
type SortOrder = "asc" | "desc";

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

interface AppState {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  deleteMultipleTransactions: (ids: string[]) => void;
  initializeData: () => void;
}

interface FilterState {
  searchQuery: string;
  startDate: string;
  endDate: string;
  type: "all" | TransactionType;
  categoryIds: string[];
  accountTypes: AccountType[];
  recurringFilter: "all" | "recurring" | "one-time";
  sortField: SortField;
  sortOrder: SortOrder;
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

function getDateGroupLabel(dateString: string): string {
  const date = parseISO(dateString);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date, { weekStartsOn: 0 })) return "This Week";
  if (isThisMonth(date)) return "This Month";
  if (isThisYear(date)) return format(date, "MMMM yyyy");
  return format(date, "MMMM yyyy");
}

function exportToCSV(transactions: Transaction[], categories: Category[]) {
  const headers = ["Date", "Type", "Category", "Account", "Amount", "Note"];
  const rows = transactions.map((t) => {
    const category = categories.find((c) => c.id === t.categoryId);
    return [
      t.date,
      t.type,
      category?.name || "Unknown",
      t.accountType,
      t.amount,
      t.note || "",
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions-${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

// ============================================================================
// ZUSTAND STORE
// ============================================================================

const useStore = create<AppState>((set) => ({
  transactions: [],
  categories: PREDEFINED_CATEGORIES,

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

  updateTransaction: (id, updates) => {
    set((state) => {
      const newTransactions = state.transactions.map((t) =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      );
      saveToStorage(STORAGE_KEYS.TRANSACTIONS, newTransactions);
      return { transactions: newTransactions };
    });
  },

  deleteTransaction: (id) => {
    set((state) => {
      const newTransactions = state.transactions.filter((t) => t.id !== id);
      saveToStorage(STORAGE_KEYS.TRANSACTIONS, newTransactions);
      return { transactions: newTransactions };
    });
  },

  deleteMultipleTransactions: (ids) => {
    set((state) => {
      const newTransactions = state.transactions.filter(
        (t) => !ids.includes(t.id)
      );
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
  isSelected,
  onSelect,
  onEdit,
}: {
  transaction: Transaction;
  category?: Category;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: () => void;
}) {
  const isIncome = transaction.type === "income";
  const parentCategory = category?.parentId
    ? PREDEFINED_CATEGORIES.find((c) => c.id === category.parentId)
    : category;

  return (
    <div
      className={`flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border transition-all ${
        isSelected
          ? "border-blue-500 shadow-md"
          : "border-gray-100 dark:border-gray-700 hover:shadow-md"
      }`}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onSelect(e.target.checked)}
        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Transaction Info */}
      <div className="flex items-center flex-1 cursor-pointer" onClick={onEdit}>
        <div
          className={`p-2 rounded-lg ${
            parentCategory?.color || "bg-gray-200"
          } mr-4`}
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
            {transaction.repeat !== "never" && (
              <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                Recurring
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right">
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

// Category Selector Modal Component
function CategorySelectorModal({
  isOpen,
  onClose,
  onSelect,
  selectedIds,
  multiSelect = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (categoryIds: string[]) => void;
  selectedIds: string[];
  multiSelect?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedParents, setExpandedParents] = useState<Set<string>>(
    new Set()
  );
  const [localSelected, setLocalSelected] = useState<Set<string>>(
    new Set(selectedIds)
  );
  const categories = useStore((state) => state.categories);

  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

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

  const handleSelect = (categoryId: string) => {
    if (multiSelect) {
      const newSelected = new Set(localSelected);
      if (newSelected.has(categoryId)) {
        newSelected.delete(categoryId);
      } else {
        newSelected.add(categoryId);
      }
      setLocalSelected(newSelected);
    } else {
      onSelect([categoryId]);
      onClose();
    }
  };

  const handleApply = () => {
    onSelect(Array.from(localSelected));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {multiSelect ? "Select Categories" : "Select Category"}
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
                          onClick={() => handleSelect(child.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                            localSelected.has(child.id)
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : "hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${child.color}`}>
                              <IconComponent
                                name={child.icon}
                                className="w-4 h-4 text-white"
                              />
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {child.name}
                            </span>
                          </div>
                          {multiSelect && localSelected.has(child.id) && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {multiSelect && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
            <button
              onClick={() => {
                setLocalSelected(new Set());
                onSelect([]);
                onClose();
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => onClose()}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Apply ({localSelected.size})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Transaction Modal Component
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account *
                </label>
                <select
                  value={accountType}
                  onChange={(e) =>
                    setAccountType(e.target.value as AccountType)
                  }
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Repeat
                </label>
                <select
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value as RepeatFrequency)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
        onSelect={(ids) => setCategoryId(ids[0])}
        selectedIds={categoryId ? [categoryId] : []}
        multiSelect={false}
      />
    </>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function TransactionsPage() {
  const transactions = useStore((state) => state.transactions);
  const categories = useStore((state) => state.categories);
  const deleteMultipleTransactions = useStore(
    (state) => state.deleteMultipleTransactions
  );
  const initializeData = useStore((state) => state.initializeData);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    startDate: "",
    endDate: "",
    type: "all",
    categoryIds: [],
    accountTypes: [],
    recurringFilter: "all",
    sortField: "date",
    sortOrder: "desc",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(
    new Set()
  );
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >();
  const [displayCount, setDisplayCount] = useState(50);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    const handleOpenAddTransaction = () => {
      setEditingTransaction(undefined);
      setShowTransactionModal(true);
    };

    window.addEventListener("openAddTransaction", handleOpenAddTransaction);
    return () =>
      window.removeEventListener(
        "openAddTransaction",
        handleOpenAddTransaction
      );
  }, []);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter((t) => {
        const category = categories.find((c) => c.id === t.categoryId);
        return (
          t.note?.toLowerCase().includes(query) ||
          category?.name.toLowerCase().includes(query) ||
          t.amount.toString().includes(query)
        );
      });
    }

    // Date range filter
    if (filters.startDate) {
      const startDate = startOfDay(parseISO(filters.startDate));
      result = result.filter((t) => !isBefore(parseISO(t.date), startDate));
    }
    if (filters.endDate) {
      const endDate = startOfDay(parseISO(filters.endDate));
      result = result.filter((t) => !isAfter(parseISO(t.date), endDate));
    }

    // Type filter
    if (filters.type !== "all") {
      result = result.filter((t) => t.type === filters.type);
    }

    // Category filter
    if (filters.categoryIds.length > 0) {
      result = result.filter((t) => filters.categoryIds.includes(t.categoryId));
    }

    // Account filter
    if (filters.accountTypes.length > 0) {
      result = result.filter((t) =>
        filters.accountTypes.includes(t.accountType)
      );
    }

    // Recurring filter
    if (filters.recurringFilter === "recurring") {
      result = result.filter((t) => t.repeat !== "never");
    } else if (filters.recurringFilter === "one-time") {
      result = result.filter((t) => t.repeat === "never");
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortField) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          const catA =
            categories.find((c) => c.id === a.categoryId)?.name || "";
          const catB =
            categories.find((c) => c.id === b.categoryId)?.name || "";
          comparison = catA.localeCompare(catB);
          break;
      }

      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, categories, filters]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};

    filteredTransactions.slice(0, displayCount).forEach((transaction) => {
      const label = getDateGroupLabel(transaction.date);
      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(transaction);
    });

    return groups;
  }, [filteredTransactions, displayCount]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(
        filteredTransactions.slice(0, displayCount).map((t) => t.id)
      );
      setSelectedTransactions(allIds);
    } else {
      setSelectedTransactions(new Set());
    }
  };

  const handleSelectTransaction = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedTransactions);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedTransactions(newSelected);
  };

  const handleBulkDelete = () => {
    if (selectedTransactions.size === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedTransactions.size} transaction(s)?`
      )
    ) {
      deleteMultipleTransactions(Array.from(selectedTransactions));
      setSelectedTransactions(new Set());
    }
  };

  const handleExport = () => {
    const transactionsToExport =
      selectedTransactions.size > 0
        ? filteredTransactions.filter((t) => selectedTransactions.has(t.id))
        : filteredTransactions;

    exportToCSV(transactionsToExport, categories);
  };

  const activeFilterCount = [
    filters.searchQuery,
    filters.startDate,
    filters.endDate,
    filters.type !== "all",
    filters.categoryIds.length > 0,
    filters.accountTypes.length > 0,
    filters.recurringFilter !== "all",
  ].filter(Boolean).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Transactions
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {filteredTransactions.length} transaction
          {filteredTransactions.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters({ ...filters, searchQuery: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              showFilters || activeFilterCount > 0
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value as any })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categories
              </label>
              <button
                onClick={() => setShowCategorySelector(true)}
                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 dark:text-white"
              >
                <span>
                  {filters.categoryIds.length === 0
                    ? "All Categories"
                    : `${filters.categoryIds.length} selected`}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Account Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Accounts
              </label>
              <div className="flex flex-wrap gap-2">
                {(
                  ["checking", "savings", "credit", "cash"] as AccountType[]
                ).map((acc) => (
                  <button
                    key={acc}
                    onClick={() => {
                      const newAccounts = filters.accountTypes.includes(acc)
                        ? filters.accountTypes.filter((a) => a !== acc)
                        : [...filters.accountTypes, acc];
                      setFilters({ ...filters, accountTypes: newAccounts });
                    }}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filters.accountTypes.includes(acc)
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {acc}
                  </button>
                ))}
              </div>
            </div>

            {/* Recurring Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recurring
              </label>
              <select
                value={filters.recurringFilter}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    recurringFilter: e.target.value as any,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="recurring">Recurring Only</option>
                <option value="one-time">One-time Only</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() =>
                  setFilters({
                    searchQuery: "",
                    startDate: "",
                    endDate: "",
                    type: "all",
                    categoryIds: [],
                    accountTypes: [],
                    recurringFilter: "all",
                    sortField: "date",
                    sortOrder: "desc",
                  })
                }
                className="w-full px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sort and Bulk Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          {/* Select All */}
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={
                selectedTransactions.size > 0 &&
                selectedTransactions.size ===
                  Math.min(filteredTransactions.length, displayCount)
              }
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            Select All
          </label>

          {/* Bulk Actions */}
          {selectedTransactions.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedTransactions.size})
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Sort by:
          </span>
          <select
            value={filters.sortField}
            onChange={(e) =>
              setFilters({ ...filters, sortField: e.target.value as SortField })
            }
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
          </select>
          <button
            onClick={() =>
              setFilters({
                ...filters,
                sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
              })
            }
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {filters.sortOrder === "asc" ? (
              <SortAsc className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <SortDesc className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-6">
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.entries(groupedTransactions).map(([label, transactions]) => (
            <div key={label}>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {label}
              </h3>
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    category={categories.find(
                      (c) => c.id === transaction.categoryId
                    )}
                    isSelected={selectedTransactions.has(transaction.id)}
                    onSelect={(checked) =>
                      handleSelectTransaction(transaction.id, checked)
                    }
                    onEdit={() => {
                      setEditingTransaction(transaction);
                      setShowTransactionModal(true);
                    }}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              No transactions found
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

      {/* Load More */}
      {filteredTransactions.length > displayCount && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setDisplayCount(displayCount + 50)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Load More ({filteredTransactions.length - displayCount} remaining)
          </button>
        </div>
      )}

      {/* Modals */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => {
          setShowTransactionModal(false);
          setEditingTransaction(undefined);
        }}
        transaction={editingTransaction}
      />

      <CategorySelectorModal
        isOpen={showCategorySelector}
        onClose={() => setShowCategorySelector(false)}
        onSelect={(ids) => setFilters({ ...filters, categoryIds: ids })}
        selectedIds={filters.categoryIds}
        multiSelect={true}
      />
    </div>
  );
}
