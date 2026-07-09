import { ApiProperty, OmitType } from '@nestjs/swagger';
import { SubActividadesPoaData } from './sub-actividades-poa-data.dto';
import { SubActividadesPoaFechas } from './sub-actividades-poa-fechas.dto';
import { Expose, Type } from 'class-transformer';

export class SubActividadesSelectData extends OmitType(SubActividadesPoaData, [
  'fechas',
] as const) {
  @ApiProperty({
    type: () => SubActividadesPoaFechas,
    required: false,
    default: {},
  })
  @Expose()
  @Type(() => SubActividadesPoaFechas)
  fechas?: SubActividadesPoaFechas | null;

  @ApiProperty({
    example: false,
    description:
      'Valor boolenao si la sub-actividad está seleccionada. Para valores falsos fechas vienen vacías',
  })
  seleccionada: boolean;
}
