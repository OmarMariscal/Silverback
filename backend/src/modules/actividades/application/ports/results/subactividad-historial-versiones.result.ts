// [TASK-06] Result shapes para historial de versiones

export interface HistorialIndexItemResult {
  id_version: string;
  numero_version: number;
  titulo_evento: string;
  estado: string;
  fecha_evento: Date;
}

export interface EvidenciaVersionResult {
  id: string;
  nombre: string;
  peso_formateado: string;
  fecha_subida: Date;
}

export interface ObservacionVersionResult {
  id: string;
  numero: number;
  texto: string;
}

export interface VersionDetalleResult {
  folio: string;
  centro_clave: string;
  titulo_subactividad: string;
  version_visualizada: number;
  es_version_actual: boolean;
  fecha_envio_contralor: Date;
  mensaje_envio: string | null;
  evidencias: EvidenciaVersionResult[];
  resolucion_estado: string | null;
  fecha_dictamen: Date | null;
  observaciones: ObservacionVersionResult[];
}
