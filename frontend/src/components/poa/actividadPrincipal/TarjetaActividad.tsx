'use client';

import React, { useState } from 'react';
import { TarjetaActividadPOAProps } from '@/types/poa-contratos';

interface Props extends TarjetaActividadPOAProps {
  consecutivoIndex: number;
  onAbrirModalSubactividades?: (idActividad: string, tituloActividad: string) => void;
  onAbrirSubactividad?: (subActividadId: string) => void;
}

const MESES_CORTOS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

function formatearFechaCabecera(fecha?: string): string {
  if (!fecha) return 'N/A';
  const match = /^(\d{4})-(\d{2})/.exec(fecha.trim());
  if (!match) return fecha;
  const mesIdx = Number(match[2]) - 1;
  if (mesIdx < 0 || mesIdx > 11) return fecha;
  return `${MESES_CORTOS[mesIdx]} ${match[1]}`;
}

function formatearFechaSubactividad(fecha?: string): string {
  if (!fecha) return 'N/A';
  const match = /^(\d{4})-(\d{2})/.exec(fecha.trim());
  if (!match) return fecha;
  const mesIdx = Number(match[2]) - 1;
  if (mesIdx < 0 || mesIdx > 11) return fecha;
  return `${MESES_CORTOS[mesIdx]} ${match[1].slice(-2)}`;
}

export function TarjetaActividad({
  idActividad,
  consecutivoIndex,
  titulo,
  participacionGlobal,
  esRezagada = false,
  fechaInicioPadre,
  fechaTerminoPadre,
  auditoresResumen,
  fichaTecnica,
  subactividades,
  estaCargandoDetalles,
  puedeEditar,
  ocultarBotonBorrar,
  onAbrirModalSubactividades,
  onAbrirSubactividad,
  onBorrarActividad,
  onConfigurarFichaTecnica,
  onExpandirTarjeta,
}: Props) {
  const [estaExpandida, setEstaExpandida] = useState(false);
  const [fichaExpandida, setFichaExpandida] = useState(false);

  const handleToggle = () => {
    if (!estaExpandida) onExpandirTarjeta();
    setEstaExpandida(!estaExpandida);
  };

  const numConsecutivo = (consecutivoIndex + 1).toString().padStart(2, '0');

  const auditoresTexto =
    auditoresResumen && auditoresResumen.length > 0
      ? auditoresResumen.join(', ')
      : 'Sin auditores asignados';

  // Estilos del contenedor principal según estado (Normal vs Rezagada / Expandida vs Colapsada)
  const clasesContenedor = esRezagada
    ? estaExpandida
      ? 'bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden mb-6 transition-all ring-4 ring-red-50/50'
      : 'bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden mb-6 hover:border-red-300 transition-colors group'
    : estaExpandida
      ? 'bg-white rounded-2xl shadow-sm border border-indigo-200 overflow-hidden mb-6 transition-all ring-4 ring-indigo-50/50'
      : 'bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 hover:border-indigo-300 transition-colors group';

  // Estilos de la cabecera según estado
  const clasesCabecera = estaExpandida
    ? esRezagada
      ? 'p-6 border-b border-red-100 flex justify-between items-start bg-white cursor-pointer hover:bg-red-50/30 transition-colors'
      : 'p-6 border-b border-slate-100 flex justify-between items-start bg-white cursor-pointer hover:bg-slate-50 transition-colors'
    : 'p-6 flex justify-between items-start cursor-pointer';

  // Estilos de la caja de Folio
  const clasesFolio = esRezagada
    ? 'flex flex-col items-center justify-center bg-red-50 text-red-700 rounded-xl px-4 py-3 border border-red-100 min-w-[5rem]'
    : estaExpandida
      ? 'flex flex-col items-center justify-center bg-indigo-50 text-indigo-700 rounded-xl px-4 py-3 border border-indigo-100 min-w-[5rem]'
      : 'flex flex-col items-center justify-center bg-slate-50 text-slate-500 rounded-xl px-4 py-3 border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors min-w-[5rem]';

  // Estilos del título
  const clasesTitulo =
    esRezagada || estaExpandida
      ? 'text-xl font-bold text-slate-800 leading-tight'
      : 'text-xl font-bold text-slate-700 group-hover:text-indigo-700 transition-colors leading-tight';

  return (
    <div className={clasesContenedor}>
      {/* CABECERA DE LA TARJETA */}
      <div onClick={handleToggle} className={clasesCabecera}>
        <div className="flex items-start space-x-5">
          <div className={clasesFolio}>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">
              Folio
            </span>
            <span className="font-black text-2xl">{numConsecutivo}</span>
          </div>

          <div className="pt-1">
            {esRezagada ? (
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h3 className={clasesTitulo}>{titulo}</h3>
                <span className="bg-red-100 text-red-700 text-[10px] px-2.5 py-1 rounded-md uppercase font-bold tracking-widest border border-red-200">
                  Rezago Automático
                </span>
              </div>
            ) : (
              <h3 className={clasesTitulo}>{titulo}</h3>
            )}

            <div className="flex flex-wrap items-center mt-3 gap-y-2 gap-x-6">
              {/* Rango de Fechas */}
              <span className="flex items-center text-sm font-medium text-slate-500">
                <svg
                  className={`w-4 h-4 mr-2 transition-colors ${
                    esRezagada
                      ? 'text-red-400'
                      : estaExpandida
                        ? 'text-indigo-400'
                        : 'text-slate-400 group-hover:text-indigo-400'
                  }`}
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
                {formatearFechaCabecera(fechaInicioPadre)} - {formatearFechaCabecera(fechaTerminoPadre)}
              </span>

              {/* Participación Global */}
              <span
                className={
                  esRezagada || estaExpandida
                    ? 'flex items-center text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md'
                    : 'flex items-center text-sm font-bold text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1 rounded-md group-hover:bg-indigo-50/50 group-hover:text-indigo-700 transition-colors'
                }
              >
                <svg
                  className={`w-4 h-4 mr-2 transition-colors ${
                    esRezagada
                      ? 'text-slate-400'
                      : estaExpandida
                        ? 'text-indigo-500'
                        : 'text-slate-400 group-hover:text-indigo-500'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
                Participación Global: {participacionGlobal}%
              </span>

              {/* Auditores */}
              <span
                className={`flex items-center text-sm font-medium ${
                  esRezagada || estaExpandida ? 'text-slate-600' : 'text-slate-500'
                }`}
              >
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span className="text-slate-400 mr-1">Auditores:</span> {auditoresTexto}
              </span>
            </div>
          </div>
        </div>

        {/* ACCIONES DERECHA (Expandida vs Colapsada) */}
        {estaExpandida ? (
          <div className="flex items-center space-x-2 pl-4">
            {puedeEditar && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onConfigurarFichaTecnica();
                }}
                className={`text-slate-400 p-2 rounded-full transition-colors cursor-pointer ${
                  esRezagada
                    ? 'hover:text-red-600 hover:bg-red-50'
                    : 'hover:text-indigo-600 hover:bg-indigo-50'
                }`}
                title="Editar Actividad"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            )}

            {!ocultarBotonBorrar && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onBorrarActividad();
                }}
                className={`text-slate-400 p-2 rounded-full transition-colors cursor-pointer ${
                  esRezagada
                    ? 'hover:text-red-600 hover:bg-red-50'
                    : 'hover:text-red-500 hover:bg-red-50'
                }`}
                title="Eliminar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}

            <div className="h-8 w-px bg-slate-200 mx-2"></div>

            <button
              type="button"
              className={`${esRezagada ? 'text-red-600' : 'text-indigo-600'} p-2 cursor-pointer`}
              aria-label="Colapsar actividad"
            >
              <svg
                className="w-6 h-6 transform rotate-180 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        ) : (
          <svg
            className={`w-6 h-6 text-slate-300 transition-colors mt-2 mr-2 ${
              esRezagada ? 'group-hover:text-red-500' : 'group-hover:text-indigo-500'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </div>

      {/* CONTENIDO DESPLEGABLE DE LA TARJETA */}
      {estaExpandida && (
        <div className={`p-8 ${esRezagada ? 'bg-red-50/20' : 'bg-slate-50/50'}`}>
          {estaCargandoDetalles ? (
            <div className="text-center py-8 text-slate-500 text-sm animate-pulse">
              Cargando detalles técnicos y subactividades...
            </div>
          ) : (
            <>
              {/* FICHA TÉCNICA DE LA ACTIVIDAD */}
              <div
                className={`bg-white rounded-xl border ${
                  esRezagada ? 'border-red-100' : 'border-slate-200'
                } p-6 mb-8 relative shadow-sm`}
              >
                <h4
                  className={`text-xs font-bold ${
                    esRezagada ? 'text-red-400' : 'text-slate-400'
                  } uppercase tracking-widest mb-4 flex items-center`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Ficha Técnica de la Actividad
                </h4>

                <div
                  className={`relative transition-all duration-300 ${
                    fichaExpandida ? 'max-h-none' : 'max-h-32 overflow-hidden'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                    <div>
                      <h5 className="text-sm font-bold text-slate-700 mb-2">Justificación</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {fichaTecnica?.justificacion || 'Sin especificar.'}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-700 mb-2">Objetivo General</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {fichaTecnica?.objetivoGeneral || 'Sin especificar.'}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-700 mb-2">
                        Objetivos Particulares
                      </h5>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {fichaTecnica?.objetivosParticulares || 'Sin especificar.'}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-700 mb-2">
                        Meta del Proyecto
                      </h5>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {fichaTecnica?.metaProyecto || 'Sin especificar.'}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-700 mb-2">Indicadores</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {fichaTecnica?.indicadores || 'Sin especificar.'}
                      </p>
                    </div>
                  </div>

                  {!fichaExpandida && (
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setFichaExpandida(!fichaExpandida)}
                  className={`w-full mt-4 pt-4 border-t border-slate-100 text-xs font-bold ${
                    esRezagada
                      ? 'text-red-600 hover:text-red-800'
                      : 'text-indigo-600 hover:text-indigo-800'
                  } transition-colors flex items-center justify-center uppercase tracking-wider cursor-pointer`}
                >
                  {fichaExpandida ? 'Colapsar Ficha Técnica' : 'Expandir Ficha Técnica'}
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                      fichaExpandida ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* TABLA DE SUBACTIVIDADES */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {esRezagada
                      ? 'Sub-actividades Pendientes Autocargadas'
                      : 'Sub-actividades Específicas'}
                  </h4>
                  {puedeEditar && (
                    <button
                      type="button"
                      onClick={() => onAbrirModalSubactividades?.(idActividad, titulo)}
                      className={`text-sm font-bold flex items-center px-4 py-2 rounded-lg transition-colors border cursor-pointer ${
                        esRezagada
                          ? 'text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border-red-100'
                          : 'text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border-indigo-100'
                      }`}
                    >
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      {esRezagada ? 'Añadir Sub-actividad manual' : 'Añadir Sub-actividad'}
                    </button>
                  )}
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-20 text-center">
                          ID
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                          Descripción de Tarea
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-48">
                          Fechas
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-36 text-center">
                          Semanas
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {subactividades && subactividades.length > 0 ? (
                        subactividades.map((sub) => (
                          <tr
                            key={sub.id}
                            className="hover:bg-slate-50/80 transition-colors group"
                          >
                            <td className="px-6 py-5 text-center">
                              <span className="inline-block bg-slate-100 text-slate-600 font-bold text-xs px-2.5 py-1 rounded-md">
                                {sub.folioSecuencial}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-slate-700 font-medium leading-relaxed pr-8">
                              {onAbrirSubactividad ? (
                                <button
                                  type="button"
                                  onClick={() => onAbrirSubactividad(sub.id)}
                                  className={`group/link inline-flex w-full items-center justify-between gap-3 text-left text-slate-700 transition-colors ${
                                    esRezagada
                                      ? 'hover:text-red-700 focus-visible:ring-red-500'
                                      : 'hover:text-indigo-700 focus-visible:ring-indigo-500'
                                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
                                  aria-label={`Abrir entrega de la subactividad ${sub.folioSecuencial}: ${sub.descripcion}`}
                                >
                                  <span>{sub.descripcion}</span>
                                  <span
                                    className={`inline-flex shrink-0 items-center gap-1 text-xs font-bold ${
                                      esRezagada ? 'text-red-600' : 'text-indigo-600'
                                    } opacity-0 transition-opacity group-hover/link:opacity-100 group-focus-visible/link:opacity-100`}
                                  >
                                    Abrir entrega
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5l7 7-7 7"
                                      />
                                    </svg>
                                  </span>
                                </button>
                              ) : (
                                sub.descripcion
                              )}
                            </td>
                            <td className="px-6 py-5">
                              <span className="text-slate-600 font-medium flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 whitespace-nowrap">
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
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {formatearFechaSubactividad(sub.fechaInicioFormateada)} -{' '}
                                {formatearFechaSubactividad(sub.fechaTerminoFormateada)}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <span
                                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide border ${
                                  esRezagada
                                    ? 'bg-red-50 text-red-700 border-red-100'
                                    : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                }`}
                              >
                                {sub.semanasTotales} sem
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">
                            No hay subactividades registradas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}