import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { ApiTags, ApiResponse, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { BancoActividadesDataDto } from './DTOS/response/catalogo-banco-data.dto';
import { BancoIdDto } from './DTOS/response/catalogo-banco-id.dto';
import { ActividadSugeridaDataDto } from './DTOS/response/catalogo-banco-sugeridas-data.dto';
import { CentroDataDto } from './DTOS/response/catalogo-centro-data.dto';

@ApiTags('Catalogos')
@Controller('catalogos')
export class CatalogoController {
  constructor(private readonly catalogoService: CatalogoService) {}

  @ApiOperation({
     summary: 'Muestra el catalogo de actividades',
     description: 'Muestra el banco de actividades para que el usuario pueda seleccionar.'
   }) 
  @ApiResponse({
    status: 200,
    description: 'Obtiene el catálogo de actividades del banco de actividades',
    type: BancoActividadesDataDto,
  })
  @ApiQuery({
    name: 'Busqueda',
    required: false
  })
  @Get('/banco-actividades')
  getBancoActividades( data: BancoActividadesDataDto, @Query() actividad?: string): BancoActividadesDataDto {
      return data;
  }

  @ApiOperation({
    summary: 'Buscar actividad por ID',
    description: 'Se devuelve una actividad asociada al ID registrado'
  }) 
  @ApiResponse({
    status: 200,
    description: 'Obtiene la actividad con el ID especificado dentro del banco',
    type: BancoIdDto,
  })
  @Get('/banco-actividades/:id')
  getBancoActividadesById(@Param('id') id: string, data: BancoIdDto): BancoIdDto {
    return data;
  }

  @ApiOperation({
    summary: 'Entrega sub-actividades sugeridas',
    description: 'Si la actividad vino del banco, en esta se mostraran sub-actividades sugeridas'
  }) 
  @ApiResponse({
    status: 200,
    description: 'Obtiene las sub-actividades sugeridas para una actividad específica',
    type: ActividadSugeridaDataDto,
  })
  @Get('/banco-actividades/:id/sub-actividades-sugeridas')
  getSubActividadesSugeridas(@Param('id') id: string, data: ActividadSugeridaDataDto): ActividadSugeridaDataDto {
    return data;
  }

  @ApiOperation({
    summary: 'Entrega los centros de trabajo',
    description: 'Devuelve los centros de trabajo registrados en el sistema.'
  }) 
  @ApiResponse({
    status: 200,
    description: 'Obtiene el catálogo de centros de trabajo',
    type: CentroDataDto,
  })
  @Get('/centros')
  getCentros(centros: CentroDataDto): CentroDataDto {
    return centros;
  }
}
