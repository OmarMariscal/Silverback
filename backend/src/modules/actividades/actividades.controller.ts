import {
  Controller,
  Get,
  Post,
  Param,
  HttpStatus,
  Body,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import {
  ApiParam,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { ActividadesResumenResponse } from './dto/response/actividades-resumen.response.dto';
import { HttpErrorDto } from 'src/core/common/dto/response/http-error.dto';
import { SubActividadesBulkResponse } from './dto/response/sub-actividades-bulk.response.dto';
import { SubActividadesBulkRequest } from './dto/request/sub-actividadedes-bulk.request.dto';
import { SubActividadesSyncRequest } from './dto/request/sub-actividades-sync.request.dto';
import { SubActividadesSyncResponse } from './dto/response/sub-actividades-sync.response.dto';
import { ActividadesFichaTecnicaResponse } from './dto/response/actividades-ficha-tecnica.response.dto';
import { ActividadesPatchFichaTecnicaRequest } from './dto/request/actividades-path-ficha-tecnica.request.dto';
import { SubActividadesProximasVencerResponse } from './dto/response/sub-actividades-proximas-a-vencer-get.response.dto';
import { SubActividadesProximasAVencerQuery } from './dto/request/sub-actividades-proximas-a-vencer.query.dto';
import { PaginacionQueryDto } from 'src/core/common/dto/request/paginacion.query.dto';
import { ActividadesSupervicionGetResponse } from './dto/response/actividades-supervision-get.response.dto';
import { ActividadesDirectorioResponse } from './dto/response/actividades-directorio.response.dto';
import { ActividadesDirectorioQuery } from './dto/request/actividades-directorio.query.dto';
import { ActividadesGetResponse } from './dto/response/actividades-get.response.dto';
import { ActividadesGetQuery } from './dto/request/actividades-get.query.dto';

@ApiTags('Actividades')
@ApiBearerAuth()
@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  //Get Estáticos
  @ApiOperation({
    summary: 'Obtener actividades',
    description:
      'Obtener un array con el data de las sub-actividades con la posibilidad para ciertos roles para filtrar por auditorID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ActividadesGetResponse,
    description: 'Operación realizada correctamente',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: HttpErrorDto,
    description: 'Rol no autorizado',
  })
  @Get()
  getActividades(
    @Query() queryActividades: ActividadesGetQuery,
  ): ActividadesGetResponse {
    return this.actividadesService.getActividades(queryActividades);
  }

  @ApiOperation({
    summary: 'Actividades próximas a vencer',
    description:
      'Retorna un listado de las actividades cuya fecha de término está más cerca',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista recuperada exitosamente',
    type: SubActividadesProximasVencerResponse,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Rol no autorizado',
    type: HttpErrorDto,
  })
  @Get('proximas-vencer')
  getSubActividadesProximasAVencer(
    @Query() query: SubActividadesProximasAVencerQuery,
  ):
    | Promise<SubActividadesProximasVencerResponse>
    | SubActividadesProximasVencerResponse {
    return this.actividadesService.getSubActividadesProximasAVencer(query);
  }

  @ApiOperation({
    summary: 'Obtener actividades devueltas para el dashboard',
    description:
      'Datos de las sub-actividades recientemente devueltas para la construcción de la tabla inferior del dashboard del contralor',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ActividadesSupervicionGetResponse,
    description: 'Operación realizada con éxito',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: HttpErrorDto,
    description: 'Rol no autorizado',
  })
  @Get('supervision')
  getActividadesSupervision(
    @Query() queryPaginacion: PaginacionQueryDto,
  ):
    | Promise<ActividadesSupervicionGetResponse>
    | ActividadesSupervicionGetResponse {
    return this.actividadesService.getActividadesSupervicion(queryPaginacion);
  }

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
    @Param('actividadId') actUuid: string,
  ): Promise<ActividadesResumenResponse> | ActividadesResumenResponse {
    return this.actividadesService.getResumen(actUuid);
  }

  @ApiOperation({
    summary: 'Directorio de Actividades',
    description:
      'Listado de las actividades para la construcción de los dashboards',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ActividadesDirectorioResponse,
    description: 'Operación realizada con éxito',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: HttpErrorDto,
    description: 'Rol no autorizado',
  })
  @Get('directorio')
  getActividadesDirectorio(
    @Query() queryParam: ActividadesDirectorioQuery,
  ): Promise<ActividadesDirectorioResponse> | ActividadesDirectorioResponse {
    return this.actividadesService.getActividadesDirectorio(queryParam);
  }

  @ApiOperation({
    summary: 'Selección de subactividades',
    description: 'Sincronización de las subactividades seleccionadas',
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
    status: HttpStatus.CREATED,
    description: 'Actividades agregadas exitosamente',
    type: SubActividadesBulkResponse,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Rol no autorizado para esta operación',
    type: HttpErrorDto,
  })
  @Post(':actividadId/sub-actividades/bulk')
  postSubActividadesBulk(
    @Param('actividadId') actUuid: string,
    @Body() bulkRequest: SubActividadesBulkRequest,
  ): Promise<SubActividadesBulkResponse> | SubActividadesBulkResponse {
    return this.actividadesService.postSubActividadesBulk(actUuid, bulkRequest);
  }

  @ApiOperation({
    summary: 'Edición de múltiples sub-actividades',
    description:
      'Endpoint único para sincronizar varios cambios de una actividad principal objetivo',
  })
  @ApiParam({
    name: 'actividadId',
    description: 'Identificador único (UUID) de la actividad principal',
    example: 'sub-uuid-1',
    required: true,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sincronización realizada con éxito',
    type: SubActividadesSyncResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error de validación de la estructura JSON',
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'UUID no coincide con una sub-actividad',
    type: HttpErrorDto,
  })
  @Put(':actividadId/sub-actividades/sync')
  putSubActividadesSync(
    @Param('actividadId') actUuid: string,
    @Body() subActividades: SubActividadesSyncRequest,
  ): SubActividadesSyncResponse {
    return this.actividadesService.putSubActividadesSync(
      actUuid,
      subActividades,
    );
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
  @Get(':actividadId/ficha-tecnica')
  getFichaTecnica(
    @Param('actividadId') actUuid: string,
  ): ActividadesFichaTecnicaResponse {
    return this.actividadesService.getFichaTecnica(actUuid);
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
    type: ActividadesFichaTecnicaResponse,
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
    @Param('actividadId') actUuid: string,
    @Body() fichaTecnica: ActividadesPatchFichaTecnicaRequest,
  ): ActividadesFichaTecnicaResponse {
    return this.actividadesService.patchFichaTecnica(actUuid, fichaTecnica);
  }
}
