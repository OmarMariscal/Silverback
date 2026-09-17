// frontend/src/store/dashboard.store.ts
import { create } from 'zustand';
import { dashboardService } from '../services/dashboard.service';
import { adaptarDashboardContralorUI } from '../services/dashboard.adapter';
import { DashboardContralorUI } from '../types/dashboard-contratos';

interface DashboardState {
  datosContralor: DashboardContralorUI | null;
  cargando: boolean;
  error: string | null;

  cargarDashboardContralor: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  datosContralor: null,
  cargando: false,
  error: null,

  cargarDashboardContralor: async () => {
    set({ cargando: true, error: null });
    try {
      const [kpis, vencimientos, supervision] = await Promise.all([
        dashboardService.obtenerKpisContralor(),
        dashboardService.obtenerProximasAVencer(4),
        dashboardService.obtenerBandejaSupervision(1, 5)
      ]);

      const adaptado = adaptarDashboardContralorUI(kpis, vencimientos, supervision);
      set({ datosContralor: adaptado, cargando: false });
    } catch (err: any) {
      console.error('Error al cargar datos del dashboard de contralor:', err);
      set({ error: 'Error al sincronizar dashboard', cargando: false });
    }
  }
}));