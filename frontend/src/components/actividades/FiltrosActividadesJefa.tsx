'use client';

import type {
  ActividadesDirectorioFiltros,
  CentroUI,
} from '@/types/actividades-contratos';

const ESTADO_OPCIONES: Record<string, string> = {
  SIN_EMPEZAR: 'Sin Empezar',
  SOLICITADO: 'Por Autorizar',
  EN_PROGRESO: 'En Proceso',
  EN_REVISION: 'Por Revisar',
  DEVUELTA: 'Devuelta',
  CONCLUIDA: 'Concluida',
};

interface FiltrosActividadesJefaProps {
  busqueda: string;
  centros: CentroUI[];
  filtros: ActividadesDirectorioFiltros;
  filtrosActivos: string[];
  onBusquedaChange: (valor: string) => void;
  onFiltroChange: (
    nombre: 'centroUuid' | 'tipoActividad' | 'estadoFlujo' | 'semaforo',
    valor: string,
  ) => void;
  onOrdenarChange: (valor: string) => void;
  onQuitarFiltro: (filtroEtiqueta: string) => void;
  onLimpiarTodos: () => void;
}

export function FiltrosActividadesJefa({
  busqueda,
  centros,
  filtros,
  filtrosActivos,
  onBusquedaChange,
  onFiltroChange,
  onOrdenarChange,
  onQuitarFiltro,
  onLimpiarTodos,
}: FiltrosActividadesJefaProps) {
  return (
    <div className="border-b border-slate-100 bg-white p-5">
      <div className="grid gap-3 xl:grid-cols-[minmax(240px,1fr)_repeat(5,minmax(145px,auto))]">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg
              className="h-4 w-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={busqueda}
            onChange={(event) => onBusquedaChange(event.target.value)}
            placeholder="Buscar por título, identificador o descripción..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <select
          value={filtros.centroUuid}
          onChange={(event) => onFiltroChange('centroUuid', event.target.value)}
          aria-label="Filtrar por centro universitario"
          className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Todos los Centros</option>
          {centros.map((centro) => (
            <option key={centro.id} value={centro.id}>
              {centro.clave}
            </option>
          ))}
        </select>

        <select
          value={filtros.tipoActividad}
          onChange={(event) => onFiltroChange('tipoActividad', event.target.value)}
          aria-label="Filtrar por tipo de actividad"
          className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Tipo de Actividad</option>
          <option value="AUDITORIA">Auditorías</option>
          <option value="REVISION">Revisiones</option>
        </select>

        <select
          value={filtros.estadoFlujo}
          onChange={(event) => onFiltroChange('estadoFlujo', event.target.value)}
          aria-label="Filtrar por estado de flujo"
          className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Estado de Flujo</option>
          {Object.entries(ESTADO_OPCIONES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={filtros.semaforo}
          onChange={(event) => onFiltroChange('semaforo', event.target.value)}
          aria-label="Filtrar por estado del semáforo"
          className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Estado del Semáforo</option>
          <option value="CRITICO">Crítico</option>
          <option value="PRECAUCION">En Alerta</option>
          <option value="A_TIEMPO">A Tiempo</option>
        </select>

        <select
          value={filtros.ordenarPor}
          onChange={(event) => onOrdenarChange(event.target.value)}
          aria-label="Ordenar actividades"
          className="cursor-pointer rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-3 text-sm font-bold text-indigo-700 outline-none transition focus:border-indigo-300"
        >
          <option value="ESTADO_FLUJO">Ordenar: Estado</option>
          <option value="IDENTIFICADOR">Ordenar: Identificador</option>
          <option value="FECHA_TERMINO">Ordenar: Fecha término</option>
        </select>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Filtros aplicados:
        </span>
        {filtrosActivos.length > 0 ? (
          <>
            {filtrosActivos.map((filtro) => (
              <span
                key={filtro}
                className="inline-flex items-center rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700"
              >
                {filtro}
                <button
                  type="button"
                  onClick={() => onQuitarFiltro(filtro)}
                  aria-label={`Quitar filtro ${filtro}`}
                  className="ml-2 text-indigo-400 transition hover:text-indigo-700"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={onLimpiarTodos}
              className="ml-1 text-xs font-bold text-slate-400 underline transition hover:text-indigo-600"
            >
              Limpiar todos
            </button>
          </>
        ) : (
          <span className="text-xs font-medium text-slate-400">
            Sin filtros activos
          </span>
        )}
      </div>
    </div>
  );
}