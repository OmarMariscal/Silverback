import {
  EstadoSubActividad,
  SubActividad as PrismaSubActividad,
  TipoActividad,
} from '@prisma/client';
import { SubactividadEntity } from '@domain/subactividades/subactividad.entity';
import { Mapper } from '@core/interfaces/mapper.interface';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';

export class SubActividadMapper implements Mapper<
  SubactividadEntity,
  PrismaSubActividad
> {
  // DICCIONARIOS ESTÁTICOS (Se crean 1 sola vez en memoria)

  private static readonly MAPA_ESTADOS_A_DOMINIO: Record<
    EstadoSubActividad,
    EstadosActividades
  > = {
    [EstadoSubActividad.SIN_EMPEZAR]: EstadosActividades.SIN_EMPEZAR,
    [EstadoSubActividad.SOLICITADO]: EstadosActividades.SOLICITADO,
    [EstadoSubActividad.EN_PROGRESO]: EstadosActividades.EN_PROGRESO,
    [EstadoSubActividad.EN_REVISION]: EstadosActividades.EN_REVISION,
    [EstadoSubActividad.DEVUELTA]: EstadosActividades.DEVUELTA,
    [EstadoSubActividad.CONCLUIDA]: EstadosActividades.CONCLUIDA,
  };

  private static readonly MAPA_TIPOS_A_DOMINIO: Record<
    TipoActividad,
    TipoSubActividad
  > = {
    [TipoActividad.AUDITORIA]: TipoSubActividad.AUDITORIA,
    [TipoActividad.REVISION]: TipoSubActividad.REVISION,
  };

  private static readonly MAPA_ESTADOS_A_PRISMA: Record<
    EstadosActividades,
    EstadoSubActividad
  > = {
    [EstadosActividades.SIN_EMPEZAR]: EstadoSubActividad.SIN_EMPEZAR,
    [EstadosActividades.SOLICITADO]: EstadoSubActividad.SOLICITADO,
    [EstadosActividades.EN_PROGRESO]: EstadoSubActividad.EN_PROGRESO,
    [EstadosActividades.EN_REVISION]: EstadoSubActividad.EN_REVISION,
    [EstadosActividades.DEVUELTA]: EstadoSubActividad.DEVUELTA,
    [EstadosActividades.CONCLUIDA]: EstadoSubActividad.CONCLUIDA,
  };

  private static readonly MAPA_TIPOS_A_PRISMA: Record<
    TipoSubActividad,
    TipoActividad
  > = {
    [TipoSubActividad.AUDITORIA]: TipoActividad.AUDITORIA,
    [TipoSubActividad.REVISION]: TipoActividad.REVISION,
  };

  // MÉTODOS DE MAPEO

  public toDomain(raw: PrismaSubActividad): SubactividadEntity {
    return new SubactividadEntity(
      raw.id,
      raw.numero_orden,
      raw.descripcion_tarea,
      SubActividadMapper.MAPA_ESTADOS_A_DOMINIO[raw.estado_operativo],
      SubActividadMapper.MAPA_TIPOS_A_DOMINIO[raw.tipo],
      raw.fecha_inicio,
      raw.fecha_termino,
      raw.fecha_envio,
      raw.mensaje_observacion,
    );
  }

  public toPersistence(
    entity: SubactividadEntity,
  ): Omit<PrismaSubActividad, 'actividad_id'> {
    return {
      id: entity.getId(),
      numero_orden: entity.getNumeroOrden(),
      descripcion_tarea: entity.getDescripcion(),
      estado_operativo:
        SubActividadMapper.MAPA_ESTADOS_A_PRISMA[entity.getEstado()],
      fecha_inicio: entity.getFechaInicio(),
      fecha_termino: entity.getFechaConclusionEstimada(),
      fecha_envio: entity.getFechaEnvio() || null,
      semanas_totales: entity.calcularSemanasTotales(),
      tipo: SubActividadMapper.MAPA_TIPOS_A_PRISMA[entity.getTipo()],
      mensaje_observacion: entity.getObservaciones() || null,
    };
  }
}
