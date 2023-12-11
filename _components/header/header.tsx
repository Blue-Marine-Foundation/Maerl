import Link from 'next/link';
import OrgPicker from './orgPicker';
import AuthButton from './AuthButton';
import Logo from '../logo';

export default function Header() {
  return (
    <nav className='w-full flex justify-center bg-[#2e3648]'>
      <div className='w-full max-w-7xl px-4 flex justify-between items-center py-4'>
        <div className='flex items-center justify-start gap-4'>
          <h2 className='font-medium flex items-center justify-start gap-2'>
            <Logo width={22} />
            <Link href='/'>Maerl</Link>
          </h2>

          <OrgPicker />
        </div>

        <AuthButton />
      </div>
    </nav>
  );
}
