import { SubactividadEntity } from '@domain/actividad/subactividad.entity';
import { KpiDistribucionPastel } from './interfaces/kpi-distribucion-pastel.interface';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { KpiRiesgoDistribucion } from './interfaces/kpi-distribucion-riesgo.interface';
import { KpiDetalleRiesgo } from './interfaces/kpi-detalle-riesgo.interface';
import {  SemaforoService } from '@domain/semaforo/semaforo.service';
import { EstadosSemaforo } from '@domain/semaforo/estados-semaforo-enum';

export class CalculadoraKpiService {
  public static generarDistribucionEstados(
    subActividades: SubactividadEntity[],
  ): KpiDistribucionPastel[] {
    //KPI 1: Gráfica de Pastel

    //Evitar división entre 0
    if (subActividades.length === 0) {
      return [];
    }

    const total = subActividades.length;

    //Agrupamos y contamos
    const conteo = new Map<EstadosActividades, number>();

    for (const sub of subActividades) {
      const estado = sub.getEstado();
      conteo.set(estado, (conteo.get(estado) || 0) + 1);
    }

    // Mapeamos el formato de vector estructurado
    const resultado: KpiDistribucionPastel[] = [];

    conteo.forEach((cantidad, estado) => {
      const porcentajeRaw = (cantidad / total) * 100;
      resultado.push({
        estado: estado,
        cantidad: cantidad,
        porcentaje: Math.round(porcentajeRaw * 100) / 100,
      });
    });

    return resultado;
  }

  //Firma de métodos que necesitan la clase del semáforo
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
      const color = SemaforoService.calcularSemaforo(sub);
      conteo.set(color, (conteo.get(color) || 0) + 1);
    }

    // Mapeamos el formato de vector estructurado
    const resultado: KpiRiesgoDistribucion[] = [];

    conteo.forEach((cantidad, color) => {
      const porcentajeRaw = (cantidad / total) * 100;
      resultado.push({
        color: color,
        cantidad: cantidad,
        porcentaje: Math.round(porcentajeRaw * 100) / 100,
      });
    });

    return resultado;
  }
   

  public static obtenerRadarRiesgos(
    subActividades: SubactividadEntity[],
    semaforoService: SemaforoService, //Cambiar a Semáforo Service una vez se implemente
  ): KpiDetalleRiesgo[] {
    if (subActividades.length === 0) {
      return [];
    }
    
    const resultado: KpiDetalleRiesgo[] = subActividades
    .map(sub => ({
      folio: sub.getNumeroOrden(),
      descripcion: sub.getDescripcion(),
      subActividadId: sub.getId(),
      tipoSubActividad: sub.getTipo(),
      fechaLimite: sub.getFechaConclusionEstimada(),
      estadoSemaforo: SemaforoService.calcularSemaforo(sub),
      etiquetaAlerta: SemaforoService.obtenerEtiquetaVencimiento(sub)
    }));

    return resultado;
  }
}
