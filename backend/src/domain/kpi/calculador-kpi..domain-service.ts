import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
<<<<<<< HEAD
=======
import { KpiRiesgoDistribucion } from './interfaces/kpi-distribucion-riesgo.interface';
import { KpiDetalleRiesgo } from './interfaces/kpi-detalle-riesgo.interface';
import { SemaforoService } from '@domain/semaforo/semaforo-service';
>>>>>>> 1f9c507 (fix(backend): Adaptación del KPI y Semáforo Service para que trabajen con datos puros y no con entidades por eficiencia)
import { EstadosSemaforo } from '@domain/semaforo/estados-semaforo-enum';
import { SemaforoService } from '@domain/semaforo/semaforo-service';
import { KpiSubActividadPayLoad } from './interfaces/kpi-actividad-payload.interface';
import { KpiBandejaContralorResult } from './interfaces/kpi-bandeja-contralor-result.interface';
import { KpiFlujoResult } from './interfaces/kpi-flujo-result.interface';
import { KpiPendientesJefaturaResult } from './interfaces/kpi-pendientes-jefatura-result.interface';
import { KpiCentroRezagoResult } from './interfaces/kpi-rezago-centro-result.interface';
import { KpiSemaforosResult } from './interfaces/kpi-semaforos-result.interface';

export class CalculadoraKpiService {
  // -- 1. Métricas de Flujo General (Gráfica Distribución) --
  public static calcularFlujo(
    subActividades: KpiSubActividadPayLoad[],
  ): KpiFlujoResult {
    const flujo: KpiFlujoResult = {
      sinEmpezar: 0,
      enProgreso: 0,
      porRevisar: 0,
      concluidas: 0,
      total: subActividades.length,
    };

    for (const sub of subActividades) {
      switch (sub.estado) {
        case EstadosActividades.SIN_EMPEZAR:
        case EstadosActividades.SOLICITADO:
          flujo.sinEmpezar++;
          break;
        case EstadosActividades.EN_PROGRESO:
        case EstadosActividades.DEVUELTA:
          flujo.enProgreso++;
          break;
        case EstadosActividades.EN_REVISION:
          flujo.porRevisar++;
          break;
        case EstadosActividades.CONCLUIDA:
          flujo.concluidas++;
          break;
      }
    }
    return flujo;
  }

<<<<<<< HEAD
  // -- 2. Métricas del Semáforo (Riesgo) --
  public static calcularSemaforos(
    subActividades: KpiSubActividadPayLoad[],
  ): KpiSemaforosResult {
    const semaforos: KpiSemaforosResult = {
      aTiempo: 0,
      alerta: 0,
      critico: 0,
      total: subActividades.length,
    };

    for (const sub of subActividades) {
      if (!sub.fechaTermino) continue;

      // Uso del método auxiliar en lo que se resuelve la lógica de negocio del semáforo
      const color = SemaforoService.calcularSemaforoVencimiento(
        sub.fechaTermino,
      );

      if (color === EstadosSemaforo.A_TIEMPO) semaforos.aTiempo++;
      else if (color === EstadosSemaforo.PRECAUCION) semaforos.alerta++;
      else if (color === EstadosSemaforo.CRITICO) semaforos.critico++;
=======
  public static generarDistribucionPorRiesgo(
    subActividades: SubactividadEntity[],
  ): KpiRiesgoDistribucion[] {
    if (subActividades.length === 0) {
      return [];
    }

    const total = subActividades.length;

    //Agrupamos y contamos
    const conteo = new Map<EstadosSemaforo, number>();

    for (const sub of subActividades) {
      // ✔️ CORRECCIÓN: Pasamos sub.getFechaInicio() en lugar de 'sub'
      const color = SemaforoService.calcularSemaforo(sub.getFechaInicio());
      conteo.set(color, (conteo.get(color) || 0) + 1);
>>>>>>> 1f9c507 (fix(backend): Adaptación del KPI y Semáforo Service para que trabajen con datos puros y no con entidades por eficiencia)
    }
    return semaforos;
  }

<<<<<<< HEAD
  // -- 3. Taqrjetas: BANDEJA CONTRALOR --
  public static calcularBandejaContralor(
    subActividades: KpiSubActividadPayLoad[],
  ): KpiBandejaContralorResult {
    let devueltas = 0;
    let listasEmpezar = 0;

    for (const sub of subActividades) {
      if (sub.estado === EstadosActividades.DEVUELTA) devueltas++;
      if (sub.estado === EstadosActividades.SIN_EMPEZAR) listasEmpezar++;
    }
    return { devueltas, listasEmpezar };
  }
=======
  // ✔️ LIMPIEZA: Quitamos semaforoService de los parámetros, ya que sus métodos son estáticos
  public static obtenerRadarRiesgos(
    subActividades: SubactividadEntity[],
  ): KpiDetalleRiesgo[] {
    if (subActividades.length === 0) {
      return [];
    }

    const resultado: KpiDetalleRiesgo[] = subActividades.map((sub) => ({
      folio: sub.getNumeroOrden(),
      descripcion: sub.getDescripcion(), // Asumo que el getter se llama así o getDescripcionTarea()
      subActividadId: sub.getId(),
      tipoSubActividad: sub.getTipo(),
      fechaLimite: sub.getFechaConclusionEstimada(),

      // ✔️ CORRECCIÓN: Extraemos las fechas específicas para cada cálculo
      estadoSemaforo: SemaforoService.calcularSemaforo(sub.getFechaInicio()),
      etiquetaAlerta: SemaforoService.obtenerEtiquetaVencimiento(
        sub.getFechaConclusionEstimada(),
      ),
    }));
>>>>>>> 1f9c507 (fix(backend): Adaptación del KPI y Semáforo Service para que trabajen con datos puros y no con entidades por eficiencia)

  // -- 4. Tarjetas: PENDIENTES JEFATURA --
  public static calcularPendientesJefatura(
    subActividades: KpiSubActividadPayLoad[],
  ): KpiPendientesJefaturaResult {
    let porRevisar = 0;
    let solicitadas = 0;

    for (const sub of subActividades) {
      if (sub.estado === EstadosActividades.EN_REVISION) porRevisar++;
      if (sub.estado === EstadosActividades.SOLICITADO) solicitadas++;
    }
    return {
      actividadesPorRevisar: porRevisar,
      actividadesSolicitadas: solicitadas,
    };
  }

  // -- 5. Tasa de Solventación --
  public static calcularTasaSolventacion(
    subActividades: KpiSubActividadPayLoad[],
  ): number {
    if (subActividades.length === 0) return 0;

    let concluidas = 0;
    for (const sub of subActividades) {
      if (sub.estado === EstadosActividades.CONCLUIDA) concluidas++;
    }

    return Math.round((concluidas / subActividades.length) * 100);
  }

  // -- 6. Rexago por centros --
  public static calcularRezagoCentros(
    subActividades: KpiSubActividadPayLoad[],
  ): KpiCentroRezagoResult[] {
    const mapaCentros = new Map<string, KpiCentroRezagoResult>();

    for (const sub of subActividades) {
      if (!sub.centroUniversitario) continue;

      const { id, clave, nombre } = sub.centroUniversitario;

      if (!mapaCentros.has(id)) {
        mapaCentros.set(id, {
          centro_id: id,
          centro_clave: clave,
          centro_nombre: nombre,
          distribucion: {
            actividades_criticas: 0,
            actividades_precaucion: 0,
            total: 0,
          },
        });
      }

      const centro = mapaCentros.get(id)!;
      centro.distribucion.total++;

      if (sub.fechaTermino) {
        const color = SemaforoService.calcularSemaforoVencimiento(
          sub.fechaTermino,
        );
        if (color === EstadosSemaforo.CRITICO) {
          centro.distribucion.actividades_criticas++;
        } else if (color === EstadosSemaforo.PRECAUCION) {
          centro.distribucion.actividades_precaucion++;
        }
      }
    }

    return Array.from(mapaCentros.values());
  }

  public static calcularTendenciaMensual(
    tasaActual: number,
    tasaMesAnterior: number,
  ): string {
    const diferencia = tasaActual - tasaMesAnterior;

    if (diferencia > 0) return `+${diferencia}%`;
    if (diferencia < 0) return `${diferencia}%`;
    return '0%';
  }
}
