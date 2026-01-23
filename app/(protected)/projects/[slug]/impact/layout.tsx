import { requireNonPartner } from '@/utils/auth/guards';

export default async function ProjectImpactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireNonPartner('/projects');
  return children;
}

