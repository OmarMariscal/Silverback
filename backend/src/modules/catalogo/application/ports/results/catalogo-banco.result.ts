import { TipoSubActividad } from "@domain/actividad/tipos-de-actividades.enum";

export interface BancoActividadesResult {
    id: string;
    tipo: TipoSubActividad;
    titulo: string;
    descripcion_corta: string;
}

export interface BancoActividadesDataResult {
    data: BancoActividadesResult[];
}