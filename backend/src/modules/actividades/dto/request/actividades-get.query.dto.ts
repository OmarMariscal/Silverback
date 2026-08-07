import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class SubActividadesGetQuery {
  @ApiPropertyOptional({
    example: 'auditor-uuid-1',
    description: 'Identificador único (UUID) del auditor buscado',
  })
  @IsOptional()
  @IsUUID('4')
  auditor_id?: string;

  @ApiPropertyOptional({
    example: 'centro-uuid-1',
    description: 'Identificador único (UUID) del centro universitario',
  })
  @IsOptional()
  @IsUUID('4')
  centro_id?: string;
}
