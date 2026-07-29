import { Module } from '@nestjs/common';
import { PoasService } from './application/poas.service';
import { PoasController } from './infrastructure/http/poas.controller';

@Module({
  controllers: [PoasController],
  providers: [PoasService],
})
export class PoasModule {}
