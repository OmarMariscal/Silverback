import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class DevolverPoaDto {
  @ApiProperty({
    description: 'Observaciones de la Jefatura para justificar la devolución',
    example: 'Faltan justificar los montos asignados a viáticos',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10, {
    message: 'Las observacioens deben ser claras y descriptivas',
  })
  observaciones: string;
}
