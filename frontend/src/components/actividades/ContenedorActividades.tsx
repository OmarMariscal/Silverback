'use client';

import type {
  ActividadDirectorioUI,
  ActividadesDirectorioFiltros,
  CentroUI,
} from '@/types/actividades-contratos';
import { FiltrosActividadesContralor } from './FiltrosActividadesContralor';
import { FiltrosActividadesJefa } from './FiltrosActividadesJefa';
import { TablaActividades } from './TablaActividades';
import { PaginacionActividades } from './PaginacionActividades';

interface ContenedorActividadesProps {
  rol: 'CONTRALOR' | 'JEFA';
  actividades: ActividadDirectorioUI[];
  centros?: CentroUI[];
  busqueda: string;
  filtros: ActividadesDirectorioFiltros;
  filtrosActivos: string[];
  paginaActual: number;
  totalPaginas: number;
  totalRegistros: number;
  limite: number;
  estaCargando: boolean;
  mensajeError: string | null;
  onBusquedaChange: (valor: string) => void;
  onFiltroChange: (
    nombre: 'centroUuid' | 'tipoActividad' | 'estadoFlujo' | 'semaforo',
    valor: string,
  ) => void;
  onOrdenarChange: (valor: string) => void;
  onQuitarFiltro: (filtroEtiqueta: string) => void;
  onLimpiarTodos: () => void;
  onSeleccionarActividad: (id: string) => void;
  onCambiarPagina: (pagina: number) => void;
}

export function ContenedorActividades({
  rol,
  actividades,
  centros = [],
  busqueda,
  filtros,
  filtrosActivos,
  paginaActual,
  totalPaginas,
  totalRegistros,
  limite,
  estaCargando,
  mensajeError,
  onBusquedaChange,
  onFiltroChange,
  onOrdenarChange,
  onQuitarFiltro,
  onLimpiarTodos,
  onSeleccionarActividad,
  onCambiarPagina,
}: ContenedorActividadesProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {rol === 'JEFA' ? (
        <FiltrosActividadesJefa
          busqueda={busqueda}
          centros={centros}
          filtros={filtros}
          filtrosActivos={filtrosActivos}
          onBusquedaChange={onBusquedaChange}
          onFiltroChange={onFiltroChange}
          onOrdenarChange={onOrdenarChange}
          onQuitarFiltro={onQuitarFiltro}
          onLimpiarTodos={onLimpiarTodos}
        />
      ) : (
        <FiltrosActividadesContralor
          busqueda={busqueda}
          filtros={filtros}
          filtrosActivos={filtrosActivos}
          onBusquedaChange={onBusquedaChange}
          onFiltroChange={(nombre, valor) => onFiltroChange(nombre, valor)}
          onOrdenarChange={onOrdenarChange}
          onQuitarFiltro={onQuitarFiltro}
          onLimpiarTodos={onLimpiarTodos}
        />
      )}

      {mensajeError && (
        <div
          role="alert"
          className="border-b border-rose-200 bg-rose-50 px-6 py-3.5 text-sm font-medium text-rose-700"
        >
          {mensajeError}
        </div>
      )}

      <TablaActividades
        rol={rol}
        actividades={actividades}
        estaCargando={estaCargando}
        onSeleccionarActividad={onSeleccionarActividad}
      />

      <PaginacionActividades
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        totalRegistros={totalRegistros}
        cantidadEnPagina={actividades.length}
        limite={limite}
        onCambiarPagina={onCambiarPagina}
      />
    </section>
  );
}