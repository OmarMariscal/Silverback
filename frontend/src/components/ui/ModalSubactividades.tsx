// ModalSubactividades.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
  PantallaSubactividadesProps,
  SubactividadFilaForm,
} from '@/types/poa-contratos';

// Este modal implementa EXACTAMENTE el contrato "PantallaSubactividadesProps"
// definido en poa-contratos.ts (nada de props nuevas del lado de datos).
// La única prop que se agrega aquí es "isOpen", que es puramente de UI
// (mostrar/ocultar el modal) y no forma parte del contrato de datos.
interface ModalSubactividadesProps extends PantallaSubactividadesProps {
  isOpen: boolean;
}

// Estructura interna para poder pintar en UNA sola lista tanto las
// sugerencias que vienen del banco, como las sub-actividades que la
// actividad principal YA tenía guardadas. Así, si una sub-actividad ya
// agregada no existe en el catálogo del banco (ej. fue creada a mano),
// de todos modos aparece en el checklist con su casilla activa.
interface OpcionVisible {
  idSugerencia: string;
  descripcion: string;
  tipoSugerido: SubactividadFilaForm['tipo'];
  esDelBanco: boolean;
}

const calcularSemanas = (fechaInicio: string, fechaTermino: string) => {
  if (!fechaInicio || !fechaTermino) return null;
  const inicio = new Date(`${fechaInicio}T00:00:00`);
  const termino = new Date(`${fechaTermino}T00:00:00`);
  const diferencia = termino.getTime() - inicio.getTime();
  if (diferencia < 0) return null;
  return Math.max(1, Math.ceil((diferencia / 86400000 + 1) / 7));
};

const crearSeleccionInicial = (subactividades: SubactividadFilaForm[]) =>
  Object.fromEntries(
    subactividades.map((sub) => [sub.idBackend || sub.idUiTemporal, { ...sub }]),
  );

export function ModalSubactividades({
  isOpen,
  tituloActividadPadre,
  subactividadesIniciales = [],
  sugerenciasBanco = [],
  estaGuardando,
  onGuardarSincronizacion,
  onRegresarAFicha,
}: ModalSubactividadesProps) {
  const [busqueda, setBusqueda] = useState('');
  const [seleccionadas, setSeleccionadas] = useState<Record<string, SubactividadFilaForm>>(
    () => crearSeleccionInicial(subactividadesIniciales),
  );
  const [manualesDisponibles, setManualesDisponibles] = useState<SubactividadFilaForm[]>(
    () => subactividadesIniciales.filter((sub) => !sub.idBancoSugerencia),
  );
  const [expandidaId, setExpandidaId] = useState<string | null>(null);
  const [errorValidacion, setErrorValidacion] = useState('');

  // idClave -> dato original. Sirve para "restaurar" fechas/tipo si el
  // usuario desmarca y vuelve a marcar la misma sub-actividad.
  const originalesPorId = useMemo(() => {
    const mapa: Record<string, SubactividadFilaForm> = {};
    subactividadesIniciales.forEach((sub) => {
      const idClave = sub.idBackend || sub.idUiTemporal;
      mapa[idClave] = sub;
    });
    return mapa;
  }, [subactividadesIniciales]);

  // Unimos: (1) todo lo que ofrece el banco de sugerencias, y (2) las
  // sub-actividades que la actividad ya tenía y que NO están en el banco
  // (personalizadas). El resultado es "esto es lo que tienes" + catálogo.
  const opcionesVisibles = useMemo<OpcionVisible[]>(() => {
    const delBanco: OpcionVisible[] = sugerenciasBanco.map((o) => ({
      idSugerencia: o.idSugerencia,
      descripcion: o.descripcion,
      tipoSugerido: o.tipoSugerido,
      esDelBanco: true,
    }));

    return delBanco;
  }, [sugerenciasBanco]);

  // Al abrir el modal, todo lo que ya tenía la actividad principal se
  // precarga como "seleccionado" -> su checkbox nace activo.
  if (!isOpen) return null;

  const opcionesFiltradas = opcionesVisibles.filter((opcion) =>
    opcion.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleSeleccion = (opcion: OpcionVisible) => {
    setSeleccionadas((prev) => {
      const nuevo = { ...prev };
      if (nuevo[opcion.idSugerencia]) {
        delete nuevo[opcion.idSugerencia];
        if (expandidaId === opcion.idSugerencia) setExpandidaId(null);
      } else {
        const original = originalesPorId[opcion.idSugerencia];
        nuevo[opcion.idSugerencia] = original
          ? { ...original }
          : {
              idUiTemporal: opcion.idSugerencia,
              idBancoSugerencia: opcion.esDelBanco ? opcion.idSugerencia : undefined,
              descripcionTarea: opcion.descripcion,
              fechaInicio: '',
              fechaTermino: '',
              tipo: opcion.tipoSugerido,
            };
        setExpandidaId(opcion.idSugerencia);
      }
      return nuevo;
    });
  };

  const actualizar = (id: string, cambios: Partial<SubactividadFilaForm>) => {
    setSeleccionadas((prev) => ({ ...prev, [id]: { ...prev[id], ...cambios } }));
    setErrorValidacion('');
  };

  const alternarSeleccion = (id: string, opcion?: OpcionVisible) => {
    setSeleccionadas((prev) => {
      if (prev[id]) {
        const siguiente = { ...prev };
        delete siguiente[id];
        return siguiente;
      }
      if (!opcion) return prev;
      return {
        ...prev,
        [id]: {
          idUiTemporal: id,
          idBancoSugerencia: id,
          descripcionTarea: opcion.descripcion,
          fechaInicio: '',
          fechaTermino: '',
          tipo: opcion.tipoSugerido,
        },
      };
    });
    setExpandidaId((actual) => actual === id ? null : id);
    setErrorValidacion('');
  };

  const validarFila = (fila: SubactividadFilaForm) => {
    if (!fila.descripcionTarea.trim()) return 'Ingresa la descripción de cada sub-actividad.';
    if (!fila.fechaInicio || !fila.fechaTermino) return 'Completa las fechas de cada sub-actividad.';
    if (fila.fechaTermino < fila.fechaInicio) return 'La fecha final no puede ser anterior a la fecha inicial.';
    return '';
  };

  const guardarConfiguracion = (id: string) => {
    const fila = seleccionadas[id];
    if (!fila) return;
    const error = validarFila(fila);
    if (error) {
      setErrorValidacion(error);
      return;
    }
    setErrorValidacion('');
    setExpandidaId(null);
  };

  const finalizar = () => {
    const filas = Object.values(seleccionadas);
    const error = filas.length === 0
      ? 'Selecciona al menos una sub-actividad.'
      : filas.map(validarFila).find(Boolean) || '';
    if (error) {
      setErrorValidacion(error);
      const incompleta = filas.find((fila) => validarFila(fila));
      if (incompleta) setExpandidaId(incompleta.idBackend || incompleta.idUiTemporal);
      return;
    }
    setErrorValidacion('');
    onGuardarSincronizacion(filas);
  };

  const agregarManual = () => {
    const idUiTemporal = `manual-${Date.now()}`;
    setSeleccionadas((prev) => ({
      ...prev,
      [idUiTemporal]: {
        idUiTemporal,
        descripcionTarea: '',
        fechaInicio: '',
        fechaTermino: '',
        tipo: 'REVISION',
      },
    }));
    setManualesDisponibles((prev) => [...prev, {
      idUiTemporal,
      descripcionTarea: '',
      fechaInicio: '',
      fechaTermino: '',
      tipo: 'REVISION',
    }]);
    setExpandidaId(idUiTemporal);
  };

  const deseleccionarManual = (id: string) => {
    setSeleccionadas((prev) => {
      const siguiente = { ...prev };
      delete siguiente[id];
      return siguiente;
    });
    if (expandidaId === id) setExpandidaId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans text-slate-800">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        <div className="px-8 pt-8 pb-5 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Añadir Sub-actividades a:</h2>
            <h3 className="text-2xl font-bold text-slate-900 leading-tight">{tituloActividadPadre}</h3>
          </div>
          <button
            onClick={onRegresarAFicha}
            disabled={estaGuardando}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-8 py-4 bg-slate-50/80 border-b border-slate-100 sticky top-[88px] z-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-shadow placeholder-slate-400 text-slate-700"
              placeholder="Buscar cualquier sub-actividad por palabra clave..."
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-8 bg-slate-50">
          <button type="button" onClick={agregarManual} className="mb-4 flex w-full items-center justify-center rounded-xl border-2 border-dashed border-indigo-200 bg-white px-4 py-3 text-sm font-bold text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-50">
            <span className="mr-2 text-xl font-light">+</span> Crear Sub-actividad manual
          </button>
          <div className="space-y-3">

            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Sub-actividades del banco</p>
            {opcionesFiltradas.map((opcion) => {
              const estaSeleccionada = !!seleccionadas[opcion.idSugerencia];
              const estaExpandida = expandidaId === opcion.idSugerencia;
              const config = seleccionadas[opcion.idSugerencia];

              if (estaSeleccionada && estaExpandida) {
                return (
                  <div key={opcion.idSugerencia} className="bg-white border border-indigo-200 rounded-xl shadow-md overflow-hidden transition-all ring-4 ring-indigo-50">
                    <div className="p-4 flex items-start bg-indigo-50/30 cursor-pointer" onClick={() => toggleSeleccion(opcion)}>
                      <div className="flex-shrink-0 pt-0.5">
                        <input type="checkbox" checked readOnly className="w-5 h-5 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer" />
                      </div>
                      <div className="ml-4 flex-1">
                        <input
                          value={config.descripcionTarea}
                          onChange={(e) => actualizar(opcion.idSugerencia, { descripcionTarea: e.target.value })}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Ingrese el título de la sub-actividad"
                          className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                        />
                        {!opcion.esDelBanco && (
                          <span className="inline-block mt-1 text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Ya agregada
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-5 bg-white border-t border-indigo-100">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-end">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Fecha Inicio (YYYY-MM-DD)</label>
                          <input
                            type="date"
                            value={config.fechaInicio}
                            onChange={(e) => setSeleccionadas((prev) => ({ ...prev, [opcion.idSugerencia]: { ...prev[opcion.idSugerencia], fechaInicio: e.target.value } }))}
                            className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Fecha Final (YYYY-MM-DD)</label>
                          <input
                            type="date"
                            value={config.fechaTermino}
                            onChange={(e) => setSeleccionadas((prev) => ({ ...prev, [opcion.idSugerencia]: { ...prev[opcion.idSugerencia], fechaTermino: e.target.value } }))}
                            className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Tipo de actividad</label>
                          <select value={config.tipo} onChange={(e) => actualizar(opcion.idSugerencia, { tipo: e.target.value as SubactividadFilaForm['tipo'] })} className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option value="AUDITORIA">Auditoría</option>
                            <option value="REVISION">Revisión</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Semanas totales</label>
                          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-indigo-700">{calcularSemanas(config.fechaInicio, config.fechaTermino) ? `${calcularSemanas(config.fechaInicio, config.fechaTermino)} semanas` : '-- calculando...'}</div>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => guardarConfiguracion(opcion.idSugerencia)}
                          className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-5 py-2 rounded-lg text-sm font-bold transition-colors flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                          Guardar configuración
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              if (estaSeleccionada && !estaExpandida) {
                return (
                  <div key={opcion.idSugerencia} className="bg-white border-2 border-indigo-500 rounded-xl p-4 shadow-sm transition-all flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <input type="checkbox" checked onChange={() => alternarSeleccion(opcion.idSugerencia)} className="w-5 h-5 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer" />
                    </div>
                    <div className="ml-4 flex-1">
                        <p className="text-sm font-semibold text-slate-800">{config.descripcionTarea}</p>
                      <div className="mt-2 flex items-center space-x-4 text-xs font-medium text-slate-500">
                        {!opcion.esDelBanco && (
                          <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Ya agregada
                          </span>
                        )}
                        {config.fechaInicio && config.fechaTermino && (
                          <span className="flex items-center text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {config.fechaInicio} a {config.fechaTermino} · {calcularSemanas(config.fechaInicio, config.fechaTermino)} semanas
                          </span>
                        )}
                        <button onClick={() => setExpandidaId(opcion.idSugerencia)} className="text-indigo-600 hover:text-indigo-800 underline ml-auto">
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={opcion.idSugerencia}
                  onClick={() => toggleSeleccion(opcion)}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-all flex items-start cursor-pointer group"
                >
                  <div className="flex-shrink-0 pt-0.5">
                    <input type="checkbox" checked={false} readOnly className="w-5 h-5 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer pointer-events-none" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">{opcion.descripcion}</p>
                  </div>
                </div>
              );
            })}

            <p className="mb-3 mt-8 text-xs font-bold uppercase tracking-widest text-slate-500">Sub-actividades nuevas</p>
            {manualesDisponibles.map((fila) => {
              const id = fila.idBackend || fila.idUiTemporal;
              const estaSeleccionada = !!seleccionadas[id];
              const filaActual = seleccionadas[id] || fila;
              if (!estaSeleccionada) {
                return (
                  <div key={id} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <input type="checkbox" checked={false} onChange={() => setSeleccionadas((prev) => ({ ...prev, [id]: { ...fila } }))} className="mt-0.5 h-5 w-5 accent-indigo-600" />
                    <span className="text-sm text-slate-600">{fila.descripcionTarea || 'Ingrese el título de la sub-actividad'}</span>
                  </div>
                );
              }
              if (expandidaId !== id) {
                return (
                  <div key={id} className="flex items-start gap-3 rounded-xl border-2 border-indigo-500 bg-white p-4 shadow-sm">
                    <input type="checkbox" checked onChange={() => deseleccionarManual(id)} className="mt-0.5 h-5 w-5 accent-indigo-600" />
                    <button type="button" onClick={() => setExpandidaId(id)} className="min-w-0 flex-1 text-left">
                      <span className="block text-sm font-semibold text-slate-800">{filaActual.descripcionTarea || 'Ingrese el título de la sub-actividad'}</span>
                    </button>
                    <button type="button" onClick={() => setExpandidaId(id)} className="text-xs font-bold text-indigo-600 underline">Editar</button>
                  </div>
                );
              }
              const semanas = calcularSemanas(filaActual.fechaInicio, filaActual.fechaTermino);
              return (
                <div key={id} className="bg-white border-2 border-indigo-500 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" checked onChange={() => deseleccionarManual(id)} className="w-5 h-5 mt-0.5 accent-indigo-600" />
                    <div className="flex-1 space-y-3">
                      <input value={filaActual.descripcionTarea} onChange={(e) => actualizar(id, { descripcionTarea: e.target.value })} placeholder="Ingrese el título de la sub-actividad" className="w-full bg-transparent text-sm font-semibold text-slate-800 border-b border-slate-200 px-1 py-2 focus:border-indigo-500 focus:outline-none" />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <input type="date" value={filaActual.fechaInicio} onChange={(e) => actualizar(id, { fechaInicio: e.target.value })} className="w-full text-sm border border-slate-300 rounded-lg px-2 py-2" />
                        <input type="date" value={filaActual.fechaTermino} min={filaActual.fechaInicio || undefined} onChange={(e) => actualizar(id, { fechaTermino: e.target.value })} className="w-full text-sm border border-slate-300 rounded-lg px-2 py-2" />
                        <select value={filaActual.tipo} onChange={(e) => actualizar(id, { tipo: e.target.value as SubactividadFilaForm['tipo'] })} className="w-full text-sm border border-slate-300 rounded-lg px-2 py-2"><option value="AUDITORIA">Auditoría</option><option value="REVISION">Revisión</option></select>
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-sm text-indigo-700">{semanas ? `${semanas} semanas` : '-- calculando...'}</div>
                      </div>
                      <div className="flex justify-end"><button type="button" onClick={() => guardarConfiguracion(id)} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-lg text-xs font-bold">Guardar configuración</button></div>
                    </div>
                  </div>
                </div>
              );
            })}

            {opcionesFiltradas.length === 0 && (
              <div className="text-center py-10 text-sm text-slate-400 italic">
                No se encontraron sub-actividades con ese criterio de búsqueda.
              </div>
            )}
            {errorValidacion && (
              <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">
                {errorValidacion}
              </p>
            )}
          </div>
        </div>

        <div className="px-8 py-5 border-t border-slate-200 bg-white flex justify-between items-center sticky bottom-0 z-10">
          <span className="text-sm text-slate-500 font-medium">
            <strong className="text-indigo-600">{Object.keys(seleccionadas).length}</strong> sub-actividades configuradas
          </span>
          <div className="flex space-x-4">
            <button
              onClick={onRegresarAFicha}
              disabled={estaGuardando}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={finalizar}
              disabled={estaGuardando}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-indigo-200 transition-all flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {estaGuardando ? (
                <>
                  <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  Guardar y Finalizar
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
