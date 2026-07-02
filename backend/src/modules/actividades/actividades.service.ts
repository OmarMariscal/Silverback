import { Injectable } from '@nestjs/common';
import { FichaTecnicaResponse } from './dto/response/actividades-ficha-tecnica.response.dto';
import { SubActividadesBulkResponse } from './dto/response/sub-actividades-bulk.response.dto';
import { SubActividadesBulkRequest } from './dto/request/sub-actividadedes-bulk.request.dto';

@Injectable()
export class ActividadesService {
  getFichaTecnica(actUuid: string): FichaTecnicaResponse {
    return new FichaTecnicaResponse();
  }

  postSubActividadesBulk(actUuid: string, bulkRequest: SubActividadesBulkRequest): SubActividadesBulkResponse {
    return new SubActividadesBulkResponse();
  }
}
