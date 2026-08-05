import type { IUnitOfWork } from '@core/interfaces/unit-of-work.interface';
import { UNIT_OF_WORK_TOKEN } from '@core/interfaces/unit-of-work.interface';
import type { IActividadRepository } from '@domain/actividad/actividad.repository.interface';
import { ACTIVIDAD_REPOSITORY_TOKEN } from '@domain/actividad/actividad.repository.interface';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { SubactividadEntity } from '@domain/actividad/subactividad.entity';
import { RecursoNoEncontradoException } from '@domain/excepciones/recurso-no-encontrado.exception';
import { TransactionHandle } from '@domain/shared/transaction.interface';
import { Inject, Injectable } from '@nestjs/common';
import { SubActividadesDirectorioQuery } from '../dto/request/actividades-directorio.query.dto';
import { SubActividadesDirectorioResponse } from '../dto/response/actividades-directorio.response.dto';
import { SubActividadesGetResponse } from '../dto/response/actividades-get.response.dto';
import { SubActividadesSupervicionGetResponse } from '../dto/response/actividades-supervision-get.response.dto';
import { SubActividadesBulkResponse } from '../dto/response/sub-actividades-bulk.response.dto';
import { SubActividadesPoaResponse } from '../dto/response/sub-actividades-poa.response.dto';
import { SubActividadesProximasVencerResponse } from '../dto/response/sub-actividades-proximas-a-vencer-get.response.dto';
import { SubActividadesSelectResponse } from '../dto/response/sub-actividades-select.response.dto';
import { SubActividadesSyncResponse } from '../dto/response/sub-actividades-sync.response.dto';
import { SubActividadResponseMapper } from '../infrastructure/mappers/subactividad-response.mapper';
import { SubActividadBulkQuery } from './ports/commands/subactividad-bulk.command';
import { SubActividadSyncQuery } from './ports/commands/subactividad-sync.command';
import { SubActividadGetPoaQuery } from './ports/queries/subactividad-get-poa.query';
import { SubActividadGetSelectQuery } from './ports/queries/subactividad-get-select.query';
import { SubActividadGetSupervisionQuery } from './ports/queries/subactividad-get-supervision.query';
import { SubActividadGetQuery } from './ports/queries/subactividad-get.query';
import { SubActividadProximasAVencerQuery } from './ports/queries/subactividad-proximas-a-vencer.query';
import type { ISubactividadesQueryRepository } from './ports/subactividaeds-query.repository.interface';
import { SUBACTIVIDADES_QUERY_REPOSITORY_TOKEN } from './ports/subactividaeds-query.repository.interface';

@Injectable()
export class SubactividadesService {
  constructor(
    @Inject(ACTIVIDAD_REPOSITORY_TOKEN)
    private readonly actividadesRepository: IActividadRepository,
    @Inject(SUBACTIVIDADES_QUERY_REPOSITORY_TOKEN)
    private readonly subActividadQueryRepository: ISubactividadesQueryRepository,
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  getSubActividadesSupervicion(
    query: SubActividadGetSupervisionQuery,
  ): SubActividadesSupervicionGetResponse {
    //Deconstrucción del Query
    const { usuarioActual, paginacionDto } = query;
    return new SubActividadesSupervicionGetResponse();
  }

  getSubActividadesDirectorio(
    queryParams: SubActividadesDirectorioQuery,
  ): SubActividadesDirectorioResponse {
    return new SubActividadesDirectorioResponse();
  }

  getSubActividades(query: SubActividadGetQuery): SubActividadesGetResponse {
    // Deconstrucción del query
    const { usuarioActual, dto } = query;

    return new SubActividadesGetResponse();
  }

  async getSubActividadesPoa(
    query: SubActividadGetPoaQuery,
  ): Promise<SubActividadesPoaResponse> {
    //Deconstrucció del Query
    const { usuarioActual, actividadId } = query;

    // Obtener la Actividad Actual
    const actividadQuery =
      await this.subActividadQueryRepository.obtenerPorActividadIdParaPoa({
        usuarioUuid: usuarioActual.usuario_id,
        actividadId: actividadId,
      });

    // Validar que se encontró
    if (!actividadQuery) {
      throw new RecursoNoEncontradoException(
        'Actividad',
        actividadId,
        usuarioActual.usuario_id,
      );
    }

    // Retornar DTO
    return SubActividadResponseMapper.toSubActividadesPoa(actividadQuery);
  }

  getSubActividadesSelect(
    query: SubActividadGetSelectQuery,
  ): SubActividadesSelectResponse {
    // Deconstrucción del Query
    const { usuarioActual, actividadId } = query;

    return new SubActividadesSelectResponse();
  }

  async postSubActividadesBulk(
    command: SubActividadBulkQuery,
  ): Promise<SubActividadesBulkResponse> {
    // Deconstrucción del query
    const { usuarioActual, actividadId, dto } = command;

    return this.unitOfWork.ejecutarTransaccion(
      async (tx: TransactionHandle) => {
        //1. Obtener el Agregado Raíz
        const actividad = await this.actividadesRepository.obtenerPorId(
          actividadId,
          tx,
        );
        if (!actividad)
          throw new RecursoNoEncontradoException(
            'Actividad',
            actividadId,
            usuarioActual.usuario_id,
          );

        const nuevasSubActividades: SubactividadEntity[] = [];

        // 2. Lógica de Domino: Instanciar y agregar cada subactividad
        for (const item of dto.sub_actividades) {
          const numeroOrden = actividad.generarNumeroOrdenSubactividad();

          const nuevaSubActividad = new SubactividadEntity(
            crypto.randomUUID(),
            numeroOrden,
            item.descripcion_tarea,
            EstadosActividades.SIN_EMPEZAR,
            item.tipo,
            new Date(item.fecha_inicio),
            new Date(item.fecha_termino),
            null, // Fecha Envio
            null, // mensaje Resolución
            item.banco_sub_actividad_id || null,
          );

          // Utilizamos el método para agregar la entidad
          actividad.agregarSubActividad(usuarioActual.actor, nuevaSubActividad);
          nuevasSubActividades.push(nuevaSubActividad);
        }

        // 3. Persistir el Agregado Raíz (El Repositorio hará el 'upsert' automático de las subactividades)
        await this.actividadesRepository.guardar(actividad, undefined, tx);

        // 4. Retornar el DTO de respuesta
        return SubActividadResponseMapper.toBulkResponse(nuevasSubActividades);
      },
    );
  }

  putSubActividadesSync(
    command: SubActividadSyncQuery,
  ): SubActividadesSyncResponse {
    //Deconstrucción del Command
    const { usuarioActual, actividadId, dto } = command;

    return new SubActividadesSyncResponse();
  }

  getSubActividadesProximasAVencer(
    query: SubActividadProximasAVencerQuery,
  ): SubActividadesProximasVencerResponse {
    // Deconstrucción del Query
    const { usuarioActual, dto } = query;

    return new SubActividadesProximasVencerResponse();
  }
}
