import { Prisma } from '@prisma/client';

export const ActividadFullInclude = Prisma.validator<Prisma.ActividadInclude>()(
  {
    sub_actividades: true,
    // Traemos la tabla puente Y el auditor real
    auditores: {
      include: { auditor: true },
    },
    // Traemos la jerarquía del POA para el contexto de seguridad
    poa: {
      include: {
        contralor: {
          include: { jefa: true },
        },
      },
    },
  },
);
