import { Poa as PrismaPoa } from '@prisma/client';
import { PoaEntity } from '@domain/poa/poa.entity';
import { Mapper } from '@core/interfaces/mapper.interface';
import { Injectable } from '@nestjs/common';
import {
  traducirEstadoPoaADominio,
  traducirEstadoPoaAPrisma,
} from '@core/utils/estados-poa.traslator';

@Injectable()
export class PoaMapper implements Mapper<PoaEntity, PrismaPoa> {
  public toDomain(raw: PrismaPoa): PoaEntity {
    // Construimos la entidad princiipal
    return new PoaEntity(
      raw.id,
      raw.anio_fiscal,
      raw.contralor_id,
      raw.centro_id,
      traducirEstadoPoaADominio(raw.estado),
      raw.mensaje_resolucion,
      [], // Hidratación superficial por defecto. La vcreación de snapshots no le corresponde al mapper.
      raw.fecha_aprobado,
      raw.ultima_secuencia_actividad,
    );
  }

  public toPersistence(entity: PoaEntity): PrismaPoa {
    return {
      id: entity.getId(),
      anio_fiscal: entity.getAnioFiscal(),
      estado: traducirEstadoPoaAPrisma(entity.getEstadosPoa()),
      fecha_aprobado: entity.getFechaAprobado(),
      mensaje_resolucion: entity.getMensajeResolucion(),
      contralor_id: entity.getContralorId(),
      centro_id: entity.getCentroUniversitarioId(),
      ultima_secuencia_actividad: entity.getUltimaSecuenciaActividad(),
    };
  }
}
