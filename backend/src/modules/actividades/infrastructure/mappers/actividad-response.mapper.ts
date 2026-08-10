import { EliminacionCorrecta } from '@core/common/dto/response/deleted.response.dto';
import { ActividadEntity } from '@domain/actividad/actividad.entity';
import { ActividadFichaTecnicaResult } from '@modules/actividades/application/ports/results/actividad-ficha-tecnica.result';
import { ActividadResumenResult } from '@modules/actividades/application/ports/results/actividad-resumen.result';
import { ActividadesFichaTecnicaResponse } from '@modules/actividades/dto/response/actividades-ficha-tecnica.response.dto';
import { ActividadesResumenResponse } from '@modules/actividades/dto/response/actividades-resumen.response.dto';

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

  static toPatchFichaTecnica(
    actividad: ActividadEntity,
  ): ActividadesResumenResponse {
    return {
      id: actividad.getId(),
      titulo: actividad.getTitulo(),
      justificacion: actividad.getJustificacion() || '',
      objetivo_general: actividad.getObjetivoGeneral() || '',
      objetivos_particulares: actividad.getObjetivosParticulares() || '',
      meta_del_proyecto: actividad.getMetaDelProyecto() || '',
      indicadores: actividad.getIndicadores() || '',
    };
  }

  static toDeleteActividad(): EliminacionCorrecta {
    return {
      status: true,
      mensaje: 'Eliminación Correcta',
    };
  }

  static toGetResumen(
    actividad: ActividadResumenResult,
  ): ActividadesResumenResponse {
    return {
      id: actividad.id,
      titulo: actividad.titulo || '',
      justificacion: actividad.justificacion || '',
      objetivo_general: actividad.objetivo_general || '',
      objetivos_particulares: actividad.objetivos_particulares || '',
      meta_del_proyecto: actividad.meta_del_proyecto || '',
      indicadores: actividad.indicadores || '',
    };
  }
}
