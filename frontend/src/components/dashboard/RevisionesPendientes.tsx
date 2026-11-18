'use client';

import { useRouter } from 'next/navigation';
import { getModulePath } from '@/modules/perfiles/role-menu';

export default function RevisionesPendientes({ directorio }: { directorio: any[] }) {
  const router = useRouter();

  const abrirDetalleSubactividad = (id: string) => {
    router.push(`${getModulePath('JEFA', 'poa')}/subactividades/${id}`);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 bg-white px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-800">Revisiones y Solicitudes Pendientes</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{directorio?.length || 0} mostradas</span>
        </div>
        <button
          type="button"
          onClick={() => router.push(getModulePath('JEFA', 'actividades'))}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          Ver directorio completo
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              <th className="px-8 py-3.5">IDENTIFICADOR</th>
              <th className="px-6 py-3.5">ACTIVIDAD Y FECHAS</th>
              <th className="px-6 py-3.5">CENTRO / CONTRALOR</th>
              <th className="px-6 py-3.5">ESTADO OPERATIVO</th>
              <th className="px-6 py-3.5">SEMÁFORO</th>
              <th className="w-10 px-4 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {directorio && directorio.length > 0 ? (
              directorio.map((item) => {
                const tipoUpper = (item.tipo || '').toUpperCase();
                const esAuditoria = tipoUpper.includes('AUDITOR');
                const esRevision = tipoUpper.includes('REVISI');
                const esSolicitada = (item.estadoEtiqueta || '').toUpperCase().includes('SOLICITADA');

                return (
                  <tr
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => abrirDetalleSubactividad(item.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        abrirDetalleSubactividad(item.id);
                      }
                    }}
                    className="group cursor-pointer transition-colors hover:bg-indigo-50/40 focus:bg-indigo-50/40 focus:outline-none"
                  >
                    <td className="px-8 py-4 align-top">
                      <span className="block font-bold text-slate-800">{item.identificador}</span>
                      <span className={`mt-1.5 inline-block rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        esAuditoria ? 'bg-purple-100 text-purple-700' : esRevision ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {item.tipo || 'S/N'}
                      </span>
                    </td>
                    <td className="max-w-md px-6 py-4 align-top">
                      <span className="block font-bold leading-snug text-slate-800 transition-colors group-hover:text-indigo-700">
                        {item.titulo}
                      </span>
                      <span className="mt-1 block text-xs text-slate-400">Enviado: {item.fechaEnviado || 'Sin fecha'} · Término POA: {item.fechaTermino || 'Sin fecha'}</span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className="block font-bold text-slate-800">{item.centroClave}</span>
                      <span className="mt-0.5 block text-xs text-slate-400">{item.contralor}</span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                        esSolicitada ? 'bg-amber-50 text-amber-700 border border-amber-200/60' : 'bg-purple-50 text-purple-700 border border-purple-200/60'
                      }`}>
                        {item.estadoEtiqueta}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${item.semaforo === 'CRITICO' ? 'bg-red-500' : item.semaforo === 'PRECAUCION' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <span className="font-bold text-slate-700">{item.semaforo === 'CRITICO' ? 'Crítico' : item.semaforo === 'PRECAUCION' ? 'Alerta' : 'A tiempo'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-middle text-right">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          abrirDetalleSubactividad(item.id);
                        }}
                        aria-label={`Ver detalle de ${item.identificador || item.titulo}`}
                        className="rounded-full p-2 transition-colors group-hover:bg-indigo-100"
                      >
                        <svg className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={6} className="py-12 text-center text-sm italic text-slate-400">No hay actividades disponibles.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}