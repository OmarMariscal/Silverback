'use client';

import { useEffect } from 'react';
import { useLayoutStore } from '@/store/layout.store';
import type { RolUsuario } from '@/types/roles';

type RoleShellProps = {
  perfil: RolUsuario;
  modulo: 'dashboard' | 'poa' | 'actividades';
  title: string;
  subtitle: string;
  children?: React.ReactNode;
};

export default function RoleShell({
  perfil,
  modulo,
  title,
  subtitle,
  children,
}: RoleShellProps) {
  useEffect(() => {
    useLayoutStore.getState().setTituloPantalla(title);
  }, [title]);

  const label = {
    JEFA: 'Jefatura',
    CONTRALOR_GENERAL: 'Contraloría General',
    CONTRALOR: 'Contralor',
    AUDITOR: 'Auditor',
    ADMIN: 'Administrador',
  }[perfil];

  return (
    <div>
      {children}
    </div>
  );
}
