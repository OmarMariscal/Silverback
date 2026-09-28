'use client';

import { useEffect, useState } from 'react';
import { usePoaStore } from '@/store/poa.store';
import { TarjetaActividadPOA } from '@/components/ui/TarjetaActividadPrinsipal';
import { ModalSubactividades } from '@/components/ui/ModalSubactividades';
import { ModalEditarFichaTecnica } from '@/components/ui/ModalFichaTecnica';
import { ModalBancoActividades } from '@/components/ui/ModalBancoActividades';
import type { SubactividadFilaForm, SubactividadFilaProps, DatosFormularioFicha } from '@/types/poa-contratos';
import { useLayoutStore } from '@/store/layout.store';
import RoleShell from '@/modules/perfiles/role-shell';

function propsAFilaForm(sub: SubactividadFilaProps): SubactividadFilaForm {
  return {
    idUiTemporal: sub.id,
    idBackend: sub.id,
    descripcionTarea: sub.descripcion,
    fechaInicio: sub.fechaInicioFormateada,
    fechaTermino: sub.fechaTerminoFormateada,
    tipo: 'AUDITORIA',
  };
}

export default function ContralorPoaPage() {
  const cabecera = usePoaStore((state) => state.cabecera);
  const actividades = usePoaStore((state) => state.actividades);
  const cargandoInicial = usePoaStore((state) => state.cargandoInicial);
  const cargarPoaInicial = usePoaStore((state) => state.cargarPoaInicial);

  const sugerenciasSubactividades = usePoaStore((state) => state.sugerenciasSubactividades);
  const sincronizarSubactividades = usePoaStore((state) => state.sincronizarSubactividades);

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

  const [actividadActivaId, setActividadActivaId] = useState<string | null>(null);
  const [estaGuardando, setEstaGuardando] = useState(false);
  const [modalSubactividadesAbierto, setModalSubactividadesAbierto] = useState(false);
  const [actividadActivaTitulo, setActividadActivaTitulo] = useState('');
  const [modalFichaAbierto, setModalFichaAbierto] = useState(false);

  useEffect(() => {
    useLayoutStore.getState().setTituloPantalla(
      cabecera ? `Plan Operativo Anual ${cabecera.anioFiscal}` : 'Plan Operativo Anual 2026'
    );
  }, [cabecera]);

  useEffect(() => {
    cargarPoaInicial();
    cargarAuditores();
  }, [cargarPoaInicial, cargarAuditores]);

  const actividadActiva = actividades.find((a) => a.idActividad === actividadActivaId);

  const subactividadesIniciales = actividadActiva
    ? actividadActiva.subactividades.map(propsAFilaForm)
    : [];

  const valoresInicialesFicha: DatosFormularioFicha | undefined = actividadActiva
    ? {
        titulo: actividadActiva.titulo,
        justificacion: actividadActiva.fichaTecnica?.justificacion || '',
        objetivoGeneral: actividadActiva.fichaTecnica?.objetivoGeneral || '',
        objetivosParticulares: actividadActiva.fichaTecnica?.objetivosParticulares || '',
        metaProyecto: actividadActiva.fichaTecnica?.metaProyecto || '',
        indicadores: actividadActiva.fichaTecnica?.indicadores || '',
        auditoresSeleccionadosIds: [],
      }
    : undefined;

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

  const handleAbrirModalFichaTecnica = async (idActividad: string) => {
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
    paso: number;
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
        titulo: '',
        justificacion: '',
        objetivoGeneral: '',
        objetivosParticulares: '',
        metaProyecto: '',
        indicadores: '',
        auditoresSeleccionadosIds: [],
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
      <RoleShell perfil="CONTRALOR" modulo="poa" title="Plan Operativo Anual" subtitle="Cargando información del POA...">
        <div className="flex items-center justify-center py-20 text-lg font-bold text-indigo-600 animate-pulse">
          Cargando información del POA...
        </div>
      </RoleShell>
    );
  }

  return (
    <RoleShell
      perfil="CONTRALOR"
      modulo="poa"
      title={`Plan Operativo Anual ${cabecera.anioFiscal}`}
      subtitle="Configura las actividades e indicadores para este ciclo fiscal."
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Actividades Programadas ({actividades.length})</h3>
            <p className="mt-1 text-sm text-slate-600">Configura las actividades e indicadores para este ciclo fiscal.</p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                cabecera.estadoActual === 'EN_REVISION'
                  ? 'border-amber-300 bg-amber-100 text-amber-800'
                  : 'border-yellow-300 bg-yellow-100 text-yellow-800'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  cabecera.estadoActual === 'EN_REVISION' ? 'bg-amber-500' : 'bg-yellow-500'
                }`}
              />
              <span className="text-sm font-semibold">Estado: {cabecera.estadoActual.replace('_', ' ')}</span>
            </div>
            <button
              onClick={abrirWizardCreacion}
              disabled={!cabecera.puedeEditar}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
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

        {wizardCreacion.paso === 3 && wizardCreacion.actividadId && wizardCreacion.fichaData && (
          <ModalSubactividades
            isOpen={true}
            tituloActividadPadre={wizardCreacion.fichaData.titulo}
            subactividadesIniciales={[]}
            sugerenciasBanco={sugerenciasSubactividades}
            estaGuardando={estaGuardando}
            onRegresarAFicha={cerrarWizard}
            onGuardarSincronizacion={guardarSubactividadesNuevas}
          />
        )}
      </div>
    </RoleShell>
  );
}
