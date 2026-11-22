'use client';

import type { ActividadDirectorioUI } from '@/types/actividades-contratos';
import { FilaActividadContralor } from './FilaActividadContralor';
import { FilaActividadJefa } from './FilaActividadJefa';

interface TablaActividadesProps {
  rol: 'CONTRALOR' | 'JEFA';
  actividades: ActividadDirectorioUI[];
  estaCargando: boolean;
  onSeleccionarActividad: (id: string) => void;
}

const COLUMNAS_CONTRALOR = [
  'Identificador',
  'Actividad y Fechas',
  'Porcentaje de Participación',
  'Estado Operativo',
  'Semáforo',
  '',
];

const COLUMNAS_JEFA = [
  'Identificador',
  'Actividad y Fechas',
  'Asignación',
  'Estado Operativo',
  'Semáforo',
  '',
];

export function TablaActividades({
  rol,
  actividades,
  estaCargando,
  onSeleccionarActividad,
}: TablaActividadesProps) {
  const columnas = rol === 'JEFA' ? COLUMNAS_JEFA : COLUMNAS_CONTRALOR;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px] border-collapse text-left">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            {columnas.map((titulo, index) => (
              <th
                key={titulo || `accion-${index}`}
                className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500"
              >
                {titulo}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 text-sm">
          {estaCargando ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-12 text-center text-sm font-medium text-slate-500"
              >
                Cargando actividades...
              </td>
            </tr>
          ) : actividades.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-12 text-center text-sm font-medium text-slate-500"
              >
                No se encontraron actividades con los filtros actuales.
              </td>
            </tr>
          ) : (
            actividades.map((actividad) =>
              rol === 'JEFA' ? (
                <FilaActividadJefa
                  key={actividad.id}
                  actividad={actividad}
                  onSeleccionar={onSeleccionarActividad}
                />
              ) : (
                <FilaActividadContralor
                  key={actividad.id}
                  actividad={actividad}
                  onSeleccionar={onSeleccionarActividad}
                />
              ),
            )
          )}
        </tbody>
      </table>
    </div>
  );
}