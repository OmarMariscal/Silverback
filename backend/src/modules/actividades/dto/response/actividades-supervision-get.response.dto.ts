import { ApiProperty } from '@nestjs/swagger';
import { PaginacionMetadata } from '@core/common/dto/response/paginacion-metadata';
import { ActividadesSupervisionSubActividadInfo } from './actividades-supervision-sub-actividad-info.dto';

export class SubActividadesSupervicionGetResponse {
  @ApiProperty({
    description: 'Metadatos de la paginación',
    type: PaginacionMetadata,
  })
  meta!: PaginacionMetadata;

  @ApiProperty({
    description:
      'Array con el listado de la información relevante de las sub-actividades',
    type: [ActividadesSupervisionSubActividadInfo],
  })
  data!: ActividadesSupervisionSubActividadInfo[];
}
