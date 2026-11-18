// [TASK-04] Result shape para la vista de entrega de una sub-actividad (Módulo del Contralor)

export interface ObservacionActivaResult {
  id: string;
  correlativo: string;
  estado: string;
  descripcion: string;
}

export interface EvidenciaBorradorResult {
  id: string;
  nombre_archivo: string;
  peso_mb: number;
  url_descarga: string;
}

export interface HistorialVersionResult {
  id: string;
  estado_operativo: string;
  etiqueta: string;
  fecha: Date;
  es_version_actual: boolean;
  tiene_observaciones: boolean;
}

export interface SubActividadVistaEntregaResult {
  meta_cabecera: {
    folio: string;
    titulo: string;
    centro_clave: string;
    version_actual: number;
    etiqueta_semaforo: string;
    permite_entrega: boolean;
  };
  observaciones_activas: ObservacionActivaResult[];
  detalles_operacion: {
    estado_actual: string;
    periodo_ejecucion: {
      inicio: Date;
      fin: Date;
    };
    duracion_estimada_semanas: number;
    cierre_global_poa: Date | null;
  };
  buzon_borrador: {
    evidencias: EvidenciaBorradorResult[];
    comentarios_entrega: string | null;
  };
  historial_versiones: HistorialVersionResult[];
}
