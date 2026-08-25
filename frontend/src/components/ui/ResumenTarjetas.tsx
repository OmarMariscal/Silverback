import React from 'react';

export function ResumenTarjetas({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
      {/* Bandeja de Entrada */}
      <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-8 relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50/80 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
        <div className="relative z-10 flex flex-col h-full justify-between">
          <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-4">Bandeja de Entrada</h3>
          <div className="mb-4">
            <div className="flex items-end space-x-3">
              <span className="text-5xl font-black text-indigo-700 leading-none">{stats.bandejaEntrada.actividadesDevueltas}</span>
              <span className="text-sm font-bold text-indigo-500 pb-1">Actividades<br/>Devueltas</span>
            </div>
          </div>
          <div className="w-full h-px bg-slate-200 mb-4"></div>
          <div>
            <div className="flex items-end space-x-3">
              <span className="text-2xl font-bold text-slate-700 leading-none">{stats.bandejaEntrada.listasParaEmpezar}</span>
              <span className="text-sm font-medium text-slate-500 pb-0.5">Listas para empezar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Riesgo Crítico */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden group hover:border-red-200 transition-colors">
        <div className="absolute right-0 top-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
        <div className="relative z-10">
          <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-3">Riesgo Crítico</h3>
          <div className="flex flex-col">
            <span className="text-5xl font-black text-red-600 mb-2 mt-1">0{stats.riesgoCritico.vencidasOPorVencer}</span>
            <span className="text-base font-medium text-red-500">Vencidas o por vencer</span>
          </div>
        </div>
      </div>

      {/* Precaución */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden group hover:border-amber-200 transition-colors">
        <div className="absolute right-0 top-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
        <div className="relative z-10">
          <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-3">Precaución</h3>
          <div className="flex flex-col">
            <span className="text-5xl font-black text-amber-500 mb-2 mt-1">0{stats.precaucion.menosDe15Dias}</span>
            <span className="text-base font-medium text-amber-600">A menos de 15 días</span>
          </div>
        </div>
      </div>

      {/* Tasa de Solventación */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden group hover:border-emerald-200 transition-colors">
        <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
        <div className="relative z-10">
          <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-3">Tasa de Solventación</h3>
          <div className="flex flex-col">
            <span className="text-5xl font-black text-emerald-600 mb-2 mt-1">{stats.tasaSolventacion.porcentaje}%</span>
            <span className="text-base font-bold text-emerald-500 flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              {stats.tasaSolventacion.calificacion}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}