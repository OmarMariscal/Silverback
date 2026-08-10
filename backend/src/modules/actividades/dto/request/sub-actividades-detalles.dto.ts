import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';

export class SubActividadDetalles {
  @ApiProperty({
    example: 'Elaborar acta circunscrita...',
    description: 'Descripción específica de la subactividad',
  })
  @IsNotEmpty()
  @IsString()
  descripcion_tarea!: string;

  @ApiProperty({
    example: '2026-01-01',
    description: 'Fecha de inicio de la subactividad',
  })
  @IsNotEmpty()
  @IsDateString()
  fecha_inicio!: string;

  @ApiProperty({
    example: '2026-02-26',
    description: 'Fecha de término de la subactividad',
  })
  @IsNotEmpty()
  @IsDateString()
  fecha_termino!: string;

  @ApiProperty({
    description: 'Tipo declarado de la subactividad',
    enum: TipoSubActividad,
    enumName: 'TipoSubActividad',
    example: TipoSubActividad.AUDITORIA,
  })
  @IsNotEmpty()
  @IsEnum(TipoSubActividad, {
    message: `El tipo debe ser una de los siguientes: ${Object.values(TipoSubActividad).join(', ')}`,
  })
  tipo!: TipoSubActividad;

  @ApiProperty({
    description:
      'Atributo opcional para enlistar de qué banco de actividad viene',
    example: 'banco_sub_actividad_uuid-1',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID proporcionado debe ser un UUID válido' })
  banco_sub_actividad_id?: string;
}
