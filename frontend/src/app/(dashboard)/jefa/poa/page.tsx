'use client';

import React, { useEffect, useState } from 'react';
import { useJefaPoaStore } from '@/store/poa-supervision.store';
import ModalDevolverPoa from '@/components/ui/ModalDevolverPoa';

export default function JefaSupervisionPoaPage() {
  const store = useJefaPoaStore();

  // Extraemos las vistas computadas para la UI
  const centros = store.obtenerCentrosFiltradosUI();
  const inspector = store.obtenerInspectorPoaUI();
  const [fichaExpandida, setFichaExpandida] = useState(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    store.cargarCentros();
  }, []);

  if (store.estaCargandoCentros) {
    return <div className="p-8 text-center text-slate-500 font-bold">Cargando centros y POAs...</div>;
  }

  const centroSeleccionadoVisible = Boolean(inspector && centros.some(c => c.idCentro === inspector.idCentro));
  const esPantallaCompleta = store.modoVisualizacion === 'PANTALLA_COMPLETA' && centroSeleccionadoVisible;

  return (
    <main className="flex-1 overflow-y-auto p-8 space-y-6">
      <div className="max-w-[1400px] mx-auto space-y-6">

        {/* 1. MODO PANTALLA COMPLETA: Barra de retorno */}
        {esPantallaCompleta ? (
          <div className="flex items-center justify-between bg-white px-6 py-3.5 rounded-xl border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => store.setModoVisualizacion('INCRUSTADA')}
              className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors group cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2 text-slate-400 group-hover:text-indigo-600 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a la lista de POAs
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Modo Pantalla Completa:</span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                {inspector?.centroClave} (POA {inspector?.anioFiscal})
              </span>
            </div>
          </div>
        ) : (
          /* 2. MODO NORMAL (INCRUSTADA): Filtros y Carrusel de Centros */
          <>
            {/* Barra Superior: Filtros Rápidos + Buscador */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => store.setFiltroEstado('TODOS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer ${
                    store.filtroEstado === 'TODOS' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todos ({store.kpis.totalCentros})
                </button>
                <button 
                  type="button"
                  onClick={() => store.setFiltroEstado('POR_AUTORIZAR')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center cursor-pointer ${
                    store.filtroEstado === 'POR_AUTORIZAR' ? 'bg-purple-100 border-purple-300 text-purple-800' : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-purple-500 mr-1.5"></span>
                  Por Autorizar ({store.kpis.porAutorizar})
                </button>
                <button 
                  type="button"
                  onClick={() => store.setFiltroEstado('DEVUELTAS')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center cursor-pointer ${
                    store.filtroEstado === 'DEVUELTAS' ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
                  Devueltas ({store.kpis.devueltas})
                </button>
                <button 
                  type="button"
                  onClick={() => store.setFiltroEstado('AUTORIZADAS')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center cursor-pointer ${
                    store.filtroEstado === 'AUTORIZADAS' ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                  Autorizadas ({store.kpis.autorizadas})
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input 
                    type="text" 
                    value={store.busquedaTexto}
                    onChange={(e) => store.setBusquedaTexto(e.target.value)}
                    placeholder="Buscar por centro o contralor..." 
                    className="w-64 pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 placeholder-slate-400"
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <select 
                  value={store.anioGlobal}
                  onChange={(e) => store.setAnioGlobal(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-1.5 px-3 rounded-lg focus:outline-none cursor-pointer"
                >
                  {store.aniosDisponibles.map(anio => (
                    <option key={anio} value={anio}>Año POA: {anio}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* CARRUSEL DE CENTROS */}
            <div className="relative group">
              <button 
                type="button"
                onClick={() => {
                  const el = document.getElementById('carrusel-centros-container');
                  if (el) el.scrollBy({ left: -380, behavior: 'smooth' });
                }}
                className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:scale-105 transition-all cursor-pointer"
                title="Desplazar a la izquierda"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>

              <div id="carrusel-centros-container" className="flex space-x-5 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none snap-x">
                {centros.map((centro) => (
                  <div 
                    key={centro.idCentro}
                    onClick={() => centro.onSeleccionarCentro(centro.idCentro)}
                    className={`w-[380px] shrink-0 bg-white rounded-xl border-2 shadow-sm p-5 flex flex-col justify-between relative snap-start cursor-pointer transition-all ${
                      centro.estaSeleccionado ? 'border-indigo-600 shadow-md ring-2 ring-indigo-500/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Etiqueta Superior Derecha (Dependiendo del estado) */}
                    {centro.poaResumen.estado === 'EN_REVISION' && (
                       <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-lg rounded-tr-lg tracking-wider">
                         Dictamen Pendiente
                       </div>
                    )}

                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Centro Universitario</span>
                          <h3 className="text-lg font-black text-slate-800">{centro.clave}</h3>
                          <p className="text-xs text-slate-500">{centro.nombre}</p>
                        </div>
                        
                        {centro.poaResumen.porcentajeAvanceGlobal !== null && (
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Avance POA</span>
                            <span className="text-lg font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              {centro.poaResumen.porcentajeAvanceGlobal}%
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 mb-3 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">Contralor Actual</span>
                          <span className="text-xs font-bold text-slate-700">{centro.contralorNombre}</span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">{centro.contralorEstatus}</span>
                      </div>

                      <div className="mb-3">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Histórico</span>
                        <div className="flex space-x-1">
                          {centro.aniosHistoricos.map(anio => (
                            <button 
                              key={anio}
                              type="button"
                              onClick={(e) => { e.stopPropagation(); centro.onCambiarAnio(centro.idCentro, anio); }}
                              className={`px-2 py-0.5 rounded text-xs font-bold border transition-colors cursor-pointer ${
                                centro.anioSeleccionado === anio 
                                ? `bg-${centro.poaResumen.estadoBadgeColor}-100 text-${centro.poaResumen.estadoBadgeColor}-800 border-${centro.poaResumen.estadoBadgeColor}-200`
                                : 'bg-slate-50 text-slate-600 font-medium border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {anio} {centro.anioSeleccionado === anio ? '•' : ''}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5 border-t border-slate-100 pt-2.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Estado POA {centro.anioSeleccionado}:</span>
                          <span className={`font-bold px-2 py-0.5 rounded border bg-${centro.poaResumen.estadoBadgeColor}-50 text-${centro.poaResumen.estadoBadgeColor}-700 border-${centro.poaResumen.estadoBadgeColor}-200`}>
                            {centro.poaResumen.estadoEtiqueta}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{centro.poaResumen.etiquetaFecha}</span>
                          <span className="font-bold text-slate-700">{centro.poaResumen.fechaTexto}</span>
                        </div>
                      </div>
                    </div>

                    {centro.estaSeleccionado ? (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-indigo-600 font-bold text-xs">
                        <span>Inspeccionando ahora</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    ) : (
                      <button 
                        type="button"
                        className="mt-4 w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        Cargar para Revisar
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button 
                type="button"
                onClick={() => {
                  const el = document.getElementById('carrusel-centros-container');
                  if (el) el.scrollBy({ left: 380, behavior: 'smooth' });
                }}
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:scale-105 transition-all cursor-pointer"
                title="Desplazar a la derecha"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </>
        )}
        
        {/* 3. INSPECTOR DE POA SELECCIONADO O ESTADO VACÍO */}
        {centroSeleccionadoVisible && inspector ? (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
            
            {/* Header de Contexto del POA Seleccionado */}
            <div className="px-8 py-5 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-black text-sm shadow-sm shadow-indigo-200">
                  {inspector.centroClave}
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">Plan Operativo Anual (POA {inspector.anioFiscal})</h2>
                  <p className="text-xs text-slate-500">Contralor Responsable: <strong className="text-slate-700">{inspector.contralorNombre}</strong> • {inspector.totalActividades} Actividades Totales</p>
                </div>
              </div>

              {/* Controles en Cabecera: Estado + Pantalla Completa + Cerrar */}
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${
                  inspector.estadoPoa === 'EN_REVISION' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                  inspector.estadoPoa === 'AUTORIZADA' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {inspector.estadoPoa === 'EN_REVISION' && <span className="w-2 h-2 rounded-full bg-purple-500 mr-2 animate-pulse"></span>}
                  ESTADO: {inspector.estadoEtiqueta.toUpperCase()}
                </span>

                {/* Botón Pantalla Completa / Minimizar */}
                <button
                  type="button"
                  onClick={() => store.alternarModoVisualizacion()}
                  title={store.modoVisualizacion === 'PANTALLA_COMPLETA' ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {store.modoVisualizacion === 'PANTALLA_COMPLETA' ? (
                    <>
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9L4 4m0 0h4m-4 0v4m11 5l5 5m0 0h-4m4 0v-4m-5-11l5-5m0 0v4m0-4h-4M4 20l5-5m-5 5h4m-4 0v-4" />
                      </svg>
                      <span className="hidden sm:inline">Minimizar</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span className="hidden sm:inline">Pantalla Completa</span>
                    </>
                  )}
                </button>

                {/* Botón Cerrar Inspección */}
                <button
                  type="button"
                  onClick={() => store.deseleccionarCentro()}
                  title="Cerrar inspección de POA"
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors shadow-sm cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Banner de Observaciones si el POA está devuelto */}
            {inspector.estadoPoa === 'DEVUELTA' && inspector.mensajeResolucion && (
              <div className="mx-8 mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3.5">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
                <div key={actividad.idActividad} className={`bg-white rounded-2xl border transition-colors overflow-hidden ${
                  actividad.estaExpandida ? 'border-2 border-indigo-100 shadow-sm' : 'border-slate-200 shadow-sm hover:border-slate-300'
                }`}>
                  
                  {/* Header de la Actividad */}
                  <div 
                    className={`p-6 flex items-start justify-between cursor-pointer ${actividad.estaExpandida ? 'bg-slate-50/50 border-b border-slate-100' : ''}`}
                    onClick={() => actividad.onToggleExpandir()}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`${actividad.estaExpandida ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-100 border-slate-200'} border rounded-xl px-3.5 py-2 text-center shrink-0`}>
                        <span className={`text-[9px] font-bold uppercase tracking-widest block ${actividad.estaExpandida ? 'text-indigo-400' : 'text-slate-400'}`}>FOLIO</span>
                        <span className={`text-lg font-black leading-none ${actividad.estaExpandida ? 'text-indigo-700' : 'text-slate-700'}`}>{actividad.folio}</span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-800 leading-tight">{actividad.titulo}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 font-medium">
                          <span className="flex items-center">
                            <svg className="w-3.5 h-3.5 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            {actividad.rangoFechasTexto}
                          </span>
                          <span className={`${actividad.estaExpandida ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-100 text-slate-700 border-slate-200'} px-2 py-0.5 rounded font-bold border`}>
                            Avance: {actividad.porcentajeAvance}%
                          </span>
                          <span>Auditores: <strong className="text-slate-700">{actividad.auditores.join(', ')}</strong></span>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button"
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                        actividad.estaExpandida ? 'hover:bg-slate-200/60 text-slate-700' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <svg className={`w-5 h-5 transform transition-transform ${actividad.estaExpandida ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                  </div>

                  {/* Contenido Desplegable (Ficha Técnica + Subactividades) */}
                  {actividad.estaExpandida && (
                    <div className="p-6 space-y-6">
                      {actividad.estaCargandoDetalles ? (
                        <div className="text-center py-4 text-xs font-bold text-indigo-600 animate-pulse">Cargando detalles de la actividad...</div>
                      ) : (
                        <>
                          {/* SECCIÓN A: FICHA TÉCNICA */}
                          {actividad.fichaTecnica && (
                            <div className="bg-slate-50/50 rounded-xl border border-slate-200/80 p-5 space-y-4">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">FICHA TÉCNICA DE LA ACTIVIDAD</span>
                              
                              <div className={`relative transition-all duration-300 ${fichaExpandida ? 'max-h-none' : 'max-h-20 overflow-hidden'}`}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                                  <div>
                                    <span className="font-bold text-slate-700 block mb-1">Justificación</span>
                                    <p className="text-slate-500 leading-relaxed">{actividad.fichaTecnica.justificacion}</p>
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-700 block mb-1">Objetivo General</span>
                                    <p className="text-slate-500 leading-relaxed">{actividad.fichaTecnica.objetivoGeneral}</p>
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-700 block mb-1">Objetivos Particulares</span>
                                    <p className="text-slate-500 leading-relaxed whitespace-pre-line">{actividad.fichaTecnica.objetivosParticulares}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-3 border-t border-slate-200/60">
                                  <div>
                                    <span className="font-bold text-slate-700 block mb-1">Meta del Proyecto</span>
                                    <p className="text-slate-500">{actividad.fichaTecnica.metaProyecto}</p>
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-700 block mb-1">Indicadores</span>
                                    <p className="text-slate-500">{actividad.fichaTecnica.indicadores}</p>
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
                                {fichaExpandida ? 'Colapsar Ficha Técnica' : 'Expandir Ficha Técnica'}
                                <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${fichaExpandida ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                          )}

                          {/* SECCIÓN B: TABLA DE SUBACTIVIDADES */}
                          {actividad.subactividades && actividad.subactividades.length > 0 && (
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sub-actividades Específicas</span>
                              </div>

                              <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <table className="w-full text-left border-collapse text-xs">
                                  <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                      <th className="py-3 px-4 w-16">ID</th>
                                      <th className="py-3 px-4">Descripción de Tarea</th>
                                      <th className="py-3 px-4">Fechas Programadas</th>
                                      <th className="py-3 px-4">Duración</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {actividad.subactividades.map((sub) => (
                                      <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-3 px-4 font-bold text-slate-700">{sub.folioSecuencial}</td>
                                        <td className="py-3 px-4 font-semibold text-slate-800">{sub.descripcion}</td>
                                        <td className="py-3 px-4 text-slate-500">
                                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-medium">
                                            {sub.fechaInicioFormateada} — {sub.fechaTerminoFormateada}
                                          </span>
                                        </td>
                                        <td className="py-3 px-4">
                                          <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-100">
                                            {sub.semanasTotales} sem
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

            {/* BARRA INFERIOR FLOTANTE DE ACCIONES DE DICTAMEN (Solo si puedeDictaminar = true, es decir EN_REVISION) */}
            {inspector.barraDictamen.puedeDictaminar && (
              <div className="px-8 py-4 border-t border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <span className="text-xs text-slate-300">
                    Dictamen para <strong className="text-white font-bold">{inspector.barraDictamen.centroClave} (POA {inspector.barraDictamen.anioFiscal})</strong>. Revisa los objetivos antes de confirmar.
                  </span>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <button 
                    type="button"
                    onClick={() => inspector.barraDictamen.onAbrirModalDevolver()}
                    disabled={inspector.barraDictamen.estaDictaminando}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Devolver con Observaciones</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => inspector.barraDictamen.onAutorizarPoa()}
                    disabled={inspector.barraDictamen.estaDictaminando}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-950/50 flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>{inspector.barraDictamen.estaDictaminando ? 'Procesando...' : `Autorizar POA ${inspector.barraDictamen.anioFiscal}`}</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">Ningún Plan Operativo Anual seleccionado</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Haz clic en cualquiera de las tarjetas de los Centros Universitarios de arriba para desplegar y revisar sus actividades, justificaciones y subactividades.
            </p>
          </div>
        )}

      </div>
      <ModalDevolverPoa />
    </main>
  );
}
