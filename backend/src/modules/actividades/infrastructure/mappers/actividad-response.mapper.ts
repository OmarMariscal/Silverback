import { ActividadFichaTecnicaResult } from '@modules/actividades/application/ports/results/actividad-ficha-tecnica.result';
import { ActividadesFichaTecnicaResponse } from '@modules/actividades/dto/response/actividades-ficha-tecnica.response.dto';

export class ActividadResponseMapper {
  static toFichaTecnica(
    fichaTecnica: ActividadFichaTecnicaResult,
  ): ActividadesFichaTecnicaResponse {
    return {
      id: fichaTecnica.id,
      titulo: fichaTecnica.titulo,
      justificacion: fichaTecnica.justificacion,
      objetivo_general: fichaTecnica.objetivoGeneral,
      objetivos_particulares: fichaTecnica.objetivosParticulares,
      meta_del_proyecto: fichaTecnica.metaDelProyecto,
      indicadores: fichaTecnica.indicadores,
      equipo_auditor: fichaTecnica.equipoAuditor,
    };
  }
}
