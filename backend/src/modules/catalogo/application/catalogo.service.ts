import { Injectable, Inject } from '@nestjs/common';
import * as catalogoQueryRepositoryInterface from './ports/catalogo-query.repository.interface';

// 1. Importamos los nuevos objetos Query
import { 
  GetBancoActividadesQuery, 
  GetBancoActividadByIdQuery, 
  GetCentrosQuery 
} from './ports/catalogo-query.repository.interface';

import { BancoActividadesDataDto } from '../dto/response/catalogo-banco-data.dto';
import { BancoIdDto } from '../dto/response/catalogo-banco-id.dto';
import { ActividadSugeridaDataDto } from '../dto/response/catalogo-banco-sugeridas-data.dto';
import { CentroDataDto } from '../dto/response/catalogo-centro-data.dto';

@Injectable()
export class CatalogoService {
  constructor(
    @Inject(catalogoQueryRepositoryInterface.CATALOGO_QUERY_REPOSITORY_TOKEN)
    private readonly catalogoQueryRepo: catalogoQueryRepositoryInterface.ICatalogoQueryRepository,
  ) {}

  // 2. Usamos el objeto Query como parámetro
  public async getBancoActividades(query: GetBancoActividadesQuery): Promise<BancoActividadesDataDto> {
    const result = await this.catalogoQueryRepo.obtenerBancoActividades(query);
    return result as unknown as BancoActividadesDataDto; 
  }

  public async getBancoActividadPorId(query: GetBancoActividadByIdQuery): Promise<BancoIdDto> {
    const result = await this.catalogoQueryRepo.obtenerBancoActividadPorId(query);
    return result as unknown as BancoIdDto;
  }

  public async getSubActividadesSugeridas(query: GetBancoActividadByIdQuery): Promise<ActividadSugeridaDataDto> {
    const result = await this.catalogoQueryRepo.obtenerSubActividadesSugeridas(query);
    return result as unknown as ActividadSugeridaDataDto;
  }

  public async getCentros(query: GetCentrosQuery): Promise<CentroDataDto> {
    const result = await this.catalogoQueryRepo.obtenerCentros(query);
    return result as unknown as CentroDataDto;
  }
}