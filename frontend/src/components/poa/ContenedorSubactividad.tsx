// src/components/poa/ContenedorSubactividad.tsx
'use client';

import Link from 'next/link';
import VistaActual from './VistaActual';
import VistaHistorial from './VistaHistorial';
import HistorialTimeline from './HistorialTimeline';
import type { SubActividadEntregaViewModel } from '@/types/subactividades-contratos';
import PanelDetallesOperacion from './PanelDetallesOperacion';

const RUTA_POA = '/contralor/poa';

interface ContenedorSubactividadProps {
  vista: SubActividadEntregaViewModel;
}

export default function ContenedorSubactividad({ vista }: ContenedorSubactividadProps) {
  return (
    <div className="space-y-6">
      {vista.esModoHistorico && vista.versionHistoricaDetalle && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-amber-900 shadow-sm">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">
              Estás visualizando un registro histórico <strong>(Versión {vista.versionHistoricaDetalle.versionNumero})</strong>. Esta pantalla es de solo lectura.
            </span>
          </div>
          <button
            type="button"
            onClick={vista.onVolverAVersionActual}
            className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-700 transition hover:bg-indigo-50"
          >
            Volver a la versión actual
          </button>
        </div>
      )}

      <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
        <Link href={RUTA_POA} className="transition-colors hover:text-indigo-700">
          POA
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-slate-700">{vista.cabecera.breadcrumbs[1]?.etiqueta || 'Actividad'}</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="rounded-md bg-slate-100 px-2 py-1 text-slate-800">
          Subactividad {vista.cabecera.folio}
        </span>
      </nav>

      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Seguimiento de actividad</p>
            <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
              {vista.cabecera.titulo}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-700">
                {vista.cabecera.folio}
              </span>
              <span className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-indigo-700">
                {vista.cabecera.centroClave}
              </span>
              <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-700">
                {vista.cabecera.versionTexto}
              </span>
              {!vista.esModoHistorico && vista.cabecera.semaforo && (
                <span className={vista.cabecera.semaforo.claseBadge}>
                  {vista.cabecera.semaforo.etiqueta}
                </span>
              )}
            </div>
          </div>

          <Link
            href={RUTA_POA}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver al POA
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        
        <div className="space-y-6 xl:col-span-2">
          {vista.esModoHistorico && vista.versionHistoricaDetalle ? (
            <VistaHistorial detalle={vista.versionHistoricaDetalle} />
          ) : (
            <VistaActual
              observaciones={vista.observacionesActivas}
              buzon={vista.buzon}
              detallesOperacion={vista.detallesOperacion}
            />
          )}
        </div>

        <aside className="space-y-6">
          <PanelDetallesOperacion
            esModoHistorico={vista.esModoHistorico}
            detallesActuales={vista.detallesOperacion}
            detalleHistorico={vista.versionHistoricaDetalle}
          />
          <HistorialTimeline nodos={vista.historialNodos} />
        </aside>
      </div>
    </div>
  );
}