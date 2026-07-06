import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { PoasService } from './poas.service';
import { PoaActualDto } from './DTOS/response/poa-actual.dto';
import { CrearActividadesDto } from './DTOS/request/poa-actividades.dto';
import { CrearActividadesResponseDto } from './DTOS/response/poa-actividades.response.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { PresentarPoasResponseErrorDto } from './DTOS/response/poas-presentar-response.dto';
import { PresentarPoasDto } from './DTOS/request/poas-presentar.dto';
import { CancelarPoaDataDto } from './DTOS/request/poas-cancelar.dto';

@ApiTags('POAs')

@Controller('poas')
export class PoasController {
  constructor(private readonly poasService: PoasService) {}


  @ApiResponse({
    status: 201,
    type: PoaActualDto
  })
  @Get('/mi-poa-actual')
  getPoaActual(poaActual: PoaActualDto){
    return poaActual;
  }

  @Post(':poaid/actividades')
  @ApiResponse({
    status: 201,
    description: 'Actividad agregada exitosamente',
    type: CrearActividadesResponseDto
  })
  agregarActividades(@Param('poaid') id: string, @Body() crearActividadesDto: CrearActividadesDto, @Res() response): CrearActividadesResponseDto{
    const actividadNueva = crearActividadesDto;
    return response.status(201).send(CrearActividadesResponseDto)
  }

  @Post(':poaid/presentar')
  @ApiResponse({
    status: 422,
    description: 'Error al presentar la POA',
    type: PresentarPoasResponseErrorDto
  })
  presentarPoa(@Param('poaid') id: string, @Body() presentarPoasDto: PresentarPoasDto, @Res() response): PresentarPoasResponseErrorDto{
    const poaPresentada = presentarPoasDto;
    return response.status(422).send(PresentarPoasResponseErrorDto)

    }

  @Post()
  cancelarEnvio(@Param('poaid') id: string, @Body() cancelarPoaDto: CancelarPoaDataDto){
      const poaCancelada = cancelarPoaDto;
      return poaCancelada;

    }
}
