<<<<<<< HEAD
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
=======
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useActividadesStore } from '@/store/actividades.store';
import { useLayoutStore } from '@/store/layout.store';
import { adaptarDirectorioActividadesUI } from '@/services/actividades.adapter';
import { ActividadDirectorioItemProps } from '@/types/actividades-contratos';

const estadoLabels: Record<string, string> = {
  SIN_EMPEZAR: 'Sin Empezar', SOLICITADO: 'Por Autorizar', EN_PROGRESO: 'En Proceso',
  EN_REVISION: 'Por Revisar', DEVUELTA: 'Devuelta', CONCLUIDA: 'Concluida',
};
const semaforoLabels: Record<string, string> = {
  A_TIEMPO: 'A Tiempo', VERDE: 'A Tiempo', PRECAUCION: 'En Alerta', AMARILLO: 'En Alerta',
  CRITICO: 'Crítico', ROJO: 'Crítico', GRIS: 'N/A',
};
const semaforoColors: Record<string, string> = {
  A_TIEMPO: 'bg-emerald-500', VERDE: 'bg-emerald-500', PRECAUCION: 'bg-amber-400', AMARILLO: 'bg-amber-400',
  CRITICO: 'bg-red-500', ROJO: 'bg-red-500', GRIS: 'bg-slate-300',
};

function fechaCorta(fecha: string) {
  return new Intl.DateTimeFormat('es-MX', { month: 'short', year: 'numeric' }).format(new Date(fecha));
}

function FilaActividad({ actividad, onSeleccionar }: ActividadDirectorioItemProps) {
  const estado = actividad.estado_operativo.codigo;
  const esVistaJefatura = actividad.asignacion.tipo_vista === 'JEFA';
  const asignacionPrincipal = esVistaJefatura
    ? actividad.asignacion.centro_clave || 'Sin centro'
    : `${actividad.asignacion.participacion_porcentaje ?? 0}%`;
  const asignacionSecundaria = esVistaJefatura
    ? actividad.asignacion.contralor || 'Sin contralor'
    : actividad.asignacion.auditor_apoyo || 'Sin auditores asignados';

  return (
    <tr onClick={() => onSeleccionar(actividad.id)} className="group cursor-pointer transition hover:bg-indigo-50/40">
      <td className="px-6 py-5"><strong className="block text-base text-slate-800">{actividad.identificador || 'Sin asignar'}</strong><span className={`mt-2 inline-block rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${actividad.tipo === 'AUDITORIA' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-800'}`}>{actividad.tipo === 'AUDITORIA' ? 'Auditoría' : 'Revisión'}</span></td>
      <td className="max-w-lg px-6 py-5"><strong className="block truncate text-base text-slate-800 group-hover:text-indigo-700">{actividad.titulo}</strong><span className="mt-2 block text-xs text-slate-500">Término POA: {fechaCorta(actividad.fecha_termino)}</span></td>
      <td className="px-6 py-5 text-sm"><strong className="block text-slate-700">{asignacionPrincipal}</strong><span className="mt-1 block max-w-56 truncate text-xs text-slate-500">{asignacionSecundaria}</span></td>
      <td className="px-6 py-5"><span className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-bold ${estado === 'DEVUELTA' ? 'border-red-200 bg-red-50 text-red-700' : estado === 'EN_PROGRESO' ? 'border-blue-200 bg-blue-50 text-blue-700' : estado === 'EN_REVISION' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : estado === 'CONCLUIDA' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>{actividad.estado_operativo.etiqueta || estadoLabels[estado]}</span></td>
      <td className="px-6 py-5"><span className="flex items-center gap-2 text-sm font-bold text-slate-700"><span className={`h-3 w-3 rounded-full ${semaforoColors[actividad.semaforo] || semaforoColors.GRIS}`} />{semaforoLabels[actividad.semaforo] || actividad.semaforo}</span></td>
      <td className="px-6 py-5 text-right text-xl text-slate-400 group-hover:text-indigo-600">›</td>
    </tr>
  );
}

export default function ActividadesPage() {
  const router = useRouter();
  const rolUsuario = useLayoutStore((state) => state.rolUsuario);
  const setTituloPantalla = useLayoutStore((state) => state.setTituloPantalla);
  const { actividades, centros, filtros, paginaActual, totalPaginas, totalRegistros, limite, estaCargando, mensajeError, cargarCentros, cargarDirectorio, actualizarFiltro, cambiarPagina, limpiarFiltros } = useActividadesStore();
  const [busqueda, setBusqueda] = useState(filtros.busqueda);

  useEffect(() => { setTituloPantalla('Directorio Global de Actividades'); }, [setTituloPantalla]);
  useEffect(() => { cargarCentros(); }, [cargarCentros]);
  useEffect(() => {
    const timer = window.setTimeout(() => { actualizarFiltro('busqueda', busqueda); cargarDirectorio(busqueda); }, 350);
    return () => window.clearTimeout(timer);
  }, [busqueda, actualizarFiltro, cargarDirectorio]);
  useEffect(() => { cargarDirectorio(); }, [filtros.centroUuid, filtros.tipoActividad, filtros.estadoFlujo, filtros.semaforo, filtros.ordenarPor, paginaActual, cargarDirectorio]);

  const filtrosActivos = useMemo(() => [
    filtros.busqueda ? `Búsqueda: ${filtros.busqueda}` : '',
    filtros.centroUuid ? `Centro: ${centros.find((centro) => centro.id === filtros.centroUuid)?.clave || 'Seleccionado'}` : '',
    filtros.tipoActividad ? `Tipo: ${filtros.tipoActividad === 'AUDITORIA' ? 'Auditoría' : 'Revisión'}` : '',
    filtros.estadoFlujo ? `Estado: ${estadoLabels[filtros.estadoFlujo]}` : '',
    filtros.semaforo ? `Semáforo: ${semaforoLabels[filtros.semaforo]}` : '',
  ].filter(Boolean), [filtros, centros]);

  // El backend devuelve la vista polimórfica por registro. Esto corrige
  // cualquier desfase entre el rol inicial del layout y la sesión mock.
  const esVistaJefatura = rolUsuario === 'JEFA';
  const seleccionarFiltro = (nombre: 'centroUuid' | 'tipoActividad' | 'estadoFlujo' | 'semaforo', valor: string) => actualizarFiltro(nombre, valor);
  const filas = adaptarDirectorioActividadesUI(actividades, (id) => router.push(`/actividades/${id}`));

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-slate-50">
      <main className="flex-1 overflow-y-auto p-6 sm:p-8"><div className="mx-auto flex max-w-[1600px] flex-col">
        <div className="mb-6"><h2 className="text-xl font-bold text-slate-800">Supervisión Operativa</h2><p className="mt-1 text-sm text-slate-500">Busca, filtra, ordena y accede al historial de todas las tareas en la red.</p></div>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5"><div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_repeat(5,minmax(135px,auto))]">
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar por título, identificador o descripción..." className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            <select value={esVistaJefatura ? filtros.centroUuid : ''} disabled={!esVistaJefatura} onChange={(event) => seleccionarFiltro('centroUuid', event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"><option value="">{esVistaJefatura ? 'Todos los Centros' : 'Centro único asignado'}</option>{esVistaJefatura && centros.map((centro) => <option key={centro.id} value={centro.id}>{centro.clave}</option>)}</select>
            <select value={filtros.tipoActividad} onChange={(event) => seleccionarFiltro('tipoActividad', event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm"><option value="">Tipo de Actividad</option><option value="AUDITORIA">Auditorías</option><option value="REVISION">Revisiones</option></select>
            <select value={filtros.estadoFlujo} onChange={(event) => seleccionarFiltro('estadoFlujo', event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm"><option value="">Estado de Flujo</option>{Object.entries(estadoLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            <select value={filtros.semaforo} onChange={(event) => seleccionarFiltro('semaforo', event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm"><option value="">Estado del Semáforo</option><option value="CRITICO">Crítico</option><option value="PRECAUCION">En Alerta</option><option value="A_TIEMPO">A Tiempo</option></select>
            <select value={filtros.ordenarPor} onChange={(event) => actualizarFiltro('ordenarPor', event.target.value)} className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-3 text-sm font-bold text-indigo-700"><option value="ESTADO_FLUJO">Ordenar: Estado</option><option value="IDENTIFICADOR">Ordenar: Identificador</option><option value="FECHA_TERMINO">Ordenar: Fecha término</option></select>
          </div><div className="mt-4 flex flex-wrap items-center gap-2"><span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Filtros aplicados:</span>{filtrosActivos.map((filtro) => <span key={filtro} className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">{filtro}</span>)}{filtrosActivos.length > 0 && <button type="button" onClick={() => { limpiarFiltros(); setBusqueda(''); }} className="text-xs font-bold text-slate-400 underline hover:text-indigo-600">Limpiar todos</button>}</div></div>
          {mensajeError && <p className="m-5 rounded-lg bg-rose-50 p-4 text-sm text-rose-700">{mensajeError}</p>}
          <div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-left"><thead className="border-b border-slate-200 bg-slate-50"><tr>{['Identificador', 'Actividad y Fechas', esVistaJefatura ? 'Centro y Contralor' : 'Porcentaje de Participación', 'Estado Operativo', 'Semáforo', ''].map((titulo) => <th key={titulo} className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">{titulo}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{estaCargando ? <tr><td colSpan={6} className="p-12 text-center text-sm text-slate-500">Cargando actividades...</td></tr> : filas.length ? filas.map((fila) => <FilaActividad key={fila.actividad.id} {...fila} />) : <tr><td colSpan={6} className="p-12 text-center text-sm text-slate-500">No se encontraron actividades.</td></tr>}</tbody></table></div>
          <footer className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-sm text-slate-500"><span>Mostrando {actividades.length ? ((paginaActual - 1) * limite + 1) : 0} a {Math.min(paginaActual * limite, totalRegistros)} de {totalRegistros} resultados totales</span><div className="flex gap-2"><button type="button" disabled={paginaActual <= 1 || estaCargando} onClick={() => cambiarPagina(paginaActual - 1)} className="rounded-lg border border-slate-200 px-4 py-2 font-bold disabled:opacity-40">Anterior</button><button type="button" disabled={paginaActual >= totalPaginas || estaCargando} onClick={() => cambiarPagina(paginaActual + 1)} className="rounded-lg border border-slate-200 px-4 py-2 font-bold disabled:opacity-40">Siguiente</button></div></footer>
        </section>
      </div></main>
    </div>
  );
}
>>>>>>> develop
