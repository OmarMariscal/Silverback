// frontend/src/store/layout.store.ts
// Este archivo define el store global para la gestión del layout de la aplicación,
// incluyendo el título de la pantalla actual, información del usuario autenticado (nombre, cargo, rol, avatar),
// y acciones reactivas para actualizar esta información cuando el backend responde o cuando cambia MOCK_SESSION en api.ts.

import { create } from 'zustand';
import type { RolUsuario } from '../types/roles';
import { normalizarRolUsuario } from '../types/roles';
import { authService, type UsuarioSesion } from '../services/auth.service';
import { MOCK_SESSION } from '../services/api';

export const MAPA_ROLES: Record<string, string> = {
  ADMIN: 'Administrador',
  JEFA: 'Jefa de Auditoría',
  CONTRALOR_GENERAL: 'Contraloría General',
  CONTRALOR: 'Contralor de Centro',
  AUDITOR: 'Auditor',
};

/**
 * Genera el texto del cargo del usuario.
 * Centros como CUCEI o CUVALLES aplican exclusivamente a Contralores y Auditores de Centro.
 * La Jefa y administradores no llevan sufijo de centro particular.
 */
export const formatearCargoUsuario = (
  rol: RolUsuario,
  centroClave?: string | null
): string => {
  const rolLegible = MAPA_ROLES[rol] || rol;
  if (
    centroClave &&
    rol !== 'JEFA' &&
    rol !== 'ADMIN' &&
    rol !== 'CONTRALOR_GENERAL'
  ) {
    return `${rolLegible} - ${centroClave}`;
  }
  return rolLegible;
};

interface SincronizarUsuarioParams {
  nombre?: string;
  rol?: RolUsuario | string;
  centroClave?: string | null;
  avatarUrl?: string;
}

interface LayoutState {
  // --- ESTADO GLOBAL ---
  tituloPantallaActual: string;
  nombreUsuario: string;
  cargoUsuario: string;
  rolUsuario: RolUsuario;
  centroClave?: string | null;
  urlImagenPerfil?: string;

  setTituloPantalla: (titulo: string) => void;
  setUsuarioSesion: (nombre: string, rol: string, centroClave?: string | null, avatarUrl?: string) => void;
  actualizarCentroUsuario: (centroClave: string) => void;
  sincronizarUsuarioSesion: (params?: SincronizarUsuarioParams) => void;
}

// Inicialización dinámica vinculada directamente a la sesión activa en MOCK_SESSION
const sesionInicial: UsuarioSesion = authService.obtenerUsuarioSesion(MOCK_SESSION.role);

export const useLayoutStore = create<LayoutState>((set, get) => ({
  tituloPantallaActual: 'Plan Operativo Anual 2026',
  nombreUsuario: sesionInicial.nombre_completo,
  cargoUsuario: formatearCargoUsuario(sesionInicial.rol, sesionInicial.centro_clave),
  rolUsuario: sesionInicial.rol,
  centroClave: sesionInicial.centro_clave,
  urlImagenPerfil: sesionInicial.avatar_url,

  setTituloPantalla: (titulo: string) => set({ tituloPantallaActual: titulo }),

  setUsuarioSesion: (nombre, rol, centroClave, avatarUrl) => {
    const rolNormalizado = normalizarRolUsuario(rol);
    if (!rolNormalizado) {
      throw new Error(`Rol de usuario no reconocido: ${rol}`);
    }

    const cargoFinal = formatearCargoUsuario(rolNormalizado, centroClave);

    set({
      nombreUsuario: nombre,
      cargoUsuario: cargoFinal,
      rolUsuario: rolNormalizado,
      centroClave: centroClave ?? null,
      urlImagenPerfil: avatarUrl,
    });
  },

  actualizarCentroUsuario: (nuevoCentroClave: string) => {
    const { rolUsuario } = get();
    const cargoFinal = formatearCargoUsuario(rolUsuario, nuevoCentroClave);

    set({
      centroClave: nuevoCentroClave,
      cargoUsuario: cargoFinal,
    });
  },

  sincronizarUsuarioSesion: (params) => {
    const rolDeterminado = params?.rol
      ? normalizarRolUsuario(params.rol) || MOCK_SESSION.role
      : MOCK_SESSION.role;

    const sesionBase = authService.obtenerUsuarioSesion(rolDeterminado);

    const nombreFinal = params?.nombre || sesionBase.nombre_completo;
    const centroFinal =
      params?.centroClave !== undefined ? params.centroClave : sesionBase.centro_clave;
    const avatarFinal = params?.avatarUrl || sesionBase.avatar_url;

    const cargoFinal = formatearCargoUsuario(rolDeterminado, centroFinal);

    set({
      nombreUsuario: nombreFinal,
      cargoUsuario: cargoFinal,
      rolUsuario: rolDeterminado,
      centroClave: centroFinal,
      urlImagenPerfil: avatarFinal,
    });
  },
}));
