'use client';

import { useRouter } from 'next/navigation';
import { getModulePath } from '@/modules/perfiles/role-menu';

interface TarjetasProps {
  role: 'JEFA' | 'CONTRALOR';
  kpis: any; // Recibe el objeto kpis (Jefa o Contralor)
}

export default function TarjetasEstadoGeneral({ role, kpis }: TarjetasProps) {
  const router = useRouter();

  if (role === 'JEFA') {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        <div onClick={() => router.push(`${getModulePath('JEFA', 'actividades')}?estado_flujo=DEVUELTA`)} className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-8 shadow-sm transition-all hover:border-indigo-400 hover:shadow-md cursor-pointer">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-indigo-50/80 transition-transform group-hover:scale-110" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <h3 className="mb-4 text-base font-bold uppercase tracking-widest text-slate-500">Pendientes</h3>
            <div className="mb-4">
              <div className="flex items-end space-x-3">
                <span className="text-5xl font-black leading-none text-indigo-700">{kpis.actividadesPorRevisar}</span>
                <span className="pb-1 text-sm font-bold text-indigo-500">Actividades Por Revisar</span>
              </div>
            </div>
            <div className="mb-4 h-px w-full bg-slate-200" />
            <div>
              <div className="flex items-end space-x-3">
                <span className="text-2xl font-bold leading-none text-slate-700">{kpis.actividadesSolicitadas}</span>
                <span className="pb-0.5 text-sm font-medium text-slate-500">Actividades Solicitadas</span>
              </div>
            </div>
          </div>
        </div>

        <div onClick={() => router.push(`${getModulePath('JEFA', 'actividades')}?semaforo=CRITICO`)} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-red-300 hover:shadow-md cursor-pointer">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-red-50 transition-transform group-hover:scale-110" />
          <div className="relative z-10">
            <h3 className="mb-3 text-base font-bold uppercase tracking-widest text-slate-500">Riesgo Crítico</h3>
            <div className="flex flex-col">
              <span className="mt-1 mb-2 text-5xl font-black text-red-600">{kpis.riesgoCritico.toString().padStart(2, '0')}</span>
              <span className="text-base font-medium text-red-500">{kpis.riesgoCriticoDescripcion}</span>
            </div>
          </div>
        </div>

        <div onClick={() => router.push(`${getModulePath('JEFA', 'actividades')}?semaforo=PRECAUCION`)} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-amber-300 hover:shadow-md cursor-pointer">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-amber-50 transition-transform group-hover:scale-110" />
          <div className="relative z-10">
            <h3 className="mb-3 text-base font-bold uppercase tracking-widest text-slate-500">Precaución</h3>
            <div className="flex flex-col">
              <span className="mt-1 mb-2 text-5xl font-black text-amber-500">{kpis.precaucion.toString().padStart(2, '0')}</span>
              <span className="text-base font-medium text-amber-600">{kpis.precaucionDescripcion}</span>
            </div>
          </div>
        </div>

        <div onClick={() => router.push(`${getModulePath('JEFA', 'actividades')}?estado_flujo=CONCLUIDA`)} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md cursor-pointer">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-emerald-50 transition-transform group-hover:scale-110" />
          <div className="relative z-10">
            <h3 className="mb-3 text-base font-bold uppercase tracking-widest text-slate-500">Tasa de Solventación</h3>
            <div className="flex flex-col">
              <span className="mt-1 mb-2 text-5xl font-black text-emerald-600">{kpis.tasaSolventacion}%</span>
              <span className="flex items-center text-base font-bold text-emerald-500">
                <svg className="mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                {kpis.tendenciaMes}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tarjetas de CONTRALOR
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
      <div onClick={() => router.push(`${getModulePath('CONTRALOR', 'actividades')}?estado_flujo=DEVUELTA`)} className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-8 shadow-sm transition-all hover:border-indigo-400 hover:shadow-md cursor-pointer">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-indigo-50/80 transition-transform group-hover:scale-110" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <h3 className="mb-4 text-base font-bold uppercase tracking-widest text-slate-500">Bandeja de Entrada</h3>
          <div className="mb-4">
            <div className="flex items-end space-x-3">
              <span className="text-5xl font-black leading-none text-indigo-700">{kpis.devueltas}</span>
              <span className="pb-1 text-sm font-bold text-indigo-500">Actividades<br />Devueltas</span>
            </div>
          </div>
          <div className="mb-4 h-px w-full bg-slate-200" />
          <div>
            <div className="flex items-end space-x-3">
              <span className="text-2xl font-bold leading-none text-slate-700">{kpis.listasParaEmpezar}</span>
              <span className="pb-0.5 text-sm font-medium text-slate-500">Listas para empezar</span>
            </div>
          </div>
        </div>
      </div>

      <div onClick={() => router.push(`${getModulePath('CONTRALOR', 'actividades')}?semaforo=CRITICO`)} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-red-300 hover:shadow-md cursor-pointer">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-red-50 transition-transform group-hover:scale-110" />
        <div className="relative z-10">
          <h3 className="mb-3 text-base font-bold uppercase tracking-widest text-slate-500">Riesgo Crítico</h3>
          <div className="flex flex-col">
            <span className="mt-1 mb-2 text-5xl font-black text-red-600">{kpis.riesgoCritico.toString().padStart(2, '0')}</span>
            <span className="text-base font-medium text-red-500">Vencidas o por vencer</span>
          </div>
        </div>
      </div>

      <div onClick={() => router.push(`${getModulePath('CONTRALOR', 'actividades')}?semaforo=PRECAUCION`)} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-amber-300 hover:shadow-md cursor-pointer">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-amber-50 transition-transform group-hover:scale-110" />
        <div className="relative z-10">
          <h3 className="mb-3 text-base font-bold uppercase tracking-widest text-slate-500">Precaución</h3>
          <div className="flex flex-col">
            <span className="mt-1 mb-2 text-5xl font-black text-amber-500">{kpis.precaucion.toString().padStart(2, '0')}</span>
            <span className="text-base font-medium text-amber-600">A menos de 15 días</span>
          </div>
        </div>
      </div>

      <div onClick={() => router.push(`${getModulePath('CONTRALOR', 'actividades')}?estado_flujo=CONCLUIDA`)} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md cursor-pointer">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-emerald-50 transition-transform group-hover:scale-110" />
        <div className="relative z-10">
          <h3 className="mb-3 text-base font-bold uppercase tracking-widest text-slate-500">Tasa de Solventación</h3>
          <div className="flex flex-col">
            <span className="mt-1 mb-2 text-5xl font-black text-emerald-600">{kpis.tasaSolventacion}%</span>
            <span className="flex items-center text-base font-bold text-emerald-500">
              <svg className="mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              {kpis.tasaSolventacion >= 80 ? 'Excelente' : 'Regular'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}