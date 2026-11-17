import { SubActividad as PrismaSubActividad } from '@prisma/client';
import { SubactividadEntity } from '@domain/actividad/subactividad.entity';
import { Mapper } from '@core/interfaces/mapper.interface';
import { Injectable } from '@nestjs/common';
import {
  traducirEstadoSubActividadADominio,
  traducirEstadoSubActividadAPrisma,
  traducirTipoSubActividadADominio,
  traducirTipoSubActividadAPrisma,
} from '@core/utils/estados-sub-actividades.traslator';
import { traducirEstadoPoaADominio } from '@core/utils/estados-poa.traslator';
import { PrismaSubActividadEjecucionPayload } from '../types/subactividad-ejecucion-payload.type';

@Injectable()
export class SubActividadMapper implements Mapper<
  SubactividadEntity,
  PrismaSubActividad
> {
  public toDomain(
    raw: PrismaSubActividad | PrismaSubActividadEjecucionPayload,
  ): SubactividadEntity {
    const subActividad = new SubactividadEntity(
      raw.id,
      raw.numero_orden,
      raw.descripcion_tarea,
      traducirEstadoSubActividadADominio(raw.estado_operativo),
      traducirTipoSubActividadADominio(raw.tipo),
      raw.fecha_inicio,
      raw.fecha_termino,
      raw.fecha_envio,
      raw.mensaje_observacion,
      raw.banco_sub_actividad_id,
    );

    // Hidratación defensiva del contexto de seguridad y ejecución (CQRS / DDD)
    if ('actividad' in raw && raw.actividad?.poa) {
      const poa = raw.actividad.poa;
      const ultimaVersion =
        'entregas' in raw && raw.entregas && raw.entregas.length > 0
          ? raw.entregas[0].version
          : 0;

      const auditoresUsuariosIds = raw.actividad.auditores
        ? raw.actividad.auditores
            .map((rel) => rel.auditor?.usuario_id)
            .filter((uid): uid is string => typeof uid === 'string')
        : [];

      subActividad.inyectarContextoEjecucion({
        poaEstado: traducirEstadoPoaADominio(poa.estado),
        idUsuarioContralor: poa.contralor?.usuario_id ?? null,
        idUsuarioJefa: poa.contralor?.jefa?.usuario_id ?? null,
        auditoresUsuariosIds,
        centroClave: poa.centro?.clave ?? 'GENERAL',
        anioFiscal: poa.anio_fiscal,
        ultimaVersionEntrega: ultimaVersion,
      });
    }

    return subActividad;
  }

  public toPersistence(
    entity: SubactividadEntity,
  ): Omit<PrismaSubActividad, 'actividad_id'> {
    return {
      id: entity.getId(),
      numero_orden: entity.getNumeroOrden(),
      indice_orden: entity.getIndiceOrden(),
      descripcion_tarea: entity.getDescripcion(),
      estado_operativo: traducirEstadoSubActividadAPrisma(entity.getEstado()),
      fecha_inicio: entity.getFechaInicio(),
      fecha_termino: entity.getFechaConclusionEstimada(),
      fecha_envio: entity.getFechaEnvio() || null,
      semanas_totales: entity.calcularSemanasTotales(),
      tipo: traducirTipoSubActividadAPrisma(entity.getTipo()),
      mensaje_observacion: entity.getObservaciones() || null,
      banco_sub_actividad_id: entity.getBancoSubActividadId() || null,
    };
  }
}
