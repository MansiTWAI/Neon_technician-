import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';

const sora = Sora({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-sora' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: { default: 'Jobs | Neon Adda', template: '%s | Neon Adda' },
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: 'Neon Adda Jobs', statusBarStyle: 'default' },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-white shadow-sm">{children}</div>
      </body>
    </html>
  );
}
