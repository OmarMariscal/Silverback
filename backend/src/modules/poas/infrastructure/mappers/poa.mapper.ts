import { Poa as PrismaPoa } from '@prisma/client';
import { PoaEntity } from '@domain/poa/poa.entity';
import { Mapper } from '@core/interfaces/mapper.interface';
import { Injectable } from '@nestjs/common';
import {
  traducirEstadoPoaADominio,
  traducirEstadoPoaAPrisma,
} from '@core/utils/estados-poa.traslator';
import { PrismaPoaPayload } from './types/prisma-poa.payload';

@Injectable()
export class PoaMapper implements Mapper<PoaEntity, PrismaPoa> {
  public toDomain(raw: PrismaPoaPayload): PoaEntity {
    // Construimos la entidad princiipal
    const poa = new PoaEntity(
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

    //2. Hidratación defensiva del contexto de seguridad
    if (raw.contralor) {
      const idUsuarioContralor = raw.contralor.usuario_id || null;
      const idJefa = raw.contralor.jefa?.usuario_id || null;
      poa.inyectarContextoDeSeguridad(idUsuarioContralor, idJefa);
    }

    return poa;
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
