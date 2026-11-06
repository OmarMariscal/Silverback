import { Prisma } from '@prisma/client';

export const PoaSecurityInclude = Prisma.validator<Prisma.PoaInclude>()({
  contralor: {
    include: { jefa: true },
  },
});
