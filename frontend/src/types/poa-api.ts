// frontend/src/types/poa-api.ts

export type TipoActividadAPI = "AUDITORIA" | "REVISION";
export type EstadoActividadAPI = "SIN_EMPEZAR" | "SOLICITADO" | "EN_PROGRESO" | "EN_REVISION" | "DEVUELTA" | "CONCLUIDA";

// 1. Esquema de respuesta para GET /poas/mi-poa-actual
export interface ActividadesResumenDto {
  id: string;
  folio: string;
  titulo: string;
  participacion_global: number;
  auditores_nombres: string[];
}

export interface PoaActualDto {
  id: string;
  anio_fiscal: number;
  estado: string;
  fecha_inicio: string;
  fecha_termino: string;
  es_rezagado: boolean;
  actividades_resumen: ActividadesResumenDto[];
}

// 2. Esquema de respuesta para POST poas/{poaid}/presentar
export interface PresentarPoasDto {
  poa_id: string;
  estado_anterior: string;
  estado_nuevo: string;
  fecha_envio: string;
  mensaje: string;
}

// 3. Esquema de respuesta para POST poas/{poaid}/cancelar-envio
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

// 4. Esquema de respuesta para GET y PATCH de Ficha Técnica
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

// 5. Esquema de respuesta para GET actividades/{id}/sub-actividades-poa
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

// 6. Esquema de respuesta para PUT actividades/{id}/sub-actividades/sync
export interface SubActividadesSyncResume {
  creadas: number;
  actualizadas: number;
  eliminadas: number;
}

export interface SubActividadesSyncResponse {
  mensaje: string;
  resumen: SubActividadesSyncResume;
}

// 7. Esquema para GET /catalogos/banco-actividades
export interface BancoActividadesDataDto {
  id: string;
  titulo: string;
  descripcion_corta: string; // Mapeado de tus notas en endpoints.txt
}

export interface BancoActividadesDto {
  data: BancoActividadesDataDto[];
}

// 8. Esquema para GET /catalogos/banco-actividades/{id}
export interface BancoldDto {
  id: string;
  titulo: string;
  justificacion: string;
  objetivo_general: string;
  objetivos_particulares: string;
  meta_del_proyecto: string;
  indicadores: string;
}

// 9. Esquema para GET /auditores
export interface AuditoresDataDto {
  id: string;
  nombre_completo: string; 
  cargo: string;
}

export interface AuditoresDto {
  data: AuditoresDataDto[];
}

// 10. Esquema para GET /catalogos/banco-actividades/{id}/sub-actividades-sugeridas
export interface ActividadSugeridaDataDto {
  id: string;
  descripcion: string;
  tipo: TipoActividadAPI;
}

export interface ActividadSugeridaDto {
  data: ActividadSugeridaDataDto[];
}

// 11. Esquema para POST /poas/{poaid}/actividades (Crear Actividad)
export interface CrearActividadesDto {
  titulo: string;
  justificacion: string;
  objetivo_general: string;
  objetivos_particulares: string;
  meta_del_proyecto: string;
  indicadores: string;
  banco_actividades_id?: string; // Opcional si es desde cero
  auditores_ids: string[];
}

export interface CrearActividadesResponseDto {
  id: string; // Te regresan el UUID de la nueva actividad
  titulo: string;
  justificacion: string;
  objetivo_general: string;
  objetivos_particulares: string;
  meta_del_proyecto: string;
  indicadores: string;
}

// 12. Esquema para GET /actividades/{actividadid}/sub-actividades-select
export interface SubActividadesSelectData {
  id: string;
  descripcion: string;
  tipo: TipoActividadAPI;
}

export interface SubActividadesSelectResponse {
  data: SubActividadesSelectData[];
}

// 13. Esquema para POST /actividades/{actividadid}/sub-actividades/bulk
export interface SubActividadesBulkRequest {
  sub_actividades: {
    descripcion: string;
    tipo: TipoActividadAPI;
  }[];
}

export interface SubActividadesBulkResponse {
  mensaje: string;
  creadas: number;
}

// 14. Esquema para DELETE /actividades/{actividadid}
export interface EliminacionCorrecta {
  mensaje: string; // Mapeado del Swagger "EliminacionCorrecta"
}

//Faltan: 
// GET catalogos/banco-actividades
//GET catalogos/banco-actividades/{id}
//GET auditores
//GET catalogos/banco-actividades/{id}/sub-actividades-sugeridas
//GET poas/{poaid}/actividades
//POST actividades/{actividadid}/sub-actividades/bulk
//GET actividades/{actividadid}/sub-actividades-select
//DELETE actividades/{actividadid}
