import { DateFormatterUtil } from '@core/utils/date-formater.utils';
import { SubactividadEntity } from '@domain/actividad/subactividad.entity';
import { SubActividadPoaResult } from '@modules/actividades/application/ports/results/subactividad-para-poa.result';
import { SubActividadesBulkResponse } from '@modules/actividades/dto/response/sub-actividades-bulk.response.dto';
import { SubActividadesPoaResponse } from '@modules/actividades/dto/response/sub-actividades-poa.response.dto';

export class SubActividadResponseMapper {
  static toBulkResponse(
    subActividadesGuardadas: SubactividadEntity[],
  ): SubActividadesBulkResponse {
    return {
      mensaje: `Se agregaron ${subActividadesGuardadas.length} sub-actividades exitosamente`,
      data: subActividadesGuardadas.map((sub) => ({
        id: sub.getId(),
        numero_orden: sub.getNumeroOrden(),
        semanas_totales: sub.calcularSemanasTotales(),
      })),
    };
  }

  static toSubActividadesPoa(
    subActividades: SubActividadPoaResult[],
  ): SubActividadesPoaResponse {
    return {
      data: subActividades.map((sub) => ({
        id: sub.id,
        folio: sub.folio,
        descripcion: sub.descripcion,
        tipo: sub.tipo,
        fechas: {
          fecha_inicio: DateFormatterUtil.toAnioMesDia(sub.fecha_inicio),
          fecha_termino: DateFormatterUtil.toAnioMesDia(sub.fecha_termino),
          semanas: sub.semanas,
        },
      })),
    };
  }
}
