"use client";

import { MetricData } from "@/lib/mockData";
import { X } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

interface MetricWidgetProps {
  metricId: string;
  metric: MetricData | null | undefined;
  isLoading: boolean;
  error?: string;
  onRemove: () => void;
}

// Color palette for charts
const COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
];

export default function MetricWidget({
  metricId,
  metric,
  isLoading,
  error,
  onRemove,
}: MetricWidgetProps) {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Animation for mount/unmount
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle removal with animation
  const handleRemove = () => {
    setVisible(false);
    setTimeout(() => {
      onRemove();
    }, 300); // Duration of the fade-out animation
  };

  if (!visible) {
    return null;
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
          <button className="text-gray-400 hover:text-gray-600" onClick={handleRemove}>
            <X size={18} />
          </button>
        </div>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  // Error state
  if (error || !metric) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-red-200 p-4 transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-red-600">Error Loading Metric</h3>
          <button className="text-gray-400 hover:text-gray-600" onClick={handleRemove}>
            <X size={18} />
          </button>
        </div>
        <div className="bg-red-50 text-red-500 p-4 rounded">
          {error || "Failed to load metric data"}
        </div>
      </div>
    );
  }

  // Render appropriate chart based on chartType
  const renderChart = () => {
    switch (metric.chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metric.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metric.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={metric.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" fill="#3b82f6" stroke="#2563eb" />
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metric.data as any[]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent as any * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {metric.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{metric.name}</h3>
        <button className="text-gray-400 hover:text-gray-600" onClick={handleRemove}>
          <X size={18} />
        </button>
      </div>
      {renderChart()}
    </div>
  );
}
