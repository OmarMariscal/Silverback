import type { IUnitOfWork } from '@core/interfaces/unit-of-work.interface';
import { UNIT_OF_WORK_TOKEN } from '@core/interfaces/unit-of-work.interface';
import type { IActividadRepository } from '@domain/actividad/actividad.repository.interface';
import { ACTIVIDAD_REPOSITORY_TOKEN } from '@domain/actividad/actividad.repository.interface';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { SubactividadEntity } from '@domain/actividad/subactividad.entity';
import { RecursoNoEncontradoException } from '@domain/excepciones/recurso-no-encontrado.exception';
import { TransactionHandle } from '@domain/shared/transaction.interface';
import { Inject, Injectable } from '@nestjs/common';
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
import { PaginacionMapper } from '@core/common/mappers/paginacion.mapper';
import { FiltrosSupervision } from './ports/filtros/subactividad-supervision.filtro.interface';
import { SubActividadDirectorioQuery } from './ports/queries/subactividad-get-directorio.query';
import { FiltrosDirectorio } from './ports/filtros/subactividaddirectorio.filtro.interface';

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

  async getSubActividadesSupervision(
    query: SubActividadGetSupervisionQuery,
  ): Promise<SubActividadesSupervicionGetResponse> {
    //Deconstrucción del Query
    const { usuarioActual, paginacionDto } = query;

    // 1. Transformación estandarizada de parámetros cruzados
    const paginacionParams = PaginacionMapper.toParams(paginacionDto);
    const filtros: FiltrosSupervision = {
      usuarioUuid: usuarioActual.usuario_id,
    };

    //2. Obtener datos y metadatos desde infraestructura
    const { meta, data } =
      await this.subActividadQueryRepository.obtenerSupervision(
        filtros,
        paginacionParams,
      );

    //3. Mapeo final
    return SubActividadResponseMapper.toSupervisionResponse(meta, data);
  }

  async getSubActividadesDirectorio(
    query: SubActividadDirectorioQuery,
  ): Promise<SubActividadesDirectorioResponse> {
    const { usuarioActual, dto } = query;

    // 1. Estandarización de Paginación
    const paginacionParams = PaginacionMapper.toParams(dto);

    // 2. Adaptación de Filtros (De singular DTO a plural de Repositorio)
    const filtros: FiltrosDirectorio = {
      usuarioUuid: usuarioActual.usuario_id,
      search: dto.search,
      centroUuid: dto.centro_uuid,

      // Si existe, lo envolvemos en arreglo, sino, queda undefined
      tipoActividad: dto.tipo_actividad ? [dto.tipo_actividad] : undefined,
      estadoFlujo: dto.estado_flujo ? [dto.estado_flujo] : undefined,
    };

    // 3. Ejecución de la consulta en la BD
    const { meta, data } =
      await this.subActividadQueryRepository.obtenerDirectorio(
        filtros,
        paginacionParams,
      );

    // 3. Mapeo delegando la responsabilidad del polimorfismo al mapper
    return SubActividadResponseMapper.toDirectorioResponse(
      meta,
      data,
      usuarioActual.rol,
    );
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

  async getSubActividadesSelect(
    query: SubActividadGetSelectQuery,
  ): Promise<SubActividadesSelectResponse> {
    // Deconstrucción del Query
    const { usuarioActual, actividadId } = query;

    const rawSubActividadesList =
      await this.subActividadQueryRepository.obtenerPorActividadIdParaPoaSeleccionadas(
        { usuarioUuid: usuarioActual.usuario_id, actividadId: actividadId },
      );

    //Fail Firs
    if (!rawSubActividadesList) {
      throw new RecursoNoEncontradoException(
        'Actividad',
        actividadId,
        usuarioActual.usuario_id,
      );
    }

    return SubActividadResponseMapper.toSubActividadSelect(
      rawSubActividadesList,
    );
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

  async putSubActividadesSync(
    command: SubActividadSyncQuery,
  ): Promise<SubActividadesSyncResponse> {
    //Deconstrucción del Command
    const { usuarioActual, actividadId, dto } = command;

    //Abrir la Unidad de Transacción
    return this.unitOfWork.ejecutarTransaccion(
      async (tx: TransactionHandle) => {
        // 1. Obtener el Agregado Raíz Vivo
        const actividad = await this.actividadesRepository.obtenerPorId(
          actividadId,
          tx,
        );

        // Fail First
        if (!actividad) {
          throw new RecursoNoEncontradoException(
            'Actividad',
            actividadId,
            usuarioActual.usuario_id,
          );
        }

        // 2. Extraer el estadfo actual para estadísticas y mapeos
        const subActividadesAnteriores = actividad.getSubActividades();
        const mapaAnteriores = new Map(
          subActividadesAnteriores.map((s) => [s.getId(), s]),
        );

        const listadoSincronizado: SubactividadEntity[] = [];
        let creadas = 0;
        let actualizadas = 0;
        let indiceActual = 1;

        //3. Lógica de Dominio: Algoritmo 'Merge'
        for (const item of dto.sub_actividades) {
          // El padre decide como se ve el número de orden
          const numeroOrden =
            actividad.formatearNumeroOrdenPorIndice(indiceActual);

          if (item.id && mapaAnteriores.has(item.id)) {
            //A) Actualización: Preservamos progreso, observaciones y número de orden
            const existente = mapaAnteriores.get(item.id);

            if (existente) {
              existente.actualizarDatosBase(
                numeroOrden,
                item.descripcion_tarea,
                new Date(item.fecha_inicio),
                new Date(item.fecha_termino),
                item.tipo,
                item.banco_sub_actividad_id || null,
              );

              listadoSincronizado.push(existente);
              actualizadas++;
            }
          } else {
            // B) Creación: Entidad completamente nueva
            const nueva = new SubactividadEntity(
              crypto.randomUUID(),
              numeroOrden,
              item.descripcion_tarea,
              EstadosActividades.SIN_EMPEZAR,
              item.tipo,
              new Date(item.fecha_inicio),
              new Date(item.fecha_termino),
              null,
              null,
              item.banco_sub_actividad_id || null,
            );

            listadoSincronizado.push(nueva);
            creadas++;
          }
          indiceActual++;
        }

        //Matemáticas para el eliminadas (Las que estaban antes menos las actualizadas)
        const eliminadas = subActividadesAnteriores.length - actualizadas;

        //4. Mutar el Agregado Raíz DDD
        // El agregado se encarga de reasingar y recalcular sus invariantes
        actividad.reemplazarSubActividades(
          usuarioActual.actor,
          listadoSincronizado,
        );

        //5. Persistir en la base de datos (Guardamos el agregado mutado)
        await this.actividadesRepository.guardar(actividad, undefined, tx);

        //6. Retornar el Mapper
        return SubActividadResponseMapper.toSubActividadesSync(
          creadas,
          actualizadas,
          eliminadas,
        );
      },
    );
  }

  async getSubActividadesProximasAVencer(
    query: SubActividadProximasAVencerQuery,
  ): Promise<SubActividadesProximasVencerResponse> {
    // Deconstrucción del Query
    const { usuarioActual, dto } = query;

    // Obtener el resultado del Query
    const limite = dto.limit;
    const rawSubActividadesList =
      await this.subActividadQueryRepository.obtenerProximasAVencer({
        limite: limite,
        usuarioUuid: usuarioActual.usuario_id,
      });

    //Fail First
    if (!rawSubActividadesList) {
      throw new RecursoNoEncontradoException(
        'SubActividades',
        'Pertenecientes al usuario',
        usuarioActual.usuario_id,
      );
    }

    return SubActividadResponseMapper.toProximasAVencer(rawSubActividadesList);
  }
}
