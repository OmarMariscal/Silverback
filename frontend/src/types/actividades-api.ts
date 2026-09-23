// frontend/src/types/actividades-api.ts
// Este archivo contiene definiciones de tipos TypeScript para las actividades en el sistema. Los tipos ayudan a garantizar que los datos que se manejan en la aplicación sean consistentes y correctos, proporcionando autocompletado y verificación de errores durante el desarrollo.
// En palabras sencillas: Este archivo es como un "manual de instrucciones" para los datos relacionados con actividades. Define cómo deben lucir los objetos de datos, qué propiedades tienen y qué tipos de valores se esperan. Esto ayuda a los desarrolladores a evitar errores al trabajar con estos datos en la aplicación.

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
