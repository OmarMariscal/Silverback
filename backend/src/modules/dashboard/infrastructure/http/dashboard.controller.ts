import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from '../../application/dashboard.service';
import { DashboardDto } from '../../dto/response/dashboard.dto';
import { DashboardJefaDto } from '../../dto/response/dashboard-jefa.dto';
import { RezagoDataDto } from '../../dto/response/dashboard-rezago-data.dto';
import { JwtAuthGuard } from '@core/guards/jwt.guard';
import { UsuarioActual } from '@core/decorators/usuario-actual.decorador';
import type { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({
      summary: 'Entrega los kpis del dashboard contralor',
      description: 'Entrega toda la informacion necesaria para las tarjetas superiores del dashboard del contralor.'
    })
  @ApiResponse({
    status: 200,
    description: 'Obtiene los KPIs del dashboard para el contralor',
    type: DashboardDto,
  })
  @Get('contralor/kpis')
  public async getDashboardContralor(
    @UsuarioActual() sesion: SesionUsuario
  ): Promise<DashboardDto> {
    return await this.dashboardService.getDashboardContralor(sesion.usuario_id);
  }

  @ApiOperation({
    summary: 'Entrega los kpis del dashboard jefa',
    description: 'Entrega toda la informacion necesaria para las tarjetas superiores del dashboard de la jefa.'
  })
  @ApiResponse({
    status: 200,
    description: 'Obtiene los kpis del dashboard de la jefa',
    type: DashboardJefaDto
  })
  @Get('jefatura/kpis')
  public async getDashboardJefa(): Promise<DashboardJefaDto> {
    return await this.dashboardService.getDashboardJefa();
  }

  @ApiOperation({
    summary: 'Entrega los centros con rezago',
    description: 'Entrega toda la informacion sobre los centros que tengan actividades con rezago'
  }) 
  @ApiResponse({
    status: 200,
    description: 'Obtiene una lista de centros con tareas rezagadas',
    type: RezagoDataDto
  })
  @Get('jefatura/rezago-centros')
  public async getCentrosConRezago(): Promise<RezagoDataDto> {
    return await this.dashboardService.getRezagoCentros();
  }
}
