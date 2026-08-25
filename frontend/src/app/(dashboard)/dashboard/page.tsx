export default function DashboardPage() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Encabezado del contenido */}
      <div className="flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Mi Resumen Operativo
          </h2>
          <p className="text-base text-slate-500 mt-1 flex items-center">
            <svg
              className="w-5 h-5 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Centro Universitario de los Valles (CU Valles)
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Exportar Reporte
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-indigo-200 transition-all flex items-center">
            Lista de Actividades Completa
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Tarjetas Métrica */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-8 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50/80 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-4">
              Bandeja de Entrada
            </h3>

            <div className="mb-4">
              <div className="flex items-end space-x-3">
                <span className="text-5xl font-black text-indigo-700 leading-none">
                  3
                </span>
                <span className="text-sm font-bold text-indigo-500 pb-1">
                  Actividades
                  <br />
                  Devueltas
                </span>
              </div>
            </div>

            <div className="w-full h-px bg-slate-200 mb-4"></div>

            <div>
              <div className="flex items-end space-x-3">
                <span className="text-2xl font-bold text-slate-700 leading-none">
                  4
                </span>
                <span className="text-sm font-medium text-slate-500 pb-0.5">
                  Listas para empezar
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden group hover:border-red-200 transition-colors">
          <div className="absolute right-0 top-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-3">
              Riesgo Crítico
            </h3>
            <div className="flex flex-col">
              <span className="text-5xl font-black text-red-600 mb-2 mt-1">
                02
              </span>
              <span className="text-base font-medium text-red-500">
                Vencidas o por vencer
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden group hover:border-amber-200 transition-colors">
          <div className="absolute right-0 top-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-3">
              Precaución
            </h3>
            <div className="flex flex-col">
              <span className="text-5xl font-black text-amber-500 mb-2 mt-1">
                05
              </span>
              <span className="text-base font-medium text-amber-600">
                A menos de 15 días
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden group hover:border-emerald-200 transition-colors">
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-3">
              Tasa de Solventación
            </h3>
            <div className="flex flex-col">
              <span className="text-5xl font-black text-emerald-600 mb-2 mt-1">
                82%
              </span>
              <span className="text-base font-bold text-emerald-500 flex items-center">
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                Excelente
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficas y Próximos Vencimientos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfica 1: Semáforos */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-8">
            Mi Estado de Semáforos
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div
              className="relative w-56 h-56 rounded-full flex items-center justify-center shadow-inner"
              style={{
                background:
                  'conic-gradient(#ef4444 0% 10%, #f59e0b 10% 30%, #10b981 30% 100%)',
              }}
            >
              <div className="w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                <span className="text-4xl font-black text-slate-800">24</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Mi POA
                </span>
              </div>
            </div>
            <div className="w-full mt-10 grid grid-cols-3 gap-2 text-center text-base">
              <div>
                <div className="flex items-center justify-center mb-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
                  <span className="font-bold text-slate-700">17</span>
                </div>
                <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400">
                  A Tiempo
                </span>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                  <span className="font-bold text-slate-700">5</span>
                </div>
                <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400">
                  Alerta
                </span>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  <span className="font-bold text-slate-700">2</span>
                </div>
                <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400">
                  Crítico
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfica 2: Flujo de Trabajo */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-8">
            Mi Flujo de Trabajo
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div
              className="relative w-56 h-56 rounded-full flex items-center justify-center shadow-inner"
              style={{
                background:
                  'conic-gradient(#94a3b8 0% 15%, #3b82f6 15% 65%, #8b5cf6 65% 75%, #10b981 75% 100%)',
              }}
            >
              <div className="w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                <span className="text-4xl font-black text-slate-800">24</span>
              </div>
            </div>
            <div className="w-full mt-8 grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-slate-400 mr-2"></span>
                  <span className="text-slate-600 font-medium">Sin empezar</span>
                </div>
                <span className="font-bold text-slate-800 text-base">4</span>
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                  <span className="text-slate-600 font-medium">En Proceso</span>
                </div>
                <span className="font-bold text-slate-800 text-base">12</span>
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                  <span className="text-slate-600 font-medium">Por Revisar</span>
                </div>
                <span className="font-bold text-slate-800 text-base">2</span>
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
                  <span className="text-slate-600 font-medium">Concluidas</span>
                </div>
                <span className="font-bold text-slate-800 text-base">6</span>
              </div>
            </div>
          </div>
        </div>

        {/* Próximos Vencimientos */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">
              Próximos Vencimientos
            </h3>
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-base font-bold text-slate-800 leading-tight">
                  Auditoría de Ingresos Autogenerados
                </h4>
                <p className="text-sm text-slate-500 mt-1">
                  Vence: 18 de Junio de 2026
                </p>
              </div>
              <div className="ml-3 text-right">
                <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded">
                  Faltan 2 días
                </span>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-base font-bold text-slate-800 leading-tight">
                  Revisión de Control de Bienes Muebles
                </h4>
                <p className="text-sm text-slate-500 mt-1">
                  Vence: 25 de Junio de 2026
                </p>
              </div>
              <div className="ml-3 text-right">
                <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded">
                  Faltan 9 días
                </span>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-base font-bold text-slate-800 leading-tight">
                  Auditoría financiera de Obra Pública
                </h4>
                <p className="text-sm text-slate-500 mt-1">
                  Vence: 30 de Junio de 2026
                </p>
              </div>
              <div className="ml-3 text-right">
                <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded">
                  14 días
                </span>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-base font-bold text-slate-800 leading-tight">
                  Revisión de Asistencia a Clases
                </h4>
                <p className="text-sm text-slate-500 mt-1">
                  Vence: 31 de Agosto de 2026
                </p>
              </div>
              <div className="ml-3 text-right">
                <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded">
                  +2 meses
                </span>
              </div>
            </div>
          </div>

          <button className="w-full mt-6 text-indigo-600 text-sm font-bold hover:text-indigo-800 transition-colors uppercase tracking-widest border border-slate-200 py-3 rounded-xl hover:bg-slate-50">
            Ver Calendario
          </button>
        </div>
      </div>

      {/* Tabla Bandeja de Supervisión */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-800">
            Bandeja de Supervisión y Respuestas
          </h2>
          <p className="text-base text-slate-500 mt-1">
            Acceso rápido a las actividades evaluadas por la Jefatura
            recientemente.
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
              <tr className="hover:bg-slate-50 transition-colors group cursor-pointer">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      Auditoría no. 055/2025 de Adquisiciones de Bienes
                    </span>
                    <span className="text-sm text-slate-400 mt-1">
                      Enviada hace 2 días
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center">
                    <span className="bg-red-50 text-red-700 border border-red-200 px-4 py-1.5 rounded-full text-sm font-bold flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      Devuelto con 3 Observaciones
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-red-600 font-bold">Faltan 2 días</span>
                    <span className="text-sm text-slate-400 mt-1">
                      18/06/2026
                    </span>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors group cursor-pointer">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      Revisión de Control de Bienes con etiqueta
                    </span>
                    <span className="text-sm text-slate-400 mt-1">
                      Enviada hace 5 días
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center">
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 px-4 py-1.5 rounded-full text-sm font-bold flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Devuelto con 2 Recomendaciones
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-amber-600 font-bold">
                      Faltan 9 días
                    </span>
                    <span className="text-sm text-slate-400 mt-1">
                      25/06/2026
                    </span>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors group cursor-pointer">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      Auditoría 077/2025 Diagnóstico de archivo
                    </span>
                    <span className="text-sm text-slate-400 mt-1">
                      Evaluada hoy
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1.5 rounded-full text-sm font-bold flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Concluido (Sin observaciones)
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-slate-500 font-bold">
                      Finalizado a tiempo
                    </span>
                    <span className="text-sm text-slate-400 mt-1">
                      04/02/2026
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50 flex justify-center">
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest">
            Cargar historial anterior...
          </button>
        </div>
      </section>
    </div>
  );
}