import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';
import { Actor } from '@domain/roles/actor.interface';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { ReglaNegocioException } from '@domain/excepciones/regla-negocio.exception';
import { CodigoDeViolacion } from '@domain/codigos/codigo-violado.enum';
import { Permisos } from '@domain/roles/permisos.enum';
import { validarPermisoDeDominio } from '@domain/shared/utils/autorizacion.utils';

export class SubactividadEntity {
  constructor(
    private readonly id: string,
    private numeroOrden: string,
    private descripcion: string,

    // Estado y Tipo
    private estado: EstadosActividades,
    private tipo: TipoSubActividad,

    // Fechas planeadas (Fijas desde la creación)
    private fechaInicio: Date,
    private fechaTermino: Date,

    // Mutables (Cambian con las transiciones)
    private fechaEnvio: Date | null = null,
    private mensajeResolucion: string | null = null,

    private bancoSubActividadId: string | null = null,
  ) {}

  private validarEstadoInicial(estadoInicial: EstadosActividades[]): void {
    if (!estadoInicial.includes(this.estado)) {
      throw new ReglaNegocioException(
        `Operación inválida. La sub-actividad está en ${this.estado}, pero requiere estar en: ${estadoInicial.join(' o ')}.`,
        CodigoDeViolacion.ESTADO_INVALIDO,
      );
    }
  }

  // Getter's
  public getId(): string {
    return this.id;
  }

  public getNumeroOrden(): string {
    return this.numeroOrden;
  }

  public getDescripcion(): string {
    return this.descripcion;
  }

  public getEstado(): EstadosActividades {
    return this.estado;
  }

  public getTipo(): TipoSubActividad {
    return this.tipo;
  }

  public getFechaInicio(): Date {
    return this.fechaInicio;
  }

  public getFechaConclusionEstimada(): Date {
    return this.fechaTermino;
  }

  public getFechaEnvio(): Date | null {
    return this.fechaEnvio;
  }

  public getObservaciones(): string | null {
    return this.mensajeResolucion;
  }

  public getBancoSubActividadId(): string | null {
    return this.bancoSubActividadId;
  }

  public calcularSemanasTotales(): number {
    const milisegundos =
      this.fechaTermino.getTime() - this.fechaInicio.getTime();
    const dias = Math.ceil(milisegundos / (1000 * 60 * 60 * 24));
    const semanas = Math.ceil(dias / 7);

    return semanas > 0 ? semanas : 1;
  }

  /**
   * El permiso necesario para hacer las transiciones de estados en las subactividades es el siguiente:
   * Permisos.GESTIONAR_SUBACTIVIDADES
   */

  public solicitarArranque(actorActual: Actor, fechaInicio: Date): void {
    //Se tiene que tener el esatado SIN_EMPEZAR para pasar a SOLICITADO
    this.validarEstadoInicial([EstadosActividades.SIN_EMPEZAR]);

    const logAccion = `Pasar de ${this.estado} a ${EstadosActividades.SOLICITADO}`;
    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_TRABAJO_SUBACTIVIDADES,
      logAccion,
    );

    // Actualizar el estado
    this.estado = EstadosActividades.SOLICITADO;
    this.fechaEnvio = fechaInicio;
  }

  /**
   * Permiso Necesario: Permisos.GESTIONAR_SUPERVISION_SUBACTIVIDADES
   */
  public habilitarProgreso(actorActual: Actor): void {
    //Se tiene que tener el estado SOLICITADO para pasar a EN_PROGRESO
    this.validarEstadoInicial([EstadosActividades.SOLICITADO]);

    const logAccion = `Pasar de ${this.estado} a ${EstadosActividades.EN_PROGRESO}`;

    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_SUPERVISION_SUBACTIVIDADES,
      logAccion,
    );

    // Actualizar el estado
    this.estado = EstadosActividades.EN_PROGRESO;
  }

  /**
   * Permiso Necesario: Permisos.GESTIONAR_TRABAJO_SUBACTIVIDADES
   */

  public enviarARevision(actorActual: Actor, fechaReal: Date): void {
    // Se tiene que tener el estado EN_PROGRESO o DEVUELTA para pasar a EN_REVISION
    this.validarEstadoInicial([
      EstadosActividades.EN_PROGRESO,
      EstadosActividades.DEVUELTA,
    ]);

    const logAccion = `Pasar de ${this.estado} a ${EstadosActividades.EN_REVISION}`;

    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_TRABAJO_SUBACTIVIDADES,
      logAccion,
    );
    // Actualizar el estado
    this.estado = EstadosActividades.EN_REVISION;
    this.fechaEnvio = fechaReal;
  }

  /**
   *
   * Permiso Necesario: Permisos.GESTIONAR_SUPERVISION_SUBACTIVIDADES
   */
  public devolver(actorActual: Actor, retroalimentacion: string | null): void {
    // Se tiene que tener el estado EN_REVISION para poner a DEVUELTO
    this.validarEstadoInicial([EstadosActividades.EN_REVISION]);

    const logAccion = `Pasar de ${this.estado} a ${EstadosActividades.DEVUELTA}`;
    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_SUPERVISION_SUBACTIVIDADES,
      logAccion,
    );

    // Se tiene que tener algo en la observación
    if (retroalimentacion === null || retroalimentacion.length === 0) {
      throw new ReglaNegocioException(
        `La justificación de la devolución no debe estar vacía`,
        CodigoDeViolacion.DATOS_INSUFICIENTES,
      );
    }

    //actualizar el estado
    this.estado = EstadosActividades.DEVUELTA;
    this.mensajeResolucion = retroalimentacion;
  }

  /**
   * Permiso Necesario: Permisos.GESTIONAR_SUPERVISION_SUBACTIVIDADES
   */
  public concluir(actorActual: Actor): void {
    //Se tiene que ponerH
    this.validarEstadoInicial([EstadosActividades.EN_REVISION]);

    const logAccion = `Pasar de ${this.estado} a ${EstadosActividades.CONCLUIDA}`;
    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_SUPERVISION_SUBACTIVIDADES,
      logAccion,
    );

    // Actualizar el estado
    this.estado = EstadosActividades.CONCLUIDA;
  }

  // src/domain/actividad/subactividad.entity.ts
  public actualizarDatosBase(
    numeroOrden: string,
    descripcion: string,
    fechaInicio: Date,
    fechaTermino: Date,
    tipo: TipoSubActividad,
    bancoActividadId: string | null,
  ): void {
    this.numeroOrden = numeroOrden;
    this.descripcion = descripcion;
    this.fechaInicio = fechaInicio;
    this.fechaTermino = fechaTermino;
    this.tipo = tipo;
    this.bancoSubActividadId = bancoActividadId;
  }
}
