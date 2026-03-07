export interface KeywordFrequency {
  keyword: string;
  count: number;
}

export interface SourceDistribution {
  source: string;
  count: number;
  percentage: number;
}

export interface SentimentTrend {
  bucket: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface SpikeAlert {
  keyword: string;
  previousCount: number;
  currentCount: number;
  increasePercent: number;
  detectedAt: string;
}

export interface AnalyticsSnapshot {
  keywordFrequencies: KeywordFrequency[];
  sourceDistribution: SourceDistribution[];
  sentimentTrend: SentimentTrend[];
  totalArticles: number;
}
