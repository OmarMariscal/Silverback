import { UsuarioActual } from '@core/decorators/usuario-actual.decorador';
import { JwtAuthGuard } from '@core/guards/jwt.guard';
import type { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { PoasService } from '@modules/poas/application/poas.service';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotImplementedException,
  Param,
  Post,
  Res,
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

@ApiTags('POAs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('poas')
export class PoasController {
  constructor(private readonly poasService: PoasService) {}

  @ApiOperation({
    summary: 'Devuelve la POA en la que se esta trabajando',
    description:
      'Entrega los datos necesarios para armar la POA vigente del anio fiscal',
  })
  @ApiResponse({
    status: 201,
    type: PoaActualDto,
  })
  @Get('/mi-poa-actual')
  getPoaActual(@UsuarioActual() usuario: SesionUsuario): PoaActualDto {
    return new PoaActualDto();
  }

  @ApiOperation({
    summary: 'Agregar actividades',
    description: 'Recibe los datos para crear actividades dentro de la POA',
  })
  @Post(':poaid/actividades')
  @ApiResponse({
    status: 201,
    description: 'Actividad agregada exitosamente',
    type: CrearActividadesResponseDto,
  })
  agregarActividades(
    @Param('poaid') id: string,
    @Body() crearActividadesDto: CrearActividadesDto,
    @Res() response,
  ): CrearActividadesResponseDto {
    throw new NotImplementedException('Pendiente de Implementar');
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
  presentarPoa(@Param('poaid') id: string, @Res() response) {}

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
  cancelarEnvio(@Param('poaid') id: string) {}
}
