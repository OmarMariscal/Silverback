import { EstadosPoa } from '@domain/poa/estados-poa.enum';

export interface PoaDeCentroActividadResult {
  id: string;
  folio: string;
  titulo: string;
  fechaInicio: Date | null;
  fechaTermino: Date | null;
  porcentajeGlobal: number;
  auditoresNombres: string[];
}

export interface PoaDeCentroResult {
  id: string;
  anioFiscal: number;
  estado: EstadosPoa;
  mensajeResolucion: string | null;
  centro: { clave: string; nombre: string };
  contralor: { nombreCompleto: string };
  /** Ordenadas por folio (numérico) */
  actividades: PoaDeCentroActividadResult[];
}