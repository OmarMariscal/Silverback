import { EvidenciaEntity } from '../evidencia.entity';

export interface ConsolidarEntregaParams {
  entregaId: string;
  comentariosEntrega?: string | null;
  evidenciasEnBorrador: EvidenciaEntity[];
  evidenciasIdsSeleccionados?: string[];
  fechaEnvio?: Date;
}
