import { Injectable, Inject } from '@nestjs/common';
import { 
  DASHBOARD_QUERY_REPOSITORY_TOKEN, 
  GetKpisDashboardQuery 
} from './ports/dashboard-query.repository.interface';
import type { IDashboardQueryRepository } from './ports/dashboard-query.repository.interface';

// Importamos la calculadora matemática estática de la capa de dominio
import { CalculadoraKpiService } from '@domain/kpi/calculador-kpi..domain-service'; 

@Injectable()
export class DashboardService {
  constructor(
    @Inject(DASHBOARD_QUERY_REPOSITORY_TOKEN)
    private readonly dashboardQueryRepo: IDashboardQueryRepository,
  ) {}

  public async getKpisContralor(query: GetKpisDashboardQuery) {
    // 1. Repositorio: Traemos los KpiSubActividadPayLoad
    const result = await this.dashboardQueryRepo.obtenerKpisContralor(query);
    const payloads = result.payloads;

    // 2. Dominio: Pasamos los payloads por la calculadora matemática
    const flujo = CalculadoraKpiService.calcularFlujo(payloads);
    const semaforos = CalculadoraKpiService.calcularSemaforos(payloads);
    const tarjetasBandeja = CalculadoraKpiService.calcularBandejaContralor(payloads);
    const tasaSolventacion = CalculadoraKpiService.calcularTasaSolventacion(payloads);

    // 3. Extraemos el Centro Universitario del primer payload 
    // (Como es el dashboard del contralor, todas sus actividades son del mismo centro)
    const primerCentro = payloads.length > 0 ? payloads[0].centroUniversitario : null;
    const centro_universitario = primerCentro ? {
      clave: primerCentro.clave,
      nombre: primerCentro.nombre
    } : { clave: 'N/A', nombre: 'Sin centro' };

    // 4. DTO: Construimos el JSON final EXACTAMENTE como lo pide Swagger
    return {
      centro_universitario,
      tarjetas: {
        bandeja_entrada: {
          devueltas: tarjetasBandeja.devueltas,
          listas_empezar: tarjetasBandeja.listasEmpezar // Traducción a snake_case
        },
        riesgo_critico: semaforos.critico, // Lo sacamos del cálculo de semáforos
        precaucion: semaforos.alerta,      // Lo sacamos del cálculo de semáforos
        tasa_solventacion: tasaSolventacion
      },
      graficas: {
        semaforos: {
          a_tiempo: semaforos.aTiempo, // Traducción a snake_case
          alerta: semaforos.alerta,
          critico: semaforos.critico,
          total: semaforos.total
        },
        flujo: {
          sin_empezar: flujo.sinEmpezar, // Traducción a snake_case
          en_proceso: flujo.enProgreso,  // Traducción a snake_case
          por_revisar: flujo.porRevisar,
          concluidas: flujo.concluidas,
          total: flujo.total
        }
      }
    };
  }

  public async getKpisJefa(query: GetKpisDashboardQuery) {
    // 1. Repositorio: Traemos TODAS las actividades (KpiSubActividadPayLoad)
    const result = await this.dashboardQueryRepo.obtenerKpisJefa(query);
    const payloads = result.payloads;

    // 2. Dominio: Cálculos matemáticos
    const flujo = CalculadoraKpiService.calcularFlujo(payloads);
    const semaforos = CalculadoraKpiService.calcularSemaforos(payloads);
    const tarjetasPendientes = CalculadoraKpiService.calcularPendientesJefatura(payloads);
    const tasaSolventacion = CalculadoraKpiService.calcularTasaSolventacion(payloads);

    // 3. DTO: Empaquetado exacto al molde de Swagger
    return {
      tarjetas_superiores: {
        pendientes: {
          actividades_por_revisar: tarjetasPendientes.actividadesPorRevisar,
          actividades_solicitadas: tarjetasPendientes.actividadesSolicitadas
        },
        riesgo_critico: {
          total: semaforos.critico,
          descripcion: "Vencidas o por vencer" // Texto estático según tu Swagger
        },
        precaucion: {
          total: semaforos.alerta,
          descripcion: "A menos de 15 días" // Texto estático según tu Swagger
        },
        tasa_solventacion: {
          porcentaje: tasaSolventacion,
          // La tendencia real requiere consultar el mes pasado. Por ahora, mock como en Swagger:
          tendencia_mes: "+5%" 
        }
      },
      grafica_semaforos: {
        a_tiempo: semaforos.aTiempo,
        alerta: semaforos.alerta,
        critico: semaforos.critico,
        total_actividades_red: semaforos.total
      },
      grafica_distribucion_estado: {
        sin_empezar: flujo.sinEmpezar,
        en_proceso: flujo.enProgreso,
        por_revisar: flujo.porRevisar,
        concluidas: flujo.concluidas,
        total_actividades_red: flujo.total
      }
    };
  }

  public async getCentrosConRezago() {
    // 1. Repositorio: Traemos los payloads activos (sin filtrar usuario)
    const result = await this.dashboardQueryRepo.obtenerCentrosConRezago();

    // 2. Dominio: Calculamos la agrupación por centro
    const rezagoPorCentro = CalculadoraKpiService.calcularRezagoCentros(result.payloads);

    // 3. DTO: Envolvemos el resultado en el arreglo 'data' que exige Swagger
    return {
      data: rezagoPorCentro
    };
  }
}