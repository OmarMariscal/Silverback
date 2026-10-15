'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActividadesStore } from '@/store/actividades.store';
import type { ActividadDirectorioUI } from '@/types/actividades-contratos';
import RoleShell from '@/modules/perfiles/role-shell';

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

function FilaActividad({
  actividad,
  onSeleccionar,
}: {
  actividad: ActividadDirectorioUI;
  onSeleccionar: (id: string) => void;
}) {

  return (
    <tr onClick={() => onSeleccionar(actividad.id)} className="group cursor-pointer transition hover:bg-indigo-50/40">
      <td className="px-6 py-5">
        <strong className="block text-base text-slate-800">{actividad.identificador}</strong>
        <span
          className={`mt-2 inline-block rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
            actividad.tipoActividad === 'AUDITORIA' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {actividad.tipoEtiqueta}
        </span>
      </td>
      <td className="max-w-lg px-6 py-5">
        <strong className="block truncate text-base text-slate-800 group-hover:text-indigo-700">{actividad.titulo}</strong>
        <span className="mt-2 block text-xs text-slate-500">Término POA: {actividad.fechaTermino}</span>
      </td>
      <td className="px-6 py-5 text-sm">
        <strong className="block text-slate-700">{actividad.asignacionPrincipal}</strong>
        <span className="mt-1 block max-w-56 truncate text-xs text-slate-500">{actividad.asignacionSecundaria}</span>
      </td>
      <td className="px-6 py-5">
        <span className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-bold ${actividad.estadoClase}`}>
          {actividad.estadoEtiqueta}
        </span>
      </td>
      <td className="px-6 py-5">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <span className={`h-3 w-3 rounded-full ${actividad.semaforoClase}`} />
          {actividad.semaforoEtiqueta}
        </span>
      </td>
      <td className="px-6 py-5 text-right text-xl text-slate-400 group-hover:text-indigo-600">›</td>
    </tr>
  );
}

function ContralorActividadesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    actividades,
    filtros,
    paginaActual,
    totalPaginas,
    totalRegistros,
    limite,
    estaCargando,
    mensajeError,
    cargarDirectorio,
    actualizarFiltro,
    cambiarPagina,
    limpiarFiltros,
  } = useActividadesStore();
  const [busqueda, setBusqueda] = useState(filtros.busqueda);

  useEffect(() => {
    const estado = searchParams.get('estado_flujo') ?? '';
    const semaforo = searchParams.get('semaforo') ?? '';
    actualizarFiltro('estadoFlujo', Object.hasOwn(estadoLabels, estado) ? estado : '');
    actualizarFiltro('semaforo', ['A_TIEMPO', 'CRITICO', 'PRECAUCION'].includes(semaforo) ? semaforo : '');
  }, [searchParams, actualizarFiltro]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      actualizarFiltro('busqueda', busqueda);
      cargarDirectorio(busqueda);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [busqueda, actualizarFiltro, cargarDirectorio]);

  useEffect(() => {
    cargarDirectorio();
  }, [
    filtros.tipoActividad,
    filtros.estadoFlujo,
    filtros.semaforo,
    filtros.ordenarPor,
    paginaActual,
    cargarDirectorio,
  ]);

  const filtrosActivos = useMemo(
    () =>
      [
        filtros.busqueda ? `Búsqueda: ${filtros.busqueda}` : '',
        filtros.tipoActividad ? `Tipo: ${filtros.tipoActividad === 'AUDITORIA' ? 'Auditoría' : 'Revisión'}` : '',
        filtros.estadoFlujo ? `Estado: ${estadoLabels[filtros.estadoFlujo]}` : '',
        filtros.semaforo ? `Semáforo: ${semaforoLabels[filtros.semaforo]}` : '',
      ].filter(Boolean),
    [filtros]
  );

  const seleccionarFiltro = (nombre: 'tipoActividad' | 'estadoFlujo' | 'semaforo', valor: string) =>
    actualizarFiltro(nombre, valor);

  return (
    <RoleShell
      perfil="CONTRALOR"
      modulo="actividades"
      title="Actividades del Contralor"
      subtitle="Listado y control del centro universitario con filtros por estado, semáforo y tipo de actividad."
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_repeat(5,minmax(135px,auto))]">
            <input
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar por título, identificador o descripción..."
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <select
              value=""
              disabled
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Centro único asignado</option>
            </select>
            <select
              value={filtros.tipoActividad}
              onChange={(event) => seleccionarFiltro('tipoActividad', event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm"
            >
              <option value="">Tipo de Actividad</option>
              <option value="AUDITORIA">Auditorías</option>
              <option value="REVISION">Revisiones</option>
            </select>
            <select
              value={filtros.estadoFlujo}
              onChange={(event) => seleccionarFiltro('estadoFlujo', event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm"
            >
              <option value="">Estado de Flujo</option>
              {Object.entries(estadoLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={filtros.semaforo}
              onChange={(event) => seleccionarFiltro('semaforo', event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm"
            >
              <option value="">Estado del Semáforo</option>
              <option value="CRITICO">Crítico</option>
              <option value="PRECAUCION">En Alerta</option>
              <option value="A_TIEMPO">A Tiempo</option>
            </select>
            <select
              value={filtros.ordenarPor}
              onChange={(event) => actualizarFiltro('ordenarPor', event.target.value)}
              className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-3 text-sm font-bold text-indigo-700"
            >
              <option value="ESTADO_FLUJO">Ordenar: Estado</option>
              <option value="IDENTIFICADOR">Ordenar: Identificador</option>
              <option value="FECHA_TERMINO">Ordenar: Fecha término</option>
            </select>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Filtros aplicados:</span>
            {filtrosActivos.map((filtro) => (
              <span key={filtro} className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                {filtro}
              </span>
            ))}
            {filtrosActivos.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  limpiarFiltros();
                  setBusqueda('');
                  router.replace('/contralor/actividades');
                }}
                className="text-xs font-bold text-slate-400 underline hover:text-indigo-600"
              >
                Limpiar todos
              </button>
            )}
          </div>
        </div>

        {mensajeError && <p className="m-5 rounded-lg bg-rose-50 p-4 text-sm text-rose-700">{mensajeError}</p>}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {['Identificador', 'Actividad y Fechas', 'Porcentaje de Participación', 'Estado Operativo', 'Semáforo', ''].map(
                  (titulo) => (
                    <th key={titulo} className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      {titulo}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {estaCargando ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-sm text-slate-500">
                    Cargando actividades...
                  </td>
                </tr>
              ) : actividades.length ? (
                actividades.map((actividad) => (
                  <FilaActividad
                    key={actividad.id}
                    actividad={actividad}
                    onSeleccionar={(id) => router.push(`/contralor/actividades/${id}`)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-sm text-slate-500">
                    No se encontraron actividades.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
          <span>
            Mostrando {actividades.length ? (paginaActual - 1) * limite + 1 : 0} a {Math.min(paginaActual * limite, totalRegistros)} de {totalRegistros} resultados totales
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => cambiarPagina(Math.max(1, paginaActual - 1))}
              disabled={paginaActual === 1}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => cambiarPagina(Math.min(totalPaginas, paginaActual + 1))}
              disabled={paginaActual >= totalPaginas}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </footer>
      </div>
    </RoleShell>
  );
}

export default function ContralorActividadesPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Cargando directorio...</p>}>
      <ContralorActividadesContent />
    </Suspense>
  );
}
