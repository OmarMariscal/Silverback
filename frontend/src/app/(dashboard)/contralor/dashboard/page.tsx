'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/store/dashboard.store';
import { useLayoutStore } from '@/store/layout.store';
import RoleShell from '@/modules/perfiles/role-shell';

export default function ContralorDashboardPage() {
  const router = useRouter();
  const { datosContralor, rolActual, cargando, cargarDashboard } = useDashboardStore();

  useEffect(() => {
    useLayoutStore.getState().setTituloPantalla(
        'Panel de Gestión - Contralor'
    );
  }, [rolActual]);

  useEffect(() => {
    cargarDashboard();
  }, [cargarDashboard]);

  if (cargando || !datosContralor) {
    return (
      <RoleShell perfil="CONTRALOR" modulo="dashboard" title="Panel de Gestión - Contralor" subtitle="Cargando resumen operativo...">
        <div className="flex items-center justify-center py-32 text-lg font-bold text-indigo-600 animate-pulse">
          Cargando resumen operativo...
        </div>
      </RoleShell>
    );
  }
  const { kpis, graficaSemaforos, graficaFlujo, proximosVencimientos, bandejaSupervision } = datosContralor;

  return (
    <RoleShell
      perfil="CONTRALOR"
      modulo="dashboard"
      title="Panel de Gestión - Contralor"
      subtitle="Mi resumen operativo del centro universitario y el seguimiento de la cartera de actividades."
    >
      <div className="mx-auto max-w-[1600px] space-y-8">
        <div className="flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">Mi Resumen Operativo</h2>
            <p className="mt-1 flex items-center text-base text-slate-500">
              <svg className="mr-1.5 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {datosContralor.centroNombre}
            </p>
          </div>

          <div className="mt-4 flex items-center space-x-3 md:mt-0">
            <button
              onClick={() => router.push('/contralor/actividades')}
              className="flex items-center rounded-xl bg-indigo-600 px-6 py-2.5 font-bold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700"
            >
              Lista de Actividades Completa
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div
            onClick={() => router.push('/contralor/actividades?estado_flujo=DEVUELTA')}
            className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-8 shadow-sm transition-all hover:border-indigo-400 hover:shadow-md"
          >
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-indigo-50/80 transition-transform group-hover:scale-110" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <h3 className="mb-4 text-base font-bold uppercase tracking-widest text-slate-500">Bandeja de Entrada</h3>
              <div className="mb-4">
                <div className="flex items-end space-x-3">
                  <span className="text-5xl font-black leading-none text-indigo-700">{kpis.devueltas}</span>
                  <span className="pb-1 text-sm font-bold text-indigo-500">Actividades<br />Devueltas</span>
                </div>
              </div>
              <div className="mb-4 h-px w-full bg-slate-200" />
              <div>
                <div className="flex items-end space-x-3">
                  <span className="text-2xl font-bold leading-none text-slate-700">{kpis.listasParaEmpezar}</span>
                  <span className="pb-0.5 text-sm font-medium text-slate-500">Listas para empezar</span>
                </div>
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push('/contralor/actividades?semaforo=CRITICO')}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-red-300 hover:shadow-md"
          >
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-red-50 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <h3 className="mb-3 text-base font-bold uppercase tracking-widest text-slate-500">Riesgo Crítico</h3>
              <div className="flex flex-col">
                <span className="mt-1 mb-2 text-5xl font-black text-red-600">{kpis.riesgoCritico.toString().padStart(2, '0')}</span>
                <span className="text-base font-medium text-red-500">Vencidas o por vencer</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push('/contralor/actividades?semaforo=PRECAUCION')}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-amber-300 hover:shadow-md"
          >
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-amber-50 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <h3 className="mb-3 text-base font-bold uppercase tracking-widest text-slate-500">Precaución</h3>
              <div className="flex flex-col">
                <span className="mt-1 mb-2 text-5xl font-black text-amber-500">{kpis.precaucion.toString().padStart(2, '0')}</span>
                <span className="text-base font-medium text-amber-600">A menos de 15 días</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push('/contralor/actividades?estado_flujo=CONCLUIDA')}
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
                  {kpis.tasaSolventacion >= 80 ? 'Excelente' : 'Regular'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-slate-700">{graficaSemaforos.titulo}</h3>
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
            <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-slate-700">{graficaFlujo.titulo}</h3>
            <div className="flex flex-1 flex-col items-center justify-center">
              <div
                className="relative flex h-56 w-56 items-center justify-center rounded-full shadow-inner"
                style={{ background: graficaFlujo.gradientStyle }}
              >
                <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white shadow-sm">
                  <span className="text-4xl font-black text-slate-800">{graficaFlujo.totalCentral}</span>
                </div>
              </div>
              <div className="mt-8 grid w-full grid-cols-2 gap-x-4 gap-y-4 text-sm">
                {graficaFlujo.leyendas.map((item) => (
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

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700">Próximos Vencimientos</h3>
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-6">
              {proximosVencimientos.length > 0 ? (
                proximosVencimientos.map((item: any) => (
                  <div key={item.id} className="flex items-start">
                    <div className="mt-1.5 flex-shrink-0">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          item.colorSemaforo === 'red'
                            ? 'bg-red-500'
                            : item.colorSemaforo === 'amber'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                        }`}
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-base font-bold leading-tight text-slate-800">{item.titulo}</h4>
                      <p className="mt-1 text-sm text-slate-500">Vence: {item.fechaTexto}</p>
                    </div>
                    <div className="ml-3 text-right">
                      <span
                        className={`inline-block rounded px-2.5 py-1 text-xs font-bold ${
                          item.colorSemaforo === 'red'
                            ? 'bg-red-100 text-red-700'
                            : item.colorSemaforo === 'amber'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {item.etiquetaTiempo}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-sm italic text-slate-400">Sin vencimientos próximos registrados.</p>
              )}
            </div>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-white px-8 py-6">
            <h2 className="text-xl font-bold text-slate-800">Bandeja de Supervisión</h2>
            <p className="mt-1 text-base text-slate-500">Actividades por revisar, devolver o atender en curso.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-3">ACTIVIDAD PRINCIPAL</th>
                  <th className="px-6 py-3 text-center">RESOLUCIÓN DE JEFATURA</th>
                  <th className="px-6 py-3 text-right">VENCIMIENTO POA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bandejaSupervision.map((item: any) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <span className="block font-bold text-slate-800">{item.titulo}</span>
                      <span className="text-xs text-slate-400">{item.tiempoTranscurrido}</span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-semibold border ${
                          item.resolucionTipo === 'DEVUELTA_OBS'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : item.resolucionTipo === 'DEVUELTA_REC'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-black-50 text-black-700 border-black-200'
                        }`}
                      >
                        {item.resolucionTipo === 'DEVUELTA_OBS' && (
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        )}
                        {item.resolucionTipo === 'DEVUELTA_REC' && (
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {item.resolucionTexto}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`block font-bold ${
                          item.vencimientoTexto.includes('Faltan 2')
                            ? 'text-red-600'
                            : item.vencimientoTexto.includes('Faltan')
                            ? 'text-amber-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {item.vencimientoTexto}
                      </span>
                      <span className="text-xs text-slate-400">{item.vencimientoFecha}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </RoleShell>
  );
}
