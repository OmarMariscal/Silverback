import { SubactividadEntity } from '@domain/subactividades/subactividad.entity';
import { EstadosActividades } from './estados-actividades.enum';
import { BadRequestException } from '@nestjs/common';

export class ActividadEntity {
  constructor(
    private readonly id: string,
    private readonly folio: string,
    private readonly descripcion: string,
    private readonly justificacion: string,
    private readonly objetivo_general: string,
    private readonly objetivos_particulares: string,
    private readonly meta_del_proyecto: string,
    private readonly indicadores: string,
    private readonly fecha_inicio: Date,
    private readonly fecha_termino: Date,

    private auditoresIds: string[],
    private subActividades: SubactividadEntity[],
  ) {}

  //Funciones auxiliares
  private validarCampos(): string {
    const camposVacios: string[] = [];

    for (const [clave, valor] of Object.entries(this)) {
      const estaVacio =
        (typeof valor === 'string' && valor.trim() === '') ||
        (valor instanceof Date && isNaN(valor.getTime())) ||
        valor === null ||
        valor === undefined;

      if (estaVacio) {
        camposVacios.push(clave);
      }
    }

    if (camposVacios.length > 0) {
      return `Ficha Técnica: Los siguientes campos no pueden estar vacíos: ${camposVacios.join(', ')}`;
    }
    return '';
  }

  private validarFechasTerminoSubActividades(): string {
    const subActividadesFechasInvalidas = this.subActividades.filter(
      (subActividad) => {
        const fechaTerminoSub = subActividad.getFechaConclusion();

        if (!fechaTerminoSub) {
          return;
        }

        return (
          new Date(fechaTerminoSub).getTime() >
          new Date(this.fecha_termino).getTime()
        );
      },
    );

    return subActividadesFechasInvalidas.map((sub) => sub.getId()).join(', ');
  }

  //Getter's
  public getId(): string {
    return this.id;
  }

  public getFolio(): string {
    return this.folio;
  }

  public getDescripcion(): string {
    return this.descripcion;
  }

  public getJustificacion(): string {
    return this.justificacion;
  }

  public getObjetivoGeneral(): string {
    return this.objetivo_general;
  }

  public getObjetivosParticulares(): string {
    return this.objetivos_particulares;
  }

  public getMetaDelProyecto(): string {
    return this.meta_del_proyecto;
  }

  public getIndicadores(): string {
    return this.indicadores;
  }

  public getFechaInicio(): Date {
    return this.fecha_inicio;
  }

  public getFechaTerminl(): Date {
    return this.fecha_termino;
  }

  public getAuditoresIds(): string[] {
    return this.auditoresIds;
  }

  public getSubActividades(): SubactividadEntity[] {
    return this.subActividades;
  }

  //Manejo de Sub-Actividades
  public agregarSubActividad(subActividad: SubactividadEntity): void {
    //Validar que la subActividad no este ya en el arreglo antes de agregarla
    const repetida = this.subActividades.some(
      (sub) => sub.getId() === subActividad.getId(),
    );

    if (repetida) {
      throw new BadRequestException(
        `La sub-actividad de ID ${subActividad.getId()} ya pertenece a esta actividad`,
      );
    }

    this.subActividades.push(subActividad);
  }

  public asignarAuditor(auditorId: string): void {
    //Evitar ID's duplicados, IDs vacios o nulos
    if (!auditorId || auditorId.trim() === '') {
      throw new BadRequestException(`El ID de auditor ${auditorId} está vacío`);
    }

    //Incluimos el ID del auditor sólo si no está ya en el arreglo.
    if (!this.auditoresIds.includes(auditorId)) {
      this.auditoresIds.push(auditorId);
    }
  }

  public removerAuditor(auditorId: string): void {
    this.auditoresIds = this.auditoresIds.filter((id) => id !== auditorId);
  }

  /*
  Reglas de Negocio:
  Revisar si la actividad cumple con los requisitos mínimos para ser parte integra de una POA
  */

  public validarIntegridad(): string[] {
    const errores: string[] = [];
    //Regla 1: Valodar que la ficha técnica no tiene espacios faltantes.
    const regla1 = this.validarCampos();
    if (regla1) {
      errores.push(regla1);
    }
    //Regla 2: Una ACtividad Principal debe tener al menos una actividad princiapl
    if (this.subActividades.length === 0) {
      errores.push(
        'La Actividad Principal debe tener al menos 1 sub-actividad',
      );
    }

    //Regla 3: La fecha de conclusión de las sub-actividades no debe ser mayor a la fecha de término de la POA
    const subActividadesFechaTerminoInvalida =
      this.validarFechasTerminoSubActividades();

    if (subActividadesFechaTerminoInvalida) {
      errores.push(subActividadesFechaTerminoInvalida);
    }

    return errores;
  }

  public calcularPorcentajeAvance(): number {
    // Para validar, evitamos errores al incluir un caso base
    if (this.subActividades.length === 0) {
      return 0;
    }

    //Obtener el total de actividades en el estado CONCLUIDA
    const actividadesConcluidas = this.subActividades.filter(
      (subActividad) =>
        subActividad.getEstado() === EstadosActividades.CONCLUIDA,
    ).length;

    // Calcular el avance y redondearlo
    const avance = (actividadesConcluidas * 100) / this.subActividades.length;
    return Math.round(avance * 100) / 100;
  }
}
