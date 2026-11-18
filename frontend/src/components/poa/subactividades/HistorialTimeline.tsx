'use client';

import type { NodoLineaTiempoHistorialUI } from '@/types/subactividades-contratos';

interface HistorialTimelineProps {
  nodos: NodoLineaTiempoHistorialUI[];
}

const colorPuntoClase: Record<string, string> = {
  red: 'bg-red-500',
  indigo: 'bg-indigo-600',
  emerald: 'bg-emerald-500',
  slate: 'bg-slate-400',
};

export default function HistorialTimeline({ nodos }: HistorialTimelineProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Historial de versiones
      </h2>

      {nodos.length === 0 ? (
        <p className="text-sm italic text-slate-400">Sin movimientos registrados.</p>
      ) : (
        <div className="relative ml-2 space-y-4 border-l-2 border-slate-100">
          {nodos.map((nodo) => {
            const estaActivo = nodo.estaSeleccionadaEnVista;

            return (
              <div
                key={nodo.idVersion}
                onClick={() => nodo.onClickSeleccionarVersion(nodo.idVersion)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    nodo.onClickSeleccionarVersion(nodo.idVersion);
                  }
                }}
                className={`relative ml-4 cursor-pointer rounded-xl border p-3.5 transition-all ${
                  estaActivo
                    ? 'border-indigo-200 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-500/10'
                    : 'border-transparent bg-transparent opacity-70 hover:border-slate-200 hover:bg-slate-50 hover:opacity-100'
                }`}
              >
                <span
                  className={`absolute -left-[25px] top-4 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white shadow-sm ${
                    colorPuntoClase[nodo.colorPunto] || 'bg-slate-300'
                  }`}
                >
                  {estaActivo && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>

                <p className={`text-sm font-bold leading-tight ${estaActivo ? 'text-indigo-950' : 'text-slate-700'}`}>
                  {nodo.tituloEvento}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">{nodo.fechaTexto}</p>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {nodo.esVersionActual && (
                    <span className="rounded bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      Versión Actual
                    </span>
                  )}
                  {estaActivo && (
                    <span className="rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Visualizando
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}