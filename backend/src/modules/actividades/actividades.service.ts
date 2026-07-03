import { Injectable } from '@nestjs/common';
import { ActividadesResumenResponse } from './dto/response/actividades-resumen.response.dto';
import { SubActividadesBulkResponse } from './dto/response/sub-actividades-bulk.response.dto';
import { SubActividadesBulkRequest } from './dto/request/sub-actividadedes-bulk.request.dto';
import { SubActividadesSyncResponse } from './dto/response/sub-actividades-sync.response.dto';
import { ActividadesFichaTecnicaResponse } from './dto/response/actividades-ficha-tecnica.response.dto';
import { ActividadesPatchFichaTecnicaRequest } from './dto/request/actividades-path-ficha-tecnica.request.dto';

@Injectable()
export class ActividadesService {
  getResumen(actUuid: string): ActividadesResumenResponse {
    return new ActividadesResumenResponse();
  }

  postSubActividadesBulk(
    actUuid: string,
    bulkRequest: SubActividadesBulkRequest,
  ): SubActividadesBulkResponse {
    return new SubActividadesBulkResponse();
  }

  putSubActividadesSync(
    actUuid: string,
    subActividades: SubActividadesBulkRequest,
  ): SubActividadesSyncResponse {
    return new SubActividadesSyncResponse();
  }

  getFichaTecnica(actUuid: string): ActividadesFichaTecnicaResponse {
    return new ActividadesFichaTecnicaResponse();
  }
  patchFichaTecnica(
    actUuid: string,
    fichaTecnica: ActividadesPatchFichaTecnicaRequest,
  ): ActividadesFichaTecnicaResponse {
    return new ActividadesFichaTecnicaResponse();
  }
}
