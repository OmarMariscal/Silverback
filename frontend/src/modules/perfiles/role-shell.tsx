'use client';

import { useEffect } from 'react';
import { useLayoutStore } from '@/store/layout.store';
import { moduleApiSupport, type ModuloUsuario } from '@/modules/perfiles/role-menu';
import type { RolUsuario } from '@/types/roles';

type RoleShellProps = {
  perfil: RolUsuario;
  modulo: ModuloUsuario;
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
    ADMIN: 'Administrador',
    JEFA: 'Jefatura',
    CONTRALOR_GENERAL: 'Contraloría General',
    CONTRALOR: 'Contralor',
    AUDITOR: 'Auditor',
  }[perfil];

  return (
    <div>
      {!moduleApiSupport[perfil][modulo] && (
        <aside
          role="status"
          className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"
        >
          <p className="font-bold">{label}: módulo pendiente de integración con API</p>
          <p className="mt-1">{subtitle}</p>
          <p className="mt-2">
            El contrato OpenAPI disponible no define actualmente datos para este perfil y módulo.
            No se presentan cifras de demostración como si fueran datos reales.
          </p>
        </aside>
      )}
      {children}
    </div>
  );
}
