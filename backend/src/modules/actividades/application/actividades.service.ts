import { EliminacionCorrecta } from '@core/common/dto/response/deleted.response.dto';
import { RequirePermissions } from '@core/decorators/roles.decorador';
import { PrismaService } from '@database/prisma.service';
import { RecursoNoEncontradoException } from '@domain/excepciones/recurso-no-encontrado.exception';
import { Permisos } from '@domain/roles/permisos.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ActividadesFichaTecnicaResponse } from '../dto/response/actividades-ficha-tecnica.response.dto';
import { ActividadesResumenResponse } from '../dto/response/actividades-resumen.response.dto';
import { ActividadResponseMapper } from '../infrastructure/mappers/actividad-response.mapper';
import type { IActividadesQueryRepository } from './ports/actividades-query.repository.interface';
import { ACTIVIDADES_QUERY_REPOSITORY_TOKEN } from './ports/actividades-query.repository.interface';
import { ActividadDeleteActividadCommand } from './ports/commands/actividad-delete-actividad.command';
import { ActividadPatchFichaTecnicaCommand } from './ports/commands/actividad-patch-ficha-tecnica.command';
import type { ActividadGetFichaTecnicaQuery } from './ports/queries/actividad-get-ficha-tecnica.query';
import { ActividadGetResumenQuery } from './ports/queries/actividad-get-resumen.query';

@Injectable()
export class ActividadesService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(ACTIVIDADES_QUERY_REPOSITORY_TOKEN)
    private readonly actividadQueryRepository: IActividadesQueryRepository,
  ) {}

  // El endpoint de get resumen
  getResumen(query: ActividadGetResumenQuery): ActividadesResumenResponse {
    // Deconstrucción del query
    const { usuarioActual, actividadId } = query;

    return new ActividadesResumenResponse();
  }

  async getFichaTecnica(
    query: ActividadGetFichaTecnicaQuery,
  ): Promise<ActividadesFichaTecnicaResponse> {
    const { usuarioActual, actividadId } = query;

    // Obtener del Repositorio de querys la información de la base de datos
    const actividadActual =
      await this.actividadQueryRepository.obtenerPorIdFichaTecnica({
        usuarioUuid: usuarioActual.usuario_id,
        actividadId: actividadId,
      });

    // Si no se encuentra
    if (!actividadActual) {
      throw new RecursoNoEncontradoException(
        'Actividad',
        actividadId,
        usuarioActual.usuario_id,
      );
    }

    return ActividadResponseMapper.toFichaTecnica(actividadActual);
  }

  patchFichaTecnica(
    command: ActividadPatchFichaTecnicaCommand,
  ): ActividadesFichaTecnicaResponse {
    //Deconstrucción del command
    const { usuarioActual, actividadId, dto } = command;
    return new ActividadesFichaTecnicaResponse();
  }

  deleteActividad(
    command: ActividadDeleteActividadCommand,
  ): EliminacionCorrecta {
    // Deconstrucción del Command
    const { usuarioActual, actividadId } = command;

    return new EliminacionCorrecta();
  }
}
