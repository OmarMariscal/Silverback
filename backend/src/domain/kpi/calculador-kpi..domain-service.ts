import { SubactividadEntity } from '@domain/subactividades/subactividad.entity';
import { KpiDistribucionPastel } from './interfaces/kpi-distribucion-pastel.interface';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';

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
}
