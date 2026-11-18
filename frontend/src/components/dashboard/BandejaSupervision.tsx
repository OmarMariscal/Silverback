'use client';

interface BandejaSupervisionProps {
  bandeja: any[];
  onSeleccionar?: (id: string) => void;
}

export default function BandejaSupervision({
  bandeja,
  onSeleccionar,
}: BandejaSupervisionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-white px-8 py-6">
        <h2 className="text-xl font-bold text-slate-800">Bandeja de Supervisión</h2>
        <p className="mt-1 text-base text-slate-500">
          Actividades por revisar, devolver o atender en curso.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              <th className="px-6 py-3">ACTIVIDAD PRINCIPAL</th>
              <th className="px-6 py-3 text-center">RESOLUCIÓN DE JEFATURA</th>
              <th className="px-6 py-3 text-right">VENCIMIENTO POA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bandeja.length > 0 ? (
              bandeja.map((item) => (
                <tr
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
                  className="group cursor-pointer transition-colors hover:bg-slate-50/80 focus:bg-slate-50 focus:outline-none"
                >
                  <td className="px-6 py-4">
                    <span className="block font-bold text-slate-800 transition-colors group-hover:text-indigo-700">
                      {item.titulo}
                    </span>
                    <span className="text-xs text-slate-400">{item.tiempoTranscurrido}</span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1 text-xs font-semibold ${
                        item.resolucionTipo === 'DEVUELTA_OBS'
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : item.resolucionTipo === 'DEVUELTA_REC'
                            ? 'border-amber-200 bg-amber-50 text-amber-700'
                            : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      {item.resolucionTexto}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center justify-end gap-3">
                      <div>
                        <span
                          className={`block font-bold ${
                            item.vencimientoTexto.includes('Faltan 2')
                              ? 'text-red-600'
                              : item.vencimientoTexto.includes('Faltan')
                                ? 'text-amber-600'
                                : 'text-slate-600'
                          }`}
                        >
                          {item.vencimientoTexto}
                        </span>
                        <span className="text-xs text-slate-400">{item.vencimientoFecha}</span>
                      </div>
                      <svg
                        className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-12 text-center text-sm italic text-slate-400">
                  No hay actividades pendientes en la bandeja de supervisión.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}