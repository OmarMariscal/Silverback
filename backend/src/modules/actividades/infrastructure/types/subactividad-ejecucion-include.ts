import { Prisma } from '@prisma/client';

export const SubActividadEjecucionInclude =
  Prisma.validator<Prisma.SubActividadInclude>()({
    actividad: {
      include: {
        auditores: {
          include: {
            auditor: true,
          },
        },
        poa: {
          include: {
            centro: true,
            contralor: {
              include: {
                jefa: true,
              },
            },
          },
        },
      },
    },
    entregas: {
      orderBy: { version: 'desc' },
      take: 1,
      select: {
        version: true,
      },
    },
  });
