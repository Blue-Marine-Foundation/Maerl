import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import QueryProvider from '@/utils/query-provider';

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={inter.className} suppressHydrationWarning>
      <body className='min-h-svh bg-background text-foreground dark:bg-background'>
        <Header />
        <QueryProvider>
          <div className='mb-32 px-4'>{children}</div>
        </QueryProvider>
        <Footer />
      </body>
    </html>
  );
}
