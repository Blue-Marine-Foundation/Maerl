'use client'

import NavListVertical from './NavListVertical'

export default function AccountSideNav() {
  const accountNav = [
    {
      name: 'User Profile',
      href: '/account',
    },
    {
      name: 'Password Reset',
      href: '/account/passwordreset',
    },
  ]

  return <NavListVertical data={accountNav} />
}
