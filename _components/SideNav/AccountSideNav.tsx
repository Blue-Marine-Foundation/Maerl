'use client';

import NavList from './NavList';

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

  return <NavList data={accountNav} />;
}
