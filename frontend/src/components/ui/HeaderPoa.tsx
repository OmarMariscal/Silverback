'use client';

import { useLayoutStore } from '@/store/layout.store';

export function HeaderPOA() {
  const tituloPantallaActual = useLayoutStore((state) => state.tituloPantallaActual);
  const nombreUsuario = useLayoutStore((state) => state.nombreUsuario);
  const cargoUsuario = useLayoutStore((state) => state.cargoUsuario);
  const urlImagenPerfil = useLayoutStore((state) => state.urlImagenPerfil);

  const iniciales = nombreUsuario
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('');

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-10 py-5">
      <div>
        <h1 className="text-xl font-black tracking-tight text-slate-800">
          {tituloPantallaActual}
        </h1>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800">{nombreUsuario}</p>
          <p className="text-xs font-medium text-slate-500">{cargoUsuario}</p>
        </div>

        {urlImagenPerfil ? (
          <img
            src={urlImagenPerfil}
            alt={nombreUsuario}
            className="h-10 w-10 rounded-full border border-slate-200 object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-xs font-black text-indigo-700">
            {iniciales || 'US'}
          </div>
        )}
      </div>
    </header>
  );
}