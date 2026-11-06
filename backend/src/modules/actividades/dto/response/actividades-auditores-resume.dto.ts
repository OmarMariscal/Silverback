import { ApiProperty } from '@nestjs/swagger';

export class ActividadesAuditoresResumen {
  @ApiProperty({
    example: 'auditor-uuid-1',
    description: 'Identificador único (UUID) del auditor',
  })
  id!: string;

  @ApiProperty({
    example: 'José Madero Vizcaíno',
    description: 'Nombre del auditor auxiliar',
  })
  nombre!: string;
}
