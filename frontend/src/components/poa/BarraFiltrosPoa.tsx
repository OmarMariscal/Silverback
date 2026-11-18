'use client';

import React from 'react';
import type {
  FiltroEstadoPoaJefa,
  KpisSupervisionPoasUI,
} from '@/types/poa-contratos';

interface BarraFiltrosPoaProps {
  filtroEstado: FiltroEstadoPoaJefa;
  kpis: KpisSupervisionPoasUI;
  busquedaTexto: string;
  anioGlobal: number;
  aniosDisponibles: number[];
  onSetFiltroEstado: (filtro: FiltroEstadoPoaJefa) => void;
  onSetBusquedaTexto: (texto: string) => void;
  onSetAnioGlobal: (anio: number) => void;
}

export function BarraFiltrosPoa({
  filtroEstado,
  kpis,
  busquedaTexto,
  anioGlobal,
  aniosDisponibles,
  onSetFiltroEstado,
  onSetBusquedaTexto,
  onSetAnioGlobal,
}: BarraFiltrosPoaProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => onSetFiltroEstado('TODOS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer ${
            filtroEstado === 'TODOS'
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Todos ({kpis.totalCentros})
        </button>
        <button
          type="button"
          onClick={() => onSetFiltroEstado('POR_AUTORIZAR')}
          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center cursor-pointer ${
            filtroEstado === 'POR_AUTORIZAR'
              ? 'bg-purple-100 border-purple-300 text-purple-800'
              : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-purple-500 mr-1.5"></span>
          Por Autorizar ({kpis.porAutorizar})
        </button>
        <button
          type="button"
          onClick={() => onSetFiltroEstado('DEVUELTAS')}
          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center cursor-pointer ${
            filtroEstado === 'DEVUELTAS'
              ? 'bg-amber-100 border-amber-300 text-amber-800'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
          Devueltas ({kpis.devueltas})
        </button>
        <button
          type="button"
          onClick={() => onSetFiltroEstado('AUTORIZADAS')}
          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center cursor-pointer ${
            filtroEstado === 'AUTORIZADAS'
              ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
          Autorizadas ({kpis.autorizadas})
        </button>
      </div>

      <div className="flex items-center space-x-3">
        <div className="relative">
          <input
            type="text"
            value={busquedaTexto}
            onChange={(e) => onSetBusquedaTexto(e.target.value)}
            placeholder="Buscar por centro o contralor..."
            className="w-64 pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 placeholder-slate-400"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <select
          value={anioGlobal}
          onChange={(e) => onSetAnioGlobal(Number(e.target.value))}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-1.5 px-3 rounded-lg focus:outline-none cursor-pointer"
        >
          {aniosDisponibles.map((anio) => (
            <option key={anio} value={anio}>
              Año POA: {anio}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}