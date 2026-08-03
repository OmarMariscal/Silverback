import { Roles } from './roles.enum';
import { Permisos } from './permisos.enum';

export const PERMISOS_POR_DEFECTO: Record<Roles, Permisos[]> = {
  [Roles.JEFA]: [
    // POA
    Permisos.LEER_POA,

    Permisos.VER_DASHBOARD_JEFATURA,

    //SubActividades
    Permisos.GESTIONAR_SUPERVISION_SUBACTIVIDADES,
  ],
  [Roles.CONTRALOR]: [
    // POA
    Permisos.LEER_POA,
    Permisos.CREAR_POA,

    //SubActividades
    Permisos.VER_DASHBOARD_CONTRALOR,
    Permisos.GESTIONAR_TRABAJO_SUBACTIVIDADES,
  ],
  [Roles.AUDITOR]: [Permisos.LEER_POA],
};
