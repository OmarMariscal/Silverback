'use client';

import BuzonArchivosEvidencia from '@/components/ui/BuzonArchivosEvidencia';
import type { ObservacionActivaUI, BuzonEvidenciasProps, DetallesOperacionUI} from '@/types/subactividades-contratos';

interface VistaActualProps {
  observaciones: ObservacionActivaUI[];
  buzon: BuzonEvidenciasProps;
  detallesOperacion: DetallesOperacionUI;
}

const colorBadgeObs: Record<string, string> = {
  red: 'bg-red-100 text-red-700',
  amber: 'bg-amber-100 text-amber-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  slate: 'bg-slate-100 text-slate-700',
};

export default function VistaActual({ observaciones, buzon , detallesOperacion}: VistaActualProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 border-b border-slate-100 pb-4 text-lg font-bold text-slate-900">
          Observaciones de la versión actual
        </h2>

        {observaciones.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-100 py-8 text-center text-sm italic text-slate-400">
            No hay observaciones registradas para esta subactividad.
          </div>
        ) : (
          <ul className="space-y-4">
            {observaciones.map((obs) => (
              <li key={obs.id} className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-start justify-between">
                  <span className="rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1 text-sm font-bold text-slate-800">
                    {obs.correlativo}
                  </span>
                  <span className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${colorBadgeObs[obs.colorBadge] || colorBadgeObs.slate}`}>
                    {obs.estadoSolvenciaEtiqueta}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {obs.descripcion}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <BuzonArchivosEvidencia {...buzon} />

      
    </div>
  );
}