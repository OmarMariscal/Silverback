'use client';

import React from 'react';
import type { CabeceraPOAData, EstadoPOA } from '@/types/poa-contratos';

interface HeaderPoaContralorProps {
  cabecera: CabeceraPOAData;
  totalActividades: number;
  onAgregarActividad: () => void;
  onPresentarPoa: () => void;
  onCancelarEnvioPoa: () => void;
}

const configEstadoBadge: Record<
  EstadoPOA,
  { contenedor: string; punto: string; etiqueta: string }
> = {
  BORRADOR: {
    contenedor: 'bg-amber-100 text-amber-700 border-amber-200',
    punto: 'bg-amber-500 animate-pulse',
    etiqueta: 'En Borrador',
  },
  DEVUELTA: {
    contenedor: 'bg-amber-100 text-amber-700 border-amber-200',
    punto: 'bg-amber-500 animate-pulse',
    etiqueta: 'Devuelto (Obs)',
  },
  EN_REVISION: {
    contenedor: 'bg-purple-100 text-purple-700 border-purple-200',
    punto: 'bg-purple-500 animate-pulse',
    etiqueta: 'En Revisión',
  },
  AUTORIZADA: {
    contenedor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    punto: 'bg-emerald-500',
    etiqueta: 'Autorizado',
  },
};

export function HeaderPoaContralor({
  cabecera,
  totalActividades,
  onAgregarActividad,
  onPresentarPoa,
  onCancelarEnvioPoa,
}: HeaderPoaContralorProps) {
  const badge = configEstadoBadge[cabecera.estadoActual] || configEstadoBadge.BORRADOR;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Actividades Programadas ({totalActividades})
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Configura las actividades e indicadores para este ciclo fiscal.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:space-x-1">
        <span
          className={`px-4 py-2 rounded-lg text-sm font-bold border shadow-sm flex items-center ${badge.contenedor}`}
        >
          <span className={`w-2.5 h-2.5 rounded-full mr-2 ${badge.punto}`}></span>
          Estado: {badge.etiqueta}
        </span>

        {cabecera.puedeEditar && (
          <>
            <button
              type="button"
              onClick={onAgregarActividad}
              disabled={cabecera.estaCargando}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all flex items-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Agregar Actividad
            </button>

            {totalActividades > 0 && (
              <button
                type="button"
                onClick={onPresentarPoa}
                disabled={cabecera.estaCargando}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all flex items-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cabecera.estaCargando ? (
                  'Enviando...'
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Presentar POA
                  </>
                )}
              </button>
            )}
          </>
        )}

        {cabecera.estadoActual === 'EN_REVISION' && (
          <button
            type="button"
            onClick={onCancelarEnvioPoa}
            disabled={cabecera.estaCargando}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cabecera.estaCargando ? 'Cancelando...' : 'Cancelar Envío'}
          </button>
        )}
      </div>
    </div>
  );
}