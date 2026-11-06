// frontend/src/services/auth.service.ts
// Este archivo gestiona la sesión y datos del usuario activo en el frontend.
//
// ⚠️ IMPORTANTE PARA EL EQUIPO:
// 1. Actualmente NO se obliga a pasar por ninguna pantalla de login ni se bloquea el acceso.
// 2. El sistema toma el Rol, ID y datos del usuario directamente de lo que esté configurado
//    en `MOCK_SESSION` en `services/api.ts`. Al cambiar `MOCK_SESSION` y guardar, el cambio
//    se refleja de inmediato en toda la aplicación.
// 3. La función `iniciarSesion()` está preparada y documentada abajo para cuando se implemente
//    el formulario de inicio de sesión definitivo en frontend y backend.

import { api, MOCK_SESSION, obtenerRolActivo, obtenerUsuarioIdActivo } from './api';
import { normalizarRolUsuario, type RolUsuario } from '@/types/roles';

export interface UsuarioSesion {
  id: string;
  nombre_completo: string;
  rol: RolUsuario;
  centro_id?: string | null;
  centro_clave?: string | null;
  perfil_id?: string;
  avatar_url?: string;
}

export interface AuthLoginRequestDto {
  correo: string;
  password: string;
}

export interface AuthLoginResponseDto {
  access_token: string;
  usuario: {
    id: string;
    nombre_completo: string;
    rol: string;
    centro_id?: string | null;
    perfil_id: string;
  };
}

/**
 * Catálogo de usuarios por defecto para desarrollo (coincidentes con seed.ts y jwt.guard.ts del backend)
 * Se utilizan de inmediato según el rol activo configurado en `MOCK_SESSION` de `api.ts`.
 */
export const USUARIOS_MOCK_POR_DEFECTO: Record<RolUsuario, UsuarioSesion> = {
  JEFA: {
    id: '11111111-1111-4111-8111-111111111111',
    nombre_completo: 'Dra. Titular de la Contraloría',
    rol: 'JEFA',
    centro_id: null,
    centro_clave: null,
  },
  CONTRALOR: {
    id: 'a8f99f0d-c949-4feb-b849-44a5305e2f45',
    nombre_completo: 'Mtro. Braulio Vicente',
    rol: 'CONTRALOR',
    centro_id: 'uuid-centro-cucei',
    centro_clave: 'CUCEI',
  },
  AUDITOR: {
    id: '22222222-2222-4222-8222-222222222222',
    nombre_completo: 'Lic. Auditor Auxiliar',
    rol: 'AUDITOR',
    centro_id: 'uuid-centro-cucei',
    centro_clave: 'CUCEI',
  },
  ADMIN: {
    id: '00000000-0000-4000-8000-000000000000',
    nombre_completo: 'Administrador del Sistema',
    rol: 'ADMIN',
    centro_id: null,
    centro_clave: null,
  },
  CONTRALOR_GENERAL: {
    id: 'mock-user-contralor-general',
    nombre_completo: 'Titular de la Contraloría General',
    rol: 'CONTRALOR_GENERAL',
    centro_id: null,
    centro_clave: null,
  },
};

const CLAVE_STORAGE_USUARIO = 'usuario_sesion';
const CLAVE_STORAGE_TOKEN = 'jwt_token';

/**
 * Decodifica el payload de un token JWT en base64 sin dependencias externas.
 * Permite leer datos reales si se inyecta un JWT en `localStorage`.
 */
function decodificarJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const partes = token.split('.');
    if (partes.length < 2) return null;
    const base64 = partes[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export const authService = {
  /**
   * Obtiene la sesión del usuario actual.
   *
   * En desarrollo: Toma directamente `MOCK_SESSION.role` o el rol solicitado.
   * En producción (con login): Lee el token JWT / sesión de localStorage.
   */
  obtenerUsuarioSesion: (rolSugerido?: RolUsuario): UsuarioSesion => {
    // Si no se pide un rol explícito, el rol base es el configurado en MOCK_SESSION
    const rolDeterminado = rolSugerido || obtenerRolActivo() || MOCK_SESSION.role;
    const mock = USUARIOS_MOCK_POR_DEFECTO[rolDeterminado] || USUARIOS_MOCK_POR_DEFECTO.CONTRALOR;

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(CLAVE_STORAGE_TOKEN);
      // Solo si existe un token real de login procesamos la sesión guardada
      if (token) {
        try {
          const payload = decodificarJwtPayload(token);
          if (payload) {
            const rolJwt = normalizarRolUsuario(String(payload.rol || payload.role || ''));
            if (rolJwt && (!rolSugerido || rolSugerido === rolJwt)) {
              return {
                id: String(payload.usuario_id || payload.sub || mock.id),
                nombre_completo: String(payload.nombre_completo || payload.name || mock.nombre_completo),
                rol: rolJwt,
                centro_id: (payload.centro_id as string) || mock.centro_id,
                centro_clave: (payload.centro_clave as string) || mock.centro_clave,
                perfil_id: (payload.perfil_id as string) || undefined,
              };
            }
          }

          const guardado = localStorage.getItem(CLAVE_STORAGE_USUARIO);
          if (guardado) {
            const parsed = JSON.parse(guardado) as UsuarioSesion;
            const rolNormalizado = normalizarRolUsuario(parsed.rol);
            if (rolNormalizado && (!rolSugerido || rolSugerido === rolNormalizado)) {
              return { ...parsed, rol: rolNormalizado };
            }
          }
        } catch (e) {
          console.warn('No se pudo resolver la sesión almacenada:', e);
        }
      }
    }

    return {
      ...mock,
      id: obtenerUsuarioIdActivo() || mock.id,
    };
  },

  /**
   * Guarda o actualiza los datos del usuario en localStorage solo cuando sea relevante.
   */
  guardarUsuarioSesion: (usuario: UsuarioSesion): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(CLAVE_STORAGE_USUARIO, JSON.stringify(usuario));
      if (usuario.centro_clave) {
        localStorage.setItem('mock_centro', usuario.centro_clave);
      }
    } catch (e) {
      console.error('Error al guardar sesión en localStorage:', e);
    }
  },

  // ======================================================================================
  // 🚀 FLUJO FUTURO DE LOGIN (Para cuando se implemente la pantalla de inicio de sesión)
  //
  // Actualmente NO se invoca de manera automática en ninguna pantalla.
  // Cuando Emiliano y Rogelio terminen la pantalla de login:
  // 1. El componente `LoginPage` llamará a: `await authService.iniciarSesion({ correo, password })`
  // 2. Este método guardará el token y el usuario devueltos por el backend en localStorage.
  // 3. El Layout mostrará automáticamente al usuario que inició sesión.
  // ======================================================================================
  iniciarSesion: async (credenciales: AuthLoginRequestDto): Promise<UsuarioSesion> => {
    const respuesta = await api.post<AuthLoginResponseDto>('/auth/login', credenciales);
    const { access_token, usuario } = respuesta.data;

    if (typeof window !== 'undefined') {
      localStorage.setItem(CLAVE_STORAGE_TOKEN, access_token);
    }

    const rolNormalizado = normalizarRolUsuario(usuario.rol) || 'CONTRALOR';
    const nuevaSesion: UsuarioSesion = {
      id: usuario.id,
      nombre_completo: usuario.nombre_completo,
      rol: rolNormalizado,
      centro_id: usuario.centro_id,
      perfil_id: usuario.perfil_id,
    };

    authService.guardarUsuarioSesion(nuevaSesion);
    return nuevaSesion;
  },

  /**
   * Cierra la sesión activa y limpia localStorage.
   */
  cerrarSesion: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CLAVE_STORAGE_TOKEN);
    localStorage.removeItem(CLAVE_STORAGE_USUARIO);
    localStorage.removeItem('mock_role');
    localStorage.removeItem('mock_user_id');
    localStorage.removeItem('mock_centro');
  },
};