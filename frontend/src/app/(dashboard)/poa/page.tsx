'use client';

import { useEffect, useState } from 'react';
import { usePoaStore } from '@/store/poa.store';
import { TarjetaActividadPOA } from '@/components/ui/TarjetaActividadPrinsipal';
import { ModalSubactividades } from '@/components/ui/ModalSubactividades';
import { ModalEditarFichaTecnica } from '@/components/ui/ModalFichaTecnica';
import { ModalBancoActividades } from '@/components/ui/ModalBancoActividades';
import { SubactividadFilaForm, SubactividadFilaProps, DatosFormularioFicha } from '@/types/poa-contratos';

function propsAFilaForm(sub: SubactividadFilaProps): SubactividadFilaForm {
  return {
    idUiTemporal: sub.id,
    idBackend: sub.id,
    descripcionTarea: sub.descripcion,
    fechaInicio: sub.fechaInicioFormateada,
    fechaTermino: sub.fechaTerminoFormateada,
    tipo: 'AUDITORIA'
  };
}

export default function PoaPage() {
  const cabecera = usePoaStore((state) => state.cabecera);
  const actividades = usePoaStore((state) => state.actividades);
  const cargandoInicial = usePoaStore((state) => state.cargandoInicial);
  const cargarPoaInicial = usePoaStore((state) => state.cargarPoaInicial);
  
  // Variables Store: Subactividades
  const sugerenciasSubactividades = usePoaStore((state) => state.sugerenciasSubactividades);
  const sincronizarSubactividades = usePoaStore((state) => state.sincronizarSubactividades);
  
  // Variables Store: Ficha Técnica
  const editarFichaTecnica = usePoaStore((state) => state.editarFichaTecnica);
  const auditoresDisponibles = usePoaStore((state) => state.auditoresDisponibles);
  const cargarAuditores = usePoaStore((state) => state.cargarAuditores);
  const bancoActividades = usePoaStore((state) => state.bancoActividades);
  const cargandoBanco = usePoaStore((state) => state.cargandoBanco);
  const cargarBancoActividades = usePoaStore((state) => state.cargarBancoActividades);
  const seleccionarActividadBanco = usePoaStore((state) => state.seleccionarActividadBanco);
  const crearNuevaActividad = usePoaStore((state) => state.crearNuevaActividad);
  const obtenerSubactividadesSugeridas = usePoaStore((state) => state.obtenerSubactividadesSugeridas);
  const crearSubactividadesMasivas = usePoaStore((state) => state.crearSubactividadesMasivas);

  const expandirTarjeta = usePoaStore((state) => state.expandirTarjeta);
  const borrarActividad = usePoaStore((state) => state.borrarActividad);

  // Estados Globales de Modales
  const [actividadActivaId, setActividadActivaId] = useState<string | null>(null);
  const [estaGuardando, setEstaGuardando] = useState(false);

  // Estados: Modal Subactividades
  const [modalSubactividadesAbierto, setModalSubactividadesAbierto] = useState(false);
  const [actividadActivaTitulo, setActividadActivaTitulo] = useState('');

  // Estados: Modal Ficha Técnica
  const [modalFichaAbierto, setModalFichaAbierto] = useState(false);

  useEffect(() => {
    cargarPoaInicial();
    cargarAuditores(); // Traemos el catálogo de auditores al montar la página
  }, [cargarPoaInicial, cargarAuditores]);

  // Derivamos la actividad seleccionada
  const actividadActiva = actividades.find(a => a.idActividad === actividadActivaId);

  // Valores pre-cargados para Subactividades
  const subactividadesIniciales = actividadActiva
    ? actividadActiva.subactividades.map(propsAFilaForm)
    : [];

  // Valores pre-cargados para la Ficha Técnica (Mapeando los datos que ya vienen de la Actividad)
  const valoresInicialesFicha: DatosFormularioFicha | undefined = actividadActiva ? {
    titulo: actividadActiva.titulo,
    justificacion: actividadActiva.fichaTecnica?.justificacion || '',
    objetivoGeneral: actividadActiva.fichaTecnica?.objetivoGeneral || '',
    objetivosParticulares: actividadActiva.fichaTecnica?.objetivosParticulares || '',
    metaProyecto: actividadActiva.fichaTecnica?.metaProyecto || '',
    indicadores: actividadActiva.fichaTecnica?.indicadores || '',
    auditoresSeleccionadosIds: [], 
  } : undefined;

  // HANDLERS SUBACTIVIDADES
  const handleAbrirModalSubactividades = (idActividad: string, titulo: string) => {
    setActividadActivaId(idActividad);
    setActividadActivaTitulo(titulo);
    setModalSubactividadesAbierto(true);
  };

  const handleGuardarSincronizacion = async (filas: SubactividadFilaForm[]) => {
    if (!actividadActivaId) return;
    setEstaGuardando(true);
    try {
      const ok = await sincronizarSubactividades(actividadActivaId, filas);
      if (ok) setModalSubactividadesAbierto(false);
      else alert('No se pudo guardar las subactividades. Intenta de nuevo.');
    } finally {
      setEstaGuardando(false);
    }
  };

  // HANDLERS FICHA TÉCNICA
  const handleAbrirModalFichaTecnica = async (idActividad: string) => {
    // Si quieres asegurar que la info de la ficha esté cargada antes de abrir el modal:
    await expandirTarjeta(idActividad); 
    setActividadActivaId(idActividad);
    setModalFichaAbierto(true);
  };

  const handleGuardarFichaTecnica = async (datosIngresados: DatosFormularioFicha) => {
    if (!actividadActivaId) return;
    setEstaGuardando(true);
    try {
      const exito = await editarFichaTecnica(actividadActivaId, datosIngresados);
      if (exito) setModalFichaAbierto(false);
      else alert('Error al guardar la Ficha Técnica.');
    } finally {
      setEstaGuardando(false);
    }
  };

  const [wizardCreacion, setWizardCreacion] = useState<{
  paso: number; // 0: Cerrado, 1: Seleccion, 2: Ficha, 3: Subactividades
  fichaData: DatosFormularioFicha | null;
  bancoId: string | null;
  actividadId: string | null;
  }>({ paso: 0, fichaData: null, bancoId: null, actividadId: null });

  const abrirWizardCreacion = async () => {
    setWizardCreacion({ paso: 1, fichaData: null, bancoId: null, actividadId: null });
    await cargarBancoActividades();
  };

  const seleccionarDelBanco = async (idBanco: string) => {
    await seleccionarActividadBanco(idBanco);
    const detalle = usePoaStore.getState().actividadBancoSeleccionada;
    setWizardCreacion({
      paso: 2,
      bancoId: idBanco,
      actividadId: null,
      fichaData: {
        titulo: detalle?.titulo || '',
        justificacion: detalle?.justificacion || '',
        objetivoGeneral: detalle?.objetivoGeneral || '',
        objetivosParticulares: detalle?.objetivosParticulares || '',
        metaProyecto: detalle?.metaProyecto || '',
        indicadores: detalle?.indicadores || '',
        auditoresSeleccionadosIds: [],
      },
    });
  };

  const crearDesdeCero = () => {
    setWizardCreacion({
      paso: 2,
      fichaData: {
        titulo: '', justificacion: '', objetivoGeneral: '', objetivosParticulares: '',
        metaProyecto: '', indicadores: '', auditoresSeleccionadosIds: [],
      },
      bancoId: null,
      actividadId: null,
    });
  };

  const cerrarWizard = () => setWizardCreacion({ paso: 0, fichaData: null, bancoId: null, actividadId: null });

  const guardarFichaNueva = async (datosIngresados: DatosFormularioFicha) => {
    setEstaGuardando(true);
    try {
      const actividadId = wizardCreacion.actividadId
        ? wizardCreacion.actividadId
        : await crearNuevaActividad(datosIngresados, wizardCreacion.bancoId);
      if (!actividadId) return;
      if (wizardCreacion.actividadId) {
        const actualizada = await editarFichaTecnica(actividadId, datosIngresados);
        if (!actualizada) return;
      }
      if (wizardCreacion.bancoId) await obtenerSubactividadesSugeridas(wizardCreacion.bancoId);
      setWizardCreacion((prev) => ({ ...prev, paso: 3, fichaData: datosIngresados, actividadId }));
    } finally {
      setEstaGuardando(false);
    }
  };

  const guardarSubactividadesNuevas = async (filas: SubactividadFilaForm[]) => {
    if (!wizardCreacion.actividadId) return;
    setEstaGuardando(true);
    try {
      const ok = await crearSubactividadesMasivas(wizardCreacion.actividadId, filas);
      if (ok) cerrarWizard();
      else alert('No se pudieron guardar las sub-actividades. Intenta de nuevo.');
    } finally {
      setEstaGuardando(false);
    }
  };

  if (cargandoInicial || !cabecera) {
    return (
      <div className="flex justify-center items-center h-full text-indigo-600 font-bold animate-pulse py-20">
        Cargando información del POA...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Actividades Programadas ({actividades.length})
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Configura las actividades e indicadores para este ciclo fiscal.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`border rounded-lg px-3 py-2 flex items-center gap-2 ${
            cabecera.estadoActual === 'EN_REVISION' ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-yellow-100 border-yellow-300 text-yellow-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${cabecera.estadoActual === 'EN_REVISION' ? 'bg-amber-500' : 'bg-yellow-500'}`}></span>
            <span className="text-sm font-semibold">Estado: {cabecera.estadoActual.replace('_', ' ')}</span>
          </div>
          <button onClick={abrirWizardCreacion} disabled={!cabecera.puedeEditar} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50">
            <span>+</span> Agregar Actividad
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {actividades.map((actividad, index) => (
          <TarjetaActividadPOA
            key={actividad.idActividad}
            {...actividad}
            consecutivoIndex={index}
            onAbrirModalSubactividades={handleAbrirModalSubactividades}
            onConfigurarFichaTecnica={() => handleAbrirModalFichaTecnica(actividad.idActividad)}
            onExpandirTarjeta={() => expandirTarjeta(actividad.idActividad)}
            onBorrarActividad={() => borrarActividad(actividad.idActividad)}
          />
        ))}
      </div>

      {/* RENDERIZADO DE MODALES CENTRALIZADOS */}
      
      <ModalSubactividades
        key={`${actividadActivaId}-${modalSubactividadesAbierto}`}
        isOpen={modalSubactividadesAbierto}
        tituloActividadPadre={actividadActivaTitulo}
        subactividadesIniciales={subactividadesIniciales}
        sugerenciasBanco={sugerenciasSubactividades}
        estaGuardando={estaGuardando}
        onRegresarAFicha={() => setModalSubactividadesAbierto(false)}
        onGuardarSincronizacion={handleGuardarSincronizacion}
      />

      {modalFichaAbierto && actividadActiva && (
        <ModalEditarFichaTecnica
          valoresIniciales={valoresInicialesFicha}
          listaAuditoresDisponibles={auditoresDisponibles}
          estaGuardando={estaGuardando}
          onCancelar={() => setModalFichaAbierto(false)}
          onContinuarASubactividades={handleGuardarFichaTecnica}
        />
      )}

      <ModalBancoActividades
        isOpen={wizardCreacion.paso === 1}
        actividadesDisponibles={bancoActividades}
        estaCargando={cargandoBanco}
        onSeleccionar={seleccionarDelBanco}
        onCrearPersonalizada={crearDesdeCero}
        onCancelar={cerrarWizard}
      />

      {wizardCreacion.paso === 2 && wizardCreacion.fichaData && (
        <ModalEditarFichaTecnica
          valoresIniciales={wizardCreacion.fichaData}
          listaAuditoresDisponibles={auditoresDisponibles}
          estaGuardando={estaGuardando}
          onCancelar={cerrarWizard}
          onContinuarASubactividades={guardarFichaNueva}
        />
      )}

      {wizardCreacion.paso === 3 && wizardCreacion.fichaData && (
        <ModalSubactividades
          key={`wizard-${wizardCreacion.actividadId}`}
          isOpen
          tituloActividadPadre={wizardCreacion.fichaData.titulo}
          subactividadesIniciales={[]}
            sugerenciasBanco={wizardCreacion.bancoId ? sugerenciasSubactividades : []}
          estaGuardando={estaGuardando}
          onRegresarAFicha={() => setWizardCreacion((prev) => ({ ...prev, paso: 2 }))}
          onGuardarSincronizacion={guardarSubactividadesNuevas}
        />
      )}
    </div>
  );
}