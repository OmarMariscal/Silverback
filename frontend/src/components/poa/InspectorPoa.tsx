'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getModulePath } from '@/modules/perfiles/role-menu';
import type {
  InspectorPoaSupervisionProps,
  ModoVisualizacionSupervision,
} from '@/types/poa-contratos';

interface InspectorPoaProps {
  inspector: InspectorPoaSupervisionProps;
  modoVisualizacion: ModoVisualizacionSupervision;
  onAlternarModo: () => void;
  onCerrar: () => void;
}

export function InspectorPoa({
  inspector,
  modoVisualizacion,
  onAlternarModo,
  onCerrar,
}: InspectorPoaProps) {
  const [fichaExpandida, setFichaExpandida] = useState(false);
  const router = useRouter();

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
      {/* Header de Contexto del POA Seleccionado */}
      <div className="px-8 py-5 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-black text-sm shadow-sm shadow-indigo-200">
            {inspector.centroClave}
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">
              Plan Operativo Anual (POA {inspector.anioFiscal})
            </h2>
            <p className="text-xs text-slate-500">
              Contralor Responsable:{' '}
              <strong className="text-slate-700">
                {inspector.contralorNombre}
              </strong>{' '}
              • {inspector.totalActividades} Actividades Totales
            </p>
          </div>
        </div>

        {/* Controles en Cabecera: Estado + Pantalla Completa + Cerrar */}
        <div className="flex items-center space-x-3">
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${
              inspector.estadoPoa === 'EN_REVISION'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : inspector.estadoPoa === 'AUTORIZADA'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {inspector.estadoPoa === 'EN_REVISION' && (
              <span className="w-2 h-2 rounded-full bg-purple-500 mr-2 animate-pulse"></span>
            )}
            ESTADO: {inspector.estadoEtiqueta.toUpperCase()}
          </span>

          {/* Botón Pantalla Completa / Minimizar */}
          <button
            type="button"
            onClick={onAlternarModo}
            title={
              modoVisualizacion === 'PANTALLA_COMPLETA'
                ? 'Salir de pantalla completa'
                : 'Ver en pantalla completa'
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            {modoVisualizacion === 'PANTALLA_COMPLETA' ? (
              <>
                <svg
                  className="w-4 h-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 9L4 4m0 0h4m-4 0v4m11 5l5 5m0 0h-4m4 0v-4m-5-11l5-5m0 0v4m0-4h-4M4 20l5-5m-5 5h4m-4 0v-4"
                  />
                </svg>
                <span className="hidden sm:inline">Minimizar</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
                <span className="hidden sm:inline">Pantalla Completa</span>
              </>
            )}
          </button>

          {/* Botón Cerrar Inspección */}
          <button
            type="button"
            onClick={onCerrar}
            title="Cerrar inspección de POA"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors shadow-sm cursor-pointer"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Banner de Observaciones si el POA está devuelto */}
      {inspector.estadoPoa === 'DEVUELTA' && inspector.mensajeResolucion && (
        <div className="mx-8 mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3.5">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Observaciones emitidas en la devolución
              </h4>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">
                Devuelta al Contralor
              </span>
            </div>
            <p className="mt-1.5 text-xs text-amber-800 leading-relaxed font-medium">
              {inspector.mensajeResolucion}
            </p>
          </div>
        </div>
      )}

      {/* LISTADO DE ACTIVIDADES ACCORDEÓN */}
      <div className="p-8 space-y-6">
        {inspector.actividades.map((actividad) => (
          <div
            key={actividad.idActividad}
            className={`bg-white rounded-2xl border transition-colors overflow-hidden ${
              actividad.estaExpandida
                ? 'border-2 border-indigo-100 shadow-sm'
                : 'border-slate-200 shadow-sm hover:border-slate-300'
            }`}
          >
            {/* Header de la Actividad */}
            <div
              className={`p-6 flex items-start justify-between cursor-pointer ${
                actividad.estaExpandida
                  ? 'bg-slate-50/50 border-b border-slate-100'
                  : ''
              }`}
              onClick={() => actividad.onToggleExpandir()}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`${
                    actividad.estaExpandida
                      ? 'bg-indigo-50 border-indigo-100'
                      : 'bg-slate-100 border-slate-200'
                  } border rounded-xl px-3.5 py-2 text-center shrink-0`}
                >
                  <span
                    className={`text-[9px] font-bold uppercase tracking-widest block ${
                      actividad.estaExpandida
                        ? 'text-indigo-400'
                        : 'text-slate-400'
                    }`}
                  >
                    FOLIO
                  </span>
                  <span
                    className={`text-lg font-black leading-none ${
                      actividad.estaExpandida
                        ? 'text-indigo-700'
                        : 'text-slate-700'
                    }`}
                  >
                    {actividad.folio}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800 leading-tight">
                    {actividad.titulo}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 font-medium">
                    <span className="flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-1 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      {actividad.rangoFechasTexto}
                    </span>
                    <span
                      className={`${
                        actividad.estaExpandida
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      } px-2 py-0.5 rounded font-bold border`}
                    >
                      Avance: {actividad.porcentajeAvance}%
                    </span>
                    <span>
                      Auditores:{' '}
                      <strong className="text-slate-700">
                        {actividad.auditores.join(', ')}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  actividad.estaExpandida
                    ? 'hover:bg-slate-200/60 text-slate-700'
                    : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                }`}
              >
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    actividad.estaExpandida ? 'rotate-180' : ''
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
                  ></path>
                </svg>
              </button>
            </div>

            {/* Contenido Desplegable (Ficha Técnica + Subactividades) */}
            {actividad.estaExpandida && (
              <div className="p-6 space-y-6">
                {actividad.estaCargandoDetalles ? (
                  <div className="text-center py-4 text-xs font-bold text-indigo-600 animate-pulse">
                    Cargando detalles de la actividad...
                  </div>
                ) : (
                  <>
                    {/* SECCIÓN A: FICHA TÉCNICA */}
                    {actividad.fichaTecnica && (
                      <div className="bg-slate-50/50 rounded-xl border border-slate-200/80 p-5 space-y-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                          FICHA TÉCNICA DE LA ACTIVIDAD
                        </span>

                        <div
                          className={`relative transition-all duration-300 ${
                            fichaExpandida ? 'max-h-none' : 'max-h-20 overflow-hidden'
                          }`}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                            <div>
                              <span className="font-bold text-slate-700 block mb-1">
                                Justificación
                              </span>
                              <p className="text-slate-500 leading-relaxed">
                                {actividad.fichaTecnica.justificacion}
                              </p>
                            </div>
                            <div>
                              <span className="font-bold text-slate-700 block mb-1">
                                Objetivo General
                              </span>
                              <p className="text-slate-500 leading-relaxed">
                                {actividad.fichaTecnica.objetivoGeneral}
                              </p>
                            </div>
                            <div>
                              <span className="font-bold text-slate-700 block mb-1">
                                Objetivos Particulares
                              </span>
                              <p className="text-slate-500 leading-relaxed whitespace-pre-line">
                                {actividad.fichaTecnica.objetivosParticulares}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-3 border-t border-slate-200/60">
                            <div>
                              <span className="font-bold text-slate-700 block mb-1">
                                Meta del Proyecto
                              </span>
                              <p className="text-slate-500">
                                {actividad.fichaTecnica.metaProyecto}
                              </p>
                            </div>
                            <div>
                              <span className="font-bold text-slate-700 block mb-1">
                                Indicadores
                              </span>
                              <p className="text-slate-500">
                                {actividad.fichaTecnica.indicadores}
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
                          className="w-full mt-4 pt-4 border-t border-slate-100 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center justify-center uppercase tracking-wider cursor-pointer"
                        >
                          {fichaExpandida
                            ? 'Colapsar Ficha Técnica'
                            : 'Expandir Ficha Técnica'}
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
                    )}

                    {/* SECCIÓN B: TABLA DE SUBACTIVIDADES */}
                    {actividad.subactividades &&
                      actividad.subactividades.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                              Sub-actividades Específicas
                            </span>
                          </div>

                          <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  
                                  <th className="py-3 px-4 w-16">ID</th>
                                  <th className="py-3 px-4">
                                    Descripción de Tarea
                                  </th>
                                  <th className="py-3 px-4">
                                    Fechas Programadas
                                  </th>
                                  <th className="py-3 px-4">Duración</th>
                                  <th className="py-3 px-4 w-10"></th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {actividad.subactividades.map((sub) => (
                                  <tr
                                    key={sub.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() =>
                                        router.push(`${getModulePath('JEFA', 'poa')}/subactividades/${sub.id}`)
                                      }
                                      onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                          event.preventDefault();
                                          router.push(`${getModulePath('JEFA', 'poa')}/subactividades/${sub.id}`);
                                        }
                                      }}
                                    className="group cursor-pointer hover:bg-indigo-50/50 focus:bg-indigo-50/50 focus:outline-none transition-colors"
                                  >
                                    <td className="py-3 px-4 font-bold text-slate-700">
                                      {sub.folioSecuencial}
                                    </td>
                                    <td className="py-3 px-4 font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                                      {sub.descripcion}
                                    </td>
                                    <td className="py-3 px-4 text-slate-500">
                                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-medium">
                                        {sub.fechaInicioFormateada} —{' '}
                                        {sub.fechaTerminoFormateada}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                      <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-100">
                                        {sub.semanasTotales} sem
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-base text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:bg-indigo-100 group-hover:text-indigo-600">
                                        ›
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* BARRA INFERIOR FLOTANTE DE ACCIONES DE DICTAMEN */}
      {inspector.barraDictamen.puedeDictaminar && (
        <div className="px-8 py-4 border-t border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <span className="text-xs text-slate-300">
              Dictamen para{' '}
              <strong className="text-white font-bold">
                {inspector.barraDictamen.centroClave} (POA{' '}
                {inspector.barraDictamen.anioFiscal})
              </strong>
              . Revisa los objetivos antes de confirmar.
            </span>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={() => inspector.barraDictamen.onAbrirModalDevolver()}
              disabled={inspector.barraDictamen.estaDictaminando}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Devolver con Observaciones</span>
            </button>

            <button
              type="button"
              onClick={() => inspector.barraDictamen.onAutorizarPoa()}
              disabled={inspector.barraDictamen.estaDictaminando}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-950/50 flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span>
                {inspector.barraDictamen.estaDictaminando
                  ? 'Procesando...'
                  : `Autorizar POA ${inspector.barraDictamen.anioFiscal}`}
              </span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}