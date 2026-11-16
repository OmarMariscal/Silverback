import { EntregaSubActividadEntity } from '../entrega-subactividad.entity';
import { EvidenciaEntity } from '../evidencia.entity';

export interface ConsolidarEntregaResult {
  entrega: EntregaSubActividadEntity;
  evidenciasConsolidadas: EvidenciaEntity[];
  evidenciasDescartadas: EvidenciaEntity[];
}
