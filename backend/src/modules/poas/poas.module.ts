import { Module } from '@nestjs/common';
import { PoasService } from './poas.service';
import { PoasController } from './poas.controller';

@Module({
  controllers: [PoasController],
  providers: [PoasService],
})
export class PoasModule {}
