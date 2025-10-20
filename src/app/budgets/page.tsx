"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
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
  Pencil,
  Trash2,
} from "lucide-react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  isWithinInterval,
} from "date-fns";
import { create } from "zustand";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
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

interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: "monthly" | "yearly";
  month?: string;
}

interface AppState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, "id">) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  initializeData: () => void;
}

// ============================================================================
// CONSTANTS & DATA
// ============================================================================

const STORAGE_KEYS = {
  TRANSACTIONS: "financial_app_transactions",
  CATEGORIES: "financial_app_categories",
  BUDGETS: "financial_app_budgets",
};

const COLORS = {
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
  budgets: [],

  addBudget: (budget) => {
    const newBudget: Budget = {
      ...budget,
      id: generateId(),
    };
    set((state) => {
      const newBudgets = [...state.budgets, newBudget];
      saveToStorage(STORAGE_KEYS.BUDGETS, newBudgets);
      return { budgets: newBudgets };
    });
  },

  updateBudget: (id, updates) => {
    set((state) => {
      const newBudgets = state.budgets.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      );
      saveToStorage(STORAGE_KEYS.BUDGETS, newBudgets);
      return { budgets: newBudgets };
    });
  },

  deleteBudget: (id) => {
    set((state) => {
      const newBudgets = state.budgets.filter((b) => b.id !== id);
      saveToStorage(STORAGE_KEYS.BUDGETS, newBudgets);
      return { budgets: newBudgets };
    });
  },

  initializeData: () => {
    const storedTransactions = loadFromStorage(STORAGE_KEYS.TRANSACTIONS);
    const storedBudgets = loadFromStorage(STORAGE_KEYS.BUDGETS);

    set({
      transactions: storedTransactions || [],
      budgets: storedBudgets || [],
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

// Budget Card Component
function BudgetCard({
  budget,
  category,
  spent,
  onEdit,
  onDelete,
}: {
  budget: Budget;
  category: Category;
  spent: number;
  onEdit: () => void;
  onDelete: () => void;
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
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`p-3 rounded-lg ${
              parentCategory?.color || "bg-gray-200"
            }`}
          >
            <IconComponent
              name={parentCategory?.icon || "MoreHorizontal"}
              className="w-6 h-6 text-white"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {category.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monthly Budget
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Budgeted</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(budget.amount)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Spent</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(spent)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Remaining</span>
          <span
            className={`font-semibold ${
              remaining >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {formatCurrency(Math.abs(remaining))}
          </span>
        </div>

        <div className="pt-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
            <span>{Math.round(percentage)}% used</span>
            <span>
              {remaining >= 0
                ? `${formatCurrency(remaining)} left`
                : `${formatCurrency(Math.abs(remaining))} over`}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all"
              style={{
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: progressColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Selector Modal Component
function CategorySelectorModal({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (categoryId: string) => void;
}) {
  const [expandedParents, setExpandedParents] = useState<Set<string>>(
    new Set()
  );
  const categories = useStore((state) => state.categories);

  const expenseCategories = categories.filter(
    (c) => c.type === "expense" || c.type === "both"
  );
  const parentCategories = expenseCategories.filter((c) => c.parentId === null);

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
          <div className="flex items-center justify-between">
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
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {parentCategories.map((parent) => {
              const children = expenseCategories.filter(
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
                      <ChevronLeft className="w-5 h-5 text-gray-400" />
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

// Add/Edit Budget Modal Component
function BudgetModal({
  isOpen,
  onClose,
  budget,
}: {
  isOpen: boolean;
  onClose: () => void;
  budget?: Budget;
}) {
  const addBudget = useStore((state) => state.addBudget);
  const updateBudget = useStore((state) => state.updateBudget);
  const categories = useStore((state) => state.categories);

  const [categoryId, setCategoryId] = useState(budget?.categoryId || "");
  const [amount, setAmount] = useState(budget?.amount.toString() || "");
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !categoryId || parseFloat(amount) <= 0) {
      alert("Please fill in all required fields with valid values");
      return;
    }

    const budgetData = {
      categoryId,
      amount: parseFloat(amount),
      period: "monthly" as const,
      month: format(new Date(), "yyyy-MM"),
    };

    if (budget) {
      updateBudget(budget.id, budgetData);
    } else {
      addBudget(budgetData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
          <form onSubmit={handleSubmit}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {budget ? "Edit Budget" : "Add Budget"}
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
                  Period
                </label>
                <input
                  type="text"
                  value="Monthly"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
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
                {budget ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <CategorySelectorModal
        isOpen={showCategorySelector}
        onClose={() => setShowCategorySelector(false)}
        onSelect={setCategoryId}
      />
    </>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function BudgetsPage() {
  const transactions = useStore((state) => state.transactions);
  const categories = useStore((state) => state.categories);
  const budgets = useStore((state) => state.budgets);
  const deleteBudget = useStore((state) => state.deleteBudget);
  const initializeData = useStore((state) => state.initializeData);

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Calculate month range
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const monthString = format(selectedMonth, "yyyy-MM");

  // Filter transactions for selected month
  const monthTransactions = filterByDateRange(
    transactions,
    monthStart,
    monthEnd
  );

  // Get budgets for selected month
  const monthBudgets = budgets.filter(
    (b) => b.period === "monthly" && (!b.month || b.month === monthString)
  );

  // Calculate budget data
  const budgetData = monthBudgets
    .map((budget) => {
      const category = categories.find((c) => c.id === budget.categoryId);
      const spent = monthTransactions
        .filter(
          (t) => t.categoryId === budget.categoryId && t.type === "expense"
        )
        .reduce((sum, t) => sum + t.amount, 0);

      return { budget, category, spent };
    })
    .filter((item) => item.category);

  // Calculate totals
  const totalBudgeted = budgetData.reduce(
    (sum, item) => sum + item.budget.amount,
    0
  );
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);
  const overallPercentage =
    totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
  const categoriesOverBudget = budgetData.filter(
    (item) => item.spent > item.budget.amount
  ).length;

  // Prepare chart data
  const chartData = {
    labels: budgetData.map((item) => item.category!.name),
    datasets: [
      {
        label: "Budgeted",
        data: budgetData.map((item) => item.budget.amount),
        backgroundColor: "#3b82f6",
      },
      {
        label: "Spent",
        data: budgetData.map((item) => item.spent),
        backgroundColor: "#ef4444",
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

  // Generate insights
  const insights = useMemo(() => {
    const insightsList: Array<{
      type: "success" | "warning" | "error" | "info";
      message: string;
    }> = [];

    budgetData.forEach((item) => {
      const percentage = (item.spent / item.budget.amount) * 100;
      const remaining = item.budget.amount - item.spent;

      if (percentage > 100) {
        insightsList.push({
          type: "error",
          message: `You're over budget on ${
            item.category!.name
          } by ${formatCurrency(Math.abs(remaining))}`,
        });
      } else if (percentage < 50 && remaining > 0) {
        insightsList.push({
          type: "success",
          message: `Great! You saved ${formatCurrency(remaining)} on ${
            item.category!.name
          }`,
        });
      } else if (percentage >= 90 && percentage <= 100) {
        insightsList.push({
          type: "warning",
          message: `You're almost at your ${
            item.category!.name
          } budget limit (${Math.round(percentage)}%)`,
        });
      }
    });

    // Find categories without budgets
    const expenseCategories = categories.filter(
      (c) => (c.type === "expense" || c.type === "both") && c.parentId !== null
    );
    const categoriesWithSpending = monthTransactions
      .filter((t) => t.type === "expense")
      .map((t) => t.categoryId);
    const uniqueSpendingCategories = Array.from(
      new Set(categoriesWithSpending)
    );

    const noBudgetCategories = uniqueSpendingCategories.filter(
      (catId) => !budgetData.find((item) => item.budget.categoryId === catId)
    );

    if (noBudgetCategories.length > 0) {
      const categoryNames = noBudgetCategories
        .slice(0, 3)
        .map((id) => categories.find((c) => c.id === id)?.name)
        .filter(Boolean)
        .join(", ");

      insightsList.push({
        type: "info",
        message: `You haven't set budgets for: ${categoryNames}${
          noBudgetCategories.length > 3
            ? ` and ${noBudgetCategories.length - 3} more`
            : ""
        }`,
      });
    }

    return insightsList;
  }, [budgetData, monthTransactions, categories]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Budgets
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Plan and track your spending
        </p>
      </div>

      {/* Month Selector and Add Budget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white min-w-[180px] text-center">
            {format(selectedMonth, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <button
          onClick={() => {
            setEditingBudget(undefined);
            setShowBudgetModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Budget
        </button>
      </div>

      {/* Budget Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Budget Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Budgeted
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalBudgeted)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Spent
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Remaining
            </p>
            <p
              className={`text-2xl font-bold ${
                totalBudgeted - totalSpent >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatCurrency(Math.abs(totalBudgeted - totalSpent))}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Over Budget
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {categoriesOverBudget}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(overallPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all"
              style={{
                width: `${Math.min(overallPercentage, 100)}%`,
                backgroundColor:
                  overallPercentage >= 100
                    ? COLORS.budget.danger
                    : overallPercentage >= 70
                    ? COLORS.budget.warning
                    : COLORS.budget.good,
              }}
            />
          </div>
        </div>
      </div>

      {/* Budget Cards Grid */}
      {budgetData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {budgetData.map(
            ({ budget, category, spent }) =>
              category && (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  category={category}
                  spent={spent}
                  onEdit={() => {
                    setEditingBudget(budget);
                    setShowBudgetModal(true);
                  }}
                  onDelete={() => {
                    if (
                      confirm("Are you sure you want to delete this budget?")
                    ) {
                      deleteBudget(budget.id);
                    }
                  }}
                />
              )
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <p className="text-gray-500 dark:text-gray-400">
            No budgets set for this month
          </p>
          <button
            onClick={() => setShowBudgetModal(true)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first budget
          </button>
        </div>
      )}

      {/* Budget vs Actual Chart */}
      {budgetData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Budget vs Actual
          </h2>
          <div className="h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Insights Section */}
      {insights.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Insights
          </h2>
          <div className="space-y-3">
            {insights.map((insight, index) => {
              const config = {
                success: {
                  icon: CheckCircle,
                  color: "text-green-600 dark:text-green-400",
                  bg: "bg-green-50 dark:bg-green-900/20",
                },
                warning: {
                  icon: AlertCircle,
                  color: "text-amber-600 dark:text-amber-400",
                  bg: "bg-amber-50 dark:bg-amber-900/20",
                },
                error: {
                  icon: AlertCircle,
                  color: "text-red-600 dark:text-red-400",
                  bg: "bg-red-50 dark:bg-red-900/20",
                },
                info: {
                  icon: TrendingUp,
                  color: "text-blue-600 dark:text-blue-400",
                  bg: "bg-blue-50 dark:bg-blue-900/20",
                },
              };

              const { icon: Icon, color, bg } = config[insight.type];

              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-lg ${bg}`}
                >
                  <Icon className={`w-5 h-5 mt-0.5 ${color}`} />
                  <p className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                    {insight.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={showBudgetModal}
        onClose={() => {
          setShowBudgetModal(false);
          setEditingBudget(undefined);
        }}
        budget={editingBudget}
      />
    </div>
  );
}
