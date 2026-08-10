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

@Injectable()
export class SubActividadMapper implements Mapper<
  SubactividadEntity,
  PrismaSubActividad
> {
  public toDomain(raw: PrismaSubActividad): SubactividadEntity {
    return new SubactividadEntity(
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
  }

  public toPersistence(
    entity: SubactividadEntity,
  ): Omit<PrismaSubActividad, 'actividad_id'> {
    return {
      id: entity.getId(),
      numero_orden: entity.getNumeroOrden(),
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
