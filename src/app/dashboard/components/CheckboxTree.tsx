"use client";

import { MetricItem, isLeafNode } from "@/lib/metricsConfig";
import CheckboxGroup from "./CheckboxGroup";

interface CheckboxTreeProps {
  metrics: MetricItem[];
  selectedMetrics: string[];
  onMetricsChange: (selectedMetrics: string[]) => void;
}

export default function CheckboxTree({
  metrics,
  selectedMetrics,
  onMetricsChange,
}: CheckboxTreeProps) {
  // Handle selection changes from child checkboxes
  const handleSelectionChange = (
    selectedIds: string[],
    action: "add" | "remove"
  ) => {
    let updatedSelection = [...selectedMetrics];
    
    if (action === "add") {
      // Filter only leaf nodes (actual metrics, not categories)
      const leafIds = selectedIds.filter(id => {
        // Find the metric item by id in the full metrics tree
        const findItem = (items: MetricItem[]): MetricItem | undefined => {
          for (const item of items) {
            if (item.id === id) return item;
            if (item.children) {
              const found = findItem(item.children);
              if (found) return found;
            }
          }
          return undefined;
        };
        
        const item = findItem(metrics);
        return item ? isLeafNode(item) : false;
      });
      
      // Add all new leaf nodes
      updatedSelection = [...new Set([...updatedSelection, ...leafIds])];
    } else {
      // Remove all ids that need to be removed
      updatedSelection = updatedSelection.filter(
        id => !selectedIds.includes(id)
      );
    }
    
    onMetricsChange(updatedSelection);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Metrics</h2>
      <div className="space-y-2">
        {metrics.map((metric) => (
          <CheckboxGroup
            key={metric.id}
            item={metric}
            selectedItems={selectedMetrics}
            onSelectionChange={handleSelectionChange}
          />
        ))}
      </div>
    </div>
  );
}
