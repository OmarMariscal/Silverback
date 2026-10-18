/**
 * Regla de dominio: el avance global de una POA es el promedio simple del
 * avance de sus actividades, redondeado a 2 decimales.
 * Una POA sin actividades tiene 0% de avance.
 */
export function calcularAvanceGlobal(porcentajesActividades: number[]): number {
  if (porcentajesActividades.length === 0) {
    return 0;
  }

  const suma = porcentajesActividades.reduce((acc, valor) => acc + valor, 0);
  return Math.round((suma / porcentajesActividades.length) * 100) / 100;
}