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
     description: ''
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
  getBancoActividades(@Query() actividad: string, data: BancoActividadesDataDto): BancoActividadesDataDto {
      return data;
  }

  @ApiOperation({
    summary: 'Buscar actividad por ID',
    description: ''
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
    description: ''
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
    description: ''
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
