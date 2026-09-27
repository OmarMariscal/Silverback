// frontend/src/services/dashboard.service.ts
// Este archivo contiene funciones para interactuar con el backend de Emiliano y obtener datos específicos del dashboard, como KPIs, actividades próximas a vencer, bandeja de supervisión, etc.
// En palabras sencillas: Este archivo es como un "puente" entre tu frontend y el backend de Emiliano. Cada función hace una llamada HTTP a un endpoint específico y devuelve los datos que necesitas para mostrar en la interfaz de usuario.

import { api, obtenerRolActivo } from './api';
import * as DashApi from '../types/dashboard-api';

export const dashboardService = {
  // --- KPIs DINÁMICOS SEGÚN ROL ---
  obtenerKpisGenerales: async (): Promise<any> => {
    try {
      const rol = obtenerRolActivo();
      if (rol === 'JEFA') {
        const res = await api.get<DashApi.DashboardJefaDto>('/dashboard/jefa');
        return res.data;
      } else {
        const res = await api.get<DashApi.DashboardContralorDto>('/dashboard/contralor/kpis');
        return res.data;
      }
    } catch (error) {
      console.error('Error al obtener KPIs del Dashboard:', error);
      throw error;
    }
  },

  obtenerKpisContralor: async (): Promise<DashApi.DashboardContralorDto> => {
    try {
      const res = await api.get<DashApi.DashboardContralorDto>('/dashboard/contralor/kpis');
      return res.data;
    } catch (error) {
      console.error('Error al obtener KPIs de Contralor:', error);
      throw error;
    }
  },

  obtenerKpisJefa: async (): Promise<DashApi.DashboardJefaDto> => {
    try {
      const res = await api.get<DashApi.DashboardJefaDto>('/dashboard/jefa');
      return res.data;
    } catch (error) {
      console.error('Error al obtener KPIs de Jefa:', error);
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

  // Exclusivo de Contralor: /actividades/supervision
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

  // Exclusivo de Jefa: /actividades/directorio ordenado por fecha
  obtenerBandejaDirectorioJefa: async (page = 1, limit = 10, estado?: string): Promise<DashApi.DirectorioResponseDto> => {
    try {
      const filtroEstado = estado ? `&estado_flujo=${estado}` : '';
      const res = await api.get<DashApi.DirectorioResponseDto>(
        `/actividades/directorio?page=${page}&limit=${limit}&order=desc&sort_by=FECHA_TERMINO${filtroEstado}`
      );
      return res.data;
    } catch (error) {
      console.error('Error al obtener directorio de actividades para la Jefa:', error);
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
  }
};