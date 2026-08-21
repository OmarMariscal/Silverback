// types/layout-contratos.ts
// La forma en que Rogelio y yo nos vamos a comunicar para pasarle datos a los componentes de Layout y recibir de vuelta los cambios que el usuario hizo en cada apartado.
// En palabras sencillas: Este archivo es como un "contrato" entre la UI y el resto de la app. Define qué datos se esperan, cómo se llaman y qué funciones se pueden invocar. Así, cuando Rogelio construye los componentes, sabe exactamente qué información necesita y cómo enviarla de vuelta al store o a los servicios.

export interface NotificacionItem {
  id: string;
  mensaje: string;
  leido: boolean;
}

export interface MensajeItem {
  id: string;
  asunto: string;
  remitente: string;
  leido: boolean;
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
