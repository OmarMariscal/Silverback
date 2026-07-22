import { Mapper } from '@core/interfaces/mapper.interface';
import { Actividad as PrismaActividad } from '@prisma/client';
import { ActividadEntity } from '@domain/actividad/actividad.entity';
import { PrismaActividadPayload } from '../types/actividad-payload.type';
import { SubActividadMapper } from './subactividad.mapper';

export class ActividadMapper implements Mapper<
  ActividadEntity,
  PrismaActividadPayload
> {
  constructor(
    private readonly subActividadMapper: SubActividadMapper = new SubActividadMapper(),
  ) {}

  // Convierte de Prisma a Dominio
  public toDomain(raw: PrismaActividadPayload): ActividadEntity {
    //Limpiamos la tabla puente N:M (Sacamos solo los puros strings de los IDs)
    // DE [{ actividad_id: 'x', auditor_ud: '123' }] pasa a ser ['123']
    const auditoresIdsLimpio = raw.auditores.map((puente) => puente.auditor_id);

    //2. Hidratamos las sub-actividades usando el mapper hijo
    const subActividadesHidratadas = raw.sub_actividades.map((subRaw) =>
      this.subActividadMapper.toDomain(subRaw),
    );

    //3. Construimos la entidad principal

    return new ActividadEntity(
      raw.id,
      raw.folio,
      raw.titulo,
      raw.justificacion ?? null,
      raw.objetivo_general ?? null,
      raw.objetivos_part ?? null,
      raw.meta_proyecto ?? null,
      raw.indicadores ?? null,
      raw.fecha_inicio ?? null,
      raw.fecha_termino ?? null,
      raw.es_rezago,
      auditoresIdsLimpio,
      subActividadesHidratadas,
      raw.banco_actividad_id,
    );
  }

  //Estrae lo datos del Dominio para guardarlos en Primsa
  public toPersistence(
    entity: ActividadEntity,
  ): Omit<PrismaActividad, 'poa_id'> {
    return {
      id: entity.getId(),
      folio: entity.getFolio(),
      titulo: entity.getTitulo(),
      justificacion: entity.getJustificacion(),
      objetivo_general: entity.getObjetivoGeneral(),
      objetivos_part: entity.getObjetivosParticulares(),
      meta_proyecto: entity.getMetaDelProyecto(),
      indicadores: entity.getIndicadores(),
      fecha_inicio: entity.getFechaInicio(),
      fecha_termino: entity.getFechaTermino(),
      es_rezago: entity.getEsRezago(),

      porcentaje_global: entity.calcularPorcentajeAvance(),
      banco_actividad_id: entity.getBancoActividadId(),
    };
  }
}
