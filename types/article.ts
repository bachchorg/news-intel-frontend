export interface Article {
  articleId: string;
  source: string;
  sourceUrl: string;
  articleUrl: string;
  headline: string;
  subheadline?: string;
  author: string[];
  publishedAt: string;
  crawledAt: string;
  keywordsMatched: string[];
  summary?: string;
  fullText?: string;
  category?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  tags: string[];
  paywall: boolean;
}
