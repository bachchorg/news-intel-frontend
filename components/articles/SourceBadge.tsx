interface SourceBadgeProps {
  source: string;
}

const sourceStyles: Record<string, { color: string; short: string }> = {
  // NewsAPI.org
  'newsapi':           { color: 'bg-orange-600 text-white', short: 'NewsAPI' },
  'NewsAPI':           { color: 'bg-orange-600 text-white', short: 'NewsAPI' },
  // GNews.io
  'gnews':             { color: 'bg-purple-600 text-white', short: 'GNews' },
  'GNews':             { color: 'bg-purple-600 text-white', short: 'GNews' },
  // TheNewsAPI
  'thenewsapi':        { color: 'bg-teal-600 text-white', short: 'TheNews' },
  'TheNewsAPI':        { color: 'bg-teal-600 text-white', short: 'TheNews' },
  // RSS News (next-news-api)
  'rss-news':          { color: 'bg-emerald-600 text-white', short: 'RSS' },
  // Legacy names (backward compat)
  'New York Times':    { color: 'bg-black text-white', short: 'NYT' },
  'The Guardian':      { color: 'bg-blue-900 text-white', short: 'Guardian' },
  'nytimes':           { color: 'bg-black text-white', short: 'NYT' },
  'the-guardian':      { color: 'bg-blue-900 text-white', short: 'Guardian' },
};

export function SourceBadge({ source }: SourceBadgeProps) {
  const entry = sourceStyles[source];
  const style = entry?.color ?? 'bg-gray-600 text-white';
  const short = entry?.short ?? source.slice(0, 8);
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${style}`}>
      {short}
    </span>
  );
}
