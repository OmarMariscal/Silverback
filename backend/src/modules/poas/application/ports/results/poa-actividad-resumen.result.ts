export interface PoaActividadResumenResult {
  id: string;
  folio: string;
  titulo: string;
  porcentaje_global: number;
  es_rezagado: boolean;
  auditores_nombres: { nombre_completo: string }[];
}
