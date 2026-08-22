// frontend/src/store/layout.store.ts
// Este archivo define un store global para la gestión del layout de la aplicación, incluyendo el título de la pantalla actual, información del usuario, bandejas de mensajes y notificaciones, y acciones para actualizar este estado. Se utiliza Zustand para crear un store reactivo y fácil de usar.
// En palabras sencillas: Este archivo es como un "contrato" entre la UI y el resto de la app. Define qué datos se esperan, cómo se llaman y qué funciones se pueden invocar. Así, cuando Rogelio construye los componentes, sabe exactamente qué información necesita y cómo enviarla de vuelta al store o a los servicios.

import { create } from 'zustand';
import { CabeceraGeneralGlobalProps, NotificacionItem, MensajeItem } from '../types/layout-contratos';

// 1. DICCIONARIO DE TRADUCCIÓN DE ROLES
const MAPA_ROLES: Record<string, string> = {
  CONTRALOR: 'Contralor de Centro',
  JEFA: 'Jefa de Auditoría',
  AUDITOR: 'Auditor',
};

interface LayoutState {
  // --- ESTADO GLOBAL ---
  tituloPantallaActual: string;
  nombreUsuario: string;
  cargoUsuario: string;
  urlImagenPerfil?: string;
  
  mensajes: MensajeItem[];
  notificaciones: NotificacionItem[];
  
  bandejaMensajesAbierta: boolean;
  bandejaNotificacionesAbierta: boolean;

  // --- ACCIONES ---
  setTituloPantalla: (titulo: string) => void;
  setUsuarioSesion: (nombre: string, rol: string, centroClave?: string, avatarUrl?: string) => void;
  abrirBandejaMensajes: () => void;
  abrirBandejaNotificaciones: () => void;
  cerrarBandejas: () => void;
  marcarNotificacionLeida: (id: string) => void;
  marcarMensajeLeido: (id: string) => void;
  
  // Selector para las props de UI de Rogelio
  obtenerPropsCabecera: () => CabeceraGeneralGlobalProps;
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  // Placeholders iniciales para desarrollo visual
  tituloPantallaActual: 'Plan Operativo Anual 2026',
  nombreUsuario: 'Mtro. Braulio Vicente', // TODO: Limpiar al integrar login real
  cargoUsuario: 'Contralor de Centro - CUCEI', // TODO: Limpiar al integrar login real
  urlImagenPerfil: undefined,
  
  mensajes: [],
  notificaciones: [],
  bandejaMensajesAbierta: false,
  bandejaNotificacionesAbierta: false,

  setTituloPantalla: (titulo: string) => set({ tituloPantallaActual: titulo }),

  // APLICACIÓN DEL MAPEO: Traduce el rol antes de concatenar el centro
  setUsuarioSesion: (nombre, rol, centroClave, avatarUrl) => {
    const rolNormalizado = rol ? rol.toUpperCase() : '';
    const rolLegible = MAPA_ROLES[rolNormalizado] || rol;
    
    // Si es JEFA generalmente no lleva centro, si es CONTRALOR o AUDITOR se concatena
    const cargoFinal = (centroClave && rolNormalizado !== 'JEFA')
      ? `${rolLegible} - ${centroClave}`
      : rolLegible;

    set({
      nombreUsuario: nombre,
      cargoUsuario: cargoFinal,
      urlImagenPerfil: avatarUrl,
    });
  },

  abrirBandejaMensajes: () => set(state => ({ 
    bandejaMensajesAbierta: !state.bandejaMensajesAbierta,
    bandejaNotificacionesAbierta: false 
  })),

  abrirBandejaNotificaciones: () => set(state => ({ 
    bandejaNotificacionesAbierta: !state.bandejaNotificacionesAbierta,
    bandejaMensajesAbierta: false 
  })),

  cerrarBandejas: () => set({ 
    bandejaMensajesAbierta: false, 
    bandejaNotificacionesAbierta: false 
  }),

  marcarNotificacionLeida: (id: string) => set(state => ({
    notificaciones: state.notificaciones.map(n => n.id === id ? { ...n, leido: true } : n)
  })),

  marcarMensajeLeido: (id: string) => set(state => ({
    mensajes: state.mensajes.map(m => m.id === id ? { ...m, leido: true } : m)
  })),

  obtenerPropsCabecera: (): CabeceraGeneralGlobalProps => {
    const state = get();
    return {
      tituloPantallaActual: state.tituloPantallaActual,
      nombreUsuario: state.nombreUsuario,
      cargoUsuario: state.cargoUsuario,
      urlImagenPerfil: state.urlImagenPerfil,
      numeroMensajesSinLeer: state.mensajes.filter(m => !m.leido).length,
      numeroNotificacionesSinLeer: state.notificaciones.filter(n => !n.leido).length,
      onAbrirBandejaMensajes: state.abrirBandejaMensajes,
      onAbrirBandejaNotificaciones: state.abrirBandejaNotificaciones,
      onClicPerfil: () => console.log('Opciones de perfil / Cerrar sesión'),
    };
  }
}));