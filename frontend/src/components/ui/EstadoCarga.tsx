type VarianteAnimacion = 'spinner' | 'puntos' | 'barra' | 'skeleton';

interface Props {
  variante?: VarianteAnimacion;
  mensaje?: string;
}

export default function EstadoCarga({
  variante = 'spinner',
  mensaje = 'Cargando información...',
}: Props) {
  
  const renderizarAnimacion = () => {
    switch (variante) {
      case 'puntos':
        return (
          <div className="flex items-center space-x-2" aria-hidden="true">
            <span className="h-3 w-3 animate-bounce rounded-full bg-indigo-600 [animation-delay:-0.3s]" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-indigo-600 [animation-delay:-0.15s]" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-indigo-600" />
          </div>
        );

      case 'barra':
        return (
          <div className="h-2 w-48 overflow-hidden rounded-full bg-indigo-100" aria-hidden="true">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-indigo-600" />
          </div>
        );

      case 'skeleton':
        return (
          <div className="w-full max-w-md space-y-3" aria-hidden="true">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
          </div>
        );

      case 'spinner':
      default:
        return (
          <svg
            className="h-8 w-8 animate-spin text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm"
      role="status"
    >
      {renderizarAnimacion()}
      {mensaje && (
        <p className="text-sm font-semibold text-indigo-700">{mensaje}</p>
      )}
    </div>
  );
}