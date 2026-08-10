import { EliminacionCorrecta } from '@core/common/dto/response/deleted.response.dto';
import type { IUnitOfWork } from '@core/interfaces/unit-of-work.interface';
import { UNIT_OF_WORK_TOKEN } from '@core/interfaces/unit-of-work.interface';
import type { IActividadRepository } from '@domain/actividad/actividad.repository.interface';
import { ACTIVIDAD_REPOSITORY_TOKEN } from '@domain/actividad/actividad.repository.interface';
import { CodigoDeViolacion } from '@domain/codigos/codigo-violado.enum';
import { RecursoNoEncontradoException } from '@domain/excepciones/recurso-no-encontrado.exception';
import { ReglaNegocioException } from '@domain/excepciones/regla-negocio.exception';
import { TransactionHandle } from '@domain/shared/transaction.interface';
import { Inject, Injectable } from '@nestjs/common';
import { EstadoPoa } from '@prisma/client';
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
    @Inject(ACTIVIDAD_REPOSITORY_TOKEN)
    private readonly actividadRepository: IActividadRepository,
    @Inject(ACTIVIDADES_QUERY_REPOSITORY_TOKEN)
    private readonly actividadQueryRepository: IActividadesQueryRepository,
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  // El endpoint de get resumen
  async getResumen(
    query: ActividadGetResumenQuery,
  ): Promise<ActividadesResumenResponse> {
    // Deconstrucción del query
    const { usuarioActual, actividadId } = query;
    const actividad = await this.actividadQueryRepository.obtenerResumenPorId({
      usuarioUuid: usuarioActual.usuario_id,
      actividadId: actividadId,
    });

    if (!actividad) {
      throw new RecursoNoEncontradoException(
        'Actividad',
        actividadId,
        usuarioActual.usuario_id,
      );
    }
    return ActividadResponseMapper.toGetResumen(actividad);
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

  async patchFichaTecnica(
    command: ActividadPatchFichaTecnicaCommand,
  ): Promise<ActividadesResumenResponse> {
    //Deconstrucción del command
    const { usuarioActual, actividadId, dto } = command;

    return this.unitOfWork.ejecutarTransaccion(
      async (tx: TransactionHandle) => {
        // 1. Obtenemos el agregado Raíz Vivo (Hidratado con el contexto del POA)
        const actividad = await this.actividadRepository.obtenerPorId(
          actividadId,
          tx,
        );

        //2. Fail First
        if (!actividad) {
          throw new RecursoNoEncontradoException(
            'Actividad',
            actividadId,
            usuarioActual.usuario_id,
          );
        }

        if (!actividad.esElegibleParaModificacion()) {
          throw new ReglaNegocioException(
            `La actividad de ID ${actividadId} no puede ser modificada, dado que su POA de origen ya fue Presentada`,
            CodigoDeViolacion.ESTADO_INVALIDO,
          );
        }

        //3. Regla de Autorización Multitenat (HTTP403)
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

        //5. Mutación de Dominio
        actividad.actualizarFichaTecnica({
          titulo: dto.titulo,
          justificacion: dto.justificacion,
          objetivo_general: dto.objetivo_general,
          objetivos_particulares: dto.objetivos_particulares,
          meta_del_proyecto: dto.meta_del_proyecto,
          indicadores: dto.indicadores,
          auditores_ids: dto.auditores_ids,
        });

        //6. Persistencia Atómica
        await this.actividadRepository.guardar(actividad, undefined, tx);

        //7. Respuesta
        return ActividadResponseMapper.toPatchFichaTecnica(actividad);
      },
    );
  }

  async deleteActividad(
    command: ActividadDeleteActividadCommand,
  ): Promise<EliminacionCorrecta> {
    // Deconstrucción del Command
    const { usuarioActual, actividadId } = command;
    return this.unitOfWork.ejecutarTransaccion(
      async (tx: TransactionHandle) => {
        const actividad = await this.actividadRepository.obtenerPorId(
          actividadId,
          tx,
        );

        // Fail first
        if (!actividad) {
          throw new RecursoNoEncontradoException(
            'Actividad',
            actividadId,
            usuarioActual.usuario_id,
          );
        }

        // Regla de autorización Miltitenat (HTTP 403)
        if (
          !actividad.puedeSerModificadaPor(
            usuarioActual.rol,
            usuarioActual.usuario_id,
          )
        ) {
          throw new ReglaNegocioException(
            `El usuario ${usuarioActual.usuario_id} con el ID ${usuarioActual.usuario_id} no tiene permitido eliminar actividad de este POA`,
            CodigoDeViolacion.ROL_INVALIDO,
          );
        }

        // Regla de Estado de Ciclo de Vida (HTTP 409)
        if (!actividad.esElegibleParaModificacion()) {
          throw new ReglaNegocioException(
            `No se puede eliminar la actividad porque su POA ya fue presentado y no está en estado ${EstadoPoa.BORRADOR} o ${EstadoPoa.DEVUELTA}`,
            CodigoDeViolacion.DATOS_INSUFICIENTES,
          );
        }

        // Persistencia
        await this.actividadRepository.eliminar(actividadId, tx);

        // Respuesta
        return ActividadResponseMapper.toDeleteActividad();
      },
    );
  }
}
