'use client';

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import RoleShell from '@/modules/perfiles/role-shell';
import { useSubActividadEntregaStore } from '@/store/subactividades-entrega.store';

const RUTA_POA = '/contralor/poa';

const colorEstado: Record<string, string> = {
  red: 'border-red-200 bg-red-50 text-red-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  purple: 'border-purple-200 bg-purple-50 text-purple-700',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  slate: 'border-slate-200 bg-slate-100 text-slate-700',
};

type EstadoSolvencia = 'SOLVENTADA' | 'NO_SOLVENTADA' | 'PARCIALMENTE_SOLVENTADA';

function IconoArchivo({ nombre }: { nombre: string }) {
  const extension = nombre.split('.').pop()?.toLowerCase();
  const esPdf = extension === 'pdf';
  const esHojaCalculo = ['xls', 'xlsx'].includes(extension || '');
  const color = esPdf ? 'text-red-600 bg-red-50' : esHojaCalculo ? 'text-emerald-700 bg-emerald-50' : 'text-indigo-700 bg-indigo-50';

  return (
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`} aria-hidden="true">
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 3.75h6.5L19 9.25v11A1.75 1.75 0 0117.25 22h-10A1.75 1.75 0 015.5 20.25V5.5A1.75 1.75 0 017.25 3.75zM13 4v5.5h5.5" />
      </svg>
    </span>
  );
}

export default function EntregaSubactividadPage() {
  const { subActividadId } = useParams<{ subActividadId: string }>();
  const store = useSubActividadEntregaStore();
  const inicializarVista = useSubActividadEntregaStore((state) => state.inicializarVista);
  const [estaArrastrando, setEstaArrastrando] = useState(false);
  const inputArchivoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (subActividadId) void inicializarVista(subActividadId);
  }, [inicializarVista, subActividadId]);

  const vista = store.obtenerViewModelUI();
  const vistaPerteneceARuta = vista?.subActividadId === subActividadId;
  const estaCargando = !vistaPerteneceARuta || vista?.estaCargandoVista;

  const agregarArchivos = (files: FileList | File[]) => {
    if (!files.length) return;
    void store.agregarArchivosDropzone(Array.from(files));
  };

  const manejarSeleccionArchivo = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) agregarArchivos(event.currentTarget.files);
    event.currentTarget.value = '';
  };

  const manejarDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setEstaArrastrando(false);
    if (event.dataTransfer.files) agregarArchivos(event.dataTransfer.files);
  };

  if (estaCargando) {
    return (
      <RoleShell perfil="CONTRALOR" modulo="poa" title="Entrega de subactividad" subtitle="Cargando información de la entrega...">
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-20 text-sm font-semibold text-indigo-700 shadow-sm" role="status">
          Cargando información de la subactividad...
        </div>
      </RoleShell>
    );
  }
  
  if (!vista) {
    return (
      <RoleShell perfil="CONTRALOR" modulo="poa" title="Entrega de subactividad" subtitle="No fue posible consultar la entrega solicitada.">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800" role="alert">
          <p>{store.mensajeError || 'No se encontró información para esta subactividad.'}</p>
          <button
            type="button"
            onClick={() => void inicializarVista(subActividadId)}
            className="mt-4 rounded-lg bg-rose-700 px-4 py-2 font-semibold text-white transition hover:bg-rose-800"
          >
            Reintentar
          </button>
        </div>
      </RoleShell>
    );
  }

  const obtenerEstiloEstadoObs = (estado: EstadoSolvencia) => {
    switch (estado) {
      case 'SOLVENTADA': return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      case 'PARCIALMENTE_SOLVENTADA': return 'border-amber-200 bg-amber-50 text-amber-700';
      case 'NO_SOLVENTADA': return 'border-red-200 bg-red-50 text-red-700';
      default: return 'border-slate-200 bg-slate-100 text-slate-700';
    }
  };

  const obtenerTextoEstadoObs = (estado: EstadoSolvencia) => {
    switch (estado) {
      case 'SOLVENTADA': return 'Solventada';
      case 'PARCIALMENTE_SOLVENTADA': return 'Parcialmente Solventada';
      case 'NO_SOLVENTADA': return 'No Solventada';
      default: return 'Desconocido';
    }
  };

  const observaciones = vista.observacionesActivas

  return (
    <RoleShell
      perfil="CONTRALOR"
      modulo="poa"
      title="Entrega de subactividad"
      subtitle="Consulta el estado, atiende las observaciones y presenta las evidencias correspondientes."
    >
      <div className="space-y-6">
        <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
          <Link href={RUTA_POA} className="transition-colors hover:text-indigo-700">
            POA del centro
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-700">{vista.cabecera.breadcrumbs[1]?.etiqueta || 'Actividad'}</span>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="rounded-md bg-slate-100 px-2 py-1 text-slate-800">
            Subactividad {vista.cabecera.folio}
          </span>
        </nav>

        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Seguimiento de actividad</p>
              <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
                {vista.cabecera.titulo}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-700">
                  {vista.cabecera.folio}
                </span>
                <span className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-indigo-700">
                  {vista.cabecera.centroClave}
                </span>
                <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-700">
                  {vista.cabecera.versionTexto}
                </span>
                <span
                  className={`${vista.cabecera.semaforo?.claseBadge || 'bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide text-slate-700'}`}
                >
                  {vista.cabecera.semaforo?.etiqueta || 'Estado desconocido'}
                </span>
              </div>
            </div>
            <Link
              href={RUTA_POA}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Volver al POA
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            
            {/* SECCIÓN DE OBSERVACIONES DINÁMICAS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="mt-1 text-lg font-bold text-slate-900">Observaciones de la versión actual</h2>
                </div>
              </div>

              {/* Lista dinámica */}
              {observaciones.length === 0 ? (
                <div className="text-center py-8 text-slate-400 italic text-sm border-2 border-dashed border-slate-100 rounded-xl">
                  No hay observaciones registradas para esta subactividad.
                </div>
              ) : (
                <ul className="space-y-4">
                  {observaciones.map((observacion, index) => (
                    <li key={observacion.id} className="bg-white p-5 rounded-xl shadow-sm border border-blue-100">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-bold text-slate-800 text-sm bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                          {observacion.correlativo}
                        </span>
                        <span className={`bg-${observacion.colorBadge}-100 text-${observacion.colorBadge}-700 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase `}>
                          {observacion.estadoSolvenciaEtiqueta}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                        {observacion.descripcion}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* BUZÓN DE EVIDENCIAS GENERAL */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Buzón de evidencias de la entrega</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Adjunta la documentación correspondiente a esta subactividad.
                  </p>
                </div>
              </div>

              <div className="p-6">
                {vista.buzon.modo === 'CARGA' && (
                  <>
                    <input
                      ref={inputArchivoRef}
                      type="file"
                      multiple
                      accept=".pdf,.xls,.xlsx,.doc,.docx,.ppt,.pptx,.zip"
                      onChange={manejarSeleccionArchivo}
                      className="sr-only"
                    />
                    <div
                      onDragEnter={(e) => { e.preventDefault(); setEstaArrastrando(true); }}
                      onDragOver={(e) => e.preventDefault()}
                      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setEstaArrastrando(false); }}
                      onDrop={manejarDrop}
                      className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors sm:p-10 ${
                        estaArrastrando ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:border-indigo-300'
                      }`}
                    >
                      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white text-indigo-600 shadow-sm">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </span>
                      <p className="mt-4 text-sm font-bold text-slate-800">Arrastra tus evidencias o selecciónalas desde tu equipo</p>
                      <p className="mt-2 text-xs text-slate-500">PDF, Excel, Word, PowerPoint y ZIP · máximo 50 MB</p>
                      <button
                        type="button"
                        onClick={() => inputArchivoRef.current?.click()}
                        disabled={vista.buzon.estaEnviandoRevision}
                        className={`mt-5 rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-sm transition ${
                          !vista.buzon.estaEnviandoRevision
                            ? "bg-indigo-700 hover:bg-indigo-800"
                            : "bg-slate-700 hover:bg-slate-800"
                        }`}
                      >
                        Seleccionar archivos
                      </button>
                    </div>
                  </>
                )}

                {/* Lista dinámica de archivos subidos por el usuario */}
                {vista.buzon.archivos && vista.buzon.archivos.length > 0 ? (
                  <ul className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
                    {vista.buzon.archivos.map((archivo) => (
                      <li key={archivo.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <IconoArchivo nombre={archivo.nombreOriginal} />
                          <div className="min-w-0 flex-1">
                            <p className="break-all text-sm font-semibold text-slate-800">{archivo.nombreOriginal}</p>
                            <p className="mt-1 text-xs text-slate-500">{archivo.pesoFormateado} · Subido correctamente</p>
                          </div>
                        </div>
                        {!vista.buzon.estaEnviandoRevision &&vista.buzon.modo === 'CARGA' && (
                          <button
                            type="button"
                            onClick={() => void vista.buzon.onEliminarArchivo(archivo.id)}
                            disabled={vista.buzon.estaEnviandoRevision}
                            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-700 transition"
                            title="Eliminar evidencia"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 7h12m-10 0l.7 13h6.6L16 7m-6 3v6m4-6v6M9 7V4h6v3" />
                            </svg>
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                    Aún no hay evidencias adjuntas en el buzón.
                  </p>
                )}

                {/* Comentarios */}
                {vista.buzon.modo === 'CARGA' && (
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <label
                      htmlFor="comentarios-entrega"
                      className="block text-sm font-bold text-slate-800"
                    >
                      Comentarios de la entrega
                    </label>
                    <p className="mt-1 text-xs text-slate-500">
                      Explica brevemente las evidencias adjuntas o cómo solventaste las observaciones.
                    </p>
                    <textarea
                      id="comentarios-entrega"
                      rows={4}
                      value={vista.buzon.comentariosEntrega}
                      onChange={(e) => vista.buzon.onChangeComentarios(e.target.value)}
                      disabled={vista.buzon.estaEnviandoRevision}
                      placeholder="Escribe aquí tus comentarios para la Jefatura..."
                      className="mt-3 w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>
                )}
                {vista.buzon.modo !== 'CARGA' && vista.buzon.comentariosEntrega && (
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Comentarios enviados en esta entrega
                    </p>
                    <p className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                      {vista.buzon.comentariosEntrega}
                    </p>
                  </div>
                )}

                {vista.buzon.errorEnvioGeneral && (
                  <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">
                    {vista.buzon.errorEnvioGeneral}
                  </div>
                )}

                {vista.buzon.modo === 'CARGA' && (
                  <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
                    <button
                      type="button"
                      onClick={() => void vista.buzon.onConfirmarEnvioRevision()}
                      disabled={vista.buzon.estaEnviandoRevision}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-800"
                    >
                      {vista.buzon.estaEnviandoRevision ? 'Enviando a Jefatura...' : 'Enviar subactividad a Jefatura'}
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* DETALLES DE OPERACIÓN DINÁMICOS */}
          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Detalles de operación</h2>
              <dl className="mt-5 space-y-4">
                <div className="border-b border-slate-100 pb-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estado actual</dt>
                  <dd className={`mt-2 inline-flex rounded-lg border px-2.5 py-1 text-sm font-bold ${colorEstado[vista.detallesOperacion.estadoColor]}`}>
                    {vista.detallesOperacion.estadoActualTexto}
                  </dd>
                </div>
                <div className="border-b border-slate-100 pb-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Periodo de Ejecución</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-800">
                    {vista.detallesOperacion.periodoEjecucionTexto}
                  </dd>
                </div>
                <div className="border-b border-slate-100 pb-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Duración estimada</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-800">
                    {vista.detallesOperacion.duracionSemanasTexto}
                  </dd>
                </div>
                <div className="border-b border-slate-100 pb-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cierre Global del POA</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-800">
                    {vista.detallesOperacion.cierreGlobalPoaTexto}
                  </dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </div>
    </RoleShell>
  );
}