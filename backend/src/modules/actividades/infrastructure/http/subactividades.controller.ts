import { PaginacionQueryDto } from '@core/common/dto/request/paginacion.query.dto';
import { HttpErrorDto } from '@core/common/dto/response/http-error.dto';
import { RequirePermissions } from '@core/decorators/roles.decorador';
import { UsuarioActual } from '@core/decorators/usuario-actual.decorador';
import { JwtAuthGuard } from '@core/guards/jwt.guard';
import { PermisosGuard } from '@core/guards/roles.guard';
import type { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { Permisos } from '@domain/roles/permisos.enum';
import { SubActividadesDirectorioQueryDto } from '@modules/actividades/dto/request/actividades-directorio.query.dto';
import { SubActividadesGetQueryDto } from '@modules/actividades/dto/request/actividades-get.query.dto';
import { SubActividadesDirectorioResponse } from '@modules/actividades/dto/response/actividades-directorio.response.dto';
import { SubActividadesGetResponse } from '@modules/actividades/dto/response/actividades-get.response.dto';
import { SubActividadesSupervicionGetResponse } from '@modules/actividades/dto/response/actividades-supervision-get.response.dto';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SubactividadesService } from '../../application/subactividades.service';
import { SubActividadesBulkRequest } from '../../dto/request/sub-actividadedes-bulk.request.dto';
import { SubActividadesProximasAVencerQueryDto } from '../../dto/request/sub-actividades-proximas-a-vencer.query.dto';
import { SubActividadesSyncRequest } from '../../dto/request/sub-actividades-sync.request.dto';
import { SubActividadesBulkResponse } from '../../dto/response/sub-actividades-bulk.response.dto';
import { SubActividadesPoaResponse } from '../../dto/response/sub-actividades-poa.response.dto';
import { SubActividadesProximasVencerResponse } from '../../dto/response/sub-actividades-proximas-a-vencer-get.response.dto';
import { SubActividadesSelectResponse } from '../../dto/response/sub-actividades-select.response.dto';
import { SubActividadesSyncResponse } from '../../dto/response/sub-actividades-sync.response.dto';

@ApiTags('Subactividades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('actividades') // UUsa el mismo destino de endpoints al ser considerado un 'hijo' de las actividades principales
export class SubactividadesController {
  constructor(private readonly subactividadesService: SubactividadesService) {}

  @ApiOperation({
    summary: 'Obtener actividades',
    description:
      'Obtener un array con el data de las sub-actividades con la posibilidad para ciertos roles para filtrar por auditorID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SubActividadesGetResponse,
    description: 'Operación realizada correctamente',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: HttpErrorDto,
    description: 'Rol no autorizado',
  })
  @Get()
  getSubActividades(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Query() dto: SubActividadesGetQueryDto,
  ): SubActividadesGetResponse {
    return this.subactividadesService.getSubActividades({ usuarioActual, dto });
  }

  @ApiOperation({
    summary: 'Obtener actividades devueltas para el dashboard',
    description:
      'Datos de las sub-actividades recientemente devueltas para la construcción de la tabla inferior del dashboard del contralor',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SubActividadesSupervicionGetResponse,
    description: 'Operación realizada con éxito',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: HttpErrorDto,
    description: 'Rol no autorizado',
  })
  @Get('supervision')
  async getActividadesSupervision(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Query() paginacionDto: PaginacionQueryDto,
  ): Promise<SubActividadesSupervicionGetResponse> {
    return await this.subactividadesService.getSubActividadesSupervision({
      usuarioActual,
      paginacionDto,
    });
  }

  @ApiOperation({
    summary: 'Directorio de Actividades',
    description:
      'Listado de las actividades para la construcción de los dashboards',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SubActividadesDirectorioResponse,
    description: 'Operación realizada con éxito',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: HttpErrorDto,
    description: 'Rol no autorizado',
  })
  @RequirePermissions(
    Permisos.VER_DASHBOARD_JEFATURA,
    Permisos.VER_DASHBOARD_CONTRALOR,
    Permisos.VER_DASHBOARD_AUDITOR,
  )
  @Get('directorio')
  async getActividadesDirectorio(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Query() dto: SubActividadesDirectorioQueryDto,
  ): Promise<SubActividadesDirectorioResponse> {
    return await this.subactividadesService.getSubActividadesDirectorio({
      usuarioActual,
      dto,
    });
  }

  @ApiOperation({
    summary: 'Listado de sub-actividades',
    description:
      'Endpoint para obtener el listado de las sub-actividades de una actividad principal.',
  })
  @ApiParam({
    name: 'actividadId',
    description: 'Identificador único (UUID) de la actividad principal',
    example: 'act-01-uuid',
    required: true,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Actividades recuperadas con éxito',
    type: SubActividadesPoaResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Actividad no encontrada',
    type: HttpErrorDto,
  })
  @RequirePermissions(Permisos.LEER_POA)
  @Get(':actividadId/sub-actividades-poa')
  async getSubActividadePoa(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('actividadId') actividadId: string,
  ): Promise<SubActividadesPoaResponse> {
    return await this.subactividadesService.getSubActividadesPoa({
      usuarioActual,
      actividadId,
    });
  }

  @ApiOperation({
    summary: 'Sub-actividades seleccionadas y no seleccionadas',
    description:
      'Listado de sub-actividades seleccionadas y provenientes del banco.',
  })
  @ApiParam({
    name: 'actividadId',
    description: 'Identificador único (UUID) de la actividad principal',
    example: 'act-01-uuid',
    required: true,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Actividades recuperadas con éxito',
    type: SubActividadesSelectResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Actividad no encontrada',
    type: HttpErrorDto,
  })
  @RequirePermissions(Permisos.CREAR_POA)
  @Get(':actividadId/sub-actividades-select')
  async getSubActividadesSelect(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('actividadId') actividadId: string,
  ): Promise<SubActividadesSelectResponse> {
    return await this.subactividadesService.getSubActividadesSelect({
      usuarioActual,
      actividadId,
    });
  }

  @ApiOperation({
    summary: 'Actividades próximas a vencer',
    description:
      'Retorna un listado de las actividades cuya fecha de término está más cerca.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista recuperada exitosamente',
    type: SubActividadesProximasVencerResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Rol no autorizado',
    type: HttpErrorDto,
  })
  @Get('proximas-vencer')
  async getSubActividadesProximasAVencer(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Query() dto: SubActividadesProximasAVencerQueryDto,
  ): Promise<SubActividadesProximasVencerResponse> {
    return await this.subactividadesService.getSubActividadesProximasAVencer({
      usuarioActual,
      dto,
    });
  }

  @ApiOperation({
    summary: 'Selección de subactividades',
    description: 'Sincronización de las subactividades seleccionadas.',
  })
  @ApiParam({
    name: 'actividadId',
    description:
      'El identificador único (UUID) de la actividad a la que van dirigidas las sub-actividades',
    example: 'act-01-uuid',
    required: true,
    format: 'uuid',
  })
  @ApiResponse({
    status: 201,
    description: 'Actividades agregadas exitosamente',
    type: SubActividadesBulkResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Rol no autorizado para esta operación',
    type: HttpErrorDto,
  })
  @RequirePermissions(Permisos.GESTIONAR_TRABAJO_POA)
  @Post(':actividadId/sub-actividades/bulk')
  async postSubActividadesBulk(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('actividadId') actividadId: string,
    @Body() dto: SubActividadesBulkRequest,
  ): Promise<SubActividadesBulkResponse> {
    return await this.subactividadesService.postSubActividadesBulk({
      usuarioActual,
      actividadId,
      dto,
    });
  }

  @ApiOperation({
    summary: 'Edición de múltiples sub-actividades',
    description:
      'Endpoint único para sincronizar varios cambios de una actividad principal objetivo.',
  })
  @ApiParam({
    name: 'actividadId',
    description: 'Identificador único (UUID) de la actividad principal',
    example: 'sub-uuid-1',
    required: true,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Sincronización realizada con éxito',
    type: SubActividadesSyncResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Error de validación de la estructura JSON',
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'UUID no coincide con una sub-actividad',
    type: HttpErrorDto,
  })
  @RequirePermissions(Permisos.CREAR_POA)
  @Put(':actividadId/sub-actividades/sync')
  async putSubActividadesSync(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('actividadId') actividadId: string,
    @Body() dto: SubActividadesSyncRequest,
  ): Promise<SubActividadesSyncResponse> {
    return await this.subactividadesService.putSubActividadesSync({
      usuarioActual,
      actividadId,
      dto,
    });
  }
}
