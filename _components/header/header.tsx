import Link from 'next/link';
import OrgPicker from './orgPicker';
import AuthButton from './AuthButton';
import Logo from '../logo';

export default function Header() {
  return (
    <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
      <div className='w-full max-w-6xl flex justify-between items-center py-3'>
        <div className='flex items-center justify-start gap-4'>
          <h2 className='font-medium text-lg flex items-center justify-start gap-2'>
            <Logo width={20} />
            <Link href='/'>Maerl</Link>
          </h2>

          <OrgPicker />
        </div>

        <AuthButton />
      </div>
    </nav>
  );
}
