'use client';
import { useLayoutStore } from '@/store/layout.store';

export function HeaderPOA() {
  // ✅ Extraemos los textos (strings) uno por uno. 
  // Al ser strings, React sabe que no han cambiado y no entra en bucle.
  const tituloPantallaActual = useLayoutStore((state) => state.tituloPantallaActual);
  const nombreUsuario = useLayoutStore((state) => state.nombreUsuario);
  const cargoUsuario = useLayoutStore((state) => state.cargoUsuario);
  const urlImagenPerfil = useLayoutStore((state) => state.urlImagenPerfil);

  return (
    <header className="h-24 px-10 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 z-10 shadow-sm">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          {tituloPantallaActual}
        </h1>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
          <div className="flex flex-col items-end">
            <span className="text-base font-bold text-slate-800">
              {nombreUsuario || 'Usuario'}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              {cargoUsuario || 'Cargo'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center">
            {urlImagenPerfil ? (
              <div
                role="img"
                aria-label="Imagen de perfil"
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url("${urlImagenPerfil}")` }}
              />
            ) : (
              <svg className="w-7 h-7 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}