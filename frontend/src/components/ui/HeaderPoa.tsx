'use client';

import { useLayoutStore } from '@/store/layout.store';

export function HeaderPOA() {
  const propsCabecera = useLayoutStore((state) => state.obtenerPropsCabecera());

  return (
    <header className="h-24 px-10 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 z-10 shadow-sm">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          {propsCabecera.tituloPantallaActual}
        </h1>
      </div>

      <div className="flex items-center space-x-6">
        <button
          onClick={propsCabecera.onAbrirBandejaMensajes}
          className="text-slate-400 hover:text-indigo-600 transition-colors relative"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          {propsCabecera.numeroMensajesSinLeer > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {propsCabecera.numeroMensajesSinLeer}
            </span>
          )}
        </button>

        <button
          onClick={propsCabecera.onAbrirBandejaNotificaciones}
          className="text-slate-400 hover:text-indigo-600 transition-colors relative"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          {propsCabecera.numeroNotificacionesSinLeer > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
              {propsCabecera.numeroNotificacionesSinLeer}
            </span>
          )}
        </button>

        <button
          onClick={propsCabecera.onClicPerfil}
          className="flex items-center space-x-3 pl-4 border-l border-slate-200 cursor-pointer group text-left"
        >
          <div className="flex flex-col items-end">
            <span className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
              {propsCabecera.nombreUsuario}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              {propsCabecera.cargoUsuario}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center">
            <svg className="w-7 h-7 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
        </button>
      </div>
    </header>
  );
}