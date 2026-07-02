import { Injectable } from '@nestjs/common';
import { FichaTecnicaResponse } from './dto/response/actividades-ficha-tecnica-response.dto';
import { SubActividadesBulkResponse } from './dto/response/sub-actividades-bulk-response.dto';

@Injectable()
export class ActividadesService {
  getFichaTecnica(actUuid: string): FichaTecnicaResponse {
    return new FichaTecnicaResponse();
  }

  postSubActividadesBulk(actUuid: string): SubActividadesBulkResponse {
    return new SubActividadesBulkResponse();
  }
}
