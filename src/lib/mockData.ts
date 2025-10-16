// Types for chart data
export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface MetricData {
  metricId: string;
  name: string;
  chartType: 'bar' | 'line' | 'area' | 'pie';
  data: ChartDataPoint[];
}

// Helper to generate random data
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Mock data mappings
const mockDataConfigs: Record<string, {
  name: string;
  chartType: 'bar' | 'line' | 'area' | 'pie';
  dataPoints: string[];
}> = {
  'page-views-by-country': {
    name: 'Page Views by Country',
    chartType: 'bar',
    dataPoints: ['USA', 'UK', 'Germany', 'Japan', 'Canada', 'Australia', 'France']
  },
  'page-views-by-device': {
    name: 'Page Views by Device Type',
    chartType: 'pie',
    dataPoints: ['Desktop', 'Mobile', 'Tablet']
  },
  'unique-visitors': {
    name: 'Unique Visitors',
    chartType: 'line',
    dataPoints: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  },
  'bounce-rate': {
    name: 'Bounce Rate',
    chartType: 'area',
    dataPoints: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  'total-sales': {
    name: 'Total Sales',
    chartType: 'bar',
    dataPoints: ['Q1', 'Q2', 'Q3', 'Q4']
  },
  'avg-order-value': {
    name: 'Average Order Value',
    chartType: 'line',
    dataPoints: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  },
  'conversion-rate': {
    name: 'Conversion Rate',
    chartType: 'area',
    dataPoints: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  },
  'time-on-site': {
    name: 'Time on Site',
    chartType: 'line',
    dataPoints: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  'pages-per-session': {
    name: 'Pages per Session',
    chartType: 'bar',
    dataPoints: ['New Users', 'Returning Users', 'Subscribers']
  }
};

// Generate mock data for specific metricId
export function generateMockData(metricId: string): MetricData {
  const config = mockDataConfigs[metricId];
  
  if (!config) {
    // Fallback for unknown metrics
    return {
      metricId,
      name: `Data for ${metricId}`,
      chartType: 'bar',
      data: [
        { name: 'Sample 1', value: 1200 },
        { name: 'Sample 2', value: 2100 }
      ]
    };
  }

  return {
    metricId,
    name: config.name,
    chartType: config.chartType,
    data: config.dataPoints.map(point => ({
      name: point,
      value: getRandomNumber(100, 5000)
    }))
  };
}
