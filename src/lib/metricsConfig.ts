export interface MetricItem {
  id: string;
  name: string;
  children?: MetricItem[];
}

export const metricsConfig: MetricItem[] = [
  {
    id: "traffic-metrics",
    name: "Traffic Metrics",
    children: [
      {
        id: "page-views",
        name: "Page Views",
        children: [
          {
            id: "page-views-by-country",
            name: "By Country"
          },
          {
            id: "page-views-by-device",
            name: "By Device Type"
          }
        ]
      },
      {
        id: "unique-visitors",
        name: "Unique Visitors"
      },
      {
        id: "bounce-rate",
        name: "Bounce Rate"
      }
    ]
  },
  {
    id: "revenue-metrics",
    name: "Revenue Metrics",
    children: [
      {
        id: "total-sales",
        name: "Total Sales"
      },
      {
        id: "avg-order-value",
        name: "Average Order Value"
      },
      {
        id: "conversion-rate",
        name: "Conversion Rate"
      }
    ]
  },
  {
    id: "user-engagement",
    name: "User Engagement",
    children: [
      {
        id: "time-on-site",
        name: "Time on Site"
      },
      {
        id: "pages-per-session",
        name: "Pages per Session"
      }
    ]
  }
];

// Helper functions for checkbox tree
export function getAllChildIds(item: MetricItem): string[] {
  const ids: string[] = [item.id];
  if (item.children) {
    item.children.forEach(child => {
      ids.push(...getAllChildIds(child));
    });
  }
  return ids;
}

// Find a metric item by its ID in the metrics config
export function findMetricById(
  metrics: MetricItem[],
  id: string
): MetricItem | undefined {
  for (const metric of metrics) {
    if (metric.id === id) {
      return metric;
    }
    if (metric.children) {
      const found = findMetricById(metric.children, id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

// Check if a metric is a leaf node (has no children)
export function isLeafNode(item: MetricItem): boolean {
  return !item.children || item.children.length === 0;
}
