'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getModulePath } from '@/modules/perfiles/role-menu';

export default function DetallesSubactividadJefaPage() {
  const { subActividadId } = useParams<{ subActividadId: string }>();
  const router = useRouter();
  const rutaPoaJefa = getModulePath('JEFA', 'poa');

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <nav
        aria-label="Ruta de navegación"
        className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500"
      >
        <Link href={rutaPoaJefa} className="transition-colors hover:text-indigo-700">
          POA
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="rounded-md bg-slate-100 px-2 py-1 text-slate-800">
          Subactividad {subActividadId}
        </span>
      </nav>

      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
              Supervisión de Subactividad
            </p>
            <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
              Detalle de Subactividad
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-700">
                ID: {subActividadId}
              </span>
              <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-amber-700">
                Trabajando en ello
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-800">Trabajando en ello</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Esta vista de revisión y dictamen de subactividades para Jefatura se encuentra en desarrollo.
        </p>
      </section>
    </div>
  );
}