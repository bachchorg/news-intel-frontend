import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function relativeTime(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

export function formatDate(dateStr: string) {
  try {
    return format(new Date(dateStr), 'MMM d, yyyy HH:mm');
  } catch {
    return dateStr;
  }
}

export function sentimentColor(sentiment: string) {
  if (sentiment === 'positive') return 'text-green-600 bg-green-50';
  if (sentiment === 'negative') return 'text-red-600 bg-red-50';
  return 'text-gray-600 bg-gray-50';
}

export function sentimentBadgeColor(sentiment: string) {
  if (sentiment === 'positive') return 'bg-green-100 text-green-800';
  if (sentiment === 'negative') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
}

export function sourceColor(source: string): string {
  const colors: Record<string, string> = {
    'New York Times': '#1a1a1a',
    'The Guardian': '#052962',
    'NewsAPI': '#e85d04',
  };
  return colors[source] ?? '#6b7280';
}

export async function downloadFile(response: Response, filename: string) {
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
