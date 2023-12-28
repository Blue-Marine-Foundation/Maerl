'use client';

import NavListVertical from './NavListVertical';

export default function AccountSideNav() {
  const accountNav = [
    {
      name: 'User Profile',
      href: '/app/account',
    },
    {
      name: 'Password Reset',
      href: '/app/account/passwordreset',
    },
  ];

  return <NavListVertical data={accountNav} />;
}
