'use client';

import React from 'react';
import { TarjetaActividad } from './TarjetaActividad';
import type { TarjetaActividadPOAData } from '@/types/poa-contratos';

interface ListaActividadesProps {
  actividades: TarjetaActividadPOAData[];
  puedeEditar: boolean;
  onExpandirActividad: (idActividad: string) => void;
  onBorrarActividad: (idActividad: string) => void;
  onEditarActividad?: (actividad: TarjetaActividadPOAData) => void;
  onGestionarSubactividades?: (idActividad: string, tituloActividad: string) => void;
  onAbrirSubactividad?: (subActividadId: string) => void;
}

export function ListaActividades({
  actividades,
  puedeEditar,
  onExpandirActividad,
  onBorrarActividad,
  onEditarActividad,
  onGestionarSubactividades,
  onAbrirSubactividad,
}: ListaActividadesProps) {
  if (actividades.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
        <h3 className="text-base font-bold text-slate-700">
          Sin actividades registradas
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Usa el botón &ldquo;Agregar Actividad&rdquo; para comenzar a construir el Plan Operativo Anual.
        </p>
      </div>
    );
  }

  return (
    <div>
      {actividades.map((actividad, index) => (
        <TarjetaActividad
          key={actividad.idActividad}
          {...actividad}
          consecutivoIndex={index}
          puedeEditar={puedeEditar}
          onExpandirTarjeta={() => onExpandirActividad(actividad.idActividad)}
          onBorrarActividad={() => onBorrarActividad(actividad.idActividad)}
          onConfigurarFichaTecnica={() => onEditarActividad?.(actividad)}
          onAbrirModalSubactividades={(idAct, tituloAct) =>
            onGestionarSubactividades?.(idAct, tituloAct)
          }
          onAbrirSubactividad={onAbrirSubactividad}
        />
      ))}
    </div>
  );
}