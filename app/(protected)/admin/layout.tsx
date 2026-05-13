import { requireSuperAdmin } from '@/utils/auth/guards';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSuperAdmin('/');
  return children;
}

