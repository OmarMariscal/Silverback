import { EstadoPoa, Poa as PrismaPoa } from '@prisma/client';
import { PoaEntity } from '@domain/poa/poa.entity';
import { EstadosPoa } from '@domain/poa/estados-poa.enum';
import { Mapper } from '@core/interfaces/mapper.interface';

export class PoaMapper implements Mapper<PoaEntity, PrismaPoa> {
  // Diccionarios Estáticos
  private static readonly MAPA_ESTADOS_A_DOMINIO: Record<
    EstadoPoa,
    EstadosPoa
  > = {
    [EstadoPoa.BORRADOR]: EstadosPoa.BORRADOR,
    [EstadoPoa.EN_REVISION]: EstadosPoa.EN_REVISION,
    [EstadoPoa.DEVUELTA]: EstadosPoa.DEVUELTA,
    [EstadoPoa.AUTORIZADO]: EstadosPoa.AUTORIZADA,
  };

  private static readonly MAPA_ESTADOS_A_PRISMA: Record<EstadosPoa, EstadoPoa> =
    {
      [EstadosPoa.BORRADOR]: EstadoPoa.BORRADOR,
      [EstadosPoa.EN_REVISION]: EstadoPoa.EN_REVISION,
      [EstadosPoa.DEVUELTA]: EstadoPoa.DEVUELTA,
      [EstadosPoa.AUTORIZADA]: EstadoPoa.AUTORIZADO,
    };

  constructor() {}

  public toDomain(raw: PrismaPoa): PoaEntity {
    // Construimos la entidad princiipal
    return new PoaEntity(
      raw.id,
      raw.anio_fiscal,
      raw.contralor_id,
      raw.centro_id,
      PoaMapper.MAPA_ESTADOS_A_DOMINIO[raw.estado],
      raw.mensaje_resolucion,
      [], // Hidratación superficial por defecto. La vcreación de snapshots no le corresponde al mapper.
      raw.fecha_aprobado,
    );
  }

  public toPersistence(entity: PoaEntity): PrismaPoa {
    return {
      id: entity.getId(),
      anio_fiscal: entity.getAnioFiscal(),
      estado: PoaMapper.MAPA_ESTADOS_A_PRISMA[entity.getEstadosPoa()],
      fecha_aprobado: entity.getFechaAprobado(),
      mensaje_resolucion: entity.getMensajeResolucion(),
      contralor_id: entity.getContralorId(),
      centro_id: entity.getCentroUniversitarioId(),
    };
  }
}
