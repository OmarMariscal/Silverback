'use client';

import React from 'react';
import type { TarjetaCentroPoaProps } from '@/types/poa-contratos';

interface CarruselCentrosPoaProps {
  centros: TarjetaCentroPoaProps[];
}

const clasesAnioActivo: Record<
  TarjetaCentroPoaProps['poaResumen']['estadoBadgeColor'],
  string
> = {
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  amber: 'bg-amber-100 text-amber-800 border-amber-200',
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  slate: 'bg-slate-100 text-slate-800 border-slate-200',
};

const clasesBadgeEstado: Record<
  TarjetaCentroPoaProps['poaResumen']['estadoBadgeColor'],
  string
> = {
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  slate: 'bg-slate-50 text-slate-700 border-slate-200',
};

export function CarruselCentrosPoa({ centros }: CarruselCentrosPoaProps) {
  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => {
          const el = document.getElementById('carrusel-centros-container');
          if (el) el.scrollBy({ left: -380, behavior: 'smooth' });
        }}
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:scale-105 transition-all cursor-pointer"
        title="Desplazar a la izquierda"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
      </button>

      <div
        id="carrusel-centros-container"
        className="flex space-x-5 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none snap-x"
      >
        {centros.map((centro) => (
          <div
            key={centro.idCentro}
            onClick={() => centro.onSeleccionarCentro(centro.idCentro)}
            className={`w-[380px] shrink-0 bg-white rounded-xl border-2 shadow-sm p-5 flex flex-col justify-between relative snap-start cursor-pointer transition-all ${
              centro.estaSeleccionado
                ? 'border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Etiqueta Superior Derecha (Dependiendo del estado) */}
            {centro.poaResumen.estado === 'EN_REVISION' && (
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-lg rounded-tr-lg tracking-wider">
                Dictamen Pendiente
              </div>
            )}

            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Centro Universitario
                  </span>
                  <h3 className="text-lg font-black text-slate-800">
                    {centro.clave}
                  </h3>
                  <p className="text-xs text-slate-500">{centro.nombre}</p>
                </div>

                {centro.poaResumen.porcentajeAvanceGlobal !== null && (
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                      Avance POA
                    </span>
                    <span className="text-lg font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {centro.poaResumen.porcentajeAvanceGlobal}%
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 mb-3 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">
                    Contralor Actual
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {centro.contralorNombre}
                  </span>
                </div>
                <span className="text-[9px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {centro.contralorEstatus}
                </span>
              </div>

              <div className="mb-3">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                  Histórico
                </span>
                <div className="flex space-x-1">
                  {centro.aniosHistoricos.map((anio) => (
                    <button
                      key={anio}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        centro.onCambiarAnio(centro.idCentro, anio);
                      }}
                      className={`px-2 py-0.5 rounded text-xs font-bold border transition-colors cursor-pointer ${
                        centro.anioSeleccionado === anio
                          ? clasesAnioActivo[centro.poaResumen.estadoBadgeColor]
                          : 'bg-slate-50 text-slate-600 font-medium border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {anio} {centro.anioSeleccionado === anio ? '•' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 pt-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Estado POA {centro.anioSeleccionado}:
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded border ${
                      clasesBadgeEstado[centro.poaResumen.estadoBadgeColor]
                    }`}
                  >
                    {centro.poaResumen.estadoEtiqueta}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    {centro.poaResumen.etiquetaFecha}
                  </span>
                  <span className="font-bold text-slate-700">
                    {centro.poaResumen.fechaTexto}
                  </span>
                </div>
              </div>
            </div>

            {centro.estaSeleccionado ? (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-indigo-600 font-bold text-xs">
                <span>Inspeccionando ahora</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            ) : (
              <button
                type="button"
                className="mt-4 w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                Cargar para Revisar
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          const el = document.getElementById('carrusel-centros-container');
          if (el) el.scrollBy({ left: 380, behavior: 'smooth' });
        }}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:scale-105 transition-all cursor-pointer"
        title="Desplazar a la derecha"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </button>
    </div>
  );
}