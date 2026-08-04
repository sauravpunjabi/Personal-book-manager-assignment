import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col px-6 py-8">
      <header>
        <Link href="/" className="font-display text-lg font-semibold">
          Shelf
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
