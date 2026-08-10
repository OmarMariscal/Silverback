import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EquipoAuditorDto } from './poa-actividades-auditores.dto';
import {
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CrearActividadesDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'ID de la actividad dentro del banco de actividades',
    type: String,
    example: 'banco-uuid-1',
  })
  banco_actividad_id?: string;

  @IsString()
  @ApiProperty({
    description: 'Titulo de la actividad',
    type: String,
    example: 'Revisión al rubro de Obra Pública',
  })
  titulo: string;

  @IsString()
  @ApiProperty({
    description: 'Justificacion del porque de la Actividad',
    type: String,
    example: 'Verificar el adecuado cumplimiento en mi Centro Universitario...',
  })
  justificacion: string;

  @IsString()
  @ApiProperty({
    description: 'Objetivo de la actividad',
    type: String,
    example: 'Asegurar la correcta aplicación...',
  })
  objetivo_general: string;

  @IsString()
  @ApiProperty({
    description: 'Objetivos especificos de la actividad',
    type: String,
    example: 'Revisar el ejercicio de los recursos y los procesos..',
  })
  objetivos_especificos: string;

  @IsString()
  @ApiProperty({
    description: 'Metas de la actividad',
    type: String,
    example: '06 revisiones',
  })
  metas: string;

  @IsString()
  @ApiProperty({
    description: 'Objetivos especificos de la actividad',
    type: String,
    example:
      'Numero de revisiones realizadas entre numero de revisiones programadas',
  })
  indicadores: string;

  @IsObject()
  @ValidateNested()
  @Type(() => EquipoAuditorDto)
  @ApiProperty({
    description:
      'Informacion sobre el equipo de participantes en esta actividad',
    type: EquipoAuditorDto,
  })
  equipo_auditor: EquipoAuditorDto;
}
