import { Controller, Get, Post, Param, HttpStatus, Body } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import {
  ApiParam,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { FichaTecnicaResponse } from './dto/response/actividades-ficha-tecnica.response.dto';
import { HttpErrorDto } from 'src/core/common/dto/response/http-error.dto';
import { SubActividadesBulkResponse } from './dto/response/sub-actividades-bulk.response.dto';
import { SubActividadesBulkRequest } from './dto/request/sub-actividadedes-bulk.request.dto';

@ApiTags('Actividades')
@ApiBearerAuth()
@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  @ApiOperation({
    summary: 'Detalles técnicos',
    description: 'Obtener los detalles técnicos de una actividad principal',
  })
  @ApiParam({
    name: 'act-uuid',
    description: 'El identificador único (UUID) de la actividad principal',
    example: 'act-01-uuid',
    required: true,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ficha técnica recuperada con éxito',
    type: FichaTecnicaResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'UUID no identificado',
    type: HttpErrorDto,
  })
  @Get(':actividadId/ficha-tecnica')
  getFichaTecnica(
    @Param('actividadId') actUuid: string,
  ): Promise<FichaTecnicaResponse> | FichaTecnicaResponse {
    return this.actividadesService.getFichaTecnica(actUuid);
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
}
