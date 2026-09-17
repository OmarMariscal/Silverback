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