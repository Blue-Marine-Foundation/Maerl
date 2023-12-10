import AccountSideNav from '@/_components/SideNav/AccountSideNav';

export const metadata = {
  title: 'Maerl: Account',
  description: 'Maerl user account home',
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='max-w-6xl mx-auto'>
      <h2 className='text-2xl font-bold mb-8'>Your Account</h2>
      <div className='w-full pt-8 border-t min-h-[300px] flex justify-start items-start gap-24'>
        <AccountSideNav />
        {children}
      </div>
    </div>
  );
}
