import { EliminacionCorrecta } from '@core/common/dto/response/deleted.response.dto';
import { HttpErrorDto } from '@core/common/dto/response/http-error.dto';
import { RequirePermissions } from '@core/decorators/roles.decorador';
import { UsuarioActual } from '@core/decorators/usuario-actual.decorador';
import { JwtAuthGuard } from '@core/guards/jwt.guard';
import { PermisosGuard } from '@core/guards/roles.guard';
import type { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { Permisos } from '@domain/roles/permisos.enum';
import { ActividadesService } from '@modules/actividades/application/actividades.service';
import { ActividadesPatchFichaTecnicaRequest } from '@modules/actividades/dto/request/actividades-path-ficha-tecnica.request.dto';
import { ActividadesFichaTecnicaResponse } from '@modules/actividades/dto/response/actividades-ficha-tecnica.response.dto';
import { ActividadesResumenResponse } from '@modules/actividades/dto/response/actividades-resumen.response.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Actividades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  //Get Estáticos
  @ApiOperation({
    summary: 'Detalles técnicos',
    description: 'Obtener los detalles técnicos de una actividad principal',
  })
  @ApiParam({
    name: 'actividadId',
    description: 'El identificador único (UUID) de la actividad principal',
    example: 'act-uuid-1',
    required: true,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ficha técnica recuperada con éxito',
    type: ActividadesResumenResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'UUID no identificado',
    type: HttpErrorDto,
  })
  @Get(':actividadId/resumen')
  getResumen(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('actividadId') actividadId: string,
  ): Promise<ActividadesResumenResponse> | ActividadesResumenResponse {
    return this.actividadesService.getResumen({ usuarioActual, actividadId });
  }

  @ApiOperation({
    summary: 'Obtener la ficha técnica',
    description:
      'Retorna la ficha técnica de una actividad principal registrada anteriormente.',
  })
  @ApiParam({
    name: 'actividadId',
    description: 'Identificador único (UUID) de la actividad principal',
    example: 'act-uuid-1',
    required: true,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ActividadesFichaTecnicaResponse,
    description: 'Operación realizada con éxito',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: HttpErrorDto,
    description: 'Actividad no encontrada',
  })
  @RequirePermissions(Permisos.LEER_POA)
  @Get(':actividadId/ficha-tecnica')
  async getFichaTecnica(
    @Param('actividadId') actividadId: string,
    @UsuarioActual() usuarioActual: SesionUsuario,
  ): Promise<ActividadesFichaTecnicaResponse> {
    return await this.actividadesService.getFichaTecnica({
      usuarioActual,
      actividadId,
    });
  }

  @ApiOperation({
    summary: 'Edición de la ficha técnica',
    description:
      'Todos campos opcionales para poder editar uno o varios en el mismo endpoint',
  })
  @ApiParam({
    name: 'actividadId',
    example: 'act-uuid-1',
    description: 'Identificador único (UUID) de la actividad principal',
    required: true,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ActividadesResumenResponse,
    description: 'Operación realizada con éxito',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: HttpErrorDto,
    description: 'Actividad no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: HttpErrorDto,
    description: 'Mal cuerpo  en su request',
  })
  @Patch(':actividadId/ficha-tecnica')
  patchFichaTecnica(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('actividadId') actividadId: string,
    @Body() dto: ActividadesPatchFichaTecnicaRequest,
  ): ActividadesResumenResponse {
    return this.actividadesService.patchFichaTecnica({
      usuarioActual,
      actividadId,
      dto,
    });
  }

  @ApiOperation({
    summary: 'Eliminar actividad',
    description:
      'Endpoint para eliminar una actividad que le pertenezca al mismo contralor',
  })
  @ApiParam({
    name: 'actividadId',
    example: 'act-uuid-01',
    description: 'Identificador Unico (UUID) de la actividad principal',
    required: true,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Actividad eliminada correctamente',
    type: EliminacionCorrecta,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Actividad no encontrada',
    type: HttpErrorDto,
  })
  @Delete(':actividadId')
  deleteActividad(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('actividadId') actividadId: string,
  ): EliminacionCorrecta {
    return this.actividadesService.deleteActividad({
      usuarioActual,
      actividadId,
    });
  }
}
