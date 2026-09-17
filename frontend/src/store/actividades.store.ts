import { create } from 'zustand';
import { actividadesService } from '@/services/actividades.service';
import { ActividadesDirectorioQuery, ActividadesDirectorioResponse } from '@/types/actividades-api';
import { ActividadesDirectorioFiltros } from '@/types/actividades-contratos';
import { CentroDataDto } from '@/types/poa-api';
import { MOCK_ROLE } from '@/services/api';

const filtrosIniciales: ActividadesDirectorioFiltros = {
  busqueda: '',
  centroUuid: '',
  tipoActividad: '',
  estadoFlujo: '',
  semaforo: '',
  ordenarPor: 'ESTADO_FLUJO',
};

interface ActividadesState {
  actividades: ActividadesDirectorioResponse['data'];
  centros: CentroDataDto[];
  filtros: ActividadesDirectorioFiltros;
  paginaActual: number;
  totalPaginas: number;
  totalRegistros: number;
  limite: number;
  estaCargando: boolean;
  mensajeError: string | null;
  cargarCentros: () => Promise<void>;
  cargarDirectorio: (busqueda?: string) => Promise<void>;
  actualizarFiltro: (filtro: keyof ActividadesDirectorioFiltros, valor: string) => void;
  cambiarPagina: (pagina: number) => void;
  limpiarFiltros: () => void;
}

export const useActividadesStore = create<ActividadesState>((set, get) => ({
  actividades: [],
  centros: [],
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
      set({ centros: respuesta.data });
    } catch {
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
      ...(MOCK_ROLE === 'JEFA' && filtros.centroUuid ? { centro_uuid: filtros.centroUuid } : {}),
      ...(filtros.tipoActividad ? { tipo_actividad: filtros.tipoActividad as ActividadesDirectorioQuery['tipo_actividad'] } : {}),
      ...(filtros.estadoFlujo ? { estado_flujo: filtros.estadoFlujo as ActividadesDirectorioQuery['estado_flujo'] } : {}),
      ...(filtros.semaforo ? { semaforo: filtros.semaforo as ActividadesDirectorioQuery['semaforo'] } : {}),
    };

    set({ estaCargando: true, mensajeError: null });
    try {
      const respuesta = await actividadesService.obtenerDirectorio(query);
      set({ actividades: respuesta.data, paginaActual: respuesta.meta.pagina_actual, totalPaginas: respuesta.meta.total_paginas, totalRegistros: respuesta.meta.total_registros, limite: respuesta.meta.limite, estaCargando: false });
    } catch {
      set({ estaCargando: false, mensajeError: 'No se pudo cargar el directorio de actividades.' });
    }
  },

  actualizarFiltro: (filtro, valor) => set((state) => ({ filtros: { ...state.filtros, [filtro]: valor }, paginaActual: 1, mensajeError: null })),
  cambiarPagina: (pagina) => set({ paginaActual: pagina }),
  limpiarFiltros: () => set({ filtros: { ...filtrosIniciales }, paginaActual: 1, mensajeError: null }),
}));
