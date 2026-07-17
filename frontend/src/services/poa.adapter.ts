// frontend/src/services/poa.adapter.ts
// IMPORTACIÓN DE PROPS
import { CabeceraPOAProps, TarjetaActividadPOAProps, SubactividadFilaProps, FichaTecnicaExpandida, OpcionAuditorProps } from '../types/poa-contratos';
// IMPORTACIÓN DE DTOS
import * as PoaApi from '../types/poa-api'; 

/**
 * TRADUCTOR 1: Para la Pantalla Principal del POA
 * Toma el JSON del POA actual de la API y lo separa en la Cabecera y las Tarjetas.
 */
export const adaptarPoaActual = (
  datosAPI: PoaApi.PoaActualDto
): { cabecera: CabeceraPOAProps, actividades: TarjetaActividadPOAProps[] } => {
  
  // A. Mapeamos la Cabecera coincidiendo con la interfaz de UI
  const cabeceraAdaptada: CabeceraPOAProps = {
    anioFiscal: datosAPI.anio_fiscal.toString(),
    estadoActual: datosAPI.estado as any, // Cast al tipo EstadoPOA
    puedeEditar: datosAPI.estado === "SIN_ENVIAR" || datosAPI.estado === "BORRADOR" || datosAPI.estado === "DEVUELTA",
    estaCargando: false,
    onEnviarRevision: () => {}, // Se inyectarán en la capa de Zustand
    onCancelarEnvio: () => {},
  };

  // B. Mapeamos el arreglo de Actividades para las Tarjetas
  const actividadesAdaptadas: TarjetaActividadPOAProps[] = datosAPI.actividades_resumen.map((act) => ({
    idActividad: act.id,
    titulo: act.titulo,
    participacionGlobalVisible: `${act.participacion_global}%`,
    esRezagada: datosAPI.es_rezagado, 
    
    // Inicialización para Lazy Loading (Carga Diferida)
    subactividades: [],
    estaCargandoDetalles: false,
    ocultarBotonBorrar: datosAPI.estado === "EN_REVISION" || datosAPI.estado === "ACEPTADA",
    
    onBorrarActividad: () => {},
    onConfigurarFichaTecnica: () => {},
    onExpandirTarjeta: () => {}
  }));

  return { cabecera: cabeceraAdaptada, actividades: actividadesAdaptadas };
};

/**
 * TRADUCTOR 2: Para las Subactividades (Lazy Loading)
 * Toma el array de subactividades crudas y lo aplana para la tabla de Rogelio.
 */
export const adaptarSubactividadesUI = (
  datosAPI: PoaApi.SubActividadesPoaData[]
): SubactividadFilaProps[] => {
  return datosAPI.map((sub) => ({
    id: sub.id,
    folioSecuencial: sub.folio,
    descripcion: sub.descripcion,
    // Sacamos los datos del objeto anidado 'fechas' del backend
    fechaInicioFormateada: sub.fechas.fecha_inicio,
    fechaTerminoFormateada: sub.fechas.fecha_termino,
    semanasTotales: sub.fechas.semanas
  }));
};

/**
 * TRADUCTOR 3: Para la Ficha Técnica Expandida
 * Convierte el detalle completo de la actividad al formato legible de la UI.
 */
export const adaptarFichaTecnicaUI = (
  datosAPI: PoaApi.ActividadesFichaTecnicaResponse
): FichaTecnicaExpandida => {
  return {
    justificacion: datosAPI.justificacion,
    objetivoGeneral: datosAPI.objetivo_general,
    objetivosParticulares: datosAPI.objetivos_particulares,
    metaProyecto: datosAPI.meta_del_proyecto,
    indicadores: datosAPI.indicadores,
    // Mapeamos la sub-lista interna de auditores asignados
    equipoAuditor: datosAPI.equipo_auditor.map((aud) => ({
      nombreCompleto: aud.nombre,
      cargoVisible: "Auditor Asignado" // Texto por defecto si la API no provee cargo aquí
    }))
  };
};

/**
 * TRADUCTOR 4: Para el Dropdown del Formulario
 * Convierte el catálogo general de auditores en opciones simples para el <select>
 */
export const adaptarCatálogoAuditores = (
  datosAPI: PoaApi.AuditoresDataDto[]
): OpcionAuditorProps[] => {
  return datosAPI.map((auditor) => ({
    id: auditor.id,
    nombreCompleto: auditor.nombre_completo,
    cargoVisible: auditor.cargo
  }));
};