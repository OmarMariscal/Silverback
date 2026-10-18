import type { ReactNode } from 'react';
import type { RolUsuario } from '@/types/roles';

export type ModuloUsuario = 'dashboard' | 'actividades' | 'poa';

export type MenuItem = {
  key: ModuloUsuario;
  label: string;
  href: string;
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
    icon: dashboardIcon,
  },
  {
    key: 'actividades',
    label: 'Actividades',
    icon: actividadesIcon,
  },
  {
    key: 'poa',
    label: 'POA',
    icon: poaIcon,
  },
];

export const roleModuleMap: Record<RolUsuario, Record<ModuloUsuario, string>> = {
  ADMIN: {
    dashboard: '/admin/dashboard',
    actividades: '/admin/actividades',
    poa: '/admin/poa',
  },
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
};

export const moduleApiSupport: Record<RolUsuario, Record<ModuloUsuario, boolean>> = {
  ADMIN: { dashboard: false, actividades: false, poa: false },
  JEFA: { dashboard: true, actividades: true, poa: false },
  CONTRALOR_GENERAL: { dashboard: false, actividades: false, poa: false },
  CONTRALOR: { dashboard: true, actividades: true, poa: true },
  AUDITOR: { dashboard: false, actividades: false, poa: false },
};

export const getModulePath = (rol: RolUsuario, modulo: ModuloUsuario): string =>
  roleModuleMap[rol][modulo];

export const getMenuItemsByRol = (rol: RolUsuario): MenuItem[] =>
  MENU_CONFIG.map((item) => ({
    ...item,
    href: getModulePath(rol, item.key),
  }));

export const resolveDefaultModulePath = (rol: RolUsuario): string =>
  getModulePath(rol, 'dashboard');

export const getModuleTitle = (modulo: ModuloUsuario): string => {
  switch (modulo) {
    case 'dashboard':
      return 'Dashboard';
    case 'actividades':
      return 'Actividades';
    case 'poa':
      return 'POA';
  }
};
