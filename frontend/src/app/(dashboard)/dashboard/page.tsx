// frontend/src/app/(dashboard)/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/store/dashboard.store';
import { useLayoutStore } from '@/store/layout.store';

export default function DashboardPage() {
  const router = useRouter();
  const { datosContralor, datosJefa, rolActual, cargando, cargarDashboard } = useDashboardStore();

  useEffect(() => {
    useLayoutStore.getState().setTituloPantalla(
      rolActual === 'JEFA' ? 'Panel de Gestión - Jefatura' : 'Panel de Gestión - Contralor'
    );
  }, [rolActual]);

  useEffect(() => {
    cargarDashboard();
  }, [cargarDashboard]);

  if (cargando || (!datosContralor && !datosJefa)) {
    return (
      <div className="flex justify-center items-center py-32 text-indigo-600 font-bold animate-pulse text-lg">
        Cargando resumen operativo...
      </div>
    );
  }

  // ==========================================
  // VISTA PARA LA JEFA
  // ==========================================
  if (rolActual === 'JEFA' && datosJefa) {
    const { kpis, directorio } = datosJefa;
    const ts = kpis.tarjetas_superiores;

    return (
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Resumen Directivo Global (Jefatura)
            </h2>
            <p className="text-base text-slate-500 mt-1">
              Supervisión de Centros Universitarios y Red de Auditoría
            </p>
          </div>
          <button 
            onClick={() => router.push('/actividades')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-indigo-200 transition-all flex items-center cursor-pointer"
          >
            Directorio Completo de Red
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Tarjetas KPI Jefa */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <div 
            onClick={() => router.push('/actividades?estado_flujo=EN_REVISION')}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:border-indigo-300 cursor-pointer transition-all hover:shadow-md"
          >
            <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-3">Pendientes de Revisión</h3>
            <span className="text-5xl font-black text-indigo-700">{ts.pendientes.actividades_por_revisar}</span>
            <p className="text-sm text-slate-500 mt-2">Actividades por revisar</p>
          </div>
          <div 
            onClick={() => router.push('/actividades?semaforo=CRITICO')}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:border-red-300 cursor-pointer transition-all hover:shadow-md"
          >
            <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-3">Riesgo Crítico Red</h3>
            <span className="text-5xl font-black text-red-600">{ts.riesgo_critico.total}</span>
            <p className="text-sm text-red-500 mt-2">{ts.riesgo_critico.descripcion}</p>
          </div>
          <div 
            onClick={() => router.push('/actividades?semaforo=PRECAUCION')}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:border-amber-300 cursor-pointer transition-all hover:shadow-md"
          >
            <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-3">Precaución Red</h3>
            <span className="text-5xl font-black text-amber-500">{ts.precaucion.total}</span>
            <p className="text-sm text-amber-600 mt-2">{ts.precaucion.descripcion}</p>
          </div>
          <div 
            onClick={() => router.push('/actividades?estado_flujo=CONCLUIDA')}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:border-emerald-300 cursor-pointer transition-all hover:shadow-md"
          >
            <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-3">Tasa Solventación</h3>
            <span className="text-5xl font-black text-emerald-600">{ts.tasa_solventacion.porcentaje}%</span>
            <p className="text-sm text-emerald-500 mt-2">Tendencia: {ts.tasa_solventacion.tendencia_mes}</p>
          </div>
        </div>

        {/* Tabla de Actividades de la Red (Directorio ordenado por fecha de llegada) */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 bg-white">
            <h2 className="text-xl font-bold text-slate-800">Bandeja de Actividades en Red (Directorio)</h2>
            <p className="text-base text-slate-500 mt-1">Organizadas por fecha de término y llegada reciente.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <th className="px-8 py-5">Centro / Contralor</th>
                  <th className="px-8 py-5">Actividad</th>
                  <th className="px-8 py-5">Estado</th>
                  <th className="px-8 py-5 text-right">Fecha Término</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-base">
                {directorio.map((item: any) => (
                  <tr 
                    key={item.id} 
                    onClick={() => router.push(`/actividades?search=${encodeURIComponent(item.titulo)}`)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-8 py-6 font-bold text-slate-800">
                      {item.asignacion?.centro_clave || 'Red'}
                      <span className="block text-xs font-normal text-slate-500">{item.asignacion?.contralor || 'Sin asignar'}</span>
                    </td>
                    <td className="px-8 py-6 text-slate-700">
                      <span className="font-semibold block">{item.titulo}</span>
                      <span className="text-xs text-slate-400">{item.identificador || 'S/N'} • {item.tipo}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
                        {item.estado_operativo?.etiqueta || item.estado_operativo?.codigo || 'En proceso'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-medium text-slate-600">{item.fecha_termino}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  // ==========================================
  // VISTA PARA EL CONTRALOR
  // ==========================================
  if (!datosContralor) {
    return null;
  }

  const { kpis, graficaSemaforos, graficaFlujo, proximosVencimientos, bandejaSupervision } = datosContralor;

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Mi Resumen Operativo
          </h2>
          <p className="text-base text-slate-500 mt-1 flex items-center">
            <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {datosContralor.centroNombre}
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button 
            onClick={() => router.push('/actividades')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-indigo-200 transition-all flex items-center cursor-pointer"
          >
            Lista de Actividades Completa
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tarjetas KPI Interactivas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <div 
          onClick={() => router.push('/actividades?estado_flujo=DEVUELTA')}
          className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-8 relative overflow-hidden group hover:border-indigo-400 cursor-pointer transition-all hover:shadow-md"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50/80 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-4">
              Bandeja de Entrada
            </h3>
            <div className="mb-4">
              <div className="flex items-end space-x-3">
                <span className="text-5xl font-black text-indigo-700 leading-none">
                  {kpis.devueltas}
                </span>
                <span className="text-sm font-bold text-indigo-500 pb-1">
                  Actividades<br />Devueltas
                </span>
              </div>
            </div>
            <div className="w-full h-px bg-slate-200 mb-4"></div>
            <div>
              <div className="flex items-end space-x-3">
                <span className="text-2xl font-bold text-slate-700 leading-none">
                  {kpis.listasParaEmpezar}
                </span>
                <span className="text-sm font-medium text-slate-500 pb-0.5">
                  Listas para empezar
                </span>
              </div>
            </div>
          </div>
        </div>

        <div 
          onClick={() => router.push('/actividades?semaforo=CRITICO')}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden group hover:border-red-300 cursor-pointer transition-all hover:shadow-md"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-3">
              Riesgo Crítico
            </h3>
            <div className="flex flex-col">
              <span className="text-5xl font-black text-red-600 mb-2 mt-1">
                {kpis.riesgoCritico.toString().padStart(2, '0')}
              </span>
              <span className="text-base font-medium text-red-500">
                Vencidas o por vencer
              </span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => router.push('/actividades?semaforo=PRECAUCION')}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden group hover:border-amber-300 cursor-pointer transition-all hover:shadow-md"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-3">
              Precaución
            </h3>
            <div className="flex flex-col">
              <span className="text-5xl font-black text-amber-500 mb-2 mt-1">
                {kpis.precaucion.toString().padStart(2, '0')}
              </span>
              <span className="text-base font-medium text-amber-600">
                A menos de 15 días
              </span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => router.push('/actividades?estado_flujo=CONCLUIDA')}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden group hover:border-emerald-300 cursor-pointer transition-all hover:shadow-md"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-3">
              Tasa de Solventación
            </h3>
            <div className="flex flex-col">
              <span className="text-5xl font-black text-emerald-600 mb-2 mt-1">
                {kpis.tasaSolventacion}%
              </span>
              <span className="text-base font-bold text-emerald-500 flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {kpis.tasaSolventacion >= 80 ? 'Excelente' : 'Regular'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficas y Vencimientos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-8">
            {graficaSemaforos.titulo}
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div 
              className="relative w-56 h-56 rounded-full flex items-center justify-center shadow-inner"
              style={{ background: graficaSemaforos.gradientStyle }}
            >
              <div className="w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                <span className="text-4xl font-black text-slate-800">
                  {graficaSemaforos.totalCentral}
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {graficaSemaforos.subtituloCentral}
                </span>
              </div>
            </div>
            <div className="w-full mt-10 grid grid-cols-3 gap-2 text-center text-base">
              {graficaSemaforos.leyendas.map((item) => (
                <div key={item.etiqueta}>
                  <div className="flex items-center justify-center mb-2">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.colorHex }}></span>
                    <span className="font-bold text-slate-700">{item.cantidad}</span>
                  </div>
                  <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400">
                    {item.etiqueta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-8">
            {graficaFlujo.titulo}
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div 
              className="relative w-56 h-56 rounded-full flex items-center justify-center shadow-inner"
              style={{ background: graficaFlujo.gradientStyle }}
            >
              <div className="w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                <span className="text-4xl font-black text-slate-800">
                  {graficaFlujo.totalCentral}
                </span>
              </div>
            </div>
            <div className="w-full mt-8 grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
              {graficaFlujo.leyendas.map((item) => (
                <div key={item.etiqueta} className="flex items-center justify-between px-2">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.colorHex }}></span>
                    <span className="text-slate-600 font-medium">{item.etiqueta}</span>
                  </div>
                  <span className="font-bold text-slate-800 text-base">{item.cantidad}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">
              Próximos Vencimientos
            </h3>
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            {proximosVencimientos.length > 0 ? (
              proximosVencimientos.map((item) => (
                <div key={item.id} className="flex items-start">
                  <div className="flex-shrink-0 mt-1.5">
                    <div className={`w-3 h-3 rounded-full ${
                      item.colorSemaforo === 'red' ? 'bg-red-500' : item.colorSemaforo === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-base font-bold text-slate-800 leading-tight">
                      {item.titulo}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                      Vence: {item.fechaTexto}
                    </p>
                  </div>
                  <div className="ml-3 text-right">
                    <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded ${
                      item.colorSemaforo === 'red' ? 'bg-red-100 text-red-700' : item.colorSemaforo === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {item.etiquetaTiempo}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm italic py-8 text-center">
                Sin vencimientos próximos registrados.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabla Inferior: Bandeja de Supervisión */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-800">
            Bandeja de Supervisión y Respuestas
          </h2>
          <p className="text-base text-slate-500 mt-1">
            Acceso rápido a las actividades evaluadas por la Jefatura recientemente.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-8 py-5">Actividad Principal</th>
                <th className="px-8 py-5">Resolución de Jefatura</th>
                <th className="px-8 py-5 text-right">Vencimiento POA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-base">
              {bandejaSupervision.map((fila) => (
                <tr 
                  key={fila.id} 
                  onClick={() => router.push(`/actividades?search=${encodeURIComponent(fila.titulo)}`)}
                  className="hover:bg-slate-50 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {fila.titulo}
                      </span>
                      <span className="text-sm text-slate-400 mt-1">
                        {fila.tiempoTranscurrido}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center border ${
                        fila.resolucionTipo === 'DEVUELTA_OBS'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : fila.resolucionTipo === 'DEVUELTA_REC'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {fila.resolucionTexto}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-slate-800 font-bold">{fila.vencimientoTexto}</span>
                      <span className="text-sm text-slate-400 mt-1">{fila.vencimientoFecha}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}