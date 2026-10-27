// frontend/src/services/poa-supervision.adapter.ts
// Este archivo contiene las funciones traductoras para transformar los datos crudos del backend de supervisión de POAs
// a las props limpias y listas que consumen los componentes visuales de la Jefa (Rogelio).

import * as PoaApi from '../types/poa-api';
import {
  EstadoPOA,
  KpisSupervisionPoasUI,
  PoaResumenCentroUI,
  TarjetaCentroPoaProps,
  ActividadSupervisionPoaProps,
  InspectorPoaSupervisionProps,
  BarraDictamenPoaProps,
  ModalDevolverPoaProps,
  ModoVisualizacionSupervision,
  FiltroEstadoPoaJefa,
  FichaTecnicaExpandida,
  SubactividadFilaProps,
} from '../types/poa-contratos';
import { adaptarFichaTecnicaUI, adaptarSubactividadesUI } from './poa.adapter';

const MESES_ABREV = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

/**
 * Formatea fechas a texto amigable corto (ej. "Ene 2026", "10 Ago 2026")
 */
export const formatearFechaLegible = (fechaStr?: string | null): string => {
  if (!fechaStr) return 'Sin fecha';
  const fecha = new Date(fechaStr);
  if (Number.isNaN(fecha.getTime())) return fechaStr;

  const dia = fecha.getUTCDate();
  const mes = MESES_ABREV[fecha.getUTCMonth()];
  const anio = fecha.getUTCFullYear();

  // Si solo incluye año y mes (o primer día del mes), formato "Mes Año"
  if (fechaStr.length <= 7) {
    return `${mes} ${anio}`;
  }
  return `${dia} ${mes} ${anio}`;
};

/**
 * Formatea fechas relativas/amigables para el resumen de la tarjeta (ej. "Hoy, 09:30 AM", "10 Ago 2026")
 */
export const formatearFechaEnvioDictamen = (
  fechaStr?: string | null
): string => {
  if (!fechaStr) return 'Sin registro';
  const fecha = new Date(fechaStr);
  if (Number.isNaN(fecha.getTime())) return fechaStr;

  const ahora = new Date();
  const esMismoDia =
    fecha.getFullYear() === ahora.getFullYear() &&
    fecha.getMonth() === ahora.getMonth() &&
    fecha.getDate() === ahora.getDate();

  const horas = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  const periodo = fecha.getHours() >= 12 ? 'PM' : 'AM';

  if (esMismoDia) {
    return `Hoy, ${horas}:${minutos} ${periodo}`;
  }

  const dia = fecha.getDate();
  const mes = MESES_ABREV[fecha.getMonth()];
  const anio = fecha.getFullYear();
  return `${dia} ${mes} ${anio}`;
};

/**
 * Normaliza el estado que envía el backend hacia el enum visual del frontend
 */
export const normalizarEstadoPoa = (
  estadoRaw?: string | null
): {
  estado: EstadoPOA;
  estadoEtiqueta: string;
  estadoBadgeColor: 'purple' | 'amber' | 'emerald' | 'slate';
  etiquetaFecha: string;
} => {
  const estadoUpper = (estadoRaw || '').toUpperCase();

  if (estadoUpper === 'AUTORIZADO' || estadoUpper === 'AUTORIZADA') {
    return {
      estado: 'AUTORIZADA',
      estadoEtiqueta: 'Autorizado',
      estadoBadgeColor: 'emerald',
      etiquetaFecha: 'Autorizado el:',
    };
  }

  if (estadoUpper === 'DEVUELTA' || estadoUpper === 'DEVUELTO') {
    return {
      estado: 'DEVUELTA',
      estadoEtiqueta: 'Devuelto (Obs)',
      estadoBadgeColor: 'amber',
      etiquetaFecha: 'Devuelto el:',
    };
  }

  if (estadoUpper === 'EN_REVISION' || estadoUpper === 'SOLICITADO') {
    return {
      estado: 'EN_REVISION',
      estadoEtiqueta: 'En Revisión',
      estadoBadgeColor: 'purple',
      etiquetaFecha: 'Recibido para dictamen:',
    };
  }

  return {
    estado: 'BORRADOR',
    estadoEtiqueta: 'Borrador',
    estadoBadgeColor: 'slate',
    etiquetaFecha: 'Última actualización:',
  };
};

/**
 * 1. Adapta los KPIs globales de la barra superior
 */
export const adaptarKpisSupervisionUI = (
  kpisDto?: PoaApi.KpisGlobalesPoasDto | null
): KpisSupervisionPoasUI => {
  if (!kpisDto) {
    return {
      totalCentros: 0,
      porAutorizar: 0,
      devueltas: 0,
      autorizadas: 0,
    };
  }

  return {
    totalCentros: kpisDto.total_centros || 0,
    porAutorizar: kpisDto.por_autorizar || 0,
    devueltas: kpisDto.devueltas || 0,
    autorizadas: kpisDto.autorizadas || 0,
  };
};

/**
 * 2. Adapta el resumen del POA para una tarjeta individual de centro
 */
export const adaptarPoaResumenCentroUI = (
  resumenDto: PoaApi.PoaResumenAnioActualDto
): PoaResumenCentroUI => {
  const meta = normalizarEstadoPoa(resumenDto.estado);
  const fechaTexto = formatearFechaEnvioDictamen(resumenDto.fecha_envio);

  return {
    idPoa: resumenDto.id,
    anioFiscal: resumenDto.anio_fiscal,
    estado: meta.estado,
    estadoEtiqueta: meta.estadoEtiqueta,
    estadoBadgeColor: meta.estadoBadgeColor,
    fechaTexto,
    etiquetaFecha: meta.etiquetaFecha,
    porcentajeAvanceGlobal: resumenDto.porcentaje_avance_global ?? null,
  };
};

/**
 * 3. Adapta un Centro Universitario a las props de su Tarjeta en la cuadrícula comprimida
 */
export const adaptarTarjetaCentroPoaUI = (
  dto: PoaApi.CentroSupervisionPoaDto,
  anioSeleccionado: number,
  estaSeleccionado: boolean,
  callbacks?: {
    onSeleccionarCentro?: (id: string) => void;
    onCambiarAnio?: (id: string, anio: number) => void;
  }
): TarjetaCentroPoaProps => {
  const contralorNombre =
    dto.contralor ||
    dto.contralor_actual?.nombre_completo ||
    'Sin asignar';

  const contralorEstatus = dto.contralor_actual?.estatus || 'Activo';
  const anios =
    dto.anios_historicos && dto.anios_historicos.length > 0
      ? dto.anios_historicos
      : [anioSeleccionado];

  return {
    idCentro: dto.id,
    clave: dto.clave,
    nombre: dto.nombre,
    contralorNombre,
    contralorEstatus,
    aniosHistoricos: anios,
    anioSeleccionado,
    poaResumen: adaptarPoaResumenCentroUI(dto.poa_resumen_anio_actual),
    estaSeleccionado,
    onSeleccionarCentro: (id) => callbacks?.onSeleccionarCentro?.(id),
    onCambiarAnio: (id, anio) => callbacks?.onCambiarAnio?.(id, anio),
  };
};

/**
 * 4. Adapta una actividad principal a su fila correspondiente en el acordeón del Inspector
 */
export const adaptarActividadSupervisionUI = (
  actDto: PoaApi.ActividadResumenSupervisionDto,
  estaExpandida: boolean,
  estaCargandoDetalles: boolean,
  detallesCargados?: {
    fichaTecnica?: FichaTecnicaExpandida;
    subactividades?: SubactividadFilaProps[];
  },
  onToggleExpandir?: () => void
): ActividadSupervisionPoaProps => {
  const fInicio = formatearFechaLegible(actDto.fecha_inicio);
  const fTermino = formatearFechaLegible(actDto.fecha_termino);
  const avance =
    actDto.porcentaje_participacion ?? actDto.porcentaje_global ?? 0;

  return {
    idActividad: actDto.id,
    folio: actDto.folio,
    titulo: actDto.titulo,
    fechaInicioFormateada: fInicio,
    fechaTerminoFormateada: fTermino,
    rangoFechasTexto: `${fInicio} — ${fTermino}`,
    porcentajeAvance: avance,
    auditores: actDto.auditores || [],
    estaExpandida,
    estaCargandoDetalles,
    fichaTecnica: detallesCargados?.fichaTecnica,
    subactividades: detallesCargados?.subactividades,
    onToggleExpandir: () => onToggleExpandir?.(),
  };
};

/**
 * 5. Adapta la respuesta completa de un POA a las props del componente Inspector
 */
export const adaptarInspectorPoaSupervisionUI = (
  detalleDto: PoaApi.CentroPoaDetalleResponseDto,
  idCentro: string,
  modoVisualizacion: ModoVisualizacionSupervision = 'INCRUSTADA',
  actividadesExpandidas: Record<string, boolean> = {},
  actividadesDetalles: Record<
    string,
    {
      fichaTecnica?: FichaTecnicaExpandida;
      subactividades?: SubactividadFilaProps[];
      cargando?: boolean;
    }
  > = {},
  handlers?: {
    onToggleExpandirActividad?: (actividadId: string) => void;
    onAlternarModoVisualizacion?: () => void;
    onCerrarInspector?: () => void;
    onCambiarModoVisualizacion?: (modo: ModoVisualizacionSupervision) => void;
    onAbrirModalDevolver?: () => void;
    onAutorizarPoa?: () => void | Promise<void>;
    modalDevolverProps?: Partial<ModalDevolverPoaProps>;
    estaDictaminando?: boolean;
    estaCargandoPoa?: boolean;
  }
): InspectorPoaSupervisionProps => {
  const poa = detalleDto.poa;
  const meta = normalizarEstadoPoa(poa.estado);

  const actividadesUI: ActividadSupervisionPoaProps[] = (
    detalleDto.actividades || []
  ).map((act) => {
    const estaExpandida = Boolean(actividadesExpandidas[act.id]);
    const cache = actividadesDetalles[act.id];

    return adaptarActividadSupervisionUI(
      act,
      estaExpandida,
      Boolean(cache?.cargando),
      cache,
      () => handlers?.onToggleExpandirActividad?.(act.id)
    );
  });

  const barraDictamen: BarraDictamenPoaProps = {
    centroClave: poa.centro?.clave || '',
    anioFiscal: poa.anio_fiscal,
    estadoPoa: meta.estado,
    puedeDictaminar: meta.estado === 'EN_REVISION',
    estaDictaminando: Boolean(handlers?.estaDictaminando),
    onAbrirModalDevolver: () => handlers?.onAbrirModalDevolver?.(),
    onAutorizarPoa: () => handlers?.onAutorizarPoa?.(),
  };

  const modalDevolver: ModalDevolverPoaProps = {
    estaAbierto: Boolean(handlers?.modalDevolverProps?.estaAbierto),
    centroClave: poa.centro?.clave || '',
    centroNombre: poa.centro?.nombre || '',
    anioFiscal: poa.anio_fiscal,
    contralorNombre: poa.contralor?.nombre_completo || 'Sin asignar',
    observaciones: handlers?.modalDevolverProps?.observaciones || '',
    errorValidacion: handlers?.modalDevolverProps?.errorValidacion,
    estaEnviando: Boolean(handlers?.modalDevolverProps?.estaEnviando),
    onChangeObservaciones: (txt) =>
      handlers?.modalDevolverProps?.onChangeObservaciones?.(txt),
    onCerrar: () => handlers?.modalDevolverProps?.onCerrar?.(),
    onConfirmarDevolucion: () =>
      handlers?.modalDevolverProps?.onConfirmarDevolucion?.(),
  };

  return {
    idCentro,
    centroClave: poa.centro?.clave || '',
    centroNombre: poa.centro?.nombre || '',
    contralorNombre: poa.contralor?.nombre_completo || 'Sin asignar',
    idPoa: poa.id,
    anioFiscal: poa.anio_fiscal,
    estadoPoa: meta.estado,
    estadoEtiqueta: meta.estadoEtiqueta,
    mensajeResolucion: poa.mensaje_resolucion,
    totalActividades: detalleDto.actividades?.length || 0,
    actividades: actividadesUI,
    modoVisualizacion,
    onCambiarModoVisualizacion: (modo) =>
      handlers?.onCambiarModoVisualizacion?.(modo),
    onAlternarModoVisualizacion: () => handlers?.onAlternarModoVisualizacion?.(),
    onCerrarInspector: () => handlers?.onCerrarInspector?.(),
    barraDictamen,
    modalDevolver,
    estaCargandoPoa: Boolean(handlers?.estaCargandoPoa),
  };
};

/**
 * 6. Aplica los filtros rápidos (Todos, Por autorizar, Devueltas, Autorizadas) y búsqueda textual
 */
export const filtrarCentrosSupervision = (
  centros: PoaApi.CentroSupervisionPoaDto[],
  filtroEstado: FiltroEstadoPoaJefa,
  busquedaTexto: string
): PoaApi.CentroSupervisionPoaDto[] => {
  return centros.filter((centro) => {
    // 1. Filtro por estado
    const estadoPoa = (
      centro.poa_resumen_anio_actual?.estado || ''
    ).toUpperCase();

    if (filtroEstado === 'POR_AUTORIZAR') {
      if (estadoPoa !== 'EN_REVISION' && estadoPoa !== 'SOLICITADO') return false;
    } else if (filtroEstado === 'DEVUELTAS') {
      if (estadoPoa !== 'DEVUELTA' && estadoPoa !== 'DEVUELTO') return false;
    } else if (filtroEstado === 'AUTORIZADAS') {
      if (estadoPoa !== 'AUTORIZADO' && estadoPoa !== 'AUTORIZADA') return false;
    }

    // 2. Filtro por búsqueda textual (clave, nombre o contralor)
    if (busquedaTexto && busquedaTexto.trim() !== '') {
      const q = busquedaTexto.toLowerCase().trim();
      const clave = (centro.clave || '').toLowerCase();
      const nombre = (centro.nombre || '').toLowerCase();
      const contralor = (
        centro.contralor ||
        centro.contralor_actual?.nombre_completo ||
        ''
      ).toLowerCase();

      return clave.includes(q) || nombre.includes(q) || contralor.includes(q);
    }

    return true;
  });
};

export { adaptarFichaTecnicaUI, adaptarSubactividadesUI };

