import { Controller, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from '../../application/dashboard.service';

// Importaciones del molde de tu compañero
import { JwtAuthGuard } from '@core/guards/jwt.guard';
import { PermisosGuard } from '@core/guards/roles.guard';
import { RequirePermissions } from '@core/decorators/roles.decorador';
import { Permisos } from '@domain/roles/permisos.enum';
import { UsuarioActual } from '@core/decorators/usuario-actual.decorador';
import type { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { DashboardDto } from '@modules/dashboard/dto/response/dashboard.dto';
import { DashboardJefaDto } from '@modules/dashboard/dto/response/dashboard-jefa.dto';
import { RezagoDataDto } from '@modules/dashboard/dto/response/dashboard-rezago-data.dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
// 1. Aplicamos los guardias tal como lo hace tu compañero en ActividadesController
@UseGuards(JwtAuthGuard, PermisosGuard) 
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'KPIs del Contralor' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Operación realizada con éxito', type: DashboardDto })
  // 2. Protegemos el endpoint usando el enum de permisos
  @RequirePermissions(Permisos.VER_DASHBOARD_CONTRALOR)
  @Get('contralor/kpis')
  public async getKpisContralor(
    // 3. Extraemos la sesión completa con el decorador personalizado
    @UsuarioActual() usuarioActual: SesionUsuario 
  ): Promise<DashboardDto> {
    // 4. Empaquetamos la variable en el objeto Query
    const query = { 
      usuarioActualId: usuarioActual.usuario_id 
    };
    
    return await this.dashboardService.getKpisContralor(query);
  }

  @ApiOperation({ summary: 'KPIs de la Jefatura' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Operación realizada con éxito', type: DashboardJefaDto })
  @RequirePermissions(Permisos.VER_DASHBOARD_JEFATURA)
  @Get('jefa')
  public async getKpisJefa(
    @UsuarioActual() usuarioActual: SesionUsuario
  ): Promise<DashboardJefaDto> {
    const query = { 
      usuarioActualId: usuarioActual.usuario_id 
    };

    return await this.dashboardService.getKpisJefa(query);
  }

  @ApiOperation({ summary: 'Centros con rezago' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Muestra los centros universitarios con mayor atraso', type: RezagoDataDto })
  // Protegemos para que solo la jefa (o quien tú decidas) vea el rezago global
  @RequirePermissions(Permisos.VER_DASHBOARD_JEFATURA)
  @Get('rezago')
  public async getCentrosConRezago(): Promise<RezagoDataDto> {
    // Como no filtramos por usuario para esta vista global, 
    // no extraemos la sesión ni armamos el objeto Query. Solo llamamos al servicio.
    return await this.dashboardService.getCentrosConRezago();
  }
}