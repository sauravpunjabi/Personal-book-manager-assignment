'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/books', label: 'My Books', icon: BooksIcon },
];

/**
 * A rail on desktop, a bottom bar on phones. With only two destinations a
 * drawer would be more machinery than the navigation deserves.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-56 shrink-0 border-r border-line px-4 py-6 md:block">
        <Link href="/dashboard" className="font-display text-lg font-semibold">
          Bookmark
        </Link>

        <nav className="mt-8 space-y-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-ink text-paper'
                    : 'text-muted hover:bg-line/50 hover:text-ink'
                )}
              >
                <Icon />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line bg-surface md:hidden">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                isActive ? 'text-ink' : 'text-muted'
              )}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function HomeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 6.5 8 2l6 4.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
    </svg>
  );
}

function BooksIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 2.5h3.5v11H3zM7.5 2.5H11v11H7.5z" />
      <path d="m12 3 1.8 10.4" strokeLinecap="round" />
    </svg>
  );
}
