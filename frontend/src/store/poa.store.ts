// frontend/src/store/poa.store.ts
// Este archivo contiene el store de Zustand para manejar el estado del POA en la UI. Define los estados, acciones y efectos que permiten a los componentes del POA interactuar con los datos de manera reactiva.
// En palabras sencillas: Este store es como una "bóveda" donde guardamos toda la información del POA y las funciones para modificarla. Los componentes de la UI pueden "abrir" esta bóveda para leer datos o "pedir" que se hagan cambios, y el store se encarga de actualizar todo de manera ordenada y eficiente.

import { create } from 'zustand';
import { 
  CabeceraPOAProps, 
  TarjetaActividadPOAProps, 
  BancoActividadItemProps, 
  OpcionAuditorProps, 
  DatosFormularioFicha,
  SubactividadSugerida,
  SubactividadFilaForm
} from '../types/poa-contratos';
import { poaService } from '../services/poa.service';
import { 
  adaptarSubactividadesUI, 
  adaptarFichaTecnicaUI, 
  adaptarBancoActividadesUI,
  adaptarCatalogoAuditores,
  adaptarDetalleBancoUI,
  adaptarSubactividadesSugeridasUI,
  adaptarSubactividadesSelectUI,
  adaptarFormularioACrearDTO,
  SubactividadSelectUI
} from '../services/poa.adapter';
import * as PoaApi from '../types/poa-api';

interface PoaState {
  // --- A. ESTADO DE PANTALLA 1 (POA Actual) ---
  poaId: string | null;
  cabecera: CabeceraPOAProps | null;
  actividades: TarjetaActividadPOAProps[];
  cargandoInicial: boolean;
  erroresValidacionPresentar: string[] | null;

  // --- B. ESTADO DE PANTALLAS 2, 3, 4 Y 5 ---
  bancoActividades: BancoActividadItemProps[];
  cargandoBanco: boolean;
  auditoresDisponibles: OpcionAuditorProps[];
  cargandoAuditores: boolean;
  actividadBancoSeleccionada: Partial<DatosFormularioFicha> | null;
  sugerenciasSubactividades: SubactividadSugerida[];
  subactividadesSelect: SubactividadSelectUI[]; // Conectada Pantalla 4
  cargandoSubactividadesSelect: boolean;
  centrosUniversitarios: PoaApi.CentroDataDto[];

  // --- C. ACCIONES DE PANTALLA 1 ---
  cargarPoaInicial: () => Promise<void>;
  expandirTarjeta: (idActividad: string) => Promise<void>;
  enviarPoaARevision: (poaIdTarget?: string) => Promise<void>;
  cancelarEnvioPoa: (poaIdTarget?: string) => Promise<void>;
  borrarActividad: (idActividad: string) => Promise<void>;

  // --- D. ACCIONES DE PANTALLAS 2 A 5 (100% de funciones conectadas) ---
  cargarBancoActividades: () => Promise<void>;
  cargarAuditores: () => Promise<void>;
  cargarCentros: () => Promise<void>;
  seleccionarActividadBanco: (idBanco: string) => Promise<void>;
  crearNuevaActividad: (datosForm: DatosFormularioFicha, idBanco?: string | null) => Promise<string | null>;
  editarFichaTecnica: (actividadId: string, datosForm: Partial<DatosFormularioFicha>) => Promise<boolean>;
  obtenerSubactividadesSugeridas: (idBanco: string) => Promise<void>;
  cargarSubactividadesSelect: (actividadId: string) => Promise<void>;
  crearSubactividadesMasivas: (actividadId: string, filas: SubactividadFilaForm[]) => Promise<boolean>;
  sincronizarSubactividades: (actividadId: string, filas: SubactividadFilaForm[]) => Promise<boolean>;
  limpiarErroresValidacion: () => void;
}

export const usePoaStore = create<PoaState>((set, get) => ({
  // Estado Inicial
  poaId: null,
  cabecera: null,
  actividades: [],
  cargandoInicial: false,
  erroresValidacionPresentar: null,

  bancoActividades: [],
  cargandoBanco: false,
  auditoresDisponibles: [],
  cargandoAuditores: false,
  actividadBancoSeleccionada: null,
  sugerenciasSubactividades: [],
  subactividadesSelect: [],
  cargandoSubactividadesSelect: false,
  centrosUniversitarios: [],

  // 1. Cargar POA Inicial (Guarda poaId e inyecta eventos en cabecera)
  cargarPoaInicial: async () => {
    set({ cargandoInicial: true, erroresValidacionPresentar: null });
    try {
      const { poaId, cabecera, actividades } = await poaService.obtenerMiPoaActual();
      
      // Inyectamos las llamadas del store a la cabecera visual
      const cabeceraConEventos: CabeceraPOAProps = {
        ...cabecera,
        onEnviarRevision: () => get().enviarPoaARevision(),
        onCancelarEnvio: () => get().cancelarEnvioPoa()
      };

      set({ poaId, cabecera: cabeceraConEventos, actividades, cargandoInicial: false });
    } catch (error) {
      console.error("Error al cargar el POA inicial", error);
      set({ cargandoInicial: false });
    }
  },

  // 2. Expandir Tarjeta (Lazy Loading)
  expandirTarjeta: async (idActividad: string) => {
    const { actividades } = get();
    const act = actividades.find(a => a.idActividad === idActividad);
    if (act?.fichaTecnica) return; 

    set(state => ({
      actividades: state.actividades.map(a => 
        a.idActividad === idActividad ? { ...a, estaCargandoDetalles: true } : a
      )
    }));

    try {
      const [resFicha, resSub] = await Promise.all([
        poaService.obtenerFichaTecnica(idActividad),
        poaService.obtenerSubactividadesPoa(idActividad)
      ]);

      set(state => ({
        actividades: state.actividades.map(a => 
          a.idActividad === idActividad ? { 
            ...a, 
            fichaTecnica: adaptarFichaTecnicaUI(resFicha), 
            subactividades: adaptarSubactividadesUI(resSub),
            estaCargandoDetalles: false 
          } : a
        )
      }));
    } catch (error) {
      console.error(`Error al cargar detalles de ${idActividad}`, error);
      set(state => ({
        actividades: state.actividades.map(a => 
          a.idActividad === idActividad ? { ...a, estaCargandoDetalles: false } : a
        )
      }));
    }
  },

  // 3. Enviar a Revisión
  enviarPoaARevision: async (poaIdTarget?: string) => {
    const poaIdToUse = poaIdTarget || get().poaId;
    if (!poaIdToUse) {
      console.error("No se encontró un poaId válido para presentar.");
      return;
    }

    set(state => ({
      cabecera: state.cabecera ? { ...state.cabecera, estaCargando: true } : null,
      erroresValidacionPresentar: null
    }));

    try {
      const res = await poaService.presentarPoa(poaIdToUse);
      set(state => ({
        cabecera: state.cabecera ? { 
          ...state.cabecera, 
          estadoActual: "EN_REVISION", 
          puedeEditar: false, 
          estaCargando: false 
        } : null,
        actividades: state.actividades.map(a => ({ ...a, ocultarBotonBorrar: true }))
      }));
      alert(res.mensaje);
    } catch (error: any) {
      console.error("Error al presentar el POA", error);
      
      if (error.response?.status === 422) {
        const errorData: PoaApi.PresentarPoasResponseErrorDto = error.response.data;
        set({ erroresValidacionPresentar: errorData.detalles });
      } else {
        alert("Ocurrió un error al enviar el POA a revisión.");
      }

      set(state => ({
        cabecera: state.cabecera ? { ...state.cabecera, estaCargando: false } : null
      }));
    }
  },

  // 4. Cancelar Envío
  cancelarEnvioPoa: async (poaIdTarget?: string) => {
    const poaIdToUse = poaIdTarget || get().poaId;
    if (!poaIdToUse) {
      console.error("No se encontró un poaId válido para cancelar envío.");
      return;
    }

    set(state => ({
      cabecera: state.cabecera ? { ...state.cabecera, estaCargando: true } : null
    }));

    try {
      const res = await poaService.cancelarEnvioPoa(poaIdToUse);
      set(state => ({
        cabecera: state.cabecera ? { 
          ...state.cabecera, 
          estadoActual: "SIN_ENVIAR", 
          puedeEditar: true, 
          estaCargando: false 
        } : null,
        actividades: state.actividades.map(a => ({ ...a, ocultarBotonBorrar: false }))
      }));
      alert(res.data.mensaje);
    } catch (error) {
      console.error("Error al cancelar envío", error);
      set(state => ({
        cabecera: state.cabecera ? { ...state.cabecera, estaCargando: false } : null
      }));
    }
  },

  // 5. Eliminar Actividad
  borrarActividad: async (idActividad: string) => {
    if (!confirm("¿Estás seguro de eliminar esta actividad?")) return;
    try {
      await poaService.eliminarActividad(idActividad);
      await get().cargarPoaInicial();
    } catch (error) {
      console.error(`Error al eliminar ${idActividad}`, error);
    }
  },

  // --- ACCIONES DE PANTALLAS 2 A 5 ---

  // 6. Cargar Banco
  cargarBancoActividades: async () => {
    set({ cargandoBanco: true });
    try {
      const res = await poaService.obtenerBancoActividades();
      set({ bancoActividades: adaptarBancoActividadesUI(res), cargandoBanco: false });
    } catch (error) {
      set({ cargandoBanco: false });
    }
  },

  // 7. Cargar Auditores
  cargarAuditores: async () => {
    set({ cargandoAuditores: true });
    try {
      const res = await poaService.obtenerAuditores();
      set({ auditoresDisponibles: adaptarCatalogoAuditores(res), cargandoAuditores: false });
    } catch (error) {
      set({ cargandoAuditores: false });
    }
  },

  // 8. Cargar Centros
  cargarCentros: async () => {
    try {
      const res = await poaService.obtenerCentros();
      set({ centrosUniversitarios: res.data });
    } catch (error) {
      console.error("Error al cargar centros", error);
    }
  },

  // 9. Seleccionar Actividad del Banco
  seleccionarActividadBanco: async (idBanco: string) => {
    try {
      const res = await poaService.obtenerDetalleBancoActividad(idBanco);
      set({ actividadBancoSeleccionada: adaptarDetalleBancoUI(res) });
    } catch (error) {
      console.error("Error al obtener detalle del banco", error);
    }
  },

  // 10. Crear Nueva Actividad (Garantiza poaId real)
  crearNuevaActividad: async (datosForm: DatosFormularioFicha, idBanco?: string | null) => {
    const { poaId } = get();
    if (!poaId) {
      console.error("No se puede crear actividad: poaId no está cargado en la sesión.");
      alert("Error de sesión: No se identificó el POA activo.");
      return null;
    }

    try {
      const payloadDTO = adaptarFormularioACrearDTO(datosForm, idBanco);
      const res = await poaService.crearActividad(poaId, payloadDTO);
      await get().cargarPoaInicial();
      return res.id;
    } catch (error) {
      console.error("Error al crear actividad", error);
      return null;
    }
  },

  // 11. Editar Ficha Técnica
  editarFichaTecnica: async (actividadId: string, datosForm: Partial<DatosFormularioFicha>) => {
    try {
      const payload: PoaApi.ActividadesPatchFichaTecnicaRequest = {
        titulo: datosForm.titulo,
        justificacion: datosForm.justificacion,
        objetivo_general: datosForm.objetivoGeneral,
        objetivos_particulares: datosForm.objetivosParticulares,
        meta_del_proyecto: datosForm.metaProyecto,
        indicadores: datosForm.indicadores,
        ...(datosForm.auditoresSeleccionadosIds && {
          auditores_ids: datosForm.auditoresSeleccionadosIds
        })
      };

      await poaService.editarFichaTecnica(actividadId, payload);
      await get().cargarPoaInicial();
      return true;
    } catch (error) {
      console.error("Error al editar ficha técnica", error);
      return false;
    }
  },

  // 12. Obtener Sugerencias del Banco
  obtenerSubactividadesSugeridas: async (idBanco: string) => {
    try {
      const res = await poaService.obtenerSubactividadesSugeridas(idBanco);
      set({ sugerenciasSubactividades: adaptarSubactividadesSugeridasUI(res) });
    } catch (error) {
      console.error("Error al cargar sugerencias", error);
    }
  },

  // 13. Cargar Subactividades Select (Pantalla 4 - Conectada)
  cargarSubactividadesSelect: async (actividadId: string) => {
    set({ cargandoSubactividadesSelect: true });
    try {
      const res = await poaService.obtenerSubactividadesSelect(actividadId);
      set({ subactividadesSelect: adaptarSubactividadesSelectUI(res), cargandoSubactividadesSelect: false });
    } catch (error) {
      console.error("Error al obtener subactividades select", error);
      set({ cargandoSubactividadesSelect: false });
    }
  },

  // 14. Creación Masiva Bulk
  crearSubactividadesMasivas: async (actividadId: string, filas: SubactividadFilaForm[]) => {
    try {
      const payload: PoaApi.SubActividadesBulkRequest = {
        sub_actividades: filas.map(f => ({
          descripcion_tarea: f.descripcionTarea,
          fecha_inicio: f.fechaInicio,
          fecha_termino: f.fechaTermino,
          tipo: f.tipo,
          ...(f.idBancoSugerencia ? { banco_sub_actividad_id: f.idBancoSugerencia } : {})
        }))
      };

      await poaService.crearSubactividadesBulk(actividadId, payload);
      await get().cargarPoaInicial();
      return true;
    } catch (error) {
      console.error("Error en creación masiva de subactividades", error);
      return false;
    }
  },

  // 15. Sincronización en lote Sync
  sincronizarSubactividades: async (actividadId: string, filas: SubactividadFilaForm[]) => {
    try {
      const payloadSync: PoaApi.SubActividadesSyncRequest = {
        sub_actividades: filas.map(f => ({
          ...(f.idBackend ? { id: f.idBackend } : {}),
          descripcion_tarea: f.descripcionTarea,
          fecha_inicio: f.fechaInicio,
          fecha_termino: f.fechaTermino,
          tipo: f.tipo
        }))
      };

      await poaService.sincronizarSubactividades(actividadId, payloadSync);
      await get().cargarPoaInicial();
      return true;
    } catch (error) {
      console.error("Error al sincronizar subactividades", error);
      return false;
    }
  },

  // 16. Limpiar Errores 422
  limpiarErroresValidacion: () => set({ erroresValidacionPresentar: null })
}));