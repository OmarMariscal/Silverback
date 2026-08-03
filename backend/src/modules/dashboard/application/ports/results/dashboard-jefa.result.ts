export interface DashboardJefaResult {
  tarjetas_superiores: {
    pendientes: {
      actividades_por_revisar: number;
      actividades_solicitades: number;
    };
    precaucion: {
      total: number;
      descripcion: string;
    };
    riesgo_critico: {
      total: number;
      descripcion: string;
    };
  };
  grafica_distribucion_estado: {
    sin_empezar: number;
    en_proceso: number;
    por_revisar: number;
    concluidas: number;
    total_actividades_red: number;
  };
  grafica_semaforos: {
    a_tiempo: number;
    alerta: number;
    critico: number;
    total_actividades_red: number;
  };
}