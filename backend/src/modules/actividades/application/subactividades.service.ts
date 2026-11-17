import { EliminacionCorrecta } from '@core/common/dto/response/deleted.response.dto';
import { PaginacionMapper } from '@core/common/mappers/paginacion.mapper';
import type { IStoragePort } from '@core/interfaces/storage/storage-port.interface';
import { STORAGE_PORT_TOKEN } from '@core/interfaces/storage/storage-port.interface';
import type { IUnitOfWork } from '@core/interfaces/unit-of-work.interface';
import { UNIT_OF_WORK_TOKEN } from '@core/interfaces/unit-of-work.interface';
import type { IActividadRepository } from '@domain/actividad/actividad.repository.interface';
import { ACTIVIDAD_REPOSITORY_TOKEN } from '@domain/actividad/actividad.repository.interface';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { EstadosArchivoEvidencia } from '@domain/actividad/estados-archivo-evidencia.enum';
import { SubactividadEntity } from '@domain/actividad/subactividad.entity';
import type { ISubactividadRepository } from '@domain/actividad/subactividad.repository.interface';
import { SUBACTIVIDAD_REPOSITORY_TOKEN } from '@domain/actividad/subactividad.repository.interface';
import { CodigoDeViolacion } from '@domain/codigos/codigo-violado.enum';
import { RecursoNoEncontradoException } from '@domain/excepciones/recurso-no-encontrado.exception';
import { ReglaNegocioException } from '@domain/excepciones/regla-negocio.exception';
import { TransactionHandle } from '@domain/shared/transaction.interface';
import { Inject, Injectable } from '@nestjs/common';
import { SubActividadesDirectorioResponse } from '../dto/response/actividades-directorio.response.dto';
import { SubActividadesGetResponse } from '../dto/response/actividades-get.response.dto';
import { SubActividadesSupervicionGetResponse } from '../dto/response/actividades-supervision-get.response.dto';
import { ConfirmarArchivoResponseDto } from '../dto/response/confirmar-archivo.response.dto';
import { EnviarSubActividadRevisionResponseDto } from '../dto/response/enviar-subactividad-revision.response.dto';
import { GenerarPreFirmaResponseDto } from '../dto/response/generar-pre-firma.response.dto';
import { SubActividadesBulkResponse } from '../dto/response/sub-actividades-bulk.response.dto';
import { SubActividadesPoaResponse } from '../dto/response/sub-actividades-poa.response.dto';
import { SubActividadesProximasVencerResponse } from '../dto/response/sub-actividades-proximas-a-vencer-get.response.dto';
import { SubActividadesSelectResponse } from '../dto/response/sub-actividades-select.response.dto';
import { SubActividadesSyncResponse } from '../dto/response/sub-actividades-sync.response.dto';
import { SubActividadResponseMapper } from '../infrastructure/mappers/subactividad-response.mapper';
import { SubActividadBulkQuery } from './ports/commands/subactividad-bulk.command';
import { SubActividadConfirmarArchivoCommand } from './ports/commands/subactividad-confirmar-archivo.command';
import { SubActividadEliminarArchivoCommand } from './ports/commands/subactividad-eliminar-archivo.command';
import { SubActividadEnviarRevisionCommand } from './ports/commands/subactividad-enviar-revision.command';
import { SubActividadGenerarPreFirmaCommand } from './ports/commands/subactividad-generar-prefirma.command';
import { SubActividadSyncQuery } from './ports/commands/subactividad-sync.command';
import { PaginacionParams } from './ports/filtros/paginacion-params.filtro.interface';
import { FiltrosSupervision } from './ports/filtros/subactividad-supervision.filtro.interface';
import { FiltrosDirectorio } from './ports/filtros/subactividaddirectorio.filtro.interface';
import { SubActividadDirectorioQuery } from './ports/queries/subactividad-get-directorio.query';
import { SubActividadGetPoaQuery } from './ports/queries/subactividad-get-poa.query';
import { SubActividadGetSelectQuery } from './ports/queries/subactividad-get-select.query';
import { SubActividadGetSupervisionQuery } from './ports/queries/subactividad-get-supervision.query';
import { SubActividadGetQuery } from './ports/queries/subactividad-get.query';
import { SubActividadProximasAVencerQuery } from './ports/queries/subactividad-proximas-a-vencer.query';
import type { ISubactividadesQueryRepository } from './ports/subactividaeds-query.repository.interface';
import { SUBACTIVIDADES_QUERY_REPOSITORY_TOKEN } from './ports/subactividaeds-query.repository.interface';
// [TASK-04] Imports para vista de entrega
import { SubActividadVistaEntregaQuery } from './ports/queries/subactividad-vista-entrega.query';
import { VistaEntregaResponseDto } from '../dto/response/vista-entrega.response.dto';
import { SemaforoService } from '@domain/semaforo/semaforo-service';
import { EstadosSemaforo } from '@domain/semaforo/estados-semaforo-enum';
import { EstadosPoa } from '@domain/poa/estados-poa.enum';
// [TASK-06] Imports para historial de versiones
import {
  SubActividadHistorialQuery,
  SubActividadVersionDetalleQuery,
  SubActividadLinkDescargaQuery,
} from './ports/queries/subactividad-historial-versiones.query';
import {
  HistorialIndexResponseDto,
  VersionDetalleResponseDto,
  LinkDescargaResponseDto,
} from '../dto/response/historial-versiones.response.dto';

@Injectable()
export class SubactividadesService {
  constructor(
    @Inject(ACTIVIDAD_REPOSITORY_TOKEN)
    private readonly actividadesRepository: IActividadRepository,
    @Inject(SUBACTIVIDADES_QUERY_REPOSITORY_TOKEN)
    private readonly subActividadQueryRepository: ISubactividadesQueryRepository,
    @Inject(SUBACTIVIDAD_REPOSITORY_TOKEN)
    private readonly subActividadRepository: ISubactividadRepository,
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(STORAGE_PORT_TOKEN)
    private readonly storagePort: IStoragePort,
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
    const paginacionParams: PaginacionParams = {
      ...PaginacionMapper.toParams(dto),
      sortBy: dto.sortBy,
    };

    // 2. Adaptación de Filtros (De singular DTO a plural de Repositorio)
    const filtros: FiltrosDirectorio = {
      usuarioUuid: usuarioActual.usuario_id,
      search: dto.search,
      centroUuid: dto.centro_uuid,

      // Si existe, lo envolvemos en arreglo, sino, queda undefined
      tipoActividad: dto.tipo_actividad ? [dto.tipo_actividad] : undefined,
      estadoFlujo: dto.estado_flujo ? [dto.estado_flujo] : undefined,
      semaforo: dto.semaforo,
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

        // Regla de Autorización de Modificación
        if (!actividad.esElegibleParaModificacion()) {
          throw new ReglaNegocioException(
            `La actividad de ID ${actividadId} no puede ser modificada, dado que su POA de origen ya fue Presentada`,
            CodigoDeViolacion.ESTADO_INVALIDO,
          );
        }
        // Regla de autorizazción Multitenant
        if (
          !actividad.puedeSerModificadaPor(
            usuarioActual.rol,
            usuarioActual.usuario_id,
          )
        ) {
          throw new ReglaNegocioException(
            `El usuario ${usuarioActual.rol} de ID ${usuarioActual.usuario_id} no tiene los permisos necesarios sobre el POA al que pertenece esta actividad`,
            CodigoDeViolacion.ROL_INVALIDO,
          );
        }
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
            actividad.getAnioFiscal(), // Inyectar el año fiscal operativo
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

        //Regla de Validación Multinet
        if (!actividad.esElegibleParaModificacion()) {
          throw new ReglaNegocioException(
            `La actividad de ID ${actividadId} no puede ser modificada, dado que su POA de origen ya fue Presentada`,
            CodigoDeViolacion.ESTADO_INVALIDO,
          );
        }

        if (
          !actividad.puedeSerModificadaPor(
            usuarioActual.rol,
            usuarioActual.usuario_id,
          )
        ) {
          throw new ReglaNegocioException(
            `El usuario ${usuarioActual.rol} de ID ${usuarioActual.usuario_id} no tiene los permisos necesarios sobre el POA al que pertenece esta actividad`,
            CodigoDeViolacion.ROL_INVALIDO,
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
              actividad.getAnioFiscal(), // Inyectar el año fiscal operativo
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

  async generarPreFirmaEvidencia(
    command: SubActividadGenerarPreFirmaCommand,
  ): Promise<GenerarPreFirmaResponseDto> {
    const { usuarioActual, subActividadId, dto } = command;

    return this.unitOfWork.ejecutarTransaccion(
      async (tx: TransactionHandle): Promise<GenerarPreFirmaResponseDto> => {
        const subActividad =
          await this.subActividadRepository.obtenerPorIdConContexto(
            subActividadId,
            tx,
          );
        if (!subActividad) {
          throw new RecursoNoEncontradoException(
            'SubActividad',
            subActividadId,
            usuarioActual.usuario_id,
          );
        }

        const archivoId: string = crypto.randomUUID();

        const evidencia = subActividad.registrarIntencionCargaEvidencia(
          usuarioActual.actor,
          usuarioActual.usuario_id,
          {
            archivoId,
            nombreOriginal: dto.nombre_archivo,
            mimeType: dto.mime_type,
            pesoBytes: dto.peso_bytes,
          },
        );

        await this.subActividadRepository.guardarEvidencia(evidencia, tx);

        const { uploadUrl } = await this.storagePort.generarUrlPreFirmadaSubida(
          {
            objectKey: evidencia.getObjectKey(),
            mimeType: evidencia.getTipoMime(),
            pesoBytes: evidencia.getPesoBytes(),
          },
        );

        return SubActividadResponseMapper.toGenerarPreFirmaResponse(
          archivoId,
          uploadUrl,
          evidencia.getTipoMime(),
        );
      },
    );
  }

  async confirmarEvidenciaSubida(
    command: SubActividadConfirmarArchivoCommand,
  ): Promise<ConfirmarArchivoResponseDto> {
    const { usuarioActual, subActividadId, archivoId } = command;

    return this.unitOfWork.ejecutarTransaccion(
      async (tx: TransactionHandle): Promise<ConfirmarArchivoResponseDto> => {
        const subActividad =
          await this.subActividadRepository.obtenerPorIdConContexto(
            subActividadId,
            tx,
          );
        if (!subActividad) {
          throw new RecursoNoEncontradoException(
            'SubActividad',
            subActividadId,
            usuarioActual.usuario_id,
          );
        }

        const evidencia =
          await this.subActividadRepository.obtenerEvidenciaPorId(
            archivoId,
            tx,
          );
        if (!evidencia) {
          throw new RecursoNoEncontradoException(
            'Evidencia',
            archivoId,
            usuarioActual.usuario_id,
          );
        }

        const metadataStorage =
          await this.storagePort.verificarExistenciaObjeto(
            evidencia.getObjectKey(),
          );
        if (!metadataStorage.existe) {
          throw new ReglaNegocioException(
            'El archivo no ha sido encontrado en el servidor de almacenamiento. Asegúrate de completar la subida PUT antes de confirmar.',
            CodigoDeViolacion.ARCHIVO_NO_SUBIDO,
          );
        }

        subActividad.confirmarEvidenciaSubida(
          usuarioActual.actor,
          usuarioActual.usuario_id,
          evidencia,
          metadataStorage.pesoBytes,
        );

        await this.subActividadRepository.guardarEvidencia(evidencia, tx);

        const urlDescarga: string =
          await this.storagePort.generarUrlPreFirmadaDescarga({
            objectKey: evidencia.getObjectKey(),
            nombreDescarga: evidencia.getNombreOriginal(),
          });

        return SubActividadResponseMapper.toConfirmarArchivoResponse(
          evidencia,
          urlDescarga,
        );
      },
    );
  }

  async eliminarEvidencia(
    command: SubActividadEliminarArchivoCommand,
  ): Promise<EliminacionCorrecta> {
    const { usuarioActual, subActividadId, archivoId } = command;

    return this.unitOfWork.ejecutarTransaccion(
      async (tx: TransactionHandle): Promise<EliminacionCorrecta> => {
        const subActividad =
          await this.subActividadRepository.obtenerPorIdConContexto(
            subActividadId,
            tx,
          );
        if (!subActividad) {
          throw new RecursoNoEncontradoException(
            'SubActividad',
            subActividadId,
            usuarioActual.usuario_id,
          );
        }

        const evidencia =
          await this.subActividadRepository.obtenerEvidenciaPorId(
            archivoId,
            tx,
          );
        if (!evidencia) {
          throw new RecursoNoEncontradoException(
            'Evidencia',
            archivoId,
            usuarioActual.usuario_id,
          );
        }

        subActividad.validarEliminacionEvidencia(
          usuarioActual.actor,
          usuarioActual.usuario_id,
          evidencia,
        );

        await this.subActividadRepository.eliminarEvidencia(archivoId, tx);
        await this.storagePort.eliminarObjeto(evidencia.getObjectKey());

        return SubActividadResponseMapper.toEliminarArchivoResponse();
      },
    );
  }

  async enviarSubActividadARevision(
    command: SubActividadEnviarRevisionCommand,
  ): Promise<EnviarSubActividadRevisionResponseDto> {
    const { usuarioActual, subActividadId, dto } = command;

    return this.unitOfWork.ejecutarTransaccion(
      async (
        tx: TransactionHandle,
      ): Promise<EnviarSubActividadRevisionResponseDto> => {
        const subActividad =
          await this.subActividadRepository.obtenerPorIdConContexto(
            subActividadId,
            tx,
          );
        if (!subActividad) {
          throw new RecursoNoEncontradoException(
            'SubActividad',
            subActividadId,
            usuarioActual.usuario_id,
          );
        }

        const estadoAnterior: EstadosActividades = subActividad.getEstado();

        const evidenciasEnBorrador =
          await this.subActividadRepository.obtenerEvidenciasPorEstado(
            subActividadId,
            EstadosArchivoEvidencia.BORRADOR,
            tx,
          );

        const entregaId: string = crypto.randomUUID();

        const { entrega, evidenciasConsolidadas, evidenciasDescartadas } =
          subActividad.consolidarEntregaARevision(
            usuarioActual.actor,
            usuarioActual.usuario_id,
            {
              entregaId,
              comentariosEntrega: dto.comentarios_entrega,
              evidenciasEnBorrador,
              evidenciasIdsSeleccionados: dto.evidencias_ids,
            },
          );

        await this.subActividadRepository.registrarEntregaYActualizarSubActividad(
          subActividad,
          entrega,
          evidenciasConsolidadas,
          tx,
        );

        if (evidenciasDescartadas.length > 0) {
          const idsDescartados: string[] = evidenciasDescartadas.map((e) =>
            e.getId(),
          );
          const keysDescartadas: string[] = evidenciasDescartadas.map((e) =>
            e.getObjectKey(),
          );
          await this.subActividadRepository.eliminarEvidenciasPorIds(
            idsDescartados,
            tx,
          );
          await this.storagePort.eliminarObjetosEnLote(keysDescartadas);
        }

        return SubActividadResponseMapper.toEnviarRevisionResponse(
          subActividadId,
          estadoAnterior,
          subActividad.getEstado(),
          entrega.getVersion(),
          entrega.getFechaEnvio(),
        );
      },
    );
  }

  // ─── [TASK-04] Vista de Entrega ───────────────────────────────────────────

  /**
   * Mapea EstadosSemaforo a etiqueta española para la vista de entrega.
   */
  private mapearEtiquetaSemaforo(semaforo: EstadosSemaforo): string {
    switch (semaforo) {
      case EstadosSemaforo.A_TIEMPO:
        return 'A Tiempo';
      case EstadosSemaforo.PRECAUCION:
        return 'Próximo a Vencer';
      case EstadosSemaforo.CRITICO:
        return 'Vencido';
    }
  }

  /**
   * Mapea EstadosDictamen a etiqueta española para el historial de versiones.
   */
  private mapearEtiquetaDictamen(estadoDictamen: string, version?: number): string {
    switch (estadoDictamen) {
      case 'EN_REVISION':
        return version && version > 1 ? `Enviado a Revisión (V${version})` : 'Enviado a Revisión';
      case 'DEVUELTA_CON_OBSERVACIONES':
        return 'Devuelto con Observaciones';
      case 'APROBADA':
        return 'Aprobado';
      default:
        return estadoDictamen;
    }
  }

  /**
   * Mapea EstadosDictamen → estado operativo legible para el historial.
   */
  private mapearEstadoOperativoDesdeEntrega(estadoDictamen: string): string {
    switch (estadoDictamen) {
      case 'EN_REVISION':
        return 'EN_REVISION';
      case 'DEVUELTA_CON_OBSERVACIONES':
        return 'DEVUELTA';
      case 'APROBADA':
        return 'CONCLUIDA';
      default:
        return estadoDictamen;
    }
  }

  async getVistaEntrega(
    query: SubActividadVistaEntregaQuery,
  ): Promise<VistaEntregaResponseDto> {
    const { usuarioActual, subActividadId } = query;

    // 1. Cargar la sub-actividad con contexto (para validación de acceso)
    const subActividad =
      await this.subActividadRepository.obtenerPorIdConContexto(subActividadId);
    if (!subActividad) {
      throw new RecursoNoEncontradoException(
        'SubActividad',
        subActividadId,
        usuarioActual.usuario_id,
      );
    }

    // 2. Validar acceso (protección IDOR)
    subActividad.validarAccesoLecturaEvidencia(
      usuarioActual.actor,
      usuarioActual.usuario_id,
    );

    // 3. Cargar datos del repositorio de consultas (vista completa)
    const vistaRaw =
      await this.subActividadQueryRepository.obtenerVistaEntrega(subActividadId);

    if (!vistaRaw) {
      throw new RecursoNoEncontradoException(
        'SubActividad',
        subActividadId,
        usuarioActual.usuario_id,
      );
    }

    // 4. Calcular semáforo
    const semaforo = SemaforoService.calcularSemaforoVencimiento(
      vistaRaw.fechaTermino,
    );
    const etiquetaSemaforo = this.mapearEtiquetaSemaforo(semaforo);

    // 5. Calcular permite_entrega
    const estadoActual = subActividad.getEstado();
    const anioFiscal = vistaRaw.poaAnioFiscal;
    const anioActual = new Date().getFullYear();
    const permiteEntrega =
      (estadoActual === EstadosActividades.EN_PROGRESO ||
        estadoActual === EstadosActividades.DEVUELTA) &&
      vistaRaw.poaEstado === EstadosPoa.AUTORIZADA &&
      anioFiscal === anioActual;

    // 6. Generar URLs pre-firmadas para evidencias en BORRADOR
    const evidenciasConUrl = await Promise.all(
      vistaRaw.evidenciasBorrador.map(async (ev) => {
        const url = await this.storagePort.generarUrlPreFirmadaDescarga({
          objectKey: ev.s3_key,
          nombreDescarga: ev.nombre_original,
        });
        return {
          id: ev.id,
          nombre_archivo: ev.nombre_original,
          peso_mb: Math.round((ev.peso_bytes / (1024 * 1024)) * 100) / 100,
          url_descarga: url,
        };
      }),
    );

    // 7. Mapear observaciones activas (última entrega DEVUELTA_CON_OBSERVACIONES)
    const observacionesActivas = vistaRaw.observacionesActivas.map((obs) => ({
      id: obs.id,
      correlativo: `Observación #${obs.numero_secuencia}`,
      estado: obs.estado_solvencia,
      descripcion: obs.descripcion,
    }));

    // 8. Mapear historial de versiones
    const ultimaVersion = vistaRaw.historialVersiones[0]?.version ?? 0;
    const historialVersiones = vistaRaw.historialVersiones.map((v) => ({
      id: v.id,
      estado_operativo: this.mapearEstadoOperativoDesdeEntrega(v.estado_dictamen),
      etiqueta: this.mapearEtiquetaDictamen(v.estado_dictamen, v.version),
      fecha: (v.fecha_dictamen ?? v.fecha_envio).toISOString(),
      es_version_actual: v.version === ultimaVersion,
      tiene_observaciones: v.total_observaciones > 0,
      tiene_archivos_subidos: v.total_evidencias > 0,
    }));

    // 9. Ensamblar respuesta
    return {
      meta_cabecera: {
        folio: vistaRaw.folio,
        titulo: vistaRaw.titulo,
        centro_clave: vistaRaw.centroClave,
        version_actual: subActividad.getUltimaVersionEntrega(),
        etiqueta_semaforo: etiquetaSemaforo,
        permite_entrega: permiteEntrega,
        permite_carga_evidencias: permiteEntrega,
      },
      observaciones_activas: observacionesActivas,
      detalles_operacion: {
        estado_actual: estadoActual,
        periodo_ejecucion: {
          inicio: vistaRaw.fechaInicio.toISOString(),
          fin: vistaRaw.fechaTermino.toISOString(),
        },
        duracion_estimada_semanas: subActividad.calcularSemanasTotales(),
        cierre_global_poa: vistaRaw.poaCierreGlobal ? vistaRaw.poaCierreGlobal.toISOString() : null,
      },
      buzon_borrador: {
        evidencias: evidenciasConUrl,
        comentarios_entrega: vistaRaw.ultimoComentarioEntrega,
      },
      historial_versiones: historialVersiones,
    };
  }

  // ─── [TASK-06] Historial de Versiones ────────────────────────────────────

  async getHistorial(
    query: SubActividadHistorialQuery,
  ): Promise<HistorialIndexResponseDto> {
    const { usuarioActual, subActividadId } = query;

    // Validar acceso
    const subActividad =
      await this.subActividadRepository.obtenerPorIdConContexto(subActividadId);
    if (!subActividad) {
      throw new RecursoNoEncontradoException(
        'SubActividad',
        subActividadId,
        usuarioActual.usuario_id,
      );
    }
    subActividad.validarAccesoLecturaEvidencia(
      usuarioActual.actor,
      usuarioActual.usuario_id,
    );

    const entregas =
      await this.subActividadQueryRepository.obtenerHistorialVersiones(subActividadId);

    const data = entregas.map((e) => ({
      id_version: e.id,
      numero_version: e.version,
      titulo_evento: this.mapearEtiquetaDictamen(e.estado_dictamen),
      estado: this.mapearEstadoOperativoDesdeEntrega(e.estado_dictamen),
      fecha_evento: (e.fecha_dictamen ?? e.fecha_envio).toISOString(),
    }));

    return { data };
  }

  async getVersionDetalle(
    query: SubActividadVersionDetalleQuery,
  ): Promise<VersionDetalleResponseDto> {
    const { usuarioActual, subActividadId, versionId } = query;

    // Validar acceso
    const subActividad =
      await this.subActividadRepository.obtenerPorIdConContexto(subActividadId);
    if (!subActividad) {
      throw new RecursoNoEncontradoException(
        'SubActividad',
        subActividadId,
        usuarioActual.usuario_id,
      );
    }
    subActividad.validarAccesoLecturaEvidencia(
      usuarioActual.actor,
      usuarioActual.usuario_id,
    );

    const detalle = await this.subActividadQueryRepository.obtenerVersionDetalle(
      subActividadId,
      versionId,
    );

    if (!detalle) {
      throw new RecursoNoEncontradoException(
        'EntregaSubActividad',
        versionId,
        usuarioActual.usuario_id,
      );
    }

    // Determinar si es la versión actual (mayor versión = actual)
    const ultimaVersion = subActividad.getUltimaVersionEntrega();

    const evidencias = detalle.evidencias.map((ev) => {
      const pesoMb = Math.round((ev.peso_bytes / (1024 * 1024)) * 100) / 100;
      return {
        id: ev.id,
        nombre: ev.nombre_original,
        peso_formateado: `${pesoMb} MB`,
        fecha_subida: ev.fecha_creacion.toISOString(),
      };
    });

    const observaciones = detalle.observaciones.map((obs) => ({
      id: obs.id,
      numero: obs.numero_secuencia,
      texto: obs.descripcion,
    }));

    return {
      folio: detalle.folio,
      centro_clave: detalle.centroClave,
      titulo_subactividad: detalle.titulo,
      version_visualizada: detalle.version,
      es_version_actual: detalle.version === ultimaVersion,
      fecha_envio_contralor: detalle.fecha_envio.toISOString(),
      mensaje_envio: detalle.comentarios_entrega,
      evidencias,
      resolucion_estado: detalle.estado_dictamen
        ? this.mapearEstadoOperativoDesdeEntrega(detalle.estado_dictamen)
        : null,
      fecha_dictamen: detalle.fecha_dictamen
        ? detalle.fecha_dictamen.toISOString()
        : null,
      observaciones,
    };
  }

  async getLinkDescarga(
    query: SubActividadLinkDescargaQuery,
  ): Promise<LinkDescargaResponseDto> {
    const { usuarioActual, subActividadId, versionId, archivoId } = query;

    // Validar acceso a la sub-actividad
    const subActividad =
      await this.subActividadRepository.obtenerPorIdConContexto(subActividadId);
    if (!subActividad) {
      throw new RecursoNoEncontradoException(
        'SubActividad',
        subActividadId,
        usuarioActual.usuario_id,
      );
    }
    subActividad.validarAccesoLecturaEvidencia(
      usuarioActual.actor,
      usuarioActual.usuario_id,
    );

    // Validar IDOR: el archivo debe pertenecer a la versión y ésta a la sub-actividad
    const archivo = await this.subActividadQueryRepository.obtenerArchivoDeVersion(
      subActividadId,
      versionId,
      archivoId,
    );

    if (!archivo) {
      throw new RecursoNoEncontradoException(
        'Evidencia',
        archivoId,
        usuarioActual.usuario_id,
      );
    }

    const url = await this.storagePort.generarUrlPreFirmadaDescarga({
      objectKey: archivo.s3_key,
      nombreDescarga: archivo.nombre_original,
    });

    return { url_descarga_efimera: url };
  }
}
