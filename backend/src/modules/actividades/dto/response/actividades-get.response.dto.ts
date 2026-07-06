import { ApiProperty } from '@nestjs/swagger';
import { ActividadesGetData } from './actividades-get-data.dto';

export class ActividadesGetResponse {
  @ApiProperty({
    description: 'Array con la información de las sub-actividades',
    type: [ActividadesGetData],
  })
  data!: ActividadesGetData[];
}
