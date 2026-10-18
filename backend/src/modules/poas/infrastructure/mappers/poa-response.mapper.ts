import { DateFormatterUtil } from '@core/utils/date-formater.utils';
import { ActividadEntity } from '@domain/actividad/actividad.entity';
import { EstadosPoa } from '@domain/poa/estados-poa.enum';
import { PoaActualResult } from '@modules/poas/application/ports/results/poa-actual.result';
import { CancelarPoaDto } from '@modules/poas/dto/request/poas-cancelar.dto';
import { PresentarPoasDto } from '@modules/poas/dto/request/poas-presentar.dto';
import { CrearActividadesResponseDto } from '@modules/poas/dto/response/poa-actividades.response.dto';
import { PoaActualDto } from '@modules/poas/dto/response/poa-actual.dto';
import {
  CalculadorSupervisionPoa,
  KpisSupervisionPoa,
} from '@domain/poa/calculador-supervision-poa.domain-service';
import { SupervisionCentroResult } from '@modules/poas/application/ports/results/supervision-centro.result';
import { SupervisionCentrosResponseDto } from '@modules/poas/dto/response/supervision-centros.response.dto';
import { PoaDeCentroResult } from '@modules/poas/application/ports/results/poa-de-centro.result';
import { PoaDeCentroResponseDto } from '@modules/poas/dto/response/poa-de-centro.response.dto';

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
    kpis: KpisSupervisionPoa,
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
              // hardcodeado hasta decidir si se agrega Contralor.activo en BD
              estatus: 'Activo',
            }
          : null,
        anios_historicos: centro.aniosHistoricos,
        poa_resumen_anio_actual: centro.poaAnioActual
          ? {
              id: centro.poaAnioActual.id,
              anio_fiscal: centro.poaAnioActual.anioFiscal,
              estado: centro.poaAnioActual.estado,
              // hardcodeado hasta decidir si se agrega Poa.fecha_envio en BD
              fecha_envio: null,
              porcentaje_avance_global: CalculadorSupervisionPoa.calcularAvance(
                centro.poaAnioActual.estado,
                centro.poaAnioActual.porcentajesActividades,
              ),
            }
          : null,
      })),
    };
  }

    static toPoaDeCentroDto(result: PoaDeCentroResult): PoaDeCentroResponseDto {
    const fecha = (valor: Date | null): string | null =>
      valor ? DateFormatterUtil.toAnioMesDia(valor) : null;

    return {
      poa: {
        id: result.id,
        anio_fiscal: result.anioFiscal,
        estado: result.estado,
        mensaje_resolucion: result.mensajeResolucion,
        // TODO(equipo): null hasta decidir si se agrega Poa.fecha_envio en BD
        fecha_envio: null,
        centro: {
          clave: result.centro.clave,
          nombre: result.centro.nombre,
        },
        contralor: { nombre_completo: result.contralor.nombreCompleto },
      },
      actividades: result.actividades.map((act) => ({
        id: act.id,
        folio: act.folio,
        titulo: act.titulo,
        fecha_inicio: fecha(act.fechaInicio),
        fecha_termino: fecha(act.fechaTermino),
        porcentaje_global: act.porcentajeGlobal,
        auditores: act.auditoresNombres,
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
