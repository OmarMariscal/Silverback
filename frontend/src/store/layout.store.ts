// frontend/src/store/layout.store.ts
// Este archivo define un store global para la gestión del layout de la aplicación, incluyendo el título de la pantalla actual, información del usuario, bandejas de mensajes y notificaciones, y acciones para actualizar este estado. Se utiliza Zustand para crear un store reactivo y fácil de usar.
// En palabras sencillas: Este archivo es como un "contrato" entre la UI y el resto de la app. Define qué datos se esperan, cómo se llaman y qué funciones se pueden invocar. Así, cuando Rogelio construye los componentes, sabe exactamente qué información necesita y cómo enviarla de vuelta al store o a los servicios.

import { create } from 'zustand';
import type { RolUsuario } from '../types/roles';
import { normalizarRolUsuario } from '../types/roles';
import { MOCK_SESSION } from '../services/api';

const MAPA_ROLES: Record<string, string> = {
  ADMIN: 'Administrador',
  JEFA: 'Jefa de Auditoría',
  CONTRALOR_GENERAL: 'Contraloría General',
  CONTRALOR: 'Contralor de Centro',
  AUDITOR: 'Auditor',
};

interface LayoutState {
  // --- ESTADO GLOBAL ---
  tituloPantallaActual: string;
  nombreUsuario: string;
  cargoUsuario: string;
  rolUsuario: RolUsuario;
  urlImagenPerfil?: string;

  setTituloPantalla: (titulo: string) => void;
  setUsuarioSesion: (nombre: string, rol: string, centroClave?: string, avatarUrl?: string) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  tituloPantallaActual: 'Plan Operativo Anual 2026',
  nombreUsuario: 'Mtro. Braulio Vicente',
  cargoUsuario: `${MAPA_ROLES[MOCK_SESSION.role]} - CUCEI`,
  rolUsuario: MOCK_SESSION.role,
  urlImagenPerfil: undefined,

  setTituloPantalla: (titulo: string) => set({ tituloPantallaActual: titulo }),

  setUsuarioSesion: (nombre, rol, centroClave, avatarUrl) => {
    const rolNormalizado = normalizarRolUsuario(rol);
    if (!rolNormalizado) {
      throw new Error(`Rol de usuario no reconocido: ${rol}`);
    }

    const rolLegible = MAPA_ROLES[rolNormalizado];
    const cargoFinal =
      centroClave &&
      rolNormalizado !== 'JEFA' &&
      rolNormalizado !== 'ADMIN' &&
      rolNormalizado !== 'CONTRALOR_GENERAL'
        ? `${rolLegible} - ${centroClave}`
        : rolLegible;

    set({
      nombreUsuario: nombre,
      cargoUsuario: cargoFinal,
      rolUsuario: rolNormalizado,
      urlImagenPerfil: avatarUrl,
    });
  },
}));