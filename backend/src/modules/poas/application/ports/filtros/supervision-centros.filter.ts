export interface FiltrosSupervisionCentros {
  /** usuario_id de la Jefa: solo ve los centros de los contralores que supervisa */
  jefaUsuarioId: string;
  /** Año fiscal considerado "vigente" para el resumen de cada centro */
  anioFiscal: number;
  /** Máximo de años históricos a devolver por centro */
  historicLimit: number;
}