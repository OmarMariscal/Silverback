import { EstadoActividadAPI, TipoActividadAPI } from './poa-api';

export interface ActividadesDirectorioAsignacion {
  tipo_vista: 'JEFA' | 'CONTRALOR';
  centro_clave?: string;
  contralor?: string;
  participacion_porcentaje?: number;
  auditor_apoyo?: string | null;
}

export interface ActividadesDirectorioData {
  id: string;
  identificador: string | null;
  tipo: TipoActividadAPI;
  titulo: string;
  fecha_termino: string;
  asignacion: ActividadesDirectorioAsignacion;
  estado_operativo: { codigo: EstadoActividadAPI; etiqueta: string | null };
  semaforo: 'A_TIEMPO' | 'CRITICO' | 'PRECAUCION' | 'GRIS' | 'VERDE' | 'AMARILLO' | 'ROJO';
}

export interface ActividadesDirectorioResponse {
  meta: {
    total_registros: number;
    pagina_actual: number;
    total_paginas: number;
    limite: number;
  };
  data: ActividadesDirectorioData[];
}

export interface ActividadesDirectorioQuery {
  page: number;
  limit: number;
  search?: string;
  centro_uuid?: string;
  tipo_actividad?: TipoActividadAPI;
  estado_flujo?: EstadoActividadAPI;
  semaforo?: 'A_TIEMPO' | 'CRITICO' | 'PRECAUCION';
  sort_by?: 'IDENTIFICADOR' | 'FECHA_TERMINO' | 'ESTADO_FLUJO';
  order?: 'asc' | 'desc';
}
