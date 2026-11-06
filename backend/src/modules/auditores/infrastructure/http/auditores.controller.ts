import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuditoresService } from '../../application/auditores.service';
import { AuditoresDataDto } from '../../dto/response/auditores-data.dto';

// Importaciones del molde de tu equipo
import { JwtAuthGuard } from '@core/guards/jwt.guard';
import { PermisosGuard } from '@core/guards/roles.guard';
import { RequirePermissions } from '@core/decorators/roles.decorador';
import { Permisos } from '@domain/roles/permisos.enum';
import { UsuarioActual } from '@core/decorators/usuario-actual.decorador';
import type { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

@ApiTags('Auditores')
@ApiBearerAuth()
// 1. Activamos los guardias de JWT y Permisos
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('auditores')
export class AuditoresController {
  constructor(private readonly auditoresService: AuditoresService) {}

  @ApiOperation({
    summary: 'Entrega lista de auditores',
    description: 'Entrega a los auditores disponibles para registrar en la actividad'
  }) 
  @ApiResponse({ status: HttpStatus.OK, type: AuditoresDataDto })
  // 2. Le pedimos el permiso adecuado (en este caso, gestionar la POA tiene sentido)
  @RequirePermissions(Permisos.GESTIONAR_CONTENIDO_POA) 
  @Get()
  public async getAuditores(
    // 3. Extraemos la sesión
    @UsuarioActual() sesion: SesionUsuario 
  ): Promise<AuditoresDataDto> {
    
    // 4. Empaquetamos
    const query = {
      usuarioActualId: sesion.usuario_id
    };

    return await this.auditoresService.getAuditores(query);
  }
}