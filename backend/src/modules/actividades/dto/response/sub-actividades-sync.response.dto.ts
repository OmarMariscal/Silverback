import { ApiProperty } from '@nestjs/swagger';
import { SubActividadesSyncResume } from './sub-actividades-sync-resume.dto';

export class SubActividadesSyncResponse {
  @ApiProperty({
    example: 'Sub-actividades sincronizadas exitosamente',
    description: 'Descripción del estado de la operación',
  })
  mensaje!: string;

  @ApiProperty({
    description:
      'Arreglo con la información de las modificaciones hechas en la base de datos',
    type: SubActividadesSyncResume,
  })
  resumen!: SubActividadesSyncResume;
}
