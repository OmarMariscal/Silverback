import { Inject, Injectable } from '@nestjs/common';
import { SubActividadesBulkResponse } from '../dto/response/sub-actividades-bulk.response.dto';
import { SubActividadesBulkRequest } from '../dto/request/sub-actividadedes-bulk.request.dto';
import { SubActividadesSyncResponse } from '../dto/response/sub-actividades-sync.response.dto';
import { SubActividadesProximasVencerResponse } from '../dto/response/sub-actividades-proximas-a-vencer-get.response.dto';
import { SubActividadesProximasAVencerQuery } from '../dto/request/sub-actividades-proximas-a-vencer.query.dto';
import { SubActividadesPoaResponse } from '../dto/response/sub-actividades-poa.response.dto';
import { SubActividadesSelectResponse } from '../dto/response/sub-actividades-select.response.dto';
import { PaginacionQueryDto } from '@core/common/dto/request/paginacion.query.dto';
import { SubActividadesSupervicionGetResponse } from '../dto/response/actividades-supervision-get.response.dto';
import { SubActividadesDirectorioQuery } from '../dto/request/actividades-directorio.query.dto';
import { SubActividadesDirectorioResponse } from '../dto/response/actividades-directorio.response.dto';
import { SubActividadesGetQuery } from '../dto/request/actividades-get.query.dto';
import { SubActividadesGetResponse } from '../dto/response/actividades-get.response.dto';
import { ACTIVIDAD_REPOSITORY_TOKEN } from '@domain/actividad/actividad.repository.interface';
import type { IActividadRepository } from '@domain/actividad/actividad.repository.interface';
import { SubactividadEntity } from '@domain/actividad/subactividad.entity';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { UNIT_OF_WORK_TOKEN } from '@core/interfaces/unit-of-work.interface';
import type { IUnitOfWork } from '@core/interfaces/unit-of-work.interface';
import { TransactionHandle } from '@domain/shared/transaction.interface';
import { SubActividadResponseMapper } from '../infrastructure/mappers/subactividad-response.mapper';
import { SUBACTIVIDADES_QUERY_REPOSITORY_TOKEN } from './ports/subactividaeds-query.repository.interface';
import type { ISubactividadesQueryRepository } from './ports/subactividaeds-query.repository.interface';
import { RecursoNoEncontradoException } from '@domain/excepciones/recurso-no-encontrado.exception';

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
    queryPaginacion: PaginacionQueryDto,
  ): SubActividadesSupervicionGetResponse {
    return new SubActividadesSupervicionGetResponse();
  }

  getSubActividadesDirectorio(
    queryParams: SubActividadesDirectorioQuery,
  ): SubActividadesDirectorioResponse {
    return new SubActividadesDirectorioResponse();
  }

  getSubActividades(
    queryActividades: SubActividadesGetQuery,
  ): SubActividadesGetResponse {
    return new SubActividadesGetResponse();
  }

  async getSubActividadesPoa(
    usuarioActual: SesionUsuario,
    actividadId: string,
  ): Promise<SubActividadesPoaResponse> {
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

  getSubActividadesSelect(actividadId: string): SubActividadesSelectResponse {
    return new SubActividadesSelectResponse();
  }

  async postSubActividadesBulk(
    usuarioActual: SesionUsuario,
    actUuid: string,
    bulkRequest: SubActividadesBulkRequest,
  ): Promise<SubActividadesBulkResponse> {
    return this.unitOfWork.ejecutarTransaccion(
      async (tx: TransactionHandle) => {
        //1. Obtener el Agregado Raíz
        const actividad = await this.actividadesRepository.obtenerPorId(
          actUuid,
          tx,
        );
        if (!actividad)
          throw new RecursoNoEncontradoException(
            'Actividad',
            actUuid,
            usuarioActual.usuario_id,
          );

        const nuevasSubActividades: SubactividadEntity[] = [];

        // 2. Lógica de Domino: Instanciar y agregar cada subactividad
        for (const item of bulkRequest.sub_actividades) {
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
    actUuid: string,
    subActividades: SubActividadesBulkRequest,
  ): SubActividadesSyncResponse {
    return new SubActividadesSyncResponse();
  }

  getSubActividadesProximasAVencer(
    limit: SubActividadesProximasAVencerQuery,
  ): SubActividadesProximasVencerResponse {
    return new SubActividadesProximasVencerResponse();
  }
}
