import type { IUnitOfWork } from '@core/interfaces/unit-of-work.interface';
import { UNIT_OF_WORK_TOKEN } from '@core/interfaces/unit-of-work.interface';
import { ActividadEntity } from '@domain/actividad/actividad.entity';
import type { IActividadRepository } from '@domain/actividad/actividad.repository.interface';
import { ACTIVIDAD_REPOSITORY_TOKEN } from '@domain/actividad/actividad.repository.interface';
import { RecursoNoEncontradoException } from '@domain/excepciones/recurso-no-encontrado.exception';
import type { IPoaRepository } from '@domain/poa/poa.repository.interface';
import { POA_REPOSITORY_TOKEN } from '@domain/poa/poa.repository.interface';
import { ActividadSnapshot } from '@domain/poa/value-objects/actividad-snapshot.value-object';
import { TransactionHandle } from '@domain/shared/transaction.interface';
import type { IActividadesQueryRepository } from '@modules/actividades/application/ports/actividades-query.repository.interface';
import { ACTIVIDADES_QUERY_REPOSITORY_TOKEN } from '@modules/actividades/application/ports/actividades-query.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { CancelarPoaDto } from '../dto/request/poas-cancelar.dto';
import { PresentarPoasDto } from '../dto/request/poas-presentar.dto';
import { CrearActividadesResponseDto } from '../dto/response/poa-actividades.response.dto';
import { PoaActualDto } from '../dto/response/poa-actual.dto';
import { PoaResponseMapper } from '../infrastructure/mappers/poa-response.mapper';
import { AgregarActividadCommand } from './ports/commands/agregar-actividad.command';
import { CancelarEnvioCommand } from './ports/commands/cancelar-envio.command';
import { PresentarPoaCommand } from './ports/commands/presentar-poa.command';
import type { IPoaQueryRepository } from './ports/poa-query.repository.interface';
import { POA_QUERY_REPOSITORY_TOKEN } from './ports/poa-query.repository.interface';
import { GetPoaActualQuery } from './ports/queries/get-poa-actual.query';

@Injectable()
export class PoasService {
  constructor(
    @Inject(POA_REPOSITORY_TOKEN)
    private readonly poaRepository: IPoaRepository,
    @Inject(ACTIVIDAD_REPOSITORY_TOKEN)
    private readonly actividadRepository: IActividadRepository,
    @Inject(POA_QUERY_REPOSITORY_TOKEN)
    private readonly poaQueryRepository: IPoaQueryRepository,
    @Inject(ACTIVIDADES_QUERY_REPOSITORY_TOKEN)
    private readonly actividadQueryRepository: IActividadesQueryRepository,
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async getPoaActual(query: GetPoaActualQuery): Promise<PoaActualDto> {
    //Deconstrucción del Query
    const { usuarioActual } = query;
    //Obtener del repositorio de querys la información de la base de datos
    const poaActual = await this.poaQueryRepository.obtenerMiPoaActual({
      usuarioUuid: usuarioActual.usuario_id,
    });

    //Si no se encuentra
    if (!poaActual) {
      throw new RecursoNoEncontradoException(
        'POA',
        'Única',
        usuarioActual.usuario_id,
      );
    }
    // Retorno del DTO vía el mapper
    return PoaResponseMapper.toPoaActualDto(poaActual);
  }

  async agregarActividad(
    command: AgregarActividadCommand,
  ): Promise<CrearActividadesResponseDto> {
    //Deconstruir el Command
    const { poaId, usuario, dto } = command;

    // Iniciaqmos la transacci'on con la Unit of Wortk
    return this.unitOfWork.ejecutarTransaccion(
      async (tx: TransactionHandle) => {
        // 1. Obtener y autorizar desde el agregado Raíz (PoaEntity)
        const poa = await this.poaRepository.obtenerPorId(poaId, tx);

        if (!poa)
          throw new RecursoNoEncontradoException(
            'POA',
            poaId,
            usuario.usuario_id,
          );

        // Validar que la POA esté en un estado que se pueda editar y por un usuario que pueda.
        poa.validarEdicion(usuario.actor, usuario.usuario_id);

        // 2. Lógica de Dominio: Generar el Folio Secuencial
        const nuevoFolio = poa.generarFolioNuevaActividad();

        //4. Construir la Entidad de la Actividad
        const nuevaActividad = new ActividadEntity(
          crypto.randomUUID(),
          nuevoFolio,
          dto.titulo,
          dto.justificacion,
          dto.objetivo_general,
          dto.objetivos_especificos,
          dto.metas,
          dto.indicadores,
          null, // Fehca Inicio
          null, //Fecha término
          false, //Es rezagado
          dto.equipo_auditor.auditores_ids,
          [], //SubActividades
          dto.banco_actividad_id,
        );

        // 5. Validar los textos de la Actividad (Fail-Firs)
        nuevaActividad.validarCreacionBorrador();

        // 6. Guardar en la Base de Datos transaccionalmente
        await this.actividadRepository.guardar(nuevaActividad, poaId, tx);

        // Actualizar el POA (Cambio su 'ultima Secuencia Actividad)
        await this.poaRepository.guardar(poa, tx);

        // 7. Retornar DTO
        return PoaResponseMapper.toPostActividadPoa(nuevaActividad);
      },
    );
  }

  async presentarPoa(command: PresentarPoaCommand): Promise<PresentarPoasDto> {
    // Deconstrucción del command
    const { usuarioActual, poaId } = command;

    //Inclumos la transacción en el Unit Of Work
    return this.unitOfWork.ejecutarTransaccion(
      async (tx: TransactionHandle) => {
        //1. Obtener al Agregado Raíz
        const poa = await this.poaRepository.obtenerPorId(poaId, tx);

        //Fail-firs
        if (!poa) {
          throw new RecursoNoEncontradoException(
            'POA',
            poaId,
            usuarioActual.usuario_id,
          );
        }

        const estadoAnterior = poa.getEstadosPoa();

        //2. Extraemos actividades reales y armamos los Snapshots
        const actividades = await this.actividadRepository.obtenerPorPoaId(
          poaId,
          tx,
        );

        const snapshots: ActividadSnapshot[] = actividades.map((act) => ({
          id: act.getId(),
          porcentajeAvance: act.calcularPorcentajeAvance(),
          mensajesValidacion: act.validarIntegridad().map((e) => e.message),
          esRezago: act.getEsRezago(),
        }));

        poa.cargarSnapshotsActividades(snapshots);

        const totalRezagadasEsperadas =
          await this.actividadQueryRepository.contarRezagosHistoricos({
            usuarioActualId: poa.getContralorId(),
            anioFiscalActual: poa.getAnioFiscal(),
          });

        //4. Validaciones de Dominio
        poa.enviarARevision(
          usuarioActual.actor,
          usuarioActual.usuario_id,
          totalRezagadasEsperadas,
        );

        //5. Persistir los cambios
        await this.poaRepository.guardar(poa, tx);

        //6. Retorno
        return PoaResponseMapper.toPresentarPoaDto(
          poaId,
          estadoAnterior,
          poa.getEstadosPoa(),
        );
      },
    );
  }

  async cancelarEnvio(command: CancelarEnvioCommand): Promise<CancelarPoaDto> {
    // Deconstrucción del command
    const { usuarioActual, poaId } = command;

    return this.unitOfWork.ejecutarTransaccion(
      async (tx: TransactionHandle) => {
        //1. Obtener el agrego raíz
        const poa = await this.poaRepository.obtenerPorId(poaId, tx);

        //Fail-first
        if (!poa) {
          throw new RecursoNoEncontradoException(
            'POA',
            poaId,
            usuarioActual.usuario_id,
          );
        }

        const estadoAnterior = poa.getEstadosPoa();

        //2. Validaciones de Dominio
        poa.cancelarEnvio(usuarioActual.actor, usuarioActual.usuario_id);

        //3. Persistir cambios
        await this.poaRepository.guardar(poa, tx);

        return PoaResponseMapper.toCancelarPoa(
          poaId,
          estadoAnterior,
          poa.getEstadosPoa(),
        );
      },
    );
  }
}
