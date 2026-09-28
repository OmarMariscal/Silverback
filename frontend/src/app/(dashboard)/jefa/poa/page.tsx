'use client';

import { useMemo, useState } from 'react';
import RoleShell from '@/modules/perfiles/role-shell';

type Filtro = 'Todos' | 'Por Autorizar' | 'Devueltas' | 'Autorizadas';

type Centro = {
  clave: string;
  nombre: string;
  responsable: string;
  estado: 'Dictamen pendiente' | 'Devuelto' | 'Autorizado';
  estadoDetalle: string;
  fecha: string;
  avance: number;
  historial: string[];
  color: string;
  textColor: string;
  borderColor: string;
  buttonText: string;
};

const centros: Centro[] = [
  {
    clave: 'CUCEI',
    nombre: 'Ciencias Exactas e Ingenierías',
    responsable: 'Mtro. Braulio Vicente',
    estado: 'Dictamen pendiente',
    estadoDetalle: 'En Revisión',
    fecha: 'Hoy, 09:30 AM',
    avance: 72,
    historial: ['2026', '2025', '2024'],
    color: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    buttonText: 'Inspeccionando ahora',
  },
  {
    clave: 'CUCS',
    nombre: 'Ciencias de la Salud',
    responsable: 'Dra. Elena Rostrova',
    estado: 'Devuelto',
    estadoDetalle: 'Devuelto (2 Obs)',
    fecha: 'Ayer, 04:15 PM',
    avance: 45,
    historial: ['2026', '2025'],
    color: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    buttonText: 'Cargar para Revisar',
  },
  {
    clave: 'CU Valles',
    nombre: 'Centro Univ. de los Valles',
    responsable: 'Lic. Carlos Mendoza',
    estado: 'Autorizado',
    estadoDetalle: 'Autorizado',
    fecha: '10 Ago 2026',
    avance: 68,
    historial: ['2026', '2025'],
    color: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    buttonText: 'Consultar POA Autorizado',
  },
];

const actividades = [
  {
    id: '05',
    titulo: 'Revisión de asistencia del Personal Académico',
    periodo: 'Ene 2026 — Dic 2026',
    avance: '50%',
    auditor: 'Lic. Auditor Auxiliar',
    justificacion: 'Confirmar la asistencia del personal docente a sus horas clase programadas. (Adaptación #15)',
    objetivoGeneral: 'Validar que el personal docente cumpla con la carga horaria estipulada en su contrato laboral vigente.',
    objetivosParticulares: ['Recorridos aleatorios en aulas.', 'Cruce de registros de checado biométrico.'],
    meta: 'poadisopadsif',
    indicadores: 'poadisopadsif',
    expanded: true,
  },
  {
    id: '06',
    titulo: 'Auditoría a Caja Chica #1',
    periodo: 'Ene 2026 — Dic 2026',
    avance: '50%',
    auditor: 'Mtro. Auditor Titular',
    justificacion: 'Verificar la correcta aplicación de fondos y comprobación documental.',
    objetivoGeneral: 'Asegurar que los recursos de caja chica se utilicen conforme a la normativa.',
    objetivosParticulares: ['Recorridos a oficinas administrativas.', 'Validación de comprobantes y fechas.'],
    meta: 'poadisopadsif',
    indicadores: 'poadisopadsif',
    expanded: false,
  },
];

const filtroCount: Record<Filtro, number> = {
  Todos: 15,
  'Por Autorizar': 3,
  Devueltas: 2,
  Autorizadas: 9,
};

export default function JefaPoaPage() {
  const [activeFilter, setActiveFilter] = useState<Filtro>('Todos');
  const [selectedCenter, setSelectedCenter] = useState('CUCEI');
  const [expandedActivity, setExpandedActivity] = useState<Record<string, boolean>>({
    '05': true,
    '06': false,
  });

  const visibleCenters = useMemo(() => {
    if (activeFilter === 'Todos') return centros;
    if (activeFilter === 'Por Autorizar') return centros.filter((centro) => centro.estado === 'Dictamen pendiente');
    if (activeFilter === 'Devueltas') return centros.filter((centro) => centro.estado === 'Devuelto');
    return centros.filter((centro) => centro.estado === 'Autorizado');
  }, [activeFilter]);

  const selected = visibleCenters.find((item) => item.clave === selectedCenter) ?? visibleCenters[0] ?? centros[0];

  return (
    <RoleShell
      perfil="JEFA"
      modulo="poa"
      title="POA de jefatura"
      subtitle="Visión consolidada de los POAs activos por centro universitario."
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {(['Todos', 'Por Autorizar', 'Devueltas', 'Autorizadas'] as Filtro[]).map((filtro) => (
              <button
                key={filtro}
                type="button"
                onClick={() => setActiveFilter(filtro)}
                className={[
                  'rounded-lg border px-3 py-1.5 text-xs font-bold transition-all',
                  activeFilter === filtro
                    ? 'border-slate-800 bg-slate-800 text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100',
                  filtro === 'Por Autorizar' && activeFilter !== filtro ? 'border-purple-200 bg-purple-50 text-purple-700' : '',
                  filtro === 'Devueltas' && activeFilter !== filtro ? 'border-amber-200 bg-amber-50 text-amber-700' : '',
                  filtro === 'Autorizadas' && activeFilter !== filtro ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : '',
                ].join(' ')}
              >
                {filtro === 'Todos' ? 'Todos' : filtro}
                <span className="ml-1.5">({filtroCount[filtro]})</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
              </svg>
              <input
                type="text"
                readOnly
                value=""
                placeholder="Buscar por centro o contralor..."
                className="w-64 rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <select
              defaultValue="2026"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
            >
              <option value="2026">Año POA: 2026</option>
              <option value="2025">Año POA: 2025</option>
            </select>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {visibleCenters.map((centro) => {
            const isSelected = selected?.clave === centro.clave;
            return (
              <button
                key={centro.clave}
                type="button"
                onClick={() => setSelectedCenter(centro.clave)}
                className={[
                  'w-full rounded-xl border p-5 text-left shadow-sm transition-all',
                  isSelected ? 'border-indigo-500 bg-white shadow-md' : 'border-slate-200 bg-white hover:border-slate-300',
                ].join(' ')}
              >
                <div className={[
                  'mb-3 rounded-md border px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em]',
                  centro.estado === 'Dictamen pendiente' ? 'border-purple-200 bg-purple-50 text-purple-700' : '',
                  centro.estado === 'Devuelto' ? 'border-amber-200 bg-amber-50 text-amber-700' : '',
                  centro.estado === 'Autorizado' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : '',
                ].join(' ')}>
                  {centro.estado === 'Dictamen pendiente' ? 'Dictamen pendiente' : centro.estado}
                </div>

                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Centro universitario</span>
                    <h3 className="mt-1 text-lg font-black text-slate-800">{centro.clave}</h3>
                    <p className="text-xs text-slate-500">{centro.nombre}</p>
                  </div>

                  {centro.estado === 'Autorizado' && (
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-600">Avance POA</span>
                      <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-lg font-black text-emerald-700">
                        {centro.avance}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                  <span className="block text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Contralor actual</span>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-700">{centro.responsable}</span>
                    <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-bold text-slate-500">Activo</span>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="mb-1 block text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Histórico</span>
                  <div className="flex flex-wrap gap-1.5">
                    {centro.historial.map((year) => (
                      <span
                        key={`${centro.clave}-${year}`}
                        className={[
                          'rounded border px-2 py-0.5 text-xs font-bold',
                          year === '2026'
                            ? centro.estado === 'Autorizado'
                              ? 'border-emerald-200 bg-emerald-100 text-emerald-800'
                              : centro.estado === 'Devuelto'
                                ? 'border-amber-200 bg-amber-100 text-amber-800'
                                : 'border-purple-200 bg-purple-100 text-purple-800'
                            : 'border-slate-200 bg-slate-50 text-slate-600',
                        ].join(' ')}
                      >
                        {year}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-slate-100 pt-3 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Estado POA 2026:</span>
                    <span className={[
                      'rounded border px-2 py-0.5 font-bold',
                      centro.estado === 'Dictamen pendiente' ? 'border-purple-200 bg-purple-50 text-purple-700' : '',
                      centro.estado === 'Devuelto' ? 'border-amber-200 bg-amber-50 text-amber-700' : '',
                      centro.estado === 'Autorizado' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : '',
                    ].join(' ')}>
                      {centro.estadoDetalle}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">
                      {centro.estado === 'Dictamen pendiente'
                        ? 'Recibido para dictamen:'
                        : centro.estado === 'Devuelto'
                          ? 'Devuelto el:'
                          : 'Autorizado el:'}
                    </span>
                    <span className="font-bold text-slate-700">{centro.fecha}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-xs font-bold text-slate-700">
                  {centro.buttonText}
                </div>
              </button>
            );
          })}
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 bg-slate-50/70 px-8 py-5 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <span className="rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-black text-white shadow-sm shadow-indigo-200">
                {selected.clave}
              </span>
              <div>
                <h2 className="text-lg font-extrabold text-slate-800">Plan Operativo Anual (POA 2026)</h2>
                <p className="text-xs text-slate-500">
                  Contralor responsable: <strong className="text-slate-700">{selected.responsable}</strong> • {actividades.length} Actividades Totales
                </p>
              </div>
            </div>

            <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
              <span className="mr-2 h-2 w-2 rounded-full bg-purple-500" />
              ESTADO: EN REVISIÓN DE JEFA
            </div>
          </div>

          <div className="space-y-6 p-8">
            {actividades.map((actividad) => {
              const isOpen = expandedActivity[actividad.id] ?? actividad.expanded;

              return (
                <div
                  key={actividad.id}
                  className={[
                    'overflow-hidden rounded-2xl border bg-white shadow-sm transition-all',
                    isOpen ? 'border-indigo-100' : 'border-slate-200 hover:border-slate-300',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50/50 p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-3.5 py-2 text-center">
                        <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-400">Folio</span>
                        <span className="text-lg font-black leading-none text-indigo-700">{actividad.id}</span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-800">{actividad.titulo}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                          <span className="flex items-center gap-1">
                            <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
                            </svg>
                            {actividad.periodo}
                          </span>
                          <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-bold text-slate-700">
                            Avance: {actividad.avance}
                          </span>
                          <span>
                            Auditores: <strong className="text-slate-700">{actividad.auditor}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedActivity((prev) => ({ ...prev, [actividad.id]: !isOpen }))}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                    >
                      <svg className={['h-5 w-5 transition-transform', isOpen ? 'rotate-180' : ''].join(' ')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {isOpen && (
                    <div className="space-y-6 p-6">
                      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
                        <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ficha técnica de la actividad</span>
                        <div className="grid gap-6 md:grid-cols-3">
                          <div>
                            <span className="mb-1 block font-bold text-slate-700">Justificación</span>
                            <p className="text-sm leading-relaxed text-slate-500">{actividad.justificacion}</p>
                          </div>
                          <div>
                            <span className="mb-1 block font-bold text-slate-700">Objetivo General</span>
                            <p className="text-sm leading-relaxed text-slate-500">{actividad.objetivoGeneral}</p>
                          </div>
                          <div>
                            <span className="mb-1 block font-bold text-slate-700">Objetivos Particulares</span>
                            <ul className="space-y-1 text-sm leading-relaxed text-slate-500">
                              {actividad.objetivosParticulares.map((item) => (
                                <li key={item}>- {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-6 grid gap-6 border-t border-slate-200 pt-5 md:grid-cols-2">
                          <div>
                            <span className="mb-1 block font-bold text-slate-700">Meta del Proyecto</span>
                            <p className="text-sm text-slate-500">{actividad.meta}</p>
                          </div>
                          <div>
                            <span className="mb-1 block font-bold text-slate-700">Indicadores</span>
                            <p className="text-sm text-slate-500">{actividad.indicadores}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Sub-actividades específicas</span>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-slate-200">
                          <table className="w-full border-collapse text-left text-xs">
                            <thead className="bg-slate-50">
                              <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Descripción de tarea</th>
                                <th className="px-4 py-3">Fechas programadas</th>
                                <th className="px-4 py-3">Duración</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {[
                                { id: '1.1', desc: 'Recolección de firmas en bitácoras físicas de departamento', fechas: 'Abr 21 — Jul 20', duracion: '13 sem' },
                                { id: '1.2', desc: 'Cruce contra nómina y reportes de incidencias RH', fechas: 'Feb 10 — Sep 30', duracion: '33 sem' },
                              ].map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/70">
                                  <td className="px-4 py-3 font-bold text-slate-700">{item.id}</td>
                                  <td className="px-4 py-3 font-semibold text-slate-800">{item.desc}</td>
                                  <td className="px-4 py-3 text-slate-500">
                                    <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                                      {item.fechas}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="rounded border border-indigo-100 bg-indigo-50 px-2 py-0.5 font-bold text-indigo-700">
                                      {item.duracion}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-900 px-8 py-4 text-white sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/20 text-amber-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-slate-300">
                Dictamen para <strong className="font-bold text-white">{selected.clave}</strong> (POA 2026). Revisa los objetivos antes de confirmar.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/20">
                Devolver con Observaciones
              </button>
              <button type="button" className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 transition hover:bg-emerald-500">
                Autorizar POA 2026
              </button>
            </div>
          </div>
        </section>
      </div>
    </RoleShell>
  );
}
