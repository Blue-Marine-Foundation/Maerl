import NavList from './NavList';

export default function MainNav() {
  const accountNav = [
    {
      name: 'Overview',
      href: '/app',
    },
    {
      name: 'Projects',
      href: '/app/projects',
    },
    {
      name: 'Add Update',
      href: '/app/newupdate',
    },
    {
      name: 'Impact Indicators',
      href: '/app/impactindicators',
    },
  ];

  return (
    <div className='pb-3'>
      <NavList items={accountNav} />
    </div>
  );
}
