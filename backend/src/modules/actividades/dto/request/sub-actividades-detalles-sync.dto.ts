import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { SubActividadDetalles } from './sub-actividades-detalles.dto';

export class SubActividadDetallesSync extends SubActividadDetalles {
  @ApiPropertyOptional({
    description:
      'UUID de la sub-actividad: \nSi se incluye, el sistema la actualizará. \nSi se omite, el sistema creará una nueva.',
    example: 'sub-uuid-1',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID proporcionado debe ser un UUID válido' })
  id?: string;
}
