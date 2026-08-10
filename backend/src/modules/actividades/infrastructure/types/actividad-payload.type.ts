import { Prisma } from '@prisma/client';
import { ActividadFullInclude } from './actividad-full-include';

export type PrismaActividadPayload = Prisma.ActividadGetPayload<{
  include: typeof ActividadFullInclude;
}>;
