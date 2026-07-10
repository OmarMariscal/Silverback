import { ApiProperty } from '@nestjs/swagger';
import { ActividadesAuditoresResumen } from './actividades-auditores-resume.dto';

export class ActividadesEquipoAuditor {
  @ApiProperty({
    example: 2,
    description: 'Número total de los auditores involucrados',
  })
  total_participantes!: number;

  @ApiProperty({
    description: 'Lista con UUIDs y nombres de los auditores involucrados',
    type: [ActividadesAuditoresResumen],
  })
  auditores_seleccionados!: ActividadesAuditoresResumen[];
}
