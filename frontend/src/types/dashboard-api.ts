// frontend/src/types/dashboard-api.ts
// Este archivo define los tipos y contratos relacionados con las respuestas de la API del dashboard. Incluye interfaces para representar la información de los KPIs, actividades próximas a vencer, supervisión y el directorio de actividades.
// En palabras sencillas: Este archivo es como un "manual de instrucciones" para los desarrolladores. Define cómo deben lucir los datos que provienen del backend y qué propiedades se esperan, asegurando que todos los componentes y servicios trabajen con la misma estructura de información.

import { EstadoActividadAPI, TipoActividadAPI } from './poa-api';

// --- CONTRALOR: GET /dashboard/contralor/kpis ---
export interface DashboardContralorDto {
  centro_universitario: {
    clave: string;
    nombre: string;
  };
  tarjetas: {
    bandeja_entrada: {
      devueltas: number;
      listas_empezar: number;
    };
    riesgo_critico: number;
    precaucion: number;
    tasa_solventacion: number;
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

// --- CONTRALOR: GET /actividades/proximas-vencer ---
export interface ProximaVencerItemDto {
  id: string;
  titulo: string;
  fecha_vencimiento: string;
  estado_semaforo: 'A_TIEMPO' | 'CRITICO' | 'PRECAUCION';
  etiqueta_tiempo: string;
}

export interface ProximasVencerResponseDto {
  data: ProximaVencerItemDto[];
}

// --- CONTRALOR: GET /actividades/supervision ---
export interface SupervisionItemDto {
  id: string;
  titulo: string;
  enviada_hace: string;
  resolucion_jefa: {
    estado: string;
    mensaje: string;
    semaforo: string;
  };
  vencimiento_poa: {
    fecha_texto: string;
    etiqueta: string;
  };
}

export interface SupervisionResponseDto {
  meta: {
    total_registros: number;
    pagina_actual: number;
    total_paginas: number;
  };
  data: SupervisionItemDto[];
}

// --- JEFA: GET /dashboard/jefa ---
export interface DashboardJefaDto {
  tarjetas_superiores: {
    pendientes: {
      actividades_por_revisar: number;
      actividades_solicitadas: number;
    };
    riesgo_critico: {
      total: number;
      descripcion: string;
    };
    precaucion: {
      total: number;
      descripcion: string;
    };
    tasa_solventacion: {
      porcentaje: number;
      tendencia_mes: string;
    };
  };
  grafica_semaforos: {
    a_tiempo: number;
    alerta: number;
    critico: number;
    total_actividades_red: number;
  };
  grafica_distribucion_estado: {
    sin_empezar: number;
    en_proceso: number;
    por_revisar: number;
    concluidas: number;
    total_actividades_red: number;
  };
}

// --- JEFA: GET /dashboard/rezago ---
export interface CentroRezagoItemDto {
  centro_id: string;
  centro_clave: string;
  centro_nombre: string;
  distribucion: {
    actividades_criticas: number;
    actividades_precaucion: number;
    total: number;
  };
}

export interface RezagoResponseDto {
  data: CentroRezagoItemDto[];
}

// --- JEFA / DIRECTORIO: GET /actividades/directorio ---
export interface DirectorioItemDto {
  id: string;
  identificador: string | null;
  tipo: TipoActividadAPI;
  titulo: string;
  fecha_termino: string;
  fecha_envio?: string; // Campo actualizado por el backend
  asignacion: {
    tipo_vista: 'JEFA' | 'CONTRALOR';
    centro_clave?: string;
    contralor?: string;
    participacion_porcentaje?: number;
    auditor_apoyo?: string | null;
  };
  estado_operativo: {
    codigo: EstadoActividadAPI;
    etiqueta: string | null;
  };
  semaforo: 'A_TIEMPO' | 'CRITICO' | 'PRECAUCION';
}

export interface DirectorioResponseDto {
  meta: {
    total_registros: number;
    pagina_actual: number;
    total_paginas: number;
  };
  data: DirectorioItemDto[];
}