"use client";

import { useState } from "react";
import CheckboxTree from "./components/CheckboxTree";
import DashboardGrid from "./components/DashboardGrid";
import { metricsConfig } from "@/lib/metricsConfig";

export default function DashboardPage() {
  // State for selected metrics
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  // Update selected metrics
  const handleMetricsChange = (metrics: string[]) => {
    setSelectedMetrics(metrics);
  };

  // Remove a specific metric
  const handleRemoveMetric = (metricId: string) => {
    setSelectedMetrics((current) =>
      current.filter((id) => id !== metricId)
    );
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Select metrics to view your data</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar with checkboxes */}
        <div className="md:col-span-1">
          <CheckboxTree
            metrics={metricsConfig}
            selectedMetrics={selectedMetrics}
            onMetricsChange={handleMetricsChange}
          />
        </div>
        
        {/* Main dashboard area */}
        <div className="md:col-span-3">
          <DashboardGrid
            selectedMetrics={selectedMetrics}
            onRemoveMetric={handleRemoveMetric}
          />
        </div>
      </div>
    </div>
  );
}
