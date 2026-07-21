import { SubactividadEntity } from '@domain/subactividades/subactividad.entity';
import { KpiDistribucionPastel } from './interfaces/kpi-distribucion-pastel.interface';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { KpiRiesgoDistribucion } from './interfaces/kpi-distribucion-riesgo.interface';
import { KpiDetalleRiesgo } from './interfaces/kpi-detalle-riesgo.interface';

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
    semaforoService: any, //Camibar por semáforo Service una vez se implemente
  ): KpiRiesgoDistribucion[] {
    throw new Error('Método No Implementado Aún');
  }

  public static obtenerRadarRiesgos(
    subActividades: SubactividadEntity[],
    semaforoService: any, //Cambiar a Semáforo Service una vez se implemente
  ): KpiDetalleRiesgo[] {
    throw new Error('Método no Implementado Aún');
  }
}
