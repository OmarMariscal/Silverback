// frontend/src/types/actividades-contratos.ts
// Este archivo define los tipos y contratos relacionados con las actividades y auditorías en la aplicación. Incluye interfaces para representar la información de las actividades, subactividades, fichas técnicas, y los filtros que se pueden aplicar en el directorio de actividades.
// En palabras sencillas: Este archivo es como un "manual de instrucciones" para los desarrolladores. Define cómo deben lucir los datos de las actividades y qué propiedades se esperan, asegurando que todos los componentes y servicios trabajen con la misma estructura de información.

export type SemaforoColor = 'CRITICO' | 'PRECAUCION' | 'A_TIEMPO';

export interface FilaDirectorioUI {
  id: string;
  identificador: string;
  tipo: 'AUDITORIA' | 'REVISION';
  titulo: string;
  fechaTerminoTexto: string;
  
  // Datos según el rol en sesión
  esVistaJefa: boolean;
  centroClave?: string;
  nombreContralor?: string;
  participacionPorcentaje?: number;
  auditorApoyo?: string | null;

  // Estado operativo y semáforo
  estadoCodigo: string;
  estadoEtiqueta: string;
  semaforo: SemaforoColor;
}

export interface FiltrosDirectorio {
  search?: string;
  centroUuid?: string;
  tipoActividad?: 'AUDITORIA' | 'REVISION';
  estadoFlujo?: string;
  semaforo?: SemaforoColor; // Permite el filtrado por semáforo desde las tarjetas
  sortBy?: 'IDENTIFICADOR' | 'FECHA_TERMINO' | 'ESTADO_FLUJO';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}