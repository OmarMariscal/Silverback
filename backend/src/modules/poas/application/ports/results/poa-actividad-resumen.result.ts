export interface PoaActividadResumenResult {
  id: string;
  folio: string;
  titulo: string;
  porcentajeGlobal: number | null;
  esRezago: boolean;
  auditoresNombres: string[];
}
