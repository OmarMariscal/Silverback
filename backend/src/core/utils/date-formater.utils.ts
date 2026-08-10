export class DateFormatterUtil {
  /**
   * Formatea una fecha al estándar de la UI: "Ene 2026"
   */
  static toMesAnioCorto(fecha: Date | null | undefined): string {
    if (!fecha) return '-';

    const opciones: Intl.DateTimeFormatOptions = {
      month: 'short',
      year: 'numeric',
    };

    let formato = fecha.toLocaleString('es-ES', opciones);
    formato = formato.replace('.', '');

    return formato.charAt(0).toUpperCase() + formato.slice(1);
  }

  static toAnioMesDia(fecha: Date | null | undefined): string {
    if (!fecha) return '-';

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }
}
