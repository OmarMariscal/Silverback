'use client';
import React from 'react';
import { CabeceraPOAProps } from '@/types/poa-contratos';

export function CabeceraPOA({
  anioFiscal,
  estadoActual,
  puedeEditar,
  estaCargando,
  onEnviarRevision,
  onCancelarEnvio,
}: CabeceraPOAProps) {
  
  // Pequeño helper para pintar colores según el estado
  const getEstiloEstado = () => {
    switch (estadoActual) {
      case 'SIN_ENVIAR': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'EN_REVISION': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ACEPTADA': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'DEVUELTA': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="mb-8 flex items-center justify-between max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Plan Operativo Anual {anioFiscal}</h1>
        <p className="text-slate-500 mt-1">CUCEI • Mtro. Braulio Vicente Ruiz Arrez</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border shadow-sm flex items-center ${getEstiloEstado()}`}>
          {estadoActual === 'SIN_ENVIAR' && (
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
          )}
          Estado: {estadoActual.replace('_', ' ')}
        </span>
        
        {puedeEditar && (
          <button 
            onClick={onEnviarRevision}
            disabled={estaCargando}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition-all flex items-center disabled:opacity-50"
          >
            {/* SVG original de tu maquetado */}
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            {estaCargando ? 'Enviando...' : 'Añadir desde Banco'}
          </button>
        )}
      </div>
    </header>
  );
}