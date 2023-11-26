import MainNav from '@/_components/MainNav';
import { createClient } from '@/_utils/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Maerl Dashboard',
  description: 'The home of all your impact reporting',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return (
      <>
        <div className='w-full bg-[#2e3648] border-b border-foreground/10'>
          <div className='max-w-6xl mx-auto'>
            <MainNav />
          </div>
        </div>

        <div className='max-w-6xl mx-auto min-h-[500px] basis-full pt-6'>
          {children}
        </div>
      </>
    );
  }

  return redirect('/login');
}
