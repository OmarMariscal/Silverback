import { PaginacionMetadata } from '@core/common/dto/response/paginacion-metadata';
import { DateFormatterUtil } from '@core/utils/date-formater.utils';
import { TiempoFormatoUtil } from '@core/utils/tiempo-formato.utils';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { SubactividadEntity } from '@domain/actividad/subactividad.entity';
import { Roles } from '@domain/roles/roles.enum';
import { SemaforoService } from '@domain/semaforo/semaforo-service';
import { SubActividadPoaResult } from '@modules/actividades/application/ports/results/subactividad-para-poa.result';
import { SubActividadProximaVencerResult } from '@modules/actividades/application/ports/results/subactividad-proxima-a-vencer.result';
import { SubActividadSelectResult } from '@modules/actividades/application/ports/results/subactividad-select.result';
import { SubActividadSupervisionResult } from '@modules/actividades/application/ports/results/subactividad-supervision.result';
import { SubActividadesDirectorioResult } from '@modules/actividades/application/ports/results/subactividades-directorio.result';
import { ActividadesDirectorioAsignacionContralor } from '@modules/actividades/dto/response/actividades-directorio-asignacion-contralor.dto';
import { ActividadesDirectorioAsignacionJefa } from '@modules/actividades/dto/response/actividades-directorio-asignacion-jefa.dto';
import { SubActividadesSupervicionGetResponse } from '@modules/actividades/dto/response/actividades-supervision-get.response.dto';
import { SubActividadesBulkResponse } from '@modules/actividades/dto/response/sub-actividades-bulk.response.dto';
import { SubActividadesPoaResponse } from '@modules/actividades/dto/response/sub-actividades-poa.response.dto';
import { SubActividadesProximasVencerResponse } from '@modules/actividades/dto/response/sub-actividades-proximas-a-vencer-get.response.dto';
import { SubActividadesSelectResponse } from '@modules/actividades/dto/response/sub-actividades-select.response.dto';
import { SubActividadesSyncResponse } from '@modules/actividades/dto/response/sub-actividades-sync.response.dto';

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

  static toSubActividadSelect(
    subActividades: SubActividadSelectResult[],
  ): SubActividadesSelectResponse {
    return {
      data: subActividades.map((sub) => ({
        id: sub.id,
        folio: sub.folio,
        descripcion: sub.descripcion,
        tipo: sub.tipo,
        fechas: {
          fecha_inicio: DateFormatterUtil.toMesAnioCorto(sub.fecha_inicio),
          fecha_termino: DateFormatterUtil.toMesAnioCorto(sub.fecha_termino),
          semanas: sub.semanas ?? 0,
        },
        seleccionada: sub.seleccionada,
      })),
    };
  }

  static toSubActividadesSync(
    creadas: number,
    actualizadas: number,
    eliminadas: number,
  ): SubActividadesSyncResponse {
    return {
      mensaje: 'Sub-actividades sincronizadas exitosamente',
      resumen: {
        creadas,
        actualizadas,
        eliminadas,
      },
    };
  }

  static toProximasAVencer(
    rawList: SubActividadProximaVencerResult[],
  ): SubActividadesProximasVencerResponse {
    return {
      data: rawList.map((sub) => ({
        id: sub.id,
        titulo: sub.titulo,
        fecha_vencimiento: DateFormatterUtil.toMesAnioCorto(
          sub.fecha_vencimiento,
        ),

        estado_semaforo: SemaforoService.calcularSemaforo(sub.fecha_inicio),
        etiqueta_tiempo: SemaforoService.obtenerEtiquetaVencimiento(
          sub.fecha_vencimiento,
        ),
      })),
    };
  }

  private static generarMensajeResolucion(
    estado: EstadosActividades,
    tipo: string,
    conteo: number,
  ): string {
    // Si apenas se envió y está en revisión, el mensaje es neutro
    if (estado === EstadosActividades.EN_REVISION) {
      return 'Pendiente de revisión por jefatura';
    }

    // Si fue devuelta, aplicamos tu regla semántica
    if (estado === EstadosActividades.DEVUELTA) {
      const esAuditoria = tipo === 'AUDITORIA';
      const plural = esAuditoria ? 'observaciones' : 'revisiones';
      const singular = esAuditoria ? 'observación' : 'revisión';

      return `Devuelto con ${conteo} ${conteo === 1 ? singular : plural}`;
    }

    return 'Estado desconocido';
  }

  public static toSupervisionResponse(
    meta: PaginacionMetadata,
    rawList: SubActividadSupervisionResult[],
  ): SubActividadesSupervicionGetResponse {
    return {
      meta: meta,
      data: rawList.map((raw) => ({
        id: raw.id,
        titulo: raw.titulo,
        enviada_hace: TiempoFormatoUtil.tiempoTranscurrido(raw.fecha_envio),

        resolucion_jefa: {
          estado: raw.estado_resolucion,
          mensaje: this.generarMensajeResolucion(
            raw.estado_resolucion,
            raw.tipo,
            raw.conteo_observaciones,
          ),
          semaforo: SemaforoService.calcularSemaforoVencimiento(
            raw.fecha_vencimiento_poa,
          ),
        },
        vencimiento_poa: {
          fecha_texto: DateFormatterUtil.toAnioMesDia(
            raw.fecha_vencimiento_poa,
          ),
          etiqueta: SemaforoService.obtenerEtiquetaVencimiento(
            raw.fecha_vencimiento_poa,
          ),
        },
      })),
    };
  }

  /**
   * Genera la etiqueta semántica del estado (Ej: "Devuelta (3 Obs)")
   */
  private static generarEtiquetaEstado(
    estado: EstadosActividades,
    cantidad: number,
  ): string {
    // Convierte "EN_PROGRESO" a "En progreso"
    const estadoCapitalizado =
      estado.charAt(0) + estado.slice(1).toLowerCase().replace('_', ' ');

    if (estado === EstadosActividades.DEVUELTA && cantidad > 0) {
      return `${estadoCapitalizado} (${cantidad} Obs)`;
    }

    return estadoCapitalizado;
  }

  /**
   * FÁBRICA POLIMÓRFICA: Construye el objeto de asignación dependiendo del rol
   */
  private static construirAsignacion(
    raw: SubActividadesDirectorioResult,
    rolUsuario: Roles,
  ):
    | ActividadesDirectorioAsignacionJefa
    | ActividadesDirectorioAsignacionContralor {
    if (rolUsuario === Roles.JEFA) {
      return {
        tipo_vista: Roles.JEFA,
        centro_clave: raw.centro_clave ?? 'Sin Asignar',
        contralor: raw.contralor ?? 'Sin Asignar',
      };
    }

    // Fallback para Contralor / Auditor
    // Convertimos el arreglo de auditores [ "Juan", "Pedro" ] a un solo string "Juan, Pedro"
    const auditoresStr =
      raw.auditor_apoyo.length > 0 ? raw.auditor_apoyo.join(', ') : null;

    return {
      tipo_vista: Roles.CONTRALOR,
      participacion_porcentaje: raw.participacion_porcentaje ?? 100,
      auditor_apoyo: auditoresStr,
    };
  }

  public static toDirectorioResponse(
    meta: PaginacionMetadata,
    rawList: SubActividadesDirectorioResult[],
    rolUsuario: Roles, // Recibimos el rol explícitamente desde el Service
  ) {
    return {
      meta,
      data: rawList.map((raw) => ({
        id: raw.id,
        identificador: raw.identificador,
        tipo: raw.tipo,
        titulo: raw.titulo,

        // Blindaje contra zonas horarias
        fecha_termino: DateFormatterUtil.toAnioMesDia(raw.fecha_termino),

        // Inyección del polimorfismo
        asignacion: this.construirAsignacion(raw, rolUsuario),

        estado_operativo: {
          codigo: raw.codigo_estado,
          etiqueta: this.generarEtiquetaEstado(
            raw.codigo_estado,
            raw.cantidad_observaciones,
          ),
        },

        // Usamos el método blindado que creamos anteriormente
        semaforo: SemaforoService.calcularSemaforoVencimiento(
          raw.fecha_termino,
        ),
      })),
    };
  }
}
