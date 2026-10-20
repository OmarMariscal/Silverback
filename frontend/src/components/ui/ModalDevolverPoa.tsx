'use client';

import React from 'react';
import { useJefaPoaStore } from '@/store/poa-supervision.store';

export default function ModalDevolverPoa() {
  const store = useJefaPoaStore();
  const inspector = store.obtenerInspectorPoaUI();

  // Si el modal no está activo o no hay un POA inspeccionado, no renderizamos nada
  if (!store.modalDevolverAbierto || !inspector) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity p-4 sm:p-0">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header del Modal */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-white">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0 text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 leading-tight">Devolver POA con Observaciones</h3>
              <p className="text-xs text-slate-500 mt-0.5">El documento será regresado al contralor para su corrección.</p>
            </div>
          </div>
          {/* Botón Cerrar */}
          <button 
            onClick={() => store.cerrarModalDevolver()}
            disabled={store.estaDevolviendo}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 space-y-5 bg-slate-50/50">
          
          {/* Ficha de Contexto Dinámica */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest shadow-sm shadow-indigo-200">
                {inspector.centroClave}
              </span>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Plan Operativo Anual {inspector.anioFiscal}</span>
                <span className="text-[10px] font-medium text-slate-500">Contralor: {inspector.contralorNombre}</span>
              </div>
            </div>
            <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded uppercase tracking-wider hidden sm:block">
              Dictamen de Rechazo
            </span>
          </div>

          {/* Área de Texto para Observaciones */}
          <div className="space-y-2">
            <label htmlFor="observaciones" className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Detalle de las Observaciones</span>
              <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Requerido</span>
            </label>
            <textarea 
              id="observaciones" 
              rows={6} 
              value={store.observacionesDevolucion}
              onChange={(e) => store.setObservacionesDevolucion(e.target.value)}
              disabled={store.estaDevolviendo}
              placeholder="Ej. Se encontraron inconsistencias en las fechas de las sub-actividades de la Auditoría a Caja Chica. Favor de ajustar los plazos..." 
              className={`w-full px-4 py-3 bg-white border ${store.errorObservaciones ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none shadow-sm leading-relaxed disabled:opacity-60 disabled:bg-slate-50`}
            />
            {store.errorObservaciones && (
              <p className="text-[11px] font-bold text-red-500 mt-1 animate-in fade-in">{store.errorObservaciones}</p>
            )}
          </div>

          {/* Nota de Sistema */}
          <div className="flex items-start space-x-2.5 text-slate-600 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
            <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[11px] font-medium leading-relaxed">
              Las observaciones formarán parte del dictamen oficial. Se enviará una notificación automática por correo electrónico al responsable del centro universitario.
            </p>
          </div>
        </div>

        {/* Footer del Modal (Acciones) */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-end space-x-3">
          <button 
            onClick={() => store.cerrarModalDevolver()}
            disabled={store.estaDevolviendo}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button 
            onClick={() => store.confirmarDevolverPoa()}
            disabled={store.estaDevolviendo || store.observacionesDevolucion.trim() === ''}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 flex items-center space-x-2 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {store.estaDevolviendo ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
            <span>{store.estaDevolviendo ? 'Devolviendo...' : 'Confirmar y Devolver POA'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}