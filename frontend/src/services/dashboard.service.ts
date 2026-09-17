// frontend/src/services/dashboard.service.ts
import { api } from './api';
import * as DashApi from '../types/dashboard-api';

export const dashboardService = {
  // --- CONTRALOR ---
  obtenerKpisContralor: async (): Promise<DashApi.DashboardContralorDto> => {
    try {
      const res = await api.get<DashApi.DashboardContralorDto>('/dashboard/contralor/kpis');
      return res.data;
    } catch (error) {
      console.error('Error al obtener KPIs de Contralor:', error);
      throw error;
    }
  },

  obtenerProximasAVencer: async (limit = 4): Promise<DashApi.ProximasVencerResponseDto> => {
    try {
      const res = await api.get<DashApi.ProximasVencerResponseDto>(`/actividades/proximas-vencer?limit=${limit}`);
      return res.data;
    } catch (error) {
      console.error('Error al obtener actividades próximas a vencer:', error);
      throw error;
    }
  },

  obtenerBandejaSupervision: async (page = 1, limit = 10): Promise<DashApi.SupervisionResponseDto> => {
    try {
      const res = await api.get<DashApi.SupervisionResponseDto>(
        `/actividades/supervision?page=${page}&limit=${limit}&order=desc`
      );
      return res.data;
    } catch (error) {
      console.error('Error al obtener bandeja de supervisión:', error);
      throw error;
    }
  },

  // --- JEFA ---
  obtenerKpisJefa: async (): Promise<DashApi.DashboardJefaDto> => {
    try {
      const res = await api.get<DashApi.DashboardJefaDto>('/dashboard/jefa');
      return res.data;
    } catch (error) {
      console.error('Error al obtener KPIs de Jefa:', error);
      throw error;
    }
  },

  obtenerCentrosConRezago: async (): Promise<DashApi.RezagoResponseDto> => {
    try {
      const res = await api.get<DashApi.RezagoResponseDto>('/dashboard/rezago');
      return res.data;
    } catch (error) {
      console.error('Error al obtener centros con rezago:', error);
      throw error;
    }
  },

  obtenerColaRevisionJefa: async (
    estado?: 'EN_REVISION' | 'SOLICITADO',
    page = 1,
    limit = 10
  ): Promise<DashApi.DirectorioResponseDto> => {
    try {
      const filtroEstado = estado ? `&estado_flujo=${estado}` : '';
      const res = await api.get<DashApi.DirectorioResponseDto>(
        `/actividades/directorio?page=${page}&limit=${limit}&order=desc&sort_by=FECHA_TERMINO${filtroEstado}`
      );
      return res.data;
    } catch (error) {
      console.error('Error al obtener cola de revisión de la Jefa:', error);
      throw error;
    }
  }
};