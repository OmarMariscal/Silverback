'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePoaStore } from '@/store/poa.store';
import type {
  DatosFormularioFicha,
  SubactividadFilaForm,
  TarjetaActividadPOAData,
} from '@/types/poa-contratos';

import { ContenedorContralorPoa } from '@/components/poa/ContenedorContralorPoa';
import EstadoCarga from '@/components/ui/EstadoCarga';
import BtnReintentar from '@/components/ui/BtnReintentar';

export default function ContralorPoaPage() {
  const router = useRouter();
  const {
    cabecera,
    actividades,
    cargandoInicial,
    mensajeError,
    erroresValidacionPresentar,
    bancoActividades,
    cargandoBanco,
    auditoresDisponibles,
    sugerenciasSubactividades,
    cargarPoaInicial,
    cargarAuditores,
    cargarBancoActividades,
    seleccionarActividadBanco,
    obtenerSubactividadesSugeridas,
    crearNuevaActividad,
    editarFichaTecnica,
    crearSubactividadesMasivas,
    sincronizarSubactividades,
    expandirTarjeta,
    enviarPoaARevision,
    cancelarEnvioPoa,
    borrarActividad,
  } = usePoaStore();

  const [pasoWizard, setPasoWizard] = useState<'CERRADO' | 'BANCO' | 'FICHA' | 'SUBACTIVIDADES'>('CERRADO');
  const [idBancoSeleccionado, setIdBancoSeleccionado] = useState<string | null>(null);
  const [actividadEditando, setActividadEditando] = useState<TarjetaActividadPOAData | null>(null);
  const [actividadSubId, setActividadSubId] = useState<string | null>(null);
  const [actividadSubTitulo, setActividadSubTitulo] = useState<string>('');
  const [valoresInicialesFicha, setValoresInicialesFicha] = useState<DatosFormularioFicha | undefined>(undefined);
  const [subactividadesInicialesForm, setSubactividadesInicialesForm] = useState<SubactividadFilaForm[]>([]);
  const [esFlujoCreacion, setEsFlujoCreacion] = useState(false);
  const [guardandoModal, setGuardandoModal] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  useEffect(() => {
    void cargarPoaInicial();
    void cargarAuditores();
  }, [cargarPoaInicial, cargarAuditores]);

  const cerrarWizard = () => {
    setPasoWizard('CERRADO');
    setErrorModal(null);
  };

  const abrirWizardCreacion = async () => {
    setEsFlujoCreacion(true);
    setActividadEditando(null);
    setIdBancoSeleccionado(null);
    setValoresInicialesFicha(undefined);
    setSubactividadesInicialesForm([]);
    setErrorModal(null);
    setPasoWizard('BANCO');
    await cargarBancoActividades();
  };

  const manejarSeleccionBanco = async (idBanco: string) => {
    setIdBancoSeleccionado(idBanco);
    const detalle = await seleccionarActividadBanco(idBanco);
    await obtenerSubactividadesSugeridas(idBanco);
    setValoresInicialesFicha({
      titulo: detalle?.titulo || '',
      justificacion: detalle?.justificacion || '',
      objetivoGeneral: detalle?.objetivoGeneral || '',
      objetivosParticulares: '',
      metaProyecto: '',
      indicadores: '',
      auditoresSeleccionadosIds: [],
    });
    setPasoWizard('FICHA');
  };

  const manejarCrearPersonalizada = () => {
    setIdBancoSeleccionado(null);
    setValoresInicialesFicha(undefined);
    setPasoWizard('FICHA');
  };

  const abrirEdicionFicha = async (actividad: TarjetaActividadPOAData) => {
    setEsFlujoCreacion(false);
    setActividadEditando(actividad);
    setErrorModal(null);

    if (!actividad.fichaTecnica) {
      await expandirTarjeta(actividad.idActividad);
    }

    const actualizada =
      usePoaStore.getState().actividades.find((a) => a.idActividad === actividad.idActividad) ||
      actividad;

    setValoresInicialesFicha({
      titulo: actualizada.titulo,
      justificacion: actualizada.fichaTecnica?.justificacion || '',
      objetivoGeneral: actualizada.fichaTecnica?.objetivoGeneral || '',
      objetivosParticulares: actualizada.fichaTecnica?.objetivosParticulares || '',
      metaProyecto: actualizada.fichaTecnica?.metaProyecto || '',
      indicadores: actualizada.fichaTecnica?.indicadores || '',
      auditoresSeleccionadosIds:
        actualizada.fichaTecnica?.equipoAuditor.map((aud) => aud.id) || [],
    });
    setPasoWizard('FICHA');
  };

  const abrirModalSubactividadesExistente = async (idActividad: string, tituloActividad: string) => {
    setEsFlujoCreacion(false);
    setIdBancoSeleccionado(null);
    setActividadSubId(idActividad);
    setActividadSubTitulo(tituloActividad);
    setErrorModal(null);

    await expandirTarjeta(idActividad);
    const act = usePoaStore.getState().actividades.find((a) => a.idActividad === idActividad);

    const filas: SubactividadFilaForm[] = (act?.subactividades || []).map((sub) => ({
      idUiTemporal: sub.id,
      idBackend: sub.id,
      descripcionTarea: sub.descripcion,
      fechaInicio: sub.fechaInicioFormateada,
      fechaTermino: sub.fechaTerminoFormateada,
      tipo: 'REVISION',
    }));

    setSubactividadesInicialesForm(filas);
    setPasoWizard('SUBACTIVIDADES');
  };

  const manejarContinuarASubactividades = async (datosIngresados: DatosFormularioFicha) => {
    setGuardandoModal(true);
    setErrorModal(null);
    try {
      if (esFlujoCreacion) {
        const nuevoId = await crearNuevaActividad(datosIngresados, idBancoSeleccionado);
        if (!nuevoId) {
          setErrorModal('No se pudo crear la actividad. Verifica los datos e intenta nuevamente.');
          return;
        }
        setActividadSubId(nuevoId);
        setActividadSubTitulo(datosIngresados.titulo);
        setSubactividadesInicialesForm([]);
        setPasoWizard('SUBACTIVIDADES');
      } else if (actividadEditando) {
        const ok = await editarFichaTecnica(actividadEditando.idActividad, datosIngresados);
        if (!ok) {
          setErrorModal('No se pudo actualizar la ficha técnica.');
          return;
        }
        await abrirModalSubactividadesExistente(
          actividadEditando.idActividad,
          datosIngresados.titulo,
        );
      }
    } finally {
      setGuardandoModal(false);
    }
  };

  const manejarGuardarSoloFicha = async (datosIngresados: DatosFormularioFicha) => {
    if (!actividadEditando) return;
    setGuardandoModal(true);
    setErrorModal(null);
    try {
      const id = actividadEditando.idActividad;
      const ok = await editarFichaTecnica(id, datosIngresados);
      if (!ok) {
        setErrorModal('No se pudo guardar la ficha técnica.');
        return;
      }
      await expandirTarjeta(id);
      cerrarWizard();
    } finally {
      setGuardandoModal(false);
    }
  };

  const manejarGuardarSubactividades = async (filas: SubactividadFilaForm[]) => {
    if (!actividadSubId) return;
    setGuardandoModal(true);
    setErrorModal(null);
    try {
      const id = actividadSubId;
      const ok = esFlujoCreacion
        ? await crearSubactividadesMasivas(id, filas)
        : await sincronizarSubactividades(id, filas);
      if (!ok) {
        setErrorModal('No se pudieron guardar las subactividades.');
        return;
      }
      await expandirTarjeta(id);
      cerrarWizard();
    } finally {
      setGuardandoModal(false);
    }
  };

  if (cargandoInicial) {
    return <EstadoCarga mensaje="Cargando POA..." variante="spinner" />;
  }

  if (mensajeError) {
    return (
      <BtnReintentar
        mensajePrincipal="No se pudo cargar el Plan Operativo Anual."
        mensajeSecundario={mensajeError}
        onClickReintentar={() => void cargarPoaInicial()}
      />
    );
  }

  if (!cabecera) {
    return <div className="p-10 text-rose-700">No hay un POA disponible para esta sesión.</div>;
  }

  return (
    <ContenedorContralorPoa
      cabecera={cabecera}
      actividades={actividades}
      erroresValidacionPresentar={erroresValidacionPresentar}
      bancoActividades={bancoActividades}
      cargandoBanco={cargandoBanco}
      auditoresDisponibles={auditoresDisponibles}
      sugerenciasSubactividades={idBancoSeleccionado ? sugerenciasSubactividades : []}
      pasoWizard={pasoWizard}
      actividadSubId={actividadSubId}
      actividadSubTitulo={actividadSubTitulo}
      valoresInicialesFicha={valoresInicialesFicha}
      subactividadesInicialesForm={subactividadesInicialesForm}
      esFlujoCreacion={esFlujoCreacion}
      guardandoModal={guardandoModal}
      errorModal={errorModal}
      onAbrirWizardCreacion={() => void abrirWizardCreacion()}
      onPresentarPoa={() => void enviarPoaARevision()}
      onCancelarEnvioPoa={() => void cancelarEnvioPoa()}
      onExpandirActividad={(idAct) => void expandirTarjeta(idAct)}
      onBorrarActividad={(idAct) => void borrarActividad(idAct)}
      onEditarActividad={(act) => void abrirEdicionFicha(act)}
      onGestionarSubactividades={(idAct, tituloAct) =>
        void abrirModalSubactividadesExistente(idAct, tituloAct)
      }
      onAbrirSubactividad={(subActividadId) =>
        router.push(`/contralor/poa/subactividades/${subActividadId}`)
      }
      onSeleccionarBanco={(idBanco) => void manejarSeleccionBanco(idBanco)}
      onCrearPersonalizada={manejarCrearPersonalizada}
      onCerrarWizard={cerrarWizard}
      onContinuarASubactividades={manejarContinuarASubactividades}
      onGuardarSoloFicha={!esFlujoCreacion ? manejarGuardarSoloFicha : undefined}
      onGuardarSubactividades={(filas) => void manejarGuardarSubactividades(filas)}
    />
  );
}