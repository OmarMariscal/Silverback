import { ApiProperty } from '@nestjs/swagger';
import { SubActividadesProximasAVencerResumen } from './sub-actividades-proximas-a-vencer-resumen.dto';

export class SubActividadesProximasVencerResponse {
  @ApiProperty({
    type: [SubActividadesProximasAVencerResumen],
    description:
      'Array con las actividades listadas con una fecha más próxima a vencer',
  })
  data!: SubActividadesProximasAVencerResumen[];
}
