import Sidenav from '@/components/sidenav';
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
      <div className='max-w-6xl mx-auto flex justify-between items-stretch'>
        <Sidenav />
        <div className='min-h-[500px] basis-full pl-12 py-12'>{children}</div>
      </div>
    );
  }

  return redirect('/login');
}
