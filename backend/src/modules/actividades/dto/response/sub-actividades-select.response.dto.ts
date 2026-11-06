import { ApiProperty } from '@nestjs/swagger';
import { SubActividadesSelectData } from './sub--actividades-select-data.dto';

export class SubActividadesSelectResponse {
  @ApiProperty({
    type: [SubActividadesSelectData],
    description:
      'Descripción de las sub-actividades seleccionadas y no seleccionadas',
  })
  data: SubActividadesSelectData[];
}
