interface Props {
  mensajePrincipal?: string;
  mensajeSecundario: string;
  onClickReintentar: () => void;
}

export default function BtnReintentar({
  mensajePrincipal,
  mensajeSecundario,
  onClickReintentar,
}: Props) {
  return (
    <div
      className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800"
      role="alert"
    >
      {mensajePrincipal && (
        <p className="mb-1 font-bold text-rose-900">{mensajePrincipal}</p>
      )}
      <p>{mensajeSecundario || 'Ocurrió un error inesperado.'}</p>
      <button
        type="button"
        onClick={() => void onClickReintentar()}
        className="mt-4 rounded-lg bg-rose-700 px-4 py-2 font-semibold text-white transition hover:bg-rose-800"
      >
        Reintentar
      </button>
    </div>
  );
}