import type { ReactNode } from 'react';
import type { RolUsuario } from '@/types/roles';

export type MenuItem = {
  key: 'dashboard' | 'actividades' | 'poa';
  label: string;
  href: string;
  roles: RolUsuario[];
  icon: ReactNode;
};

const dashboardIcon = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
  />
);

const actividadesIcon = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
  />
);

const poaIcon = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
  />
);

export const MENU_CONFIG: Array<Omit<MenuItem, 'href'>> = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    roles: ['JEFA', 'CONTRALOR_GENERAL', 'CONTRALOR', 'AUDITOR'],
    icon: dashboardIcon,
  },
  {
    key: 'actividades',
    label: 'Actividades',
    roles: ['JEFA', 'CONTRALOR_GENERAL', 'CONTRALOR', 'AUDITOR'],
    icon: actividadesIcon,
  },
  {
    key: 'poa',
    label: 'POA',
    roles: ['JEFA', 'CONTRALOR_GENERAL', 'CONTRALOR'],
    icon: poaIcon,
  },
];

export const getMenuItemsByRol = (rol: RolUsuario | string): MenuItem[] => {
  const rolNormalizado = typeof rol === 'string' ? rol.toUpperCase() : rol;
  const perfil = roleModuleMap[rolNormalizado as keyof typeof roleModuleMap];

  if (!perfil) {
    return MENU_CONFIG.map((item) => ({
      ...item,
      href: item.key === 'dashboard' ? '/dashboard' : item.key === 'actividades' ? '/actividades' : '/poa',
    }));
  }

  return MENU_CONFIG
    .filter((item) => item.roles.includes(rolNormalizado as RolUsuario))
    .map((item) => ({
      ...item,
      href:
        item.key === 'dashboard'
          ? perfil.dashboard
          : item.key === 'actividades'
            ? perfil.actividades
            : perfil.poa,
    }));
};

export const roleModuleMap = {
  JEFA: {
    dashboard: '/jefa/dashboard',
    actividades: '/jefa/actividades',
    poa: '/jefa/poa',
  },
  CONTRALOR_GENERAL: {
    dashboard: '/contralor-general/dashboard',
    actividades: '/contralor-general/actividades',
    poa: '/contralor-general/poa',
  },
  CONTRALOR: {
    dashboard: '/contralor/dashboard',
    actividades: '/contralor/actividades',
    poa: '/contralor/poa',
  },
  AUDITOR: {
    dashboard: '/auditor/dashboard',
    actividades: '/auditor/actividades',
    poa: '/auditor/poa',
  },
} as const;

export const resolveDefaultModulePath = (rol: RolUsuario | string): string => {
  const rolNormalizado = typeof rol === 'string' ? rol.toUpperCase() : rol;
  const perfil = roleModuleMap[rolNormalizado as keyof typeof roleModuleMap];
  return perfil ? perfil.dashboard : '/dashboard';
};
