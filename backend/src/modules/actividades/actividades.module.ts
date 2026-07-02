import { Module } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';

@Module({
  controllers: [ActividadesController],
  providers: [ActividadesService],
})
export class ActividadesModule {}
