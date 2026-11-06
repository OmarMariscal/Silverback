import { EstadosPoa } from '@domain/poa/estados-poa.enum';

export interface SupervisionContralorActualResult {
  nombreCompleto: string;
}

export interface SupervisionPoaAnioActualResult {
  id: string;
  anioFiscal: number;
  estado: EstadosPoa;
  /** Avance de cada actividad de la POA (null en BD se reporta como 0) */
  porcentajesActividades: number[];
}

export interface SupervisionCentroResult {
  id: string;
  clave: string;
  nombre: string;
  contralorActual: SupervisionContralorActualResult | null;
  /** Años con POA, del más reciente al más antiguo, ya truncados a historicLimit */
  aniosHistoricos: number[];
  poaAnioActual: SupervisionPoaAnioActualResult | null;
}