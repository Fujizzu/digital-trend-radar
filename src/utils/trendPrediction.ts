
export interface TrendPrediction {
  forecast: number[];
  confidence: number;
  timeframe: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface DataPoint {
  value: number;
  timestamp: string;
}

export function predictTrend(historicalData: DataPoint[], weeksAhead: number = 4): TrendPrediction {
  if (historicalData.length < 3) {
    return {
      forecast: [],
      confidence: 0,
      timeframe: `${weeksAhead} weeks`,
      trend: 'stable'
    };
  }
  
  // Simple linear regression
  const n = historicalData.length;
  const x = historicalData.map((_, i) => i);
  const y = historicalData.map(d => d.value);
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Generate forecast
  const forecast: number[] = [];
  const lastIndex = n - 1;
  
  for (let i = 1; i <= weeksAhead * 7; i++) { // Daily predictions for weeks
    const predictedValue = Math.max(0, slope * (lastIndex + i) + intercept);
    forecast.push(Math.round(predictedValue));
  }
  
  // Calculate confidence based on data consistency
  const predictions = x.map(xi => slope * xi + intercept);
  const errors = y.map((yi, i) => Math.abs(yi - predictions[i]));
  const meanError = errors.reduce((a, b) => a + b, 0) / errors.length;
  const meanValue = sumY / n;
  const confidence = Math.max(0, Math.min(1, 1 - (meanError / meanValue)));
  
  // Determine trend direction
  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (slope > 0.1) {
    trend = 'increasing';
  } else if (slope < -0.1) {
    trend = 'decreasing';
  }
  
  return {
    forecast,
    confidence,
    timeframe: `${weeksAhead} weeks`,
    trend
  };
}
