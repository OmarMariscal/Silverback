import { Module } from '@nestjs/common';
import { ActividadesService } from './application/actividades.service';
import { ActividadesController } from './infrastructure/http/actividades.controller';
import { PrismaModule } from '@database/prisma.module';
import { ActividadMapper } from './infrastructure/mappers/actividad.mapper';
import { SubActividadMapper } from './infrastructure/mappers/subactividad.mapper';
import { PrismaSubActividadQueryRepository } from './infrastructure/repositories/prisma-subactividad-query.repository';
import { PrismaActividadRepository } from './infrastructure/repositories/prisma-actividad.repository';
import { ACTIVIDAD_REPOSITORY_TOKEN } from '@domain/actividad/actividad.repository.interface';
import { SUBACTIVIDADES_QUERY_REPOSITORY_TOKEN } from './application/ports/subactividaeds-query.repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [ActividadesController],
  providers: [
    //1. Mappers (Dependencias sin Interfaz)
    ActividadMapper,
    SubActividadMapper,

    // 2. Services
    ActividadesService,

    // 3. Repositorios (Bindeados a sus tokens)
    {
      provide: ACTIVIDAD_REPOSITORY_TOKEN,
      useClass: PrismaActividadRepository,
    },
    {
      provide: SUBACTIVIDADES_QUERY_REPOSITORY_TOKEN,
      useClass: PrismaSubActividadQueryRepository,
    },
  ],
})
export class ActividadesModule {}
