import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UNIT_OF_WORK_TOKEN } from '@core/interfaces/unit-of-work.interface';
import { PrismaUnitOfWork } from './prisma-unit-of-work';

@Global()
@Module({
  providers: [
    PrismaService,
    // Unidad de Trabajo
    {
      provide: UNIT_OF_WORK_TOKEN,
      useClass: PrismaUnitOfWork,
    },
  ],
  exports: [PrismaService, UNIT_OF_WORK_TOKEN],
})
export class PrismaModule {}
