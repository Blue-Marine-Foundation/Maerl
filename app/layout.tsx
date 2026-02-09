import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import QueryProvider from '@/utils/query-provider';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/next';
import { UserSessionSync } from '@/components/user/user-provider';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Maerl',
  description: 'Impact monitoring for Blue Marine Foundation',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={inter.className} suppressHydrationWarning>
      <body className='min-h-svh bg-background text-foreground dark:bg-background'>
        <QueryProvider>
          <UserSessionSync />
          <Header />
          <div className='mb-32 px-4'>{children}</div>
          <Footer />
          <Toaster richColors />
          <Analytics />
        </QueryProvider>
      </body>
    </html>
  );
}
