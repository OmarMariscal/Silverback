import { DistribucionDto } from "@modules/dashboard/dto/response/dashboard-rezago-distribucion.dto";

export interface RezagoResult {
  centro_id: string;
  centro_clave: string;
  centro_nombre: string;
  distribucion: DistribucionDto;
}

export interface RezagoDataResult {
  data: RezagoResult[];
}