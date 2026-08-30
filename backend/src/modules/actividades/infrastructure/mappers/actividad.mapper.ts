import { Mapper } from '@core/interfaces/mapper.interface';
import { Actividad as PrismaActividad } from '@prisma/client';
import { ActividadEntity } from '@domain/actividad/actividad.entity';
import { PrismaActividadPayload } from '../types/actividad-payload.type';
import { SubActividadMapper } from './subactividad.mapper';
import { Injectable } from '@nestjs/common';
import { traducirEstadoPoaADominio } from '@core/utils/estados-poa.traslator';

@Injectable()
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
    const auditoresIdsLimpio = raw.auditores
      ? raw.auditores.map((puente) => puente.auditor_id)
      : [];
    //2. Hidratamos las sub-actividades usando el mapper hijo
    const subActividadesHidratadas = raw.sub_actividades
      ? raw.sub_actividades.map((subRaw) =>
          this.subActividadMapper.toDomain(subRaw),
        )
      : [];
    //3. Construimos la entidad principal

    const actividad = new ActividadEntity(
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

    // 4. HIDRATACIÓN DEFENSIVA DE CONTEXTO DE SEGURIDAD
    // Si la consulta a Prisma incluyó el POA, extraemos e inyectamos los datos.
    // Esto protege a la Entidad para hacer validaciones de autorización (CQRS).
    if (raw.poa) {
      const estadoPoaDominio = traducirEstadoPoaADominio(raw.poa.estado);
      const idContralor = raw.poa.contralor?.usuario_id || null;
      const idJefa = raw.poa.contralor?.jefa?.usuario_id || null;
      const anioFiscal = raw.poa.anio_fiscal;

      actividad.inyectarContextoDeSeguridad(
        estadoPoaDominio,
        idContralor,
        idJefa,
        anioFiscal,
      );
    }

    return actividad;
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
