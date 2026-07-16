import { SubactividadEntity } from '@domain/subactividades/subactividad.entity';
import { EstadosActividades } from './estados-actividades.enum';
import { BadRequestException } from '@nestjs/common'; //Cambiar por Excepción de Regla de Negocio cuando esté lista

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

  // FUNCIONES AUXILIARES (PRIVADAS)

  private validarCampos(): string {
    const camposVacios: string[] = [];

    // Validamos de forma explícita solo lo que es vital para la Ficha Técnica

    //Mapeo Explícito de los atributos
    const camposRequeridos = [
      { nombre: 'Descripción', valor: this.descripcion },
      { nombre: 'Justificación', valor: this.justificacion },
      { nombre: 'Objetivo General', valor: this.objetivo_general },
      { nombre: 'Objetivos Particulares', valor: this.objetivos_particulares },
      { nombre: 'Meta del Proyecto', valor: this.meta_del_proyecto },
      { nombre: 'Indicadores', valor: this.indicadores },
    ];

    // Buscamos si alguno de ellos está vacío
    camposRequeridos.forEach((campo) => {
      if (!campo.valor || campo.valor.trim() === '') {
        camposVacios.push(campo.nombre);
      }
    });

    if (camposVacios.length > 0) {
      return `Ficha Técnica incompleta. Faltan los siguientes campos: ${camposVacios.join(', ')}`;
    }
    return '';
  }

  private validarFechasTerminoSubActividades(): string {
    // Verificamos que ninguna fecha de término de las sub-actividades esté más lejana que la fecha de terminación que se estableció de su actividad Principal
    const subActividadesInvalidas = this.subActividades.filter(
      (subActividad) => {
        const fechaTerminoSub = subActividad.getFechaConclusion();
        if (!fechaTerminoSub) return false;

        return fechaTerminoSub.getTime() > this.fecha_termino.getTime();
      },
    );

    if (subActividadesInvalidas.length > 0) {
      const ids = subActividadesInvalidas.map((sub) => sub.getId()).join(', ');
      return `Las siguientes sub-actividades superan la fecha de término del proyecto: [${ids}]`;
    }
    return '';
  }

  // Getter's

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

  // Typo corregido
  public getFechaTermino(): Date {
    return this.fecha_termino;
  }

  // Protegemos la inmutabilidad de la entidad devolviendo copias de los arreglos
  public getAuditoresIds(): string[] {
    return [...this.auditoresIds];
  }
  public getSubActividades(): SubactividadEntity[] {
    return [...this.subActividades];
  }

  // MANEJO DE COLECCIONES (FAIL-FAST)

  public agregarSubActividad(subActividad: SubactividadEntity): void {
    // Buscamos si se está intentando agregar una sub-actividad repetida
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
    // No permitimos IDs vacíos
    if (!auditorId || auditorId.trim() === '') {
      throw new BadRequestException(`El ID de auditor está vacío`);
    }
    if (!this.auditoresIds.includes(auditorId)) {
      this.auditoresIds.push(auditorId);
    }
  }

  public removerAuditor(auditorId: string): void {
    this.auditoresIds = this.auditoresIds.filter((id) => id !== auditorId);
  }

  // REGLAS DE NEGOCIO E INTEGRIDAD

  public validarIntegridad(): string[] {
    const errores: string[] = [];

    // Regla 1: Campos obligatorios
    const errorCampos = this.validarCampos();
    if (errorCampos) errores.push(errorCampos);

    // Regla 2: Mínimo 1 sub-actividad
    if (this.subActividades.length === 0) {
      errores.push(
        'La Actividad Principal debe tener al menos 1 sub-actividad.',
      );
    }

    // Regla 3: Coherencia de Fechas
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
}
