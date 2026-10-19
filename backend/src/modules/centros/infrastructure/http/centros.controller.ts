import { HttpErrorDto } from '@core/common/dto/response/http-error.dto';
import { RequirePermissions } from '@core/decorators/roles.decorador';
import { UsuarioActual } from '@core/decorators/usuario-actual.decorador';
import { JwtAuthGuard } from '@core/guards/jwt.guard';
import { PermisosGuard } from '@core/guards/roles.guard';
import type { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { Permisos } from '@domain/roles/permisos.enum';
import { CentrosService } from '@modules/centros/application/centros.service';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PoaDeCentroQueryDto } from '../../dto/request/poa-de-centro.query.dto';
import { PoaDeCentroResponseDto } from '../../dto/response/poa-de-centro.response.dto';

@ApiTags('Centros')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('centros')
export class CentrosController {
  constructor(private readonly centrosService: CentrosService) {}

  @ApiOperation({
    summary: 'Detalle de la POA de un centro universitario',
    description:
      'Devuelve la POA del centro para el año indicado (o el vigente) con sus actividades. Solo centros bajo la jurisdicción de la Jefa.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: PoaDeCentroResponseDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El centro no tiene POA ese año o no es de su jurisdicción',
    type: HttpErrorDto,
  })
  @RequirePermissions(Permisos.GESTIONAR_SUPERVISION_POA)
  @Get(':centroId/poa')
  async getPoaDeCentro(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('centroId', ParseUUIDPipe) centroId: string,
    @Query() query: PoaDeCentroQueryDto,
  ): Promise<PoaDeCentroResponseDto> {
    return await this.centrosService.getPoaDeCentro({
      usuarioActual,
      centroId,
      anio: query.anio,
    });
  }
}