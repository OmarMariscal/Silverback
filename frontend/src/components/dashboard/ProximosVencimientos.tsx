'use client';

interface ProximosVencimientosProps {
  vencimientos: any[];
  onSeleccionar?: (subActividadId: string) => void;
}

export default function ProximosVencimientos({
  vencimientos,
  onSeleccionar,
}: ProximosVencimientosProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700">
          Próximos Vencimientos
        </h3>
        <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      <div className="space-y-2">
        {vencimientos.length > 0 ? (
          vencimientos.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => onSeleccionar?.(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSeleccionar?.(item.id);
                }
              }}
              className="group -mx-3 flex cursor-pointer items-center justify-between rounded-xl p-3 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <div className="flex items-start pr-3">
                <div className="mt-1.5 flex-shrink-0">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      item.colorSemaforo === 'red'
                        ? 'bg-red-500'
                        : item.colorSemaforo === 'amber'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-base font-bold leading-tight text-slate-800 transition-colors group-hover:text-indigo-700">
                    {item.titulo}
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">Vence: {item.fechaTexto}</p>
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-2">
                <span
                  className={`inline-block rounded px-2.5 py-1 text-xs font-bold ${
                    item.colorSemaforo === 'red'
                      ? 'bg-red-100 text-red-700'
                      : item.colorSemaforo === 'amber'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {item.etiquetaTiempo}
                </span>
                <svg
                  className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-sm italic text-slate-400">
            Sin vencimientos próximos registrados.
          </p>
        )}
      </div>
    </div>
  );
}