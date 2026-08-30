// frontend/src/services/api.ts
// Este archivo contiene la configuración de Axios para comunicarse con el backend de Emiliano. Define la baseURL, los headers por defecto y los interceptores para manejar tokens de autenticación y errores de respuesta.
// En palabras sencillas: Este archivo es como un "centro de control" para todas las llamadas HTTP que hagamos al backend. Configura cómo se hacen las peticiones y qué hacer si algo sale mal, como cuando el token de sesión expira.

import axios, { InternalAxiosRequestConfig } from 'axios';

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
    
    if (config.headers) {
      // Si llegas a tener un token real, lo enviará
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; 
      }
      
      // ✅ INYECCIÓN DE CABECERAS MOCK PARA DESARROLLO
      // Puedes cambiar 'CONTRALOR' y el ID por los valores exactos que espere Emiliano
      // HARDCODE
      config.headers['x-mock-role'] = 'CONTRALOR'; 
      config.headers['x-mock-user-id'] = '1c31aebe-b941-4961-94c0-35806b595da0'; 
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
      }
    }
    // Propagamos el error para que el catch de tu servicio sepa que algo falló
    return Promise.reject(error);
  }
);