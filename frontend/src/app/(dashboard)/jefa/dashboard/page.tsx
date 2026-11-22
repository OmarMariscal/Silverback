'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/store/dashboard.store';
import { getModulePath } from '@/modules/perfiles/role-menu';

import TarjetasEstadoGeneral from '@/components/dashboard/TarjetasEstadoGeneral';
import GraficaCircular from '@/components/dashboard/GraficaCircular';
import AtencionPrioritaria from '@/components/dashboard/AtencionPrioritaria';
import RevisionesPendientes from '@/components/dashboard/RevisionesPendientes';
import EstadoCarga from '@/components/ui/EstadoCarga';
import BtnReintentar from '@/components/ui/BtnReintentar';

export default function JefaDashboardPage() {
  const router = useRouter();
  const { datosJefa, cargando, error, cargarDashboard } = useDashboardStore();

  useEffect(() => {
    void cargarDashboard();
  }, [cargarDashboard]);

  if (cargando) {
    return (
      <EstadoCarga
        mensaje="Cargando información del Dashboard..."
        variante="spinner"
      />
    );
  }

  if (!datosJefa) {
    return (
      <BtnReintentar
        mensajePrincipal="No se pudo cargar la información del dashboard."
        mensajeSecundario={
          error || 'Ocurrió un error inesperado al intentar obtener la información del dashboard.'
        }
        onClickReintentar={() => void cargarDashboard()}
      />
    );
  }

  const { kpis, graficaSemaforos, graficaDistribucion, rezago, directorio } = datosJefa;

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      <div className="flex flex-col justify-between md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Resumen Ejecutivo Global
          </h2>
          <p className="mt-1 text-base text-slate-500">
            Monitoreo consolidado de los Centros Universitarios y seguimiento de actividades.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(getModulePath('JEFA', 'actividades'))}
          className="mt-4 flex items-center rounded-xl bg-indigo-600 px-6 py-2.5 font-bold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700 md:mt-0 cursor-pointer"
        >
          Lista de Actividades Completa
          <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <TarjetasEstadoGeneral role="JEFA" kpis={kpis} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <GraficaCircular {...graficaSemaforos} variante="grid" />
        <GraficaCircular {...graficaDistribucion} variante="lista" />
        <AtencionPrioritaria rezago={rezago} />
      </div>

      <RevisionesPendientes directorio={directorio} />
    </div>
  );
}