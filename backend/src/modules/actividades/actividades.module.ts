import { Module } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { PrismaModule } from '@database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ActividadesController],
  providers: [ActividadesService],
})
export class ActividadesModule {}
