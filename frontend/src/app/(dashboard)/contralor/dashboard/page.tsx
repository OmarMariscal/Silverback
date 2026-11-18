'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/store/dashboard.store';
import { getModulePath } from '@/modules/perfiles/role-menu';

import TarjetasEstadoGeneral from '@/components/dashboard/TarjetasEstadoGeneral';
import GraficaCircular from '@/components/dashboard/GraficaCircular';
import ProximosVencimientos from '@/components/dashboard/ProximosVencimientos';
import BandejaSupervision from '@/components/dashboard/BandejaSupervision';
import EstadoCarga from '@/components/ui/EstadoCarga';
import BtnReintentar from '@/components/ui/BtnReintentar';

export default function ContralorDashboardPage() {
  const router = useRouter();
  const { datosContralor, cargando, error, cargarDashboard } = useDashboardStore();

  useEffect(() => {
    cargarDashboard();
  }, [cargarDashboard]);

  if (cargando) {
    return (
      <>
        <EstadoCarga 
          mensaje="Cargando información del Dashboard..."
          variante="spinner"
        />
      </>
    );
  }

  if (!datosContralor) {
    return (
      <>
        <BtnReintentar
          mensajePrincipal="No se pudo cargar la información del dashboard."
          mensajeSecundario={error || 'Ocurrió un error inesperado al intentar obtener la información del dashboard.'}
          onClickReintentar={() => void cargarDashboard()}
        />
      </>
    );
  }

  const { kpis, graficaSemaforos, graficaFlujo, proximosVencimientos, bandejaSupervision } = datosContralor;

  return (
    <>
      <div className="mx-auto max-w-[1600px] space-y-8">
        <div className="flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">Mi Resumen Operativo</h2>
            <p className="mt-1 flex items-center text-base text-slate-500">
              <svg className="mr-1.5 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {datosContralor.centroNombre}
            </p>
          </div>
          <button
            onClick={() => router.push(getModulePath('CONTRALOR', 'actividades'))}
            className="mt-4 md:mt-0 flex items-center rounded-xl bg-indigo-600 px-6 py-2.5 font-bold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700"
          >
            Lista de Actividades Completa
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <TarjetasEstadoGeneral role="CONTRALOR" kpis={kpis} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <GraficaCircular {...graficaSemaforos} variante="grid" />
          <GraficaCircular {...graficaFlujo} variante="lista" />
          <ProximosVencimientos vencimientos={proximosVencimientos} 
            onSeleccionar={(id) =>
                router.push(`${getModulePath('CONTRALOR', 'poa')}/subactividades/${id}`)
              }
          />
        </div>

        <BandejaSupervision bandeja={bandejaSupervision} 
          onSeleccionar={(id) =>
            router.push(`${getModulePath('CONTRALOR', 'poa')}/subactividades/${id}`)
          }
        />
      </div>
    </>
  );
}