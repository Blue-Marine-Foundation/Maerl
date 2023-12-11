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
    <div className='max-w-7xl mx-auto'>
      <h2 className='text-2xl font-bold mb-6'>Your Account</h2>
      <div className='w-full border-t min-h-[300px] flex justify-start items-stretch gap-8'>
        <div className='basis-1/5 pt-8 pr-8 border-r'>
          <AccountSideNav />
        </div>
        <div className='basis-4/5 pt-8'>{children}</div>
      </div>
    </div>
  );
}
