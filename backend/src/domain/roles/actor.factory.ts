import { Roles } from './roles.enum';
import { Actor } from './actor.interface';
import { Permisos } from './permisos.enum';
import { PERMISOS_POR_DEFECTO } from './permisos-por-rol.map';

export function crearActor(
  rolSolicitado: Roles,
  permisosDelegados?: Permisos[],
): Actor {
  // 1. Obtenemos los permisos base según el rol desde tu mapa global
  const permisosBase = PERMISOS_POR_DEFECTO[rolSolicitado] || [];

  // 2. Unimos los permisos base con los delegados (usando Set para evitar duplicados)
  const permisosFinales = Array.from(
    new Set([...permisosBase, ...(permisosDelegados || [])]),
  );

  return {
    rol: rolSolicitado,
    permisos: permisosFinales,
  };
}
