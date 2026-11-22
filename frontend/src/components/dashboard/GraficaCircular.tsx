'use client';

interface Leyenda {
  etiqueta: string;
  cantidad: number | string;
  colorHex: string;
}

interface GraficaCircularProps {
  titulo: string;
  gradientStyle: string;
  totalCentral: number | string;
  subtituloCentral?: string;
  leyendas: Leyenda[];
  variante: 'grid' | 'lista'; // grid = 3 columnas (semaforo), lista = 2 columnas (flujo/dist)
}

export default function GraficaCircular({ titulo, gradientStyle, totalCentral, subtituloCentral, leyendas, variante }: GraficaCircularProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-slate-700">{titulo}</h3>
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative flex h-56 w-56 items-center justify-center rounded-full shadow-inner" style={{ background: gradientStyle }}>
          <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white shadow-sm">
            <span className="text-4xl font-black text-slate-800">{totalCentral}</span>
            {subtituloCentral && (
              <span className="mt-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">{subtituloCentral}</span>
            )}
          </div>
        </div>
        
        {variante === 'grid' ? (
          <div className="w-full mt-10 grid grid-cols-3 gap-2 text-center text-base">
            {leyendas.map((item) => (
              <div key={item.etiqueta} className="flex items-center justify-center px-2">
                <div>
                  <div className="flex items-center justify-center mb-2">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.colorHex }} />
                    <span className="font-bold text-slate-700">{item.cantidad}</span>
                  </div>
                  <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400">{item.etiqueta}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid w-full grid-cols-2 gap-x-4 gap-y-4 text-sm">
            {leyendas.map((item) => (
              <div key={item.etiqueta} className="flex items-center justify-between px-2">
                <div className="flex items-center">
                  <span className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: item.colorHex }} />
                  <span className="font-medium text-slate-600">{item.etiqueta}</span>
                </div>
                <span className="text-base font-bold text-slate-800">{item.cantidad}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}