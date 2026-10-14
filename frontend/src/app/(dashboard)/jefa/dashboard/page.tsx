'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/store/dashboard.store';
import RoleShell from '@/modules/perfiles/role-shell';
import { getModulePath } from '@/modules/perfiles/role-menu';

export default function JefaDashboardPage() {
  const router = useRouter();
  const { datosJefa, cargando, error, cargarDashboard } = useDashboardStore();

  useEffect(() => {
    cargarDashboard();
  }, [cargarDashboard]);

  if (cargando) {
    return (
      <RoleShell perfil="JEFA" modulo="dashboard" title="Panel de Supervisión Global" subtitle="Cargando resumen operativo...">
        <div className="flex items-center justify-center py-32 text-lg font-bold text-indigo-600 animate-pulse">
          Cargando resumen operativo...
        </div>
      </RoleShell>
    );
  }

  if (!datosJefa) {
    return (
      <RoleShell perfil="JEFA" modulo="dashboard" title="Panel de Supervisión Global" subtitle="Resumen operativo de la red.">
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-800">
          <p>{error || 'No fue posible obtener los datos del dashboard.'}</p>
          <button
            type="button"
            onClick={() => void cargarDashboard()}
            className="mt-3 rounded-lg bg-rose-700 px-4 py-2 text-sm font-bold text-white hover:bg-rose-800"
          >
            Reintentar
          </button>
        </div>
      </RoleShell>
    );
  }
  const { kpis, graficaSemaforos, graficaDistribucion, rezago, directorio } = datosJefa;

  return (
    <RoleShell
      perfil="JEFA"
      modulo="dashboard"
      title="Panel de Supervisión Global"
      subtitle="Mi resumen operativo del centro universitario y el seguimiento de la cartera de actividades."
    >
      <div className="mx-auto max-w-[1600px] space-y-8">
        <div className="flex flex-col justify-between md:flex-row md:items-end">
          <div className="mt-4 flex items-center space-x-3 md:mt-0">
            <button
              onClick={() => router.push(getModulePath('JEFA', 'actividades'))}
              className="flex items-center rounded-xl bg-indigo-600 px-6 py-2.5 font-bold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700"
            >
              Ver actividades
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div
            onClick={() => router.push(`${getModulePath('JEFA', 'actividades')}?estado_flujo=DEVUELTA`)}
            className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-8 shadow-sm transition-all hover:border-indigo-400 hover:shadow-md"
          >
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-indigo-50/80 transition-transform group-hover:scale-110" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <h3 className="mb-4 text-base font-bold uppercase tracking-widest text-slate-500">Pendientes</h3>
              <div className="mb-4">
                <div className="flex items-end space-x-3">
                  <span className="text-5xl font-black leading-none text-indigo-700">{kpis.actividadesPorRevisar}</span>
                  <span className="pb-1 text-sm font-bold text-indigo-500">Actividades Por Revisar</span>
                </div>
              </div>
              <div className="mb-4 h-px w-full bg-slate-200" />
              <div>
                <div className="flex items-end space-x-3">
                  <span className="text-2xl font-bold leading-none text-slate-700">{kpis.actividadesSolicitadas}</span>
                  <span className="pb-0.5 text-sm font-medium text-slate-500">Actividades Solicitadas</span>
                </div>
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push(`${getModulePath('JEFA', 'actividades')}?semaforo=CRITICO`)}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-red-300 hover:shadow-md"
          >
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-red-50 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <h3 className="mb-3 text-base font-bold uppercase tracking-widest text-slate-500">Riesgo Crítico</h3>
              <div className="flex flex-col">
                <span className="mt-1 mb-2 text-5xl font-black text-red-600">{kpis.riesgoCritico.toString().padStart(2, '0')}</span>
                <span className="text-base font-medium text-red-500">{kpis.riesgoCriticoDescripcion}</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push(`${getModulePath('JEFA', 'actividades')}?semaforo=PRECAUCION`)}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-amber-300 hover:shadow-md"
          >
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-amber-50 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <h3 className="mb-3 text-base font-bold uppercase tracking-widest text-slate-500">Precaución</h3>
              <div className="flex flex-col">
                <span className="mt-1 mb-2 text-5xl font-black text-amber-500">{kpis.precaucion}</span>
                <span className="text-base font-medium text-amber-600">{kpis.precaucionDescripcion}</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push(`${getModulePath('JEFA', 'actividades')}?estado_flujo=CONCLUIDA`)}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md"
          >
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-emerald-50 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <h3 className="mb-3 text-base font-bold uppercase tracking-widest text-slate-500">Tasa de Solventación</h3>
              <div className="flex flex-col">
                <span className="mt-1 mb-2 text-5xl font-black text-emerald-600">{kpis.tasaSolventacion}%</span>
                <span className="flex items-center text-base font-bold text-emerald-500">
                  <svg className="mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {kpis.tendenciaMes}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-slate-700">Estado de Semáforos</h3>
            <div className="flex flex-1 flex-col items-center justify-center">
              <div
                className="relative flex h-56 w-56 items-center justify-center rounded-full shadow-inner"
                style={{ background: graficaSemaforos.gradientStyle }}
              >
                <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white shadow-sm">
                  <span className="text-4xl font-black text-slate-800">{graficaSemaforos.totalCentral}</span>
                  <span className="mt-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">{graficaSemaforos.subtituloCentral}</span>
                </div>
              </div>
              <div className="w-full mt-10 grid grid-cols-3 gap-2 text-center text-base">
                {graficaSemaforos.leyendas.map((item) => (
                  <div key={item.etiqueta} className="flex items-center justify-center px-2">
                    <div>
                    <div className="flex items-center justify-center mb-2">
                      <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.colorHex }}>
                        </span><span className="font-bold text-slate-700">{item.cantidad}</span></div>
                    <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400">{item.etiqueta}</span>
                  </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-slate-700">{graficaDistribucion.titulo}</h3>
            <div className="flex flex-1 flex-col items-center justify-center">
              <div
                className="relative flex h-56 w-56 items-center justify-center rounded-full shadow-inner"
                style={{ background: graficaDistribucion.gradientStyle }}
              >
                <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white shadow-sm">
                  <span className="text-4xl font-black text-slate-800">{graficaDistribucion.totalCentral}</span>
                </div>
              </div>
              <div className="mt-8 grid w-full grid-cols-2 gap-x-4 gap-y-4 text-sm">
                {graficaDistribucion.leyendas.map((item) => (
                  <div key={item.etiqueta} className="flex items-center justify-between px-2">
                    <div className="flex items-center">
                      <span className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: item.colorHex }} />
                      <span className="font-medium text-slate-600">{item.etiqueta}</span>
                    </div>
                    <span className="text-base font-bold text-slate-800">{item.cantidad}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700">
                  Atención Prioritaria
                </h3>
                <span className="rounded border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-red-600">
                  REZAGO
                </span>
              </div>
              <p className="mb-8 text-xs font-medium text-slate-400">
                Centros Universitarios con mayor acumulación de actividades críticas.
              </p>
              <div className="space-y-6">
                {rezago && rezago.length > 0 ? (
                  rezago.map((item) => {
                    const porcentaje = item.total > 0 
                      ? Math.min(100, Math.round((item.actividadesCriticas / item.total) * 100)) 
                      : 0;

                    const esCritico = item.actividadesCriticas > 5;
                    const colorTexto = esCritico ? 'text-red-600' : 'text-amber-500';
                    const colorBarra = esCritico ? 'bg-red-500' : 'bg-amber-500';

                    return (
                      <div key={item.centroId || item.centroClave}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-bold text-slate-800">
                            {item.centroClave || item.centroNombre}
                          </span>
                          <span className={`font-bold ${colorTexto}`}>
                            {item.actividadesCriticas} críticas
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${colorBarra}`}
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="py-8 text-center text-sm italic text-slate-400">
                    Sin centros con rezago registrado.
                  </p>
                )}
              </div>
            </div>
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => router.push(`${getModulePath('JEFA', 'actividades')}?semaforo=CRITICO`)}
                className="text-xs font-bold uppercase tracking-wider text-indigo-600 transition-colors hover:text-indigo-800"
              >
                VER DESGLOSE
              </button>
            </div>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 bg-white px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-800">
                Revisiones y Solicitudes Pendientes
              </h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {directorio.length} mostradas
              </span>
            </div>
            <button
              type="button"
              onClick={() => router.push(getModulePath('JEFA', 'actividades'))}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              Ver directorio completo
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  <th className="px-8 py-3.5">IDENTIFICADOR</th>
                  <th className="px-6 py-3.5">ACTIVIDAD Y FECHAS</th>
                  <th className="px-6 py-3.5">CENTRO / CONTRALOR</th>
                  <th className="px-6 py-3.5">ESTADO OPERATIVO</th>
                  <th className="px-6 py-3.5">SEMÁFORO</th>
                  <th className="w-10 px-4 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {directorio && directorio.length > 0 ? (
                  directorio.map((item) => {
                    const tipoUpper = (item.tipo || '').toUpperCase();
                    const esAuditoria = tipoUpper.includes('AUDITOR');
                    const esRevision = tipoUpper.includes('REVISI');
                    
                    const estadoUpper = (item.estadoEtiqueta || '').toUpperCase();
                    const esSolicitada = estadoUpper.includes('SOLICITADA');

                    return (
                      <tr key={item.id} className="group transition-colors hover:bg-slate-50/60">
                        <td className="px-8 py-4 align-top">
                          <span className="block font-bold text-slate-800">
                            {item.identificador}
                          </span>
                          <span
                            className={`mt-1.5 inline-block rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                              esAuditoria
                                ? 'bg-purple-100 text-purple-700'
                                : esRevision
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-indigo-100 text-indigo-700'
                            }`}
                          >
                            {item.tipo || 'S/N'}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-top max-w-md">
                          <span className="block font-bold leading-snug text-slate-800">
                            {item.titulo}
                          </span>
                          <span className="mt-1 block text-xs text-slate-400">
                            Enviado: {item.fechaEnviado || 'Sin fecha de envío'} · Término POA: {item.fechaTermino || 'Sin fecha de término'}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <span className="block font-bold text-slate-800">
                            {item.centroClave}
                          </span>
                          <span className="mt-0.5 block text-xs text-slate-400">
                            {item.contralor}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                              esSolicitada
                                ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                : 'bg-purple-50 text-purple-700 border border-purple-200/60'
                            }`}
                          >
                            {item.estadoEtiqueta}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                item.semaforo === 'CRITICO'
                                  ? 'bg-red-500'
                                  : item.semaforo === 'PRECAUCION'
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                            />
                            <span className="font-bold text-slate-700">
                              {item.semaforo === 'CRITICO'
                                ? 'Crítico'
                                : item.semaforo === 'PRECAUCION'
                                  ? 'Alerta'
                                  : 'A tiempo'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-middle text-right">
                          <button
                            type="button"
                            onClick={() => router.push(`${getModulePath('JEFA', 'actividades')}/${item.id}`)}
                            aria-label={`Ver actividad ${item.identificador || item.titulo}`}
                            className="rounded-full p-2 hover:bg-indigo-50"
                          >
                            <svg
                              className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm italic text-slate-400">
                      No hay actividades disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 px-8 py-4 text-xs font-medium text-slate-400 sm:flex-row">
            <div>
              Mostrando 1-{directorio?.length || 0} de {directorio?.length || 0} actividades
            </div>
            <div className="flex items-center space-x-1">
              <button className="px-3 py-1 hover:text-slate-600 disabled:opacity-50">Anterior</button>
              <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 font-bold text-white">1</button>
              <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 hover:text-slate-600">2</button>
              <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 hover:text-slate-600">3</button>
              <button className="px-3 py-1 hover:text-slate-600">Siguiente</button>
            </div>
          </div>
        </section>
      </div>
    </RoleShell>
  );
}
