import { Prisma } from '@prisma/client';
import { PoaSecurityInclude } from './poa-security-include';

export type PrismaPoaPayload = Prisma.PoaGetPayload<{
  include: typeof PoaSecurityInclude;
}>;
