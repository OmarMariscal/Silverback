import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuditoresService } from '../../application/auditores.service';
import { ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuditoresDataDto } from '../../dto/response/auditores-data.dto';

@ApiTags('Auditores')
@Controller('auditores')
export class AuditoresController {
  constructor(private readonly auditoresService: AuditoresService) {}

  @ApiOperation({
    summary: 'Entrega lista de auditores',
    description: 'Entrega a los auditores disponibles para registrar en la actividad'
  }) 
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Obtiene la lista de auditores',
    type: AuditoresDataDto,
  })
  @Get()
  public async getAuditores(): Promise<AuditoresDataDto> {
    return this.auditoresService.getAuditores();
  }

}
