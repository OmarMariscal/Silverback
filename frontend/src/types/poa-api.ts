// frontend/src/types/poa-api.ts
// El plano exacto de los datos que nos regresa el backend de Emiliano, para que TypeScript nos ayude a no equivocarnos al leerlos
// En palabras sencillas: Este archivo es como un "mapa" que nos dice cómo se ven los datos que vienen del backend. Así, cuando escribimos código para usar esos datos, TypeScript nos avisa si estamos haciendo algo mal, como si estuviéramos buscando una calle que no existe en el mapa.

export type TipoActividadAPI = "AUDITORIA" | "REVISION";
export type EstadoActividadAPI = "SIN_EMPEZAR" | "SOLICITADO" | "EN_PROGRESO" | "EN_REVISION" | "DEVUELTA" | "CONCLUIDA";

// 1. GET /poas/mi-poa-actual
export interface ActividadesResumenDto {
  id: string;
  folio: string;
  titulo: string;
  participacion_global: number;
  auditores_nombres: string[];
  es_rezagado: boolean; // NUEVO
}

export interface PoaActualDto {
  id: string;
  anio_fiscal: number;
  estado: string;
  fecha_inicio: string;
  fecha_termino: string;
  // es_rezagado: eliminado de aquí, ya no es global
  actividades_resumen: ActividadesResumenDto[];
}

// 2. POST poas/{poaid}/presentar
export interface PresentarPoasDto {
  poa_id: string;
  estado_anterior: string;
  estado_nuevo: string;
  fecha_envio: string;
  mensaje: string;
}

// Error 422 estructurado al presentar POA (espejo exacto del spec)
export interface PresentarPoasResponseErrorDto {
  error: string;
  message: string;
  detalles: string[];
}

// 3. POST poas/{poaid}/cancelar-envio
export interface CancelarPoaDto {
  poa_id: string;
  estado_anterior: string;
  estado_nuevo: string;
  fecha_cancelacion: string;
  mensaje: string;
}

export interface CancelarPoaDataDto {
  data: CancelarPoaDto;
}

// 4. GET /actividades/{id}/ficha-tecnica
export interface ActividadesAuditoresResumen {
  id: string;
  nombre: string;
}

export interface ActividadesFichaTecnicaResponse {
  id: string;
  titulo: string;
  justificacion: string;
  objetivo_general: string;
  objetivos_particulares: string;
  meta_del_proyecto: string;
  indicadores: string;
  equipo_auditor: ActividadesAuditoresResumen[];
}

// PATCH /actividades/{id}/ficha-tecnica
export interface ActividadesPatchFichaTecnicaRequest {
  titulo?: string;
  justificacion?: string;
  objetivo_general?: string;
  objetivos_particulares?: string;
  meta_del_proyecto?: string;
  indicadores?: string;
  auditores_ids?: string[];
}

// 5. GET /actividades/{id}/sub-actividades-poa
export interface SubActividadesPoaFechas {
  fecha_inicio: string;
  fecha_termino: string;
  semanas: number;
}

export interface SubActividadesPoaData {
  id: string;
  folio: string;
  descripcion: string;
  tipo: TipoActividadAPI;
  fechas: SubActividadesPoaFechas;
}

export interface SubActividadesPoaResponse {
  data: SubActividadesPoaData[];
}

// 6. PUT /actividades/{id}/sub-actividades/sync
export interface SubActividadDetallesSync {
  id?: string | null;
  descripcion_tarea: string;
  fecha_inicio: string;
  fecha_termino: string;
  tipo: TipoActividadAPI;
  banco_sub_actividad_id?: string;
}

export interface SubActividadesSyncRequest {
  sub_actividades: SubActividadDetallesSync[];
}

export interface SubActividadesSyncResume {
  creadas: number;
  actualizadas: number;
  eliminadas: number;
}

export interface SubActividadesSyncResponse {
  mensaje: string;
  resumen: SubActividadesSyncResume;
}

// 7. GET /catalogos/banco-actividades
export interface BancoActividadesDataDto {
  id: string;
  titulo: string;
  descripcion_corta: string;
  tipo: TipoActividadAPI;
}

export interface BancoActividadesDto {
  data: BancoActividadesDataDto[];
}

// 8. GET /catalogos/banco-actividades/{id}
export interface BancoIdDto {
  id: string;
  titulo: string;
  justificacion_plantilla: string;
  objetivo_gen_plantilla: string;
}

// 9. GET /auditores
export interface AuditoresDataDto {
  id: string;
  nombre_completo: string;
  cargo_etiqueta: string;
}

export interface AuditoresDto {
  data: AuditoresDataDto[];
}

// 10. GET /catalogos/banco-actividades/{id}/sub-actividades-sugeridas
export interface ActividadSugeridaDataDto {
  id: string;
  descripcion: string;
  tipo_sugerido: TipoActividadAPI;
}

export interface ActividadSugeridaDto {
  data: ActividadSugeridaDataDto[];
}

// 11. POST /poas/{poaid}/actividades (Crear Actividad)
export interface CrearActividadesDto {
  titulo: string;
  justificacion: string;
  objetivo_general: string;
  objetivos_especificos: string;
  metas: string;
  indicadores: string;
  banco_actividad_id?: string; // Omitible si es null
  equipo_auditor: {
    total_participantes: number;
    auditores_ids: string[];
  };
}

export interface CrearActividadesResponseDto {
  id: string;
  folio: string;
  mensaje: string;
}

// 12. GET /actividades/{actividadid}/sub-actividades-select (CORREGIDO: fechas opcionales anidadas)
export interface SubActividadesSelectData {
  id: string;
  folio: string;
  descripcion: string;
  tipo: TipoActividadAPI;
  fechas?: SubActividadesPoaFechas;
  seleccionada: boolean;
}

export interface SubActividadesSelectResponse {
  data: SubActividadesSelectData[];
}

// 13. POST /actividades/{actividadid}/sub-actividades/bulk
export interface SubActividadesBulkRequest {
  sub_actividades: {
    descripcion_tarea: string;
    fecha_inicio: string;
    fecha_termino: string;
    tipo: TipoActividadAPI;
    banco_sub_actividad_id?: string;
  }[];
}

export interface SubActividadesBulkResponse {
  mensaje: string;
  data: {
    id: string;
    numero_orden: number;
    semanas_totales: number;
  }[];
}

// 14. DELETE /actividades/{actividadid}
export interface EliminacionCorrecta {
  status: boolean;
  mensaje: string;
}

// 15. GET /catalogos/centros (CORREGIDO: subtitulo_interfaz incluido)
export interface CentroDataDto {
  id: string;
  clave: string;
  nombre: string;
  subtitulo_interfaz: string;
}

export interface CentroDto {
  data: CentroDataDto[];
}

