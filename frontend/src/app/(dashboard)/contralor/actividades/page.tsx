'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActividadesStore } from '@/store/actividades.store';
import { getModulePath } from '@/modules/perfiles/role-menu';
import { ContenedorActividades } from '@/components/actividades/ContenedorActividades';
import EstadoCarga from '@/components/ui/EstadoCarga';

const estadoLabels: Record<string, string> = {
  SIN_EMPEZAR: 'Sin Empezar',
  SOLICITADO: 'Por Autorizar',
  EN_PROGRESO: 'En Proceso',
  EN_REVISION: 'Por Revisar',
  DEVUELTA: 'Devuelta',
  CONCLUIDA: 'Concluida',
};

const semaforoLabels: Record<string, string> = {
  A_TIEMPO: 'A Tiempo',
  VERDE: 'A Tiempo',
  PRECAUCION: 'En Alerta',
  AMARILLO: 'En Alerta',
  CRITICO: 'Crítico',
  ROJO: 'Crítico',
  GRIS: 'N/A',
};

function ContralorActividadesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    actividades,
    filtros,
    paginaActual,
    totalPaginas,
    totalRegistros,
    limite,
    estaCargando,
    mensajeError,
    cargarDirectorio,
    actualizarFiltro,
    cambiarPagina,
    limpiarFiltros,
  } = useActividadesStore();

  const [busqueda, setBusqueda] = useState(filtros.busqueda);
  const rutaBase = getModulePath('CONTRALOR', 'actividades');

  useEffect(() => {
    const estado = searchParams.get('estado_flujo') ?? '';
    const semaforo = searchParams.get('semaforo') ?? '';
    actualizarFiltro('estadoFlujo', Object.hasOwn(estadoLabels, estado) ? estado : '');
    actualizarFiltro(
      'semaforo',
      ['A_TIEMPO', 'CRITICO', 'PRECAUCION'].includes(semaforo) ? semaforo : '',
    );
  }, [searchParams, actualizarFiltro]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      actualizarFiltro('busqueda', busqueda);
      void cargarDirectorio(busqueda);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [busqueda, actualizarFiltro, cargarDirectorio]);

  useEffect(() => {
    void cargarDirectorio();
  }, [
    filtros.tipoActividad,
    filtros.estadoFlujo,
    filtros.semaforo,
    filtros.ordenarPor,
    paginaActual,
    cargarDirectorio,
  ]);

  const filtrosActivos = useMemo(
    () =>
      [
        filtros.busqueda ? `Búsqueda: ${filtros.busqueda}` : '',
        filtros.tipoActividad
          ? `Tipo: ${filtros.tipoActividad === 'AUDITORIA' ? 'Auditoría' : 'Revisión'}`
          : '',
        filtros.estadoFlujo ? `Estado: ${estadoLabels[filtros.estadoFlujo]}` : '',
        filtros.semaforo ? `Semáforo: ${semaforoLabels[filtros.semaforo]}` : '',
      ].filter(Boolean),
    [filtros],
  );

  const manejarQuitarFiltro = (filtroEtiqueta: string) => {
    if (filtroEtiqueta.startsWith('Búsqueda:')) {
      setBusqueda('');
      actualizarFiltro('busqueda', '');
      return;
    }
    if (filtroEtiqueta.startsWith('Tipo:')) {
      actualizarFiltro('tipoActividad', '');
      return;
    }
    if (filtroEtiqueta.startsWith('Estado:')) {
      actualizarFiltro('estadoFlujo', '');
      return;
    }
    if (filtroEtiqueta.startsWith('Semáforo:')) {
      actualizarFiltro('semaforo', '');
    }
  };

  const manejarLimpiarTodos = () => {
    limpiarFiltros();
    setBusqueda('');
    router.replace(rutaBase);
  };

  return (
    <ContenedorActividades
      rol="CONTRALOR"
      actividades={actividades}
      busqueda={busqueda}
      filtros={filtros}
      filtrosActivos={filtrosActivos}
      paginaActual={paginaActual}
      totalPaginas={totalPaginas}
      totalRegistros={totalRegistros}
      limite={limite}
      estaCargando={estaCargando}
      mensajeError={mensajeError}
      onBusquedaChange={setBusqueda}
      onFiltroChange={(nombre, valor) => {
        if (
          nombre === 'tipoActividad' ||
          nombre === 'estadoFlujo' ||
          nombre === 'semaforo'
        ) {
          actualizarFiltro(nombre, valor);
        }
      }}
      onOrdenarChange={(valor) => actualizarFiltro('ordenarPor', valor)}
      onQuitarFiltro={manejarQuitarFiltro}
      onLimpiarTodos={manejarLimpiarTodos}
      onSeleccionarActividad={(id) => router.push(`${getModulePath('CONTRALOR', 'poa')}/subactividades/${id}`)}
      onCambiarPagina={cambiarPagina}
    />
  );
}

export default function ContralorActividadesPage() {
  return (
    <Suspense
      fallback={
        <EstadoCarga mensaje="Cargando directorio de actividades..." variante="spinner" />
      }
    >
      <ContralorActividadesContent />
    </Suspense>
  );
}