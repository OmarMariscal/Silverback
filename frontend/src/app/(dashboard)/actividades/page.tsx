export default function ActividadesPage() {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
      <header className="h-24 px-10 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 z-10 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Directorio Global de Actividades
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <button className="text-slate-400 hover:text-indigo-600 transition-colors relative">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
          <button className="text-slate-400 hover:text-indigo-600 transition-colors relative">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 cursor-pointer group">
            <div className="flex flex-col items-end">
              <span className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                Jefa Titular
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Contraloría General
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center">
              <svg
                className="w-7 h-7 text-slate-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1600px] mx-auto flex flex-col h-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                Supervisión Operativa
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Busca, filtra, ordena y accede al historial de todas las tareas
                en la red.
              </p>
            </div>
            <button className="mt-4 md:mt-0 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Exportar Vista Actual (.xlsx)
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-white z-10 relative shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative min-w-[300px]">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors placeholder-slate-400 text-slate-800"
                    placeholder="Buscar por título, identificador o descripción..."
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    defaultValue="Todos los Centros"
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="Todos los Centros">Todos los Centros</option>
                    <option value="CUCEI">CUCEI</option>
                    <option value="CUVALLES">CU Valles</option>
                    <option value="CUCS">CUCS</option>
                    <option value="CUAAD">CUAAD</option>
                  </select>

                  <select
                    defaultValue="Tipo de Actividad"
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="Tipo de Actividad">Tipo de Actividad</option>
                    <option value="auditoria">Auditorías</option>
                    <option value="revision">Revisiones</option>
                  </select>

                  <select
                    defaultValue="Estado de Flujo"
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="Estado de Flujo">Estado de Flujo</option>
                    <option value="progreso">En Progreso</option>
                    <option value="revisar">Por Revisar</option>
                    <option value="devuelta">Devuelta</option>
                    <option value="concluida">Concluida</option>
                    <option value="sin_empezar">
                      Sin Empezar / Por Autorizar
                    </option>
                  </select>

                  <div className="h-8 w-px bg-slate-200 mx-1"></div>

                  <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-100 rounded-xl px-2 py-1.5">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest pl-2">
                      Ordenar:
                    </span>
                    <select
                      defaultValue="Más recientes"
                      className="bg-transparent text-indigo-700 text-sm font-bold border-none focus:ring-0 px-2 py-1 outline-none cursor-pointer"
                    >
                      <option value="Más recientes">Más recientes</option>
                      <option value="estado">Por Estado de Flujo</option>
                      <option value="semaforo">
                        Por Semáforo (Rojo primero)
                      </option>
                      <option value="fecha">Por Fecha Término POA</option>
                      <option value="centro">Por Centro Universitario</option>
                    </select>
                    <div className="h-5 w-px bg-indigo-200"></div>
                    <button
                      className="text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 p-1.5 rounded-lg transition-colors flex items-center"
                      title="Más Opciones y Filtros Avanzados"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center mt-4 space-x-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">
                  Filtros aplicados:
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm">
                  Año POA: 2026
                  <button className="ml-2 text-indigo-400 hover:text-indigo-600">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">
                  Excluir Concluidas
                  <button className="ml-2 text-slate-400 hover:text-slate-600">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
                <button className="text-xs text-slate-400 hover:text-indigo-600 font-bold underline ml-2 transition-colors">
                  Limpiar todos
                </button>
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1200px]">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-0">
                  <tr>
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-32">
                      Identificador
                    </th>
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      Actividad y Fechas
                    </th>
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-48">
                      Asignación
                    </th>
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-48">
                      Estado Operativo
                    </th>
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-36">
                      Semáforo
                    </th>
                    <th className="px-6 py-5 w-12"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm">
                  <tr className="hover:bg-indigo-50/40 transition-colors group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex flex-col items-start">
                        <span className="text-base font-black text-slate-800">
                          No. 055
                        </span>
                        <span className="mt-1.5 bg-purple-100 text-purple-700 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest">
                          Auditoría
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-slate-800 group-hover:text-indigo-700 transition-colors truncate max-w-lg">
                          Abatir el rezago en solventación de observaciones
                          (Adquisiciones)
                        </span>
                        <div className="flex items-center mt-2 text-xs font-medium text-slate-500">
                          <svg
                            className="w-4 h-4 mr-1.5 text-slate-400"
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
                          Término POA: Mar 2026
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">
                          CUCEI
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                          Mtro. Braulio Vicente Ruiz
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                        <svg
                          className="w-4 h-4 mr-1.5"
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
                        Devuelta (3 Obs)
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <span className="relative flex h-3.5 w-3.5 mr-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                        </span>
                        <span className="text-sm font-bold text-slate-700">
                          Crítico
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors ml-auto">
                        <svg
                          className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform"
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
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-indigo-50/40 transition-colors group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex flex-col items-start">
                        <span className="text-base font-black text-slate-800">
                          No. 056
                        </span>
                        <span className="mt-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest">
                          Revisión
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-slate-800 group-hover:text-indigo-700 transition-colors truncate max-w-lg">
                          Desincorporación de bienes muebles (Mensual)
                        </span>
                        <div className="flex items-center mt-2 text-xs font-medium text-slate-500">
                          <svg
                            className="w-4 h-4 mr-1.5 text-slate-400"
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
                          Término POA: Dic 2026
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">
                          CU Valles
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                          Lic. Titular CU Valles
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                        <svg
                          className="w-4 h-4 mr-1.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        En Proceso
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <span className="inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 mr-2.5"></span>
                        <span className="text-sm font-bold text-slate-700">
                          En Alerta
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors ml-auto">
                        <svg
                          className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform"
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
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-indigo-50/60 transition-colors group cursor-pointer bg-indigo-50/30">
                    <td className="px-8 py-5">
                      <div className="flex flex-col items-start">
                        <span className="text-base font-black text-slate-800">
                          No. 077
                        </span>
                        <span className="mt-1.5 bg-purple-100 text-purple-700 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest">
                          Auditoría
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-slate-800 group-hover:text-indigo-700 transition-colors truncate max-w-lg">
                          Diagnóstico de archivo y gestión documental
                        </span>
                        <div className="flex items-center mt-2 text-xs font-medium text-slate-500">
                          <svg
                            className="w-4 h-4 mr-1.5 text-slate-400"
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
                          Término POA: May 2026
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">
                          CUCS
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                          Contralor Salud
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center bg-indigo-100 border border-indigo-300 text-indigo-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                        <svg
                          className="w-4 h-4 mr-1.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Por Revisar (Evidencia)
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <span className="inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 mr-2.5"></span>
                        <span className="text-sm font-bold text-slate-700">
                          A Tiempo
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-600 text-white ml-auto shadow-md group-hover:scale-110 transition-transform">
                        <svg
                          className="w-5 h-5"
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
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors group cursor-pointer bg-slate-50/50">
                    <td className="px-8 py-5">
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 border-2 border-dashed border-slate-300 px-3 py-1.5 rounded-lg">
                          Sin Asignar
                        </span>
                        <span className="mt-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest opacity-80">
                          Revisión
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-slate-600 group-hover:text-slate-800 transition-colors truncate max-w-lg">
                          Revisión de asistencia académica (Trimestral)
                        </span>
                        <div className="flex items-center mt-2 text-xs font-medium text-slate-400">
                          <svg
                            className="w-4 h-4 mr-1.5"
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
                          Término POA: Por definir
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col opacity-80">
                        <span className="text-sm font-bold text-slate-600">
                          CUAAD
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                          Mtra. Contralora Arte
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg">
                        <svg
                          className="w-4 h-4 mr-1.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Por Autorizar POA
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center opacity-60">
                        <span className="inline-flex rounded-full h-3.5 w-3.5 bg-slate-300 mr-2.5"></span>
                        <span className="text-sm font-bold text-slate-500">
                          N/A
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors ml-auto">
                        <svg
                          className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-transform"
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
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors group cursor-pointer bg-slate-50/50">
                    <td className="px-8 py-5">
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 border-2 border-dashed border-slate-300 px-3 py-1.5 rounded-lg">
                          Sin Asignar
                        </span>
                        <span className="mt-2 bg-purple-100 text-purple-700 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest opacity-80">
                          Auditoría
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-slate-600 group-hover:text-slate-800 transition-colors truncate max-w-lg">
                          Auditoría de Ingresos Autogenerados
                        </span>
                        <div className="flex items-center mt-2 text-xs font-medium text-slate-400">
                          <svg
                            className="w-4 h-4 mr-1.5"
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
                          Término POA: Sep 2026
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col opacity-80">
                        <span className="text-sm font-bold text-slate-600">
                          CUCS
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                          Contralor Salud
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg">
                        <svg
                          className="w-4 h-4 mr-1.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Sin Empezar
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center opacity-60">
                        <span className="inline-flex rounded-full h-3.5 w-3.5 bg-slate-300 mr-2.5"></span>
                        <span className="text-sm font-bold text-slate-500">
                          Gris
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors ml-auto">
                        <svg
                          className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-transform"
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
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-indigo-50/40 transition-colors group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex flex-col items-start">
                        <span className="text-base font-black text-slate-800">
                          No. 042
                        </span>
                        <span className="mt-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest">
                          Revisión
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-slate-800 group-hover:text-indigo-700 transition-colors truncate max-w-lg">
                          Revisión de parque vehicular operativo
                        </span>
                        <div className="flex items-center mt-2 text-xs font-medium text-slate-500">
                          <svg
                            className="w-4 h-4 mr-1.5 text-slate-400"
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
                          Término POA: Jun 2026
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">
                          CUCEI
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                          Mtro. Braulio Vicente Ruiz
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                        <svg
                          className="w-4 h-4 mr-1.5"
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
                        Concluida
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <span className="inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 mr-2.5"></span>
                        <span className="text-sm font-bold text-slate-700">
                          Concluido
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors ml-auto">
                        <svg
                          className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform"
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
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}