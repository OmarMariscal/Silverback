'use client';

import { useEffect, useState } from 'react';
import { usePoaStore } from '@/store/poa.store';
import { TarjetaActividadPOA } from '@/components/ui/TarjetaActividadPrinsipal';
import { ModalSubactividades } from '@/components/ui/ModalSubactividades';
import { ModalEditarFichaTecnica } from '@/components/ui/ModalFichaTecnica';
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
  }>({ paso: 0, fichaData: null });

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
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
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
    </div>
  );
}