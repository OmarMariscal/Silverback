// types/poa-contratos.ts
// La forma en que Rogelio y yo nos vamos a comunicar para pasarle datos a los componentes del POA y recibir de vuelta los cambios que el usuario hizo en cada apartado.
// En palabras sencillas: Este archivo es como un "contrato" entre la UI y el resto de la app. Define qué datos se esperan, cómo se llaman y qué funciones se pueden invocar. Así, cuando Rogelio construye los componentes, sabe exactamente qué información necesita y cómo enviarla de vuelta al store o a los servicios.

export type EstadoPOA = "SIN_ENVIAR" | "BORRADOR" | "EN_REVISION" | "DEVUELTA" | "ACEPTADA";

export interface CabeceraPOAProps {
  // --- Datos Visuales ---
  anioFiscal: string; // Ej: "2026"
  estadoActual: EstadoPOA; 
  mensajeDevolucion?: string; // Si está DEVUELTA, mostrar por qué
  
  // --- Banderas Lógicas (Tú las calculas basado en el estado) ---
  puedeEditar: boolean; // true si es SIN_ENVIAR o DEVUELTA. Rogelio usará esto para ocultar botones.
  estaCargando: boolean; // Para que Rogelio ponga un spinner en el botón al enviar
  
  // --- Eventos (Lo que dispara Rogelio al hacer clic) ---
  onEnviarRevision: () => void; // Llama a POST poas/poaid/presentar
  onCancelarEnvio: () => void;  // Llama a POST poas/poaid/cancelar-envio
}

// Estructura para listar a los auditores en la tarjeta expandida
export interface EquipoAuditorItem {
  nombreCompleto: string;
  cargoVisible: string; // Ej: "Auditor Sr." o "Auxiliar"
}

// Estructura de los detalles que vienen del endpoint 'getactividadfichatecnica'
export interface FichaTecnicaExpandida {
  justificacion: string;
  objetivoGeneral: string;
  objetivosParticulares: string;
  metaProyecto: string;
  indicadores: string;
  equipoAuditor: EquipoAuditorItem[];
}

export interface SubactividadFilaProps {
  id: string; // UUID
  folioSecuencial: string; // Ej: "1.1", "1.2"
  descripcion: string;
  fechaInicioFormateada: string; // Ej: "01 Ene 26"
  fechaTerminoFormateada: string; // Ej: "20 Mar 26"
  semanasTotales: number;
}

export interface TarjetaActividadPOAProps {
  // --- Datos de la Actividad General ---
  idActividad: string; // UUID
  titulo: string;
  participacionGlobalVisible: string; // Ej: "100% Contralor"
  esRezagada: boolean; // Se lee esto del backend para que Rogelio pinte el icono rojo de fantasma
  
  // --- Fechas del Padre (que pediste al backend) ---
  fechaInicioPadre?: string;
  fechaTerminoPadre?: string;
  auditoresResumen?: string[];
  
  // --- Los detalles técnicos (Vienen de getactividadfichatecnica) ---
  fichaTecnica?: FichaTecnicaExpandida; // Es undefined hasta que se expande
  
  // --- Subactividades (El endpoint NUEVO) ---
  subactividades: SubactividadFilaProps[]; 
  // --- Estado UI ---
  // Cambiamos el nombre para que Rogelio sepa que este spinner 
  // espera a que lleguen TANTO las subactividades COMO la ficha técnica
  estaCargandoDetalles: boolean;
  
  // --- Permisos de UI ---
  ocultarBotonBorrar: boolean; // Habilitado solo si el POA está SIN_ENVIAR
  
  // --- Eventos ---
  onBorrarActividad: () => void; // Llama a DELETE actividades/id
  onConfigurarFichaTecnica: () => void; // Abre el modal/pantalla de Ficha Técnica
  // --- Gatillo de carga diferida (Lazy loading) ---
  onExpandirTarjeta: () => void; // Aquí se llama al -NUEVO- endpoint
}

export interface BancoActividadItemProps {
  idActividadBanco: string; // UUID
  titulo: string;
  descripcionCorta: string;
  
  // --- Eventos ---
  onSeleccionar: () => void; // Se llama a GET banco-actividades-id para llenar la ficha técnica
}

export interface ModalBancoActividadesProps {
  actividadesDisponibles: BancoActividadItemProps[];
  onCrearPersonalizada: () => void; // Clic en "Crear desde cero". Tú abres la Ficha Técnica vacía
}

// Para llenar el Dropdown de auditores
export interface OpcionAuditorProps {
  id: string; // UUID
  nombreCompleto: string; // Se une el nombre y los apellidos de la API
  cargoVisible: string; // Ej: "Auditor Sr."
}

// Datos puros del formulario (Lo que escriben en los inputs)
export interface DatosFormularioFicha {
  titulo: string;               // (Requerido por Swagger)
  justificacion: string;
  objetivoGeneral: string;
  objetivosParticulares: string; // (Requerido por Swagger)
  metaProyecto: string;
  indicadores: string;
  auditoresSeleccionadosIds: string[]; 
}

export interface FormularioFichaTecnicaProps {
  // --- Datos Iniciales ---
  valoresIniciales?: DatosFormularioFicha; // Si seleccionó del banco o está editando, se lo pasas lleno. Si es personalizada, se lo pasas undefined.
  listaAuditoresDisponibles: OpcionAuditorProps[]; // Las opciones del <select>
  
  // --- Estado UI ---
  estaGuardando: boolean; // Para bloquear el botón mientras haces el POST
  
  // --- Eventos ---
  // Cuando Rogelio valide que el formulario está lleno, avisa y pasa el objeto con los textos:
  onContinuarASubactividades: (datosIngresados: DatosFormularioFicha) => void; 
  onCancelar: () => void; // Volver al POA
}

// types/poa-contratos.ts

export type TipoActividadAPI = "AUDITORIA" | "REVISION";

// 1. La estructura de una fila en la tabla de Rogelio (Lo que el usuario edita)
export interface SubactividadFilaForm {
  idUiTemporal: string; 
  idBackend?: string; 
  descripcionTarea: string; 
  fechaInicio: string; 
  fechaTermino: string; 
  tipo: TipoActividadAPI; 
}

// 2. La estructura de lo que devuelve el catálogo de sugerencias
export interface SubactividadSugerida {
  idSugerencia: string; // El UUID que venga del catálogo
  descripcion: string;
  tipoSugerido: TipoActividadAPI;
  // Nota: Las sugerencias del banco no suelen tener fechas exactas, 
  // esas las tiene que llenar el usuario en la tabla.
}

// 3. El contrato principal del componente/pantalla
export interface PantallaSubactividadesProps {
  tituloActividadPadre: string; 
  
  // --- LO QUE YA ESTÁ EN LA TABLA ---
  subactividadesIniciales: SubactividadFilaForm[];
  
  // --- LAS OPCIONES DEL BANCO ---
  // Es opcional (?) porque tu archivo endpoints.txt dice que si es una 
  // "actividad personalizada" NO mandas a llamar a este endpoint.
  sugerenciasBanco?: SubactividadSugerida[]; 
  
  estaGuardando: boolean; 
  
  onGuardarSincronizacion: (todasLasFilas: SubactividadFilaForm[]) => void; 
  onRegresarAFicha: () => void; 
}