import { Prisma } from '@prisma/client';

export type PrismaActividadPayload = Prisma.ActividadGetPayload<{
  include: {
    sub_actividades: true;
    auditores: true;
  };
}>;
