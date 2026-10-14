// frontend/src/store/actividades.store.ts
// Este archivo contiene el estado global de las actividades usando Zustand. Define cómo se almacenan y actualizan los datos del directorio de actividades, los centros asociados y los filtros aplicados.
// En palabras sencillas: Este archivo es como un "almacén central" para los datos de actividades. Permite que cualquier componente de la aplicación acceda a estos datos y los actualice de manera consistente, sin tener que pasar props por todos lados.

import { create } from 'zustand';
import { actividadesService } from '@/services/actividades.service';
import type { ActividadesDirectorioQuery } from '@/types/actividades-api';
import type {
  ActividadDirectorioUI,
  ActividadResumenUI,
  ActividadesDirectorioFiltros,
  CentroUI,
} from '@/types/actividades-contratos';
import { obtenerRolActivo } from '@/services/api';
import { adaptarCentrosUI, adaptarDirectorioActividadesUI, adaptarResumenActividadUI } from '@/services/actividades.adapter';

const filtrosIniciales: ActividadesDirectorioFiltros = {
  busqueda: '',
  centroUuid: '',
  tipoActividad: '',
  estadoFlujo: '',
  semaforo: '',
  ordenarPor: 'ESTADO_FLUJO',
};

interface ActividadesState {
  actividades: ActividadDirectorioUI[];
  centros: CentroUI[];
  actividadDetalle: ActividadResumenUI | null;
  actividadDetalleSolicitadaId: string | null;
  cargandoDetalle: boolean;
  errorDetalle: string | null;
  filtros: ActividadesDirectorioFiltros;
  paginaActual: number;
  totalPaginas: number;
  totalRegistros: number;
  limite: number;
  estaCargando: boolean;
  mensajeError: string | null;
  cargarCentros: () => Promise<void>;
  cargarDirectorio: (busqueda?: string) => Promise<void>;
  cargarResumenActividad: (actividadId: string) => Promise<void>;
  actualizarFiltro: (filtro: keyof ActividadesDirectorioFiltros, valor: string) => void;
  cambiarPagina: (pagina: number) => void;
  limpiarFiltros: () => void;
}

export const useActividadesStore = create<ActividadesState>((set, get) => ({
  actividades: [],
  centros: [],
  actividadDetalle: null,
  actividadDetalleSolicitadaId: null,
  cargandoDetalle: false,
  errorDetalle: null,
  filtros: filtrosIniciales,
  paginaActual: 1,
  totalPaginas: 1,
  totalRegistros: 0,
  limite: 8,
  estaCargando: true,
  mensajeError: null,

  cargarCentros: async () => {
    try {
      const respuesta = await actividadesService.obtenerCentros();
      set({ centros: adaptarCentrosUI(respuesta.data) });
    } catch (error: unknown) {
      console.error('No se pudo cargar el catálogo de centros.', error);
      set({ mensajeError: 'No se pudo cargar el catálogo de centros.' });
    }
  },

  cargarDirectorio: async (busqueda) => {
    const state = get();
    const filtros = { ...state.filtros, ...(busqueda !== undefined ? { busqueda } : {}) };
    const query: ActividadesDirectorioQuery = {
      page: state.paginaActual,
      limit: state.limite,
      sort_by: filtros.ordenarPor,
      order: 'desc',
      ...(filtros.busqueda ? { search: filtros.busqueda } : {}),
      ...(obtenerRolActivo() === 'JEFA' && filtros.centroUuid ? { centro_uuid: filtros.centroUuid } : {}),
      ...(filtros.tipoActividad ? { tipo_actividad: filtros.tipoActividad as ActividadesDirectorioQuery['tipo_actividad'] } : {}),
      ...(filtros.estadoFlujo ? { estado_flujo: filtros.estadoFlujo as ActividadesDirectorioQuery['estado_flujo'] } : {}),
      ...(filtros.semaforo ? { semaforo: filtros.semaforo as ActividadesDirectorioQuery['semaforo'] } : {}),
    };

    set({ estaCargando: true, mensajeError: null });
    try {
      const respuesta = await actividadesService.obtenerDirectorio(query);
      set({
        actividades: adaptarDirectorioActividadesUI(respuesta.data),
        paginaActual: respuesta.meta.pagina_actual,
        totalPaginas: respuesta.meta.total_paginas,
        totalRegistros: respuesta.meta.total_registros,
        limite: respuesta.meta.limite,
        estaCargando: false,
      });
    } catch (error: unknown) {
      console.error('No se pudo cargar el directorio de actividades.', error);
      set({ estaCargando: false, mensajeError: 'No se pudo cargar el directorio de actividades.' });
    }
  },

  cargarResumenActividad: async (actividadId) => {
    set({
      actividadDetalle: null,
      actividadDetalleSolicitadaId: actividadId,
      cargandoDetalle: true,
      errorDetalle: null,
    });
    try {
      const respuesta = await actividadesService.obtenerResumen(actividadId);
      if (get().actividadDetalleSolicitadaId !== actividadId) return;
      set({
        actividadDetalle: adaptarResumenActividadUI(respuesta),
        cargandoDetalle: false,
      });
    } catch (error: unknown) {
      console.error('No se pudo cargar el resumen de la actividad.', error);
      if (get().actividadDetalleSolicitadaId === actividadId) {
        set({ cargandoDetalle: false, errorDetalle: 'No se pudo cargar el detalle de la actividad.' });
      }
    }
  },

  actualizarFiltro: (filtro, valor) => set((state) => ({ filtros: { ...state.filtros, [filtro]: valor }, paginaActual: 1, mensajeError: null })),
  cambiarPagina: (pagina) => set({ paginaActual: pagina }),
  limpiarFiltros: () => set({ filtros: { ...filtrosIniciales }, paginaActual: 1, mensajeError: null }),
}));
