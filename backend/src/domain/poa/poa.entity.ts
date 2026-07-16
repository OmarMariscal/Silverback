import { ActividadEntity } from '@domain/actividad/actividad.entity';
import { crearActor } from '@domain/roles/actor.factory';
import { Actor } from '@domain/roles/actor.interface';
import { Roles } from '@domain/roles/roles.enum';
import { BadRequestException } from '@nestjs/common';
import { EstadosPoa } from './estados-poa.enum';

export class PoaEntity {
  constructor(
    private readonly id: string,
    private readonly contralorId: string,
    private readonly centroUniversitarioId: string,
    private readonly ejercicio: number,

    private estado: EstadosPoa,
    private mensajeResolucion: string | null = null,
    private actividades: ActividadEntity[] = [],
  ) {}

  // Funciones Auxiliares
  private validarEstadoInicial(
    estadoInicial: EstadosPoa[],
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

  //Getters

  public getId(): string {
    return this.id;
  }

  public getContralorId(): string {
    return this.contralorId;
  }

  public getCentroUniversitarioId(): string {
    return this.centroUniversitarioId;
  }

  public getEjercicio(): number {
    return this.ejercicio;
  }

  public getMensajeResolucion(): string | null {
    return this.mensajeResolucion;
  }

  public getEstadosPoa(): EstadosPoa {
    return this.estado;
  }

  public getActividades(): ActividadEntity[] {
    return [...this.actividades];
  }

  public enviarARevision(
    usuarioActual: Actor,
    cantidadRezagadasPendientes: number,
  ): void {
    //Fallo rápido de Estados
    //Una POA solo puede pasar a EN_REVISIÓN si viene del estado BORRADOR
    this.validarEstadoInicial([EstadosPoa.BORRADOR, EstadosPoa.DEVUELTA]);

    //Fallo rápido de roles
    // Validar Roles Permitidos
    const actorContralor = crearActor(Roles.CONTRALOR);
    const actorAuditorPermisos = crearActor(Roles.AUDITOR, true);
    const logAccion = `Pasar de estado ${this.estado} a ${EstadosPoa.EN_REVISION}`;

    this.validarRolPermitido(
      [actorContralor, actorAuditorPermisos],
      usuarioActual,
      logAccion,
    );

    // Validaciones y recopialción de logs
    const erroresPoa: string[] = [];

    // Regla 1: Se deben incluir todas las actividades rezagadas
    if (cantidadRezagadasPendientes > 0) {
      erroresPoa.push(
        `Faltan ${cantidadRezagadasPendientes} actividades rezagadas por incluirse`,
      );
    }

    // Regla 2: Se tiene que tener mínimo una Actividad Principal
    if (this.actividades.length === 0) {
      erroresPoa.push(`El POA debe tener por lo menos 1 Actividad Principal`);
    }

    // Regla 3: Revisar la integridad de cada actividad
    for (const actividad of this.actividades) {
      const erroresActividad = actividad.validarIntegridad();
      erroresPoa.push(...erroresActividad);
    }

    // Verificamos si se captó algún log de error
    if (erroresPoa.length > 0) {
      throw new BadRequestException(
        // CAMBIAR POR VALIDACION INTEGRATE EXCEPCIÓN cuando esté listo
        `La POA de ID ${this.id} no cumple con los requisitos para ser enviada a revisión \n- ${erroresPoa.join('\n- ')}`,
      );
    }

    // Actualizar el cambio de estado si lleg'o hasta aqui
    this.estado = EstadosPoa.EN_REVISION;
  }

  public devolver(
    usuarioActual: Actor,
    retroalimentacion: string | null,
  ): void {
    // Solo una POA en estado EN_REVISION puede pasar al estado DEVUELTO
    this.validarEstadoInicial([EstadosPoa.EN_REVISION]);

    // Solo el rol JEFA puede hacer el cambio a DEVUELTO
    const actorJefa = crearActor(Roles.JEFA);
    const logAccion = `Pasar POA del estado ${this.estado} a ${EstadosPoa.DEVUELTA}`;

    this.validarRolPermitido([actorJefa], usuarioActual, logAccion);

    // Se tiene que devolver con al menos una observación
    if (retroalimentacion === null || retroalimentacion.length === 0) {
      throw new BadRequestException(
        `Para pasar al estado ${EstadosPoa.DEVUELTA} se tiene que anexar algún comentario`,
      );
    }

    // Autorizar el cambio de estado
    this.estado = EstadosPoa.DEVUELTA;
    this.mensajeResolucion = retroalimentacion;
  }

  public autorizar(usuarioActual: Actor): void {
    // Validar el estado inicial
    this.validarEstadoInicial([EstadosPoa.EN_REVISION]);

    // Solo el rol JEFA puede pasar al estado AUTORIZADO una POA
    const actorJefa = crearActor(Roles.JEFA);
    const logAccion = `Pasar una POA del estado ${this.estado} al ${EstadosPoa.AUTORIZADA}`;
    this.validarRolPermitido([actorJefa], usuarioActual, logAccion);

    // Actualizar el Estado
    this.estado = EstadosPoa.AUTORIZADA;
  }

  public agregarActividad(actividad: ActividadEntity): void {
    // Solo se pueden agregar actividades a una POA en estado BORRADOR o DEVUELTA
    this.validarEstadoInicial([EstadosPoa.BORRADOR, EstadosPoa.DEVUELTA]);

    const existe = this.actividades.some(
      (act) => act.getId() === actividad.getId(),
    );

    if (existe) {
      throw new BadRequestException(
        `El ID de actividad ${actividad.getId()} ya está registrada en la POA`,
      );
    }

    this.actividades.push(actividad);
  }

  public eliminarActividad(actividadId: string): void {
    // Solo se pueden quitar actividades a una POA en estado BORRADOR o DEVUELTA
    this.validarEstadoInicial([EstadosPoa.BORRADOR, EstadosPoa.DEVUELTA]);

    this.actividades = this.actividades.filter(
      (act) => act.getId() != actividadId,
    );
  }

  public calcularAvanceGlobal(): number {
    // Solo se puede calcular el avance de una POA en estado AUTORIZADA
    this.validarEstadoInicial([EstadosPoa.AUTORIZADA]);

    // Evitar división entre 0
    if (this.actividades.length === 0) {
      return 0;
    }

    const sumaPorcentajes = this.actividades.reduce(
      (suma, actividad) => suma + actividad.calcularPorcentajeAvance(),
      0,
    );

    const avance = sumaPorcentajes / this.actividades.length;
    return Math.round(avance * 100) / 100;
  }
}
