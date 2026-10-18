import { DateFormatterUtil } from '@core/utils/date-formater.utils';
import { ActividadEntity } from '@domain/actividad/actividad.entity';
import { EstadosPoa } from '@domain/poa/estados-poa.enum';
import { PoaActualResult } from '@modules/poas/application/ports/results/poa-actual.result';
import { CancelarPoaDto } from '@modules/poas/dto/request/poas-cancelar.dto';
import { PresentarPoasDto } from '@modules/poas/dto/request/poas-presentar.dto';
import { CrearActividadesResponseDto } from '@modules/poas/dto/response/poa-actividades.response.dto';
import { PoaActualDto } from '@modules/poas/dto/response/poa-actual.dto';
import { CalculadoraKpiService } from '@domain/kpi/calculador-kpi..domain-service';
import { KpiSupervisionPoaResult } from '@domain/kpi/interfaces/kpi-supervision-poa-result.interface';
import { SupervisionCentroResult } from '@modules/poas/application/ports/results/supervision-centro.result';
import { SupervisionCentrosResponseDto } from '@modules/poas/dto/response/supervision-centros.response.dto';


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

    static toSupervisionCentrosDto(
    kpis: KpiSupervisionPoaResult,
    centros: SupervisionCentroResult[],
  ): SupervisionCentrosResponseDto {
    return {
      kpis_globales: {
        total_centros: kpis.totalCentros,
        por_autorizar: kpis.porAutorizar,
        devueltas: kpis.devueltas,
        autorizadas: kpis.autorizadas,
      },
      centros: centros.map((centro) => ({
        id: centro.id,
        clave: centro.clave,
        nombre: centro.nombre,
        contralor_actual: centro.contralorActual
          ? {
              nombre_completo: centro.contralorActual.nombreCompleto,
              estatus: 'Activo',
            }
          : null,
        anios_historicos: centro.aniosHistoricos,
        poa_resumen_anio_actual: centro.poaAnioActual
          ? {
              id: centro.poaAnioActual.id,
              anio_fiscal: centro.poaAnioActual.anioFiscal,
              estado: centro.poaAnioActual.estado,
              fecha_envio: null,
              porcentaje_avance_global: CalculadoraKpiService.calcularAvanceSupervisionPoa(
                centro.poaAnioActual.estado,
                centro.poaAnioActual.porcentajesActividades,
              ),
            }
          : null,
      })),
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
