import { BancoActividadesDataResult } from './results/catalogo-banco.result';
import { BancoIdResult } from './results/catalogo-banco-id.result';
import { ActividadSugeridaDataResult } from './results/catalogo-banco-sugeridas.result';
import { CentroDataResult } from './results/catalogo-centro.result';
import { FiltrosBancoActividades } from './filtros/banco-actividades.filter.interface';

export const CATALOGO_QUERY_REPOSITORY_TOKEN = Symbol('CATALOGO_QUERY_REPOSITORY_TOKEN');

export interface ICatalogoQueryRepository {
  /**
   * Endpoint: GET /catalogos/banco-actividades
   */
  obtenerBancoActividades(filtros: FiltrosBancoActividades): Promise<BancoActividadesDataResult>;

  /**
   * Endpoint: GET /catalogos/banco-actividades/:id
   */
  obtenerBancoActividadPorId(id: string): Promise<BancoIdResult | null>;

  /**
   * Endpoint: GET /catalogos/banco-actividades/:id/sub-actividades-sugeridas
   */
  obtenerSubActividadesSugeridas(id: string): Promise<ActividadSugeridaDataResult>;

  /**
   * Endpoint: GET /catalogos/centros
   */
  obtenerCentros(): Promise<CentroDataResult>;
}