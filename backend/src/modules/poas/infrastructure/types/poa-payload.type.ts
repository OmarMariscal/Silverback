import { Prisma } from '@prisma/client';

export type PrismaPoaPayload = Prisma.PoaGetPayload<{
  include: {
    actividades: {
      include: {
        sub_actividades: true;
        auditores: true;
      };
    };
  };
}>;
