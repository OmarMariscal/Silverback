import { notFound } from 'next/navigation';
import RoleShell from '@/modules/perfiles/role-shell';
import {
  getModuleTitle,
  moduleApiSupport,
  roleModuleMap,
  type ModuloUsuario,
} from '@/modules/perfiles/role-menu';
import { ROLES_USUARIO, type RolUsuario } from '@/types/roles';

const roleLabels: Record<RolUsuario, string> = {
  ADMIN: 'Administrador',
  JEFA: 'Jefatura',
  CONTRALOR_GENERAL: 'Contraloría General',
  CONTRALOR: 'Contralor',
  AUDITOR: 'Auditor',
};

export default async function PendingModulePage({
  params,
}: {
  params: Promise<{ perfil: string; modulo: string }>;
}) {
  const { perfil, modulo } = await params;
  const pathname = `/${perfil}/${modulo}`;
  const rol = ROLES_USUARIO.find((candidate) =>
    Object.values(roleModuleMap[candidate]).includes(pathname),
  );

  if (!rol) notFound();

  const moduloActual = Object.entries(roleModuleMap[rol]).find(
    ([, path]) => path === pathname,
  )?.[0] as ModuloUsuario | undefined;

  if (!moduloActual || moduleApiSupport[rol][moduloActual]) notFound();

  return (
    <RoleShell
      perfil={rol}
      modulo={moduloActual}
      title={`${getModuleTitle(moduloActual)} - ${roleLabels[rol]}`}
      subtitle={`La vista de ${getModuleTitle(moduloActual)} para ${roleLabels[rol]} estará disponible cuando el backend publique el contrato correspondiente.`}
    />
  );
}
