import { redirect } from 'next/navigation';

// The design folds these numbers into the library header, so this only redirects
export default function DashboardPage() {
  redirect('/books');
}
