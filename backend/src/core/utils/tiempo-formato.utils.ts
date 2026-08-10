export class TiempoFormatoUtil {
  // Instanciamos el formateador nativo en español
  // numeric: 'auto' convierte "-1" en "ayer" y "0" en "hoy" en lugar de "hace 1 día"
  private static readonly rtf = new Intl.RelativeTimeFormat('es', {
    numeric: 'auto',
  });

  public static tiempoTranscurrido(fecha: Date | null): string {
    if (!fecha) return 'Sin fecha registrada';

    const hoy = new Date();
    // Limpiamos las horas para medir días calendario exactos
    const fechaLimpiada = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
    );
    const hoyLimpiado = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
    );

    const difMs = fechaLimpiada.getTime() - hoyLimpiado.getTime();
    const difDias = Math.round(difMs / (1000 * 60 * 60 * 24));

    // Si difDias es -2, devolverá "hace 2 días"
    // Si difDias es 0, devolverá "hoy"
    // Si difDias es -1, devolverá "ayer"
    const textoRelativo = this.rtf.format(difDias, 'day');

    // Capitalizamos la primera letra para que se vea elegante en el UI
    return textoRelativo.charAt(0).toUpperCase() + textoRelativo.slice(1);
  }
}
