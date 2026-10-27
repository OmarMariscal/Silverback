// types/poa-contratos.ts
// La forma en que Rogelio y yo nos vamos a comunicar para pasarle datos a los componentes del POA y recibir de vuelta los cambios que el usuario hizo en cada apartado.
// En palabras sencillas: Este archivo es como un "contrato" entre la UI y el resto de la app. Define qué datos se esperan, cómo se llaman y qué funciones se pueden invocar. Así, cuando Rogelio construye los componentes, sabe exactamente qué información necesita y cómo enviarla de vuelta al store o a los servicios.

export type EstadoPOA = "BORRADOR" | "EN_REVISION" | "DEVUELTA" | "AUTORIZADA";

export interface CabeceraPOAData {
  // --- Datos Visuales ---
  anioFiscal: string; // Ej: "2026"
  estadoActual: EstadoPOA; 
  estadoEtiqueta: string;
  mensajeDevolucion?: string; // Si está DEVUELTA, mostrar por qué
  
  // --- Banderas Lógicas (Tú las calculas basado en el estado) ---
  puedeEditar: boolean; // true si es BORRADOR o DEVUELTA. Rogelio usará esto para ocultar botones.
  estaCargando: boolean; // Para que Rogelio ponga un spinner en el botón al enviar
  
}

// Estructura para listar a los auditores en la tarjeta expandida
export interface EquipoAuditorItem {
  id: string;
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
  participacionGlobal: number;
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
  puedeEditar: boolean;
  ocultarBotonBorrar: boolean; // Habilitado solo si el POA está editable
  
  // --- Eventos ---
  onBorrarActividad: () => void; // Llama a DELETE actividades/id
  onConfigurarFichaTecnica: () => void; // Abre el modal/pantalla de Ficha Técnica
  // --- Gatillo de carga diferida (Lazy loading) ---
  onExpandirTarjeta: () => void; // Aquí se llama al -NUEVO- endpoint
}

export type TarjetaActividadPOAData = Omit<
  TarjetaActividadPOAProps,
  'puedeEditar' | 'onBorrarActividad' | 'onConfigurarFichaTecnica' | 'onExpandirTarjeta'
>;

export interface BancoActividadItemProps {
  idActividadBanco: string; // UUID
  titulo: string;
  descripcionCorta: string;
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
  onContinuarASubactividades: (datosIngresados: DatosFormularioFicha) => void | Promise<void>;
  onGuardar?: (datosIngresados: DatosFormularioFicha) => void | Promise<void>;
  onCancelar: () => void; // Volver al POA
}

// types/poa-contratos.ts

export type TipoActividadAPI = "AUDITORIA" | "REVISION";

// 1. La estructura de una fila en la tabla de Rogelio (Lo que el usuario edita)
export interface SubactividadFilaForm {
  idUiTemporal: string; 
  idBackend?: string; 
  idBancoSugerencia?: string;
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
  // Es opcional (?) porque si es una 
  // "actividad personalizada" NO mandas a llamar a este endpoint.
  sugerenciasBanco?: SubactividadSugerida[]; 
  
  estaGuardando: boolean; 
  
  onGuardarSincronizacion: (todasLasFilas: SubactividadFilaForm[]) => void; 
  onRegresarAFicha: () => void; 
}

// ========================================================
// SUPERVISIÓN Y DICTAMEN DE POAs (ROL: JEFA) - CONTRATOS UI
// ========================================================

export type FiltroEstadoPoaJefa =
  | 'TODOS'
  | 'POR_AUTORIZAR'
  | 'DEVUELTAS'
  | 'AUTORIZADAS';

export type ModoVisualizacionSupervision = 'INCRUSTADA' | 'PANTALLA_COMPLETA';

// KPIs de la barra superior
export interface KpisSupervisionPoasUI {
  totalCentros: number;
  porAutorizar: number;
  devueltas: number;
  autorizadas: number;
}

// Resumen del POA asociado a una tarjeta de Centro Universitario
export interface PoaResumenCentroUI {
  idPoa: string;
  anioFiscal: number;
  estado: EstadoPOA;
  estadoEtiqueta: string;
  estadoBadgeColor: 'purple' | 'amber' | 'emerald' | 'slate';
  fechaTexto: string;
  etiquetaFecha: string; // Ej: "Recibido para dictamen:", "Devuelto el:", "Autorizado el:"
  porcentajeAvanceGlobal: number | null; // e.g. 68 para 68%, o null
}

// Props para cada Tarjeta de Centro en la cuadrícula comprimida / slider
export interface TarjetaCentroPoaProps {
  idCentro: string;
  clave: string; // Ej: "CUCEI"
  nombre: string; // Ej: "Ciencias Exactas e Ingenierías"
  contralorNombre: string; // Ej: "Mtro. Braulio Vicente"
  contralorEstatus: string; // Ej: "Activo"
  aniosHistoricos: number[]; // Ej: [2026, 2025, 2024]
  anioSeleccionado: number;
  poaResumen: PoaResumenCentroUI;
  estaSeleccionado: boolean; // True si es el centro actualmente en inspección
  onSeleccionarCentro: (idCentro: string) => void;
  onCambiarAnio: (idCentro: string, anio: number) => void;
}

// Fila de Actividad del Acordeón en el Inspector de POA
export interface ActividadSupervisionPoaProps {
  idActividad: string;
  folio: string; // Ej: "05", "06"
  titulo: string;
  fechaInicioFormateada: string; // Ej: "Ene 2026"
  fechaTerminoFormateada: string; // Ej: "Dic 2026"
  rangoFechasTexto: string; // Ej: "Ene 2026 — Dic 2026"
  porcentajeAvance: number; // Ej: 50
  auditores: string[]; // Ej: ["Lic. Auditor Auxiliar"]

  // Lazy loading y acordeón
  estaExpandida: boolean;
  estaCargandoDetalles: boolean;
  fichaTecnica?: FichaTecnicaExpandida;
  subactividades?: SubactividadFilaProps[];

  onToggleExpandir: () => void;
}

// Barra flotante inferior de acciones de dictamen
export interface BarraDictamenPoaProps {
  centroClave: string; // Ej: "CUCEI"
  anioFiscal: number; // Ej: 2026
  estadoPoa: EstadoPOA;
  puedeDictaminar: boolean; // True si está en revisión o devuelta
  estaDictaminando: boolean; // Spinner mientras se ejecuta autorizar o devolver
  onAbrirModalDevolver: () => void;
  onAutorizarPoa: () => void | Promise<void>;
}

// Modal pop-up para devolver POA con observaciones
export interface ModalDevolverPoaProps {
  estaAbierto: boolean;
  centroClave: string; // Ej: "CUCEI"
  centroNombre: string;
  anioFiscal: number; // Ej: 2026
  contralorNombre: string;
  observaciones: string;
  errorValidacion?: string | null;
  estaEnviando: boolean;
  onChangeObservaciones: (texto: string) => void;
  onCerrar: () => void;
  onConfirmarDevolucion: () => void | Promise<void>;
}

// Inspector de POA (sección profunda de revisión de actividades y ficha técnica)
export interface InspectorPoaSupervisionProps {
  idCentro: string;
  centroClave: string;
  centroNombre: string;
  contralorNombre: string;
  idPoa: string;
  anioFiscal: number;
  estadoPoa: EstadoPOA;
  estadoEtiqueta: string;
  mensajeResolucion?: string | null;
  totalActividades: number;

  actividades: ActividadSupervisionPoaProps[];

  // Modo de visualización (incrustada vs pantalla completa)
  modoVisualizacion: ModoVisualizacionSupervision;
  onCambiarModoVisualizacion?: (modo: ModoVisualizacionSupervision) => void;
  onAlternarModoVisualizacion?: () => void;
  onCerrarInspector?: () => void;

  barraDictamen: BarraDictamenPoaProps;
  modalDevolver: ModalDevolverPoaProps;

  estaCargandoPoa: boolean;
  mensajeError?: string | null;
}

// Props para la pantalla completa / layout de pestaña de inspección de POA
export interface PantallaCompletaPoaSupervisionProps {
  inspectorProps: InspectorPoaSupervisionProps;
  onRegresarACuadricula: () => void;
}

// ViewModel general que orquesta toda la pantalla de Supervisión de POAs
export interface SupervisionPoasViewModel {
  kpis: KpisSupervisionPoasUI;
  filtroEstadoActivo: FiltroEstadoPoaJefa;
  busquedaTexto: string;
  anioGlobalSeleccionado: number;
  aniosDisponibles: number[];

  centros: TarjetaCentroPoaProps[];
  idCentroSeleccionado: string | null;

  poaSeleccionada: InspectorPoaSupervisionProps | null;
  modoVisualizacion: ModoVisualizacionSupervision;

  estaCargandoCentros: boolean;
  mensajeError: string | null;

  onCambiarFiltroEstado: (filtro: FiltroEstadoPoaJefa) => void;
  onCambiarBusqueda: (busqueda: string) => void;
  onCambiarAnioGlobal: (anio: number) => void;
  onSeleccionarCentro: (idCentro: string) => void;
  onAlternarModoVisualizacion: () => void;
}
