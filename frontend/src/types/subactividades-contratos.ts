// frontend/src/types/subactividades-contratos.ts
// Este archivo define los contratos y props de interfaz de usuario (UI) para los componentes React de la pantalla
// de entrega de subactividades, carga de archivos a S3 y consulta del histórico inmutable (Módulo del Contralor).
// En palabras sencillas: Es el contrato para que el equipo Frontend (Rogelio y compañeros) construya los componentes
// de la vista (Dropzone, Timeline, Observaciones, Detalles y Banner Histórico) mientras se implementa el backend.

import type {
  EstadoSubActividadAPI,
  EstadoDictamenAPI,
  EstadoSolvenciaAPI,
} from './subactividades-api';

// ==========================================
// 1. CONSTANTES Y REGLAS DE NEGOCIO EN UI
// ==========================================

/** Peso máximo permitido por archivo: 50MB (en bytes) */
export const LIMITE_MAXIMO_PESO_BYTES = 50 * 1024 * 1024; // 52,428,800 bytes

/** Tipos MIME autorizados por la lista blanca de seguridad */
export const TIPOS_MIME_PERMITIDOS: readonly string[] = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-powerpoint', // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/zip', // .zip
  'application/x-zip-compressed',
];

/** Extensiones amigables para mostrar en el Dropzone */
export const EXTENSIONES_PERMITIDAS_LABEL = 'PDF, Excel, Word, PPTX y ZIP (Máx. 50MB por archivo)';

// ==========================================
// 2. CONTRATOS DE COMPONENTES UI
// ==========================================

// --- A. Cabecera y Badges de la Subactividad ---
export interface BreadcrumbItem {
  etiqueta: string;
  href?: string;
  esActual?: boolean;
}

export interface SemáforoSubActividadUI {
  etiqueta: string; // Ej: "Próximo a Vencer" o "A tiempo"
  esAlerta: boolean; // true si faltan menos de 7 días naturales
  claseBadge: string; // Tailwind clases para fondo y texto
}

export interface CabeceraSubActividadProps {
  folio: string; // Ej: "05.1"
  titulo: string; // Ej: "Verificación de reportes de asistencia..."
  centroClave: string; // Ej: "CUCEI"
  versionTexto: string; // Ej: "Versión 3" o "Viendo Versión 1"
  esModoHistorico: boolean;
  semaforo?: SemáforoSubActividadUI;
  breadcrumbs: BreadcrumbItem[];
}

// --- B. Banner de Advertencia de Registro Histórico (US_03) ---
export interface BannerAvisoHistoricoProps {
  versionNumero: number; // Ej: 1
  onVolverAVersionActual: () => void;
}

// --- C. Observaciones Versión Actual (US_01) ---
export interface ObservacionActivaUI {
  id: string;
  correlativo: string; // Ej: "Observación #2"
  descripcion: string; // Texto emitido por la Jefatura
  estadoSolvencia: EstadoSolvenciaAPI; // "NO_SOLVENTADA" | "PARCIALMENTE_SOLVENTADA" | ...
  estadoSolvenciaEtiqueta: string; // Ej: "No Solventada" o "Parcialmente Solventada"
  colorBadge: 'red' | 'amber' | 'emerald' | 'slate';
}

export interface PanelObservacionesActivasProps {
  estaVisible: boolean; // Solo visible si la subactividad está en DEVUELTA
  observaciones: ObservacionActivaUI[];
}

// --- D. Buzón de Evidencias y Carga S3 (US_02) ---

export type EstadoArchivoCarga =
  | 'LOCAL_PREPARADO' // Seleccionado en dropzone, esperando envío
  | 'SOLICITANDO_FIRMA' // Pidiendo pre-signed URL al backend
  | 'SUBIENDO_S3' // PUT binario directo a S3 con progreso
  | 'CONFIRMANDO' // POST /confirmar hacia NestJS
  | 'BORRADOR_CONFIRMADO' // Archivo confirmado y persistido en DB
  | 'ERROR_CARGA'; // Ocurrió un fallo en S3 o red

export interface ArchivoEvidenciaUI {
  id: string; // UUID (del backend o temporal local si está en proceso)
  nombreOriginal: string; // Ej: "firmas_computacionales.pdf"
  nombreSanitizado: string; // Nombre limpio sin acentos ni eñes
  pesoFormateado: string; // Ej: "2.4 MB" o "450 KB"
  pesoBytes: number;
  tipoMime: string;
  progresoPorcentaje: number; // 0 a 100
  estadoCarga: EstadoArchivoCarga;
  urlDescarga?: string;
  mensajeError?: string;
  fileObject?: File; // Objeto File nativo para el PUT a S3
}

export type ModoBuzonEvidencias = 'CARGA' | 'BLOQUEADO' | 'OCULTO';

export interface BuzonEvidenciasProps {
  modo: ModoBuzonEvidencias; // "CARGA" (en progreso/devuelta), "BLOQUEADO" (en revisión), "OCULTO" (autorizada/histórico)
  archivos: ArchivoEvidenciaUI[];
  comentariosEntrega: string;
  estaEnviandoRevision: boolean;
  errorEnvioGeneral?: string | null;

  // Handlers para eventos de usuario
  onArchivosSeleccionados: (archivos: File[]) => void;
  onEliminarArchivo: (archivoId: string) => void | Promise<void>;
  onChangeComentarios: (comentarios: string) => void;
  onConfirmarEnvioRevision: () => void | Promise<void> | Promise<boolean>;
  onDescargarArchivo?: (archivoId: string) => void;
}

// --- E. Ficha Técnica y Detalles de Operación (Sidebar 1/3) ---
export interface DetallesOperacionUI {
  estadoActualTexto: string; // Ej: "Devuelta por Jefatura", "En Progreso", "En Revisión"
  estadoColor: 'red' | 'amber' | 'purple' | 'emerald' | 'slate';
  periodoEjecucionTexto: string; // Ej: "15 Ene 2026 — 15 Feb 2026"
  duracionSemanasTexto: string; // Ej: "4 Semanas Totales"
  cierreGlobalPoaTexto: string; // Ej: "31 Dic 2026"
  diasParaCierreGlobal: number; // Días naturales calculados
  esProximoAVencer: boolean; // True si faltan menos de 7 días
}

export interface PanelDetallesOperacionProps {
  detalles: DetallesOperacionUI;
}

// --- F. Historial de Versiones / Mapa de Línea de Tiempo (US_03) ---
export interface NodoLineaTiempoHistorialUI {
  idVersion: string; // UUID de la entrega
  numeroVersion: number; // 1, 2, 3...
  tituloEvento: string; // Ej: "Devuelto con Observaciones", "Enviado a Revisión (V2)"
  fechaTexto: string; // Ej: "14 Oct 2026, 16:30 hrs"
  esVersionActual: boolean; // Si es la última versión activa
  estaSeleccionadaEnVista: boolean; // Si es la versión que el usuario está consultando en este momento
  estadoDictamen?: EstadoDictamenAPI | EstadoSubActividadAPI;
  colorPunto: 'red' | 'indigo' | 'emerald' | 'slate';
  tieneObservaciones?: boolean;
  tieneEvidencias?: boolean;
  onClickSeleccionarVersion: (idVersion: string) => void;
}

export interface PanelHistorialVersionesProps {
  nodos: NodoLineaTiempoHistorialUI[];
}

// --- G. Consulta Inmutable de Versión Histórica (US_03) ---
export interface EvidenciaHistoricaItemUI {
  id: string;
  nombre: string;
  pesoFormateado: string; // Ej: "1.2 MB"
  fechaSubidaTexto: string; // Ej: "Subido 08 Oct 2026"
  tipoIcono: 'pdf' | 'excel' | 'word' | 'generico';
  estaDescargando: boolean;
  onDescargar: () => void | Promise<void>;
}

export interface ObservacionHistoricaItemUI {
  id: string;
  numero: number;
  texto: string;
}

export interface PanelVersionHistoricaDetalleProps {
  versionNumero: number;
  fechaEnvioTexto: string;
  comentarioEnvioContralor?: string | null;
  evidencias: EvidenciaHistoricaItemUI[];
  resolucionJefaturaTexto: string; // Ej: "Devuelta al Contralor", "Aprobada"
  fechaDictamenTexto?: string | null;
  observacionesHistoricas: ObservacionHistoricaItemUI[];
}

// ==========================================
// 3. VIEWMODEL INTEGRAL DE LA PANTALLA
// ==========================================

export interface SubActividadEntregaViewModel {
  // Identificadores de ruta
  subActividadId: string;
  versionHistoricaSeleccionadaId: string | null; // null si se ve la actual

  // Estados de carga
  estaCargandoVista: boolean;
  estaCargandoVersionHistorica: boolean;
  mensajeError: string | null;

  // Propiedades de la vista actual
  cabecera: CabeceraSubActividadProps;
  detallesOperacion: DetallesOperacionUI;
  observacionesActivas: ObservacionActivaUI[];
  buzon: BuzonEvidenciasProps;
  historialNodos: NodoLineaTiempoHistorialUI[];

  // Propiedades si se encuentra en modo histórico (solo lectura)
  esModoHistorico: boolean;
  versionHistoricaDetalle?: PanelVersionHistoricaDetalleProps;

  // Acciones globales
  onSeleccionarVersionHistorica: (versionId: string) => void | Promise<void>;
  onVolverAVersionActual: () => void;
}

