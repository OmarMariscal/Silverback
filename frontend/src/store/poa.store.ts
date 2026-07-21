// frontend/src/store/poa.store.ts
// Este archivo contiene el store de Zustand para manejar el estado del POA en la UI. Define los estados, acciones y efectos que permiten a los componentes del POA interactuar con los datos de manera reactiva.
// En palabras sencillas: Este store es como una "bóveda" donde guardamos toda la información del POA y las funciones para modificarla. Los componentes de la UI pueden "abrir" esta bóveda para leer datos o "pedir" que se hagan cambios, y el store se encarga de actualizar todo de manera ordenada y eficiente.

import { create } from 'zustand';
import { CabeceraPOAProps, TarjetaActividadPOAProps } from '../types/poa-contratos';
import { poaService } from '../services/poa.service';
import { adaptarSubactividadesUI, adaptarFichaTecnicaUI } from '../services/poa.adapter';

// 1. DEFINIMOS LA ESTRUCTURA DE NUESTRA BÓVEDA (Interfaz del Estado)
interface PoaState {
  // --- A. LOS DATOS (El Estado) ---
  cabecera: CabeceraPOAProps | null; // null cuando la página apenas está cargando
  actividades: TarjetaActividadPOAProps[];
  cargandoInicial: boolean; // Spinner global para toda la pantalla

  // --- B. LAS ACCIONES (Los mutadores del estado) ---
  cargarPoaInicial: () => Promise<void>;
  expandirTarjeta: (idActividad: string) => Promise<void>;
  
  // --- C. ACCIONES OPERATIVAS (Para los botones de la pantalla 1) ---
  enviarPoaARevision: (poaId: string) => Promise<void>;
  cancelarEnvioPoa: (poaId: string) => Promise<void>;
  borrarActividad: (idActividad: string) => Promise<void>;
}

// 2. CREAMOS EL STORE GLOBAL
export const usePoaStore = create<PoaState>((set, get) => ({
  
  // Valores iniciales (Vacíos)
  cabecera: null,
  actividades: [],
  cargandoInicial: false,

  // --- ACCIÓN 1: Al entrar a la página ---
  cargarPoaInicial: async () => {
    set({ cargandoInicial: true }); // Prendemos spinner global
    
    try {
      // Llamamos al servicio (que ya pasa por el Adapter de tu BFF)
      const { cabecera, actividades } = await poaService.obtenerMiPoaActual();
      
      // Guardamos en la bóveda
      set({ cabecera, actividades, cargandoInicial: false });
    } catch (error) {
      console.error("Error crítico al cargar el POA", error);
      set({ cargandoInicial: false });
    }
  },

  // --- ACCIÓN 2: Cuando Rogelio le da clic a la flecha de la tarjeta ---
  expandirTarjeta: async (idActividad: string) => {
    const { actividades } = get(); // Leemos el estado actual
    
    // Validamos CACHÉ: Si la tarjeta ya tiene la ficha técnica, no hacemos nada (Ahorramos datos)
    const actividadActual = actividades.find(a => a.idActividad === idActividad);
    if (actividadActual?.fichaTecnica) return; 

    // 1. Prendemos el spinner de ESA tarjeta en específico
    set(state => ({
      actividades: state.actividades.map(act => 
        act.idActividad === idActividad ? { ...act, estaCargandoDetalles: true } : act
      )
    }));

    try {
      // 2. Hacemos el Lazy Loading en paralelo para traer tanto la ficha técnica como las subactividades
      const [respuestaFicha, respuestaSubactividades] = await Promise.all([
        poaService.obtenerFichaTecnica(idActividad),
        poaService.obtenerSubactividadesPoa(idActividad)
      ]);

      // 3. Traducimos los datos crudos a UI usando tus importaciones del Adapter
      const fichaAdaptada = adaptarFichaTecnicaUI(respuestaFicha);
      const subactividadesAdaptadas = adaptarSubactividadesUI(respuestaSubactividades);

      // 4. Inyectamos los datos traducidos solo a la tarjeta correspondiente
      set(state => ({
        actividades: state.actividades.map(act => 
          act.idActividad === idActividad 
            ? { 
                ...act, 
                fichaTecnica: fichaAdaptada, 
                subactividades: subactividadesAdaptadas,
                estaCargandoDetalles: false // Apagamos el spinner
              } 
            : act
        )
      }));

    } catch (error) {
      console.error(`Error al cargar detalles de la tarjeta ${idActividad}`, error);
      // Si falla, apagamos el spinner para que no se quede cargando infinito
      set(state => ({
        actividades: state.actividades.map(act => 
          act.idActividad === idActividad ? { ...act, estaCargandoDetalles: false } : act
        )
      }));
    }
  },

  // --- ACCIÓN 3: Enviar POA a revisión (Pantalla 1) ---
  enviarPoaARevision: async (poaId: string) => {
    const { cabecera } = get();
    if (!cabecera) return;

    // 1. Ponemos la cabecera en estado de carga (bloquea botones)
    set(state => ({
      cabecera: state.cabecera ? { ...state.cabecera, estaCargando: true } : null
    }));

    try {
      // 2. Disparamos la petición al backend de Emiliano
      const respuesta = await poaService.presentarPoa(poaId);
      
      // 3. Modificamos el estado local según las reglas de negocio
      set(state => ({
        cabecera: state.cabecera ? { 
          ...state.cabecera, 
          estadoActual: "EN_REVISION", // Cambia visualmente el badge a naranja
          puedeEditar: false,          // Oculta los botones de enviar/editar en la UI
          estaCargando: false          // Apaga el spinner del botón
        } : null,
        // Además, bloqueamos el botón de borrar de todas las tarjetas individuales automáticamente
        actividades: state.actividades.map(act => ({ ...act, ocultarBotonBorrar: true }))
      }));

      alert(respuesta.mensaje); // Muestra el mensaje de éxito del backend
    } catch (error) {
      console.error("Error al presentar el POA", error);
      // Si falla, restauramos el botón para que no se quede bloqueado
      set(state => ({
        cabecera: state.cabecera ? { ...state.cabecera, estaCargando: false } : null
      }));
    }
  },

  // --- ACCIÓN 4: Cancelar Envío del POA (Pantalla 1) ---
  cancelarEnvioPoa: async (poaId: string) => {
    const { cabecera } = get();
    if (!cabecera) return;

    set(state => ({
      cabecera: state.cabecera ? { ...state.cabecera, estaCargando: true } : null
    }));

    try {
      const respuesta = await poaService.cancelarEnvioPoa(poaId);
      
      // Devolvemos el estado a SIN_ENVIAR/editable
      set(state => ({
        cabecera: state.cabecera ? { 
          ...state.cabecera, 
          estadoActual: "SIN_ENVIAR",
          puedeEditar: true,
          estaCargando: false
        } : null,
        actividades: state.actividades.map(act => ({ ...act, ocultarBotonBorrar: false }))
      }));

      alert(respuesta.data.mensaje);
    } catch (error) {
      console.error("Error al cancelar envío del POA", error);
      set(state => ({
        cabecera: state.cabecera ? { ...state.cabecera, estaCargando: false } : null
      }));
    }
  },

  // --- ACCIÓN 5: Borrar Actividad General (Pantalla 1) ---
  borrarActividad: async (idActividad: string) => {
    // Preguntamos al usuario por seguridad antes de destruir datos en cascada
    if (!confirm("¿Estás seguro de eliminar esta actividad? Se borrarán todas sus subactividades.")) return;

    try {
      // 1. Llamamos al endpoint de eliminación
      await poaService.eliminarActividad(idActividad);
      
      // se vuelve a llamar a 'cargarPoaInicial' para traer la lista limpia y re-ordenada directamente de Postgres, evitando desajustes locales.
      const store = get();
      await store.cargarPoaInicial();
      
    } catch (error) {
      console.error(`Error al eliminar la actividad ${idActividad}`, error);
      alert("No se pudo eliminar la actividad. Inténtalo de nuevo.");
    }
  }

}));


