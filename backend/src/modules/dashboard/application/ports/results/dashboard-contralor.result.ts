export interface DashboardContralorResult {
  centro_universitario: {
    clave: string;
    nombre: string;
  };
  tarjetas: {
    bandeja_entrada: {
      devueltas: number;
      listas_empezar: number;
    };

  };
  graficas: {
    semaforos: {
      a_tiempo: number;
      alerta: number;
      critico: number;
      total: number;
    };
    flujo: {
      sin_empezar: number;
      en_proceso: number;
      por_revisar: number;
      concluidas: number;
      total: number;
    };
  };
}