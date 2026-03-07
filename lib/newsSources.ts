export type AuthType = 'apiKey' | 'oauth' | 'none';

export interface NewsSource {
  /** Unique identifier used in backend source matching */
  id: string;
  /** Display name */
  label: string;
  /** Short description shown in the UI */
  description: string;
  /** Base API endpoint */
  apiUrl: string;
  /** Auth mechanism required */
  auth: AuthType;
  /** Newspapers / outlets covered by this source */
  newspapers: string[];
  /** Whether this source is enabled by default for new sessions */
  enabledByDefault: boolean;
  /** Category tag for grouping in UI */
  category: 'aggregator' | 'rss';
}

/**
 * Supported news sources:
 * 1. NewsAPI.org — aggregator with 150k+ sources (API key, free tier: 100 req/day)
 * 2. GNews.io — aggregator (API key, free tier: 100 req/day)
 * 3. TheNewsAPI.com — aggregator (API key, free tier: 3 req/day)
 * 4. RSS News — 20+ direct RSS feeds (no API key needed)
 *
 * All API sources poll every 10 minutes to conserve rate limits.
 * RSS polls at session interval (default 30s).
 */
export const NEWS_SOURCES: NewsSource[] = [
  {
    id: 'newsapi',
    label: 'NewsAPI.org',
    description: 'Headlines from 150k+ sources incl. BBC, CNN, Reuters, Bloomberg, etc. (300 req/day with key rotation)',
    apiUrl: 'https://newsapi.org/v2',
    auth: 'apiKey',
    newspapers: [
      'BBC News', 'CNN', 'Reuters', 'Bloomberg', 'ABC News',
      'The Wall Street Journal', 'The Washington Post', 'Al Jazeera',
      'Fox News', 'NBC News', 'CBS News', 'Time', 'CNBC',
    ],
    enabledByDefault: true,
    category: 'aggregator',
  },
  {
    id: 'gnews',
    label: 'GNews.io',
    description: 'Global news aggregator with multi-language support (100 req/day)',
    apiUrl: 'https://gnews.io/api/v4',
    auth: 'apiKey',
    newspapers: [
      'Reuters', 'BBC', 'CNN', 'Al Jazeera', 'The Guardian',
      'New York Times', 'Washington Post', 'NPR', 'ABC News',
    ],
    enabledByDefault: true,
    category: 'aggregator',
  },
  {
    id: 'thenewsapi',
    label: 'TheNewsAPI',
    description: 'News aggregator with structured data and categories (100 req/day)',
    apiUrl: 'https://api.thenewsapi.com/v1',
    auth: 'apiKey',
    newspapers: [
      'Reuters', 'Associated Press', 'BBC', 'CNN', 'Fox News',
      'The Guardian', 'Bloomberg', 'CNBC',
    ],
    enabledByDefault: true,
    category: 'aggregator',
  },
  {
    id: 'rss-news',
    label: 'RSS News (Free)',
    description: 'Direct RSS feed parsing — NYT (4 desks), BBC (4), Fox News (3), NPR (3), Washington Post, CBS, NBC, Guardian, and more',
    apiUrl: 'direct-rss',
    auth: 'none',
    newspapers: [
      'New York Times (4 desks)', 'The Guardian', 'Washington Post',
      'Fox News (3 desks)', 'NPR (3 desks)', 'BBC News (4 desks)',
      'CBS News', 'NBC News', 'Al Jazeera', 'ABC News', 'CBC News', 'Deutsche Welle',
    ],
    enabledByDefault: true,
    category: 'rss',
  },
];

/** Grouped sources for UI rendering */
export function getSourcesByCategory() {
  const categories = {
    aggregator: { label: 'Aggregators (API Key)', sources: [] as NewsSource[] },
    rss: { label: 'RSS Feeds (Free, No Key)', sources: [] as NewsSource[] },
  };
  for (const src of NEWS_SOURCES) {
    categories[src.category].sources.push(src);
  }
  return categories;
}

/** Get default source IDs for new sessions */
export function getDefaultSourceIds(): string[] {
  return NEWS_SOURCES.filter((s) => s.enabledByDefault).map((s) => s.id);
}
