import { Prisma } from '@prisma/client';
import { SubActividadEjecucionInclude } from './subactividad-ejecucion-include';

export type PrismaSubActividadEjecucionPayload = Prisma.SubActividadGetPayload<{
  include: typeof SubActividadEjecucionInclude;
}>;
