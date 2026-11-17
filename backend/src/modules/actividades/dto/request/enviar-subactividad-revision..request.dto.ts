import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class EnviarSubActividadRevisionRequestDto {
  @ApiProperty({
    description:
      'UUIDs de archivos en buzón. Si se envían, se valida y actualiza el borrador antes de cambiar de estado',
    example: ['archivo-uuid-1'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  evidencias_ids?: string[];

  @ApiPropertyOptional({
    description: 'Comentarios opcionales de la entrega dirigidos a la Jefatura',
    example: 'Se adjuntan las firmas solicitadas en la observación 2...',
  })
  @IsOptional()
  @IsString()
  comentarios_entrega?: string;
}
