import { Module } from '@nestjs/common';
import { ActividadesService } from './application/actividades.service';
import { ActividadesController } from './infrastructure/http/actividades.controller';
import { PrismaModule } from '@database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ActividadesController],
  providers: [ActividadesService],
})
export class ActividadesModule {}
