import { Module } from '@nestjs/common';
import { CatalogoController } from './infrastructure/http/catalogo.controller'; // Ajusta rutas
import { CatalogoService } from './application/catalogo.service';
import { PrismaCatalogoQueryRepository } from './infrastructure/repositories/prisma-catalogo-query.repository';
import { CATALOGO_QUERY_REPOSITORY_TOKEN } from './application/ports/catalogo-query.repository.interface';

@Module({
  controllers: [CatalogoController],
  providers: [
    CatalogoService,
    {
      provide: CATALOGO_QUERY_REPOSITORY_TOKEN,
      useClass: PrismaCatalogoQueryRepository,
    }
  ],
})
export class CatalogoModule {}