import { Module } from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { CatalogoController } from './catalogo.controller';

@Module({
  controllers: [CatalogoController],
  providers: [CatalogoService],
})
export class CatalogoModule {}
