import RoleShell from '@/modules/perfiles/role-shell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleShell>{children}</RoleShell>;
}