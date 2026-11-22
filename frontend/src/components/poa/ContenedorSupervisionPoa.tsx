'use client';

import React from 'react';
import type {
  FiltroEstadoPoaJefa,
  InspectorPoaSupervisionProps,
  KpisSupervisionPoasUI,
  ModalDevolverPoaProps,
  ModoVisualizacionSupervision,
  TarjetaCentroPoaProps,
} from '@/types/poa-contratos';
import { BarraFiltrosPoa } from './BarraFiltrosPoa';
import { CarruselCentrosPoa } from './CarruselCentrosPoa';
import { InspectorPoa } from './InspectorPoa';
import { ModalDevolverPoa } from './ModalDevolverPoa';

export interface ContenedorSupervisionPoaProps {
  centros: TarjetaCentroPoaProps[];
  inspector: InspectorPoaSupervisionProps | null;
  modoVisualizacion: ModoVisualizacionSupervision;
  filtroEstado: FiltroEstadoPoaJefa;
  kpis: KpisSupervisionPoasUI;
  busquedaTexto: string;
  anioGlobal: number;
  aniosDisponibles: number[];
  modalDevolver: ModalDevolverPoaProps;
  onSetModoVisualizacion: (modo: ModoVisualizacionSupervision) => void;
  onAlternarModoVisualizacion: () => void;
  onDeseleccionarCentro: () => void;
  onSetFiltroEstado: (filtro: FiltroEstadoPoaJefa) => void;
  onSetBusquedaTexto: (texto: string) => void;
  onSetAnioGlobal: (anio: number) => void;
}

export function ContenedorSupervisionPoa({
  centros,
  inspector,
  modoVisualizacion,
  filtroEstado,
  kpis,
  busquedaTexto,
  anioGlobal,
  aniosDisponibles,
  modalDevolver,
  onSetModoVisualizacion,
  onAlternarModoVisualizacion,
  onDeseleccionarCentro,
  onSetFiltroEstado,
  onSetBusquedaTexto,
  onSetAnioGlobal,
}: ContenedorSupervisionPoaProps) {
  const centroSeleccionadoVisible = Boolean(
    inspector && centros.some((c) => c.idCentro === inspector.idCentro),
  );
  const esPantallaCompleta =
    modoVisualizacion === 'PANTALLA_COMPLETA' && centroSeleccionadoVisible;

  return (
    <main className="flex-1 overflow-y-auto p-8 space-y-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* 1. MODO PANTALLA COMPLETA: Barra de retorno */}
        {esPantallaCompleta ? (
          <div className="flex items-center justify-between bg-white px-6 py-3.5 rounded-xl border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => onSetModoVisualizacion('INCRUSTADA')}
              className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors group cursor-pointer"
            >
              <svg
                className="w-4 h-4 mr-2 text-slate-400 group-hover:text-indigo-600 transform group-hover:-translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver a la lista de POAs
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Modo Pantalla Completa:
              </span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                {inspector?.centroClave} (POA {inspector?.anioFiscal})
              </span>
            </div>
          </div>
        ) : (
          /* 2. MODO NORMAL (INCRUSTADA): Filtros y Carrusel de Centros */
          <>
            <BarraFiltrosPoa
              filtroEstado={filtroEstado}
              kpis={kpis}
              busquedaTexto={busquedaTexto}
              anioGlobal={anioGlobal}
              aniosDisponibles={aniosDisponibles}
              onSetFiltroEstado={onSetFiltroEstado}
              onSetBusquedaTexto={onSetBusquedaTexto}
              onSetAnioGlobal={onSetAnioGlobal}
            />

            <CarruselCentrosPoa centros={centros} />
          </>
        )}

        {/* 3. INSPECTOR DE POA SELECCIONADO O ESTADO VACÍO */}
        {centroSeleccionadoVisible && inspector ? (
          <InspectorPoa
            inspector={inspector}
            modoVisualizacion={modoVisualizacion}
            onAlternarModo={onAlternarModoVisualizacion}
            onCerrar={onDeseleccionarCentro}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              Ningún Plan Operativo Anual seleccionado
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Haz clic en cualquiera de las tarjetas de los Centros Universitarios de arriba para desplegar y revisar sus actividades, justificaciones y subactividades.
            </p>
          </div>
        )}
      </div>

      <ModalDevolverPoa {...modalDevolver} />
    </main>
  );
}