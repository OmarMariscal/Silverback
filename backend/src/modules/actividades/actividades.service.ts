import { Injectable } from '@nestjs/common';
import { ActividadesResumenResponse } from './dto/response/actividades-resumen.response.dto';
import { SubActividadesBulkResponse } from './dto/response/sub-actividades-bulk.response.dto';
import { SubActividadesBulkRequest } from './dto/request/sub-actividadedes-bulk.request.dto';
import { SubActividadesSyncResponse } from './dto/response/sub-actividades-sync.response.dto';
import { ActividadesFichaTecnicaResponse } from './dto/response/actividades-ficha-tecnica.response.dto';
import { ActividadesPatchFichaTecnicaRequest } from './dto/request/actividades-path-ficha-tecnica.request.dto';
import { SubActividadesProximasVencerResponse } from './dto/response/sub-actividades-proximas-a-vencer-get.response.dto';
import { SubActividadesProximasAVencerQuery } from './dto/request/sub-actividades-proximas-a-vencer.query.dto';
import { PaginacionQueryDto } from '@core/common/dto/request/paginacion.query.dto';
import { ActividadesSupervicionGetResponse } from './dto/response/actividades-supervision-get.response.dto';
import { ActividadesDirectorioQuery } from './dto/request/actividades-directorio.query.dto';
import { ActividadesDirectorioResponse } from './dto/response/actividades-directorio.response.dto';
import { ActividadesGetQuery } from './dto/request/actividades-get.query.dto';
import { ActividadesGetResponse } from './dto/response/actividades-get.response.dto';
import { SubActividadesPoaResponse } from './dto/response/sub-actividades-poa.response.dto';
import { SubActividadesSelectResponse } from './dto/response/sub-actividades-select.response.dto';
import { EliminacionCorrecta } from '@core/common/dto/response/deleted.response.dto';
import { JwtPayloadDto } from '@core/auth/dto/jwt-payload.dto';

@Injectable()
export class ActividadesService {
  getResumen(actUuid: string): ActividadesResumenResponse {
    return new ActividadesResumenResponse();
  }

  getSubActividadesPoa(actividadId: string): SubActividadesPoaResponse {
    return new SubActividadesPoaResponse();
  }

  getSubActividadesSelect(actividadId: string): SubActividadesSelectResponse {
    return new SubActividadesSelectResponse();
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

  getFichaTecnica(
    usuarioActual: JwtPayloadDto,
    actUuid: string,
  ): ActividadesFichaTecnicaResponse {
    console.log(usuarioActual.rol);
    return new ActividadesFichaTecnicaResponse();
  }

  patchFichaTecnica(
    actUuid: string,
    fichaTecnica: ActividadesPatchFichaTecnicaRequest,
  ): ActividadesFichaTecnicaResponse {
    return new ActividadesFichaTecnicaResponse();
  }

  getSubActividadesProximasAVencer(
    limit: SubActividadesProximasAVencerQuery,
  ): SubActividadesProximasVencerResponse {
    return new SubActividadesProximasVencerResponse();
  }

  getActividadesSupervicion(
    queryPaginacion: PaginacionQueryDto,
  ): ActividadesSupervicionGetResponse {
    return new ActividadesSupervicionGetResponse();
  }
  getActividadesDirectorio(
    queryParams: ActividadesDirectorioQuery,
  ): ActividadesDirectorioResponse {
    return new ActividadesDirectorioResponse();
  }

  getActividades(
    queryActividades: ActividadesGetQuery,
  ): ActividadesGetResponse {
    return new ActividadesGetResponse();
  }

  deleteActividad(actividadId: string): EliminacionCorrecta {
    return new EliminacionCorrecta();
  }
}
