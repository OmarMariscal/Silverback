import { Controller, Get } from '@nestjs/common';
import { AuditoresService } from './auditores.service';
import { ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuditoresDataDto } from './DTOS/response/auditores-data.dto';

@ApiTags('Auditores')
@Controller('auditores')
export class AuditoresController {
  constructor(private readonly auditoresService: AuditoresService) {}

  @ApiOperation({
    summary: 'Entrega lista de auditores',
    description: ''
  }) 
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
