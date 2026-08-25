'use client';

import { useEffect, useState } from 'react';
import { usePoaStore } from '@/store';
import { TarjetaActividadPOA } from '@/components/ui/TarjetaActividadPrinsipal'; // AJUSTA esta ruta a donde tengas el componente
import { ModalSubactividades } from '@/components/ui/ModalSubactividades'; // AJUSTA esta ruta a donde tengas el componente
import { SubactividadFilaForm, SubactividadFilaProps } from '@/types/poa-contratos';

// ------------------------------------------------------------------
// LIMITACIÓN CONOCIDA: subactividades en el store viene como
// SubactividadFilaProps (formato de SOLO LECTURA para la tabla: fechas ya
// formateadas como "15 Ene 26", sin el campo "tipo"). El modal necesita
// SubactividadFilaForm (fechas ISO editables + tipo). El contrato actual
// no guarda el dato crudo después de formatearlo, así que esto es una
// reconstrucción aproximada:
//  - la fecha se reconvierte de "15 Ene 26" a ISO.
//  - "tipo" no existe en el formato de tabla, así que se usa 'AUDITORIA'
//    por defecto. Si necesitas que el tipo real sobreviva el viaje de ida
//    y vuelta, lo correcto a futuro es que el store también guarde la
//    versión sin formatear, o pedirle ese dato a un endpoint dedicado.
// ------------------------------------------------------------------
const MESES: Record<string, string> = {
  Ene: '01', Feb: '02', Mar: '03', Abr: '04', May: '05', Jun: '06',
  Jul: '07', Ago: '08', Sep: '09', Oct: '10', Nov: '11', Dic: '12'
};

function fechaCortaAIso(fechaCorta: string): string {
  const partes = fechaCorta.trim().split(' ');
  if (partes.length !== 3) return '';
  const [dia, mesTexto, anioCorto] = partes;
  const mes = MESES[mesTexto];
  if (!mes) return '';
  return `20${anioCorto}-${mes}-${dia.padStart(2, '0')}`;
}

function propsAFilaForm(sub: SubactividadFilaProps): SubactividadFilaForm {
  return {
    idUiTemporal: sub.id,
    idBackend: sub.id,
    descripcionTarea: sub.descripcion,
    fechaInicio: fechaCortaAIso(sub.fechaInicioFormateada),
    fechaTermino: fechaCortaAIso(sub.fechaTerminoFormateada),
    tipo: 'AUDITORIA'
  };
}

export default function PoaPage() {
  // Usamos el store MOCK a propósito: así pruebas todo el flujo (expandir,
  // añadir sub-actividades, sincronizar) sin depender del backend ni de login.
  const {
    cabecera,
    actividades,
    cargandoInicial,
    cargarPoaInicial,
    sugerenciasSubactividades,
    sincronizarSubactividades
  } = usePoaStore();

  useEffect(() => {
    cargarPoaInicial();
  }, []);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [actividadActivaId, setActividadActivaId] = useState<string | null>(null);
  const [actividadActivaTitulo, setActividadActivaTitulo] = useState('');
  const [estaGuardando, setEstaGuardando] = useState(false);

  const actividadActiva = actividades.find(a => a.idActividad === actividadActivaId);
  const subactividadesIniciales = actividadActiva
    ? actividadActiva.subactividades.map(propsAFilaForm)
    : [];

  const handleAbrirModal = (idActividad: string, titulo: string) => {
    setActividadActivaId(idActividad);
    setActividadActivaTitulo(titulo);
    setModalAbierto(true);
  };

  const handleGuardarSincronizacion = async (filas: SubactividadFilaForm[]) => {
    if (!actividadActivaId) return;
    setEstaGuardando(true);
    try {
      const ok = await sincronizarSubactividades(actividadActivaId, filas);
      if (ok) {
        setModalAbierto(false);
      } else {
        alert('No se pudo guardar. Intenta de nuevo.');
      }
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
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span className="text-sm font-semibold text-yellow-800">Estado: En Borrador</span>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
            <span>+</span>
            Agregar Actividad
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {actividades.map((actividad, index) => (
          <TarjetaActividadPOA
            key={actividad.idActividad}
            {...actividad}
            consecutivoIndex={index}
            onAbrirModalSubactividades={handleAbrirModal}
          />
        ))}
      </div>

      <ModalSubactividades
        isOpen={modalAbierto}
        tituloActividadPadre={actividadActivaTitulo}
        subactividadesIniciales={subactividadesIniciales}
        sugerenciasBanco={sugerenciasSubactividades}
        estaGuardando={estaGuardando}
        onRegresarAFicha={() => setModalAbierto(false)}
        onGuardarSincronizacion={handleGuardarSincronizacion}
      />
    </div>
  );
}