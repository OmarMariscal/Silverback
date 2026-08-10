import { Module } from '@nestjs/common';
import { ActividadesService } from './application/actividades.service';
import { SubactividadesService } from './application/subactividades.service';
import { ActividadesController } from './infrastructure/http/actividades.controller';
import { SubactividadesController } from './infrastructure/http/subactividades.controller';
import { PrismaModule } from '@database/prisma.module';
import { ActividadMapper } from './infrastructure/mappers/actividad.mapper';
import { SubActividadMapper } from './infrastructure/mappers/subactividad.mapper';
import { PrismaSubActividadQueryRepository } from './infrastructure/repositories/prisma-subactividad-query.repository';
import { PrismaActividadRepository } from './infrastructure/repositories/prisma-actividad.repository';
import { ACTIVIDAD_REPOSITORY_TOKEN } from '@domain/actividad/actividad.repository.interface';
import { SUBACTIVIDADES_QUERY_REPOSITORY_TOKEN } from './application/ports/subactividaeds-query.repository.interface';
import { ACTIVIDADES_QUERY_REPOSITORY_TOKEN } from './application/ports/actividades-query.repository.interface';
import { PrismaActividadQueryRepository } from './infrastructure/repositories/prisma-actividad-query.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ActividadesController, SubactividadesController],
  providers: [
    //1. Mappers (Dependencias sin Interfaz)
    ActividadMapper,
    SubActividadMapper,

    // 2. Services
    ActividadesService,
    SubactividadesService,

    // 3. Repositorios (Bindeados a sus tokens)
    {
      provide: ACTIVIDAD_REPOSITORY_TOKEN,
      useClass: PrismaActividadRepository,
    },
    {
      provide: ACTIVIDADES_QUERY_REPOSITORY_TOKEN,
      useClass: PrismaActividadQueryRepository,
    },
    {
      provide: SUBACTIVIDADES_QUERY_REPOSITORY_TOKEN,
      useClass: PrismaSubActividadQueryRepository,
    },
  ],
  exports: [ACTIVIDAD_REPOSITORY_TOKEN],
})
export class ActividadesModule {}
