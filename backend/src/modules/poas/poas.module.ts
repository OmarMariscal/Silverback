import { Module } from '@nestjs/common';
import { PoasService } from './application/poas.service';
import { PoasController } from './infrastructure/http/poas.controller';
import { PoaMapper } from './infrastructure/mappers/poa.mapper';
import { POA_REPOSITORY_TOKEN } from '@domain/poa/poa.repository.interface';
import { PrismaPoaRepository } from './infrastructure/repositories/prisma-poa.repository';
import { ActividadesModule } from '@modules/actividades/actividades.module';
import { POA_QUERY_REPOSITORY_TOKEN } from './application/ports/poa-query.repository.interface';
import { PoaQueryRepository } from './infrastructure/repositories/prisma-poa-query.repository';

@Module({
  imports: [ActividadesModule],
  controllers: [PoasController],
  providers: [
    // 1. Mappers (Dependencias Sin Interaz)
    PoaMapper,

    //2. Services
    PoasService,

    // 3. Repositorios (Bindeados a sus tokens)
    {
      provide: POA_REPOSITORY_TOKEN,
      useClass: PrismaPoaRepository,
    },

    {
      provide: POA_QUERY_REPOSITORY_TOKEN,
      useClass: PoaQueryRepository,
    },
  ],
})
export class PoasModule {}
