'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Plus, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/sessions/new', label: 'New Session', icon: Plus },
  { href: '/sessions', label: 'Sessions', icon: Newspaper },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="px-4 py-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
            <Newspaper size={14} />
          </div>
          <span className="font-bold text-sm">NewsIntel</span>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname.startsWith(href) && href !== '/sessions/new'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="px-4 py-3 border-t border-gray-700">
        <p className="text-xs text-gray-500">NewsIntel v1.0</p>
      </div>
    </aside>
  );
}
