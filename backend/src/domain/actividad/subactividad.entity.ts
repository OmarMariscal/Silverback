import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';
import { Actor } from '@domain/roles/actor.interface';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { ReglaNegocioException } from '@domain/excepciones/regla-negocio.exception';
import { CodigoDeViolacion } from '@domain/codigos/codigo-violado.enum';
import { Permisos } from '@domain/roles/permisos.enum';
import { Roles } from '@domain/roles/roles.enum';
import { EstadosPoa } from '@domain/poa/estados-poa.enum';
import { validarPermisoDeDominio } from '@domain/shared/utils/autorizacion.utils';
import { EvidenciaEntity } from './evidencia.entity';
import { EntregaSubActividadEntity } from './entrega-subactividad.entity';
import { EstadosArchivoEvidencia } from './estados-archivo-evidencia.enum';
import { EstadosDictamen } from './estados-dictamen.enum';
import {
  construirObjectKeyEvidencia,
  sanitizarNombreArchivo,
  validarMetadatosArchivo,
} from './utils/reglas-archivo.util';
import { ContextoEjecucionSubActividad } from './interfaces/contexto-ejecucion-subactividad.interface';
import { RegistrarIntencionEvidenciaParams } from './interfaces/registrar-intencion-evidencia-params.interface';
import { ConsolidarEntregaParams } from './interfaces/consolidar-entrega-params.interface';
import { ConsolidarEntregaResult } from './interfaces/consolidar-entrega-result.interface';

export class SubactividadEntity {
  private indiceOrden: number;

  // Contexto de seguridad y ejecución (hidratado cuando opera como Agregado Raíz)
  private poaEstado?: EstadosPoa;
  private idUsuarioDuenoPoa?: string;
  private idUsuarioJefaAsignada?: string;
  private auditoresUsuariosIds: string[] = [];
  private centroClave?: string;
  private ultimaVersionEntrega: number = 0;
  private contextoEjecucionCargado: boolean = false;

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
    private anioFiscal?: number,
  ) {
    this.indiceOrden = this.calcularIndiceOrden(this.numeroOrden);
  }

  private calcularIndiceOrden(orden: string): number {
    if (!orden) return 0;
    const partes = orden.split('.');
    const mayor = parseInt(partes[0] || '0', 10);
    const menor = parseInt(partes[1] || '0', 10);
    return (isNaN(mayor) ? 0 : mayor * 1000) + (isNaN(menor) ? 0 : menor);
  }

  private validarEstadoInicial(estadoInicial: EstadosActividades[]): void {
    if (!estadoInicial.includes(this.estado)) {
      throw new ReglaNegocioException(
        `Operación inválida. La sub-actividad está en ${this.estado}, pero requiere estar en: ${estadoInicial.join(' o ')}.`,
        CodigoDeViolacion.ESTADO_INVALIDO,
      );
    }
  }

  private validarAnioFiscal(fechaInicio: Date, fechaTermino: Date): void {
    if (this.anioFiscal === undefined) {
      return;
    }

    const anioInicio = fechaInicio.getFullYear();
    const anioTermino = fechaTermino.getFullYear();

    if (anioInicio !== this.anioFiscal || anioTermino !== this.anioFiscal) {
      throw new ReglaNegocioException(
        `Las fechas de la sub-actividad deben estar dentro del anio fiscal operativo ${this.anioFiscal}. Inicio: ${anioInicio}, Termino: ${anioTermino}.`,
        CodigoDeViolacion.FECHA_INVALIDA,
      );
    }
  }

  /**
   * Valida que el POA sea Ley Operativa (AUTORIZADA) y que el actor tenga jurisdicción
   * sobre el centro universitario / actividad (Protección IDOR).
   */
  private validarTenenciaEjecucion(
    actorActual: Actor,
    idUsuarioActual: string,
  ): void {
    if (!this.contextoEjecucionCargado) {
      throw new Error(
        'Se intentó evaluar autorización en SubactividadEntity sin haber inyectado primero el contexto de ejecución.',
      );
    }

    if (this.poaEstado !== EstadosPoa.AUTORIZADA) {
      throw new ReglaNegocioException(
        `No es posible operar sobre la sub-actividad porque el POA al que pertenece no está AUTORIZADO (estado actual: ${this.poaEstado}).`,
        CodigoDeViolacion.ESTADO_INVALIDO,
      );
    }

    if (actorActual.rol === Roles.CONTRALOR) {
      if (this.idUsuarioDuenoPoa !== idUsuarioActual) {
        throw new ReglaNegocioException(
          'Acceso denegado: La sub-actividad pertenece a otro Centro Universitario.',
          CodigoDeViolacion.ACCESO_DENEGADO,
        );
      }
      return;
    }

    // Soporte para delegación futura de permisos a Auditores asignados a la actividad padre
    if (actorActual.rol === Roles.AUDITOR) {
      if (!this.auditoresUsuariosIds.includes(idUsuarioActual)) {
        throw new ReglaNegocioException(
          'Acceso denegado: El auditor no está asignado a la actividad de esta sub-actividad.',
          CodigoDeViolacion.ACCESO_DENEGADO,
        );
      }
      return;
    }

    if (actorActual.rol === Roles.JEFA) {
      if (this.idUsuarioJefaAsignada !== idUsuarioActual) {
        throw new ReglaNegocioException(
          'Acceso denegado: La Jefatura no tiene jurisdicción sobre el Centro Universitario de esta sub-actividad.',
          CodigoDeViolacion.ACCESO_DENEGADO,
        );
      }
      return;
    }

    throw new ReglaNegocioException(
      `El rol ${String(actorActual.rol)} no tiene autorización operativa sobre esta sub-actividad.`,
      CodigoDeViolacion.ROL_INVALIDO,
    );
  }

  // Getters
  public getId(): string {
    return this.id;
  }
  public getNumeroOrden(): string {
    return this.numeroOrden;
  }
  public getIndiceOrden(): number {
    return this.indiceOrden;
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
  public getAnioFiscal(): number | undefined {
    return this.anioFiscal;
  }
  public getCentroClave(): string | undefined {
    return this.centroClave;
  }
  public getUltimaVersionEntrega(): number {
    return this.ultimaVersionEntrega;
  }

  public inyectarAnioFiscal(anioFiscal: number): void {
    this.anioFiscal = anioFiscal;
  }

  /**
   * Calcula de forma determinista el número de versión de la próxima entrega.
   * Garantiza consistencia entre la pre-asignación del prefijo S3 y la consolidación de la entrega.
   */
  public calcularProximaVersionEntrega(): number {
    return this.ultimaVersionEntrega + 1;
  }

  public inyectarContextoEjecucion(
    contexto: ContextoEjecucionSubActividad,
  ): void {
    this.poaEstado = contexto.poaEstado;
    this.idUsuarioDuenoPoa = contexto.idUsuarioContralor ?? undefined;
    this.idUsuarioJefaAsignada = contexto.idUsuarioJefa ?? undefined;
    this.auditoresUsuariosIds = [...contexto.auditoresUsuariosIds];
    this.centroClave = contexto.centroClave;
    this.anioFiscal = contexto.anioFiscal;
    this.ultimaVersionEntrega = contexto.ultimaVersionEntrega;
    this.contextoEjecucionCargado = true;
  }

  public calcularSemanasTotales(): number {
    const milisegundos =
      this.fechaTermino.getTime() - this.fechaInicio.getTime();
    const dias = Math.ceil(milisegundos / (1000 * 60 * 60 * 24));
    const semanas = Math.ceil(dias / 7);

    return semanas > 0 ? semanas : 1;
  }

  // FLUJO TRANSACCIONAL DE EVIDENCIAS Y ENVÍO A REVISIÓN (US_02)

  /**
   * 1. Valida e instancia una intención de subida de archivo (Pre-firma) en estado PENDIENTE.
   */
  public registrarIntencionCargaEvidencia(
    actorActual: Actor,
    idUsuarioActual: string,
    params: RegistrarIntencionEvidenciaParams,
  ): EvidenciaEntity {
    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_TRABAJO_SUBACTIVIDADES,
      'solicitar pre-firma de carga de evidencia',
    );
    this.validarTenenciaEjecucion(actorActual, idUsuarioActual);
    this.validarEstadoInicial([
      EstadosActividades.EN_PROGRESO,
      EstadosActividades.DEVUELTA,
    ]);

    validarMetadatosArchivo(
      params.nombreOriginal,
      params.mimeType,
      params.pesoBytes,
    );

    const nombreSanitizado = sanitizarNombreArchivo(params.nombreOriginal);
    const versionDestino = this.calcularProximaVersionEntrega();

    // Estructura jerárquica limpia en el almacenamiento de objetos
    const objectKey = construirObjectKeyEvidencia({
      centroClave: this.centroClave ?? 'general',
      anioFiscal: this.anioFiscal ?? new Date().getFullYear(),
      subActividadId: this.id,
      versionDestino,
      archivoId: params.archivoId,
      nombreSanitizado,
    });
    return new EvidenciaEntity(
      params.archivoId,
      this.id,
      null,
      nombreSanitizado,
      objectKey,
      params.pesoBytes,
      params.mimeType.trim().toLowerCase(),
      EstadosArchivoEvidencia.PENDIENTE,
      new Date(),
    );
  }

  /**
   * 2. Confirma que una evidencia subida al almacenamiento pase a estado BORRADOR en el buzón.
   */
  public confirmarEvidenciaSubida(
    actorActual: Actor,
    idUsuarioActual: string,
    evidencia: EvidenciaEntity,
    pesoFisicoBytes?: number,
  ): void {
    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_TRABAJO_SUBACTIVIDADES,
      'confirmar subida de archivo de evidencia',
    );
    this.validarTenenciaEjecucion(actorActual, idUsuarioActual);
    this.validarEstadoInicial([
      EstadosActividades.EN_PROGRESO,
      EstadosActividades.DEVUELTA,
    ]);

    if (evidencia.getSubActividadId() !== this.id) {
      throw new ReglaNegocioException(
        `El archivo de evidencia ${evidencia.getId()} no pertenece a la sub-actividad ${this.id}.`,
        CodigoDeViolacion.ACCESO_DENEGADO,
      );
    }

    evidencia.confirmarCarga(pesoFisicoBytes);
  }

  /**
   * 3. Valida que un archivo pueda ser eliminado del buzón de evidencias.
   */
  public validarEliminacionEvidencia(
    actorActual: Actor,
    idUsuarioActual: string,
    evidencia: EvidenciaEntity,
  ): void {
    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_TRABAJO_SUBACTIVIDADES,
      'eliminar archivo del buzón de evidencias',
    );
    this.validarTenenciaEjecucion(actorActual, idUsuarioActual);
    this.validarEstadoInicial([
      EstadosActividades.EN_PROGRESO,
      EstadosActividades.DEVUELTA,
    ]);

    if (evidencia.getSubActividadId() !== this.id) {
      throw new ReglaNegocioException(
        `El archivo de evidencia ${evidencia.getId()} no pertenece a la sub-actividad ${this.id}.`,
        CodigoDeViolacion.ACCESO_DENEGADO,
      );
    }

    evidencia.validarEliminacion();
  }

  /**
   * 4. Empaqueta las evidencias en BORRADOR dentro de una nueva EntregaSubActividad,
   * incrementa la versión y cambia el estado de la SubActividad a EN_REVISION.
   */
  public consolidarEntregaARevision(
    actorActual: Actor,
    idUsuarioActual: string,
    params: ConsolidarEntregaParams,
  ): ConsolidarEntregaResult {
    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_TRABAJO_SUBACTIVIDADES,
      'enviar sub-actividad a revisión de Jefatura',
    );
    this.validarTenenciaEjecucion(actorActual, idUsuarioActual);
    this.validarEstadoInicial([
      EstadosActividades.EN_PROGRESO,
      EstadosActividades.DEVUELTA,
    ]);

    const mapaBorradores = new Map(
      params.evidenciasEnBorrador.map((ev) => [ev.getId(), ev]),
    );

    let evidenciasAConsolidar: EvidenciaEntity[] = [];
    let evidenciasDescartadas: EvidenciaEntity[] = [];

    if (
      params.evidenciasIdsSeleccionados &&
      params.evidenciasIdsSeleccionados.length > 0
    ) {
      const idsUnicos = Array.from(new Set(params.evidenciasIdsSeleccionados));

      for (const idSolicitado of idsUnicos) {
        const encontrada = mapaBorradores.get(idSolicitado);
        if (!encontrada) {
          throw new ReglaNegocioException(
            `El archivo con ID '${idSolicitado}' no existe en el buzón de borradores confirmados de esta sub-actividad.`,
            CodigoDeViolacion.DATOS_INSUFICIENTES,
          );
        }
        evidenciasAConsolidar.push(encontrada);
      }

      const setSeleccionados = new Set(idsUnicos);
      evidenciasDescartadas = params.evidenciasEnBorrador.filter(
        (ev) => !setSeleccionados.has(ev.getId()),
      );
    } else {
      evidenciasAConsolidar = [...params.evidenciasEnBorrador];
    }

    if (evidenciasAConsolidar.length === 0) {
      throw new ReglaNegocioException(
        'Debe adjuntar y confirmar al menos 1 archivo de evidencia en el buzón antes de enviar la sub-actividad a revisión.',
        CodigoDeViolacion.DATOS_INSUFICIENTES,
      );
    }

    const fechaRealEnvio = params.fechaEnvio ?? new Date();
    const nuevaVersion = this.calcularProximaVersionEntrega();

    for (const evidencia of evidenciasAConsolidar) {
      evidencia.consolidarEnEntrega(params.entregaId);
    }

    const nuevaEntrega = new EntregaSubActividadEntity(
      params.entregaId,
      this.id,
      nuevaVersion,
      EstadosDictamen.EN_REVISION,
      params.comentariosEntrega?.trim() || null,
      fechaRealEnvio,
      null,
    );

    this.ultimaVersionEntrega = nuevaVersion;
    this.estado = EstadosActividades.EN_REVISION;
    this.fechaEnvio = fechaRealEnvio;

    return {
      entrega: nuevaEntrega,
      evidenciasConsolidadas: evidenciasAConsolidar,
      evidenciasDescartadas,
    };
  }

  /**
   * 5. Valida permisos de lectura/descarga de evidencias (Para Contralor, Auditor y Jefatura).
   */
  public validarAccesoLecturaEvidencia(
    actorActual: Actor,
    idUsuarioActual: string,
  ): void {
    this.validarTenenciaEjecucion(actorActual, idUsuarioActual);
  }

  // MÉTODOS DE MÁQUINA DE ESTADOS EXISTENTES

  public solicitarArranque(actorActual: Actor, fechaInicio: Date): void {
    this.validarEstadoInicial([EstadosActividades.SIN_EMPEZAR]);

    const logAccion = `Pasar de ${this.estado} a ${EstadosActividades.SOLICITADO}`;
    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_TRABAJO_SUBACTIVIDADES,
      logAccion,
    );

    this.estado = EstadosActividades.SOLICITADO;
    this.fechaEnvio = fechaInicio;
  }

  public habilitarProgreso(actorActual: Actor): void {
    this.validarEstadoInicial([EstadosActividades.SOLICITADO]);

    const logAccion = `Pasar de ${this.estado} a ${EstadosActividades.EN_PROGRESO}`;
    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_SUPERVISION_SUBACTIVIDADES,
      logAccion,
    );

    this.estado = EstadosActividades.EN_PROGRESO;
  }

  public enviarARevision(actorActual: Actor, fechaReal: Date): void {
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

    this.estado = EstadosActividades.EN_REVISION;
    this.fechaEnvio = fechaReal;
  }

  public devolver(actorActual: Actor, retroalimentacion: string | null): void {
    this.validarEstadoInicial([EstadosActividades.EN_REVISION]);

    const logAccion = `Pasar de ${this.estado} a ${EstadosActividades.DEVUELTA}`;
    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_SUPERVISION_SUBACTIVIDADES,
      logAccion,
    );

    if (retroalimentacion === null || retroalimentacion.length === 0) {
      throw new ReglaNegocioException(
        `La justificación de la devolución no debe estar vacía`,
        CodigoDeViolacion.DATOS_INSUFICIENTES,
      );
    }

    this.estado = EstadosActividades.DEVUELTA;
    this.mensajeResolucion = retroalimentacion;
  }

  public concluir(actorActual: Actor): void {
    this.validarEstadoInicial([EstadosActividades.EN_REVISION]);

    const logAccion = `Pasar de ${this.estado} a ${EstadosActividades.CONCLUIDA}`;
    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_SUPERVISION_SUBACTIVIDADES,
      logAccion,
    );

    this.estado = EstadosActividades.CONCLUIDA;
  }

  public actualizarDatosBase(
    numeroOrden: string,
    descripcion: string,
    fechaInicio: Date,
    fechaTermino: Date,
    tipo: TipoSubActividad,
    bancoActividadId: string | null,
  ): void {
    this.validarAnioFiscal(fechaInicio, fechaTermino);

    this.numeroOrden = numeroOrden;
    this.indiceOrden = this.calcularIndiceOrden(numeroOrden);
    this.descripcion = descripcion;
    this.fechaInicio = fechaInicio;
    this.fechaTermino = fechaTermino;
    this.tipo = tipo;
    this.bancoSubActividadId = bancoActividadId;
  }
}
