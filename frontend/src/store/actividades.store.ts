<<<<<<< HEAD
// frontend/src/store/actividades.store.ts
import { create } from 'zustand';
import { actividadesService } from '../services/actividades.service';
import { adaptarDirectorioUI } from '../services/actividades.adapter';
import { FilaDirectorioUI, FiltrosDirectorio } from '../types/actividades-contratos';

interface ActividadesState {
  // --- ESTADO ---
  actividades: FilaDirectorioUI[];
  totalRegistros: number;
  totalPaginas: number;
  cargando: boolean;
  error: string | null;
  filtros: FiltrosDirectorio;

  // --- ACCIONES ---
  cargarDirectorio: (nuevosFiltros?: Partial<FiltrosDirectorio>) => Promise<void>;
  setFiltro: <K extends keyof FiltrosDirectorio>(clave: K, valor: FiltrosDirectorio[K]) => void;
  cambiarPagina: (pagina: number) => Promise<void>;
  limpiarFiltros: () => Promise<void>;
}

const FILTROS_DEFECTO: FiltrosDirectorio = {
  page: 1,
  limit: 10,
  sortBy: 'FECHA_TERMINO',
  order: 'desc',
  search: '',
  centroUuid: undefined,
  tipoActividad: undefined,
  estadoFlujo: undefined,
  semaforo: undefined
};

export const useActividadesStore = create<ActividadesState>((set, get) => ({
  actividades: [],
  totalRegistros: 0,
  totalPaginas: 1,
  cargando: false,
  error: null,
  filtros: { ...FILTROS_DEFECTO },

  // Carga actividades combinando filtros existentes con los nuevos parámetros
  cargarDirectorio: async (nuevosFiltros?: Partial<FiltrosDirectorio>) => {
    const filtrosActualizados = {
      ...get().filtros,
      ...nuevosFiltros
    };

    set({ cargando: true, error: null, filtros: filtrosActualizados });

    try {
      // El service pide la data limpia sin parámetros extra
      const dataApi = await actividadesService.obtenerDirectorio(filtrosActualizados);
      const adaptado = adaptarDirectorioUI(dataApi);

      // Si se especificó filtro de semáforo, refinamos la lista en memoria
      const itemsFinales = filtrosActualizados.semaforo
        ? adaptado.items.filter((item) => item.semaforo === filtrosActualizados.semaforo)
        : adaptado.items;

      set({
        actividades: itemsFinales,
        totalRegistros: adaptado.total,
        totalPaginas: adaptado.paginas,
        cargando: false
      });
    } catch (err: any) {
      console.error('Error al cargar actividades del directorio:', err);
      set({
        error: 'No se pudieron cargar las actividades. Intenta de nuevo.',
        cargando: false
      });
    }
  },

  // Modifica un filtro individual y reinicia a la página 1
  setFiltro: (clave, valor) => {
    const filtros = { ...get().filtros, [clave]: valor, page: 1 };
    get().cargarDirectorio(filtros);
  },

  // Navegación de paginación
  cambiarPagina: async (pagina: number) => {
    await get().cargarDirectorio({ page: pagina });
  },

  // Restaura todos los controles de búsqueda y filtros a su estado inicial
  limpiarFiltros: async () => {
    set({ filtros: { ...FILTROS_DEFECTO } });
    await get().cargarDirectorio(FILTROS_DEFECTO);
  }
}));
=======
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
>>>>>>> develop
