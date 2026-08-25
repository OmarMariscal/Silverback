// frontend/src/store/poa.mock-store.ts
// MOCK STORE CON PERSISTENCIA EN LOCALSTORAGE
// Ahora cuando haces cambios (crear, editar, sincronizar), se guardan automáticamente.
// Si recargo la página, los datos siguen ahí. Es como un "backend en el navegador".

import { create } from 'zustand';
import {
  CabeceraPOAProps,
  TarjetaActividadPOAProps,
  BancoActividadItemProps,
  OpcionAuditorProps,
  DatosFormularioFicha,
  SubactividadSugerida,
  SubactividadFilaForm,
  SubactividadFilaProps,
  FichaTecnicaExpandida,
  EstadoPOA
} from '../types/poa-contratos';
import { SubactividadSelectUI } from '../services/poa.adapter';
import * as PoaApi from '../types/poa-api';

interface PoaState {
  poaId: string | null;
  cabecera: CabeceraPOAProps | null;
  actividades: TarjetaActividadPOAProps[];
  cargandoInicial: boolean;
  erroresValidacionPresentar: string[] | null;

  bancoActividades: BancoActividadItemProps[];
  cargandoBanco: boolean;
  auditoresDisponibles: OpcionAuditorProps[];
  cargandoAuditores: boolean;
  actividadBancoSeleccionada: Partial<DatosFormularioFicha> | null;
  sugerenciasSubactividades: SubactividadSugerida[];
  subactividadesSelect: SubactividadSelectUI[];
  cargandoSubactividadesSelect: boolean;
  centrosUniversitarios: PoaApi.CentroDataDto[];

  cargarPoaInicial: () => Promise<void>;
  expandirTarjeta: (idActividad: string) => Promise<void>;
  enviarPoaARevision: (poaIdTarget?: string) => Promise<void>;
  cancelarEnvioPoa: (poaIdTarget?: string) => Promise<void>;
  borrarActividad: (idActividad: string) => Promise<void>;

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

  // NUEVO: método para resetear los datos (útil para testing)
  resetearDatos: () => void;
}

// ════════════════════════════════════════════════════════════════════════════
// KEYS DE LOCALSTORAGE
// ════════════════════════════════════════════════════════════════════════════
const STORAGE_KEY_ACTIVIDADES = 'poa_mock_actividades';
const STORAGE_KEY_DETALLES = 'poa_mock_detalles';

// ════════════════════════════════════════════════════════════════════════════
// HELPERS PARA LOCALSTORAGE
// ════════════════════════════════════════════════════════════════════════════

function cargarActividades(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY_ACTIVIDADES);
    return data ? JSON.parse(data) : generarActividadesDefecto();
  } catch (error) {
    console.warn('Error al cargar actividades de localStorage', error);
    return generarActividadesDefecto();
  }
}

function cargarDetalles(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY_DETALLES);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.warn('Error al cargar detalles de localStorage', error);
    return {};
  }
}

function guardarActividades(actividades: any[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVIDADES, JSON.stringify(actividades));
  } catch (error) {
    console.warn('Error al guardar actividades en localStorage', error);
  }
}

function guardarDetalles(detalles: Record<string, any>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_DETALLES, JSON.stringify(detalles));
  } catch (error) {
    console.warn('Error al guardar detalles en localStorage', error);
  }
}

// ════════════════════════════════════════════════════════════════════════════
// DATOS POR DEFECTO
// ════════════════════════════════════════════════════════════════════════════

type ActividadBaseMock = Omit<
  TarjetaActividadPOAProps,
  | 'fichaTecnica'
  | 'subactividades'
  | 'estaCargandoDetalles'
  | 'onBorrarActividad'
  | 'onConfigurarFichaTecnica'
  | 'onExpandirTarjeta'
>;

function generarActividadesDefecto(): ActividadBaseMock[] {
  return [
    {
      idActividad: 'act-mock-1',
      titulo: 'Auditoría Financiera al Departamento de Recursos Humanos',
      participacionGlobalVisible: '100% Contralor',
      esRezagada: false,
      ocultarBotonBorrar: false,
      fechaInicioPadre: '01 Ene 26',
      fechaTerminoPadre: '30 Jun 26'
    },
    {
      idActividad: 'act-mock-2',
      titulo: 'Revisión de Inventarios de Laboratorios Clínicos',
      participacionGlobalVisible: '80% Cobertura',
      esRezagada: true,
      ocultarBotonBorrar: false
    }
  ];
}

function generarDetalleInicial(idActividad: string): { fichaTecnica: FichaTecnicaExpandida; subactividades: SubactividadFilaProps[] } {
  return {
    fichaTecnica: {
      justificacion: 'La auditoría responde a la normativa institucional vigente para la transparencia de fondos.',
      objetivoGeneral: 'Revisar la correcta aplicación presupuestal en el primer semestre.',
      objetivosParticulares: '1. Cotejar nóminas. 2. Verificar expedie.',
      metaProyecto: '1 Documento de observaciones finales',
      indicadores: 'Porcentaje de expedientes de personal validados',
      equipoAuditor: [
        { nombreCompleto: 'Juan Pérez', cargoVisible: 'Auditor Sr.' },
        { nombreCompleto: 'María López', cargoVisible: 'Auditor Asistente' }
      ]
    },
    subactividades: [
      {
        id: `sub-mock-${idActividad}-1`,
        folioSecuencial: '1.1',
        descripcion: 'Solicitud de expedientes al área de Recursos Humanos',
        fechaInicioFormateada: '01 Ene 26',
        fechaTerminoFormateada: '15 Ene 26',
        semanasTotales: 2
      },
      {
        id: `sub-mock-${idActividad}-2`,
        folioSecuencial: '1.2',
        descripcion: 'Revisión documental en sitio',
        fechaInicioFormateada: '16 Ene 26',
        fechaTerminoFormateada: '15 Feb 26',
        semanasTotales: 4
      }
    ]
  };
}

// ════════════════════════════════════════════════════════════════════════════
// HELPERS PARA CONVERTIR DATOS
// ════════════════════════════════════════════════════════════════════════════

const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function formatearFechaCorta(fechaISO: string): string {
  if (!fechaISO) return 'N/A';
  const [anio, mes, dia] = fechaISO.split('-');
  if (!anio || !mes || !dia) return fechaISO;
  const mesTexto = MESES_CORTOS[parseInt(mes, 10) - 1] ?? mes;
  return `${dia} ${mesTexto} ${anio.slice(-2)}`;
}

function calcularSemanas(inicioISO: string, finISO: string): number {
  if (!inicioISO || !finISO) return 0;
  const inicio = new Date(inicioISO).getTime();
  const fin = new Date(finISO).getTime();
  const diffMs = fin - inicio;
  if (Number.isNaN(diffMs) || diffMs <= 0) return 0;
  return Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24 * 7)));
}

function convertirFilasAProps(filas: SubactividadFilaForm[]): SubactividadFilaProps[] {
  return filas.map((f, idx) => ({
    id: f.idBackend || f.idUiTemporal,
    folioSecuencial: `1.${idx + 1}`,
    descripcion: f.descripcionTarea,
    fechaInicioFormateada: formatearFechaCorta(f.fechaInicio),
    fechaTerminoFormateada: formatearFechaCorta(f.fechaTermino),
    semanasTotales: calcularSemanas(f.fechaInicio, f.fechaTermino)
  }));
}

const MOCK_CABECERA = {
  anioFiscal: "2026",
  estadoActual: "SIN_ENVIAR" as EstadoPOA,
  puedeEditar: true,
  estaCargando: false
};

// ════════════════════════════════════════════════════════════════════════════
// EL STORE
// ════════════════════════════════════════════════════════════════════════════

export const usePoaMockStore = create<PoaState>((set, get) => {
  // Carga inicial desde localStorage (esto se ejecuta una sola vez al crear el store)
  let dbActividades = cargarActividades();
  let dbDetalles = cargarDetalles();

  return {
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

    // 1. Cargar POA
    cargarPoaInicial: async () => {
      set({ cargandoInicial: true, erroresValidacionPresentar: null });
      await new Promise(resolve => setTimeout(resolve, 600));

      const cabeceraConEventos: CabeceraPOAProps = {
        ...MOCK_CABECERA,
        onEnviarRevision: () => get().enviarPoaARevision(),
        onCancelarEnvio: () => get().cancelarEnvioPoa()
      };

      const actividadesCompletas: TarjetaActividadPOAProps[] = dbActividades.map(act => ({
        ...act,
        fichaTecnica: undefined,
        subactividades: [],
        estaCargandoDetalles: false,
        onBorrarActividad: () => get().borrarActividad(act.idActividad),
        onConfigurarFichaTecnica: () => { console.log("Abriendo Ficha para:", act.idActividad) },
        onExpandirTarjeta: () => get().expandirTarjeta(act.idActividad)
      }));

      set({
        poaId: 'poa-mock-2026-uuid',
        cabecera: cabeceraConEventos,
        actividades: actividadesCompletas,
        cargandoInicial: false
      });
    },

    // 2. Expandir Tarjeta
    expandirTarjeta: async (idActividad: string) => {
      const { actividades } = get();
      const act = actividades.find(a => a.idActividad === idActividad);
      if (act?.fichaTecnica) return;

      set(state => ({
        actividades: state.actividades.map(a =>
          a.idActividad === idActividad ? { ...a, estaCargandoDetalles: true } : a
        )
      }));

      await new Promise(resolve => setTimeout(resolve, 800));

      if (!dbDetalles[idActividad]) {
        dbDetalles[idActividad] = generarDetalleInicial(idActividad);
        guardarDetalles(dbDetalles);
      }
      const detalle = dbDetalles[idActividad];

      set(state => ({
        actividades: state.actividades.map(a =>
          a.idActividad === idActividad
            ? {
                ...a,
                estaCargandoDetalles: false,
                fichaTecnica: detalle.fichaTecnica,
                subactividades: detalle.subactividades
              }
            : a
        )
      }));
    },

    // 3. Enviar a Revisión
    enviarPoaARevision: async (poaIdTarget?: string) => {
      set(state => ({ cabecera: state.cabecera ? { ...state.cabecera, estaCargando: true } : null }));
      await new Promise(resolve => setTimeout(resolve, 500));

      set(state => ({
        cabecera: state.cabecera ? {
          ...state.cabecera,
          estadoActual: "EN_REVISION",
          puedeEditar: false,
          estaCargando: false
        } : null,
        actividades: state.actividades.map(a => ({ ...a, ocultarBotonBorrar: true }))
      }));
    },

    // 4. Cancelar Envío
    cancelarEnvioPoa: async (poaIdTarget?: string) => {
      set(state => ({ cabecera: state.cabecera ? { ...state.cabecera, estaCargando: true } : null }));
      await new Promise(resolve => setTimeout(resolve, 500));

      set(state => ({
        cabecera: state.cabecera ? {
          ...state.cabecera,
          estadoActual: "SIN_ENVIAR",
          puedeEditar: true,
          estaCargando: false
        } : null,
        actividades: state.actividades.map(a => ({ ...a, ocultarBotonBorrar: false }))
      }));
    },

    // 5. Borrar Actividad
    borrarActividad: async (idActividad: string) => {
      if (!confirm("¿Estás seguro de eliminar esta actividad?")) return;
      await new Promise(resolve => setTimeout(resolve, 300));

      dbActividades = dbActividades.filter(a => a.idActividad !== idActividad);
      delete dbDetalles[idActividad];

      // ✅ GUARDAR en localStorage
      guardarActividades(dbActividades);
      guardarDetalles(dbDetalles);

      await get().cargarPoaInicial();
    },

    // 6. Cargar Banco
    cargarBancoActividades: async () => {
      set({ cargandoBanco: true });
      await new Promise(resolve => setTimeout(resolve, 400));
      set({
        cargandoBanco: false,
        bancoActividades: [
          {
            idActividadBanco: 'banco-mock-1',
            titulo: 'Auditoría a Matrícula Escolar',
            descripcionCorta: 'Revisión general de estudiantes activos',
            onSeleccionar: () => get().seleccionarActividadBanco('banco-mock-1')
          },
          {
            idActividadBanco: 'banco-mock-2',
            titulo: 'Inspección de Obras',
            descripcionCorta: 'Evaluación de avance físico y financiero',
            onSeleccionar: () => get().seleccionarActividadBanco('banco-mock-2')
          }
        ]
      });
    },

    // 7. Cargar Auditores
    cargarAuditores: async () => {
      set({ cargandoAuditores: true });
      await new Promise(resolve => setTimeout(resolve, 300));
      set({
        cargandoAuditores: false,
        auditoresDisponibles: [
          { id: 'aud-mock-1', nombreCompleto: 'Roberto Gómez Bolaños', cargoVisible: 'Auditor Jefe' },
          { id: 'aud-mock-2', nombreCompleto: 'Florinda Meza', cargoVisible: 'Auditora Especial' }
        ]
      });
    },

    // 8. Cargar Centros
    cargarCentros: async () => {
      set({
        centrosUniversitarios: [
          { id: 'cu-1', clave: 'CUSUR', nombre: 'Centro Universitario del Sur', subtitulo_interfaz: 'Ciudad Guzmán' },
          { id: 'cu-2', clave: 'CUCEI', nombre: 'Centro Universitario de Ciencias Exactas e Ingenierías', subtitulo_interfaz: 'Guadalajara' }
        ]
      });
    },

    // 9. Seleccionar Actividad del Banco
    seleccionarActividadBanco: async (idBanco: string) => {
      set({
        actividadBancoSeleccionada: {
          titulo: `Actividad generada del ID: ${idBanco}`,
          justificacion: 'Esta justificación proviene de la plantilla del banco de actividades seleccionada por el usuario.',
          objetivoGeneral: 'Cumplir con el programa general de auditorías al 100% en los tiempos establecidos.'
        }
      });
    },

    // 10. Crear Nueva Actividad
    crearNuevaActividad: async (datosForm, idBanco) => {
      console.log("Mock: Creando actividad:", datosForm);
      await new Promise(resolve => setTimeout(resolve, 500));

      const nuevoId = `act-mock-new-${Date.now()}`;

      dbActividades.push({
        idActividad: nuevoId,
        titulo: datosForm.titulo,
        participacionGlobalVisible: '0% Sin asignar',
        esRezagada: false,
        ocultarBotonBorrar: false
      });

      dbDetalles[nuevoId] = {
        fichaTecnica: {
          justificacion: datosForm.justificacion,
          objetivoGeneral: datosForm.objetivoGeneral,
          objetivosParticulares: datosForm.objetivosParticulares,
          metaProyecto: datosForm.metaProyecto,
          indicadores: datosForm.indicadores,
          equipoAuditor: get().auditoresDisponibles
            .filter(a => datosForm.auditoresSeleccionadosIds.includes(a.id))
            .map(a => ({ nombreCompleto: a.nombreCompleto, cargoVisible: a.cargoVisible }))
        },
        subactividades: []
      };

      // ✅ GUARDAR en localStorage
      guardarActividades(dbActividades);
      guardarDetalles(dbDetalles);

      await get().cargarPoaInicial();
      return nuevoId;
    },

    // 11. Editar Ficha Técnica
    editarFichaTecnica: async (actividadId, datosForm) => {
      console.log(`Mock: Editando ficha para ${actividadId}`);
      await new Promise(resolve => setTimeout(resolve, 500));

      if (datosForm.titulo) {
        dbActividades = dbActividades.map(a =>
          a.idActividad === actividadId ? { ...a, titulo: datosForm.titulo as string } : a
        );
      }

      const detallePrevio = dbDetalles[actividadId] ?? generarDetalleInicial(actividadId);
      dbDetalles[actividadId] = {
        subactividades: detallePrevio.subactividades,
        fichaTecnica: {
          justificacion: datosForm.justificacion ?? detallePrevio.fichaTecnica.justificacion,
          objetivoGeneral: datosForm.objetivoGeneral ?? detallePrevio.fichaTecnica.objetivoGeneral,
          objetivosParticulares: datosForm.objetivosParticulares ?? detallePrevio.fichaTecnica.objetivosParticulares,
          metaProyecto: datosForm.metaProyecto ?? detallePrevio.fichaTecnica.metaProyecto,
          indicadores: datosForm.indicadores ?? detallePrevio.fichaTecnica.indicadores,
          equipoAuditor: datosForm.auditoresSeleccionadosIds
            ? get().auditoresDisponibles
                .filter(a => datosForm.auditoresSeleccionadosIds!.includes(a.id))
                .map(a => ({ nombreCompleto: a.nombreCompleto, cargoVisible: a.cargoVisible }))
            : detallePrevio.fichaTecnica.equipoAuditor
        }
      };

      // ✅ GUARDAR en localStorage
      guardarActividades(dbActividades);
      guardarDetalles(dbDetalles);

      await get().cargarPoaInicial();
      return true;
    },

    // 12. Obtener Sugerencias
    obtenerSubactividadesSugeridas: async (idBanco: string) => {
      set({
        sugerenciasSubactividades: [
          { idSugerencia: 'sug-mock-1', descripcion: 'Fase 1: Recopilación de datos inicial', tipoSugerido: 'AUDITORIA' },
          { idSugerencia: 'sug-mock-2', descripcion: 'Fase 2: Presentación de informe preliminar', tipoSugerido: 'REVISION' }
        ]
      });
    },

    // 13. Cargar Subactividades Select
    cargarSubactividadesSelect: async (actividadId: string) => {
      set({ cargandoSubactividadesSelect: true });
      await new Promise(resolve => setTimeout(resolve, 400));
      set({
        cargandoSubactividadesSelect: false,
        subactividadesSelect: [
          {
            id: 'sub-select-1',
            folio: '1.1',
            descripcion: 'Recabar firmas de asistencia',
            tipo: 'REVISION',
            fechaInicioFormatted: '01 Mar 26',
            fechaTerminoFormatted: '05 Mar 26',
            semanasTotales: 1,
            seleccionada: false
          }
        ]
      });
    },

    // 14. Crear Masivas
    crearSubactividadesMasivas: async (actividadId, filas) => {
      console.log(`Mock: Creando masivas para ${actividadId}`);
      await new Promise(resolve => setTimeout(resolve, 500));

      const detallePrevio = dbDetalles[actividadId] ?? generarDetalleInicial(actividadId);
      dbDetalles[actividadId] = {
        fichaTecnica: detallePrevio.fichaTecnica,
        subactividades: convertirFilasAProps(filas)
      };

      // ✅ GUARDAR en localStorage
      guardarDetalles(dbDetalles);

      await get().cargarPoaInicial();
      return true;
    },

    // 15. Sincronizar Subactividades ⭐ LA MÁS IMPORTANTE
    sincronizarSubactividades: async (actividadId, filas) => {
      console.log(`Mock: Sincronizando ${filas.length} subs para ${actividadId}`);
      await new Promise(resolve => setTimeout(resolve, 500));

      const detallePrevio = dbDetalles[actividadId] ?? generarDetalleInicial(actividadId);
      dbDetalles[actividadId] = {
        fichaTecnica: detallePrevio.fichaTecnica,
        subactividades: convertirFilasAProps(filas)
      };

      // ✅ GUARDAR en localStorage
      guardarDetalles(dbDetalles);

      await get().cargarPoaInicial();
      return true;
    },

    // 16. Limpiar Errores
    limpiarErroresValidacion: () => set({ erroresValidacionPresentar: null }),

    // 17. BONUS: Resetear Datos (útil para testing)
    resetearDatos: () => {
      dbActividades = generarActividadesDefecto();
      dbDetalles = {};
      guardarActividades(dbActividades);
      guardarDetalles(dbDetalles);
      console.log("✅ Datos reseteados a los valores por defecto");
    }
  };
});