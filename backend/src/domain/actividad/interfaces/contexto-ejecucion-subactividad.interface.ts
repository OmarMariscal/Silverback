import { EstadosPoa } from '@domain/poa/estados-poa.enum';

export interface ContextoEjecucionSubActividad {
  poaEstado: EstadosPoa;
  idUsuarioContralor: string | null;
  idUsuarioJefa: string | null;
  auditoresUsuariosIds: string[];
  centroClave: string;
  anioFiscal: number;
  ultimaVersionEntrega: number;
}
