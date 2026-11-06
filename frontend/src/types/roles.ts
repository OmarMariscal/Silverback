export const ROLES_USUARIO = [
  'ADMIN',
  'JEFA',
  'CONTRALOR_GENERAL',
  'CONTRALOR',
  'AUDITOR',
] as const;

export type RolUsuario = (typeof ROLES_USUARIO)[number];

export const normalizarRolUsuario = (value: unknown): RolUsuario | null => {
  if (typeof value !== 'string') return null;

  const rol = value.toUpperCase();
  return ROLES_USUARIO.find((rolValido) => rolValido === rol) ?? null;
};
