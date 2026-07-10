import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { PoasService } from './poas.service';
import { PoaActualDto } from './DTOS/response/poa-actual.dto';
import { CrearActividadesDto } from './DTOS/request/poa-actividades.dto';
import { CrearActividadesResponseDto } from './DTOS/response/poa-actividades.response.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { PresentarPoasResponseErrorDto } from './DTOS/response/poas-presentar-response.dto';
import { PresentarPoasDto } from './DTOS/request/poas-presentar.dto';
import { CancelarPoaDataDto } from './DTOS/request/poas-cancelar-data.dto';

@ApiTags('POAs')
@Controller('poas')
export class PoasController {
  constructor(private readonly poasService: PoasService) {}

  @ApiOperation({
    summary: 'Devuelve la POA en la que se esta trabajando',
    description: ''
  })
  @ApiResponse({
    status: 201,
    type: PoaActualDto
  })
  @Get('/mi-poa-actual')
  getPoaActual(poaActual: PoaActualDto){
    return poaActual;
  }

   @ApiOperation({
    summary: 'Agregar actividades',
    description: ''
  })
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

   @ApiOperation({
    summary: 'Presentar la poa para el envio',
    description: ''
  })
  @Post(':poaid/presentar')
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Error al presentar la POA',
    type: PresentarPoasResponseErrorDto
  })
  presentarPoa(@Param('poaid') id: string, @Body() presentarPoasDto: PresentarPoasDto, @Res() response): PresentarPoasResponseErrorDto{
    const poaPresentada = presentarPoasDto;
    return response.status(422).send(PresentarPoasResponseErrorDto)

    }

  @ApiResponse({

  })
  @ApiOperation({
    summary: 'Cancela el envio de la POA',
    description: ''
  })  
  @ApiResponse({
    description: 'Se regresa el estado de la POA de enviada a en progreso',
    type: CancelarPoaDataDto
  })
  @Post(':poaid/cancelar-envio')
  cancelarEnvio(@Param('poaid') id: string){
      
    }
}
