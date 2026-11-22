'use client';

interface PaginacionActividadesProps {
  paginaActual: number;
  totalPaginas: number;
  totalRegistros: number;
  cantidadEnPagina: number;
  limite: number;
  onCambiarPagina: (pagina: number) => void;
}

export function PaginacionActividades({
  paginaActual,
  totalPaginas,
  totalRegistros,
  cantidadEnPagina,
  limite,
  onCambiarPagina,
}: PaginacionActividadesProps) {
  const totalReal = totalRegistros || cantidadEnPagina;
  const inicio = cantidadEnPagina > 0 ? (paginaActual - 1) * limite + 1 : 0;
  const fin =
    cantidadEnPagina > 0
      ? Math.min(paginaActual * limite, totalReal)
      : 0;
  const maxPaginas = Math.max(1, totalPaginas);

  return (
    <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-white px-6 py-4 text-sm text-slate-500 sm:flex-row">
      <span>
        Mostrando <strong className="font-bold text-slate-700">{inicio}</strong> a{' '}
        <strong className="font-bold text-slate-700">{fin}</strong> de{' '}
        <strong className="font-bold text-slate-700">{totalReal}</strong>{' '}
        resultados totales
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onCambiarPagina(Math.max(1, paginaActual - 1))}
          disabled={paginaActual <= 1}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => onCambiarPagina(Math.min(maxPaginas, paginaActual + 1))}
          disabled={paginaActual >= maxPaginas}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        >
          Siguiente
        </button>
      </div>
    </footer>
  );
}