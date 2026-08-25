import { DateFormatterUtil } from '@core/utils/date-formater.utils';
import { ActividadEntity } from '@domain/actividad/actividad.entity';
import { EstadosPoa } from '@domain/poa/estados-poa.enum';
import { PoaActualResult } from '@modules/poas/application/ports/results/poa-actual.result';
import { CancelarPoaDto } from '@modules/poas/dto/request/poas-cancelar.dto';
import { PresentarPoasDto } from '@modules/poas/dto/request/poas-presentar.dto';
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

  static toPresentarPoaDto(
    poaId: string,
    estadoAnterior: EstadosPoa,
    estadoNuevo: EstadosPoa,
  ): PresentarPoasDto {
    return {
      poa_id: poaId,
      estado_anterior: estadoAnterior,
      estado_nuevo: estadoNuevo,
      fecha_envio: new Date().toISOString(),
      mensaje: 'Poa Enviada con Éxito',
    };
  }

  static toCancelarPoa(
    poaId: string,
    estadoAnterior: EstadosPoa,
    estadoNuevo: EstadosPoa,
  ): CancelarPoaDto {
    return {
      poa_id: poaId,
      estado_anterior: estadoAnterior,
      estado_nuevo: estadoNuevo,
      fecha_cancelacion: new Date().toISOString(),
      mensaje: 'Envio Cancelado con Éxito',
    };
  }
}
