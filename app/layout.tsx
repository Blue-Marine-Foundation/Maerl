import Header from '@/_components/header/header';
import Footer from '@/_components/footer/footer';
import './globals.css';

export const metadata = {
  title: 'Project Maerl',
  description: 'Blue Marine Foundation Impact Reporting',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-background text-foreground'>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
