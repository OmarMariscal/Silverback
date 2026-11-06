// frontend/src/services/subactividades.adapter.ts
// Este archivo contiene las funciones "traductoras" (Adaptadores) que convierten los datos crudos
// de la API en formatos amigables y listos para pintar en la interfaz de React.
// En palabras sencillas: Convierte fechas en texto legible (ej: "14 Oct 2026"), calcula los semáforos,
// asigna colores a las observaciones, sanitiza nombres de archivo y valida el tamaño de 50MB.

import type {
  VistaEntregaSubActividadResponse,
  DetalleVersionHistoricaResponse,
  ObservacionActivaDto,
  EstadoSolvenciaAPI,
  EstadoSubActividadAPI,
} from '@/types/subactividades-api';
import {
  LIMITE_MAXIMO_PESO_BYTES,
  TIPOS_MIME_PERMITIDOS,
  type CabeceraSubActividadProps,
  type ObservacionActivaUI,
  type DetallesOperacionUI,
  type NodoLineaTiempoHistorialUI,
  type PanelVersionHistoricaDetalleProps,
  type EvidenciaHistoricaItemUI,
  type SemáforoSubActividadUI,
} from '@/types/subactividades-contratos';

// ==========================================
// 1. UTILIDADES Y FORMATEADORES AUXILIARES
// ==========================================

const MESES_CORTOS = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

/**
 * Convierte una fecha ISO a formato corto: "15 Ene 2026"
 */
export const formatearFechaCorta = (fechaIso?: string | null): string => {
  if (!fechaIso) return 'N/A';
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return fechaIso;
  const dia = d.getUTCDate().toString().padStart(2, '0');
  const mes = MESES_CORTOS[d.getUTCMonth()];
  const anio = d.getUTCFullYear();
  return `${dia} ${mes} ${anio}`;
};

/**
 * Convierte una fecha ISO a formato con hora: "14 Oct 2026, 16:30 hrs"
 */
export const formatearFechaConHora = (fechaIso?: string | null): string => {
  if (!fechaIso) return 'N/A';
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return fechaIso;
  const dia = d.getUTCDate().toString().padStart(2, '0');
  const mes = MESES_CORTOS[d.getUTCMonth()];
  const anio = d.getUTCFullYear();
  const horas = d.getUTCHours().toString().padStart(2, '0');
  const minutos = d.getUTCMinutes().toString().padStart(2, '0');
  return `${dia} ${mes} ${anio}, ${horas}:${minutos} hrs`;
};

/**
 * Formatea bytes numéricos a unidades legibles: "2.4 MB" o "450 KB"
 */
export const formatearPesoBytes = (bytes: number): string => {
  if (bytes === 0) return '0 KB';
  const k = 1024;
  const mb = bytes / (k * k);
  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`;
  }
  const kb = bytes / k;
  return `${Math.round(kb)} KB`;
};

/**
 * Sanitiza nombres de archivo para compatibilidad en S3 y descargas (US_02)
 * Elimina acentos, eñes, paréntesis y espacios conflictivos manteniendo la extensión.
 */
export const sanitizarNombreArchivo = (nombreOriginal: string): string => {
  const partes = nombreOriginal.split('.');
  const extension = partes.length > 1 ? `.${partes.pop()}` : '';
  const base = partes.join('.');

  const baseLimpia = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita tildes
    .replace(/ñ/g, 'n')
    .replace(/Ñ/g, 'N')
    .replace(/[^a-zA-Z0-9_-]/g, '_') // Reemplaza caracteres raros y espacios por guiones bajos
    .replace(/_+/g, '_'); // Evita guiones dobles

  return `${baseLimpia}${extension}`.toLowerCase();
};

/**
 * Valida un archivo antes de permitir su subida (US_02)
 * Verifica peso máximo (50MB) y tipo MIME permitido.
 */
export const validarArchivoCarga = (
  file: File,
): { esValido: boolean; error?: string } => {
  // 1. Validación de peso
  if (file.size > LIMITE_MAXIMO_PESO_BYTES) {
    return {
      esValido: false,
      error: `El archivo "${file.name}" supera el límite máximo de 50MB.`,
    };
  }

  // 2. Validación de tipo MIME
  const mimeValido = TIPOS_MIME_PERMITIDOS.includes(file.type);
  // Fallback para archivos zip o de office si el navegador no detecta el MIME exacto
  const ext = file.name.split('.').pop()?.toLowerCase();
  const extensionPermitida = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip'].includes(
    ext || '',
  );

  if (!mimeValido && !extensionPermitida) {
    return {
      esValido: false,
      error: `Formato de archivo no admitido (${ext || 'desconocido'}). Solo se aceptan PDF, Excel, Word, PPTX y ZIP.`,
    };
  }

  return { esValido: true };
};

/**
 * Determina el tipo de icono a pintar en base al nombre o extensión
 */
export const obtenerTipoIconoArchivo = (
  nombreArchivo: string,
): 'pdf' | 'excel' | 'word' | 'generico' => {
  const ext = nombreArchivo.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'xls' || ext === 'xlsx') return 'excel';
  if (ext === 'doc' || ext === 'docx') return 'word';
  return 'generico';
};

// ==========================================
// 2. ADAPTADORES DE COMPONENTES
// ==========================================

/**
 * Determina el modo en que se debe renderizar el buzón de evidencias según el estado de la BD (US_01)
 * - EN_PROGRESO o DEVUELTA: 'CARGA' (Permite arrastrar y subir)
 * - EN_REVISION: 'BLOQUEADO' (Modo lectura/espera de dictamen)
 * - AUTORIZADA o CONCLUIDA: 'OCULTO' (Finalizado)
 */
export const determinarModoBuzonUI = (
  estado: EstadoSubActividadAPI,
): 'CARGA' | 'BLOQUEADO' | 'OCULTO' => {
  switch (estado) {
    case 'EN_PROGRESO':
    case 'DEVUELTA':
      return 'CARGA';
    case 'EN_REVISION':
      return 'BLOQUEADO';
    case 'AUTORIZADA':
    case 'CONCLUIDA':
    default:
      return 'OCULTO';
  }
};

/**
 * Adapta los metadatos de la cabecera de la subactividad (US_01)
 */
export const adaptarCabeceraSubActividadUI = (
  metaCabecera: VistaEntregaSubActividadResponse['meta_cabecera'],
  detallesOperacion: VistaEntregaSubActividadResponse['detalles_operacion'],
  esModoHistorico: boolean = false,
  versionVisualizada?: number,
): CabeceraSubActividadProps => {
  const hoy = new Date();
  const cierre = new Date(detallesOperacion.cierre_global_poa);
  const diffTiempo = cierre.getTime() - hoy.getTime();
  const diasRestantes = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));

  const semaforo = adaptarSemaforoUI(
    metaCabecera.etiqueta_semaforo,
    diasRestantes,
    detallesOperacion.estado_actual,
  );

  const folioNumero = metaCabecera.folio.split('.')[0] || '05';

  return {
    folio: `Folio ${metaCabecera.folio}`,
    titulo: metaCabecera.titulo,
    centroClave: metaCabecera.centro_clave,
    versionTexto: esModoHistorico
      ? `Viendo Versión ${versionVisualizada ?? ''}`
      : `Versión ${metaCabecera.version_actual}`,
    esModoHistorico,
    semaforo,
    breadcrumbs: [
      { etiqueta: 'Actividades Programadas', href: '/contralor/actividades' },
      { etiqueta: `Actividad ${folioNumero}` },
      { etiqueta: `Subactividad ${metaCabecera.folio}`, esActual: true },
    ],
  };
};

/**
 * Adapta las evidencias preexistentes en el borrador al modelo visual de la lista
 */
export const adaptarEvidenciasBorradorUI = (
  evidenciasDto: VistaEntregaSubActividadResponse['buzon_borrador']['evidencias'],
): import('@/types/subactividades-contratos').ArchivoEvidenciaUI[] => {
  return (evidenciasDto || []).map((ev) => ({
    id: ev.id,
    nombreOriginal: ev.nombre_archivo,
    nombreSanitizado: sanitizarNombreArchivo(ev.nombre_archivo),
    pesoFormateado: `${ev.peso_mb} MB`,
    pesoBytes: Math.round(ev.peso_mb * 1024 * 1024),
    tipoMime: 'application/pdf',
    progresoPorcentaje: 100,
    estadoCarga: 'BORRADOR_CONFIRMADO',
    urlDescarga: ev.url_descarga,
  }));
};

/**
 * Adapta el semáforo y la advertencia de vencimiento (US_01)
 * Regla: Si faltan menos de 7 días naturales para el cierre global del POA y la subactividad está en curso.
 */
export const adaptarSemaforoUI = (
  etiquetaApi: string,
  diasParaCierre: number,
  estadoSubactividad: EstadoSubActividadAPI,
): SemáforoSubActividadUI => {
  const esProximoAVencer =
    diasParaCierre <= 7 &&
    diasParaCierre >= 0 &&
    (estadoSubactividad === 'EN_PROGRESO' || estadoSubactividad === 'DEVUELTA');

  if (esProximoAVencer) {
    return {
      etiqueta: 'Próximo a Vencer',
      esAlerta: true,
      claseBadge:
        'bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2',
    };
  }

  return {
    etiqueta: etiquetaApi || 'En tiempo',
    esAlerta: false,
    claseBadge:
      'bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2',
  };
};

/**
 * Adapta las observaciones activas de la versión actual (US_01)
 */
export const adaptarObservacionesActivasUI = (
  obsDto: ObservacionActivaDto[],
): ObservacionActivaUI[] => {
  return (obsDto || []).map((obs) => {
    let color: 'red' | 'amber' | 'emerald' | 'slate' = 'red';
    let etiqueta = 'No Solventada';

    switch (obs.estado) {
      case 'NO_SOLVENTADA':
        color = 'red';
        etiqueta = 'No Solventada';
        break;
      case 'PARCIALMENTE_SOLVENTADA':
        color = 'amber';
        etiqueta = 'Parcialmente Solventada';
        break;
      case 'SOLVENTADA':
        color = 'emerald';
        etiqueta = 'Solventada';
        break;
      case 'PENDIENTE':
      default:
        color = 'slate';
        etiqueta = 'Pendiente de Revisión';
        break;
    }

    return {
      id: obs.id,
      correlativo: obs.correlativo,
      descripcion: obs.descripcion,
      estadoSolvencia: obs.estado,
      estadoSolvenciaEtiqueta: etiqueta,
      colorBadge: color,
    };
  });
};

/**
 * Adapta los detalles de operación de la ficha técnica lateral
 */
export const adaptarDetallesOperacionUI = (
  dto: VistaEntregaSubActividadResponse['detalles_operacion'],
): DetallesOperacionUI => {
  const hoy = new Date();
  const cierre = new Date(dto.cierre_global_poa);
  const diffTiempo = cierre.getTime() - hoy.getTime();
  const diasRestantes = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));

  let estadoTexto = 'En Progreso';
  let color: DetallesOperacionUI['estadoColor'] = 'slate';

  switch (dto.estado_actual) {
    case 'DEVUELTA':
      estadoTexto = 'Devuelta por Jefatura';
      color = 'red';
      break;
    case 'EN_PROGRESO':
      estadoTexto = 'En Progreso';
      color = 'amber';
      break;
    case 'EN_REVISION':
      estadoTexto = 'En Revisión de Jefatura';
      color = 'purple';
      break;
    case 'AUTORIZADA':
    case 'CONCLUIDA':
      estadoTexto = 'Autorizada';
      color = 'emerald';
      break;
  }

  const fInicio = formatearFechaCorta(dto.periodo_ejecucion.inicio);
  const fFin = formatearFechaCorta(dto.periodo_ejecucion.fin);

  return {
    estadoActualTexto: estadoTexto,
    estadoColor: color,
    periodoEjecucionTexto: `${fInicio} — ${fFin}`,
    duracionSemanasTexto: `${dto.duracion_estimada_semanas} Semanas Totales`,
    cierreGlobalPoaTexto: formatearFechaCorta(dto.cierre_global_poa),
    diasParaCierreGlobal: diasRestantes,
    esProximoAVencer: diasRestantes <= 7 && diasRestantes >= 0,
  };
};

/**
 * Adapta los nodos de la línea de tiempo del historial (US_03)
 */
export const adaptarHistorialVersionesUI = (
  versionesDto: VistaEntregaSubActividadResponse['historial_versiones'],
  versionSeleccionadaId: string | null,
  onClickVerVersion: (idVersion: string) => void,
): NodoLineaTiempoHistorialUI[] => {
  return (versionesDto || []).map((v, index) => {
    const esSeleccionada = versionSeleccionadaId === v.id;
    let color: NodoLineaTiempoHistorialUI['colorPunto'] = 'slate';

    if (v.estado_operativo === 'DEVUELTA' || v.etiqueta.includes('Devuelto')) {
      color = 'red';
    } else if (v.estado_operativo === 'EN_REVISION' || v.etiqueta.includes('Revisión')) {
      color = 'indigo';
    } else if (v.estado_operativo === 'AUTORIZADA') {
      color = 'emerald';
    }

    return {
      idVersion: v.id,
      numeroVersion: versionesDto.length - index,
      tituloEvento: v.etiqueta,
      fechaTexto: formatearFechaConHora(v.fecha),
      esVersionActual: v.es_version_actual,
      estaSeleccionadaEnVista: esSeleccionada,
      colorPunto: color,
      tieneObservaciones: Boolean(v.tiene_observaciones),
      tieneEvidencias: Boolean(v.tiene_archivos_subidos),
      onClickSeleccionarVersion: (id) => onClickVerVersion(id),
    };
  });
};

/**
 * Adapta el detalle completo inmutable de una versión histórica seleccionada (US_03)
 */
export const adaptarDetalleVersionHistoricaUI = (
  dto: DetalleVersionHistoricaResponse,
  onDescargarArchivo: (archivoId: string) => void | Promise<void>,
): PanelVersionHistoricaDetalleProps => {
  const evidenciasUI: EvidenciaHistoricaItemUI[] = (dto.evidencias || []).map((ev) => ({
    id: ev.id,
    nombre: ev.nombre,
    pesoFormateado: ev.peso_formateado,
    fechaSubidaTexto: `Subido el ${formatearFechaCorta(ev.fecha_subida)}`,
    tipoIcono: obtenerTipoIconoArchivo(ev.nombre),
    estaDescargando: false,
    onDescargar: () => onDescargarArchivo(ev.id),
  }));

  let resolucionTexto = 'Devuelta al Contralor';
  if (dto.resolucion_estado === 'APROBADA' || dto.resolucion_estado === 'AUTORIZADA') {
    resolucionTexto = 'Aprobada por Jefatura';
  } else if (dto.resolucion_estado === 'EN_REVISION') {
    resolucionTexto = 'Enviada a Revisión';
  }

  return {
    versionNumero: dto.version_visualizada,
    fechaEnvioTexto: formatearFechaConHora(dto.fecha_envio_contralor),
    comentarioEnvioContralor: dto.mensaje_envio,
    evidencias: evidenciasUI,
    resolucionJefaturaTexto: resolucionTexto,
    fechaDictamenTexto: dto.fecha_dictamen
      ? formatearFechaConHora(dto.fecha_dictamen)
      : null,
    observacionesHistoricas: (dto.observaciones || []).map((o) => ({
      id: o.id,
      numero: o.numero,
      texto: o.texto,
    })),
  };
};

