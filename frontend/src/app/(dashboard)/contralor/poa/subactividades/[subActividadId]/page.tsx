// src/app/(dashboard)/contralor/poa/subactividades/[subActividadId]/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import ContenedorSubactividad from '@/components/poa/subactividades/ContenedorSubactividad';
import BtnReintentar from '@/components/ui/BtnReintentar';
import EstadoCarga from '@/components/ui/EstadoCarga';
import { useSubActividadEntregaStore } from '@/store/subactividades-entrega.store';

export default function EntregaSubactividadPage() {
  const { subActividadId } = useParams<{ subActividadId: string }>();
  const store = useSubActividadEntregaStore();
  const inicializarVista = useSubActividadEntregaStore((state) => state.inicializarVista);
  const historialInicializadoParaRef = useRef<string | null>(null);
  const [cargandoHistorialInicial, setCargandoHistorialInicial] = useState(false);

  useEffect(() => {
    if (subActividadId) void inicializarVista(subActividadId);
  }, [inicializarVista, subActividadId]);

  const vista = store.obtenerViewModelUI();
  const vistaPerteneceARuta = Boolean(vista && vista.subActividadId === subActividadId);
  const buzonCerrado = Boolean(vistaPerteneceARuta && vista && vista.buzon.modo !== 'CARGA');
  const historialMasReciente =
    vistaPerteneceARuta && vista
      ? (vista.historialNodos.find((nodo) => nodo.esVersionActual) ?? vista.historialNodos[0])
      : undefined;

  const debeAbrirHistorialInicial = Boolean(
    !store.estaCargando &&
      vistaPerteneceARuta &&
      buzonCerrado &&
      historialMasReciente &&
      !vista?.esModoHistorico &&
      historialInicializadoParaRef.current !== subActividadId,
  );

  useEffect(() => {
    if (!debeAbrirHistorialInicial || !historialMasReciente || !subActividadId) return;

    historialInicializadoParaRef.current = subActividadId;
    setCargandoHistorialInicial(true);

    void Promise.resolve(
      historialMasReciente.onClickSeleccionarVersion(historialMasReciente.idVersion),
    ).finally(() => {
      setCargandoHistorialInicial(false);
    });
  }, [debeAbrirHistorialInicial, historialMasReciente, subActividadId]);

  if (
    store.estaCargando ||
    cargandoHistorialInicial ||
    debeAbrirHistorialInicial ||
    (!vistaPerteneceARuta && !store.mensajeError)
  ) {
    return (
      <EstadoCarga
        mensaje="Cargando información de la subactividad..."
        variante="spinner"
      />
    );
  }

  if (store.mensajeError || !vista) {
    return (
      <BtnReintentar
        mensajePrincipal="No se pudo cargar la información de la subactividad."
        mensajeSecundario={
          store.mensajeError ||
          'Ocurrió un error inesperado al intentar obtener la información de la subactividad.'
        }
        onClickReintentar={() => {
          historialInicializadoParaRef.current = null;
          void inicializarVista(subActividadId);
        }}
      />
    );
  }

  return <ContenedorSubactividad vista={vista} />;
}