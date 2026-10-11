export type ForecastHorizon = 15 | 30 | 60;

export type CongestionCategory = 'Low' | 'Medium' | 'High';

export type DataSourceProvenance = 
  | 'synthetic_uci_benchmark'
  | 'open_meteo_historical'
  | 'live_sensor_unconfigured';

export interface ForecastPoint {
  timeLabel: string;
  timestamp: string;
  actualVolume: number | null;
  predictedVolume: number;
  confidenceLower: number;
  confidenceUpper: number;
  congestionLevel: CongestionCategory;
  isForecastPeriod: boolean;
}

export interface HourlyCongestionPoint {
  hour: number;
  label: string;
  avgVolume: number;
  congestionLevel: CongestionCategory;
  isRushHour: boolean;
}

export interface RushHourComparisonPoint {
  hour: number;
  label: string;
  weekdayVolume: number;
  weekendVolume: number;
  rushHourIntensity: number;
}

export interface ModelBenchmark {
  modelName: string;
  task: 'regression' | 'classification';
  algorithm: string;
  primaryMetricName: string;
  primaryMetricValue: number;
  secondaryMetricName: string;
  secondaryMetricValue: number;
  status: 'active' | 'legacy_reference' | 'version_incompatible';
  notes: string;
}

export interface EvaluationRecord {
  id: string;
  timestamp: string;
  horizonMinutes: ForecastHorizon;
  predictedVolume: number;
  actualVolume: number;
  absoluteError: number;
  percentageError: number;
  predictedLevel: CongestionCategory;
  actualLevel: CongestionCategory;
  categoryMatch: boolean;
  provenance: DataSourceProvenance;
}

export interface DataSourceStatus {
  id: string;
  name: string;
  category: 'Traffic' | 'Weather' | 'Events' | 'Backend API';
  status: 'connected' | 'offline_file' | 'unconfigured' | 'mock_active';
  description: string;
  lastUpdated: string;
  recordCount: string;
  provenanceNote: string;
}

export interface DashboardMetrics {
  currentEstimatedVolume: number;
  forecastHorizon: ForecastHorizon;
  forecastedVolume: number;
  congestionCategory: CongestionCategory;
  peakHourToday: string;
  upstreamBestR2: number;
  upstreamBestAccuracy: number;
  dataSourceLabel: string;
  isLiveConnected: boolean;
}
