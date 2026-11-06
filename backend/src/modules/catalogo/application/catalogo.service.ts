import { Injectable, Inject } from '@nestjs/common';

// 1. Importaciones normales
import { 
  CATALOGO_QUERY_REPOSITORY_TOKEN,
  GetBancoActividadesQuery, 
  GetBancoActividadByIdQuery, 
  GetCentrosQuery 
} from './ports/catalogo-query.repository.interface';

import type { 
  ICatalogoQueryRepository 
} from './ports/catalogo-query.repository.interface';

import { BancoActividadesDataDto } from '../dto/response/catalogo-banco-data.dto';
import { BancoIdDto } from '../dto/response/catalogo-banco-id.dto';
import { ActividadSugeridaDataDto } from '../dto/response/catalogo-banco-sugeridas-data.dto';
import { CentroDataDto } from '../dto/response/catalogo-centro-data.dto';

@Injectable()
export class CatalogoService {
  constructor(
    @Inject(CATALOGO_QUERY_REPOSITORY_TOKEN)
    private readonly catalogoQueryRepo: ICatalogoQueryRepository,
  ) {}

  public async getBancoActividades(query: GetBancoActividadesQuery): Promise<BancoActividadesDataDto> {
    const { usuarioActualId, busqueda } = query; 
    const result = await this.catalogoQueryRepo.obtenerBancoActividades(query);
    return result as unknown as BancoActividadesDataDto; 
  }

  public async getBancoActividadPorId(query: GetBancoActividadByIdQuery): Promise<BancoIdDto> {
    const { usuarioActualId, id } = query;
    const result = await this.catalogoQueryRepo.obtenerBancoActividadPorId(query);
    return result as unknown as BancoIdDto;
  }

  public async getSubActividadesSugeridas(query: GetBancoActividadByIdQuery): Promise<ActividadSugeridaDataDto> {
    const { usuarioActualId, id } = query;
    const result = await this.catalogoQueryRepo.obtenerSubActividadesSugeridas(query);
    return result as unknown as ActividadSugeridaDataDto;
  }

  public async getCentros(query: GetCentrosQuery): Promise<CentroDataDto> {
    const { usuarioActualId } = query;
    const result = await this.catalogoQueryRepo.obtenerCentros(query);
    return result as unknown as CentroDataDto;
  }
}