import { Injectable } from '@nestjs/common';
import { Evidencia as PrismaEvidencia } from '@prisma/client';
import { Mapper } from '@core/interfaces/mapper.interface';
import { EvidenciaEntity } from '@domain/actividad/evidencia.entity';
import {
  traducirEstadoArchivoADominio,
  traducirEstadoArchivoAPrisma,
} from '@core/utils/estados-sub-actividades.traslator';

@Injectable()
export class EvidenciaMapper implements Mapper<
  EvidenciaEntity,
  PrismaEvidencia
> {
  public toDomain(raw: PrismaEvidencia): EvidenciaEntity {
    return new EvidenciaEntity(
      raw.id,
      raw.sub_actividad_id,
      raw.entrega_id,
      raw.nombre_original,
      raw.s3_key,
      raw.peso_bytes,
      raw.tipo_mime,
      traducirEstadoArchivoADominio(raw.estado),
      raw.fecha_creacion,
    );
  }

  public toPersistence(entity: EvidenciaEntity): PrismaEvidencia {
    return {
      id: entity.getId(),
      sub_actividad_id: entity.getSubActividadId(),
      entrega_id: entity.getEntregaId(),
      nombre_original: entity.getNombreOriginal(),
      s3_key: entity.getObjectKey(),
      peso_bytes: entity.getPesoBytes(),
      tipo_mime: entity.getTipoMime(),
      estado: traducirEstadoArchivoAPrisma(entity.getEstado()),
      fecha_creacion: entity.getFechaCreacion(),
    };
  }
}
