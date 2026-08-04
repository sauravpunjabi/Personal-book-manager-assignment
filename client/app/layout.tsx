import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

/** Libertinus is vendored: it is missing from this Next version font list */
const libertinus = localFont({
  variable: '--font-libertinus',
  display: 'swap',
  src: [
    { path: './fonts/LibertinusSerif-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/LibertinusSerif-Italic.woff2', weight: '400', style: 'italic' },
    { path: './fonts/LibertinusSerif-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: './fonts/LibertinusSerif-Bold.woff2', weight: '700', style: 'normal' },
  ],
});

// DM Sans stays on everything that is interface rather than heading.
const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Chapter',
  description:
    'A quiet place for the books you are reading, finished, and still to start.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The inline script below mutates <html> before hydration, hence the suppress
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before first paint so there is no flash of the wrong palette */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=localStorage.getItem('chapter-theme');var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.dataset.theme='dark'}catch(e){}`,
          }}
        />
      </head>
      <body className={`${libertinus.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
