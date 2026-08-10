import { Controller, Get, Param, Query, NotFoundException, UseGuards } from '@nestjs/common';
import { CatalogoService } from '../../application/catalogo.service';
import { ApiTags, ApiResponse, ApiQuery, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BancoActividadesDataDto } from '../../dto/response/catalogo-banco-data.dto';
import { BancoIdDto } from '../../dto/response/catalogo-banco-id.dto';
import { ActividadSugeridaDataDto } from '../../dto/response/catalogo-banco-sugeridas-data.dto';
import { CentroDataDto } from '../../dto/response/catalogo-centro-data.dto';

// Importaciones de seguridad
import { JwtAuthGuard } from '@core/guards/jwt.guard';
import { UsuarioActual } from '@core/decorators/usuario-actual.decorador';
import type { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

@ApiTags('Catalogos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // Protegemos los catálogos para extraer la sesión
@Controller('catalogos')
export class CatalogoController {
  constructor(private readonly catalogoService: CatalogoService) {}

  @ApiOperation({ summary: 'Muestra el catalogo de actividades' }) 
  @ApiResponse({ status: 200, type: BancoActividadesDataDto })
  @ApiQuery({ name: 'Busqueda', required: false })
  @Get('/banco-actividades')
  public async getBancoActividades(
    @UsuarioActual() sesion: SesionUsuario, // 1. Extraemos el usuario
    @Query('Busqueda') busqueda?: string
  ): Promise<BancoActividadesDataDto> {
      
      // 2. Empaquetamos en el Query object
      const query = {
        usuarioActualId: sesion.usuario_id,
        busqueda: busqueda
      };

      return await this.catalogoService.getBancoActividades(query);
  }

  @ApiOperation({ summary: 'Buscar actividad por ID' }) 
  @ApiResponse({ status: 200, type: BancoIdDto })
  @Get('/banco-actividades/:id')
  public async getBancoActividadesById(
    @UsuarioActual() sesion: SesionUsuario,
    @Param('id') id: string
  ): Promise<BancoIdDto> {
    
    const query = { usuarioActualId: sesion.usuario_id, id };
    const actividad = await this.catalogoService.getBancoActividadPorId(query);
    
    if (!actividad) {
      throw new NotFoundException(`No se encontró ninguna actividad en el banco con el ID: ${id}`);
    }
    return actividad as unknown as BancoIdDto;
  }

  @ApiOperation({ summary: 'Entrega sub-actividades sugeridas' }) 
  @ApiResponse({ status: 200, type: ActividadSugeridaDataDto })
  @Get('/banco-actividades/:id/sub-actividades-sugeridas')
  public async getSubActividadesSugeridas(
    @UsuarioActual() sesion: SesionUsuario,
    @Param('id') id: string
  ): Promise<ActividadSugeridaDataDto> {
    
    const query = { usuarioActualId: sesion.usuario_id, id };
    return await this.catalogoService.getSubActividadesSugeridas(query);
  }

  @ApiOperation({ summary: 'Entrega los centros de trabajo' }) 
  @ApiResponse({ status: 200, type: CentroDataDto })
  @Get('/centros')
  public async getCentros(
    @UsuarioActual() sesion: SesionUsuario
  ): Promise<CentroDataDto> {
    
    const query = { usuarioActualId: sesion.usuario_id };
    return await this.catalogoService.getCentros(query);
  }
}