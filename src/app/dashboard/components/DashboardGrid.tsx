"use client";

import { MetricData } from "@/lib/mockData";
import { useEffect, useState } from "react";
import MetricWidget from "./MetricWidget";

interface DashboardGridProps {
  selectedMetrics: string[];
  onRemoveMetric: (metricId: string) => void;
}

export default function DashboardGrid({
  selectedMetrics,
  onRemoveMetric,
}: DashboardGridProps) {
  const [metrics, setMetrics] = useState<Record<string, MetricData | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string>>({});

  // Fetch data for selected metrics
  useEffect(() => {
    // Handle new metrics being added
    const fetchNewMetrics = async () => {
      for (const metricId of selectedMetrics) {
        // Skip if we already have data or are currently loading this metric
        if (metrics[metricId] !== undefined || loading[metricId]) continue;
        
        // Mark as loading and fetch data
        setLoading(prev => ({ ...prev, [metricId]: true }));
        
        try {
          // Add to dashboard via API
          await fetch('/api/metrics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ metricId }),
          });
          
          // Fetch metric data
          const response = await fetch(`/api/metrics/${metricId}`);
          
          if (!response.ok) throw new Error('Failed to fetch metric data');
          
          const data = await response.json();
          setMetrics(prev => ({ ...prev, [metricId]: data }));
        } catch (err) {
          console.error(`Error fetching data for ${metricId}:`, err);
          setError(prev => ({
            ...prev,
            [metricId]: err instanceof Error ? err.message : 'Unknown error',
          }));
          setMetrics(prev => ({ ...prev, [metricId]: null }));
        } finally {
          setLoading(prev => ({ ...prev, [metricId]: false }));
        }
      }
    };

    // Clean up removed metrics
    const cleanupRemovedMetrics = async () => {
      const metricIds = Object.keys(metrics);
      
      for (const metricId of metricIds) {
        if (!selectedMetrics.includes(metricId)) {
          // Remove metric data from state
          setMetrics(prev => {
            const updated = { ...prev };
            delete updated[metricId];
            return updated;
          });
          
          setLoading(prev => {
            const updated = { ...prev };
            delete updated[metricId];
            return updated;
          });
          
          setError(prev => {
            const updated = { ...prev };
            delete updated[metricId];
            return updated;
          });
          
          // Call API to remove from dashboard
          try {
            await fetch('/api/metrics', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ metricId }),
            });
          } catch (err) {
            console.error(`Error removing metric ${metricId}:`, err);
          }
        }
      }
    };

    fetchNewMetrics();
    cleanupRemovedMetrics();
  }, [selectedMetrics, metrics, loading]);

  if (selectedMetrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">Select metrics from the sidebar to display charts</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {selectedMetrics.map((metricId) => (
        <MetricWidget
          key={metricId}
          metricId={metricId}
          metric={metrics[metricId]}
          isLoading={loading[metricId] || false}
          error={error[metricId]}
          onRemove={() => onRemoveMetric(metricId)}
        />
      ))}
    </div>
  );
}
