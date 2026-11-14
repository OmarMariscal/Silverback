'use client';

import type {
  DetallesOperacionUI,
  PanelVersionHistoricaDetalleProps,
} from '@/types/subactividades-contratos';

interface PanelDetallesOperacionProps {
  esModoHistorico: boolean;
  detallesActuales: DetallesOperacionUI;
  detalleHistorico?: PanelVersionHistoricaDetalleProps;
}

const colorEstadoClase: Record<string, string> = {
  red: 'border-red-200 bg-red-50 text-red-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  purple: 'border-purple-200 bg-purple-50 text-purple-700',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  slate: 'border-slate-200 bg-slate-100 text-slate-700',
};

export default function PanelDetallesOperacion({
  esModoHistorico,
  detallesActuales,
  detalleHistorico,
}: PanelDetallesOperacionProps) {
  if (esModoHistorico && detalleHistorico) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Detalles del Dictamen (V{detalleHistorico.versionNumero})
        </h2>

        <dl className="space-y-4 text-sm">
          <div className="border-b border-slate-100 pb-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Resolución final de V{detalleHistorico.versionNumero}
            </dt>
            <dd className="mt-1.5 inline-block rounded-md bg-slate-100 px-2.5 py-1 font-bold text-slate-800">
              {detalleHistorico.resolucionJefaturaTexto}
            </dd>
          </div>

          <div className="border-b border-slate-100 pb-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Fecha de envío (Contralor)
            </dt>
            <dd className="mt-1 font-bold text-slate-800">{detalleHistorico.fechaEnvioTexto}</dd>
          </div>

          {detalleHistorico.fechaDictamenTexto && (
            <div className="pb-1">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Fecha de dictamen (Jefatura)
              </dt>
              <dd className="mt-1 font-bold text-slate-800">{detalleHistorico.fechaDictamenTexto}</dd>
            </div>
          )}
        </dl>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Detalles de operación
      </h2>

      <dl className="space-y-4 text-sm">
        <div className="border-b border-slate-100 pb-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estado actual</dt>
          <dd
            className={`mt-2 inline-flex rounded-lg border px-2.5 py-1 text-sm font-bold ${
              colorEstadoClase[detallesActuales.estadoColor] || colorEstadoClase.slate
            }`}
          >
            {detallesActuales.estadoActualTexto}
          </dd>
        </div>

        <div className="border-b border-slate-100 pb-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Periodo de ejecución</dt>
          <dd className="mt-1 font-bold text-slate-800">{detallesActuales.periodoEjecucionTexto}</dd>
        </div>

        <div className="border-b border-slate-100 pb-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Duración estimada</dt>
          <dd className="mt-1 font-bold text-slate-800">{detallesActuales.duracionSemanasTexto}</dd>
        </div>

        <div className="pb-1">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cierre global del POA</dt>
          <dd className="mt-1 flex items-center gap-1.5 font-bold text-slate-800">
            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {detallesActuales.cierreGlobalPoaTexto}
          </dd>
        </div>
      </dl>
    </section>
  );
}