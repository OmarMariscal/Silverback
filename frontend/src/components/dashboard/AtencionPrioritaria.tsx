'use client';

import { useRouter } from 'next/navigation';
import { getModulePath } from '@/modules/perfiles/role-menu';

export default function AtencionPrioritaria({ rezago }: { rezago: any[] }) {
  const router = useRouter();

  const irAPoaCentro = (item: any) => {
    const basePoa = getModulePath('JEFA', 'poa');
    if (item.centroId) {
      router.push(`${basePoa}?centroId=${encodeURIComponent(item.centroId)}`);
      return;
    }
    if (item.centroClave) {
      router.push(`${basePoa}?centro=${encodeURIComponent(item.centroClave)}`);
      return;
    }
    router.push(basePoa);
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700">Atención Prioritaria</h3>
          <span className="rounded border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-red-600">REZAGO</span>
        </div>
        <p className="mb-8 text-xs font-medium text-slate-400">Centros Universitarios con mayor acumulación de actividades críticas.</p>
        
        <div className="space-y-6">
          {rezago && rezago.length > 0 ? (
            rezago.map((item) => {
              const porcentaje = item.total > 0 ? Math.min(100, Math.round((item.actividadesCriticas / item.total) * 100)) : 0;
              const esCritico = item.actividadesCriticas > 5;
              const colorTexto = esCritico ? 'text-red-600' : 'text-amber-500';
              const colorBarra = esCritico ? 'bg-red-500' : 'bg-amber-500';

              return (
                <div key={item.centroId || item.centroClave}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => irAPoaCentro(item)}
                      className="cursor-pointer rounded-md text-left font-bold text-slate-800 underline-offset-4 transition-colors hover:text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      title={`Ver POA de ${item.centroClave || item.centroNombre}`}
                    >
                      {item.centroClave || item.centroNombre}
                    </button>
                    <span className={`font-bold ${colorTexto}`}>{item.actividadesCriticas} críticas</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full transition-all duration-500 ${colorBarra}`} style={{ width: `${porcentaje}%` }} />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="py-8 text-center text-sm italic text-slate-400">Sin centros con rezago registrado.</p>
          )}
        </div>
      </div>
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => router.push(`${getModulePath('JEFA', 'actividades')}?semaforo=CRITICO`)}
          className="text-xs font-bold uppercase tracking-wider text-indigo-600 transition-colors hover:text-indigo-800"
        >
          VER DESGLOSE
        </button>
      </div>
    </div>
  );
}