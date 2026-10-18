// frontend/src/store/poa-supervision.store.ts
// Este archivo contiene el estado global de Zustand para la pantalla de Supervisión y Dictamen de POAs (Rol: Jefa).
// Administra:
// 1. Los KPIs globales y el listado de centros universitarios con su histórico de años.
// 2. Filtros por estado (Todos, Por autorizar, Devueltas, Autorizadas) y búsqueda textual en tiempo real.
// 3. El Inspector de POA seleccionado con acordeones de actividades (lazy loading de fichas técnicas y subactividades).
// 4. El toggle entre modo de visualización incrustado y pantalla completa (pestaña dedicada).
// 5. El modal y flujo de devolución con observaciones obligatorias.
// 6. El dictamen oficial de aprobación / autorización de POAs.
// En palabras sencillas: Este archivo es como el "cerebro" que mantiene toda la información y acciones de la pantalla de supervisión de POAs. Guarda los datos, maneja los filtros, controla qué centro y actividad se está viendo, y coordina las acciones de devolver o autorizar un POA.

import { create } from 'zustand';
import * as PoaApi from '../types/poa-api';
import {
  KpisSupervisionPoasUI,
  TarjetaCentroPoaProps,
  InspectorPoaSupervisionProps,
  FiltroEstadoPoaJefa,
  ModoVisualizacionSupervision,
  FichaTecnicaExpandida,
  SubactividadFilaProps,
} from '../types/poa-contratos';
import { poaSupervisionService } from '../services/poa-supervision.service';
import {
  adaptarKpisSupervisionUI,
  adaptarTarjetaCentroPoaUI,
  adaptarInspectorPoaSupervisionUI,
  adaptarFichaTecnicaUI,
  adaptarSubactividadesUI,
  filtrarCentrosSupervision,
} from '../services/poa-supervision.adapter';

interface DetalleActividadCache {
  fichaTecnica?: FichaTecnicaExpandida;
  subactividades?: SubactividadFilaProps[];
  cargando?: boolean;
  error?: string | null;
}

interface PoaSupervisionState {
  // --- A. DATOS DEL LISTADO DE CENTROS ---
  kpis: KpisSupervisionPoasUI;
  centrosRaw: PoaApi.CentroSupervisionPoaDto[];
  estaCargandoCentros: boolean;
  mensajeError: string | null;

  // --- B. FILTROS Y BÚSQUEDA ---
  filtroEstado: FiltroEstadoPoaJefa;
  busquedaTexto: string;
  anioGlobal: number;
  aniosDisponibles: number[];

  // --- C. CENTRO SELECCIONADO E HISTÓRICO ---
  idCentroSeleccionado: string | null;
  aniosPorCentro: Record<string, number>; // idCentro -> anioSeleccionado

  // --- D. DETALLE DEL POA SELECCIONADO (INSPECTOR) ---
  poaDetalle: PoaApi.CentroPoaDetalleResponseDto | null;
  cargandoPoaDetalle: boolean;
  errorPoaDetalle: string | null;

  // --- E. ACORDEÓN DE ACTIVIDADES (LAZY LOADING) ---
  actividadesExpandidas: Record<string, boolean>; // idActividad -> estaExpandida
  detallesActividadesCache: Record<string, DetalleActividadCache>; // idActividad -> ficha y subactividades

  // --- F. MODO DE VISUALIZACIÓN ---
  modoVisualizacion: ModoVisualizacionSupervision;

  // --- G. MODAL DE DEVOLUCIÓN CON OBSERVACIONES ---
  modalDevolverAbierto: boolean;
  observacionesDevolucion: string;
  errorObservaciones: string | null;
  estaDevolviendo: boolean;

  // --- H. DICTAMEN DE AUTORIZACIÓN ---
  estaAutorizando: boolean;

  // --- ACCIONES ---
  cargarCentros: (historicLimit?: number) => Promise<void>;
  setFiltroEstado: (filtro: FiltroEstadoPoaJefa) => void;
  setBusquedaTexto: (texto: string) => void;
  setAnioGlobal: (anio: number) => void;
  seleccionarCentro: (idCentro: string) => Promise<void>;
  cambiarAnioCentro: (idCentro: string, anio: number) => Promise<void>;
  cargarPoaCentro: (idCentro: string, anio?: number) => Promise<void>;

  toggleExpandirActividad: (actividadId: string) => Promise<void>;

  setModoVisualizacion: (modo: ModoVisualizacionSupervision) => void;
  alternarModoVisualizacion: () => void;

  abrirModalDevolver: () => void;
  cerrarModalDevolver: () => void;
  setObservacionesDevolucion: (obs: string) => void;
  confirmarDevolverPoa: () => Promise<boolean>;

  autorizarPoaActual: () => Promise<boolean>;

  // --- COMPUTED GETTERS ---
  obtenerCentrosFiltradosUI: () => TarjetaCentroPoaProps[];
  obtenerInspectorPoaUI: () => InspectorPoaSupervisionProps | null;
}

export const usePoaSupervisionStore = create<PoaSupervisionState>((set, get) => ({
  // Estado inicial
  kpis: {
    totalCentros: 0,
    porAutorizar: 0,
    devueltas: 0,
    autorizadas: 0,
  },
  centrosRaw: [],
  estaCargandoCentros: true,
  mensajeError: null,

  filtroEstado: 'TODOS',
  busquedaTexto: '',
  anioGlobal: new Date().getFullYear(),
  aniosDisponibles: [new Date().getFullYear(), new Date().getFullYear() - 1],

  idCentroSeleccionado: null,
  aniosPorCentro: {},

  poaDetalle: null,
  cargandoPoaDetalle: false,
  errorPoaDetalle: null,

  actividadesExpandidas: {},
  detallesActividadesCache: {},

  modoVisualizacion: 'INCRUSTADA',

  modalDevolverAbierto: false,
  observacionesDevolucion: '',
  errorObservaciones: null,
  estaDevolviendo: false,

  estaAutorizando: false,

  // 1. Cargar lista de centros y KPIs
  cargarCentros: async (historicLimit = 3) => {
    set({ estaCargandoCentros: true, mensajeError: null });
    try {
      const respuesta = await poaSupervisionService.obtenerCentrosSupervision(historicLimit);
      const kpisAdaptados = adaptarKpisSupervisionUI(respuesta.kpis_globales);

      // Extraer años disponibles a partir del histórico de todos los centros
      const aniosSet = new Set<number>();
      const anioActual = new Date().getFullYear();
      aniosSet.add(anioActual);

      const mapaAnios: Record<string, number> = {};

      (respuesta.centros || []).forEach((c) => {
        const anioCentro = c.poa_resumen_anio_actual?.anio_fiscal || anioActual;
        mapaAnios[c.id] = anioCentro;
        aniosSet.add(anioCentro);
        (c.anios_historicos || []).forEach((a) => aniosSet.add(a));
      });

      const aniosArray = Array.from(aniosSet).sort((a, b) => b - a);
      const centros = respuesta.centros || [];

      // Seleccionar por defecto el primer centro si no había uno seleccionado
      const primerCentroId = centros.length > 0 ? centros[0].id : null;
      const idSeleccionado = get().idCentroSeleccionado || primerCentroId;

      set({
        kpis: kpisAdaptados,
        centrosRaw: centros,
        aniosDisponibles: aniosArray,
        aniosPorCentro: mapaAnios,
        idCentroSeleccionado: idSeleccionado,
        estaCargandoCentros: false,
      });

      // Cargar el POA del centro seleccionado
      if (idSeleccionado) {
        const anioAConsultar = mapaAnios[idSeleccionado] || anioActual;
        await get().cargarPoaCentro(idSeleccionado, anioAConsultar);
      }
    } catch (error) {
      console.error('Error al cargar centros de supervisión:', error);
      set({
        estaCargandoCentros: false,
        mensajeError: 'No fue posible sincronizar el directorio de centros y POAs.',
      });
    }
  },

  // 2. Filtro rápido de estado
  setFiltroEstado: (filtro) => {
    set({ filtroEstado: filtro });
  },

  // 3. Búsqueda por texto
  setBusquedaTexto: (texto) => {
    set({ busquedaTexto: texto });
  },

  // 4. Selector global de año
  setAnioGlobal: (anio) => {
    set({ anioGlobal: anio });
  },

  // 5. Seleccionar un centro para inspección
  seleccionarCentro: async (idCentro) => {
    if (get().idCentroSeleccionado === idCentro && get().poaDetalle) {
      return; // Ya está cargado
    }

    set({ idCentroSeleccionado: idCentro });
    const anio = get().aniosPorCentro[idCentro] || get().anioGlobal;
    await get().cargarPoaCentro(idCentro, anio);
  },

  // 6. Cambiar el año histórico consultado de una tarjeta de centro
  cambiarAnioCentro: async (idCentro, anio) => {
    set((state) => ({
      aniosPorCentro: {
        ...state.aniosPorCentro,
        [idCentro]: anio,
      },
    }));

    // Si el centro que cambió de año es el que se está inspeccionando actualmente, recargar su POA
    if (get().idCentroSeleccionado === idCentro) {
      await get().cargarPoaCentro(idCentro, anio);
    }
  },

  // 7. Cargar el POA detallado de un centro y año específico
  cargarPoaCentro: async (centroId, anio) => {
    set({
      cargandoPoaDetalle: true,
      errorPoaDetalle: null,
      actividadesExpandidas: {},
      detallesActividadesCache: {},
    });

    try {
      const detalle = await poaSupervisionService.obtenerPoaPorCentro(centroId, anio);
      set({
        poaDetalle: detalle,
        cargandoPoaDetalle: false,
      });
    } catch (error) {
      console.error(`Error al cargar detalle del POA para centro ${centroId}:`, error);
      set({
        cargandoPoaDetalle: false,
        errorPoaDetalle: 'No fue posible cargar el Plan Operativo Anual seleccionado.',
      });
    }
  },

  // 8. Toggle de acordeón de actividades con Lazy Loading de Ficha Técnica y Subactividades
  toggleExpandirActividad: async (actividadId) => {
    const expandidaActualmente = Boolean(get().actividadesExpandidas[actividadId]);

    // Si ya estaba expandida, colapsar
    if (expandidaActualmente) {
      set((state) => ({
        actividadesExpandidas: {
          ...state.actividadesExpandidas,
          [actividadId]: false,
        },
      }));
      return;
    }

    // Si no estaba expandida y ya tenemos los datos en caché, expandir inmediatamente
    const cacheActual = get().detallesActividadesCache[actividadId];
    if (cacheActual?.fichaTecnica && cacheActual?.subactividades) {
      set((state) => ({
        actividadesExpandidas: {
          ...state.actividadesExpandidas,
          [actividadId]: true,
        },
      }));
      return;
    }

    // Si no están en caché, marcar como cargando y expandida
    set((state) => ({
      actividadesExpandidas: {
        ...state.actividadesExpandidas,
        [actividadId]: true,
      },
      detallesActividadesCache: {
        ...state.detallesActividadesCache,
        [actividadId]: { cargando: true },
      },
    }));

    try {
      // Peticiones concurrentes a Ficha Técnica y Subactividades
      const [fichaRes, subactividadesRes] = await Promise.all([
        poaSupervisionService.obtenerFichaTecnicaActividad(actividadId),
        poaSupervisionService.obtenerSubactividadesPoa(actividadId),
      ]);

      const fichaUI = adaptarFichaTecnicaUI(fichaRes);
      const subactividadesUI = adaptarSubactividadesUI(subactividadesRes);

      set((state) => ({
        detallesActividadesCache: {
          ...state.detallesActividadesCache,
          [actividadId]: {
            fichaTecnica: fichaUI,
            subactividades: subactividadesUI,
            cargando: false,
          },
        },
      }));
    } catch (error) {
      console.error(`Error al cargar ficha y subactividades de ${actividadId}:`, error);
      set((state) => ({
        detallesActividadesCache: {
          ...state.detallesActividadesCache,
          [actividadId]: {
            cargando: false,
            error: 'Error al recuperar detalles de la actividad.',
          },
        },
      }));
    }
  },

  // 9. Modo de visualización (Incrustada vs Pantalla Completa)
  setModoVisualizacion: (modo) => {
    set({ modoVisualizacion: modo });
  },

  alternarModoVisualizacion: () => {
    set((state) => ({
      modoVisualizacion:
        state.modoVisualizacion === 'INCRUSTADA'
          ? 'PANTALLA_COMPLETA'
          : 'INCRUSTADA',
    }));
  },

  // 10. Modal Devolver con observaciones
  abrirModalDevolver: () => {
    set({
      modalDevolverAbierto: true,
      observacionesDevolucion: '',
      errorObservaciones: null,
      estaDevolviendo: false,
    });
  },

  cerrarModalDevolver: () => {
    set({
      modalDevolverAbierto: false,
      errorObservaciones: null,
      estaDevolviendo: false,
    });
  },

  setObservacionesDevolucion: (obs) => {
    set({
      observacionesDevolucion: obs,
      errorObservaciones: obs.trim() ? null : get().errorObservaciones,
    });
  },

  confirmarDevolverPoa: async () => {
    const poaId = get().poaDetalle?.poa.id;
    const observaciones = get().observacionesDevolucion.trim();

    if (!poaId) {
      set({ errorObservaciones: 'No hay un POA seleccionado para dictaminar.' });
      return false;
    }

    if (!observaciones) {
      set({
        errorObservaciones:
          'Es obligatorio ingresar las observaciones para devolver el POA al contralor.',
      });
      return false;
    }

    set({ estaDevolviendo: true, errorObservaciones: null });

    try {
      const respuesta = await poaSupervisionService.devolverPoaConObservaciones(
        poaId,
        { observaciones }
      );

      // 1. Actualizar estado local del POA
      set((state) => {
        if (!state.poaDetalle) return state;
        return {
          poaDetalle: {
            ...state.poaDetalle,
            poa: {
              ...state.poaDetalle.poa,
              estado: 'DEVUELTA',
              mensaje_resolucion: observaciones,
            },
          },
        };
      });

      // 2. Actualizar estado en la tarjeta de centros
      const idCentro = get().idCentroSeleccionado;
      if (idCentro) {
        set((state) => ({
          centrosRaw: state.centrosRaw.map((c) => {
            if (c.id !== idCentro) return c;
            return {
              ...c,
              poa_resumen_anio_actual: {
                ...c.poa_resumen_anio_actual,
                estado: 'DEVUELTA',
              },
            };
          }),
          // Actualizar KPIs reactivamente
          kpis: {
            ...state.kpis,
            porAutorizar: Math.max(0, state.kpis.porAutorizar - 1),
            devueltas: state.kpis.devueltas + 1,
          },
        }));
      }

      set({
        modalDevolverAbierto: false,
        estaDevolviendo: false,
        observacionesDevolucion: '',
      });

      return true;
    } catch (error) {
      console.error('Error al devolver POA:', error);
      set({
        estaDevolviendo: false,
        errorObservaciones:
          'Ocurrió un error al procesar la devolución. Intente nuevamente.',
      });
      return false;
    }
  },

  // 11. Autorizar POA
  autorizarPoaActual: async () => {
    const poaId = get().poaDetalle?.poa.id;

    if (!poaId) {
      return false;
    }

    set({ estaAutorizando: true });

    try {
      await poaSupervisionService.autorizarPoa(poaId);

      // 1. Actualizar estado local del POA a AUTORIZADA
      set((state) => {
        if (!state.poaDetalle) return state;
        return {
          poaDetalle: {
            ...state.poaDetalle,
            poa: {
              ...state.poaDetalle.poa,
              estado: 'AUTORIZADA',
            },
          },
        };
      });

      // 2. Actualizar tarjeta de centro y KPIs
      const idCentro = get().idCentroSeleccionado;
      if (idCentro) {
        set((state) => ({
          centrosRaw: state.centrosRaw.map((c) => {
            if (c.id !== idCentro) return c;
            return {
              ...c,
              poa_resumen_anio_actual: {
                ...c.poa_resumen_anio_actual,
                estado: 'AUTORIZADA',
              },
            };
          }),
          kpis: {
            ...state.kpis,
            porAutorizar: Math.max(0, state.kpis.porAutorizar - 1),
            autorizadas: state.kpis.autorizadas + 1,
          },
        }));
      }

      set({ estaAutorizando: false });
      return true;
    } catch (error) {
      console.error('Error al autorizar POA:', error);
      set({ estaAutorizando: false });
      return false;
    }
  },

  // 12. Computed: Obtener lista filtrada de tarjetas de centros con props listas para React
  obtenerCentrosFiltradosUI: () => {
    const state = get();
    const centrosFiltrados = filtrarCentrosSupervision(
      state.centrosRaw,
      state.filtroEstado,
      state.busquedaTexto
    );

    return centrosFiltrados.map((c) => {
      const anioSeleccionado =
        state.aniosPorCentro[c.id] ||
        c.poa_resumen_anio_actual?.anio_fiscal ||
        state.anioGlobal;

      const estaSeleccionado = c.id === state.idCentroSeleccionado;

      return adaptarTarjetaCentroPoaUI(c, anioSeleccionado, estaSeleccionado, {
        onSeleccionarCentro: (id) => void state.seleccionarCentro(id),
        onCambiarAnio: (id, anio) => void state.cambiarAnioCentro(id, anio),
      });
    });
  },

  // 13. Computed: Obtener props completas del Inspector de POA
  obtenerInspectorPoaUI: () => {
    const state = get();
    if (!state.poaDetalle || !state.idCentroSeleccionado) {
      return null;
    }

    return adaptarInspectorPoaSupervisionUI(
      state.poaDetalle,
      state.idCentroSeleccionado,
      state.modoVisualizacion,
      state.actividadesExpandidas,
      state.detallesActividadesCache,
      {
        onToggleExpandirActividad: (id) => void state.toggleExpandirActividad(id),
        onAlternarModoVisualizacion: () => state.alternarModoVisualizacion(),
        onCambiarModoVisualizacion: (modo) => state.setModoVisualizacion(modo),
        onAbrirModalDevolver: () => state.abrirModalDevolver(),
        onAutorizarPoa: () => void state.autorizarPoaActual(),
        modalDevolverProps: {
          estaAbierto: state.modalDevolverAbierto,
          observaciones: state.observacionesDevolucion,
          errorValidacion: state.errorObservaciones,
          estaEnviando: state.estaDevolviendo,
          onChangeObservaciones: (txt) => state.setObservacionesDevolucion(txt),
          onCerrar: () => state.cerrarModalDevolver(),
          onConfirmarDevolucion: () => void state.confirmarDevolverPoa(),
        },
        estaDictaminando: state.estaAutorizando || state.estaDevolviendo,
        estaCargandoPoa: state.cargandoPoaDetalle,
      }
    );
  },
}));

// Re-export amigable como useJefaPoaStore
export const useJefaPoaStore = usePoaSupervisionStore;

