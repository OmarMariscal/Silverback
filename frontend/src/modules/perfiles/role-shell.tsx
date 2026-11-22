'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HeaderPOA } from '@/components/ui/HeaderPoa';
import {
  getMenuItemsByRol,
  getModuleTitle,
  moduleApiSupport,
  resolveDefaultModulePath,
  roleModuleMap,
  type ModuloUsuario,
} from '@/modules/perfiles/role-menu';
import { useLayoutStore } from '@/store/layout.store';
import { ROLES_USUARIO, type RolUsuario } from '@/types/roles';

const ETIQUETAS_ROL: Record<RolUsuario, string> = {
  ADMIN: 'Administrador',
  JEFA: 'Jefatura',
  CONTRALOR_GENERAL: 'Contraloría General',
  CONTRALOR: 'Contralor',
  AUDITOR: 'Auditor',
};

const METADATA_POR_RUTA: Record<string, { title: string; subtitle: string }> = {
  '/contralor/dashboard': {
    title: 'Panel de Gestión - Contralor',
    subtitle: 'Mi resumen operativo del centro universitario y el seguimiento de la cartera de actividades.',
  },
  '/contralor/actividades': {
    title: 'Actividades del Contralor',
    subtitle: 'Listado y control del centro universitario con filtros por estado, semáforo y tipo de actividad.',
  },
  '/contralor/poa': {
    title: 'Plan Operativo Anual',
    subtitle: 'Configura las actividades e indicadores para este ciclo fiscal.',
  },
  '/jefa/dashboard': {
    title: 'Panel de Supervisión Global',
    subtitle: 'Resumen operativo de la red de centros universitarios y seguimiento de actividades.',
  },
  '/jefa/actividades': {
    title: 'Actividades de Jefatura',
    subtitle: 'Directorio de actividades del total de la red de contralores y centros.',
  },
  '/jefa/poa': {
    title: 'Supervisión de Planes Operativos Anuales',
    subtitle: 'Revisión, dictamen y autorización de los POA por centro universitario.',
  },
};

function resolverModuloDesdeRuta(pathname: string): ModuloUsuario {
  if (pathname.includes('/actividades')) return 'actividades';
  if (pathname.includes('/poa')) return 'poa';
  return 'dashboard';
}

function resolverRolDeRuta(pathname: string): RolUsuario | undefined {
  return ROLES_USUARIO.find((rol) => {
    const prefijo = roleModuleMap[rol].dashboard.replace('/dashboard', '');
    return pathname === prefijo || pathname.startsWith(`${prefijo}/`);
  });
}

export default function RoleShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [logoError, setLogoError] = useState(false);

  // Únicas dos piezas que consumimos de useLayoutStore
  const rolUsuario = useLayoutStore((state) => state.rolUsuario);
  const setTituloPantalla = useLayoutStore((state) => state.setTituloPantalla);

  const moduloActual = resolverModuloDesdeRuta(pathname);
  const soportaApi = moduleApiSupport[rolUsuario][moduloActual];

  // Calculamos título y subtítulo automáticamente según la URL actual
  const metaActual = useMemo(() => {
    if (METADATA_POR_RUTA[pathname]) {
      return METADATA_POR_RUTA[pathname];
    }
    if (pathname.includes('/subactividades/')) {
      return {
        title: 'Entrega de subactividad',
        subtitle: 'Consulta el estado, atiende las observaciones y presenta las evidencias correspondientes.',
      };
    }
    if (/\/actividades\/[^/]+$/.test(pathname)) {
      return {
        title: 'Detalle de actividad',
        subtitle: `Consulta técnica de actividad para ${ETIQUETAS_ROL[rolUsuario]}.`,
      };
    }
    const nombreModulo = getModuleTitle(moduloActual);
    return {
      title: `${nombreModulo} - ${ETIQUETAS_ROL[rolUsuario]}`,
      subtitle: `La vista de ${nombreModulo} para ${ETIQUETAS_ROL[rolUsuario]} estará disponible cuando el backend publique el contrato correspondiente.`,
    };
  }, [pathname, rolUsuario, moduloActual]);

  // 1. Guardia de seguridad por rol: si la URL pertenece a otro rol, redirige al inicio del rol activo
  useEffect(() => {
    const rolDeLaUrl = resolverRolDeRuta(pathname);
    if (rolDeLaUrl && rolDeLaUrl !== rolUsuario) {
      router.replace(resolveDefaultModulePath(rolUsuario));
    }
  }, [pathname, rolUsuario, router]);

  // 2. Actualiza el título del HeaderPOA cada vez que cambia la ruta
  useEffect(() => {
    setTituloPantalla(metaActual.title);
  }, [metaActual.title, setTituloPantalla]);

  const menuItems = getMenuItemsByRol(rolUsuario);
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <div className="flex h-full overflow-hidden bg-slate-50 font-sans text-slate-800">      
      <aside className="z-20 flex w-36 flex-shrink-0 flex-col border-r border-slate-200 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col items-center border-b border-slate-100 px-2 py-6">
          <div className="mb-3 flex h-20 w-24 items-center justify-center overflow-hidden rounded-2xl">
            {!logoError ? (
              <img
                src="/logo.png"
                alt="Logo SIMA"
                className="h-full w-full object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#15274D] text-2xl font-black text-white shadow-md">
                SIMA
              </div>
            )}
          </div>
          <span className="px-1 text-center text-[11px] font-black leading-snug tracking-tight text-[#15274D]">
            Sistema Integral de Monitoreo de Auditorías
          </span>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-6">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`group flex flex-col items-center justify-center rounded-xl px-2 py-3 transition-all ${
                  active
                    ? 'bg-indigo-50 font-bold text-indigo-700'
                    : 'font-medium text-slate-400 hover:bg-slate-50 hover:text-indigo-600'
                }`}
              >
                <svg
                  className={`mb-2 h-8 w-8 transition-transform group-hover:scale-110 ${
                    active ? 'text-indigo-600' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {item.icon}
                </svg>
                <span className="text-center text-[11px] leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-slate-50/50">
        <HeaderPOA />

        <main className="flex-1 overflow-y-auto p-10">
          <div className="mx-auto max-w-[1600px] space-y-8">
            {!soportaApi && (
              <aside
                role="status"
                className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"
              >
                <p className="font-bold">
                  {ETIQUETAS_ROL[rolUsuario]}: módulo pendiente de integración con API
                </p>
                <p className="mt-1">{metaActual.subtitle}</p>
                <p className="mt-2">
                  El contrato OpenAPI disponible no define actualmente datos para este perfil y módulo.
                  No se presentan cifras de demostración como si fueran datos reales.
                </p>
              </aside>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}