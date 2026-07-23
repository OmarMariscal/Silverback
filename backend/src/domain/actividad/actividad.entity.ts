import { SubactividadEntity } from '@domain/actividad/subactividad.entity';
import { EstadosActividades } from './estados-actividades.enum';
import { BadRequestException } from '@nestjs/common'; //Cambiar por Excepción de Regla de Negocio cuando esté lista

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
    private readonly fechaInicio: Date | null,
    private readonly fechaTermino: Date | null,
    private readonly esRezago: boolean,

    private auditoresIds: string[],
    private subActividades: SubactividadEntity[],

    private readonly bancoActividadId: string | null = null,
  ) {}

  // FUNCIONES AUXILIARES (PRIVADAS)
  private validarCampos(): string {
    const camposVacios: string[] = [];

    // Validamos de forma explícita solo lo que es vital para la Ficha Técnica

    //Mapeo Explícito de los atributos
    const camposRequeridos = [
      { nombre: 'Titulo', valor: this.titulo },
      { nombre: 'Justificación', valor: this.justificacion },
      { nombre: 'Objetivo General', valor: this.objetivoGeneral },
      { nombre: 'Objetivos Particulares', valor: this.objetivosParticulares },
      { nombre: 'Meta del Proyecto', valor: this.metaDelProyecto },
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

  public eliminarSubActividad(subActividadId: string): void {
    this.subActividades = this.subActividades.filter(
      (sub) => sub.getId() != subActividadId,
    );
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
