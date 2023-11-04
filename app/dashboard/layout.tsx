import NavMenu from '@/_components/dashboard/navmenu';
import { createClient } from '@/_utils/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Meteor Dashboard',
  description: 'The home of all your social media analytics',
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
        <NavMenu />
        <div className='max-w-6xl mx-auto pt-12 pb-24'>{children}</div>
      </>
    );
  }

  return redirect('/login');
}
