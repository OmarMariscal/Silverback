import { SubactividadEntity } from '@domain/actividad/subactividad.entity';
import { EstadosActividades } from './estados-actividades.enum';
import { ReglaNegocioException } from '@domain/excepciones/regla-negocio.exception';
import { CodigoDeViolacion } from '@domain/codigos/codigo-violado.enum';
import { Actor } from '@domain/roles/actor.interface';
import { Permisos } from '@domain/roles/permisos.enum';
import { validarPermisoDeDominio } from '@domain/shared/utils/autorizacion.utils';

export class ActividadEntity {
  constructor(
    private readonly id: string,
    private readonly folio: string,
    private readonly titulo: string,
    private readonly justificacion: string | null,
    private readonly objetivoGeneral: string | null,
    private readonly objetivosParticulares: string | null,
    private readonly metaDelProyecto: string | null,
    private readonly indicadores: string | null,
    private fechaInicio: Date | null,
    private fechaTermino: Date | null,
    private readonly esRezago: boolean,

    private auditoresIds: string[],
    private subActividades: SubactividadEntity[],

    private readonly bancoActividadId: string | null = null,
  ) {}

  // FUNCIONES AUXILIARES (PRIVADAS)
  private validarCamposTextuales(): ReglaNegocioException | null {
    const camposVacios: string[] = [];
    const camposRequeridos = [
      { nombre: 'Titulo', valor: this.titulo },
      { nombre: 'Justificación', valor: this.justificacion },
      { nombre: 'Objetivo General', valor: this.objetivoGeneral },
      { nombre: 'Objetivos Particulares', valor: this.objetivosParticulares },
      { nombre: 'Meta del Proyecto', valor: this.metaDelProyecto },
      { nombre: 'Indicadores', valor: this.indicadores },
    ];

    camposRequeridos.forEach((campo) => {
      if (
        !campo.valor ||
        (typeof campo.valor === 'string' && campo.valor.trim() === '')
      ) {
        camposVacios.push(campo.nombre);
      }
    });

    if (camposVacios.length > 0) {
      return new ReglaNegocioException(
        `Textos incompletos. Faltan los siguientes campos: ${camposVacios.join(', ')}`,
        CodigoDeViolacion.DATOS_INSUFICIENTES,
      );
    }
    return null;
  }

  private validarFechas(): ReglaNegocioException | null {
    if (!this.fechaInicio || !this.fechaTermino) {
      return new ReglaNegocioException(
        `Faltan fechas asignadas. Se requiere Fecha de Inicio y Fecha de Término.`,
        CodigoDeViolacion.DATOS_INSUFICIENTES,
      );
    }
    return null;
  }

  private validarFechasTerminoSubActividades(): ReglaNegocioException | null {
    const subActividadesInvalidas = this.subActividades.filter(
      (subActividad) => {
        const fechaTerminoSub = subActividad.getFechaConclusionEstimada();
        if (!fechaTerminoSub) return false;
        if (!this.fechaTermino) return false;

        return fechaTerminoSub.getTime() > this.fechaTermino.getTime();
      },
    );

    if (subActividadesInvalidas.length > 0) {
      const ids = subActividadesInvalidas.map((sub) => sub.getId()).join(', ');
      return new ReglaNegocioException(
        `Las siguientes sub-actividades superan la fecha de término del proyecto: [${ids}]`,
        CodigoDeViolacion.FECHA_INVALIDA,
      );
    }
    return null;
  }

  private recalcularFechasBounds(): void {
    if (this.subActividades.length === 0) {
      // Si no hay sub-actividades, el proyecto vuelve a no tener fechas
      this.fechaInicio = null;
      this.fechaTermino = null;
      return;
    }

    // Usamos la primera sub-actividad como punto de partida
    let minFecha = this.subActividades[0].getFechaInicio();
    let maxFecha = this.subActividades[0].getFechaConclusionEstimada();

    // Iteramos para encontrar la fecha más antigua y la más lejana
    for (const sub of this.subActividades) {
      if (sub.getFechaInicio().getTime() < minFecha.getTime()) {
        minFecha = sub.getFechaInicio();
      }
      if (sub.getFechaConclusionEstimada().getTime() > maxFecha.getTime()) {
        maxFecha = sub.getFechaConclusionEstimada();
      }
    }

    this.fechaInicio = minFecha;
    this.fechaTermino = maxFecha;
  }

  // Getter's
  public getId(): string {
    return this.id;
  }
  public getFolio(): string {
    return this.folio;
  }
  public getTitulo(): string {
    return this.titulo;
  }
  public getJustificacion(): string | null {
    return this.justificacion;
  }
  public getObjetivoGeneral(): string | null {
    return this.objetivoGeneral;
  }
  public getObjetivosParticulares(): string | null {
    return this.objetivosParticulares;
  }
  public getMetaDelProyecto(): string | null {
    return this.metaDelProyecto;
  }
  public getIndicadores(): string | null {
    return this.indicadores;
  }
  public getFechaInicio(): Date | null {
    return this.fechaInicio;
  }
  public getFechaTermino(): Date | null {
    return this.fechaTermino;
  }
  public getEsRezago(): boolean {
    return this.esRezago;
  }
  public getBancoActividadId(): string | null {
    return this.bancoActividadId;
  }
  public getAuditoresIds(): string[] {
    return [...this.auditoresIds];
  }
  public getSubActividades(): SubactividadEntity[] {
    return [...this.subActividades];
  }

  // MANEJO DE COLECCIONES (FAIL-FAST) CON SEGURIDAD AÑADIDA

  public agregarSubActividad(
    actorActual: Actor,
    subActividad: SubactividadEntity,
  ): void {
    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_CONTENIDO_POA,
      `agregar una sub-actividad a la Ficha Técnica`,
    );

    const repetida = this.subActividades.some(
      (sub) => sub.getId() === subActividad.getId(),
    );
    if (repetida) {
      throw new ReglaNegocioException(
        `La sub-actividad de ID ${subActividad.getId()} ya pertenece a esta actividad`,
        CodigoDeViolacion.ENTIDAD_REPETIDA,
      );
    }

    //Agregar SubActividad
    this.subActividades.push(subActividad);
    //Actualizar Fechas de INicio/Término
    this.recalcularFechasBounds();
  }

  public eliminarSubActividad(
    actorActual: Actor,
    subActividadId: string,
  ): void {
    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_CONTENIDO_POA,
      `eliminar una sub-actividad de la Ficha Técnica`,
    );

    this.subActividades = this.subActividades.filter(
      (sub) => sub.getId() != subActividadId,
    );
    //actualizar fechas
    this.recalcularFechasBounds();
  }

  public asignarAuditor(actorActual: Actor, auditorId: string): void {
    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_CONTENIDO_POA,
      `asignar un auditor a la actividad`,
    );

    if (!auditorId || auditorId.trim() === '') {
      throw new ReglaNegocioException(
        `El ID de auditor está vacío`,
        CodigoDeViolacion.DATOS_INSUFICIENTES,
      );
    }
    if (!this.auditoresIds.includes(auditorId)) {
      this.auditoresIds.push(auditorId);
    }
  }

  public removerAuditor(actorActual: Actor, auditorId: string): void {
    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_CONTENIDO_POA,
      `remover un auditor de la actividad`,
    );

    this.auditoresIds = this.auditoresIds.filter((id) => id !== auditorId);
  }

  // REGLAS DE NEGOCIO E INTEGRIDAD

  public validarCreacionBorrador(): void {
    const erroresTextos = this.validarCamposTextuales();
    if (erroresTextos) {
      throw erroresTextos;
    }
  }

  public validarIntegridad(): ReglaNegocioException[] {
    const errores: ReglaNegocioException[] = [];

    // Validar Textos
    const errorCampos = this.validarCamposTextuales();
    if (errorCampos) errores.push(errorCampos);

    // Validar Fechas
    const erroresFechas = this.validarFechas();
    if (erroresFechas) errores.push(erroresFechas);

    // Se tiene que tener al menos una actividad
    if (this.subActividades.length === 0) {
      errores.push(
        new ReglaNegocioException(
          'La Actividad Principal debe tener al menos 1 sub-actividad.',
          CodigoDeViolacion.DATOS_INSUFICIENTES,
        ),
      );
    }

    const errorFechas = this.validarFechasTerminoSubActividades();
    if (errorFechas) errores.push(errorFechas);

    return errores;
  }

  public calcularPorcentajeAvance(): number {
    if (this.subActividades.length === 0) return 0;

    const actividadesConcluidas = this.subActividades.filter(
      (sub) => sub.getEstado() === EstadosActividades.CONCLUIDA,
    ).length;

    const avance = (actividadesConcluidas * 100) / this.subActividades.length;
    return Math.round(avance * 100) / 100;
  }

  public generarNumeroOrdenSubactividad(): string {
    const siguienteIndice = this.subActividades.length + 1;
    const folioNumerico = parseInt(this.folio, 10); // Convierte "03" a 3

    return `${folioNumerico}.${siguienteIndice}`;
  }

  public reemplazarSubActividades(
    actorActual: Actor,
    nuevasSubActividades: SubactividadEntity[],
  ): void {
    // Validar permisos
    validarPermisoDeDominio(
      actorActual,
      Permisos.GESTIONAR_CONTENIDO_POA,
      `Sincronizar sub-actividades`,
    );

    // Asignar la nueva colección que el Service ya procesó
    this.subActividades = nuevasSubActividades;

    // Invariante: Forzamos el recálculo de fechas de inicio/término del proyecto principal
    this.recalcularFechasBounds();
  }

  public formatearNumeroOrdenPorIndice(indice: number): string {
    const folioNumerico = parseInt(this.folio, 10);
    return `${folioNumerico}.${indice}`;
  }
}
