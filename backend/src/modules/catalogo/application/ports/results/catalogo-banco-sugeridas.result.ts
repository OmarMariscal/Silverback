import { TipoSubActividad } from "@domain/actividad/tipos-de-actividades.enum";

export interface ActividadSugeridaResult {
    id: string;
    descripcion: string;
    tipo_sugerido: TipoSubActividad;
}

export interface ActividadSugeridaDataResult {
    data: ActividadSugeridaResult[];
}