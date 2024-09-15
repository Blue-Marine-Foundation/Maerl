import Link from 'next/link'
import OrgPicker from './orgPicker'
import AuthButton from './AuthButton'
import Logo from '../logo'
import MainNav from '../navigation/MainNav'

export default function Header({ withSession }: { withSession: boolean }) {
  return (
    <nav className="w-full bg-card-bg/80">
      <div className="w-full max-w-[1376px] mx-auto px-4 flex justify-between items-center py-4">
        <div className="flex items-center justify-start gap-4">
          <h2 className="font-medium flex items-center justify-start gap-2">
            <Logo width={22} />
            <Link href="/">Maerl</Link>
          </h2>
        </div>

        <AuthButton />
      </div>
      {withSession && <MainNav />}
    </nav>
  )
}
