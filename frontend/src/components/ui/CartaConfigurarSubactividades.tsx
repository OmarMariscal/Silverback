'use client';

import React from 'react';
import { SubactividadFilaProps } from '@/types/poa-contratos';

interface Props {
  subactividades: SubactividadFilaProps[];
  onVolver: () => void;
  onConfirmarTodo: () => void;
}

export function CartaConfigurarSubactividades({
  subactividades,
  onVolver,
  onConfirmarTodo,
}: Props) {
  return (
    <div className="absolute inset-0 z-20 bg-white p-8 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200 rounded-2xl">
      <div>
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">
            Configurar detalles de Sub-actividades
          </h3>
          <button 
            onClick={onVolver} 
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full"
          >
            ✕
          </button>
        </div>

        {/* Listado editable */}
        <div className="bg-slate-50 border border-indigo-100 rounded-xl p-6 mb-4">
          <p className="text-sm font-semibold text-slate-800 mb-4">
            Identifica y clasificar físicamente los bienes susceptibles a desincorporación en las instalaciones.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fecha Inicio</label>
              <input type="date" className="w-full text-sm border border-slate-300 rounded-lg p-2 text-slate-700" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fecha Final</label>
              <input type="date" className="w-full text-sm border border-slate-300 rounded-lg p-2 text-slate-700" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Semanas</label>
              <div className="w-full text-sm bg-slate-100 border border-slate-200 rounded-lg p-2 text-slate-500 text-center font-bold">
                -- W
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">% Participación</label>
              <select className="w-full text-sm border border-slate-300 rounded-lg p-2 text-slate-700 bg-white">
                <option value="100">100% Contralor</option>
                <option value="50">50% Auditor</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
        <button 
          type="button" 
          onClick={onVolver}
          className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
        >
          Volver
        </button>
        <button 
          type="button" 
          onClick={onConfirmarTodo}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md"
        >
          Confirmar y Enviar Todo
        </button>
      </div>
    </div>
  );
}