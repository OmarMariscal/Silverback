'use client';

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import {
  EXTENSIONES_PERMITIDAS_LABEL,
  type BuzonEvidenciasProps,
} from '@/types/subactividades-contratos';

function IconoArchivo({ nombre }: { nombre: string }) {
  const extension = nombre.split('.').pop()?.toLowerCase();
  const esPdf = extension === 'pdf';
  const esHojaCalculo = ['xls', 'xlsx'].includes(extension || '');
  const color = esPdf
    ? 'bg-red-50 text-red-600'
    : esHojaCalculo
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-indigo-50 text-indigo-700';

  return (
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`} aria-hidden="true">
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 3.75h6.5L19 9.25v11A1.75 1.75 0 0117.25 22h-10A1.75 1.75 0 015.5 20.25V5.5A1.75 1.75 0 017.25 3.75zM13 4v5.5h5.5" />
      </svg>
    </span>
  );
}

export default function BuzonArchivosEvidencia({
  modo,
  archivos,
  comentariosEntrega,
  estaEnviandoRevision,
  errorEnvioGeneral,
  onArchivosSeleccionados,
  onEliminarArchivo,
  onChangeComentarios,
  onConfirmarEnvioRevision,
}: BuzonEvidenciasProps) {
  const [estaArrastrando, setEstaArrastrando] = useState(false);
  const inputArchivoRef = useRef<HTMLInputElement>(null);

  if (modo === 'OCULTO') return null;

  const procesarArchivos = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onArchivosSeleccionados(Array.from(files));
  };

  const manejarSeleccionInput = (event: ChangeEvent<HTMLInputElement>) => {
    procesarArchivos(event.currentTarget.files);
    event.currentTarget.value = '';
  };

  const manejarDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setEstaArrastrando(false);
    procesarArchivos(event.dataTransfer.files);
  };

  const haySubidasEnCurso = archivos.some(
    (a) => a.estadoCarga === 'SUBIENDO_S3' || a.estadoCarga === 'CONFIRMANDO' || a.estadoCarga === 'SOLICITANDO_FIRMA',
  );

  return (
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
        {modo === 'CARGA' && (
          <>
            <input
              ref={inputArchivoRef}
              type="file"
              multiple
              accept=".pdf,.xls,.xlsx,.doc,.docx,.ppt,.pptx,.zip"
              onChange={manejarSeleccionInput}
              className="sr-only"
            />
            <div
              onDragEnter={(e) => {
                e.preventDefault();
                setEstaArrastrando(true);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setEstaArrastrando(false);
              }}
              onDrop={manejarDrop}
              className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors sm:p-10 ${
                estaArrastrando
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-300 bg-slate-50 hover:border-indigo-300'
              }`}
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white text-indigo-600 shadow-sm">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </span>
              <p className="mt-4 text-sm font-bold text-slate-800">
                Arrastra tus evidencias o selecciónalas desde tu equipo
              </p>
              <p className="mt-2 text-xs text-slate-500">{EXTENSIONES_PERMITIDAS_LABEL}</p>
              <button
                type="button"
                disabled={estaEnviandoRevision}
                onClick={() => inputArchivoRef.current?.click()}
                className="mt-5 rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Seleccionar archivos
              </button>
            </div>
          </>
        )}

        {archivos.length > 0 ? (
          <ul className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
            {archivos.map((archivo) => {
              const esError = archivo.estadoCarga === 'ERROR_CARGA';
              const estaSubiendo =
                archivo.estadoCarga === 'SUBIENDO_S3' ||
                archivo.estadoCarga === 'CONFIRMANDO' ||
                archivo.estadoCarga === 'SOLICITANDO_FIRMA';

              return (
                <li key={archivo.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <IconoArchivo nombre={archivo.nombreOriginal} />
                    <div className="min-w-0 flex-1">
                      <p className="break-all text-sm font-semibold text-slate-800">{archivo.nombreOriginal}</p>

                      {esError ? (
                        <p className="mt-1 text-xs font-medium text-rose-600">
                          {archivo.mensajeError || 'Error al subir el archivo.'}
                        </p>
                      ) : estaSubiendo ? (
                        <div className="mt-1.5 space-y-1">
                          <div className="flex justify-between text-xs text-indigo-700">
                            <span>
                              {archivo.estadoCarga === 'CONFIRMANDO' ? 'Confirmando registro...' : 'Subiendo evidencia...'}
                            </span>
                            <span className="font-bold">{archivo.progresoPorcentaje}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-indigo-100">
                            <div
                              className="h-full bg-indigo-600 transition-all duration-200"
                              style={{ width: `${archivo.progresoPorcentaje}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 text-xs text-slate-500">
                          {archivo.pesoFormateado} · Listo en borrador
                        </p>
                      )}
                    </div>
                  </div>

                  {modo === 'CARGA' && !estaSubiendo && (
                    <button
                      type="button"
                      disabled={estaEnviandoRevision}
                      onClick={() => void onEliminarArchivo(archivo.id)}
                      className="self-end rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50 sm:self-center disabled:cursor-not-allowed"
                      title="Eliminar evidencia"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 7h12m-10 0l.7 13h6.6L16 7m-6 3v6m4-6v6M9 7V4h6v3 " />
                      </svg>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-5 rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
            Aún no hay evidencias adjuntas en el buzón.
          </p>
        )}

        {modo === 'CARGA' ? (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <label htmlFor="comentarios-entrega" className="block text-sm font-bold text-slate-800">
              Comentarios de la entrega
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Explica brevemente las evidencias adjuntas o cómo solventaste las observaciones.
            </p>
            <textarea
              id="comentarios-entrega"
              rows={4}
              value={comentariosEntrega}
              onChange={(e) => onChangeComentarios(e.target.value)}
              disabled={estaEnviandoRevision}
              placeholder="Escribe aquí tus comentarios para la Jefatura..."
              className="mt-3 w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>
        ) : (
          comentariosEntrega && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Comentarios enviados en esta entrega
              </p>
              <p className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                {comentariosEntrega}
              </p>
            </div>
          )
        )}

        {errorEnvioGeneral && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">
            {errorEnvioGeneral}
          </div>
        )}

        {modo === 'CARGA' && (
          <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
            <button
              type="button"
              disabled={estaEnviandoRevision || haySubidasEnCurso}
              onClick={() => void onConfirmarEnvioRevision()}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {estaEnviandoRevision
                ? 'Enviando a Jefatura...'
                : haySubidasEnCurso
                  ? 'Esperando subida de archivos...'
                  : 'Enviar subactividad a Jefatura'}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}