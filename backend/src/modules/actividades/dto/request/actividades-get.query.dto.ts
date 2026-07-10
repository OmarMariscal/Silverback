import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class ActividadesGetQuery {
  @ApiPropertyOptional({
    example: 'auditor-uuid-1',
    description: 'Identificador único (UUID) del auditor buscado',
  })
  @IsOptional()
  @IsUUID('4')
  auditor_id?: string;
}
