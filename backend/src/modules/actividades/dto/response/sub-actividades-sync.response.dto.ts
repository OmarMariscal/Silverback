import { ApiProperty } from '@nestjs/swagger';
import { SubActividadDetallesSync } from '../request/sub-actividades-detalles-sync.dto';

export class SubActividadesSyncResponse {
  @ApiProperty({
    example: 'Sub-actividades sincronizadas exitosamente',
    description: 'Descripción del estado de la operación',
  })
  mensaje!: string;

  @ApiProperty({
    description:
      'Arreglo con la información de las modificaciones hechas en la base de datos',
    type: SubActividadDetallesSync,
  })
  resumen!: SubActividadDetallesSync;
}
