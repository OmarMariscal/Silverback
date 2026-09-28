'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import RoleShell from '@/modules/perfiles/role-shell';
import { useActividadesStore } from '@/store/actividades.store';
import { useLayoutStore } from '@/store/layout.store';

const estadoLabels: Record<string, string> = {
  SIN_EMPEZAR: 'Sin Empezar',
  SOLICITADO: 'Por Autorizar',
  EN_PROGRESO: 'En Proceso',
  EN_REVISION: 'Por Revisar',
  DEVUELTA: 'Devuelta',
  CONCLUIDA: 'Concluida',
};

const semaforoLabels: Record<string, string> = {
  A_TIEMPO: 'A Tiempo',
  VERDE: 'A Tiempo',
  PRECAUCION: 'En Alerta',
  AMARILLO: 'En Alerta',
  CRITICO: 'Crítico',
  ROJO: 'Crítico',
  GRIS: 'N/A',
};

const semaforoColors: Record<string, string> = {
  A_TIEMPO: 'bg-emerald-500',
  VERDE: 'bg-emerald-500',
  PRECAUCION: 'bg-amber-400',
  AMARILLO: 'bg-amber-400',
  CRITICO: 'bg-red-500',
  ROJO: 'bg-red-500',
  GRIS: 'bg-slate-300',
};

function fechaCorta(fecha: string) {
  return new Intl.DateTimeFormat('es-MX', { month: 'short', year: 'numeric' }).format(new Date(fecha));
}

export default function JefaActividadesPage() {
  const router = useRouter();
  const setTituloPantalla = useLayoutStore((state) => state.setTituloPantalla);
  const {
    actividades,
    centros,
    filtros,
    paginaActual,
    totalPaginas,
    totalRegistros,
    limite,
    estaCargando,
    mensajeError,
    cargarCentros,
    cargarDirectorio,
    actualizarFiltro,
    cambiarPagina,
    limpiarFiltros,
  } = useActividadesStore();

  const [busqueda, setBusqueda] = useState(filtros.busqueda);

  useEffect(() => {
    setTituloPantalla('Directorio Global de Actividades');
  }, [setTituloPantalla]);

  useEffect(() => {
    cargarCentros();
  }, [cargarCentros]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      actualizarFiltro('busqueda', busqueda);
      cargarDirectorio(busqueda);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [busqueda, actualizarFiltro, cargarDirectorio]);

  useEffect(() => {
    cargarDirectorio();
  }, [filtros.centroUuid, filtros.tipoActividad, filtros.estadoFlujo, filtros.semaforo, filtros.ordenarPor, paginaActual, cargarDirectorio]);

  const filtrosActivos = useMemo(
    () =>
      [
        filtros.busqueda ? `Búsqueda: ${filtros.busqueda}` : '',
        filtros.centroUuid ? `Centro: ${centros.find((centro) => centro.id === filtros.centroUuid)?.clave || 'Seleccionado'}` : '',
        filtros.tipoActividad ? `Tipo: ${filtros.tipoActividad === 'AUDITORIA' ? 'Auditoría' : 'Revisión'}` : '',
        filtros.estadoFlujo ? `Estado: ${estadoLabels[filtros.estadoFlujo]}` : '',
        filtros.semaforo ? `Semáforo: ${semaforoLabels[filtros.semaforo]}` : '',
      ].filter(Boolean),
    [centros, filtros],
  );

  const seleccionarFiltro = (nombre: 'centroUuid' | 'tipoActividad' | 'estadoFlujo' | 'semaforo', valor: string) => {
    actualizarFiltro(nombre, valor);
  };

  const limpiarTodos = () => {
    limpiarFiltros();
    setBusqueda('');
  };

  const exportarVistaActual = () => undefined;

  const totalResultados = totalRegistros || actividades.length;

  return (
    <RoleShell
      perfil="JEFA"
      modulo="actividades"
      title="Actividades de jefatura"
      subtitle="Directorio de actividades del total de la red de contralores y centros."
    >
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="mx-auto max-w-[1600px]">
          <header className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-800">Directorio Global de Actividades</h1>
            </div>

            <button
              type="button"
              onClick={exportarVistaActual}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-indigo-700"
            >
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v10m0 0l-4-4m4 4l4-4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
              </svg>
              Exportar Vista Actual (.xlsx)
            </button>
          </header>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative min-w-[260px] flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                    </svg>
                  </div>
                  <input
                    value={busqueda}
                    onChange={(event) => setBusqueda(event.target.value)}
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Buscar por título, identificador o descripción..."
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={filtros.centroUuid}
                    onChange={(event) => seleccionarFiltro('centroUuid', event.target.value)}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
                    onChange={(event) => seleccionarFiltro('tipoActividad', event.target.value)}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">Tipo de Actividad</option>
                    <option value="AUDITORIA">Auditorías</option>
                    <option value="REVISION">Revisiones</option>
                  </select>

                  <select
                    value={filtros.estadoFlujo}
                    onChange={(event) => seleccionarFiltro('estadoFlujo', event.target.value)}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">Estado de Flujo</option>
                    {Object.entries(estadoLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <div className="mx-1 h-8 w-px bg-slate-200" />

                  <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-2 py-1.5">
                    <span className="pl-2 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">Ordenar:</span>
                    <select
                      value={filtros.ordenarPor}
                      onChange={(event) => actualizarFiltro('ordenarPor', event.target.value)}
                      className="cursor-pointer border-none bg-transparent px-2 py-1 text-sm font-bold text-indigo-700 outline-none"
                    >
                      <option value="ESTADO_FLUJO">Por Estado de Flujo</option>
                      <option value="IDENTIFICADOR">Más recientes</option>
                      <option value="FECHA_TERMINO">Por Fecha Término POA</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="mr-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Filtros aplicados:</span>
                {filtrosActivos.length > 0 ? (
                  <>
                    {filtrosActivos.map((filtro) => (
                      <span key={filtro} className="inline-flex items-center rounded-lg border border-indigo-200 bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 shadow-sm">
                        {filtro}
                        <button
                          type="button"
                          className="ml-2 text-indigo-400 hover:text-indigo-600"
                          aria-label={`Quitar filtro ${filtro}`}
                          onClick={() => {
                            if (filtro.startsWith('Búsqueda:')) {
                              setBusqueda('');
                              actualizarFiltro('busqueda', '');
                              return;
                            }

                            if (filtro.startsWith('Centro:')) {
                              actualizarFiltro('centroUuid', '');
                              return;
                            }

                            if (filtro.startsWith('Tipo:')) {
                              actualizarFiltro('tipoActividad', '');
                              return;
                            }

                            if (filtro.startsWith('Estado:')) {
                              actualizarFiltro('estadoFlujo', '');
                              return;
                            }

                            if (filtro.startsWith('Semáforo:')) {
                              actualizarFiltro('semaforo', '');
                            }
                          }}
                        >
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={limpiarTodos}
                      className="ml-2 text-xs font-bold text-slate-400 underline transition hover:text-indigo-600"
                    >
                      Limpiar todos
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-medium text-slate-400">Sin filtros activos</span>
                )}
              </div>
            </div>

            {mensajeError ? (
              <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700">{mensajeError}</div>
            ) : null}

            <div className="overflow-x-auto">
              <table className="min-w-[1200px] w-full border-collapse whitespace-nowrap text-left">
                <thead className="sticky top-0 z-0 border-b border-slate-200 bg-slate-50">
                  <tr>
                    {['Identificador', 'Actividad y Fechas', 'Asignación', 'Estado Operativo', 'Semáforo', ''].map((header) => (
                      <th key={header} className="px-8 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm">
                  {estaCargando ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-10 text-center text-sm text-slate-500">
                        Cargando actividades...
                      </td>
                    </tr>
                  ) : actividades.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-10 text-center text-sm text-slate-500">
                        No se encontraron actividades con los filtros actuales.
                      </td>
                    </tr>
                  ) : (
                    actividades.map((actividad) => {
                      const tipo = actividad.tipo === 'AUDITORIA' ? 'Auditoría' : 'Revisión';
                      const estado = actividad.estado_operativo.codigo;
                      const estadoEtiqueta = actividad.estado_operativo.etiqueta || estadoLabels[estado] || 'Sin estado';
                      const centroClave = actividad.asignacion.centro_clave || 'Sin centro';
                      const responsable = actividad.asignacion.contralor || actividad.asignacion.auditor_apoyo || 'Sin responsable';
                      const semaforoEtiqueta = semaforoLabels[actividad.semaforo] || 'N/A';
                      const semaforoColor = semaforoColors[actividad.semaforo] || semaforoColors.GRIS;

                      return (
                        <tr key={actividad.id} className="cursor-pointer transition-colors hover:bg-indigo-50/40">
                          <td className="px-8 py-5">
                            <div className="flex flex-col items-start">
                              <span className="text-base font-black text-slate-800">{actividad.identificador || 'Sin asignar'}</span>
                              <span
                                className={`mt-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                                  tipo === 'Auditoría' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {tipo}
                              </span>
                            </div>
                          </td>

                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="max-w-lg truncate text-base font-bold text-slate-800 transition-colors hover:text-indigo-700">
                                {actividad.titulo}
                              </span>
                              <div className="mt-2 flex items-center text-xs font-medium text-slate-500">
                                <svg className="mr-1.5 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
                                </svg>
                                Término POA: {fechaCorta(actividad.fecha_termino)}
                              </div>
                            </div>
                          </td>

                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-700">{centroClave}</span>
                              <span className="mt-1 text-xs text-slate-500">{responsable}</span>
                            </div>
                          </td>

                          <td className="px-8 py-5">
                            <span
                              className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-bold shadow-sm ${
                                estado === 'DEVUELTA'
                                  ? 'border-red-200 bg-red-50 text-red-700'
                                  : estado === 'EN_PROGRESO'
                                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                                    : estado === 'EN_REVISION'
                                      ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                                      : estado === 'CONCLUIDA'
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                        : 'border-slate-200 bg-slate-100 text-slate-600'
                              }`}
                            >
                              {estadoEtiqueta}
                            </span>
                          </td>

                          <td className="px-8 py-5">
                            <div className="flex items-center">
                              <span className={`mr-2.5 inline-flex h-3.5 w-3.5 rounded-full ${semaforoColor}`} />
                              <span className="text-sm font-bold text-slate-700">{semaforoEtiqueta}</span>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-right">
                            <button
                              type="button"
                              onClick={() => router.push(`/actividades/${actividad.id}`)}
                              className="ml-auto flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-indigo-100"
                              aria-label={`Ver actividad ${actividad.identificador || actividad.titulo}`}
                            >
                              <svg className="h-5 w-5 text-slate-400 transition-transform hover:translate-x-0.5 hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-8 py-5">
              <span className="text-sm font-medium text-slate-500">
                Mostrando <span className="font-bold text-slate-700">{actividades.length ? 1 : 0}</span> a{' '}
                <span className="font-bold text-slate-700">{Math.min(actividades.length, limite)}</span> de{' '}
                <span className="font-bold text-slate-700">{totalResultados}</span> resultados totales
              </span>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => cambiarPagina(Math.max(1, paginaActual - 1))}
                  disabled={paginaActual <= 1}
                  className={`rounded-xl border px-4 py-2 text-sm font-bold shadow-sm ${
                    paginaActual <= 1
                      ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-700'
                  }`}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => cambiarPagina(Math.min(totalPaginas || 1, paginaActual + 1))}
                  disabled={paginaActual >= (totalPaginas || 1)}
                  className={`rounded-xl border px-4 py-2 text-sm font-bold shadow-sm ${
                    paginaActual >= (totalPaginas || 1)
                      ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-700'
                  }`}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleShell>
  );
}
