import { GeistSans } from 'geist/font/sans';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header/header';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { Badge } from '@/components/ui/badge';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Start Here',
  description: 'An opinionated starter repo for NextJS projects using Supabase',
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
      <body className='min-h-svh bg-background px-4 text-foreground dark:bg-background'>
        {!hasEnvVars && (
          <div className={`max-w-app mx-auto flex w-full justify-end py-4`}>
            <Badge
              variant='default'
              className='pointer-events-none text-xs font-normal'
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
        )}
        {hasEnvVars && <Header />}
        <div>{children}</div>
      </body>
    </html>
  );
}
