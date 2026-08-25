'use client';
import React from 'react';
import { FichaTecnicaExpandida } from '@/types/poa-contratos';

interface Props {
  ficha: FichaTecnicaExpandida;
  onConfigurarFicha: () => void;
}

export function FichaTecnicaResumen({ ficha, onConfigurarFicha }: Props) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 mb-6 relative shadow-sm">
      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        Ficha Técnica de la Actividad
      </h4>
      
      <div className="relative max-h-28 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
          <div>
            <h5 className="text-xs font-bold text-slate-700 mb-1">Justificación</h5>
            <p className="text-sm text-slate-600 leading-relaxed">{ficha.justificacion}</p>
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-700 mb-1">Objetivo General</h5>
            <p className="text-sm text-slate-600 leading-relaxed">{ficha.objetivoGeneral}</p>
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-700 mb-1">Objetivos Particulares</h5>
            <p className="text-sm text-slate-600 leading-relaxed">{ficha.objetivosParticulares}</p>
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-700 mb-1">Meta del Proyecto</h5>
            <p className="text-sm text-slate-600 leading-relaxed">{ficha.metaProyecto}</p>
          </div>
          <div className="md:col-span-2">
            <h5 className="text-xs font-bold text-slate-700 mb-1">Indicadores</h5>
            <p className="text-sm text-slate-600 leading-relaxed">{ficha.indicadores}</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
      </div>
      
      <button 
        onClick={onConfigurarFicha}
        className="w-full mt-2 pt-3 border-t border-slate-100 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center justify-center uppercase tracking-wider"
      >
        Expandir / Editar Ficha Técnica
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
    </div>
  );
}