// frontend/src/store/dashboard.store.ts
// Este archivo contiene el estado global del dashboard usando Zustand. Define cómo se almacenan y actualizan los datos del dashboard, como KPIs, actividades próximas a vencer y bandeja de supervisión.
// En palabras sencillas: Este archivo es como un "almacén central" para los datos del dashboard. Permite que cualquier componente de la aplicación acceda a estos datos y los actualice de manera consistente, sin tener que pasar props por todos lados. 

import { create } from 'zustand';
import { dashboardService } from '../services/dashboard.service';
import { adaptarDashboardContralorUI } from '../services/dashboard.adapter';
import { DashboardContralorUI } from '../types/dashboard-contratos';
import { obtenerRolActivo } from '../services/api';

interface DashboardState {
  datosContralor: DashboardContralorUI | null;
  datosJefa: any | null;
  rolActual: string;
  cargando: boolean;
  error: string | null;

  cargarDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  datosContralor: null,
  datosJefa: null,
  rolActual: obtenerRolActivo(),
  cargando: false,
  error: null,

  cargarDashboard: async () => {
    set({ cargando: true, error: null });
    try {
      const rol = obtenerRolActivo();
      set({ rolActual: rol });

      if (rol === 'JEFA') {
        const [kpisJefa, rezago, directorio] = await Promise.all([
          dashboardService.obtenerKpisJefa(),
          dashboardService.obtenerCentrosConRezago(),
          dashboardService.obtenerBandejaDirectorioJefa(1, 10)
        ]);

        set({
          datosJefa: {
            kpis: kpisJefa,
            rezago: rezago.data,
            directorio: directorio.data
          },
          cargando: false
        });
      } else {
        const [kpis, vencimientos, supervision] = await Promise.all([
          dashboardService.obtenerKpisContralor(),
          dashboardService.obtenerProximasAVencer(4),
          dashboardService.obtenerBandejaSupervision(1, 5)
        ]);

        const adaptado = adaptarDashboardContralorUI(kpis, vencimientos, supervision);
        set({ datosContralor: adaptado, cargando: false });
      }
    } catch (err: any) {
      console.error('Error al cargar datos del dashboard:', err);
      set({ error: 'Error al sincronizar dashboard', cargando: false });
    }
  }
}));