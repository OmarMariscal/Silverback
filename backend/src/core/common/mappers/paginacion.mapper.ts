// src/core/common/mappers/paginacion.mapper.ts
import { PaginacionQueryDto } from '../dto/request/paginacion.query.dto';
import { PaginacionParams } from '@modules/actividades/application/ports/filtros/paginacion-params.filtro.interface';

export class PaginacionMapper {
  /**
   * Convierte un DTO de entrada HTTP a los parámetros estrictos requeridos por los Repositorios
   */
  public static toParams(dto: PaginacionQueryDto): PaginacionParams {
    return {
      // Aplicamos fallbacks seguros para TypeScript, aunque el Validator ya los traiga
      pagina: dto.page || 1,
      limite: dto.limit || 10,

      // Forzamos la conversión a minúscula y aseguramos el tipo para Prisma
      orden: (dto.order?.toLowerCase() as 'asc' | 'desc') || 'desc',
    };
  }
}
