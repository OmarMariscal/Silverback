import { Module } from '@nestjs/common';
import { CatalogoService } from './application/catalogo.service';
import { CatalogoController } from './infrastructure/http/catalogo.controller';

@Module({
  controllers: [CatalogoController],
  providers: [CatalogoService],
})
export class CatalogoModule {}
