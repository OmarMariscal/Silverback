import { Module } from '@nestjs/common';
import { PoasService } from './application/poas.service';
import { PoasController } from './infrastructure/http/poas.controller';
import { PoaMapper } from './infrastructure/mappers/poa.mapper';
import { POA_REPOSITORY_TOKEN } from '@domain/poa/poa.repository.interface';
import { PrismaPoaRepository } from './infrastructure/repositories/prisma-poa.repository';
import { ActividadesModule } from '@modules/actividades/actividades.module';

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
  ],
})
export class PoasModule {}
