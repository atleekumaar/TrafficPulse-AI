import {
  ForecastHorizon,
  ForecastPoint,
  HourlyCongestionPoint,
  RushHourComparisonPoint,
  ModelBenchmark,
  EvaluationRecord,
  DataSourceStatus,
  CongestionCategory,
} from '@/types/traffic';

// 24-Hour Synthetic Benchmark Base Profile based on upstream UCI Minneapolis corridor patterns
const BASE_PROFILE = [
  { hour: 0, time: '00:00', base: 1250, cat: 'Low' as CongestionCategory },
  { hour: 1, time: '01:00', base: 950, cat: 'Low' as CongestionCategory },
  { hour: 2, time: '02:00', base: 780, cat: 'Low' as CongestionCategory },
  { hour: 3, time: '03:00', base: 820, cat: 'Low' as CongestionCategory },
  { hour: 4, time: '04:00', base: 1100, cat: 'Low' as CongestionCategory },
  { hour: 5, time: '05:00', base: 2200, cat: 'Low' as CongestionCategory },
  { hour: 6, time: '06:00', base: 3600, cat: 'Medium' as CongestionCategory },
  { hour: 7, time: '07:00', base: 4750, cat: 'High' as CongestionCategory },
  { hour: 8, time: '08:00', base: 5120, cat: 'High' as CongestionCategory },
  { hour: 9, time: '09:00', base: 4500, cat: 'Medium' as CongestionCategory },
  { hour: 10, time: '10:00', base: 3900, cat: 'Medium' as CongestionCategory },
  { hour: 11, time: '11:00', base: 4100, cat: 'Medium' as CongestionCategory },
  { hour: 12, time: '12:00', base: 4350, cat: 'Medium' as CongestionCategory },
  { hour: 13, time: '13:00', base: 4200, cat: 'Medium' as CongestionCategory },
  { hour: 14, time: '14:00', base: 4450, cat: 'Medium' as CongestionCategory },
  { hour: 15, time: '15:00', base: 4850, cat: 'High' as CongestionCategory },
  { hour: 16, time: '16:00', base: 5280, cat: 'High' as CongestionCategory },
  { hour: 17, time: '17:00', base: 5420, cat: 'High' as CongestionCategory },
  { hour: 18, time: '18:00', base: 4900, cat: 'High' as CongestionCategory },
  { hour: 19, time: '19:00', base: 3950, cat: 'Medium' as CongestionCategory },
  { hour: 20, time: '20:00', base: 3100, cat: 'Medium' as CongestionCategory },
  { hour: 21, time: '21:00', base: 2650, cat: 'Medium' as CongestionCategory },
  { hour: 22, time: '22:00', base: 2100, cat: 'Low' as CongestionCategory },
  { hour: 23, time: '23:00', base: 1600, cat: 'Low' as CongestionCategory },
];

export function getForecastSeries(horizon: ForecastHorizon): ForecastPoint[] {
  // Generates timeline around evening peak (14:00 to 21:00)
  // Past 6 steps have actual observations; future 3 steps represent forecast
  const hoursWindow = [14, 15, 16, 17, 18, 19, 20, 21];
  
  // Adjustment factors by forecast horizon
  const spreadMultiplier = horizon === 15 ? 0.04 : horizon === 30 ? 0.07 : 0.12;

  return hoursWindow.map((h, idx) => {
    const p = BASE_PROFILE[h];
    const isFuture = idx >= 5; // hours 19, 20, 21 are forecast period
    
    // Slight variation for simulation
    const noise = Math.sin(h * 0.7) * 90;
    const actual = isFuture ? null : Math.round(p.base + noise);
    
    // Predicted curve with horizon sensitivity
    const predOffset = (horizon === 60 ? 110 : horizon === 30 ? 60 : 25) * Math.cos(h);
    const predicted = Math.round(p.base + predOffset);
    
    const margin = Math.round(predicted * spreadMultiplier);

    let congestionLevel: CongestionCategory = 'Low';
    if (predicted >= 4700) congestionLevel = 'High';
    else if (predicted >= 2500) congestionLevel = 'Medium';

    return {
      timeLabel: p.time,
      timestamp: `2026-10-11T${p.time}:00Z`,
      actualVolume: actual,
      predictedVolume: predicted,
      confidenceLower: Math.max(200, predicted - margin),
      confidenceUpper: predicted + margin,
      congestionLevel,
      isForecastPeriod: isFuture,
    };
  });
}

export const hourlyCongestionData: HourlyCongestionPoint[] = BASE_PROFILE.map((item) => ({
  hour: item.hour,
  label: item.time,
  avgVolume: item.base,
  congestionLevel: item.cat,
  isRushHour: (item.hour >= 7 && item.hour <= 9) || (item.hour >= 16 && item.hour <= 19),
}));

export const rushHourComparisonData: RushHourComparisonPoint[] = BASE_PROFILE.map((item) => {
  const isRush = (item.hour >= 7 && item.hour <= 9) || (item.hour >= 16 && item.hour <= 19);
  const weekday = item.base;
  const weekend = Math.round(item.base * 0.68 + (item.hour >= 11 && item.hour <= 17 ? 400 : -200));
  return {
    hour: item.hour,
    label: item.time,
    weekdayVolume: weekday,
    weekendVolume: weekend,
    rushHourIntensity: isRush ? 1.0 : 0.2,
  };
});

export const upstreamModelBenchmarks: ModelBenchmark[] = [
  {
    modelName: 'Random Forest Regressor',
    task: 'regression',
    algorithm: 'Ensemble Random Forest (100 estimators, max_depth=20)',
    primaryMetricName: 'R² Score',
    primaryMetricValue: 0.9465,
    secondaryMetricName: 'MAE (vehicles/hr)',
    secondaryMetricValue: 341.77,
    status: 'active',
    notes: 'Preserved from upstream test benchmark. 38.2 MB binary recovered from Git LFS.',
  },
  {
    modelName: 'Gradient Boosting Regressor',
    task: 'regression',
    algorithm: 'Gradient Boosting (100 estimators, lr=0.1)',
    primaryMetricName: 'R² Score',
    primaryMetricValue: 0.9447,
    secondaryMetricName: 'MAE (vehicles/hr)',
    secondaryMetricValue: 347.84,
    status: 'version_incompatible',
    notes: 'Pickle requires scikit-learn 1.7.2. Fails in scikit-learn 1.9 due to _loss refactor.',
  },
  {
    modelName: 'Linear Regression Baseline',
    task: 'regression',
    algorithm: 'OLS Linear Regression with 43 features',
    primaryMetricName: 'R² Score',
    primaryMetricValue: 0.9205,
    secondaryMetricName: 'MAE (vehicles/hr)',
    secondaryMetricValue: 421.79,
    status: 'active',
    notes: 'Preserved baseline. Fast analytical inference.',
  },
  {
    modelName: 'Random Forest Classifier',
    task: 'classification',
    algorithm: 'Ensemble Random Forest Classifier (100 trees)',
    primaryMetricName: 'Accuracy',
    primaryMetricValue: 0.8113,
    secondaryMetricName: 'Weighted F1',
    secondaryMetricValue: 0.8106,
    status: 'active',
    notes: 'Classifies Low / Medium / High congestion. 18.4 MB binary recovered from Git LFS.',
  },
  {
    modelName: 'Logistic Regression Classifier',
    task: 'classification',
    algorithm: 'Multinomial Logistic Regression (L2 regularized)',
    primaryMetricName: 'Accuracy',
    primaryMetricValue: 0.8025,
    secondaryMetricName: 'Weighted F1',
    secondaryMetricValue: 0.8032,
    status: 'active',
    notes: 'Standard linear classification baseline.',
  },
  {
    modelName: 'Support Vector Classifier (SVM)',
    task: 'classification',
    algorithm: 'Support Vector Classifier (RBF kernel, C=1.0)',
    primaryMetricName: 'Accuracy',
    primaryMetricValue: 0.7999,
    secondaryMetricName: 'Weighted F1',
    secondaryMetricValue: 0.7980,
    status: 'active',
    notes: 'Preserved binary. 2.24 MB recovered from Git LFS.',
  },
];

export const recentEvaluationRecords: EvaluationRecord[] = [
  {
    id: 'EVAL-0915-0800',
    timestamp: '2021-09-15 08:00',
    horizonMinutes: 15,
    predictedVolume: 5080,
    actualVolume: 5124,
    absoluteError: 44,
    percentageError: 0.86,
    predictedLevel: 'High',
    actualLevel: 'High',
    categoryMatch: true,
    provenance: 'synthetic_uci_benchmark',
  },
  {
    id: 'EVAL-0915-0900',
    timestamp: '2021-09-15 09:00',
    horizonMinutes: 30,
    predictedVolume: 4420,
    actualVolume: 4490,
    absoluteError: 70,
    percentageError: 1.56,
    predictedLevel: 'Medium',
    actualLevel: 'Medium',
    categoryMatch: true,
    provenance: 'synthetic_uci_benchmark',
  },
  {
    id: 'EVAL-0915-1200',
    timestamp: '2021-09-15 12:00',
    horizonMinutes: 60,
    predictedVolume: 4210,
    actualVolume: 4360,
    absoluteError: 150,
    percentageError: 3.44,
    predictedLevel: 'Medium',
    actualLevel: 'Medium',
    categoryMatch: true,
    provenance: 'synthetic_uci_benchmark',
  },
  {
    id: 'EVAL-0915-1700',
    timestamp: '2021-09-15 17:00',
    horizonMinutes: 30,
    predictedVolume: 5390,
    actualVolume: 5440,
    absoluteError: 50,
    percentageError: 0.92,
    predictedLevel: 'High',
    actualLevel: 'High',
    categoryMatch: true,
    provenance: 'synthetic_uci_benchmark',
  },
  {
    id: 'EVAL-0915-2200',
    timestamp: '2021-09-15 22:00',
    horizonMinutes: 15,
    predictedVolume: 2180,
    actualVolume: 2110,
    absoluteError: 70,
    percentageError: 3.32,
    predictedLevel: 'Low',
    actualLevel: 'Low',
    categoryMatch: true,
    provenance: 'synthetic_uci_benchmark',
  },
];

export const dataSourcesList: DataSourceStatus[] = [
  {
    id: 'src-traffic-syn',
    name: 'UCI-Inspired Minneapolis Corridor Dataset',
    category: 'Traffic',
    status: 'offline_file',
    description: '17,520 hourly synthesized records (2020-2022) replicating UCI Interstate Traffic Volume patterns.',
    lastUpdated: 'Preserved File Asset (Datasets/test_data.csv)',
    recordCount: '17,520 hourly rows',
    provenanceNote: 'SYNTHETIC BENCHMARK: Generated programmatically in upstream src/data_collection.py.',
  },
  {
    id: 'src-weather-hist',
    name: 'Open-Meteo Historical Weather API',
    category: 'Weather',
    status: 'offline_file',
    description: 'Hourly temperature, precipitation, wind speed, and cloud cover synchronized with traffic time range.',
    lastUpdated: 'Preserved in Raw & Processed CSVs',
    recordCount: '17,520 hourly records',
    provenanceNote: 'Simulated fallback distributions embedded in offline training assets.',
  },
  {
    id: 'src-events-sim',
    name: 'Simulated Metropolitan Events Database',
    category: 'Events',
    status: 'offline_file',
    description: 'Simulated concerts, sports games, and festivals with attendance values influencing peak volume.',
    lastUpdated: 'Preserved in Raw & Processed CSVs',
    recordCount: '350+ simulated event occurrences',
    provenanceNote: 'SYNTHETIC: Created for feature engineering validation.',
  },
  {
    id: 'src-api-backend',
    name: 'FastAPI Prediction Gateway',
    category: 'Backend API',
    status: 'unconfigured',
    description: 'Target microservice layer connecting Next.js App Router to Python ML inference engine.',
    lastUpdated: 'Not yet deployed (Planned Phase 2)',
    recordCount: '0 live requests',
    provenanceNote: 'UNCONFIGURED: Phase 1 frontend operates in honest decoupled preview mode.',
  },
];
