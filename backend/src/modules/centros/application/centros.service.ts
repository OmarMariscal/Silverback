import { RecursoNoEncontradoException } from '@domain/excepciones/recurso-no-encontrado.exception';
import { Inject, Injectable } from '@nestjs/common';
import { PoaDeCentroResponseDto } from '../dto/response/poa-de-centro.response.dto';
import { CentrosResponseMapper } from '../infrastructure/mappers/centros-response.mapper';
import type { ICentrosQueryRepository } from './ports/centros-query.repository.interface';
import { CENTROS_QUERY_REPOSITORY_TOKEN } from './ports/centros-query.repository.interface';
import { GetPoaDeCentroQuery } from './ports/queries/get-poa-de-centro.query';

@Injectable()
export class CentrosService {
  constructor(
    @Inject(CENTROS_QUERY_REPOSITORY_TOKEN)
    private readonly centrosQueryRepository: ICentrosQueryRepository,
  ) {}

  async getPoaDeCentro(
    query: GetPoaDeCentroQuery,
  ): Promise<PoaDeCentroResponseDto> {
    const { usuarioActual, centroId } = query;
    const anioFiscal = query.anio ?? new Date().getFullYear();

    const poa = await this.centrosQueryRepository.obtenerPoaDeCentro({
      jefaUsuarioId: usuarioActual.usuario_id,
      centroId,
      anioFiscal,
    });

    if (!poa) {
      throw new RecursoNoEncontradoException(
        `POA ${anioFiscal} del centro`,
        centroId,
        usuarioActual.usuario_id,
      );
    }

    return CentrosResponseMapper.toPoaDeCentroDto(poa);
  }
}