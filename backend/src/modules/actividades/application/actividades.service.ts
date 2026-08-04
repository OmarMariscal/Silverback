import { EliminacionCorrecta } from '@core/common/dto/response/deleted.response.dto';
import type { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { PrismaService } from '@database/prisma.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ActividadesPatchFichaTecnicaRequest } from '../dto/request/actividades-path-ficha-tecnica.request.dto';
import { ActividadesFichaTecnicaResponse } from '../dto/response/actividades-ficha-tecnica.response.dto';
import { ActividadesResumenResponse } from '../dto/response/actividades-resumen.response.dto';
import { ActividadResponseMapper } from '../infrastructure/mappers/actividad-response.mapper';
import type { IActividadesQueryRepository } from './ports/actividades-query.repository.interface';
import { ACTIVIDADES_QUERY_REPOSITORY_TOKEN } from './ports/actividades-query.repository.interface';
import { RequirePermissions } from '@core/decorators/roles.decorador';
import { Permisos } from '@domain/roles/permisos.enum';

@Injectable()
export class ActividadesService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(ACTIVIDADES_QUERY_REPOSITORY_TOKEN)
    private readonly actividadQueryRepository: IActividadesQueryRepository,
  ) {}

  getResumen(actUuid: string): ActividadesResumenResponse {
    return new ActividadesResumenResponse();
  }

  @RequirePermissions(Permisos.LEER_POA)
  async getFichaTecnica(
    usuarioActual: SesionUsuario,
    actUuid: string,
  ): Promise<ActividadesFichaTecnicaResponse> {
    // Obtener del Repositorio de querys la información de la base de datos
    const actividadActual =
      await this.actividadQueryRepository.obtenerPorIdFichaTecnica({
        usuarioUuid: usuarioActual.usuario_id,
        actividadId: actUuid,
      });

    // Si no se encuentra
    if (!actividadActual) {
      throw new NotFoundException(
        `No se pudo encontrar la Actividad con ID ${actUuid} del usuario con ID ${usuarioActual.usuario_id}`,
      );
    }

    return ActividadResponseMapper.toFichaTecnica(actividadActual);
  }

  patchFichaTecnica(
    actUuid: string,
    fichaTecnica: ActividadesPatchFichaTecnicaRequest,
  ): ActividadesFichaTecnicaResponse {
    return new ActividadesFichaTecnicaResponse();
  }

  deleteActividad(actividadId: string): EliminacionCorrecta {
    return new EliminacionCorrecta();
  }
}
