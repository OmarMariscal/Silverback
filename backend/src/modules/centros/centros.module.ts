import { Module } from '@nestjs/common';
import { CentrosService } from './application/centros.service';
import { CENTROS_QUERY_REPOSITORY_TOKEN } from './application/ports/centros-query.repository.interface';
import { CentrosController } from './infrastructure/http/centros.controller';
import { PrismaCentrosQueryRepository } from './infrastructure/repositories/prisma-centros-query.repository';

@Module({
  controllers: [CentrosController],
  providers: [
    CentrosService,
    {
      provide: CENTROS_QUERY_REPOSITORY_TOKEN,
      useClass: PrismaCentrosQueryRepository,
    },
  ],
})
export class CentrosModule {}