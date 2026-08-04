import { Navbar } from '@/components/layout/Navbar';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { Sidebar } from '@/components/layout/Sidebar';

export default function ProtectedAreaLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />
          {/* Extra bottom padding on phones so the bottom nav never covers content */}
          <main className="flex-1 px-4 py-6 pb-24 sm:px-6 md:pb-6">{children}</main>
        </div>
      </div>
    </ProtectedLayout>
  );
}
