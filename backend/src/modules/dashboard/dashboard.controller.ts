import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { DashboardDto } from './DTOS/response/dashboard.dto';
import { DashboardJefaDto } from './DTOS/response/dashboard-jefa.dto';
import { RezagoDataDto

 } from './DTOS/response/dashboard-rezago-data.dto';
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({
      summary: 'Entrega los kpis del dashboard contralor',
      description: ''
    })
  @ApiResponse({
    status: 200,
    description: 'Obtiene los KPIs del dashboard para el contralor',
    type: DashboardDto,
  })
  @Get('contralor/kpis')
  getDashboardContralor(dashboardDto: DashboardDto) {
    return dashboardDto;
  }

  @ApiOperation({
    summary: 'Entrega los kpis del dashboard jefa',
    description: ''
  })
  @ApiResponse({
    status: 200,
    description: 'Obtiene los kpis del dashboard de la jefa',
    type: DashboardJefaDto
  })
  @Get('jefatura/kpis')
  async getDashboardJefa(dashboardDto: DashboardJefaDto): Promise<DashboardJefaDto>{
    return dashboardDto;
  }

  @ApiOperation({
    summary: 'Entrega los centros con rezago',
    description: ''
  }) 
  @ApiResponse({
    status: 200,
    description: 'Obtiene una lista de centros con tareas rezagadas',
    type: RezagoDataDto
  })
  @Get('jefatura/rezago-centros')
  getRezagoCentros(rezagoDto: RezagoDataDto){
    return rezagoDto;

  }
}
