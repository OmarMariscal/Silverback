import { Controller, Get, Param, Query, NotFoundException, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CatalogoService } from '../../application/catalogo.service';

// Importaciones de seguridad del equipo
import { JwtAuthGuard } from '@core/guards/jwt.guard';
import { UsuarioActual } from '@core/decorators/usuario-actual.decorador';
import type { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

import { BancoActividadesDataDto } from '../../dto/response/catalogo-banco-data.dto';
import { BancoIdDto } from '../../dto/response/catalogo-banco-id.dto';
import { ActividadSugeridaDataDto } from '../../dto/response/catalogo-banco-sugeridas-data.dto';
import { CentroDataDto } from '../../dto/response/catalogo-centro-data.dto';

@ApiTags('Catalogos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // Solo pedimos que el usuario haya iniciado sesión
@Controller('catalogos')
export class CatalogoController {
  constructor(private readonly catalogoService: CatalogoService) {}

  @ApiOperation({ summary: 'Muestra el catalogo de actividades' }) 
  @ApiResponse({ status: HttpStatus.OK, type: BancoActividadesDataDto })
  @ApiQuery({ name: 'Busqueda', required: false })
  @Get('/banco-actividades')
  public async getBancoActividades(
    @UsuarioActual() sesion: SesionUsuario, 
    @Query('Busqueda') busqueda?: string
  ): Promise<BancoActividadesDataDto> {
      
      const query = {
        usuarioActualId: sesion.usuario_id,
        busqueda: busqueda
      };

      return await this.catalogoService.getBancoActividades(query);
  }

  @ApiOperation({ summary: 'Buscar actividad por ID' }) 
  @ApiResponse({ status: HttpStatus.OK, type: BancoIdDto })
  @Get('/banco-actividades/:id')
  public async getBancoActividadesById(
    @UsuarioActual() sesion: SesionUsuario,
    @Param('id') id: string
  ): Promise<BancoIdDto> {
    
    const query = { usuarioActualId: sesion.usuario_id, id };
    
    const actividad = await this.catalogoService.getBancoActividadPorId(query);
    
    if (!actividad) {
      throw new NotFoundException(`No se encontró ninguna actividad con el ID: ${id}`);
    }
    return actividad as unknown as BancoIdDto;
  }

  @ApiOperation({ summary: 'Entrega sub-actividades sugeridas' }) 
  @ApiResponse({ status: HttpStatus.OK, type: ActividadSugeridaDataDto })
  @Get('/banco-actividades/:id/sub-actividades-sugeridas')
  public async getSubActividadesSugeridas(
    @UsuarioActual() sesion: SesionUsuario,
    @Param('id') id: string
  ): Promise<ActividadSugeridaDataDto> {
    
    const query = { usuarioActualId: sesion.usuario_id, id };
    return await this.catalogoService.getSubActividadesSugeridas(query);
  }

  @ApiOperation({ summary: 'Entrega los centros de trabajo' }) 
  @ApiResponse({ status: HttpStatus.OK, type: CentroDataDto })
  @Get('/centros')
  public async getCentros(
    @UsuarioActual() sesion: SesionUsuario
  ): Promise<CentroDataDto> {
    
    const query = { usuarioActualId: sesion.usuario_id };
    return await this.catalogoService.getCentros(query);
  }
}