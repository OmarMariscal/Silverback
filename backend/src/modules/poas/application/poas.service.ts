import type { IUnitOfWork } from '@core/interfaces/unit-of-work.interface';
import { UNIT_OF_WORK_TOKEN } from '@core/interfaces/unit-of-work.interface';
import { ActividadEntity } from '@domain/actividad/actividad.entity';
import type { IActividadRepository } from '@domain/actividad/actividad.repository.interface';
import { ACTIVIDAD_REPOSITORY_TOKEN } from '@domain/actividad/actividad.repository.interface';
import { RecursoNoEncontradoException } from '@domain/excepciones/recurso-no-encontrado.exception';
import type { IPoaRepository } from '@domain/poa/poa.repository.interface';
import { POA_REPOSITORY_TOKEN } from '@domain/poa/poa.repository.interface';
import { TransactionHandle } from '@domain/shared/transaction.interface';
import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
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

        poa.validarEdicion(usuario.actor);

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

  presentarPoa(command: PresentarPoaCommand) {
    // Deconstrucción del command
    const { usuarioActual, poaId } = command;

    throw new NotImplementedException();
  }

  cancelarEnvio(command: CancelarEnvioCommand) {
    // Deconstrucción del command
    const { usuarioActual, poaId } = command;

    throw new NotImplementedException();
  }
}
