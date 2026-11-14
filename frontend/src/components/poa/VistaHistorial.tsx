'use client';

import type { PanelVersionHistoricaDetalleProps } from '@/types/subactividades-contratos';

interface VistaHistorialProps {
  detalle: PanelVersionHistoricaDetalleProps;
}

function IconoArchivo({ nombre }: { nombre: string }) {
  const extension = nombre.split('.').pop()?.toLowerCase();
  const esPdf = extension === 'pdf';
  const esHojaCalculo = ['xls', 'xlsx'].includes(extension || '');
  const color = esPdf
    ? 'bg-red-50 text-red-600'
    : esHojaCalculo
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-indigo-50 text-indigo-700';

  return (
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`} aria-hidden="true">
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 3.75h6.5L19 9.25v11A1.75 1.75 0 0117.25 22h-10A1.75 1.75 0 015.5 20.25V5.5A1.75 1.75 0 017.25 3.75zM13 4v5.5h5.5" />
      </svg>
    </span>
  );
}

export default function VistaHistorial({ detalle }: VistaHistorialProps) {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-900">
            Evidencias enviadas (Versión {detalle.versionNumero})
          </h2>
          <p className="mt-1 text-sm text-slate-500">Enviado el {detalle.fechaEnvioTexto}</p>
        </div>

        <div className="p-6">
          {detalle.comentarioEnvioContralor && (
            <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm italic text-slate-700">
              "{detalle.comentarioEnvioContralor}"
            </div>
          )}

          {detalle.evidencias.length > 0 ? (
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
              {detalle.evidencias.map((archivo) => (
                <li key={archivo.id} className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <IconoArchivo nombre={archivo.nombre} />
                    <div className="min-w-0 flex-1">
                      <p className="break-all text-sm font-semibold text-slate-800">{archivo.nombre}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {archivo.pesoFormateado} · {archivo.fechaSubidaTexto}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={archivo.estaDescargando}
                    onClick={() => void archivo.onDescargar()}
                    title={archivo.estaDescargando ? 'Descargando evidencia...' : `Descargar ${archivo.nombre}`}
                    aria-label={archivo.estaDescargando ? 'Descargando evidencia' : `Descargar ${archivo.nombre}`}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-wait disabled:border-indigo-100 disabled:bg-indigo-50 disabled:text-indigo-600"
                  >
                    {archivo.estaDescargando ? (
                      /* Spinner circular animado mientras descarga */
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3.5"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      /* Ícono clásico de descarga (flecha hacia abajo + bandeja) */
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              No se adjuntaron evidencias en esta versión.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Resolución de Jefatura: {detalle.resolucionJefaturaTexto}
          </h2>
          {detalle.fechaDictamenTexto && (
            <p className="mt-1 text-sm text-slate-500">Dictaminado el {detalle.fechaDictamenTexto}</p>
          )}
        </div>

        {detalle.observacionesHistoricas.length > 0 ? (
          <ul className="space-y-3">
            {detalle.observacionesHistoricas.map((obs) => (
              <li key={obs.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="inline-block rounded border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-bold text-slate-700">
                  Observación #{obs.numero}
                </span>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {obs.texto}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-slate-500">No se registraron observaciones en este dictamen.</p>
        )}
      </section>
    </div>
  );
}