import { Injectable } from '@nestjs/common';
import { EntregaSubActividad as PrismaEntregaSubActividad } from '@prisma/client';
import { Mapper } from '@core/interfaces/mapper.interface';
import { EntregaSubActividadEntity } from '@domain/actividad/entrega-subactividad.entity';
import {
  traducirEstadoDictamenADominio,
  traducirEstadoDictamenAPrisma,
} from '@core/utils/estados-sub-actividades.traslator';

@Injectable()
export class EntregaSubActividadMapper implements Mapper<
  EntregaSubActividadEntity,
  PrismaEntregaSubActividad
> {
  public toDomain(raw: PrismaEntregaSubActividad): EntregaSubActividadEntity {
    return new EntregaSubActividadEntity(
      raw.id,
      raw.sub_actividad_id,
      raw.version,
      traducirEstadoDictamenADominio(raw.estado_dictamen),
      raw.comentarios_entrega,
      raw.fecha_envio,
      raw.fecha_dictamen,
    );
  }

  public toPersistence(
    entity: EntregaSubActividadEntity,
  ): PrismaEntregaSubActividad {
    return {
      id: entity.getId(),
      sub_actividad_id: entity.getSubActividadId(),
      version: entity.getVersion(),
      estado_dictamen: traducirEstadoDictamenAPrisma(
        entity.getEstadoDictamen(),
      ),
      comentarios_entrega: entity.getComentariosEntrega(),
      fecha_envio: entity.getFechaEnvio(),
      fecha_dictamen: entity.getFechaDictamen(),
    };
  }
}
