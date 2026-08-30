// frontend/src/services/poa.adapter.ts
// Este archivo contiene funciones que traducen los datos crudos que nos da el backend de Emiliano a la forma que Rogelio espera en la UI. Cada función toma un DTO de la API y devuelve un objeto con las props que los componentes del POA necesitan.
// En palabras sencillas: Este archivo es como un "traductor" que convierte el lenguaje del backend al lenguaje de la UI. Así, cuando Rogelio recibe los datos, ya están en un formato que entiende y puede usar sin problemas.

// IMPORTACIÓN DE PROPS
import { 
  CabeceraPOAProps, 
  TarjetaActividadPOAProps, 
  SubactividadFilaProps, 
  FichaTecnicaExpandida, 
  OpcionAuditorProps,
  BancoActividadItemProps,
  DatosFormularioFicha,
  SubactividadSugerida
} from '../types/poa-contratos';
import * as PoaApi from '../types/poa-api'; 

export interface SubactividadSelectUI {
  id: string;
  folio: string;
  descripcion: string;
  tipo: PoaApi.TipoActividadAPI;
  fechaInicioFormatted: string;
  fechaTerminoFormatted: string;
  semanasTotales: number;
  seleccionada: boolean;
}

/**
 * TRADUCTOR 1: Para la Pantalla Principal del POA
 */
export const adaptarPoaActual = (
  datosAPI: PoaApi.PoaActualDto
): { cabecera: CabeceraPOAProps, actividades: TarjetaActividadPOAProps[] } => {
  
  const cabeceraAdaptada: CabeceraPOAProps = {
    anioFiscal: datosAPI.anio_fiscal.toString(),
    estadoActual: datosAPI.estado as any, 
    puedeEditar: datosAPI.estado === "SIN_ENVIAR" || datosAPI.estado === "BORRADOR" || datosAPI.estado === "DEVUELTA",
    estaCargando: false,
    onEnviarRevision: () => {}, 
    onCancelarEnvio: () => {},
  };

  const actividadesAdaptadas: TarjetaActividadPOAProps[] = datosAPI.actividades_resumen.map((act) => ({
    idActividad: act.id,
    titulo: act.titulo,
    participacionGlobalVisible: `${act.participacion_global}%`,
    // Ahora toma la bandera 'es_rezagado' individual de cada actividad del backend
    esRezagada: act.es_rezagado ?? false,

    // 👈 MAPEO DE FECHAS Y AUDITORES PARA LA VISTA COMPRIMIDA
    fechaInicioPadre: datosAPI.fecha_inicio,
    fechaTerminoPadre: datosAPI.fecha_termino,
    auditoresResumen: act.auditores_nombres || [],
    
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
 */
export const adaptarSubactividadesUI = (
  datosAPI: PoaApi.SubActividadesPoaResponse
): SubactividadFilaProps[] => {
  return datosAPI.data.map((sub) => ({
    id: sub.id,
    folioSecuencial: sub.folio,
    descripcion: sub.descripcion,
    fechaInicioFormateada: sub.fechas.fecha_inicio,
    fechaTerminoFormateada: sub.fechas.fecha_termino,
    semanasTotales: sub.fechas.semanas
  }));
};

/**
 * TRADUCTOR 3: Para la Ficha Técnica Expandida
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
    equipoAuditor: datosAPI.equipo_auditor.map((aud) => ({
      nombreCompleto: aud.nombre,
      cargoVisible: "Auditor Asignado"
    }))
  };
};

/**
 * TRADUCTOR 4: Para el Dropdown de Auditores
 */
export const adaptarCatalogoAuditores = (
  datosAPI: PoaApi.AuditoresDto
): OpcionAuditorProps[] => {
  return datosAPI.data.map((auditor) => ({
    id: auditor.id,
    nombreCompleto: auditor.nombre_completo,
    cargoVisible: auditor.cargo_etiqueta
  }));
};

/**
 * TRADUCTOR 5: Para el Banco de Actividades (Pantalla 2)
 */
export const adaptarBancoActividadesUI = (
  datosAPI: PoaApi.BancoActividadesDto
): BancoActividadItemProps[] => {
  return datosAPI.data.map((item) => ({
    idActividadBanco: item.id,
    titulo: item.titulo,
    descripcionCorta: item.descripcion_corta,
    onSeleccionar: () => {}
  }));
};

/**
 * TRADUCTOR 6: Para Detalle del Banco (Pantalla 3)
 */
export const adaptarDetalleBancoUI = (
  datosAPI: PoaApi.BancoIdDto
): Partial<DatosFormularioFicha> => {
  return {
    titulo: datosAPI.titulo,
    justificacion: datosAPI.justificacion_plantilla,
    objetivoGeneral: datosAPI.objetivo_gen_plantilla,
  };
};

/**
 * TRADUCTOR 7: Para Sugerencias de Subactividades (Pantalla 4)
 */
export const adaptarSubactividadesSugeridasUI = (
  datosAPI: PoaApi.ActividadSugeridaDto
): SubactividadSugerida[] => {
  return datosAPI.data.map((item) => ({
    idSugerencia: item.id,
    descripcion: item.descripcion,
    tipoSugerido: item.tipo_sugerido
  }));
};

/**
 * TRADUCTOR 8: Para Selección de Subactividades (Pantalla 4)
 */
export const adaptarSubactividadesSelectUI = (
  datosAPI: PoaApi.SubActividadesSelectResponse
): SubactividadSelectUI[] => {
  return datosAPI.data.map((item) => ({
    id: item.id,
    folio: item.folio,
    descripcion: item.descripcion,
    tipo: item.tipo,
    fechaInicioFormatted: item.fechas?.fecha_inicio || '',
    fechaTerminoFormatted: item.fechas?.fecha_termino || '',
    semanasTotales: item.fechas?.semanas || 0,
    seleccionada: item.seleccionada
  }));
};

/**
 * TRADUCTOR 9: De Formulario UI a DTO de Creación Backend
 */
export const adaptarFormularioACrearDTO = (
  datosForm: DatosFormularioFicha,
  bancoActividadId?: string | null
): PoaApi.CrearActividadesDto => {
  return {
    titulo: datosForm.titulo,
    justificacion: datosForm.justificacion,
    objetivo_general: datosForm.objetivoGeneral,
    objetivos_especificos: datosForm.objetivosParticulares,
    metas: datosForm.metaProyecto,
    indicadores: datosForm.indicadores,
    // Omite la propiedad si es falsy para no enviar 'null' explícito
    ...(bancoActividadId ? { banco_actividad_id: bancoActividadId } : {}),
    equipo_auditor: {
      total_participantes: datosForm.auditoresSeleccionadosIds.length,
      auditores_ids: datosForm.auditoresSeleccionadosIds
    }
  };
};