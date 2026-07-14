import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';
import { crearActor } from '@domain/roles/actor.factory';
import { Actor } from '@domain/roles/actor.interface';
import { BadRequestException } from '@nestjs/common'; // Cambiar por Excepción de Regla de Negocio cuando quede codificada
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { Roles } from '@domain/roles/roles.enum';

export class SubactividadEntity {
  constructor(
    private readonly id: string,
    private estado: EstadosActividades,
    private readonly tipo: TipoSubActividad,
    private fechaAprobacion: Date | null,
    private fechaConclusion: Date | null,
    private mensajeResolucion: string | null,
  ) {}

  private validarEstadoInicial(
    estadoInicial: EstadosActividades[],
    excepcionClase: new (mensaje: string) => Error = BadRequestException,
  ): void {
    if (!estadoInicial.includes(this.estado)) {
      throw new excepcionClase(
        `Operación inválida. La sub-actividad está en ${this.estado}, pero requiere estar en: ${estadoInicial.join(' o ')}.`,
      );
    }
  }

  private validarRolPermitido(
    rolesPermitidos: Actor[],
    rolActual: Actor,
    accion: string,
  ) {
    const tienePrivilegios = rolesPermitidos.some(
      (actor) =>
        actor.rol === rolActual.rol &&
        actor.tienePermisos === rolActual.tienePermisos,
    );

    if (tienePrivilegios) {
      return;
    }

    //Llegar aquí significa que el rol no coincide exactamente con el de los roles permitidos
    throw new BadRequestException(
      `El rol ${rolActual.rol} no tiene los privilegios necesarios para ${accion}`,
    );
  }

  // Getter's
  public getId(): string {
    return this.id;
  }

  public getEstado(): EstadosActividades {
    return this.estado;
  }

  public getTipoSubActividad(): TipoSubActividad {
    return this.tipo;
  }

  public getFechaAprobacion(): Date | null {
    return this.fechaAprobacion;
  }

  public getFechaConclusion(): Date | null {
    return this.fechaConclusion;
  }

  public getMensajeResolucion(): string | null {
    return this.mensajeResolucion;
  }

  public solicitarArranque(rolActual: Actor, fechaInicio: Date): void {
    //Se tiene que tener el esatado SIN_EMPEZAR para pasar a SOLICITADO
    this.validarEstadoInicial([EstadosActividades.SIN_EMPEZAR]);
    /*
      Solo el rol CONTRALOR y AUDITOR (con permisos cedidos) puede pasar a SOLICITADO
    */
    const actorContralor = crearActor(Roles.CONTRALOR);
    const actorAuditorPermisos = crearActor(Roles.AUDITOR, true);
    const logAccion = `Pasar de ${this.estado} a ${EstadosActividades.SOLICITADO}`;

    this.validarRolPermitido(
      [actorContralor, actorAuditorPermisos],
      rolActual,
      logAccion,
    );

    // Actualizar el estado
    this.estado = EstadosActividades.SOLICITADO;
    this.fechaAprobacion = fechaInicio;
  }

  public habilitarProgreso(rolActual: Actor): void {
    //Se tiene que tener el estado SOLICITADO para pasar a EN_PROGRESO
    this.validarEstadoInicial([EstadosActividades.SOLICITADO]);
    /*
      Solo el rol JEFA puede pasar al estado EN_PROGRESO
    */
    const actorJefa = crearActor(Roles.JEFA);
    const logAccion = `Pasar de ${this.estado} a ${EstadosActividades.EN_PROGRESO}`;

    this.validarRolPermitido([actorJefa], rolActual, logAccion);

    // Actualizar el estado
    this.estado = EstadosActividades.EN_PROGRESO;
  }

  public enviarARevision(rolActual: Actor): void {
    // Se tiene que tener el estado EN_PROGRESO o DEVUELTA para pasar a EN_REVISION
    this.validarEstadoInicial([
      EstadosActividades.EN_PROGRESO,
      EstadosActividades.DEVUELTA,
    ]);
    /*
      Solo el rol CONTRALOR o Auditor (Con permisos) puede poner el estado EN_REVISION
    */
    const actorContralor = crearActor(Roles.CONTRALOR);
    const actorAuditor = crearActor(Roles.AUDITOR, true);
    const logAccion = `Pasar de ${this.estado} a ${EstadosActividades.EN_REVISION}`;

    this.validarRolPermitido(
      [actorContralor, actorAuditor],
      rolActual,
      logAccion,
    );

    // Actualizar el estado
    this.estado = EstadosActividades.EN_REVISION;
  }

  public devolver(rolActual: Actor, retroalimentacion: string | null): void {
    // Se tiene que tener el estado EN_REVISION para poner a DEVUELTO
    this.validarEstadoInicial([EstadosActividades.EN_REVISION]);

    /*
    Solo el rol JEFA puede poner el estado DEVUELTO
    */
    const actorJefa = crearActor(Roles.JEFA);
    const logAccion = `Pasar de ${this.estado} a ${EstadosActividades.DEVUELTA}`;
    this.validarRolPermitido([actorJefa], rolActual, logAccion);

    // Se tiene que tener algo en la observación
    if (retroalimentacion === null || retroalimentacion.length === 0) {
      throw new BadRequestException(
        `La justificación de la devolución no debe estar vacía`,
      );
    }

    //actualizar el estado
    this.estado = EstadosActividades.DEVUELTA;
    this.mensajeResolucion = retroalimentacion;
  }

  public concluir(rolActual: Actor, fechaReal: Date): void {
    //Se tiene que poner
    this.validarEstadoInicial([EstadosActividades.EN_REVISION]);
    /*
    Solo el rol JEFA puede poner el estado CONCLUIDA
    */
    const actorJefa = crearActor(Roles.JEFA);
    const logAccion = `Pasar de ${this.estado} a ${EstadosActividades.CONCLUIDA}`;
    this.validarRolPermitido([actorJefa], rolActual, logAccion);

    // Actualizar el estado
    this.estado = EstadosActividades.CONCLUIDA;
    this.fechaConclusion = fechaReal;
  }
}
