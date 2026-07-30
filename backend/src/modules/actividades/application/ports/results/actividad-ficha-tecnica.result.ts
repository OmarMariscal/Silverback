import { EquipoAuditorResult } from './actividad-equipo-auditor.result';

export interface ActividadFichaTecnicaResult {
  id: string;
  titulo: string;
  justificacion: string;
  objetivo_general: string;
  objetivos_particulares: string;
  metaDelProyecto: string;
  indicadores: string;

  //Apartados extras para los auditores
  equipoAuditor: EquipoAuditorResult[];
}
