import { DateFormatterUtil } from '@core/utils/date-formater.utils';
import { ActividadEntity } from '@domain/actividad/actividad.entity';
import { PoaActualResult } from '@modules/poas/application/ports/results/poa-actual.result';
import { CrearActividadesResponseDto } from '@modules/poas/dto/response/poa-actividades.response.dto';
import { PoaActualDto } from '@modules/poas/dto/response/poa-actual.dto';

export class PoaResponseMapper {
  static toPoaActualDto(rawPoa: PoaActualResult): PoaActualDto {
    return {
      id: rawPoa.id,
      anio_fiscal: rawPoa.anioFiscal,
      estado: rawPoa.estado,
      fecha_inicio: DateFormatterUtil.toMesAnioCorto(rawPoa.fechaInicio),
      fecha_termino: DateFormatterUtil.toMesAnioCorto(rawPoa.fechaTermino),
      actividades_resumen: rawPoa.actividadesResumen.map((sub) => {
        const divisores = sub.auditoresNombres.length + 1;
        const participacion = Math.round((100 / divisores) * 100) / 100;
        return {
          id: sub.id,
          folio: sub.folio,
          titulo: sub.titulo,
          participacion_global: participacion,
          auditores_nombres: sub.auditoresNombres,
          es_rezagado: sub.esRezago,
        };
      }),
    };
  }

  static toPostActividadPoa(
    actividadEntity: ActividadEntity,
  ): CrearActividadesResponseDto {
    return {
      id: actividadEntity.getId(),
      folio: actividadEntity.getFolio(),
      mensaje: 'Actividad Guardada Exitosamente',
    };
  }
}
