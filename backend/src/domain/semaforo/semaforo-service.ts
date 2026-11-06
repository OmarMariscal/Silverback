import { EstadosSemaforo } from './estados-semaforo-enum';

export class SemaforoService {
  /**
   * Limpia las horas, minutos y segundos para hacer cálculos exactos de calendario
   */
  private static estandarizarFecha(fecha: Date): Date {
    const nuevaFecha = new Date(fecha.getTime());
    nuevaFecha.setHours(0, 0, 0, 0);
    return nuevaFecha;
  }

  private static calcularDiasHabiles(
    fechaInicio: Date,
    fechaActual: Date = new Date(),
  ): number {
    let dias = 0;
    // Estandarizamos para evitar problemas de horas
    const fechaAuxiliar = this.estandarizarFecha(fechaInicio);
    const limiteActual = this.estandarizarFecha(fechaActual);

    while (fechaAuxiliar <= limiteActual) {
      const diasSemana = fechaAuxiliar.getDay();
      // 0 = Domingo, 6 = Sábado
      if (diasSemana !== 0 && diasSemana !== 6) dias++;
      fechaAuxiliar.setDate(fechaAuxiliar.getDate() + 1);
    }
    return dias;
  }

  public static calcularSemaforo(fechaInicio: Date): EstadosSemaforo {
    const numeroDias = SemaforoService.calcularDiasHabiles(fechaInicio);

    if (numeroDias <= 60) return EstadosSemaforo.A_TIEMPO;
    if (numeroDias <= 90) return EstadosSemaforo.PRECAUCION;
    return EstadosSemaforo.CRITICO;
  }

  static calcularDias(fechaTermino: Date): number {
    const fechaHoy = this.estandarizarFecha(new Date());
    const termino = this.estandarizarFecha(fechaTermino);

    const diferencia = termino.getTime() - fechaHoy.getTime();
    return Math.round(diferencia / (1000 * 60 * 60 * 24));
  }

  public static obtenerEtiquetaVencimiento(fechaTermino: Date): string {
    const fechaHoy = new Date();
    const termino = new Date(fechaTermino);

    let meses = (termino.getFullYear() - fechaHoy.getFullYear()) * 12;
    meses -= fechaHoy.getMonth();
    meses += termino.getMonth();

    if (termino.getDate() < fechaHoy.getDate()) {
      meses--;
    }

    if (meses <= 0) {
      const dias = SemaforoService.calcularDias(termino);

      if (dias < 0) return `Vencido hace ${Math.abs(dias)} días`;
      if (dias === 0) return `Vence hoy`;
      return `Faltan ${dias} días`;
    }

    return `+${meses} meses`;
  }

  // Método auxiliar en lo que se resuelve la regla del negocio del semáforo
  public static calcularSemaforoVencimiento(
    fechaTermino: Date,
  ): EstadosSemaforo {
    const hoy = this.estandarizarFecha(new Date());
    const termino = this.estandarizarFecha(fechaTermino);

    if (hoy > termino) return EstadosSemaforo.CRITICO;

    const diasRestantes = this.calcularDiasHabiles(hoy, termino);
    if (diasRestantes <= 5) return EstadosSemaforo.PRECAUCION;

    return EstadosSemaforo.A_TIEMPO;
  }
}
