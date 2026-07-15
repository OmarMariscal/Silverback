// types/layout-contratos.ts

export interface NotificacionItem {
  id: string;
  mensaje: string;
  leido: boolean;
}

export interface MensajeItem {
  id: string;
  asunto: string;
  remitente: string;
}

export interface CabeceraGeneralGlobalProps {
  // --- LADO IZQUIERDO ---
  tituloPantallaActual: string; // Dinámico. Ej: "Plan Operativo Anual 2026" o "Dashboard"
  
  // --- LADO DERECHO (Datos de Sesión Crudos de Zustand) ---
  nombreUsuario: string;     // Ej: "Mtro. Braulio Vicente"
  cargoUsuario: string;      // Ej: "Contralor de Centro - CUCEI" (Tú lo armas juntando rol + centro)
  urlImagenPerfil?: string;  // String con la ruta de la foto, si no hay, Rogelio pone un avatar gris
  
  // --- CONTADORES PARA LOS ÍCONOS ---
  numeroMensajesSinLeer: number;      // Pinta el circulito rojo sobre la bandeja de mensajes
  numeroNotificacionesSinLeer: number; // Pinta el circulito rojo sobre las notificaciones
  
  // --- ACCIONES ---
  onAbrirBandejaMensajes: () => void;
  onAbrirBandejaNotificaciones: () => void;
  onClicPerfil: () => void; // Por si despliega un menú de "Cerrar Sesión"
}