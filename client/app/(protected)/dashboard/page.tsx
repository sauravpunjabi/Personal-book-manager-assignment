import { redirect } from 'next/navigation';

// The design folds the dashboard's numbers into the library header, so there
// is no separate screen to show. Kept as a redirect so existing links survive.
export default function DashboardPage() {
  redirect('/books');
}
