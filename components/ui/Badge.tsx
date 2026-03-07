import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'positive' | 'negative' | 'neutral' | 'keyword';
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      variant === 'positive' && 'bg-green-100 text-green-800',
      variant === 'negative' && 'bg-red-100 text-red-800',
      variant === 'neutral' && 'bg-gray-100 text-gray-700',
      variant === 'keyword' && 'bg-blue-100 text-blue-800',
      variant === 'default' && 'bg-gray-200 text-gray-700',
      className
    )}>
      {children}
    </span>
  );
}
