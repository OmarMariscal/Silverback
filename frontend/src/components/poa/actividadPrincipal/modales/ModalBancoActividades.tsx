'use client';

import { useMemo, useState } from 'react';
import { BancoActividadItemProps } from '@/types/poa-contratos';

interface ModalBancoActividadesProps {
  isOpen: boolean;
  actividadesDisponibles: BancoActividadItemProps[];
  estaCargando?: boolean;
  onSeleccionar: (idBanco: string) => void;
  onCrearPersonalizada: () => void;
  onCancelar: () => void;
}

export function ModalBancoActividades({
  isOpen,
  actividadesDisponibles,
  estaCargando = false,
  onSeleccionar,
  onCrearPersonalizada,
  onCancelar,
}: ModalBancoActividadesProps) {
  const [busqueda, setBusqueda] = useState('');

  const resultados = useMemo(() => {
    const criterio = busqueda.trim().toLowerCase();
    if (!criterio) return actividadesDisponibles;
    return actividadesDisponibles.filter((actividad) =>
      `${actividad.titulo} ${actividad.descripcionCorta}`.toLowerCase().includes(criterio),
    );
  }, [actividadesDisponibles, busqueda]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <section className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-100 px-6 py-6 sm:px-8">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Paso 1 de 3</p>
            <h2 className="text-2xl font-bold text-slate-900">Seleccionar Actividad Principal</h2>
            <p className="mt-2 text-sm text-slate-500">Elige una actividad del banco institucional para añadirla a tu POA.</p>
          </div>
          <button type="button" onClick={onCancelar} className="rounded-lg p-2 text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Cerrar">
            x
          </button>
        </header>

        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4 sm:px-8">
          <label className="relative block">
            <span className="sr-only">Buscar actividad</span>
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">⌕</span>
            <input
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar por palabra clave (ej. Nómina, Bienes, Obra)..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              autoFocus
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-6 sm:p-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Banco institucional ({resultados.length})</p>
          {estaCargando ? (
            <p className="py-12 text-center text-sm text-slate-500">Cargando actividades...</p>
          ) : resultados.length ? (
            <div className="space-y-3">
              {resultados.map((actividad) => (
                <button
                  key={actividad.idActividadBanco}
                  type="button"
                  onClick={() => onSeleccionar(actividad.idActividadBanco)}
                  className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                >
                  <span className="min-w-0 pr-5">
                    <span className="mb-2 inline-block rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700">Actividad institucional</span>
                    <span className="block text-base font-bold text-slate-800">{actividad.titulo}</span>
                    <span className="mt-1 block line-clamp-2 text-sm text-slate-500">{actividad.descripcionCorta}</span>
                  </span>
                  <span className="text-2xl text-indigo-500 transition group-hover:translate-x-1" aria-hidden="true">›</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-slate-500">No se encontraron actividades con ese criterio.</p>
          )}
        </div>

        <footer className="border-t border-slate-200 bg-white p-5 sm:p-6">
          <button type="button" onClick={onCrearPersonalizada} className="flex w-full flex-col items-center rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 px-4 py-4 text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-50">
            <span className="text-2xl font-light">+</span>
            <span className="font-bold">Crear Actividad Personalizada</span>
            <span className="text-xs text-indigo-500">No encontré lo que buscaba en el banco</span>
          </button>
        </footer>
      </section>
    </div>
  );
}
