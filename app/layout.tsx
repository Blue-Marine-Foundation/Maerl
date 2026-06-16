import { Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import QueryProvider from '@/utils/query-provider';
import { ThemeProvider } from '@/components/theme/theme-provider';
import ThemedToaster from '@/components/theme/themed-toaster';
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

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${poppins.variable} font-sans`}
      suppressHydrationWarning
    >
      <body className='min-h-svh bg-background text-foreground'>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <UserSessionSync />
            <Header />
            <div className='mb-32 px-4'>{children}</div>
            <Footer />
            <ThemedToaster />
            <Analytics />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
