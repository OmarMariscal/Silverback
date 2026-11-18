'use client';

import type { ActividadDirectorioUI } from '@/types/actividades-contratos';

interface FilaActividadJefaProps {
  actividad: ActividadDirectorioUI;
  onSeleccionar: (id: string) => void;
}

export function FilaActividadJefa({
  actividad,
  onSeleccionar,
}: FilaActividadJefaProps) {
  return (
    <tr
      role="button"
      tabIndex={0}
      onClick={() => onSeleccionar(actividad.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSeleccionar(actividad.id);
        }
      }}
      className="group cursor-pointer transition-colors hover:bg-indigo-50/40 focus:bg-indigo-50/40 focus:outline-none"
    >
      <td className="px-6 py-5">
        <strong className="block text-base font-black text-slate-800">
          {actividad.identificador}
        </strong>
        <span
          className={`mt-2 inline-block rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
            actividad.tipoActividad === 'AUDITORIA'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {actividad.tipoEtiqueta}
        </span>
      </td>

      <td className="max-w-lg px-6 py-5">
        <strong className="block truncate text-base font-bold text-slate-800 transition-colors group-hover:text-indigo-700">
          {actividad.titulo}
        </strong>
        <span className="mt-2 flex items-center text-xs font-medium text-slate-500">
          <svg
            className="mr-1.5 h-3.5 w-3.5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
            />
          </svg>
          Término POA: {actividad.fechaTermino}
        </span>
      </td>

      <td className="px-6 py-5 text-sm">
        <strong className="block font-bold text-slate-700">
          {actividad.asignacionPrincipal}
        </strong>
        <span className="mt-1 block max-w-56 truncate text-xs text-slate-500">
          {actividad.asignacionSecundaria}
        </span>
      </td>

      <td className="px-6 py-5">
        <span
          className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-bold shadow-sm ${actividad.estadoClase}`}
        >
          {actividad.estadoEtiqueta}
        </span>
      </td>

      <td className="px-6 py-5">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <span className={`h-3 w-3 rounded-full ${actividad.semaforoClase}`} />
          {actividad.semaforoEtiqueta}
        </span>
      </td>

      <td className="px-6 py-5 text-right">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSeleccionar(actividad.id);
          }}
          aria-label={`Ver detalle de actividad ${actividad.identificador || actividad.titulo}`}
          className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-xl text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:bg-indigo-100 group-hover:text-indigo-600"
        >
          ›
        </button>
      </td>
    </tr>
  );
}