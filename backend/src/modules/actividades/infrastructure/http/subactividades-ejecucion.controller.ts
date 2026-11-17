import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@core/guards/jwt.guard';
import { PermisosGuard } from '@core/guards/roles.guard';
import { RequirePermissions } from '@core/decorators/roles.decorador';
import { UsuarioActual } from '@core/decorators/usuario-actual.decorador';
import type { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { Permisos } from '@domain/roles/permisos.enum';
import { SubactividadesService } from '../../application/subactividades.service';
import { GenerarPreFirmaRequestDto } from '../../dto/request/generar-pre-firma.request.dto';
import { EnviarSubActividadRevisionRequestDto } from '@modules/actividades/dto/request/enviar-subactividad-revision..request.dto';
import { GenerarPreFirmaResponseDto } from '../../dto/response/generar-pre-firma.response.dto';
import { ConfirmarArchivoResponseDto } from '../../dto/response/confirmar-archivo.response.dto';
import { EnviarSubActividadRevisionResponseDto } from '../../dto/response/enviar-subactividad-revision.response.dto';
import { EliminacionCorrecta } from '@core/common/dto/response/deleted.response.dto';
import { HttpErrorDto } from '@core/common/dto/response/http-error.dto';
// [TASK-04] DTO para Vista de Entrega
import { VistaEntregaResponseDto } from '../../dto/response/vista-entrega.response.dto';
// [TASK-06] DTOs para Historial de Versiones y Descarga
import {
  HistorialIndexResponseDto,
  VersionDetalleResponseDto,
  LinkDescargaResponseDto,
} from '../../dto/response/historial-versiones.response.dto';

@ApiTags('Subactividades (Ejecución y Evidencias)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('sub-actividades')
export class SubactividadesEjecucionController {
  constructor(private readonly subactividadesService: SubactividadesService) {}

  @ApiOperation({
    summary: 'Generar URL pre-firmada para subida de evidencia',
    description:
      'Solicita al backend una URL firmada (PUT) para transmitir el archivo directamente al almacenamiento S3/SeaweedFS, validando el límite estricto de 50MB y la lista blanca de MIME types.',
  })
  @ApiParam({
    name: 'subActividadId',
    description: 'Identificador único (UUID) de la sub-actividad',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'URL pre-firmada generada con éxito',
    type: GenerarPreFirmaResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error de validación en metadatos o peso excedido',
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Acceso denegado o rol no autorizado',
    type: HttpErrorDto,
  })
  @RequirePermissions(Permisos.GESTIONAR_TRABAJO_SUBACTIVIDADES)
  @Post(':subActividadId/archivos/pre-firma')
  async generarPreFirma(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('subActividadId', ParseUUIDPipe) subActividadId: string,
    @Body() dto: GenerarPreFirmaRequestDto,
  ): Promise<GenerarPreFirmaResponseDto> {
    return await this.subactividadesService.generarPreFirmaEvidencia({
      usuarioActual,
      subActividadId,
      dto,
    });
  }

  @ApiOperation({
    summary: 'Confirmar subida de archivo de evidencia',
    description:
      'Notifica a NestJS que el archivo terminó de subirse al almacenamiento. Verifica físicamente la existencia del objeto y cambia el estado del registro de PENDIENTE a BORRADOR.',
  })
  @ApiParam({
    name: 'subActividadId',
    description: 'Identificador único (UUID) de la sub-actividad',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @ApiParam({
    name: 'archivoId',
    description: 'Identificador único (UUID) de la evidencia',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Archivo consolidado correctamente en el buzón',
    type: ConfirmarArchivoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sub-actividad o evidencia no encontrada',
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'El archivo no ha sido encontrado en el almacenamiento (subida incompleta o fallida)',
    type: HttpErrorDto,
  })
  @RequirePermissions(Permisos.GESTIONAR_TRABAJO_SUBACTIVIDADES)
  @Post(':subActividadId/archivos/:archivoId/confirmar')
  async confirmarArchivo(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('subActividadId', ParseUUIDPipe) subActividadId: string,
    @Param('archivoId', ParseUUIDPipe) archivoId: string,
  ): Promise<ConfirmarArchivoResponseDto> {
    return await this.subactividadesService.confirmarEvidenciaSubida({
      usuarioActual,
      subActividadId,
      archivoId,
    });
  }

  @ApiOperation({
    summary: 'Eliminar archivo del buzón de evidencias',
    description:
      'Elimina un archivo en estado PENDIENTE o BORRADOR tanto de la base de datos como del almacenamiento S3.',
  })
  @ApiParam({
    name: 'subActividadId',
    description: 'Identificador único (UUID) de la sub-actividad',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @ApiParam({
    name: 'archivoId',
    description: 'Identificador único (UUID) de la evidencia a eliminar',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'El archivo de evidencia fue eliminado correctamente',
    type: EliminacionCorrecta,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Evidencia no encontrada',
    type: HttpErrorDto,
  })
  @RequirePermissions(Permisos.GESTIONAR_TRABAJO_SUBACTIVIDADES)
  @Delete(':subActividadId/archivos/:archivoId')
  async eliminarArchivo(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('subActividadId', ParseUUIDPipe) subActividadId: string,
    @Param('archivoId', ParseUUIDPipe) archivoId: string,
  ): Promise<EliminacionCorrecta> {
    return await this.subactividadesService.eliminarEvidencia({
      usuarioActual,
      subActividadId,
      archivoId,
    });
  }

  @ApiOperation({
    summary: 'Enviar sub-actividad a revisión de Jefatura',
    description:
      'Consolida el buzón de evidencias, incrementa el número de versión, y cambia el estado operativo de la sub-actividad a EN_REVISION.',
  })
  @ApiParam({
    name: 'subActividadId',
    description: 'Identificador único (UUID) de la sub-actividad',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'La sub-actividad ha sido enviada exitosamente a la Jefatura',
    type: EnviarSubActividadRevisionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Error de validación (buzón vacío o sub-actividad en estado incorrecto)',
    type: HttpErrorDto,
  })
  @RequirePermissions(Permisos.GESTIONAR_TRABAJO_SUBACTIVIDADES)
  @Post(':subActividadId/enviar-revision')
  async enviarRevision(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('subActividadId', ParseUUIDPipe) subActividadId: string,
    @Body() dto: EnviarSubActividadRevisionRequestDto,
  ): Promise<EnviarSubActividadRevisionResponseDto> {
    return await this.subactividadesService.enviarSubActividadARevision({
      usuarioActual,
      subActividadId,
      dto,
    });
  }

  // ─── [TASK-04] Vista de Entrega ───────────────────────────────────────────

  @ApiOperation({
    summary: 'Obtener vista de entrega de la sub-actividad',
    description:
      'Devuelve el estado operativo actual, metadatos de cabecera, observaciones activas no solventadas, buzón de borradores con pre-firmas de descarga y el historial de versiones.',
  })
  @ApiParam({
    name: 'subActividadId',
    description: 'Identificador único (UUID) de la sub-actividad',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estructura base de la vista de entrega generada exitosamente',
    type: VistaEntregaResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sub-actividad no encontrada',
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Acceso denegado o rol no autorizado (validación IDOR)',
    type: HttpErrorDto,
  })
  @RequirePermissions(Permisos.GESTIONAR_TRABAJO_SUBACTIVIDADES)
  @Get(':subActividadId/vista-entrega')
  async getVistaEntrega(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('subActividadId', ParseUUIDPipe) subActividadId: string,
  ): Promise<VistaEntregaResponseDto> {
    return await this.subactividadesService.getVistaEntrega({
      usuarioActual,
      subActividadId,
    });
  }

  // ─── [TASK-06] Historial de Versiones y Descarga de Archivos ─────────────

  @ApiOperation({
    summary: 'Historial ligero de versiones de la sub-actividad',
    description:
      'Provee la lista secuencial de versiones con su fecha de evento, estado y dictamen.',
  })
  @ApiParam({
    name: 'subActividadId',
    description: 'Identificador único (UUID) de la sub-actividad',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista histórica de versiones obtenida con éxito',
    type: HistorialIndexResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sub-actividad no encontrada',
    type: HttpErrorDto,
  })
  @RequirePermissions(Permisos.GESTIONAR_TRABAJO_SUBACTIVIDADES)
  @Get(':subActividadId/historial')
  async getHistorial(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('subActividadId', ParseUUIDPipe) subActividadId: string,
  ): Promise<HistorialIndexResponseDto> {
    return await this.subactividadesService.getHistorial({
      usuarioActual,
      subActividadId,
    });
  }

  @ApiOperation({
    summary: 'Detalle pesado de una versión histórica',
    description:
      'Obtiene las observaciones emitidas y las evidencias inmutables de una versión histórica en modo solo lectura.',
  })
  @ApiParam({
    name: 'subActividadId',
    description: 'Identificador único (UUID) de la sub-actividad',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @ApiParam({
    name: 'versionId',
    description: 'Identificador único (UUID) de la versión/entrega',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalle de la versión histórica obtenido con éxito',
    type: VersionDetalleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sub-actividad o versión no encontrada',
    type: HttpErrorDto,
  })
  @RequirePermissions(Permisos.GESTIONAR_TRABAJO_SUBACTIVIDADES)
  @Get(':subActividadId/versiones/:versionId')
  async getVersionDetalle(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('subActividadId', ParseUUIDPipe) subActividadId: string,
    @Param('versionId', ParseUUIDPipe) versionId: string,
  ): Promise<VersionDetalleResponseDto> {
    return await this.subactividadesService.getVersionDetalle({
      usuarioActual,
      subActividadId,
      versionId,
    });
  }

  @ApiOperation({
    summary: 'Generar firma de descarga para evidencia histórica (con validación IDOR)',
    description:
      'Genera una URL pre-firmada temporal (GET) para descargar el archivo original desde S3/MinIO/SeaweedFS, validando que el usuario tenga acceso y el archivo pertenezca a la versión y sub-actividad indicadas.',
  })
  @ApiParam({
    name: 'subActividadId',
    description: 'Identificador único (UUID) de la sub-actividad',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @ApiParam({
    name: 'versionId',
    description: 'Identificador único (UUID) de la versión/entrega',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @ApiParam({
    name: 'archivoId',
    description: 'Identificador único (UUID) de la evidencia a descargar',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'URL pre-firmada efímera generada con éxito',
    type: LinkDescargaResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sub-actividad, versión o archivo no encontrado',
    type: HttpErrorDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Acceso denegado (violación IDOR)',
    type: HttpErrorDto,
  })
  @RequirePermissions(Permisos.GESTIONAR_TRABAJO_SUBACTIVIDADES)
  @Get(':subActividadId/versiones/:versionId/evidencias/:archivoId/link-descarga')
  async getLinkDescarga(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('subActividadId', ParseUUIDPipe) subActividadId: string,
    @Param('versionId', ParseUUIDPipe) versionId: string,
    @Param('archivoId', ParseUUIDPipe) archivoId: string,
  ): Promise<LinkDescargaResponseDto> {
    return await this.subactividadesService.getLinkDescarga({
      usuarioActual,
      subActividadId,
      versionId,
      archivoId,
    });
  }
}
