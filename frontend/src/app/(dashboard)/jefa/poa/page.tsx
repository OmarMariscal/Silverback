'use client';

import React, { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useJefaPoaStore } from '@/store/poa-supervision.store';
import { ContenedorSupervisionPoa } from '@/components/poa/ContenedorSupervisionPoa';
import EstadoCarga from '@/components/ui/EstadoCarga';
import BtnReintentar from '@/components/ui/BtnReintentar';
import type { ModalDevolverPoaProps } from '@/types/poa-contratos';

function JefaSupervisionPoaContent() {
  const store = useJefaPoaStore();
  const searchParams = useSearchParams();
  const centroPreseleccionadoRef = useRef<string | null>(null);

  const centros = store.obtenerCentrosFiltradosUI();
  const inspector = store.obtenerInspectorPoaUI();

  useEffect(() => {
    void store.cargarCentros();
  }, []);

  useEffect(() => {
    const centroParam = searchParams.get('centroId') || searchParams.get('centro');
    if (
      !centroParam ||
      store.estaCargandoCentros ||
      store.centrosRaw.length === 0 ||
      centroPreseleccionadoRef.current === centroParam
    ) {
      return;
    }

    const centroEncontrado = store.centrosRaw.find(
      (c) =>
        c.id === centroParam ||
        c.clave.toLowerCase() === centroParam.toLowerCase(),
    );

    if (centroEncontrado) {
      centroPreseleccionadoRef.current = centroParam;
      store.setFiltroEstado('TODOS');
      void store.seleccionarCentro(centroEncontrado.id);
    }
  }, [searchParams, store.estaCargandoCentros, store.centrosRaw]);

  const mensajeError =
    'mensajeError' in store && typeof store.mensajeError === 'string'
      ? store.mensajeError
      : 'error' in store && typeof store.error === 'string'
        ? store.error
        : null;

  if (store.estaCargandoCentros) {
    return <EstadoCarga mensaje="Cargando centros y POAs..." variante="spinner" />;
  }

  if (mensajeError) {
    return (
      <BtnReintentar
        mensajePrincipal="No se pudo cargar la información de supervisión de POAs."
        mensajeSecundario={mensajeError}
        onClickReintentar={() => void store.cargarCentros()}
      />
    );
  }

  const sinInformacionDisponible =
    !store.kpis ||
    !Array.isArray(centros) ||
    (centros.length === 0 &&
      store.kpis.totalCentros === 0 &&
      store.filtroEstado === 'TODOS' &&
      store.busquedaTexto.trim() === '');

  if (sinInformacionDisponible) {
    return (
      <BtnReintentar
        mensajePrincipal="No hay información de centros o POAs disponible."
        mensajeSecundario="No se encontraron centros universitarios registrados para supervisar en este momento."
        onClickReintentar={() => void store.cargarCentros()}
      />
    );
  }

  const modalDevolver: ModalDevolverPoaProps = {
    estaAbierto: store.modalDevolverAbierto,
    centroClave: inspector?.centroClave ?? '',
    centroNombre: inspector?.centroNombre ?? '',
    anioFiscal: inspector?.anioFiscal ?? store.anioGlobal,
    contralorNombre: inspector?.contralorNombre ?? 'Sin asignar',
    observaciones: store.observacionesDevolucion,
    errorValidacion: store.errorObservaciones ?? undefined,
    estaEnviando: store.estaDevolviendo,
    onChangeObservaciones: store.setObservacionesDevolucion,
    onCerrar: store.cerrarModalDevolver,
    onConfirmarDevolucion: () => void store.confirmarDevolverPoa(),
  };

  return (
    <ContenedorSupervisionPoa
      centros={centros}
      inspector={inspector}
      modoVisualizacion={store.modoVisualizacion}
      filtroEstado={store.filtroEstado}
      kpis={store.kpis}
      busquedaTexto={store.busquedaTexto}
      anioGlobal={store.anioGlobal}
      aniosDisponibles={store.aniosDisponibles}
      modalDevolver={modalDevolver}
      onSetModoVisualizacion={store.setModoVisualizacion}
      onAlternarModoVisualizacion={store.alternarModoVisualizacion}
      onDeseleccionarCentro={store.deseleccionarCentro}
      onSetFiltroEstado={store.setFiltroEstado}
      onSetBusquedaTexto={store.setBusquedaTexto}
      onSetAnioGlobal={store.setAnioGlobal}
    />
  );
}

export default function JefaSupervisionPoaPage() {
  return (
    <Suspense fallback={<EstadoCarga mensaje="Cargando centros y POAs..." variante="spinner" />}>
      <JefaSupervisionPoaContent />
    </Suspense>
  );
}