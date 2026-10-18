import { RequirePermissions } from '@core/decorators/roles.decorador';
import { UsuarioActual } from '@core/decorators/usuario-actual.decorador';
import { JwtAuthGuard } from '@core/guards/jwt.guard';
import { PermisosGuard } from '@core/guards/roles.guard';
import type { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { Permisos } from '@domain/roles/permisos.enum';
import { PoasService } from '@modules/poas/application/poas.service';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CrearActividadesDto } from '../../dto/request/poa-actividades.dto';
import { CancelarPoaDataDto } from '../../dto/request/poas-cancelar-data.dto';
import { PresentarPoasDto } from '../../dto/request/poas-presentar.dto';
import { CrearActividadesResponseDto } from '../../dto/response/poa-actividades.response.dto';
import { PoaActualDto } from '../../dto/response/poa-actual.dto';
import { PresentarPoasResponseErrorDto } from '../../dto/response/poas-presentar-response.dto';
import {
  HISTORIC_LIMIT_POR_DEFECTO,
  SupervisionCentrosQueryDto,
} from '../../dto/request/supervision-centros.query.dto';
import { SupervisionCentrosResponseDto } from '../../dto/response/supervision-centros.response.dto';

@ApiTags('POAs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('poas')
export class PoasController {
  constructor(private readonly poaService: PoasService) {}

  @ApiOperation({
    summary: 'Devuelve la POA en la que se esta trabajando',
    description:
      'Entrega los datos necesarios para armar la POA vigente del anio fiscal',
  })
  @ApiResponse({
    status: 200,
    type: PoaActualDto,
  })
  @RequirePermissions(Permisos.LEER_POA)
  @Get('/mi-poa-actual')
  async getPoaActual(
    @UsuarioActual() usuarioActual: SesionUsuario,
  ): Promise<PoaActualDto> {
    return await this.poaService.getPoaActual({ usuarioActual });
  }

  @ApiOperation({
    summary: 'Directorio de supervisión de POAs por centro universitario',
    description:
      'Devuelve los centros bajo la jurisdicción de la Jefa con el resumen de su POA del año vigente y KPIs globales para los filtros de la vista.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SupervisionCentrosResponseDto,
  })
  @RequirePermissions(Permisos.GESTIONAR_SUPERVISION_POA)
  @Get('supervision/centros')
  async getSupervisionCentros(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Query() query: SupervisionCentrosQueryDto,
  ): Promise<SupervisionCentrosResponseDto> {
    return await this.poaService.getSupervisionCentros({
      usuarioActual,
      historicLimit: query.historic_limit ?? HISTORIC_LIMIT_POR_DEFECTO,
    });
  }
  
  @ApiOperation({
    summary: 'Agregar actividades',
    description: 'Recibe los datos para crear actividades dentro de la POA',
  })
  @ApiResponse({
    status: 201,
    description: 'Actividad agregada exitosamente',
    type: CrearActividadesResponseDto,
  })
  @RequirePermissions(Permisos.GESTIONAR_CONTENIDO_POA)
  @Post(':poaid/actividades')
  async agregarActividades(
    @Param('poaid') poaId: string,
    @Body() dto: CrearActividadesDto,
    @UsuarioActual() usuario: SesionUsuario,
  ): Promise<CrearActividadesResponseDto> {
    return await this.poaService.agregarActividad({
      poaId,
      usuario,
      dto,
    });
  }

  @ApiOperation({
    summary: 'Presentar la poa para el envio',
    description: 'Prepara a la POA para poder enviarse a la jefatura',
  })
  @Post(':poaid/presentar')
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Error al presentar la POA',
    type: PresentarPoasResponseErrorDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PresentarPoasDto,
  })
  presentarPoa(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('poaid') poaId: string,
  ) {
    return this.poaService.presentarPoa({ usuarioActual, poaId });
  }

  @ApiOperation({
    summary: 'Cancela el envio de la POA',
    description:
      'Se cancela el proceso de envio de POA regresandola al estado anterior.',
  })
  @ApiResponse({
    description: 'Se regresa el estado de la POA de enviada a en progreso',
    type: CancelarPoaDataDto,
  })
  @Post(':poaid/cancelar-envio')
  cancelarEnvio(
    @UsuarioActual() usuarioActual: SesionUsuario,
    @Param('poaid') poaId: string,
  ) {
    return this.poaService.cancelarEnvio({ usuarioActual, poaId });
  }
}
