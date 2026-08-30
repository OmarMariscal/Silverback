'use client';

import React, { useState } from 'react';
import { TarjetaActividadPOAProps, DatosFormularioFicha, OpcionAuditorProps } from '@/types/poa-contratos';
import { ModalEditarFichaTecnica } from '@/components/ui/ModalFichaTecnica';

interface Props extends TarjetaActividadPOAProps {
  consecutivoIndex: number;
  onAbrirModalSubactividades?: (idActividad: string, tituloActividad: string) => void;
  // Nuevas props necesarias para el modal interno
  listaAuditoresDisponibles?: OpcionAuditorProps[];
  onGuardarFichaTecnica?: (idActividad: string, datos: DatosFormularioFicha) => void;
  estaGuardandoFicha?: boolean;
}

function formatearFechaEspanol(fechaStr?: string): string {
  if (!fechaStr || fechaStr === 'N/A') return 'N/A';
  const [anio, mes, dia] = fechaStr.split('-').map(Number);
  if (!anio || !mes || !dia) return fechaStr;
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${meses[mes - 1]} ${dia}`;
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
  listaAuditoresDisponibles = [],
  estaGuardandoFicha = false,
  onAbrirModalSubactividades,
  onBorrarActividad,
  onConfigurarFichaTecnica,
  onExpandirTarjeta,
  onGuardarFichaTecnica
}: Props) {
  const [estaExpandida, setEstaExpandida] = useState(false);
  const [fichaExpandida, setFichaExpandida] = useState(false);
  const [mostrarModalFicha, setMostrarModalFicha] = useState(false); // Estado del Modal

  const handleToggle = () => {
    if (!estaExpandida) onExpandirTarjeta();
    setEstaExpandida(!estaExpandida);
  };

  const numConsecutivo = (consecutivoIndex + 1).toString().padStart(2, '0');
  const auditoresTexto = fichaTecnica?.equipoAuditor && fichaTecnica.equipoAuditor.length > 0
    ? fichaTecnica.equipoAuditor.map(a => a.nombreCompleto).join(', ')
    : 'Sin auditores asignados';

  const colorBordeTarjeta = esRezagada 
    ? (estaExpandida ? 'border-red-300 ring-4 ring-red-50/50' : 'border-red-300 hover:border-red-400')
    : (estaExpandida ? 'border-indigo-200 ring-4 ring-indigo-50/50' : 'border-slate-200 hover:border-indigo-300');

  // Mapeo de datos para el modal (si la ficha ya está cargada)
  const valoresInicialesFicha: DatosFormularioFicha | undefined = fichaTecnica ? {
    titulo: titulo,
    justificacion: fichaTecnica.justificacion,
    objetivoGeneral: fichaTecnica.objetivoGeneral,
    objetivosParticulares: fichaTecnica.objetivosParticulares,
    metaProyecto: fichaTecnica.metaProyecto,
    indicadores: fichaTecnica.indicadores,
    auditoresSeleccionadosIds: [], // Aquí deberías pasar los IDs reales si el backend los provee
  } : undefined;

  return (
    <>
      <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden mb-6 transition-all ${colorBordeTarjeta}`}>
        {/* CABECERA DE LA TARJETA */}
        <div 
          onClick={handleToggle}
          className="p-6 border-b border-slate-100 flex justify-between items-start bg-white cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-start space-x-5">
            <div className={`flex flex-col items-center justify-center rounded-xl px-4 py-3 border min-w-[5rem] ${esRezagada ? 'bg-red-50 text-red-700 border-red-200' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Folio</span>
              <span className="font-black text-2xl">{numConsecutivo}</span>
            </div>
            
            <div className="pt-1">
              <h3 className="text-xl font-bold text-slate-800 leading-tight flex items-center">
                {titulo}
                {esRezagada && (
                  <span className="ml-3 text-[10px] uppercase tracking-wider bg-red-100 text-red-600 px-3 py-1 rounded font-bold">
                    Rezago Automático
                  </span>
                )}
              </h3>
              
              <div className="flex flex-wrap items-center mt-3 gap-y-2 gap-x-6">
                <span className="flex items-center text-sm font-medium text-slate-500">
                  <svg className={`w-4 h-4 mr-2 ${esRezagada ? 'text-red-400' : 'text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg> 
                  {fechaInicioPadre || 'N/A'} - {fechaTerminoPadre || 'N/A'}
                </span>
                
                <span className="flex items-center text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md">
                  <svg className={`w-4 h-4 mr-2 ${esRezagada ? 'text-red-500' : 'text-indigo-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg> 
                  {participacionGlobalVisible}
                </span>
                
                <span className="flex items-center text-sm font-medium text-slate-600">
                  <span className="text-slate-400 mr-1">Auditores:</span> {auditoresTexto}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 pl-4">
            {/* BOTÓN EDITAR QUE ABRE EL MODAL */}
            <button 
              type="button"
              onClick={(e) => { 
                e.stopPropagation(); 
                onConfigurarFichaTecnica(); // Dispara la prop original
                setMostrarModalFicha(true); // Abre el modal local
              }}
              className={`p-2 rounded-full transition-colors text-slate-400 ${
                esRezagada ? 'hover:text-red-600 hover:bg-red-50' : 'hover:text-indigo-600 hover:bg-indigo-50'
              }`} 
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

            <button type="button" className={`p-2 ${esRezagada ? 'text-red-600' : 'text-indigo-600'}`}>
              <svg className={`w-6 h-6 transition-transform ${estaExpandida ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* CONTENIDO DESPLEGABLE */}
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
                  <h4 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center ${esRezagada ? 'text-red-500' : 'text-slate-400'}`}>
                    Ficha Técnica de la Actividad
                  </h4>
                  <div className={`relative transition-all duration-300 ${fichaExpandida ? 'max-h-none' : 'max-h-20 overflow-hidden'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                      <div>
                        <h5 className="text-sm font-bold text-slate-700 mb-2">Justificación</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">{fichaTecnica?.justificacion || 'Sin especificar.'}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-700 mb-2">Objetivo General</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">{fichaTecnica?.objetivoGeneral || 'Sin especificar.'}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-700 mb-2">Objetivos Particulares</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">{fichaTecnica?.objetivosParticulares || 'Sin especificar.'}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-700 mb-2">Meta del Proyecto</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">{fichaTecnica?.metaProyecto || 'Sin especificar.'}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-700 mb-2">Indicadores</h5>
                        <p className="text-sm text-slate-600 leading-relaxed">{fichaTecnica?.indicadores || 'Sin especificar.'}</p>
                      </div>
                    </div>
                    {!fichaExpandida && <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>}
                  </div>
                  <button 
                    onClick={() => setFichaExpandida(!fichaExpandida)}
                    className={`w-full mt-4 pt-4 border-t border-slate-100 text-xs font-bold transition-colors flex items-center justify-center uppercase tracking-wider cursor-pointer ${esRezagada ? 'text-red-600 hover:text-red-800' : 'text-indigo-600 hover:text-indigo-800'}`}
                  >
                    {fichaExpandida ? 'Colapsar Ficha Técnica' : 'Expandir Ficha Técnica'}
                  </button>
                </div>

                {/* TABLA DE SUBACTIVIDADES (Sin cambios) */}
                {/* ... (Tu código de tabla se mantiene exactamente igual) ... */}
              </>
            )}
          </div>
        )}
      </div>

      {/* RENDERIZADO DEL MODAL DENTRO DE LA TARJETA */}
      {mostrarModalFicha && (
        <ModalEditarFichaTecnica
          valoresIniciales={valoresInicialesFicha}
          listaAuditoresDisponibles={listaAuditoresDisponibles}
          estaGuardando={estaGuardandoFicha}
          onCancelar={() => setMostrarModalFicha(false)}
          // Asigna la función directamente a la propiedad que exige la interfaz:
          onContinuarASubactividades={(datosIngresados) => {
            if (onGuardarFichaTecnica) {
              onGuardarFichaTecnica(idActividad, datosIngresados); 
            }
            setMostrarModalFicha(false);
          }}
        />
      )}
    </>
  );
}