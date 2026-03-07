import { Article } from '@/types/article';
import { Badge } from '@/components/ui/Badge';
import { SourceBadge } from './SourceBadge';
import { relativeTime } from '@/lib/utils';
import { ExternalLink, Lock } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const sentimentVariant = article.sentiment as 'positive' | 'negative' | 'neutral';

  return (
    <div className="flex flex-col gap-1.5 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 flex-wrap">
        <SourceBadge source={article.source} />
        <Badge variant={sentimentVariant}>{article.sentiment}</Badge>
        {article.paywall && (
          <span className="inline-flex items-center gap-0.5 text-xs text-amber-600">
            <Lock size={10} /> Paywall
          </span>
        )}
        {article.keywordsMatched.map((kw) => (
          <Badge key={kw} variant="keyword">{kw}</Badge>
        ))}
        <span className="text-xs text-gray-400 ml-auto">{relativeTime(article.publishedAt)}</span>
      </div>
      <a
        href={article.articleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-gray-900 hover:text-blue-600 flex items-start gap-1 group"
      >
        <span>{article.headline}</span>
        <ExternalLink size={12} className="mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 text-blue-500" />
      </a>
      {article.summary && (
        <p className="text-xs text-gray-500 line-clamp-2">{article.summary}</p>
      )}
    </div>
  );
}
