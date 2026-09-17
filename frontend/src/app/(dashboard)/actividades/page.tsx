// frontend/src/app/(dashboard)/actividades/page.tsx
'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useActividadesStore } from '@/store/actividades.store';
import { SemaforoColor } from '@/types/actividades-contratos';
import { useLayoutStore } from '@/store/layout.store';

function DirectorioContenido() {
  useEffect(() => {
  useLayoutStore.getState().setTituloPantalla('Directorio Global de Actividades');
}, []);
  const searchParams = useSearchParams();
  const { 
    actividades, 
    totalRegistros, 
    totalPaginas, 
    cargando, 
    filtros, 
    cargarDirectorio, 
    setFiltro, 
    cambiarPagina, 
    limpiarFiltros 
  } = useActividadesStore();

  useEffect(() => {
    const estadoFlujoParam = searchParams.get('estado_flujo') || undefined;
    const semaforoParam = (searchParams.get('semaforo') as SemaforoColor) || undefined;
    const searchParam = searchParams.get('search') || undefined;

    cargarDirectorio({
      estadoFlujo: estadoFlujoParam,
      semaforo: semaforoParam,
      search: searchParam,
      page: 1
    });
  }, [searchParams, cargarDirectorio]);

  const esVistaJefa = actividades.length > 0 && actividades[0].esVistaJefa;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1600px] mx-auto flex flex-col h-full">
          {/* Barra Superior de Búsqueda y Filtros */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-white z-10 relative">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Input Búsqueda */}
                <div className="flex-1 relative min-w-[300px]">
                  <input
                    type="text"
                    value={filtros.search || ''}
                    onChange={(e) => setFiltro('search', e.target.value)}
                    className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Buscar por título o identificador..."
                  />
                </div>

                {/* Filtros Dropdown */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Selector de Tipo */}
                  <select
                    value={filtros.tipoActividad || ''}
                    onChange={(e) => setFiltro('tipoActividad', (e.target.value as any) || undefined)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-4 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="">Todos los Tipos</option>
                    <option value="AUDITORIA">Auditorías</option>
                    <option value="REVISION">Revisiones</option>
                  </select>

                  {/* Selector de Estado */}
                  <select
                    value={filtros.estadoFlujo || ''}
                    onChange={(e) => setFiltro('estadoFlujo', e.target.value || undefined)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-4 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="">Todos los Estados</option>
                    <option value="EN_PROGRESO">En Progreso</option>
                    <option value="EN_REVISION">Por Revisar</option>
                    <option value="DEVUELTA">Devuelta</option>
                    <option value="CONCLUIDA">Concluida</option>
                    <option value="SIN_EMPEZAR">Sin Empezar</option>
                  </select>

                  {/* Selector de Semáforo */}
                  <select
                    value={filtros.semaforo || ''}
                    onChange={(e) => setFiltro('semaforo', (e.target.value as any) || undefined)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl px-4 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="">Cualquier Semáforo</option>
                    <option value="CRITICO">Rojo (Crítico)</option>
                    <option value="PRECAUCION">Amarillo (Precaución)</option>
                    <option value="A_TIEMPO">Verde (A tiempo)</option>
                  </select>

                  <button
                    onClick={() => limpiarFiltros()}
                    className="text-xs text-slate-500 hover:text-indigo-600 font-bold underline px-2 cursor-pointer"
                  >
                    Restablecer
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla de Resultados */}
            <div className="overflow-x-auto flex-1">
              {cargando ? (
                <div className="py-20 text-center text-indigo-600 font-bold animate-pulse">
                  Consultando directorio...
                </div>
              ) : actividades.length > 0 ? (
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1200px]">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-32">Identificador</th>
                      <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Actividad y Fechas</th>
                      <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-48">Asignación</th>
                      <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-48">Estado Operativo</th>
                      <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-36">Semáforo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {actividades.map((act) => (
                      <tr key={act.id} className="hover:bg-indigo-50/40 transition-colors">
                        <td className="px-8 py-5">
                          <span className="text-base font-black text-slate-800">{act.identificador}</span>
                          <span className={`block mt-1 text-[10px] font-bold px-2 py-0.5 rounded w-max ${
                            act.tipo === 'AUDITORIA' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {act.tipo}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-base font-bold text-slate-800 block truncate max-w-lg">{act.titulo}</span>
                          <span className="text-xs text-slate-400 mt-1 block">Término: {act.fechaTerminoTexto}</span>
                        </td>
                        <td className="px-8 py-5">
                          {esVistaJefa ? (
                            <>
                              <span className="text-sm font-bold text-slate-700 block">{act.centroClave}</span>
                              <span className="text-xs text-slate-500">{act.nombreContralor}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-sm font-bold text-slate-700 block">
                                {act.participacionPorcentaje}% Participación
                              </span>
                              <span className="text-xs text-slate-500">{act.auditorApoyo || 'Sin apoyo'}</span>
                            </>
                          )}
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {act.estadoEtiqueta}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${
                            act.semaforo === 'CRITICO' 
                              ? 'bg-red-100 text-red-700' 
                              : act.semaforo === 'PRECAUCION' 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {act.semaforo}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-20 text-center text-slate-400 italic">
                  No se encontraron actividades con los filtros seleccionados.
                </div>
              )}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center text-sm">
                <span className="text-slate-500">
                  Total: <strong>{totalRegistros}</strong> registros
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={(filtros.page || 1) <= 1}
                    onClick={() => cambiarPagina((filtros.page || 1) - 1)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold disabled:opacity-40"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-indigo-600">
                    Página {filtros.page || 1} de {totalPaginas}
                  </span>
                  <button
                    disabled={(filtros.page || 1) >= totalPaginas}
                    onClick={() => cambiarPagina((filtros.page || 1) + 1)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold disabled:opacity-40"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ActividadesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-indigo-600 font-bold">Cargando módulo...</div>}>
      <DirectorioContenido />
    </Suspense>
  );
}