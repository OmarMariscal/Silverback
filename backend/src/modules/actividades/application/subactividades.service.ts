import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { SubActividadesBulkResponse } from '../dto/response/sub-actividades-bulk.response.dto';
import { SubActividadesBulkRequest } from '../dto/request/sub-actividadedes-bulk.request.dto';
import { SubActividadesSyncResponse } from '../dto/response/sub-actividades-sync.response.dto';
import { SubActividadesProximasVencerResponse } from '../dto/response/sub-actividades-proximas-a-vencer-get.response.dto';
import { SubActividadesProximasAVencerQuery } from '../dto/request/sub-actividades-proximas-a-vencer.query.dto';
import { SubActividadesPoaResponse } from '../dto/response/sub-actividades-poa.response.dto';
import { SubActividadesSelectResponse } from '../dto/response/sub-actividades-select.response.dto';
import { PaginacionQueryDto } from '@core/common/dto/request/paginacion.query.dto';
import { SubActividadesSupervicionGetResponse } from '../dto/response/actividades-supervision-get.response.dto';
import { SubActividadesDirectorioQuery } from '../dto/request/actividades-directorio.query.dto';
import { SubActividadesDirectorioResponse } from '../dto/response/actividades-directorio.response.dto';
import { SubActividadesGetQuery } from '../dto/request/actividades-get.query.dto';
import { SubActividadesGetResponse } from '../dto/response/actividades-get.response.dto';

@Injectable()
export class SubactividadesService {
  constructor(private readonly prismaService: PrismaService) {}

  getSubActividadesSupervicion(
    queryPaginacion: PaginacionQueryDto,
  ): SubActividadesSupervicionGetResponse {
    return new SubActividadesSupervicionGetResponse();
  }

  getSubActividadesDirectorio(
    queryParams: SubActividadesDirectorioQuery,
  ): SubActividadesDirectorioResponse {
    return new SubActividadesDirectorioResponse();
  }

  getSubActividades(
    queryActividades: SubActividadesGetQuery,
  ): SubActividadesGetResponse {
    return new SubActividadesGetResponse();
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

  getSubActividadesProximasAVencer(
    limit: SubActividadesProximasAVencerQuery,
  ): SubActividadesProximasVencerResponse {
    return new SubActividadesProximasVencerResponse();
  }
}
