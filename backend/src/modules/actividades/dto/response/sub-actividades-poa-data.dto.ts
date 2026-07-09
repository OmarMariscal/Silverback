import { ApiProperty } from '@nestjs/swagger';
import { SubActividadesPoaFechas } from './sub-actividades-poa-fechas.dto';
import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';

export class SubActividadesPoaData {
  @ApiProperty({
    example: 'subact-uuid-1',
    description: 'Identificador único (UUID) de la sub-actividad',
  })
  id: string;

  @ApiProperty({
    example: '2.1',
    description: 'Folio de orden de la sub-actividad',
  })
  folio: string;

  @ApiProperty({
    example:
      'Revisión al rubro de Obra Pública. Verificar el adecuado cumplimiento a los procedimientos relativos a la planeación',
    description: 'Descripción de la sub-actividad',
  })
  descripcion: string;

  @ApiProperty({
    example: TipoSubActividad.AUDITORIA,
    enum: TipoSubActividad,
    enumName: 'TipoActividad',
    description: 'Tipo de la sub-actividad',
  })
  tipo: TipoSubActividad;

  @ApiProperty({
    type: SubActividadesPoaFechas,
    description: 'Rango de fechas previamente establecidas',
  })
  fechas: SubActividadesPoaFechas;
}
