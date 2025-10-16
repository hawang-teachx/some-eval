"use client";

import { MetricItem, getAllChildIds } from "@/lib/metricsConfig";
import { useState } from "react";

interface CheckboxGroupProps {
  item: MetricItem;
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[], action: "add" | "remove") => void;
  level?: number;
}

export default function CheckboxGroup({
  item,
  selectedItems,
  onSelectionChange,
  level = 0,
}: CheckboxGroupProps) {
  // States for the current item and its children
  const [checked, setChecked] = useState(false);

  // Toggle checkbox state
  const handleToggle = () => {
    const newChecked = !checked;
    let selectedIds: string[] = [item.id]; // Only include the current item's ID
    let action: "add" | "remove" = newChecked ? "add" : "remove";

    onSelectionChange(selectedIds, action);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center">
        <div
          className={`ml-${level * 4} flex items-center`}
          style={{ marginLeft: `${level * 0.75}rem` }}
        >
          <div
            className={`flex h-5 w-5 items-center justify-center rounded border`}
            onClick={handleToggle}
          >
          </div>
          <span className="ml-2 text-sm font-medium cursor-pointer" onClick={handleToggle}>
            {item.name}
          </span>
        </div>
      </div>

      {item.children && item.children.length > 0 && (
        <div className="space-y-1">
          {item.children.map((child) => (
            <CheckboxGroup
              key={child.id}
              item={child}
              selectedItems={selectedItems}
              onSelectionChange={onSelectionChange}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
