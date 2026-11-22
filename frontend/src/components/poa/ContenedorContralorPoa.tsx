'use client';

import React from 'react';
import type {
  BancoActividadItemProps,
  CabeceraPOAData,
  DatosFormularioFicha,
  OpcionAuditorProps,
  SubactividadFilaForm,
  SubactividadSugerida,
  TarjetaActividadPOAData,
} from '@/types/poa-contratos';

import { HeaderPoaContralor } from './HeaderPoaContralor';
import { MensajeDevolucion } from './MensajeDevolucion';
import { ListaActividades } from './actividadPrincipal/ListaActividades';
import { ModalBancoActividades } from './actividadPrincipal/modales/ModalBancoActividades';
import { ModalEditarFichaTecnica } from './actividadPrincipal/modales/ModalFichaTecnica';
import { ModalSubactividades } from './actividadPrincipal/modales/ModalSubactividades';

export interface ContenedorContralorPoaProps {
  cabecera: CabeceraPOAData;
  actividades: TarjetaActividadPOAData[];
  erroresValidacionPresentar: string[] | null;
  bancoActividades: BancoActividadItemProps[];
  cargandoBanco: boolean;
  auditoresDisponibles: OpcionAuditorProps[];
  sugerenciasSubactividades: SubactividadSugerida[];
  pasoWizard: 'CERRADO' | 'BANCO' | 'FICHA' | 'SUBACTIVIDADES';
  actividadSubId: string | null;
  actividadSubTitulo: string;
  valoresInicialesFicha?: DatosFormularioFicha;
  subactividadesInicialesForm: SubactividadFilaForm[];
  esFlujoCreacion: boolean;
  guardandoModal: boolean;
  errorModal: string | null;
  onAbrirWizardCreacion: () => void;
  onPresentarPoa: () => void;
  onCancelarEnvioPoa: () => void;
  onExpandirActividad: (idActividad: string) => void;
  onBorrarActividad: (idActividad: string) => void;
  onEditarActividad: (actividad: TarjetaActividadPOAData) => void;
  onGestionarSubactividades: (idActividad: string, tituloActividad: string) => void;
  onAbrirSubactividad: (subActividadId: string) => void;
  onSeleccionarBanco: (idBanco: string) => void;
  onCrearPersonalizada: () => void;
  onCerrarWizard: () => void;
  onContinuarASubactividades: (datos: DatosFormularioFicha) => Promise<void>;
  onGuardarSoloFicha?: (datos: DatosFormularioFicha) => Promise<void>;
  onGuardarSubactividades: (filas: SubactividadFilaForm[]) => void;
}

export function ContenedorContralorPoa({
  cabecera,
  actividades,
  erroresValidacionPresentar,
  bancoActividades,
  cargandoBanco,
  auditoresDisponibles,
  sugerenciasSubactividades,
  pasoWizard,
  actividadSubId,
  actividadSubTitulo,
  valoresInicialesFicha,
  subactividadesInicialesForm,
  esFlujoCreacion,
  guardandoModal,
  errorModal,
  onAbrirWizardCreacion,
  onPresentarPoa,
  onCancelarEnvioPoa,
  onExpandirActividad,
  onBorrarActividad,
  onEditarActividad,
  onGestionarSubactividades,
  onAbrirSubactividad,
  onSeleccionarBanco,
  onCrearPersonalizada,
  onCerrarWizard,
  onContinuarASubactividades,
  onGuardarSoloFicha,
  onGuardarSubactividades,
}: ContenedorContralorPoaProps) {
  return (
    <div>
      <HeaderPoaContralor
        cabecera={cabecera}
        totalActividades={actividades.length}
        onAgregarActividad={onAbrirWizardCreacion}
        onPresentarPoa={onPresentarPoa}
        onCancelarEnvioPoa={onCancelarEnvioPoa}
      />

      {cabecera.mensajeDevolucion && (
        <div className="mb-6">
          <MensajeDevolucion mensaje={cabecera.mensajeDevolucion} />
        </div>
      )}

      {erroresValidacionPresentar && erroresValidacionPresentar.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 shadow-sm">
          <p className="font-bold">El POA necesita ajustes antes de enviarse:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {erroresValidacionPresentar.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {errorModal && pasoWizard !== 'CERRADO' && (
        <div className="fixed bottom-6 right-6 z-[60] rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 shadow-lg">
          {errorModal}
        </div>
      )}

      <ListaActividades
        actividades={actividades}
        puedeEditar={cabecera.puedeEditar}
        onExpandirActividad={onExpandirActividad}
        onBorrarActividad={onBorrarActividad}
        onEditarActividad={onEditarActividad}
        onGestionarSubactividades={onGestionarSubactividades}
        onAbrirSubactividad={onAbrirSubactividad}
      />

      {pasoWizard === 'BANCO' && (
        <ModalBancoActividades
          isOpen
          actividadesDisponibles={bancoActividades}
          estaCargando={cargandoBanco}
          onSeleccionar={onSeleccionarBanco}
          onCrearPersonalizada={onCrearPersonalizada}
          onCancelar={onCerrarWizard}
        />
      )}

      {pasoWizard === 'FICHA' && (
        <ModalEditarFichaTecnica
          valoresIniciales={valoresInicialesFicha}
          listaAuditoresDisponibles={auditoresDisponibles}
          estaGuardando={guardandoModal}
          onContinuarASubactividades={onContinuarASubactividades}
          onGuardar={onGuardarSoloFicha}
          onCancelar={onCerrarWizard}
        />
      )}

      {pasoWizard === 'SUBACTIVIDADES' && (
        <ModalSubactividades
          key={`${actividadSubId ?? 'nueva'}-${esFlujoCreacion ? 'crear' : 'editar'}`}
          isOpen
          tituloActividadPadre={actividadSubTitulo}
          subactividadesIniciales={subactividadesInicialesForm}
          sugerenciasBanco={sugerenciasSubactividades}
          estaGuardando={guardandoModal}
          onGuardarSincronizacion={onGuardarSubactividades}
          onRegresarAFicha={onCerrarWizard}
        />
      )}
    </div>
  );
}