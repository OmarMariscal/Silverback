import { BancoActividadesDataResult } from './results/catalogo-banco.result';
import { BancoIdResult } from './results/catalogo-banco-id.result';
import { ActividadSugeridaDataResult } from './results/catalogo-banco-sugeridas.result';
import { CentroDataResult } from './results/catalogo-centro.result';

export const CATALOGO_QUERY_REPOSITORY_TOKEN = Symbol('CATALOGO_QUERY_REPOSITORY_TOKEN');

// ==========================================
// OBJETOS QUERY 
// ==========================================
export interface GetBancoActividadesQuery {
  usuarioActualId: string; // Siempre pasamos la sesión por si en el futuro queremos hacer catálogos privados
  busqueda?: string; 
}

export interface GetBancoActividadByIdQuery {
  usuarioActualId: string;
  id: string;
}

export interface GetCentrosQuery {
  usuarioActualId: string;
}

// ==========================================
// INTERFAZ DEL REPOSITORIO
// ==========================================
export interface ICatalogoQueryRepository {
  obtenerBancoActividades(query: GetBancoActividadesQuery): Promise<BancoActividadesDataResult>;

  obtenerBancoActividadPorId(query: GetBancoActividadByIdQuery): Promise<BancoIdResult | null>;

  obtenerSubActividadesSugeridas(query: GetBancoActividadByIdQuery): Promise<ActividadSugeridaDataResult>;

  obtenerCentros(query: GetCentrosQuery): Promise<CentroDataResult>;
}