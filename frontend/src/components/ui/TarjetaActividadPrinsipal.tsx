'use client';

import React, { useState } from 'react';
import { TarjetaActividadPOAProps } from '@/types/poa-contratos';

interface Props extends TarjetaActividadPOAProps {
  consecutivoIndex: number;
  onAbrirModalSubactividades?: (idActividad: string, tituloActividad: string) => void;
}

export function TarjetaActividadPOA({
  idActividad,
  consecutivoIndex,
  titulo,
  participacionGlobalVisible,
  esRezagada,
  fechaInicioPadre,
  fechaTerminoPadre,
  fichaTecnica,
  subactividades,
  estaCargandoDetalles,
  ocultarBotonBorrar,
  onAbrirModalSubactividades,
  onBorrarActividad,
  onConfigurarFichaTecnica,
  onExpandirTarjeta
}: Props) {
  const [estaExpandida, setEstaExpandida] = useState(false);
  const [fichaExpandida, setFichaExpandida] = useState(false);

  const handleToggle = () => {
    if (!estaExpandida) onExpandirTarjeta();
    setEstaExpandida(!estaExpandida);
  };

  const numConsecutivo = (consecutivoIndex + 1).toString().padStart(2, '0');

  const auditoresTexto = fichaTecnica?.equipoAuditor && fichaTecnica.equipoAuditor.length > 0
    ? fichaTecnica.equipoAuditor.map(a => a.nombreCompleto).join(', ')
    : 'Sin auditores asignados';

  return (
    <div 
      className={`bg-white rounded-2xl shadow-sm border overflow-hidden mb-6 transition-all ${
        estaExpandida 
          ? 'border-indigo-200 ring-4 ring-indigo-50/50' 
          : 'border-slate-200 hover:border-indigo-300'
      }`}
    >
      {/* CABECERA DE LA TARJETA */}
      <div 
        onClick={handleToggle}
        className="p-6 border-b border-slate-100 flex justify-between items-start bg-white cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-start space-x-5">
          <div className="flex flex-col items-center justify-center bg-indigo-50 text-indigo-700 rounded-xl px-4 py-3 border border-indigo-100 min-w-[5rem]">
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Folio</span>
            <span className="font-black text-2xl">{numConsecutivo}</span>
          </div>
          
          <div className="pt-1">
            <h3 className="text-xl font-bold text-slate-800 leading-tight flex items-center">
              {titulo}
              {esRezagada && (
                <span className="ml-3 text-xs bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full font-bold">
                  Rezagada
                </span>
              )}
            </h3>
            
            <div className="flex flex-wrap items-center mt-3 gap-y-2 gap-x-6">
              <span className="flex items-center text-sm font-medium text-slate-500">
                <svg className="w-4 h-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg> 
                {fechaInicioPadre || 'N/A'} - {fechaTerminoPadre || 'N/A'}
              </span>
              
              <span className="flex items-center text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md">
                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg> 
                {participacionGlobalVisible}
              </span>
              
              <span className="flex items-center text-sm font-medium text-slate-600">
                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg> 
                <span className="text-slate-400 mr-1">Auditores:</span> {auditoresTexto}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 pl-4">
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onConfigurarFichaTecnica(); }}
            className="text-slate-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors" 
            title="Editar Actividad"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>

          {!ocultarBotonBorrar && (
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); onBorrarActividad(); }}
              className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors" 
              title="Eliminar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}

          <div className="h-8 w-px bg-slate-200 mx-2"></div>

          <button type="button" className="text-indigo-600 p-2">
            <svg 
              className={`w-6 h-6 transition-transform ${estaExpandida ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* CONTENIDO DESPLEGABLE DE LA TARJETA */}
      {estaExpandida && (
        <div className="p-8 bg-slate-50/50">
          {estaCargandoDetalles ? (
            <div className="text-center py-8 text-slate-500 text-sm animate-pulse">
              Cargando detalles técnicos y subactividades...
            </div>
          ) : (
            <>
              {/* FICHA TÉCNICA REFACTORIZADA */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 relative shadow-sm">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Ficha Técnica de la Actividad
                </h4>
                
                <div className={`relative transition-all duration-300 ${fichaExpandida ? 'max-h-none' : 'max-h-20 overflow-hidden'}`}>
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
                      <h5 className="text-sm font-bold text-slate-700 mb-2">Objetivos Particulares</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {fichaTecnica?.objetivosParticulares || 'Sin especificar.'}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-700 mb-2">Objetivos Particulares</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {fichaTecnica?.metaProyecto || 'Sin especificar.'}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-700 mb-2">Objetivos Particulares</h5>
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
                  className="w-full mt-4 pt-4 border-t border-slate-100 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center justify-center uppercase tracking-wider cursor-pointer"
                >
                  {fichaExpandida ? 'Colapsar Ficha Técnica' : 'Expandir Ficha Técnica'}
                  <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${fichaExpandida ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* TABLA DE SUBACTIVIDADES */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Sub-actividades Específicas
                  </h4>
                  <button 
                    type="button"
                    onClick={() => onAbrirModalSubactividades && onAbrirModalSubactividades(idActividad, titulo)}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors border border-indigo-100 cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg> 
                    Añadir Sub-actividad
                  </button>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-20 text-center">ID</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Descripción de Tarea</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-48">Fechas</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-36 text-center">Semanas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {subactividades && subactividades.length > 0 ? (
                        subactividades.map((sub) => (
                          <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-6 py-5 text-center">
                              <span className="inline-block bg-slate-100 text-slate-600 font-bold text-xs px-2.5 py-1 rounded-md">
                                {sub.folioSecuencial}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-slate-700 font-medium leading-relaxed pr-8">
                              {sub.descripcion}
                            </td>
                            <td className="px-6 py-5">
                              <span className="text-slate-600 font-medium flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 whitespace-nowrap">
                                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {sub.fechaInicioFormateada} - {sub.fechaTerminoFormateada}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <span className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-bold tracking-wide">
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