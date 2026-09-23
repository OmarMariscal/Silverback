// frontend/src/services/api.ts
// Este archivo contiene la configuración de Axios para comunicarse con el backend de Emiliano. Define la baseURL, los headers por defecto y los interceptores para manejar tokens de autenticación y errores de respuesta.
// En palabras sencillas: Este archivo es como un "centro de control" para todas las llamadas HTTP que hagamos al backend. Configura cómo se hacen las peticiones y qué hacer si algo sale mal, como cuando el token de sesión expira.

import axios, { InternalAxiosRequestConfig } from 'axios';
import type { RolUsuario } from '@/types/roles';

// Sesión única del mock de desarrollo. Cambiar aquí el rol y el usuario
// mantiene sincronizados los headers y la visualización del frontend.
export const MOCK_SESSION: { role: RolUsuario; userId: string } = {
  role: 'CONTRALOR',
  userId: 'a8f99f0d-c949-4feb-b849-44a5305e2f45',
};

export const obtenerRolActivo = (): RolUsuario => {
  if (typeof window !== 'undefined') {
    const rolGuardado = localStorage.getItem('mock_role');
    if (rolGuardado === 'JEFA' || rolGuardado === 'CONTRALOR' || rolGuardado === 'AUDITOR') {
      return rolGuardado;
    }
  }
  return MOCK_SESSION.role;
};

export const obtenerUsuarioIdActivo = (): string => {
  if (typeof window !== 'undefined') {
    const idGuardado = localStorage.getItem('mock_user_id');
    if (idGuardado) return idGuardado;
  }
  return MOCK_SESSION.userId;
};

// Creamos una instancia base apuntando al servidor de Emiliano
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// El INTERCEPTOR: Se ejecuta automáticamente ANTES de cada petición que hagas
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
    const rolActual = obtenerRolActivo();
    const usuarioIdActual = obtenerUsuarioIdActivo();

    if (config.headers) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers['x-mock-role'] = rolActual;
      config.headers['x-mock-user-id'] = usuarioIdActual;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response, // Si la respuesta fue exitosa (200, 201), déjala pasar
  (error) => {
    // Si el servidor de Emiliano nos responde con 401, significa que el token expiró o es falso
    if (error.response && error.response.status === 401) {
      console.log("¡El token caducó! Limpiando sesión...");
      localStorage.removeItem('jwt_token'); // Limpiamos la basura
      // Forzamos al navegador a recargarse en la pantalla de Login
      if (typeof window !== 'undefined') {
        //window.location.href = '/login'; 
        // Nota: Comentado para evitar recarga automática durante desarrollo. Puedes descomentar en producción.
      }
    }
    // Propagamos el error para que el catch de tu servicio sepa que algo falló
    return Promise.reject(error);
  }
);