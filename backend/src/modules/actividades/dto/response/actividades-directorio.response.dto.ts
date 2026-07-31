import { ApiProperty } from '@nestjs/swagger';
import { PaginacionMetadata } from '@core/common/dto/response/paginacion-metadata';
import { ActividadesDirectorioData } from './actividades-directorio-data.dto';

export class SubActividadesDirectorioResponse {
  @ApiProperty({
    description: 'Registro de metadatos de la paginación',
    type: PaginacionMetadata,
  })
  meta!: PaginacionMetadata;

  @ApiProperty({
    description: 'Array con las actividades recuperadas',
    type: [ActividadesDirectorioData],
  })
  data!: ActividadesDirectorioData[];
}
