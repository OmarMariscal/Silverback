import { ApiProperty } from '@nestjs/swagger';
import { SubActividadesPoaData } from './sub-actividades-poa-data.dto';

export class SubActividadesPoaResponse {
  @ApiProperty({
    type: [SubActividadesPoaData],
    description: 'Detalles de las sub-actividades previamente establecidos',
  })
  data: SubActividadesPoaData[];
}
