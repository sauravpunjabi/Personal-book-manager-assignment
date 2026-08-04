import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

/**
 * Libertinus Serif carries the headings. It is served from Google Fonts but
 * missing from this Next version's font list, so the files are vendored and
 * loaded locally — which also means no request to a third party at runtime.
 */
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
  title: 'Bookmark',
  description:
    'A quiet place for the books you are reading, finished, and still to start.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Applies the saved theme before first paint so dark-mode readers
            never get a flash of the light palette. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('bookmark-theme');if(t==='dark')document.documentElement.dataset.theme='dark'}catch(e){}`,
          }}
        />
      </head>
      <body className={`${libertinus.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
