import { ApiProperty } from '@nestjs/swagger';
import { ActividadesResumenResponse } from './actividades-resumen.response.dto';
import { ActividadesAuditoresResumen } from './actividades-auditores-resume.dto';

export class ActividadesFichaTecnicaResponse extends ActividadesResumenResponse {
  @ApiProperty({
    description:
      'Array de los identificadores únicos (UUIDs) y nombres de los auditores registrados',
    type: [ActividadesAuditoresResumen],
  })
  equipo_auditor!: ActividadesAuditoresResumen[];
}
