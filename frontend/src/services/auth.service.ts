// frontend/src/services/auth.service.ts
// Este archivo gestiona la sesión y datos del usuario activo en el frontend.
//
// ⚠️ IMPORTANTE PARA EL EQUIPO:
// 1. Actualmente NO se obliga a pasar por ninguna pantalla de login ni se bloquea el acceso.
// 2. El sistema toma el Rol, ID y datos del usuario directamente de lo que esté configurado
//    en `MOCK_SESSION` (o JWT) en `services/api.ts`, o de la ruta por la que navegue el usuario.
// 3. Si en el futuro se proporciona un JWT hardcodeado en `api.ts` o en localStorage,
//    este servicio lo decodifica automáticamente para extraer su rol y datos reales.
// 4. La función `iniciarSesion()` está preparada y documentada abajo para cuando se implemente
//    el formulario de inicio de sesión definitivo en frontend y backend.

import { api, obtenerRolActivo } from './api';
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
 * Se utilizan de inmediato según el rol activo configurado en `api.ts`, sin requerir login.
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
 * Permite leer datos reales si se hardcodea o inyecta un JWT en `localStorage` o `api.ts`.
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
   * Obtiene la sesión del usuario actual sin forzar ningún login.
   *
   * Orden de resolución:
   * 1. Si existe un JWT en localStorage, intenta decodificar su payload (rol, usuario_id, centro_id).
   * 2. Si existe un objeto `usuario_sesion` en localStorage, lo utiliza.
   * 3. Fallback de desarrollo: resuelve el usuario de `USUARIOS_MOCK_POR_DEFECTO` correspondiente
   *    al rol activo de `api.ts` (JEFA -> Dra. Titular, CONTRALOR -> Mtro. Braulio, etc.).
   */
  obtenerUsuarioSesion: (rolSugerido?: RolUsuario): UsuarioSesion => {
    if (typeof window !== 'undefined') {
      // Intento 1: Decodificar JWT si existe en localStorage
      try {
        const token = localStorage.getItem(CLAVE_STORAGE_TOKEN);
        if (token) {
          const payload = decodificarJwtPayload(token);
          if (payload) {
            const rolJwt = normalizarRolUsuario(String(payload.rol || payload.role || ''));
            if (rolJwt && (!rolSugerido || rolSugerido === rolJwt)) {
              const base = USUARIOS_MOCK_POR_DEFECTO[rolJwt];
              return {
                id: String(payload.usuario_id || payload.sub || base.id),
                nombre_completo: String(payload.nombre_completo || payload.name || base.nombre_completo),
                rol: rolJwt,
                centro_id: (payload.centro_id as string) || base.centro_id,
                centro_clave: (payload.centro_clave as string) || base.centro_clave,
                perfil_id: (payload.perfil_id as string) || undefined,
              };
            }
          }
        }
      } catch (e) {
        console.warn('No se pudo decodificar JWT de localStorage:', e);
      }

      // Intento 2: Sesión en formato JSON en localStorage
      try {
        const guardado = localStorage.getItem(CLAVE_STORAGE_USUARIO);
        if (guardado) {
          const parsed = JSON.parse(guardado) as UsuarioSesion;
          const rolNormalizado = normalizarRolUsuario(parsed.rol);
          if (rolNormalizado) {
            if (!rolSugerido || rolSugerido === rolNormalizado) {
              return {
                ...parsed,
                rol: rolNormalizado,
              };
            }
          }
        }
      } catch (e) {
        console.warn('No se pudo parsear usuario_sesion de localStorage:', e);
      }
    }

    // Intento 3: Fallback seguro de desarrollo según `obtenerRolActivo()` de `api.ts`
    const rolDeterminado = rolSugerido || obtenerRolActivo();
    const mock = USUARIOS_MOCK_POR_DEFECTO[rolDeterminado] || USUARIOS_MOCK_POR_DEFECTO.JEFA;

    const idActivo = typeof window !== 'undefined' ? localStorage.getItem('mock_user_id') : null;
    return {
      ...mock,
      id: idActivo || mock.id,
    };
  },

  /**
   * Guarda o actualiza los datos del usuario en localStorage y sincroniza variables mock.
   */
  guardarUsuarioSesion: (usuario: UsuarioSesion): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(CLAVE_STORAGE_USUARIO, JSON.stringify(usuario));
      localStorage.setItem('mock_role', usuario.rol);
      localStorage.setItem('mock_user_id', usuario.id);
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