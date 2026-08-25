'use client';
import React from 'react';
import { SubactividadFilaProps } from '@/types/poa-contratos';

export function FilaSubactividad({
  folioSecuencial,
  descripcion,
  fechaInicioFormateada,
  fechaTerminoFormateada,
  semanasTotales
}: SubactividadFilaProps) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-5 py-4 text-center">
        <span className="inline-block bg-slate-100 text-slate-600 font-bold text-xs px-2 py-1 rounded">
          {folioSecuencial}
        </span>
      </td>
      <td className="px-5 py-4 text-slate-700 font-medium">
        {descripcion}
      </td>
      <td className="px-5 py-4">
        <div className="text-slate-800 font-medium">
          {fechaInicioFormateada} - {fechaTerminoFormateada}
        </div>
        <div className="text-xs text-slate-500 flex items-center mt-1 bg-slate-100 w-max px-2 py-0.5 rounded">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          {semanasTotales} Semanas
        </div>
      </td>
      <td className="px-5 py-4">
        {/* Como el contrato no pide el porcentaje por subactividad, podemos dejar un placeholder o quitar la columna */}
        <span className="text-slate-400 text-xs italic">Ver en ficha</span>
      </td>
    </tr>
  );
}