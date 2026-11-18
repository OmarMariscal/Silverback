'use client';

import React from 'react';

interface MensajeDevolucionProps {
  mensaje: string;
}

export function MensajeDevolucion({ mensaje }: MensajeDevolucionProps) {
  return (
    <section
      role="alert"
      className="rounded-2xl border border-amber-300 bg-amber-50/90 p-5 text-amber-950 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-black uppercase tracking-wider text-amber-900">
            POA Devuelto con Observaciones de Jefatura
          </h3>
          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-amber-900/90">
            {mensaje}
          </p>
        </div>
      </div>
    </section>
  );
}