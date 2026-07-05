import { Controller, Get } from '@nestjs/common';
import { AuditoresService } from './auditores.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuditoresDataDto } from './DTOS/response/auditores.dto';

@ApiTags('Auditores')
@Controller('auditores')
export class AuditoresController {
  constructor(private readonly auditoresService: AuditoresService) {}

  @ApiResponse({
    status: 200,
    description: 'Obtiene la lista de auditores',
    type: AuditoresDataDto,
  })
  @Get()
  getAuditores(auditoresData: AuditoresDataDto): AuditoresDataDto {
    return auditoresData;
  }

}
